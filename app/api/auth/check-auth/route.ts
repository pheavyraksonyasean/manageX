import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = verifyJWT(token);

    if (!decoded) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select(
      "-password -emailVerificationToken -resetPasswordToken",
    );

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          emoji: user.emoji,
          emojiBackground: user.emojiBackground,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
