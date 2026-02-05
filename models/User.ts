import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    emoji: {
      type: String,
      default: "😊",
    },
    emojiBackground: {
      type: String,
      default: "#FF6B6B",
    },
  },
  { timestamps: true },
);

export default models.User || mongoose.model("User", UserSchema);
