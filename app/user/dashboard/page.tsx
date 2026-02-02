import { DashboardHeader } from "@/components/user/dashboard/dashboard-header";
import { StatsSection } from "@/components/user/dashboard/stats-section";
import { ChartsSection } from "@/components/user/dashboard/charts-section";
import { RecentTasks } from "@/components/user/dashboard/recent-tasks";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <DashboardHeader titleName="Dashboard" userName="Welcome, Regular User" />
      <StatsSection />
      <ChartsSection />
      <RecentTasks />
    </div>
  );
}
