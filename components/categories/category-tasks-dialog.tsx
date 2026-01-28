"use client";

import { X, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category } from "./category-card";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in progress" | "completed";
  category: string;
  dueDate: string;
}

interface CategoryTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  tasks: Task[];
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

export function CategoryTasksDialog({
  open,
  onOpenChange,
  category,
  tasks,
}: CategoryTasksDialogProps) {
  if (!category) return null;

  const categoryTasks = tasks.filter((task) => task.category === category.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <DialogTitle className="text-base sm:text-lg truncate">
              {category.name} Tasks
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 pr-1 sm:pr-2 -mr-1 sm:-mr-2">
          {categoryTasks.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-muted-foreground text-base sm:text-lg">
                No tasks in this category
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm mt-2">
                Create a task and assign it to this category
              </p>
            </div>
          ) : (
            categoryTasks.map((task) => (
              <div
                key={task.id}
                className="bg-secondary/60 rounded-lg p-3 sm:p-4 border border-border"
              >
                <h4 className="font-medium text-sm sm:text-base text-foreground mb-1">
                  {task.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                  {task.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${priorityColors[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${statusColors[task.status]}`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground text-[10px] sm:text-xs">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 sm:pt-4 border-t border-border mt-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {categoryTasks.length} task{categoryTasks.length !== 1 ? "s" : ""}{" "}
            in this category
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
