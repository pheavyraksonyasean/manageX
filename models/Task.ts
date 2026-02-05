import mongoose, { Schema, models } from "mongoose";

const TaskSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in progress", "completed"],
      default: "todo",
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export default models.Task || mongoose.model("Task", TaskSchema);
