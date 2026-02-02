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

export function AdminStatsSection({
  userRole = "user",
}: AdminStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* User Stats - visible to all */}
      <StatCard
        icon={CheckSquare}
        label="Total Tasks"
        value={4}
        description="All tasks in system"
        color="primary"
      />
      <StatCard
        icon={Clock}
        label={userRole === "admin" ? "Completed Tasks" : "In Progress"}
        value={4}
        description={
          userRole === "admin" ? "30% completion rate" : "Currently working on"
        }
        color={userRole === "admin" ? "success" : "warning"}
      />

      {/* Admin-specific stats */}
      {userRole === "admin" ? (
        <>
          <StatCard
            icon={Users}
            label="Total Users"
            value={4}
            description="Registered users"
            color="primary"
          />
          <StatCard
            icon={AlertCircle}
            label="High Priority"
            value={4}
            description="Urgent focus"
            color="error"
          />
        </>
      ) : (
        <>
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={4}
            description="Tasks finished"
            color="success"
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={4}
            description="Need attention"
            color="error"
          />
        </>
      )}
    </div>
  );
}
