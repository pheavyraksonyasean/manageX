"use client";

import { UserPlus, X } from "lucide-react";

export interface UserRegistrationNotification {
  id: string;
  userName: string;
  email: string;
  registeredDate: string;
  timeAgo: string;
}

interface UserRegistrationCardProps {
  notification: UserRegistrationNotification;
  onDismiss: (id: string) => void;
}

export function UserRegistrationCard({
  notification,
  onDismiss,
}: UserRegistrationCardProps) {
  return (
    <div className="bg-secondary/40 rounded-xl p-5 border border-border hover:border-muted-foreground hover:bg-secondary/80 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Icon */}
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <UserPlus className="w-4.5 h-4.5 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground">
              New User Registration
            </h3>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded">
              NEW
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-foreground">{notification.userName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {notification.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {notification.registeredDate} • {notification.timeAgo}
            </p>
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(notification.id)}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
