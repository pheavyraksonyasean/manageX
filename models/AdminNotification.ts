import mongoose, { Schema, models } from "mongoose";

const AdminNotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "user_registration",
        "task_created",
        "task_deleted",
        "category_created",
      ],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

// Index for efficient querying
AdminNotificationSchema.index({ isRead: 1, createdAt: -1 });
AdminNotificationSchema.index({ type: 1, createdAt: -1 });

export default models.AdminNotification ||
  mongoose.model("AdminNotification", AdminNotificationSchema);
