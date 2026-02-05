import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  tasksCount: number;
}

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  return (
    <div className="bg-secondary/40 rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">All Users</h3>
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Avatar className="w-12 h-12 bg-primary/20 flex-shrink-0">
                <AvatarFallback className="bg-primary/30 text-primary-foreground font-medium text-sm">
                  user
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Tasks</p>
                <p className="text-sm font-medium text-foreground">
                  {user.tasksCount}
                </p>
              </div>
              <span
                className={`px-3 py-1.5 rounded-md text-xs font-medium min-w-[70px] text-center ${
                  user.role === "admin"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary text-muted-foreground border border-border"
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
