"use client";

import { Menu, ShieldCheck } from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";

interface AdminTasksHeaderProps {
  totalTasks: number;
}

export function AdminTasksHeader({ totalTasks }: AdminTasksHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">All Users Tasks</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Viewing {totalTasks} tasks from all users
        </p>
      </div>
      <div className="flex items-center gap-3">
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
