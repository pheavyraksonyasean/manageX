"use client";

import { useState } from "react";
import { AdminNotificationsHeader } from ".././notification/admin-notifications-header";
import {
  UserRegistrationCard,
  UserRegistrationNotification,
} from "./user-registration-card";

// Mock user registration notifications
const mockUserRegistrations: UserRegistrationNotification[] = [
  {
    id: "reg-1",
    userName: "user",
    email: "admingergerru24@gmail.com",
    registeredDate: "Feb 2, 2026",
    timeAgo: "2 hours ago",
  },
  {
    id: "reg-2",
    userName: "user",
    email: "admingergerru24@gmail.com",
    registeredDate: "Feb 2, 2026",
    timeAgo: "5 hours ago",
  },
  {
    id: "reg-3",
    userName: "admin user",
    email: "admin24@gmail.com",
    registeredDate: "Feb 1, 2026",
    timeAgo: "1 day ago",
  },
];

export function AdminNotificationsContent() {
  const [userRegistrations, setUserRegistrations] = useState<
    UserRegistrationNotification[]
  >(mockUserRegistrations);

  const handleDismissRegistration = (id: string) => {
    setUserRegistrations((prev) => prev.filter((notif) => notif.id !== id));
  };

  const totalNotifications = userRegistrations.length;

  return (
    <>
      <AdminNotificationsHeader
        newUsersCount={userRegistrations.length}
        totalNotifications={totalNotifications}
      />

      {/* User Registration Notifications Section */}
      {userRegistrations.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">User Registrations</h2>
          <div className="space-y-4">
            {userRegistrations.map((notification) => (
              <UserRegistrationCard
                key={notification.id}
                notification={notification}
                onDismiss={handleDismissRegistration}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-secondary/40 rounded-xl p-12 border border-border text-center">
          <p className="text-muted-foreground text-lg">
            No new user registrations
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            You're all caught up!
          </p>
        </div>
      )}
    </>
  );
}
