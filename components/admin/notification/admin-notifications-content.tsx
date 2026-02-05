"use client";

import { useState, useEffect } from "react";
import { AdminNotificationsHeader } from ".././notification/admin-notifications-header";
import {
  UserRegistrationCard,
  UserRegistrationNotification,
} from "./user-registration-card";

export function AdminNotificationsContent() {
  const [userRegistrations, setUserRegistrations] = useState<
    UserRegistrationNotification[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "/api/admin/notifications?type=user_registration",
        );
        const data = await response.json();

        if (data.success) {
          const formattedNotifications = data.notifications.map(
            (notif: any) => ({
              id: notif.id,
              userName: notif.userName,
              email: notif.userEmail,
              registeredDate: new Date(notif.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              ),
              timeAgo: getTimeAgo(new Date(notif.createdAt)),
              isRead: notif.isRead,
            }),
          );
          setUserRegistrations(formattedNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Helper function to calculate time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }
  };

  const handleDismissRegistration = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUserRegistrations((prev) => prev.filter((notif) => notif.id !== id));
      }
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  const totalNotifications = userRegistrations.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

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
