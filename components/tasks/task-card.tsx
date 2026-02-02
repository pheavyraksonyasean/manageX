"use client";

import { Calendar, Pencil, Trash2 } from "lucide-react";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in progress" | "completed";
  category: string;
  dueDate: string;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isAdminView?: boolean;
}

const priorityColors = {
  low: "bg-green-500/20 text-green-500",
  medium: "bg-yellow-500/20 text-yellow-500",
  high: "bg-red-500/20 text-red-500",
};

const statusColors = {
  todo: "bg-muted text-muted-foreground",
  "in progress": "bg-yellow-500/20 text-yellow-500",
  completed: "bg-primary/20 text-primary",
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  isAdminView = false,
}: TaskCardProps) {
  return (
    <div className="bg-secondary/40 rounded-xl p-5 border border-border hover:border-muted-foreground flex flex-col transition-colors">
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {task.title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}
        >
          {task.status}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {task.category}
        </span>
      </div>

      {/* Due Date */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
        <Calendar className="w-4 h-4" />
        <span>{task.dueDate}</span>
      </div>

      {/* Actions */}
      {isAdminView ? (
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onDelete?.(task.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 text-red-500 py-2.5 px-4 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      ) : (
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onEdit?.(task)}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete?.(task.id)}
            className="p-2.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
