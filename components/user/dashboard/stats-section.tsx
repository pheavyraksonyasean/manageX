"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, CheckSquare, AlertCircle } from "lucide-react";
import { StatCard } from "./stat-card";

export function StatsSection() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/user/dashboard/stats");
      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
      } else {
        console.error("Failed to fetch stats:", data.error);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-xl p-6 bg-secondary/40 animate-pulse"
          >
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={CheckSquare}
        label="Total Tasks"
        value={stats.totalTasks}
        description="All your tasks"
        color="primary"
      />
      <StatCard
        icon={Clock}
        label="In Progress"
        value={stats.inProgressTasks}
        description="Currently working on"
        color="warning"
      />
      <StatCard
        icon={CheckCircle2}
        label="Completed"
        value={stats.completedTasks}
        description="Tasks finished"
        color="success"
      />
      <StatCard
        icon={AlertCircle}
        label="Overdue"
        value={stats.overdueTasks}
        description="Need attention"
        color="error"
      />
    </div>
  );
}
