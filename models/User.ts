import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: String,
  },
  { timestamps: true },
);

export default models.User || mongoose.model("User", UserSchema);
