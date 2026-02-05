import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import AdminNotification from "@/models/AdminNotification";
import dbConnect from "@/lib/mongodb";
import { sendVerificationOTP } from "@/lib/email";
import { generateOTP, getOTPExpiry } from "@/lib/token-utils";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password, confirmPassword } = await request.json();

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry(1);

    await VerificationToken.deleteMany({ email: email.toLowerCase() });

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: false,
    });

    await user.save();

    await AdminNotification.create({
      type: "user_registration",
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      message: `New user registered: ${user.name} (${user.email})`,
      metadata: {
        registeredAt: new Date(),
      },
    });

    const tokenDoc = new VerificationToken({
      email: email.toLowerCase(),
      otp: otp,
      expires: otpExpiry,
      attempts: 0,
    });

    await tokenDoc.save();

    const emailResult = await sendVerificationOTP(email, otp, name);

    return NextResponse.json(
      {
        message: emailResult.devMode
          ? "Signup successful! Check console for OTP (email not configured)."
          : "Signup successful! Check your email for verification code.",
        email,
        devMode: emailResult.devMode,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 },
    );
  }
}
