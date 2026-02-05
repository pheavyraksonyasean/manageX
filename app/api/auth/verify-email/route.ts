import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import dbConnect from "@/lib/mongodb";
import { signJWT } from "@/lib/jwt";

const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format. Must be 6 digits." },
        { status: 400 },
      );
    }

    const verificationTokenDoc = await VerificationToken.findOne({
      email: email.toLowerCase(),
    });

    if (!verificationTokenDoc) {
      return NextResponse.json(
        { error: "No verification request found. Please sign up again." },
        { status: 400 },
      );
    }

    if (new Date() > verificationTokenDoc.expires) {
      await VerificationToken.deleteOne({ email: email.toLowerCase() });
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 },
      );
    }

    if (verificationTokenDoc.attempts >= MAX_ATTEMPTS) {
      await VerificationToken.deleteOne({ email: email.toLowerCase() });
      return NextResponse.json(
        {
          error:
            "Maximum verification attempts exceeded. Please sign up again.",
        },
        { status: 400 },
      );
    }

    if (verificationTokenDoc.otp !== otp) {
      verificationTokenDoc.attempts += 1;
      await verificationTokenDoc.save();

      const attemptsLeft = MAX_ATTEMPTS - verificationTokenDoc.attempts;
      return NextResponse.json(
        {
          error: `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} remaining.`,
        },
        { status: 400 },
      );
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await VerificationToken.deleteOne({ email: email.toLowerCase() });

    const token = signJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "Email verified successfully! Redirecting to dashboard...",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 },
    );
  }
}
