import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
export function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className=" max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">ManageX</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <button className=" border border-primary rounded-lg px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
              Log In
            </button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
