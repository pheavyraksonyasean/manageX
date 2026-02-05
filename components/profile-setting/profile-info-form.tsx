"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Save,
  Camera,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

interface ProfileInfoFormProps {
  initialData: ProfileData;
  onSave: (data: ProfileData) => Promise<{ success: boolean; message: string }>;
}

export function ProfileInfoForm({ initialData, onSave }: ProfileInfoFormProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Update form when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await onSave(formData);

    setIsSaving(false);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
    setMessage(null);
  };

  // Get initials from name
  const getInitials = () => {
    const names = formData.name.split(" ");
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return formData.name.charAt(0) + (formData.name.charAt(1) || "");
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

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            message.type === "success"
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {message.text}
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 pb-6 border-b border-border">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-primary-foreground uppercase">
              {getInitials()}
            </span>
          </div>
          {isEditing && (
            <button
              type="button"
              className="absolute bottom-0 right-0 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Camera className="w-4 h-4 text-foreground" />
            </button>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-foreground">
            {formData.name || "User"}
          </h3>
          <p className="text-sm text-muted-foreground">{formData.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            required
            className="w-full bg-background border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          />
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
            required
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
              disabled={isSaving}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-60"
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
