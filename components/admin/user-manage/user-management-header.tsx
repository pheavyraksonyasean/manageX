"use client";

import { Menu, Users } from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";

export function UserManagementHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-2">Manage Users</h1>
        <p className="text-muted-foreground text-lg">
          Welcome back, Regular User
        </p>
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
