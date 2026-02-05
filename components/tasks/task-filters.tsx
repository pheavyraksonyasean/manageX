"use client";

import { SlidersHorizontal, Search, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
}

const statusOptions = [
  { value: "all", label: "All Status", color: null },
  { value: "todo", label: "To Do", color: "bg-muted-foreground" },
  { value: "in progress", label: "In Progress", color: "bg-yellow-500" },
  { value: "completed", label: "Completed", color: "bg-primary" },
];

const priorityOptions = [
  { value: "all", label: "All Priority", color: null },
  { value: "low", label: "Low", color: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-red-500" },
];

export function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
}: TaskFiltersProps) {
  const selectedStatus = statusOptions.find(
    (opt) => opt.value === statusFilter,
  );
  const selectedPriority = priorityOptions.find(
    (opt) => opt.value === priorityFilter,
  );

  return (
    <div className="bg-secondary/40 rounded-xl p-5 border border-border mb-6">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-foreground" />
        <span className="font-semibold text-foreground">Filters</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-foreground flex items-center justify-between cursor-pointer hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                {selectedStatus?.color && (
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${selectedStatus.color}`}
                  />
                )}
                <span>{selectedStatus?.label || "All Status"}</span>
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
                onClick={() => onStatusChange(option.value)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {option.color && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${option.color}`}
                    />
                  )}
                  <span>{option.label}</span>
                </div>
                {statusFilter === option.value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-foreground flex items-center justify-between cursor-pointer hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                {selectedPriority?.color && (
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${selectedPriority.color}`}
                  />
                )}
                <span>{selectedPriority?.label || "All Priority"}</span>
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
                onClick={() => onPriorityChange(option.value)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {option.color && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${option.color}`}
                    />
                  )}
                  <span>{option.label}</span>
                </div>
                {priorityFilter === option.value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
