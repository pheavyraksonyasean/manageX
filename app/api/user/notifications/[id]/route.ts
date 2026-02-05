import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import Task from "@/models/Task";
import { verifyJWT } from "@/lib/jwt";

// DELETE - Delete a notification and optionally delete the associated task
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const { deleteTask } = await req
      .json()
      .catch(() => ({ deleteTask: false }));

    // Find the notification and ensure it belongs to the user
    const notification = await Notification.findOne({
      _id: id,
      userId: decoded.userId,
    });

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 },
      );
    }

    // If deleteTask is true, also delete the associated task
    if (deleteTask && notification.taskId) {
      await Task.findOneAndDelete({
        _id: notification.taskId,
        userId: decoded.userId,
      });
    }

    // Delete the notification
    await Notification.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: deleteTask
        ? "Notification and task deleted successfully"
        : "Notification deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete notification" },
      { status: 500 },
    );
  }
}

// PATCH - Mark notification as read/unread
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const { isRead } = await req.json();

    // Find and update the notification
    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        userId: decoded.userId,
      },
      { isRead },
      { new: true },
    );

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification updated successfully",
      notification: {
        id: notification._id.toString(),
        isRead: notification.isRead,
      },
    });
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notification" },
      { status: 500 },
    );
  }
}
