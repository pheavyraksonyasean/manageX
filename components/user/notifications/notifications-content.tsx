"use client";

import { useState, useEffect } from "react";
import { NotificationsHeader } from "./notifications-header";
import { NotificationsGrid } from "./notifications-grid";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { OverdueTask } from "./notification-card";

interface NotificationsContentProps {
  userName?: string;
}

export function NotificationsContent({
  userName = "Regular User",
}: NotificationsContentProps) {
  const [tasks, setTasks] = useState<OverdueTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/notifications");
      const data = await response.json();

      if (data.success) {
        const formattedTasks = data.notifications.map((notif: any) => {
          const dueDate = new Date(notif.taskDueDate);
          const today = new Date();
          const timeDiff = today.getTime() - dueDate.getTime();
          const daysOverdue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

          return {
            id: notif.id,
            title: notif.taskTitle,
            description: notif.message,
            priority: notif.priority,
            status: notif.taskStatus,
            category:
              notif.type === "overdue"
                ? "Overdue"
                : notif.type === "due_today"
                  ? "Due Today"
                  : "Due Soon",
            dueDate: new Date(notif.taskDueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
            taskId: notif.taskId,
          };
        });
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(tasks.map((t) => t.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const handleDragDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/user/notifications/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteTask: true }),
      });

      const data = await response.json();

      if (data.success) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setSelectedIds((prev) => prev.filter((id) => id !== taskId));
      } else {
        alert(data.message || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("Failed to delete notification");
    }
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        const response = await fetch(
          `/api/user/notifications/${taskToDelete}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deleteTask: true }),
          },
        );

        const data = await response.json();

        if (data.success) {
          setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
          setSelectedIds((prev) => prev.filter((id) => id !== taskToDelete));
        } else {
          alert(data.message || "Failed to delete notification");
        }
      } catch (error) {
        console.error("Error deleting notification:", error);
        alert("Failed to delete notification");
      } finally {
        setTaskToDelete(null);
      }
    }
  };

  const handleDeleteSelected = () => {
    setBulkDeleteOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/user/notifications/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deleteTask: true }),
          }),
        ),
      );

      setTasks((prev) => prev.filter((task) => !selectedIds.includes(task.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Error deleting notifications:", error);
      alert("Failed to delete some notifications");
    }
  };

  const allSelected = tasks.length > 0 && selectedIds.length === tasks.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <>
      <NotificationsHeader
        overdueCount={tasks.length}
        selectedCount={selectedIds.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onDeleteSelected={handleDeleteSelected}
        allSelected={allSelected}
      />

      <NotificationsGrid
        tasks={tasks}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onDelete={handleDeleteTask}
        onDragDelete={handleDragDelete}
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

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
        title="Delete Selected Tasks"
        description={`Are you sure you want to delete ${selectedIds.length} selected task${selectedIds.length > 1 ? "s" : ""}? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
