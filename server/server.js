const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env.local" }); // Load from Next.js root if running locally

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// REAL waiting queue
const waitingUsers = [];

// Mongoose Setup
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI).then(() => console.log("Socket server connected to MongoDB")).catch(err => console.error("MongoDB connection error:", err));
}

// Inline ChatSession schema for the Node server
const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  text: { type: String, required: false },
  imageUrl: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const ChatSessionSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["active", "ended"], default: "active" },
  user1: {
    name: String, gender: String, age: Number, interests: [String], socketId: String
  },
  user2: {
    name: String, gender: String, age: Number, interests: [String], socketId: String
  },
  messages: [MessageSchema],
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
}, { timestamps: true });

const ChatSession = mongoose.models.ChatSession || mongoose.model("ChatSession", ChatSessionSchema);

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // Broadcast updated count to everyone
  io.emit("online-count", io.engine.clientsCount);

  socket.on("find-partner", (data) => {
    console.log("Looking for partner:", socket.id, "Data:", data);

    const userGender = data?.gender || 'unknown';
    const guestDetails = data || {};

    // Prevent duplicate queue entries
    const alreadyWaiting = waitingUsers.find(
      user => user.id === socket.id
    );

    if (alreadyWaiting) return;

    // Look for an opposite gender partner in the queue
    const partnerIndex = waitingUsers.findIndex(u => u.gender !== userGender && u.gender !== 'unknown' && userGender !== 'unknown');

    if (partnerIndex !== -1) {
      // Found opposite gender partner
      const partner = waitingUsers.splice(partnerIndex, 1)[0];

      const roomId = `room-${socket.id}-${partner.id}`;

      socket.join(roomId);
      partner.socket.join(roomId);

      // Save session to MongoDB
      if (MONGODB_URI) {
        ChatSession.create({
          roomId,
          status: "active",
          user1: { ...guestDetails, socketId: socket.id },
          user2: { ...partner.guestDetails, socketId: partner.id },
        }).catch(err => console.error("Error creating chat session:", err));
      }

      socket.emit("matched", {
        roomId,
        stranger: true
      });

      partner.socket.emit("matched", {
        roomId,
        stranger: true
      });

      console.log("Matched:", socket.id, partner.id);
    }
    else {
      // Nobody of opposite gender online → wait
      waitingUsers.push({
        id: socket.id,
        socket,
        gender: userGender,
        guestDetails
      });

      socket.emit("waiting");

      console.log("Waiting:", socket.id);
    }
  });

  // Chat messages
  socket.on("send-message", ({ roomId, message, imageUrl }) => {
    socket.to(roomId).emit("receive-message", {
      message,
      imageUrl
    });
    
    if (MONGODB_URI) {
      ChatSession.updateOne(
        { roomId },
        { $push: { messages: { senderId: socket.id, text: message || "", imageUrl, timestamp: new Date() } } }
      ).catch(err => console.error("Error saving message:", err));
    }
  });

  // Typing indicator
  socket.on("typing", ({ roomId }) => {
    socket.to(roomId).emit("partner-typing");
  });

  socket.on("stop-typing", ({ roomId }) => {
    socket.to(roomId).emit("partner-stop-typing");
  });

  // Next stranger
  socket.on("next", () => {
    // Notify the partner in the room before leaving
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit("disconnected-stranger");
        socket.leave(room);
      }
    });
    removeUser(socket.id);
  });

  // Disconnect cleanup
  socket.on("disconnect", () => {
    // Notify partner in any active room
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit("disconnected-stranger");
        if (MONGODB_URI) {
          ChatSession.updateOne({ roomId: room }, { status: "ended", endedAt: new Date() }).catch(err => {});
        }
      }
    });
    removeUser(socket.id);
    console.log("Disconnected:", socket.id);
    // Broadcast updated count
    io.emit("online-count", io.engine.clientsCount);
  });

  function removeUser(id) {
    const index = waitingUsers.findIndex(
      user => user.id === id
    );

    if (index !== -1) {
      waitingUsers.splice(index, 1);
    }
  }
});

app.get("/", (req, res) => {
  res.send("Socket server running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
