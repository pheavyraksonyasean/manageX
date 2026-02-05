"use client";

import { AlertCircle, Clock, Trash2, Check, Circle } from "lucide-react";

export interface OverdueTask {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in progress" | "completed";
  category: string;
  dueDate: string;
  daysOverdue: number;
  taskId?: string;
}

interface NotificationCardProps {
  task: OverdueTask;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, task: OverdueTask) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

const priorityConfig = {
  low: {
    color: "#10b981",
    bg: "bg-green-500/10",
    text: "text-green-600",
    border: "border-green-500/20",
  },
  medium: {
    color: "#f59e0b",
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-500/20",
  },
  high: {
    color: "#ef4444",
    bg: "bg-red-500/10",
    text: "text-red-600",
    border: "border-red-500/20",
  },
};

export function NotificationCard({
  task,
  isSelected,
  onSelect,
  onDelete,
  isDragging,
  onDragStart,
  onDragEnd,
}: NotificationCardProps) {
  const priority = priorityConfig[task.priority];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
      onDragEnd={onDragEnd}
      className={`group relative bg-background rounded-2xl p-5 border transition-all duration-300 ${
        isDragging
          ? "opacity-40 scale-95 shadow-none"
          : isSelected
            ? "border-primary/50 shadow-lg shadow-primary/5 bg-primary/5"
            : "border-border/50 hover:border-border hover:shadow-md"
      }`}
    >
      <div
        className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-300"
        style={{ backgroundColor: priority.color }}
      />

      <div className="flex items-start justify-between mb-4 ml-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(task.id);
          }}
          className="flex-shrink-0 transition-all duration-200"
        >
          {isSelected ? (
            <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground/40 hover:text-primary transition-colors" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground/60 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="ml-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-lg ${priority.bg}`}>
            <AlertCircle className={`w-3.5 h-3.5 ${priority.text}`} />
          </div>
          <span className={`text-xs font-semibold ${priority.text}`}>
            {task.daysOverdue === 0
              ? "Due today"
              : `${task.daysOverdue} day${task.daysOverdue > 1 ? "s" : ""} overdue`}
          </span>
        </div>

        <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{task.dueDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-medium ${priority.bg} ${priority.text}`}
            >
              {task.priority}
            </span>
            {task.category && (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-secondary/60 text-muted-foreground">
                {task.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
