"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Save,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Check,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

type ActiveTab = "profile" | "password";

// Cartoon avatar options - using different colors and styles
const AVATAR_OPTIONS = [
  { id: "avatar1", bg: "#FF6B6B", emoji: "😊" },
  { id: "avatar2", bg: "#4ECDC4", emoji: "😎" },
  { id: "avatar3", bg: "#45B7D1", emoji: "🤗" },
  { id: "avatar4", bg: "#96CEB4", emoji: "😄" },
  { id: "avatar5", bg: "#FFEAA7", emoji: "🥳" },
  { id: "avatar6", bg: "#DDA0DD", emoji: "😇" },
  { id: "avatar7", bg: "#98D8C8", emoji: "🤠" },
  { id: "avatar8", bg: "#F7DC6F", emoji: "😺" },
  { id: "avatar9", bg: "#BB8FCE", emoji: "🦊" },
  { id: "avatar10", bg: "#85C1E9", emoji: "🐼" },
  { id: "avatar11", bg: "#F8B500", emoji: "🦁" },
  { id: "avatar12", bg: "#00CED1", emoji: "🐸" },
];

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-[420px] max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0 mb-0">
          <DialogTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-1 px-3 sm:px-5 py-2.5 border-b border-border">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "password"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {activeTab === "profile" ? (
            <ProfileInfoTab onClose={() => onOpenChange(false)} />
          ) : (
            <ChangePasswordTab onClose={() => onOpenChange(false)} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Profile Info Tab Component
function ProfileInfoTab({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<ProfileData>({
    fullName: "Username",
    email: "username@gmail.com",
    phone: "",
    bio: "",
    avatar: "avatar1",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarId: string) => {
    setFormData((prev) => ({ ...prev, avatar: avatarId }));
    setShowAvatarPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: "Username",
      email: "username@gmail.com",
      phone: "",
      bio: "",
      avatar: "avatar1",
    });
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  const currentAvatar =
    AVATAR_OPTIONS.find((a) => a.id === formData.avatar) || AVATAR_OPTIONS[0];

  return (
    <div className="space-y-3">
      {/* Avatar Section */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => isEditing && setShowAvatarPicker(!showAvatarPicker)}
            disabled={!isEditing}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl transition-transform hover:scale-105 disabled:hover:scale-100"
            style={{ backgroundColor: currentAvatar.bg }}
          >
            {currentAvatar.emoji}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 sm:w-6 sm:h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-foreground" />
            </button>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
            {formData.fullName}
          </h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
            {formData.email}
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors shrink-0 px-2 py-1"
          >
            Edit
          </button>
        )}
      </div>

      {/* Avatar Picker */}
      {showAvatarPicker && isEditing && (
        <div className="p-3 bg-secondary/50 rounded-lg border border-border">
          <p className="text-[11px] sm:text-xs font-medium text-foreground mb-2">
            Choose your avatar
          </p>
          <div className="grid grid-cols-6 gap-2">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleAvatarSelect(avatar.id)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all hover:scale-110 ${
                  formData.avatar === avatar.id
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : ""
                }`}
                style={{ backgroundColor: avatar.bg }}
              >
                {avatar.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[11px] sm:text-xs font-medium text-foreground flex items-center gap-1">
            <User className="w-3 h-3 text-muted-foreground" />
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-background border border-border rounded-lg py-1.5 sm:py-2 px-2.5 sm:px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[11px] sm:text-xs font-medium text-foreground flex items-center gap-1">
            <Mail className="w-3 h-3 text-muted-foreground" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-background border border-border rounded-lg py-1.5 sm:py-2 px-2.5 sm:px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-[11px] sm:text-xs font-medium text-foreground flex items-center gap-1">
            <Phone className="w-3 h-3 text-muted-foreground" />
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter phone number"
            className="w-full bg-background border border-border rounded-lg py-1.5 sm:py-2 px-2.5 sm:px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <label className="text-[11px] sm:text-xs font-medium text-foreground">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            rows={2}
            placeholder="Tell us about yourself..."
            className="w-full bg-background border border-border rounded-lg py-1.5 sm:py-2 px-2.5 sm:px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed resize-none transition-colors"
          />
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-2 pt-1.5">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg border border-border text-xs sm:text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Save
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

// Change Password Tab Component
function ChangePasswordTab({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  const passwordRequirements = [
    { label: "8+ characters", met: newPassword.length >= 8 },
    { label: "Lowercase", met: /[a-z]/.test(newPassword) },
    { label: "Uppercase", met: /[A-Z]/.test(newPassword) },
    { label: "Number", met: /[0-9]/.test(newPassword) },
    { label: "Special char", met: /[^a-zA-Z0-9]/.test(newPassword) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordStrength < 3) {
      setError("Please choose a stronger password");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-3">
      {success && (
        <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-500 text-[11px] sm:text-xs flex items-center gap-1.5">
          <Check className="w-3 h-3" />
          Password changed successfully!
        </div>
      )}

      {error && (
        <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 text-[11px] sm:text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Current Password */}
        <div className="space-y-1">
          <label className="text-[11px] sm:text-xs font-medium text-foreground flex items-center gap-1">
            <Lock className="w-3 h-3 text-muted-foreground" />
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-background border border-border rounded-lg py-1.5 sm:py-2 px-2.5 sm:px-3 pr-8 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1">
          <label className="text-[11px] sm:text-xs font-medium text-foreground flex items-center gap-1">
            <Lock className="w-3 h-3 text-muted-foreground" />
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-background border border-border rounded-lg py-1.5 sm:py-2 px-2.5 sm:px-3 pr-8 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
            >
              {showNewPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Password Strength */}
          {newPassword && (
            <div className="mt-1.5 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-full transition-colors ${
                        i < passwordStrength
                          ? strengthColors[passwordStrength - 1]
                          : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-medium ${
                    passwordStrength <= 1
                      ? "text-red-500"
                      : passwordStrength <= 2
                        ? "text-yellow-500"
                        : passwordStrength <= 3
                          ? "text-blue-500"
                          : "text-green-500"
                  }`}
                >
                  {strengthLabels[passwordStrength - 1] || ""}
                </span>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-3 gap-x-2 gap-y-0.5">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-0.5 text-[9px] sm:text-[10px] ${
                      req.met ? "text-green-500" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex items-center justify-center shrink-0 ${
                        req.met ? "bg-green-500" : "bg-secondary"
                      }`}
                    >
                      {req.met && <Check className="w-1 h-1 text-white" />}
                    </div>
                    <span className="truncate">{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-[11px] sm:text-xs font-medium text-foreground flex items-center gap-1">
            <Lock className="w-3 h-3 text-muted-foreground" />
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`w-full bg-background border rounded-lg py-1.5 sm:py-2 px-2.5 sm:px-3 pr-8 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                confirmPassword && confirmPassword !== newPassword
                  ? "border-red-500"
                  : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-[9px] sm:text-[10px] text-red-500">
              Passwords do not match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
        >
          {isSubmitting ? (
            "Updating..."
          ) : (
            <>
              <Shield className="w-3.5 h-3.5" />
              Update Password
            </>
          )}
        </button>
      </form>
    </div>
  );
}
