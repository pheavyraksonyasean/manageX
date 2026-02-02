import { Users, UserCheck, TrendingUp } from "lucide-react";

interface UserStatsProps {
  totalUsers: number;
  regularUsers: number;
}

export function UserStats({ totalUsers, regularUsers }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Users */}
      <div className="border hover:border-muted-foreground rounded-xl p-6 bg-secondary/40 hover:bg-secondary/80 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-sm text-secondary-foreground">Total Users</span>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold">{totalUsers}</p>
          <p className="text-sm text-muted-foreground">Registered users</p>
        </div>
      </div>

      {/* Regular Users */}
      <div className="border hover:border-muted-foreground rounded-xl p-6 bg-secondary/40 hover:bg-secondary/80 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="text-primary">
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="text-sm text-secondary-foreground">
            Regular Users
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold">{regularUsers}</p>
          <p className="text-sm text-muted-foreground">Active users</p>
        </div>
      </div>

      {/* Admin Users */}
      <div className="border hover:border-muted-foreground rounded-xl p-6 bg-secondary/40 hover:bg-secondary/80 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="text-primary">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-sm text-secondary-foreground">Admin Users</span>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold">{totalUsers - regularUsers}</p>
          <p className="text-sm text-muted-foreground">System admins</p>
        </div>
      </div>
    </div>
  );
}
