"use client";

import { useState, useEffect } from "react";
import { CategoriesHeader } from "./categories-header";
import { CategoryForm } from "./category-form";
import { CategoriesGrid } from "./categories-grid";
import { Category } from "./category-card";
import { CategoryTasksDialog, Task } from "./category-tasks-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface CategoriesContentProps {
  userName?: string;
}

export function CategoriesContent({
  userName = "Regular User",
}: CategoriesContentProps) {
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
    fetchTasks();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/user/categories");
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

  const fetchTasks = async () => {
    try {
      console.log("Fetching tasks...");
      const response = await fetch("/api/user/tasks");
      console.log("Tasks response status:", response.status);
      const data = await response.json();
      console.log("Tasks response data:", data);

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
        console.log("Fetched tasks:", formattedTasks);
      } else {
        console.error("Failed to fetch tasks:", data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddCategory = async (name: string, color: string) => {
    try {
      const response = await fetch("/api/user/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, color }),
      });

      const data = await response.json();

      if (data.success) {
        setCategories((prev) => [data.category, ...prev]);
      } else {
        alert(data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category");
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
          `/api/user/categories/${categoryToDelete}`,
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
