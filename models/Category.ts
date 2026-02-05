import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      default: "#9b87f5",
    },
  },
  { timestamps: true },
);

// Compound index to ensure unique category names per user
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export default models.Category || mongoose.model("Category", CategorySchema);
