import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional if using Google OAuth
    },
    age: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },
    interests: {
      type: [String],
      default: [],
    },
    college: {
      type: String,
      required: false,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
