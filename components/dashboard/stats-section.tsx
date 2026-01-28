import { CheckCircle2, Clock, CheckSquare, AlertCircle } from "lucide-react";
import { StatCard } from "./stat-card";

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={CheckSquare}
        label="Total Tasks"
        value={4}
        description="All your tasks"
        color="primary"
      />
      <StatCard
        icon={Clock}
        label="In Progress"
        value={4}
        description="Currently working on"
        color="warning"
      />
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
    </div>
  );
}
