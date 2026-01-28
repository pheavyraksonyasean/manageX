"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log("[v0] Login successful:", formData);
      setLoading(false);
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col items-center justify-center px-4 py-8">
      {/* Back Button */}
      <Link href="/" className="absolute top-8 left-8">
        <Button
          variant="outline"
          className="border-border hover:bg-secondary bg-transparent"
        >
          ← Back
        </Button>
      </Link>

      {/* Logo and Heading */}
      <div className="text-center mb-8 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-semibold text-xl">ManageX</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="border border-border rounded-xl p-8 space-y-6 bg-secondary/50">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Sign In</h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
