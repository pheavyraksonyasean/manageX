import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import dbConnect from "@/lib/mongodb";
import { sendVerificationOTP } from "@/lib/email";
import { generateOTP, getOTPExpiry } from "@/lib/token-utils";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 },
      );
    }

    const existingToken = await VerificationToken.findOne({
      email: email.toLowerCase(),
    });

    if (existingToken) {
      const timeSinceCreation = Date.now() - existingToken.createdAt.getTime();
      const cooldownPeriod = 30000;

      if (timeSinceCreation < cooldownPeriod) {
        const remainingSeconds = Math.ceil(
          (cooldownPeriod - timeSinceCreation) / 1000,
        );
        return NextResponse.json(
          {
            error: `Please wait ${remainingSeconds} seconds before requesting a new code`,
          },
          { status: 429 },
        );
      }
    }

    await VerificationToken.deleteMany({ email: email.toLowerCase() });

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry(1);

    const tokenDoc = new VerificationToken({
      email: email.toLowerCase(),
      otp: otp,
      expires: otpExpiry,
      attempts: 0,
    });

    await tokenDoc.save();

    const emailResult = await sendVerificationOTP(email, otp, user.name);

    return NextResponse.json(
      {
        message: emailResult.devMode
          ? "New OTP sent! Check console (email not configured)."
          : "New verification code sent to your email.",
        devMode: emailResult.devMode,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification code" },
      { status: 500 },
    );
  }
}
