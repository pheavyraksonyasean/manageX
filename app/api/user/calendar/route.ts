import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyJWT } from "@/lib/jwt";

// GET - Get calendar data with task counts and color levels by date
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

    // Get month and year from query params, default to current month
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth(); // Convert 1-based to 0-based
    const targetYear = year ? parseInt(year) : now.getFullYear();

    // Get first and last day of the month
    const firstDay = new Date(targetYear, targetMonth, 1);
    const lastDay = new Date(targetYear, targetMonth + 1, 0);

    // Fetch all tasks for the user in this month
    const tasks = await Task.find({
      userId: decoded.userId,
      dueDate: {
        $gte: firstDay,
        $lte: lastDay,
      },
    })
      .select("dueDate status priority category title")
      .lean();

    // Group tasks by date
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
      // Use local date to avoid timezone shifts
      const taskDate = new Date(task.dueDate);
      const year = taskDate.getFullYear();
      const month = String(taskDate.getMonth() + 1).padStart(2, "0");
      const day = String(taskDate.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`; // YYYY-MM-DD in local timezone

      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = {
          date: dateKey,
          count: 0,
          level: "low",
          color: "#10b981", // Default green
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

    // Calculate levels and colors based on task count
    Object.keys(tasksByDate).forEach((dateKey) => {
      const count = tasksByDate[dateKey].count;

      if (count <= 2) {
        tasksByDate[dateKey].level = "low";
        tasksByDate[dateKey].color = "#10b981"; // Green - few tasks
      } else if (count <= 5) {
        tasksByDate[dateKey].level = "medium";
        tasksByDate[dateKey].color = "#f59e0b"; // Amber - moderate tasks
      } else {
        tasksByDate[dateKey].level = "high";
        tasksByDate[dateKey].color = "#ef4444"; // Red - many tasks
      }
    });

    // Convert to array and sort by date
    const calendarData = Object.values(tasksByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Calculate summary statistics
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
      // Also return full list for easy lookup by frontend
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
