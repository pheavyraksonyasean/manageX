"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  CheckSquare,
  AlertCircle,
  Users,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "../../user/dashboard/stat-card";

interface AdminStatsSectionProps {
  userRole?: "admin" | "user";
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  highPriorityTasks: number;
  overdueTasks: number;
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  completionRate: number;
}

export function AdminStatsSection({
  userRole = "user",
}: AdminStatsSectionProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    highPriorityTasks: 0,
    overdueTasks: 0,
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) throw new Error("Failed to fetch stats");

        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-secondary/40 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* User Stats - visible to all */}
      <StatCard
        icon={CheckSquare}
        label="Total Tasks"
        value={stats.totalTasks}
        description="All tasks in system"
        color="primary"
      />
      <StatCard
        icon={Clock}
        label={userRole === "admin" ? "Completed Tasks" : "In Progress"}
        value={
          userRole === "admin" ? stats.completedTasks : stats.inProgressTasks
        }
        description={
          userRole === "admin"
            ? `${stats.completionRate}% completion rate`
            : "Currently working on"
        }
        color={userRole === "admin" ? "success" : "warning"}
      />

      {/* Admin-specific stats */}
      {userRole === "admin" ? (
        <>
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            description="Registered users"
            color="primary"
          />
          <StatCard
            icon={AlertCircle}
            label="High Priority"
            value={stats.highPriorityTasks}
            description="Urgent focus"
            color="error"
          />
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
