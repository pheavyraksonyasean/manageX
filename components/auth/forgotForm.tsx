"use client";

import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - replace with actual forgot password API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground dark flex flex-col items-center justify-center p-6">
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-sm font-medium"
          >
            ← Back
          </Link>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-primary rounded-lg px-3 py-2">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              <span className="font-semibold text-primary-foreground">
                ManageX
              </span>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Check Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a password reset link to{" "}
              <span className="text-foreground font-medium">{email}</span>.
              Click the link in the email to reset your password.
            </p>
            <p className="text-sm text-muted-foreground pt-2">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <Button
              onClick={() => setSubmitted(false)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
            >
              Try Another Email
            </Button>
            <Link href="/auth/login" className="block">
              <Button
                variant="outline"
                className="w-full border-border hover:bg-secondary/50 bg-transparent py-6"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col items-center justify-center p-6">
      {/* Back Button */}
      <div className="absolute top-8 left-8">
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-sm font-medium"
        >
          ← Back
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-primary rounded-lg px-3 py-2">
            <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
            <span className="font-semibold text-primary-foreground">
              ManageX
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-border rounded-2xl p-8 space-y-6 bg-secondary/30">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
            >
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>
          </div>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
