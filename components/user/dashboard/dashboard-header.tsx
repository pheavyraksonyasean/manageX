"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";

interface DashboardHeaderProps {
  userName: string;
  titleName: string;
}

export function DashboardHeader({ userName, titleName }: DashboardHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-2">{titleName}</h1>
        <p className="text-muted-foreground text-lg">{userName}</p>
      </div>
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-foreground hover:text-primary transition-colors p-2"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
}
