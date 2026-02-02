import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    console.log("Testing MongoDB connection...");
    const db = await dbConnect();
    console.log("MongoDB connected successfully!");
    console.log("Connection state:", db.conn?.readyState);

    const users = await User.find();
    console.log("Users found:", users.length);

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
      connectionState: db.conn?.readyState,
      usersCount: users.length,
      users,
    });
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        details: error.toString(),
      },
      { status: 500 },
    );
  }
}
