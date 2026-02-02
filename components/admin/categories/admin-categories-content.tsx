"use client";

import { useState } from "react";
import { AdminCategoriesHeader } from "./admin-categories-header";
import { CategoriesGrid } from "@/components/user/categories/categories-grid";
import { Category } from "@/components/user/categories/category-card";
import {
  CategoryTasksDialog,
  Task,
} from "@/components/user/categories/category-tasks-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// Mock tasks data - all users' tasks
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Draft and finalize the Q1 project proposal for client review",
    priority: "high",
    status: "in progress",
    category: "Work",
    dueDate: "Jan 30, 2026",
  },
  {
    id: "2",
    title: "Review team updates",
    description: "Check the weekly progress reports from team members",
    priority: "medium",
    status: "todo",
    category: "Work",
    dueDate: "Jan 28, 2026",
  },
  {
    id: "3",
    title: "Prepare presentation",
    description: "Create slides for the upcoming client meeting",
    priority: "high",
    status: "completed",
    category: "Work",
    dueDate: "Jan 25, 2026",
  },
  {
    id: "4",
    title: "Gym workout",
    description: "Morning workout session",
    priority: "medium",
    status: "in progress",
    category: "Health",
    dueDate: "Feb 3, 2026",
  },
];

// Mock categories - all users' categories
const mockCategories: Category[] = [
  { id: "1", name: "Work", color: "#f87171", taskCount: 3 },
  { id: "2", name: "Personal", color: "#ec4899", taskCount: 0 },
  { id: "3", name: "Health", color: "#10b981", taskCount: 1 },
  { id: "4", name: "Finance", color: "#a855f7", taskCount: 0 },
  { id: "5", name: "Shopping", color: "#f59e0b", taskCount: 0 },
  { id: "6", name: "Other", color: "#06b6d4", taskCount: 0 },
];

export function AdminCategoriesContent() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [tasks] = useState<Task[]>(mockTasks);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [viewTasksOpen, setViewTasksOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete),
      );
      setCategoryToDelete(null);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setViewTasksOpen(true);
  };

  return (
    <>
      <AdminCategoriesHeader totalCategories={categories.length} />

      {/* No CategoryForm for admin - they cannot create categories */}

      <CategoriesGrid
        categories={categories}
        onDelete={handleDeleteCategory}
        onCategoryClick={handleCategoryClick}
        isAdminView={true}
      />

      <CategoryTasksDialog
        open={viewTasksOpen}
        onOpenChange={setViewTasksOpen}
        category={selectedCategory}
        tasks={tasks}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
