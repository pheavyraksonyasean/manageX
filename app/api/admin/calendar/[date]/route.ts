import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import { verifyJWT } from "@/lib/jwt";

// GET - Get all tasks for a specific date (admin - all users)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> },
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

    // Verify admin role
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }

    const { date } = await params; // Format: YYYY-MM-DD

    // Parse the date string to avoid timezone issues
    const [yearStr, monthStr, dayStr] = date.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1; // JS months are 0-based
    const day = parseInt(dayStr);

    const startOfDay = new Date(year, month, day, 0, 0, 0);
    const endOfDay = new Date(year, month, day, 23, 59, 59);

    // Fetch tasks for this specific date from all users
    const tasks = await Task.find({
      dueDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("userId", "name email")
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    // Format tasks with user information
    const formattedTasks = tasks.map((task: any) => ({
      _id: task._id.toString(),
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      user: {
        id: task.userId._id.toString(),
        name: task.userId.name,
        email: task.userId.email,
      },
    }));

    // Calculate task level for this date
    const count = tasks.length;
    let level: "low" | "medium" | "high" = "low";
    let color = "#10b981";

    if (count <= 2) {
      level = "low";
      color = "#10b981"; // Green
    } else if (count <= 5) {
      level = "medium";
      color = "#f59e0b"; // Amber
    } else {
      level = "high";
      color = "#ef4444"; // Red
    }

    return NextResponse.json({
      success: true,
      date,
      count,
      level,
      color,
      tasks: formattedTasks,
    });
  } catch (error: any) {
    console.error("Error fetching admin date tasks:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tasks for date" },
      { status: 500 },
    );
  }
}
