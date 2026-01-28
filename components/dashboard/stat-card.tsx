import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  description: string;
  color?: "primary" | "warning" | "success" | "error";
}

export function StatCard({
  icon: Icon,
  label,
  value,
  description,
  color = "primary",
}: StatCardProps) {
  const colorClasses = {
    primary: "text-primary",
    warning: "text-yellow-500",
    success: "text-green-500",
    error: "text-red-500",
  };

  return (
    <div className="border hover:border-muted-foreground rounded-xl p-6 bg-secondary/40 hover:bg-secondary/80 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-secondary-foreground">{label}</span>
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold">{value}</p>
        <p
          className={`text-sm ${color === "error" ? "text-red-500" : "text-muted-foreground"}`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
