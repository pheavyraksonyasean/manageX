"use client";

import { useState, useMemo, useEffect } from "react";
import { TasksHeader } from "./tasks-header";
import { TaskFilters } from "./task-filters";
import { TaskGrid } from "./task-grid";
import { TaskDialog } from "./task-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Task } from "./task-card";

interface TasksContentProps {
  userName?: string;
}

export function TasksContent({ userName = "Regular User" }: TasksContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/tasks");
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

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        const response = await fetch(`/api/user/tasks/${taskToDelete}`, {
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

  const handleSubmitTask = async (taskData: Omit<Task, "id">) => {
    try {
      if (editingTask) {
        const response = await fetch(`/api/user/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });

        const data = await response.json();

        if (response.ok) {
          setTasks((prev) =>
            prev.map((task) => (task.id === editingTask.id ? data.task : task)),
          );
        } else {
          console.error("Failed to update task:", data.error);
          alert("Failed to update task. Please try again.");
        }
      } else {
        const response = await fetch("/api/user/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });

        const data = await response.json();

        if (response.ok) {
          setTasks((prev) => [data.task, ...prev]);
        } else {
          console.error("Failed to create task:", data.error);
          alert("Failed to create task. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <TasksHeader userName={userName} onAddTask={handleAddTask} />

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
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
        mode={editingTask ? "edit" : "create"}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
