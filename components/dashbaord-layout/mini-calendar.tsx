"use client";

import { useState, useEffect } from "react";
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

interface CalendarDay {
  date: string;
  count: number;
  level: "low" | "medium" | "high";
  color: string;
}

interface MiniCalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  userRole?: "admin" | "user";
}

export function MiniCalendar({
  onDateSelect,
  selectedDate,
  userRole = "user",
}: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      try {
        const month = currentMonth.getMonth() + 1;
        const year = currentMonth.getFullYear();
        const apiPath =
          userRole === "admin" ? "/api/admin/calendar" : "/api/user/calendar";

        const response = await fetch(`${apiPath}?month=${month}&year=${year}`);
        const data = await response.json();

        if (data.success) {
          setCalendarData(data.calendarData || []);
        }
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentMonth, userRole]);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getCalendarInfo = (date: Date): CalendarDay | null => {
    const dateStr = format(date, "yyyy-MM-dd");
    return calendarData.find((day) => day.date === dateStr) || null;
  };

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
        const calendarInfo = getCalendarInfo(currentDay);
        const hasTask = calendarInfo !== null && calendarInfo.count > 0;
        const isSelected = selectedDate && isSameDay(currentDay, selectedDate);
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isTodayDate = isToday(currentDay);

        let bgColor = "";
        if (hasTask && calendarInfo) {
          if (calendarInfo.level === "low") {
            bgColor = "bg-green-500/20 hover:bg-green-500/30";
          } else if (calendarInfo.level === "medium") {
            bgColor = "bg-amber-500/20 hover:bg-amber-500/30";
          } else if (calendarInfo.level === "high") {
            bgColor = "bg-red-500/20 hover:bg-red-500/30";
          }
        }

        days.push(
          <button
            key={day.toString()}
            onClick={() => onDateSelect?.(currentDay)}
            className={`
              relative w-7 h-7 text-xs rounded-md flex items-center justify-center transition-colors
              ${!isCurrentMonth ? "text-muted-foreground/40" : "text-foreground"}
              ${isTodayDate ? "ring-1 ring-primary font-semibold" : ""}
              ${isSelected ? "bg-primary text-primary-foreground" : hasTask ? bgColor : "hover:bg-secondary"}
            `}
          >
            {format(currentDay, "d")}
            {hasTask && calendarInfo && (
              <span
                className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: calendarInfo.color }}
              />
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

      <div className="space-y-1">{renderDays()}</div>
    </div>
  );
}
