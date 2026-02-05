"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { authenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!authenticated) {
        router.push("/auth/login");
      } else if (requireAdmin && user?.role !== "admin") {
        router.push("/user/dashboard");
      }
    }
  }, [authenticated, loading, requireAdmin, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authenticated || (requireAdmin && user?.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}
