"use client";

import { useState } from "react";
import { CategoriesHeader } from "./categories-header";
import { CategoryForm } from "./category-form";
import { CategoriesGrid } from "./categories-grid";
import { Category } from "./category-card";
import { CategoryTasksDialog, Task } from "./category-tasks-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// Mock tasks data - replace with actual data fetching
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
];

// Mock data - replace with actual data fetching
const mockCategories: Category[] = [
  { id: "1", name: "Work", color: "#f87171", taskCount: 3 },
  { id: "2", name: "Personal", color: "#ec4899", taskCount: 0 },
  { id: "3", name: "Health", color: "#10b981", taskCount: 0 },
  { id: "4", name: "Finance", color: "#a855f7", taskCount: 0 },
  { id: "5", name: "Shopping", color: "#f59e0b", taskCount: 0 },
  { id: "6", name: "Other", color: "#06b6d4", taskCount: 0 },
];

interface CategoriesContentProps {
  userName?: string;
}

export function CategoriesContent({
  userName = "Regular User",
}: CategoriesContentProps) {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [tasks] = useState<Task[]>(mockTasks);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [viewTasksOpen, setViewTasksOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const handleAddCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
      taskCount: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

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
      <CategoriesHeader userName={userName} />
      <CategoryForm onSubmit={handleAddCategory} />
      <CategoriesGrid
        categories={categories}
        onDelete={handleDeleteCategory}
        onCategoryClick={handleCategoryClick}
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
        description="Are you sure you want to delete this category? Tasks in this category will not be deleted."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
