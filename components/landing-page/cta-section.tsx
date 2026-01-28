import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center space-y-8">
        <h2 className="text-4xl font-bold">
          Ready to Boost your productivity ?
        </h2>
        <p className="text-muted-foreground text-lg">
          Powerful features to help you manage tasks efficiently
        </p>
        <Link href="/auth/signup">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base">
            Start Free Today
          </Button>
        </Link>
      </div>
    </section>
  );
}
