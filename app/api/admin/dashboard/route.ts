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

    // Fetch all tasks
    const tasks = await Task.find().lean();

    // Calculate task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "in progress",
    ).length;
    const todoTasks = tasks.filter((t) => t.status === "todo").length;
    const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;

    // Calculate overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter((t) => {
      if (t.status === "completed") return false;
      return new Date(t.dueDate) < now;
    }).length;

    // Fetch user statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: "admin" });
    const regularUsers = await User.countDocuments({ role: "user" });

    // Task status distribution for bar chart
    const tasksByStatus = {
      todo: todoTasks,
      inProgress: inProgressTasks,
      completed: completedTasks,
    };

    // Task priority distribution
    const tasksByPriority = {
      low: tasks.filter((t) => t.priority === "low").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      high: highPriorityTasks,
    };

    // Recent users (last 5)
    const recentUsers = await User.find()
      .select("_id name email role emoji emojiBackground createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formattedRecentUsers = recentUsers.map((user) => ({
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      emoji: user.emoji,
      emojiBackground: user.emojiBackground,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        highPriorityTasks,
        overdueTasks,
        totalUsers,
        adminUsers,
        regularUsers,
        completionRate:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      tasksByStatus,
      tasksByPriority,
      recentUsers: formattedRecentUsers,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
