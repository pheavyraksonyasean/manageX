"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/app/user/layout";

interface CategoriesHeaderProps {
  userName?: string;
}

export function CategoriesHeader({
  userName = "Regular User",
}: CategoriesHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground text-lg">
          Organize your tasks with categories
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
