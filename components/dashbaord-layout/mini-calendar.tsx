"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

interface Task {
  id: string;
  title: string;
  dueDate: string;
}

interface MiniCalendarProps {
  tasks?: Task[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export function MiniCalendar({
  tasks = [],
  onDateSelect,
  selectedDate,
}: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      try {
        // Try to parse the date string
        const taskDate = new Date(task.dueDate);
        return isSameDay(taskDate, date);
      } catch {
        return false;
      }
    });
  };

  // Generate calendar days
  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayTasks = getTasksForDate(currentDay);
        const hasTask = dayTasks.length > 0;
        const isSelected = selectedDate && isSameDay(currentDay, selectedDate);
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isTodayDate = isToday(currentDay);

        days.push(
          <button
            key={day.toString()}
            onClick={() => onDateSelect?.(currentDay)}
            className={`
              relative w-7 h-7 text-xs rounded-md flex items-center justify-center transition-colors
              ${!isCurrentMonth ? "text-muted-foreground/40" : "text-foreground"}
              ${isTodayDate ? "bg-primary/20 text-primary font-semibold" : ""}
              ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}
            `}
          >
            {format(currentDay, "d")}
            {hasTask && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </button>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>,
      );
      days = [];
    }

    return rows;
  };

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="bg-secondary/40 rounded-lg p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-secondary rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-sm font-medium text-foreground">
          {format(currentMonth, "MMM yyyy")}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-secondary rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="w-7 h-6 text-[10px] font-medium text-muted-foreground flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="space-y-1">{renderDays()}</div>
    </div>
  );
}
