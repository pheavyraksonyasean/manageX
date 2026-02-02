"use client";

import { useState } from "react";
import { NotificationCard, OverdueTask } from "./notification-card";
import { Bell, Trash2 } from "lucide-react";

interface NotificationsGridProps {
  tasks: OverdueTask[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDragDelete?: (taskId: string) => void;
}

export function NotificationsGrid({
  tasks,
  selectedIds,
  onSelect,
  onDelete,
  onDragDelete,
}: NotificationsGridProps) {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [isDragOverTrash, setIsDragOverTrash] = useState(false);

  const handleDragStart = (e: React.DragEvent, task: OverdueTask) => {
    setDraggingTaskId(task.id);
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setIsDragOverTrash(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnterTrash = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverTrash(true);
  };

  const handleDragLeaveTrash = () => {
    setIsDragOverTrash(false);
  };

  const handleDropOnTrash = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId && onDragDelete) {
      onDragDelete(taskId);
    }
    setIsDragOverTrash(false);
    setDraggingTaskId(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center bg-secondary/40 rounded-xl border border-border">
        <div className="p-4 sm:p-5 bg-primary/10 rounded-full mb-4 sm:mb-6">
          <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-primary/50" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
          No notifications yet
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md px-4">
          You&apos;re all caught up! There are no overdue tasks at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trash Drop Zone - Only visible when dragging */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnterTrash}
        onDragLeave={handleDragLeaveTrash}
        onDrop={handleDropOnTrash}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
          draggingTaskId
            ? isDragOverTrash
              ? "border-red-500 bg-red-500/20 py-8 opacity-100"
              : "border-red-500/50 bg-red-500/10 py-8 opacity-100"
            : "border-transparent py-0 opacity-0 h-0"
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center gap-2 transition-all ${
            draggingTaskId ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`p-3 rounded-full transition-colors ${
              isDragOverTrash ? "bg-red-500/30" : "bg-red-500/20"
            }`}
          >
            <Trash2
              className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors ${
                isDragOverTrash ? "text-red-400" : "text-red-500/70"
              }`}
            />
          </div>
          <p
            className={`font-medium text-sm sm:text-base transition-colors ${
              isDragOverTrash ? "text-red-400" : "text-red-500/70"
            }`}
          >
            {isDragOverTrash ? "Release to delete" : "Drop here to delete task"}
          </p>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {tasks.map((task) => (
          <NotificationCard
            key={task.id}
            task={task}
            isSelected={selectedIds.includes(task.id)}
            onSelect={onSelect}
            onDelete={onDelete}
            isDragging={draggingTaskId === task.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      {/* Drag hint */}
      {tasks.length > 0 && !draggingTaskId && (
        <p className="text-center text-muted-foreground text-xs sm:text-sm">
          💡 Tip: Drag and drop tasks to the trash zone to delete them
        </p>
      )}
    </div>
  );
}
