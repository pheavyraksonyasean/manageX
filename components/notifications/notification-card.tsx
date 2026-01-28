"use client";

import { AlertTriangle, Clock, Trash2, GripVertical } from "lucide-react";

export interface OverdueTask {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in progress" | "completed";
  category: string;
  dueDate: string;
  daysOverdue: number;
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

const priorityColors = {
  low: "bg-green-500/20 text-green-500 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  high: "bg-red-500/20 text-red-500 border-red-500/30",
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
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
      onDragEnd={onDragEnd}
      className={`relative bg-secondary/40 rounded-xl p-4 sm:p-5 border-l-4 border transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isDragging
          ? "opacity-50 scale-95 border-primary"
          : isSelected
            ? "border-l-primary border-primary/50 bg-primary/10"
            : "border-l-red-500 border-border hover:border-muted-foreground"
      }`}
    >
      {/* Drag handle indicator */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-muted-foreground/50">
        <GripVertical className="w-4 h-4" />
      </div>
      {/* Selection checkbox */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(task.id);
          }}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-primary border-primary"
              : "border-muted-foreground hover:border-primary"
          }`}
        >
          {isSelected && (
            <svg
              className="w-3 h-3 text-primary-foreground"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Overdue badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-red-500/20">
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>
        <span className="text-xs sm:text-sm font-semibold text-red-500">
          {task.daysOverdue} day{task.daysOverdue > 1 ? "s" : ""} overdue
        </span>
      </div>

      {/* Task Title */}
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 pr-8">
        {task.title}
      </h3>

      {/* Task Description */}
      <p className="text-muted-foreground text-xs sm:text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
          {task.category}
        </span>
      </div>

      {/* Due Date */}
      <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm mb-4">
        <Clock className="w-4 h-4" />
        <span>Due: {task.dueDate}</span>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(task.id)}
        className="w-full flex items-center justify-center gap-2 bg-red-500/20 text-red-500 py-2 sm:py-2.5 px-4 rounded-lg font-medium hover:bg-red-500/30 transition-colors text-sm"
      >
        <Trash2 className="w-4 h-4" />
        Delete Task
      </button>
    </div>
  );
}
