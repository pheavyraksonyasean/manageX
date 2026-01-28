import { Button } from "@/components/ui/button";
import Link from "next/link";
export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center space-y-8">
        <h1 className="text-5xl sm:text-6xl font-bold text-balance">
          Organize Your <span className="text-primary">Work</span>, Simplify
          Your <span className="text-primary">Life</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          A modern task management solution designed for individuals and teams.
          Track tasks, set priorities, and never miss a deadline.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/auth/signup">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base">
              Get Start Free
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-border hover:bg-secondary px-8 py-6 text-base hover:text-secondary-foreground bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
