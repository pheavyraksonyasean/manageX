"use client";

import { TaskCard, Task } from "./task-card";

interface TaskGridProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isAdminView?: boolean;
}

export function TaskGrid({
  tasks,
  onEdit,
  onDelete,
  isAdminView = false,
}: TaskGridProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-secondary/40 rounded-xl p-12 border border-border text-center">
        <p className="text-muted-foreground text-lg">No tasks found</p>
        <p className="text-muted-foreground text-sm mt-2">
          Try adjusting your filters or create a new task
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          isAdminView={isAdminView}
        />
      ))}
    </div>
  );
}
