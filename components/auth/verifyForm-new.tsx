"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col items-center justify-center p-6">
      <div className="absolute top-8 left-8">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-sm font-medium"
        >
          ← Back
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-primary rounded-lg px-3 py-2">
            <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
            <span className="font-semibold text-primary-foreground">
              ManageX
            </span>
          </div>
        </div>

        <div className="border border-border rounded-xl p-8 space-y-6 bg-secondary/50">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Email Verification</h1>
            <p className="text-muted-foreground text-sm">
              {loading
                ? "Verifying your email..."
                : success
                  ? "Email verified successfully!"
                  : "Verification failed"}
            </p>
          </div>

          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {success && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <p className="text-green-500">
                Your email has been verified! Redirecting to login...
              </p>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="text-sm text-red-500 text-center">{error}</div>
              <Button
                onClick={() => router.push("/auth/login")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Go to Login
              </Button>
            </div>
          )}

          {!token && !loading && (
            <div className="text-center text-muted-foreground">
              Invalid verification link.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
