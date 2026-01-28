"use client";

import { useState } from "react";
import { ProfileHeader } from "./profile-header";
import { ProfileInfoForm } from "./profile-info-form";
import { ChangePasswordForm } from "./change-password-form";

// Mock user data - in real app, this would come from auth context/API
const mockUserData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  bio: "Product designer and developer. Love creating beautiful and functional user experiences.",
};

export function ProfileContent() {
  const [userData, setUserData] = useState(mockUserData);

  const handleSaveProfile = (data: typeof mockUserData) => {
    setUserData(data);
    // In real app, you would call an API here
    console.log("Profile saved:", data);
  };

  const handleChangePassword = (
    currentPassword: string,
    newPassword: string,
  ) => {
    // In real app, you would call an API here
    console.log("Password change requested");
  };

  return (
    <div className="space-y-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <div className="lg:col-span-2 xl:col-span-1">
          <ProfileInfoForm initialData={userData} onSave={handleSaveProfile} />
        </div>

        {/* Change Password Form */}
        <div className="lg:col-span-2 xl:col-span-1">
          <ChangePasswordForm onSubmit={handleChangePassword} />
        </div>
      </div>
    </div>
  );
}
