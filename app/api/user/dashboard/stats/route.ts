import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyJWT } from "@/lib/jwt";

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

    await dbConnect();

    const tasks = await Task.find({ userId: decoded.userId }).lean();
    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === "in progress",
    ).length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completed",
    ).length;
    const now = new Date();
    const overdueTasks = tasks.filter(
      (task) => task.status !== "completed" && new Date(task.dueDate) < now,
    ).length;

    const priorityStats = {
      high: tasks.filter((task) => task.priority === "high").length,
      medium: tasks.filter((task) => task.priority === "medium").length,
      low: tasks.filter((task) => task.priority === "low").length,
    };

    const statusStats = {
      todo: tasks.filter((task) => task.status === "todo").length,
      inProgress: tasks.filter((task) => task.status === "in progress").length,
      completed: completedTasks,
    };

    const recentTasks = tasks
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5)
      .map((task) => ({
        id: task._id.toString(),
        title: task.title,
        category: task.category,
        priority: task.priority,
        status: task.status,
        dueDate: new Date(task.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }));

    return NextResponse.json(
      {
        stats: {
          totalTasks,
          inProgressTasks,
          completedTasks,
          overdueTasks,
        },
        priorityStats,
        statusStats,
        recentTasks,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}
