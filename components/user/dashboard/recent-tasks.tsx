"use client";

import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in progress" | "completed";
  dueDate: string;
}

export function RecentTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentTasks();
  }, []);

  const fetchRecentTasks = async () => {
    try {
      const response = await fetch("/api/user/dashboard/stats");
      const data = await response.json();

      if (response.ok) {
        setTasks(data.recentTasks || []);
      } else {
        console.error("Failed to fetch recent tasks:", data.error);
      }
    } catch (error) {
      console.error("Error fetching recent tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-500";
      case "medium":
        return "bg-yellow-500/20 text-yellow-500";
      case "low":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary/20 text-primary";
      case "in progress":
        return "bg-yellow-500/20 text-yellow-500";
      case "todo":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="border border-border rounded-xl p-6 bg-secondary/40">
      <h3 className="text-lg font-semibold mb-6">Recent Tasks</h3>
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-secondary/60 rounded-lg p-4 animate-pulse"
            >
              <div className="h-12"></div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No tasks yet. Create your first task!
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-secondary/60 rounded-lg p-4 flex items-center justify-between hover:bg-secondary/80 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">{task.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
