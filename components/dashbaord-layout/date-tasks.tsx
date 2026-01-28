"use client";

import { format, isSameDay, parseISO } from "date-fns";
import { Calendar } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority?: "low" | "medium" | "high";
}

interface DateTasksProps {
  date: Date | null;
  tasks: Task[];
}

const priorityColors = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export function DateTasks({ date, tasks }: DateTasksProps) {
  if (!date) return null;

  const dateTasks = tasks.filter((task) => {
    try {
      // Try parsing different date formats
      let taskDate: Date;
      if (task.dueDate.includes(",")) {
        // Format: "Jan 30, 2026"
        taskDate = new Date(task.dueDate);
      } else {
        taskDate = parseISO(task.dueDate);
      }
      return isSameDay(taskDate, date);
    } catch {
      return false;
    }
  });

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {format(date, "MMM d, yyyy")}
        </span>
      </div>

      {dateTasks.length === 0 ? (
        <p className="text-xs text-muted-foreground/60 pl-5">No tasks</p>
      ) : (
        <div className="space-y-1.5 pl-1">
          {dateTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center gap-2 text-xs">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  task.priority ? priorityColors[task.priority] : "bg-primary"
                }`}
              />
              <span className="text-foreground truncate flex-1">
                {task.title}
              </span>
            </div>
          ))}
          {dateTasks.length > 3 && (
            <p className="text-xs text-muted-foreground pl-3.5">
              +{dateTasks.length - 3} more
            </p>
          )}
        </div>
      )}
    </div>
  );
}
