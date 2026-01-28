"use client";

import { useState, useMemo } from "react";
import { TasksHeader } from "./tasks-header";
import { TaskFilters } from "./task-filters";
import { TaskGrid } from "./task-grid";
import { TaskDialog } from "./task-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Task } from "./task-card";

// Mock data - replace with actual data fetching
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
    title: "Complete project proposal",
    description: "Draft and finalize the Q1 project proposal for client review",
    priority: "high",
    status: "in progress",
    category: "Work",
    dueDate: "Jan 30, 2026",
  },
  {
    id: "3",
    title: "Complete project proposal",
    description: "Draft and finalize the Q1 project proposal for client review",
    priority: "high",
    status: "in progress",
    category: "Work",
    dueDate: "Jan 30, 2026",
  },
  {
    id: "4",
    title: "Complete project proposal",
    description: "Draft and finalize the Q1 project proposal for client review",
    priority: "high",
    status: "in progress",
    category: "Work",
    dueDate: "Jan 30, 2026",
  },
  {
    id: "5",
    title: "Complete project proposal",
    description: "Draft and finalize the Q1 project proposal for client review",
    priority: "high",
    status: "in progress",
    category: "Work",
    dueDate: "Jan 30, 2026",
  },
  {
    id: "6",
    title: "Complete project proposal",
    description: "Draft and finalize the Q1 project proposal for client review",
    priority: "high",
    status: "in progress",
    category: "Work",
    dueDate: "Jan 30, 2026",
  },
];

interface TasksContentProps {
  userName?: string;
}

export function TasksContent({ userName = "Regular User" }: TasksContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
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

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
      setTaskToDelete(null);
    }
  };

  const handleSubmitTask = (taskData: Omit<Task, "id">) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskData } : task,
        ),
      );
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
      };
      setTasks((prev) => [newTask, ...prev]);
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

      <TaskGrid
        tasks={filteredTasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

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
