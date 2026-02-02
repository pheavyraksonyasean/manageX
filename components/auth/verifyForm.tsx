"use client";

import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailForm() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(
        `digit-${index + 1}`,
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(
        `digit-${index - 1}`,
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - replace with actual verification API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual resend API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCode(["", "", "", "", "", ""]);
      setError("");
      document.getElementById("digit-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col items-center justify-center p-6">
      {/* Back Button */}
      <div className="absolute top-8 left-8">
        <Link
          href="/auth/login"
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
          <h1 className="text-3xl font-bold mb-2">Verify Email</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to your email address
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="border border-border rounded-2xl p-8 space-y-6 bg-secondary/30">
            {/* Code Input */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`digit-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleBackspace(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={loading || code.join("").length !== 6}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-secondary/30 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            {/* Resend Code */}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="w-full text-sm text-primary hover:text-primary/90 font-medium transition-colors"
            >
              {loading ? "Sending..." : "Resend Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
