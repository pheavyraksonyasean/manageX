"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function SingnupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      await signup(
        formData.fullName,
        formData.email,
        formData.password,
        formData.confirmPassword,
      );
      setSuccess(true);
      setTimeout(() => {
        router.push(
          `/auth/verify-email?email=${encodeURIComponent(formData.email)}`,
        );
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col items-center justify-center px-4 py-8">
      <Link href="/" className="absolute top-8 left-8">
        <Button
          variant="outline"
          className="border-border hover:bg-secondary bg-transparent"
        >
          ← Back
        </Button>
      </Link>

      <div className="text-center mb-8 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-semibold text-xl">ManageX</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">
            Start managing your tasks efficiently
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="border border-border rounded-xl p-8 space-y-6 bg-secondary/50">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Sign Up</h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="enter your name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="enter your confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          {success && (
            <div className="text-sm text-green-500 text-center">
              Account created! Check your email to verify your account.
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || success}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2"
          >
            {loading
              ? "Creating Account..."
              : success
                ? "Account Created!"
                : "Sign Up"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
