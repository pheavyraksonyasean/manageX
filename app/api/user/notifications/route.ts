import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import Task from "@/models/Task";
import { verifyJWT } from "@/lib/jwt";

// GET - Fetch all notifications for the authenticated user
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

    // Generate notifications for overdue and upcoming tasks
    await generateNotifications(decoded.userId);

    // Fetch all notifications for the user
    const notifications = await Notification.find({ userId: decoded.userId })
      .populate("taskId")
      .sort({ createdAt: -1 })
      .lean();

    const formattedNotifications = notifications
      .filter((notif) => notif.taskId) // Only include notifications with valid tasks
      .map((notif) => ({
        id: notif._id.toString(),
        type: notif.type,
        title: notif.title,
        message: notif.message,
        isRead: notif.isRead,
        priority: notif.priority,
        taskId: (notif.taskId as any)._id.toString(),
        taskTitle: (notif.taskId as any).title,
        taskDueDate: (notif.taskId as any).dueDate,
        taskStatus: (notif.taskId as any).status,
        createdAt: notif.createdAt,
      }));

    return NextResponse.json({
      success: true,
      notifications: formattedNotifications,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

// Helper function to generate notifications based on task due dates
async function generateNotifications(userId: string) {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Get all incomplete tasks for the user
    const tasks = await Task.find({
      userId,
      status: { $ne: "completed" },
    }).lean();

    for (const task of tasks) {
      const taskDueDate = new Date(task.dueDate);
      const taskDateOnly = new Date(
        taskDueDate.getFullYear(),
        taskDueDate.getMonth(),
        taskDueDate.getDate(),
      );

      let notificationType: "overdue" | "due_today" | "due_soon" | null = null;
      let notificationTitle = "";
      let notificationMessage = "";
      let priority: "low" | "medium" | "high" = "medium";

      // Check if task is overdue
      if (taskDateOnly < today) {
        notificationType = "overdue";
        notificationTitle = "Task Overdue";
        notificationMessage = `Task "${task.title}" is overdue. Consider completing or deleting it.`;
        priority = "high";
      }
      // Check if task is due today
      else if (taskDateOnly.getTime() === today.getTime()) {
        notificationType = "due_today";
        notificationTitle = "Task Due Today";
        notificationMessage = `Task "${task.title}" is due today!`;
        priority = "high";
      }
      // Check if task is due within 3 days
      else if (taskDateOnly < threeDaysFromNow) {
        notificationType = "due_soon";
        notificationTitle = "Task Due Soon";
        const daysUntilDue = Math.ceil(
          (taskDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        notificationMessage = `Task "${task.title}" is due in ${daysUntilDue} day${daysUntilDue > 1 ? "s" : ""}.`;
        priority = "medium";
      }

      // Create notification if needed and doesn't already exist
      if (notificationType) {
        const existingNotification = await Notification.findOne({
          userId,
          taskId: task._id,
          type: notificationType,
        });

        if (!existingNotification) {
          await Notification.create({
            userId,
            taskId: task._id,
            type: notificationType,
            title: notificationTitle,
            message: notificationMessage,
            priority,
            isRead: false,
          });
        }
      }
    }

    // Clean up notifications for completed or deleted tasks
    const validTaskIds = tasks.map((t) => t._id);
    await Notification.deleteMany({
      userId,
      taskId: { $nin: validTaskIds },
    });
  } catch (error) {
    console.error("Error generating notifications:", error);
  }
}
