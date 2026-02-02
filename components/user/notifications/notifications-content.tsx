"use client";

import { useState } from "react";
import { NotificationsHeader } from "./notifications-header";
import { NotificationsGrid } from "./notifications-grid";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { OverdueTask } from "./notification-card";

// Mock overdue tasks - in real app, this would filter tasks past their deadline
const mockOverdueTasks: OverdueTask[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Draft and finalize the Q1 project proposal for client review",
    priority: "high",
    status: "in progress",
    category: "Work",
    dueDate: "Jan 25, 2026",
    daysOverdue: 3,
  },
  {
    id: "2",
    title: "Submit quarterly report",
    description: "Prepare and submit the Q4 financial report to the management",
    priority: "high",
    status: "todo",
    category: "Finance",
    dueDate: "Jan 20, 2026",
    daysOverdue: 8,
  },
  {
    id: "3",
    title: "Review team feedback",
    description:
      "Go through team performance feedback forms and prepare summary",
    priority: "medium",
    status: "todo",
    category: "HR",
    dueDate: "Jan 27, 2026",
    daysOverdue: 1,
  },
  {
    id: "4",
    title: "Update documentation",
    description: "Update API documentation for version 2.0 release",
    priority: "low",
    status: "in progress",
    category: "Development",
    dueDate: "Jan 15, 2026",
    daysOverdue: 13,
  },
  {
    id: "5",
    title: "Client meeting preparation",
    description: "Prepare presentation slides and demo for the client meeting",
    priority: "high",
    status: "todo",
    category: "Work",
    dueDate: "Jan 26, 2026",
    daysOverdue: 2,
  },
];

interface NotificationsContentProps {
  userName?: string;
}

export function NotificationsContent({
  userName = "Regular User",
}: NotificationsContentProps) {
  const [tasks, setTasks] = useState<OverdueTask[]>(mockOverdueTasks);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

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

  const handleDragDelete = (taskId: string) => {
    // Direct delete without confirmation for drag & drop (feels more natural)
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedIds((prev) => prev.filter((id) => id !== taskId));
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
      setSelectedIds((prev) => prev.filter((id) => id !== taskToDelete));
      setTaskToDelete(null);
    }
  };

  const handleDeleteSelected = () => {
    setBulkDeleteOpen(true);
  };

  const confirmBulkDelete = () => {
    setTasks((prev) => prev.filter((task) => !selectedIds.includes(task.id)));
    setSelectedIds([]);
  };

  const allSelected = tasks.length > 0 && selectedIds.length === tasks.length;

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

      {/* Single delete confirmation */}
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

      {/* Bulk delete confirmation */}
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
