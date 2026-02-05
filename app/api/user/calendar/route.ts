import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyJWT } from "@/lib/jwt";

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

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const firstDay = new Date(targetYear, targetMonth, 1);
    const lastDay = new Date(targetYear, targetMonth + 1, 0);
    const tasks = await Task.find({
      userId: decoded.userId,
      dueDate: {
        $gte: firstDay,
        $lte: lastDay,
      },
    })
      .select("dueDate status priority category title")
      .lean();

    const tasksByDate: Record<
      string,
      {
        date: string;
        count: number;
        level: "low" | "medium" | "high";
        color: string;
        tasks: Array<{
          id: string;
          title: string;
          status: string;
          priority: string;
          category: string;
        }>;
      }
    > = {};

    tasks.forEach((task) => {
      const taskDate = new Date(task.dueDate);
      const year = taskDate.getFullYear();
      const month = String(taskDate.getMonth() + 1).padStart(2, "0");
      const day = String(taskDate.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = {
          date: dateKey,
          count: 0,
          level: "low",
          color: "#10b981",
          tasks: [],
        };
      }

      tasksByDate[dateKey].count++;
      tasksByDate[dateKey].tasks.push({
        id: task._id.toString(),
        title: task.title,
        status: task.status,
        priority: task.priority,
        category: task.category,
      });
    });

    Object.keys(tasksByDate).forEach((dateKey) => {
      const count = tasksByDate[dateKey].count;

      if (count <= 2) {
        tasksByDate[dateKey].level = "low";
        tasksByDate[dateKey].color = "#10b981";
      } else if (count <= 5) {
        tasksByDate[dateKey].level = "medium";
        tasksByDate[dateKey].color = "#f59e0b";
      } else {
        tasksByDate[dateKey].level = "high";
        tasksByDate[dateKey].color = "#ef4444";
      }
    });

    const calendarData = Object.values(tasksByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const pendingTasks = totalTasks - completedTasks;
    const daysWithTasks = Object.keys(tasksByDate).length;

    return NextResponse.json({
      success: true,
      month: targetMonth,
      year: targetYear,
      totalTasks,
      completedTasks,
      pendingTasks,
      daysWithTasks,
      calendarData,

      tasksByDate,
    });
  } catch (error: any) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch calendar data" },
      { status: 500 },
    );
  }
}
