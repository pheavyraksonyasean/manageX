"use client";

import { createContext, useContext } from "react";

interface SidebarContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined,
);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebar must be used within a layout with SidebarContext",
    );
  }
  return context;
}
