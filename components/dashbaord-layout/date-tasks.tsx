"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface DateTasksProps {
  date: Date | null;
  userRole?: "admin" | "user";
}

const priorityColors = {
  low: "bg-green-500",
  medium: "bg-amber-500",
  high: "bg-red-500",
};

export function DateTasks({ date, userRole = "user" }: DateTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setTasks([]);
      return;
    }

    const fetchDateTasks = async () => {
      setLoading(true);
      try {
        const dateStr = format(date, "yyyy-MM-dd");
        const apiPath =
          userRole === "admin" ? "/api/admin/calendar" : "/api/user/calendar";
        const response = await fetch(`${apiPath}/${dateStr}`);
        const data = await response.json();

        if (data.success) {
          setTasks(data.tasks || []);
        }
      } catch (error) {
        console.error("Failed to fetch date tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDateTasks();
  }, [date, userRole]);

  if (!date) return null;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {format(date, "MMM d, yyyy")}
        </span>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground/60 pl-5">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-xs text-muted-foreground/60 pl-5">No tasks</p>
      ) : (
        <div className="space-y-1.5 pl-1">
          {tasks.slice(0, 3).map((task) => (
            <div key={task._id} className="flex flex-col gap-0.5 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${priorityColors[task.priority]}`}
                />
                <span className="text-foreground truncate flex-1">
                  {task.title}
                </span>
              </div>
              {userRole === "admin" && task.user && (
                <span className="text-muted-foreground/70 text-[10px] pl-3.5 truncate">
                  {task.user.name}
                </span>
              )}
            </div>
          ))}
          {tasks.length > 3 && (
            <p className="text-xs text-muted-foreground pl-3.5">
              +{tasks.length - 3} more
            </p>
          )}
        </div>
      )}
    </div>
  );
}
