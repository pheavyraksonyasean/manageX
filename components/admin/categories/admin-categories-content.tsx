"use client";

import { useState, useEffect } from "react";
import { AdminCategoriesHeader } from "./admin-categories-header";
import { CategoriesGrid } from "@/components/user/categories/categories-grid";
import { Category } from "@/components/user/categories/category-card";
import {
  CategoryTasksDialog,
  Task,
} from "@/components/user/categories/category-tasks-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function AdminCategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [viewTasksOpen, setViewTasksOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchAllTasks();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTasks = async () => {
    try {
      console.log("Admin: Fetching all tasks...");
      const response = await fetch("/api/admin/tasks");
      console.log("Admin tasks response status:", response.status);
      const data = await response.json();
      console.log("Admin tasks response data:", data);

      if (data.success) {
        // Transform tasks to match the expected format
        const formattedTasks = data.tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          category: task.category,
          dueDate: new Date(task.dueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));
        setTasks(formattedTasks);
        console.log("Admin: Fetched tasks:", formattedTasks);
      } else {
        console.error("Admin: Failed to fetch tasks:", data.message);
      }
    } catch (error) {
      console.error("Admin: Error fetching tasks:", error);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        const response = await fetch(
          `/api/admin/categories/${categoryToDelete}`,
          {
            method: "DELETE",
          },
        );

        const data = await response.json();

        if (data.success) {
          setCategories((prev) =>
            prev.filter((cat) => cat.id !== categoryToDelete),
          );
        } else {
          alert(data.message || "Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      } finally {
        setCategoryToDelete(null);
      }
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setViewTasksOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

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
