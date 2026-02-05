import crypto from "crypto";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getTokenExpiry(hours: number = 24): Date {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now;
}

export function getOTPExpiry(minutes: number = 1): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}
