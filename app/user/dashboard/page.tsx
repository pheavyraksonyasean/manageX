import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsSection } from "@/components/dashboard/stats-section";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { RecentTasks } from "@/components/dashboard/recent-tasks";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <DashboardHeader userName="Regular User" />
      <StatsSection />
      <ChartsSection />
      <RecentTasks />
    </div>
  );
}
