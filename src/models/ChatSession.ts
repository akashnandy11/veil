import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true }, // The socket ID or pseudo-ID of the sender
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSessionSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    user1: {
      name: { type: String, required: true },
      gender: { type: String, required: true },
      age: { type: Number, required: true },
      interests: { type: [String], default: [] },
      socketId: { type: String, required: true },
    },
    user2: {
      name: { type: String, required: true },
      gender: { type: String, required: true },
      age: { type: Number, required: true },
      interests: { type: [String], default: [] },
      socketId: { type: String, required: true },
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ChatSession || mongoose.model("ChatSession", ChatSessionSchema);
