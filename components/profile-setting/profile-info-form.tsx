"use client";

import { useState } from "react";
import { User, Mail, Phone, Save, Camera } from "lucide-react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

interface ProfileInfoFormProps {
  initialData: ProfileData;
  onSave: (data: ProfileData) => void;
}

export function ProfileInfoForm({ initialData, onSave }: ProfileInfoFormProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSave(formData);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  return (
    <div className="bg-secondary/40 rounded-xl border border-border p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">
          Personal Information
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 pb-6 border-b border-border">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">
              {formData.firstName.charAt(0)}
              {formData.lastName.charAt(0)}
            </span>
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
              <Camera className="w-4 h-4 text-foreground" />
            </button>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-foreground">
            {formData.firstName} {formData.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">{formData.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-background border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-background border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-background border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter your phone number"
            className="w-full bg-background border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            rows={3}
            placeholder="Tell us about yourself..."
            className="w-full bg-background border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed resize-none transition-colors"
          />
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
