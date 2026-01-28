"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { format, parse } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePicker } from "@/components/ui/date-picker";
import { Task } from "./task-card";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: Omit<Task, "id">) => void;
  initialData?: Task;
  mode?: "create" | "edit";
}

const categoryOptions = [
  { value: "Work", label: "Work" },
  { value: "Personal", label: "Personal" },
  { value: "Shopping", label: "Shopping" },
  { value: "Health", label: "Health" },
  { value: "Finance", label: "Finance" },
  { value: "Other", label: "Other" },
];

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-red-500" },
];

const statusOptions = [
  { value: "todo", label: "To Do", color: "bg-muted-foreground" },
  { value: "in progress", label: "In Progress", color: "bg-yellow-500" },
  { value: "completed", label: "Completed", color: "bg-primary" },
];

export function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = "create",
}: TaskDialogProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [category, setCategory] = useState(initialData?.category || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialData?.priority || "medium",
  );
  const [status, setStatus] = useState<"todo" | "in progress" | "completed">(
    initialData?.status || "todo",
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(() => {
    if (initialData?.dueDate) {
      try {
        return parse(initialData.dueDate, "MMM dd, yyyy", new Date());
      } catch {
        return undefined;
      }
    }
    return undefined;
  });

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setCategory(initialData?.category || "");
      setPriority(initialData?.priority || "medium");
      setStatus(initialData?.status || "todo");
      if (initialData?.dueDate) {
        try {
          setDueDate(parse(initialData.dueDate, "MMM dd, yyyy", new Date()));
        } catch {
          setDueDate(undefined);
        }
      } else {
        setDueDate(undefined);
      }
    }
  }, [open, initialData]);

  const selectedCategory = categoryOptions.find(
    (opt) => opt.value === category,
  );
  const selectedPriority = priorityOptions.find(
    (opt) => opt.value === priority,
  );
  const selectedStatus = statusOptions.find((opt) => opt.value === status);

  const handleSubmit = () => {
    if (!title || !description || !category || !dueDate) {
      return;
    }

    onSubmit({
      title,
      description,
      category,
      priority,
      status,
      dueDate: format(dueDate, "MMM dd, yyyy"),
    });

    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("medium");
    setStatus("todo");
    setDueDate(undefined);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Task" : "Edit Task"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details for your new task"
              : "Update the task details"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5">
          {/* Title */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-sm font-medium text-foreground">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-secondary border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Category */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category <span className="text-red-500">*</span>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full bg-secondary border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base text-foreground flex items-center justify-between cursor-pointer hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors">
                    <span
                      className={
                        category ? "text-foreground" : "text-muted-foreground"
                      }
                    >
                      {selectedCategory?.label || "Select category"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] bg-background border-border"
                >
                  {categoryOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setCategory(option.value)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span>{option.label}</span>
                      {category === option.value && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Priority */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-medium text-foreground">
                Priority <span className="text-red-500">*</span>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full bg-secondary border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base text-foreground flex items-center justify-between cursor-pointer hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {selectedPriority?.color && (
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${selectedPriority.color}`}
                        />
                      )}
                      <span>{selectedPriority?.label || "Medium"}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] bg-background border-border"
                >
                  {priorityOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() =>
                        setPriority(option.value as "low" | "medium" | "high")
                      }
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${option.color}`}
                        />
                        <span>{option.label}</span>
                      </div>
                      {priority === option.value && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Status */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-medium text-foreground">
                Status <span className="text-red-500">*</span>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full bg-secondary border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base text-foreground flex items-center justify-between cursor-pointer hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {selectedStatus?.color && (
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${selectedStatus.color}`}
                        />
                      )}
                      <span>{selectedStatus?.label || "To Do"}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[200px] bg-background border-border"
                >
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() =>
                        setStatus(
                          option.value as "todo" | "in progress" | "completed",
                        )
                      }
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${option.color}`}
                        />
                        <span>{option.label}</span>
                      </div>
                      {status === option.value && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-sm font-medium text-foreground">
                Due Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                date={dueDate}
                onDateChange={setDueDate}
                placeholder="Pick a date"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleCancel}
            className="flex-1 bg-red-500/20 text-red-500 py-2.5 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-red-500/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-primary-foreground py-2.5 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-primary/90 transition-colors"
          >
            {mode === "create" ? "Create Task" : "Save Changes"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
