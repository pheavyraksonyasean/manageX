import { DashboardHeader } from "@/components/user/dashboard/dashboard-header";
import { AdminStatsSection } from "@/components/admin/dashboard/admin-stats-section";
import { AdminBarChart } from "@/components/admin/dashboard/admin-bar-chart";
import { SystemUsers } from "@/components/admin/dashboard/system-users";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <DashboardHeader
        titleName="Admin Dashboard"
        userName="System overview and statistics"
      />
      <AdminStatsSection userRole="admin" />
      <AdminBarChart />
      <SystemUsers />
    </div>
  );
}
