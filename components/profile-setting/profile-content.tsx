"use client";

import { useState, useEffect } from "react";
import { ProfileHeader } from "./profile-header";
import { ProfileInfoForm } from "./profile-info-form";
import { ChangePasswordForm } from "./change-password-form";
import { useAuth } from "@/contexts/auth-context";

interface UserData {
  name: string;
  email: string;
}

export function ProfileContent() {
  const { updateUser } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        const data = await response.json();

        if (data.success) {
          setUserData({
            name: data.user.name,
            email: data.user.email,
          });
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (data: UserData) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        const updatedData = {
          name: result.user.name,
          email: result.user.email,
        };
        setUserData(updatedData);

        updateUser({
          name: result.user.name,
          email: result.user.email,
        });

        return { success: true, message: "Profile updated successfully" };
      } else {
        return {
          success: false,
          message: result.message || "Failed to update profile",
        };
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, message: "Failed to update profile" };
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      const response = await fetch("/api/user/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, message: "Password changed successfully" };
      } else {
        return {
          success: false,
          message: result.message || "Failed to change password",
        };
      }
    } catch (error) {
      console.error("Error changing password:", error);
      return { success: false, message: "Failed to change password" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 xl:col-span-1">
          <ProfileInfoForm initialData={userData} onSave={handleSaveProfile} />
        </div>

        <div className="lg:col-span-2 xl:col-span-1">
          <ChangePasswordForm onSubmit={handleChangePassword} />
        </div>
      </div>
    </div>
  );
}
