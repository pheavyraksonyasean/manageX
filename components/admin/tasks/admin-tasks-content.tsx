"use client";

import { useState, useMemo } from "react";
import { AdminTasksHeader } from ".././tasks/admin-tasks-header";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskGrid } from "@/components/tasks/task-grid";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Task } from "@/components/tasks/task-card";

// Mock data with multiple users' tasks
const mockAllUsersTasks: Task[] = [
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
    title: "Team meeting preparation",
    description: "Prepare agenda and materials for team meeting",
    priority: "medium",
    status: "todo",
    category: "Work",
    dueDate: "Feb 5, 2026",
  },
  {
    id: "3",
    title: "Code review",
    description: "Review pull requests from team members",
    priority: "high",
    status: "in progress",
    category: "Development",
    dueDate: "Feb 3, 2026",
  },
  {
    id: "4",
    title: "Update documentation",
    description: "Update API documentation with new endpoints",
    priority: "low",
    status: "completed",
    category: "Documentation",
    dueDate: "Jan 28, 2026",
  },
  {
    id: "5",
    title: "Bug fixes",
    description: "Fix reported bugs in production",
    priority: "high",
    status: "in progress",
    category: "Development",
    dueDate: "Feb 4, 2026",
  },
  {
    id: "6",
    title: "Design review",
    description: "Review new UI designs for mobile app",
    priority: "medium",
    status: "todo",
    category: "Design",
    dueDate: "Feb 6, 2026",
  },
];

export function AdminTasksContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tasks, setTasks] = useState<Task[]>(mockAllUsersTasks); // Admin can delete tasks
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

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

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
      setTaskToDelete(null);
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

      <TaskGrid
        tasks={filteredTasks}
        onEdit={undefined} // Admin cannot edit
        onDelete={handleDeleteTask} // Admin can delete
        isAdminView={true}
      />

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
