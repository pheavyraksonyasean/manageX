import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Task from "@/models/Task";
import { verifyJWT } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // Optional filter by role
    const search = searchParams.get("search"); // Optional search by name/email

    // Build query
    let query: any = {};
    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch all users
    const users = await User.find(query)
      .select("_id name email role createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Get task count for each user
    const usersWithTaskCount = await Promise.all(
      users.map(async (user) => {
        const tasksCount = await Task.countDocuments({ userId: user._id });
        return {
          id: user._id.toString(),
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          tasksCount,
          createdAt: user.createdAt,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      users: usersWithTaskCount,
      totalUsers: usersWithTaskCount.length,
      regularUsers: usersWithTaskCount.filter((u) => u.role === "user").length,
      adminUsers: usersWithTaskCount.filter((u) => u.role === "admin").length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
