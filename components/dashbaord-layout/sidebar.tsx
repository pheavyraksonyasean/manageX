"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Layers3,
  Bell,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MiniCalendar } from "./mini-calendar";
import { DateTasks } from "./date-tasks";
import { ProfileDialog } from "@/components/profile-setting/profile-dialog";

// Mock tasks - in real app, this would come from a shared state/context
const mockTasks = [
  {
    id: "1",
    title: "Complete project proposal",
    dueDate: "Jan 30, 2026",
    priority: "high" as const,
  },
  {
    id: "2",
    title: "Review team updates",
    dueDate: "Jan 28, 2026",
    priority: "medium" as const,
  },
  {
    id: "3",
    title: "Prepare presentation",
    dueDate: "Jan 28, 2026",
    priority: "high" as const,
  },
  {
    id: "4",
    title: "Team meeting",
    dueDate: "Jan 29, 2026",
    priority: "low" as const,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">ManageX</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-foreground hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          <Link
            href="/user/dashboard"
            className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
              isActive("/user/dashboard")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">Dashboard</span>
          </Link>

          <Link
            href="/user/tasks"
            className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
              isActive("/user/tasks")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">Tasks</span>
          </Link>

          <Link
            href="/user/categories"
            className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
              isActive("/user/categories")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <Layers3 className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">Categories</span>
          </Link>

          <Link
            href="/user/notifications"
            className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
              isActive("/user/notifications")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">
              Notifications
            </span>
          </Link>

          {/* Mini Calendar */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
            <MiniCalendar
              tasks={mockTasks}
              selectedDate={selectedDate || undefined}
              onDateSelect={(date) => setSelectedDate(date)}
            />
            <DateTasks date={selectedDate} tasks={mockTasks} />
          </div>
        </nav>

        {/* User Profile - Fixed at bottom */}
        <div className="p-3 sm:p-4 border-t border-border shrink-0">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border border-border/50 overflow-hidden">
            {/* Profile Header with subtle gradient */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-full p-3 sm:p-4 hover:bg-white/5 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-3">
                {/* Avatar with ring */}
                <div className="relative">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-lg sm:text-xl ring-2 ring-primary/30 ring-offset-2 ring-offset-card shadow-lg group-hover:ring-primary/50 transition-all duration-200"
                    style={{ backgroundColor: "#FF6B6B" }}
                  >
                    😊
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                    Username
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    username@gmail.com
                  </p>
                </div>

                {/* Chevron indicator */}
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>

            {/* Logout button - integrated into card */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 border border-red-500/20">
                <LogOut className="w-4 h-4" />
                <span className="font-medium text-xs sm:text-sm">Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Dialog */}
        <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      </aside>
    </>
  );
}
