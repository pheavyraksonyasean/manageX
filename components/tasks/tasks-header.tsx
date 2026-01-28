"use client";

import { Menu, Plus } from "lucide-react";
import { useSidebar } from "@/app/user/layout";

interface TasksHeaderProps {
  userName: string;
  onAddTask?: () => void;
}

export function TasksHeader({ userName, onAddTask }: TasksHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-2">Tasks</h1>
        <p className="text-muted-foreground text-lg">
          Welcome back, {userName}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 bg-primary text-primary-foreground py-2.5 px-5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-foreground hover:text-primary transition-colors p-2"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
