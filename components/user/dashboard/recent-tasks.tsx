interface Task {
  id: string;
  title: string;
  category: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed";
}

interface RecentTasksProps {
  tasks?: Task[];
}

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Team meeting preparation",
    category: "Work",
    priority: "high",
    status: "completed",
  },
  {
    id: "2",
    title: "Team meeting preparation",
    category: "Work",
    priority: "high",
    status: "completed",
  },
  {
    id: "3",
    title: "Team meeting preparation",
    category: "Work",
    priority: "high",
    status: "completed",
  },
  {
    id: "4",
    title: "Team meeting preparation",
    category: "Work",
    priority: "high",
    status: "completed",
  },
];

export function RecentTasks({ tasks = defaultTasks }: RecentTasksProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-500";
      case "medium":
        return "bg-yellow-500/20 text-yellow-500";
      case "low":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary/20 text-primary";
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-500";
      case "todo":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="border border-border rounded-xl p-6 bg-secondary/40">
      <h3 className="text-lg font-semibold mb-6">Recent Tasks</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-secondary/60 rounded-lg p-4 flex items-center justify-between hover:bg-secondary/80 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-muted-foreground">{task.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
              >
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
