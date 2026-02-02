import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
}

// Mock data - replace with real data from your backend
const mockUsers: User[] = [
  {
    id: "1",
    name: "admin user",
    email: "admin24@gmail.com",
    role: "admin",
  },
  {
    id: "2",
    name: "user",
    email: "admingergerru24@gmail.com",
    role: "user",
  },
  {
    id: "3",
    name: "user",
    email: "admingergerru24@gmail.com",
    role: "user",
  },
];

export function SystemUsers() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">System Users</h3>
      <div className="space-y-3">
        {mockUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 bg-primary/20">
                <AvatarFallback className="bg-primary/30 text-primary-foreground font-medium">
                  {user.name.substring(0, 4)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.role === "admin"
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
