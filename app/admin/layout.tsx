"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashbaord-layout/sidebar";
import { SidebarContext } from "@/contexts/sidebar-context";

export { useSidebar } from "@/contexts/sidebar-context";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}
    >
      <div className="flex bg-background text-foreground dark min-h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userRole="admin"
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarContext.Provider>
  );
}
