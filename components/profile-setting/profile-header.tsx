"use client";

import { User } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          Profile Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account information and security
        </p>
      </div>
    </div>
  );
}
