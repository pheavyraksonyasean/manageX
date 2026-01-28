import { CheckCircle2, BarChart3, Bell, Shield } from "lucide-react";

const featuresList = [
  {
    icon: CheckCircle2,
    title: "Task Management",
    description:
      "Create, update, and organize tasks with ease. Set priorities and track progress.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Visualize your progress with intuitive charts and statistics.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Never miss a deadline with real-time notifications and reminders.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Secure authentication with admin and user role management.",
  },
];

export function Features() {
  return (
    <section className="bg-secondary/30 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">
            Everything you need to stay organized
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features to help you manage tasks efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="border border-border rounded-xl p-8 space-y-4 hover:border-primary/50 transition-colors bg-secondary/50"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
