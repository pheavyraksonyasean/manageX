"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminTasksHeader } from ".././tasks/admin-tasks-header";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskGrid } from "@/components/tasks/task-grid";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Task } from "@/components/tasks/task-card";

export function AdminTasksContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Fetch all tasks from all users
  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/tasks");
      const data = await response.json();

      if (response.ok) {
        setTasks(data.tasks || []);
      } else {
        console.error("Failed to fetch tasks:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Admin can delete tasks
  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        const response = await fetch(`/api/admin/tasks/${taskToDelete}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
          setTaskToDelete(null);
        } else {
          const data = await response.json();
          console.error("Failed to delete task:", data.error);
          alert("Failed to delete task. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("An error occurred while deleting the task.");
      }
    }
  };

  return (
    <>
      <AdminTasksHeader totalTasks={tasks.length} />

      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground">Loading tasks...</div>
        </div>
      ) : (
        <TaskGrid
          tasks={filteredTasks}
          onEdit={undefined} // Admin cannot edit
          onDelete={handleDeleteTask} // Admin can delete
          isAdminView={true}
        />
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDeleteTask}
        title="Delete User Task"
        description="Are you sure you want to delete this user's task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
