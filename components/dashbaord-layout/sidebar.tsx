"use client";

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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

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
        <div className="p-6 border-b border-border flex items-center justify-between">
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/user/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/user/dashboard")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            href="/user/dashboard/tasks"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/user/dashboard/tasks")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">Tasks</span>
          </Link>

          <Link
            href="/user/dashboard/categories"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/user/dashboard/categories")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <Layers3 className="w-5 h-5" />
            <span className="font-medium">Categories</span>
          </Link>

          <Link
            href="/user/dashboard/notifications"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/user/dashboard/notifications")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
          </Link>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="bg-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Username</p>
                <p className="text-xs text-muted-foreground truncate">
                  username@gmail.com
                </p>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
