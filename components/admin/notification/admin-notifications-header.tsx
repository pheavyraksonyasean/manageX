"use client";

import { Menu, ShieldCheck } from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";

interface AdminNotificationsHeaderProps {
  newUsersCount: number;
  totalNotifications: number;
}

export function AdminNotificationsHeader({
  newUsersCount,
  totalNotifications,
}: AdminNotificationsHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">Notifications</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {newUsersCount > 0 && (
            <span className="text-primary font-medium">
              {newUsersCount} new user{newUsersCount !== 1 ? "s" : ""}{" "}
              registered •{" "}
            </span>
          )}
          {totalNotifications} total notification
          {totalNotifications !== 1 ? "s" : ""}
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
