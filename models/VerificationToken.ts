import mongoose, { Schema, models } from "mongoose";

// Delete cached model to avoid schema conflicts
if (models.VerificationToken) {
  delete models.VerificationToken;
}

const VerificationTokenSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Auto-delete after expiry
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Index for faster lookups
VerificationTokenSchema.index({ email: 1, otp: 1 });

export default mongoose.model("VerificationToken", VerificationTokenSchema);
