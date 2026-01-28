"use client";

import { Menu, Bell, Trash2, CheckSquare } from "lucide-react";
import { useSidebar } from "@/app/user/layout";

interface NotificationsHeaderProps {
  overdueCount: number;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  allSelected: boolean;
}

export function NotificationsHeader({
  overdueCount,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  allSelected,
}: NotificationsHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 sm:p-3 bg-red-500/20 rounded-xl hidden sm:flex">
          <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Notifications
            </h1>
            {overdueCount > 0 && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                {overdueCount} overdue
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-1">
            {overdueCount > 0
              ? `You have ${overdueCount} task${overdueCount > 1 ? "s" : ""} past the deadline`
              : "All caught up!"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {overdueCount > 0 && (
          <>
            <button
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="flex items-center gap-2 bg-secondary text-foreground py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium hover:bg-secondary/80 transition-colors text-sm sm:text-base border border-border"
            >
              <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">
                {allSelected ? "Deselect All" : "Select All"}
              </span>
              <span className="sm:hidden">
                {allSelected ? "Deselect" : "Select"}
              </span>
            </button>
            {selectedCount > 0 && (
              <button
                onClick={onDeleteSelected}
                className="flex items-center gap-2 bg-red-500 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">
                  Delete Selected ({selectedCount})
                </span>
                <span className="sm:hidden">Delete ({selectedCount})</span>
              </button>
            )}
          </>
        )}
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
