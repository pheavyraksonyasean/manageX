import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AdminNotification from "@/models/AdminNotification";
import User from "@/models/User";
import { verifyJWT } from "@/lib/jwt";

// GET - Get all admin notifications
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    await dbConnect();

    // Verify admin role
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const isRead = searchParams.get("isRead");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build query
    const query: any = {};
    if (type) query.type = type;
    if (isRead !== null && isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    // Fetch notifications
    const notifications = await AdminNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Get counts
    const totalCount = await AdminNotification.countDocuments({});
    const unreadCount = await AdminNotification.countDocuments({
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      notifications: notifications.map((notif) => ({
        id: notif._id.toString(),
        type: notif.type,
        userId: notif.userId.toString(),
        userName: notif.userName,
        userEmail: notif.userEmail,
        message: notif.message,
        isRead: notif.isRead,
        metadata: notif.metadata,
        createdAt: notif.createdAt,
      })),
      totalCount,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error fetching admin notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
