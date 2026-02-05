import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import { verifyJWT } from "@/lib/jwt";

// GET /api/admin/tasks - Get all tasks from all users (admin only)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user is admin
    await dbConnect();
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    // Get all tasks from all users
    const tasks = await Task.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Format tasks for frontend
    const formattedTasks = tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      user: task.userId
        ? {
            name: (task.userId as any).name,
            email: (task.userId as any).email,
          }
        : null,
    }));

    return NextResponse.json(
      { success: true, tasks: formattedTasks },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get all tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}
