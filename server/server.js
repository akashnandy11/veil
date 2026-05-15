const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

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

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("find-partner", () => {
    console.log("Looking for partner:", socket.id);

    // Prevent duplicate queue entries
    const alreadyWaiting = waitingUsers.find(
      user => user.id === socket.id
    );

    if (alreadyWaiting) return;

    // If someone waiting → connect instantly
    if (waitingUsers.length > 0) {
      const partner = waitingUsers.shift();

      const roomId = `room-${socket.id}-${partner.id}`;

      socket.join(roomId);
      partner.socket.join(roomId);

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
      // Nobody online → wait
      waitingUsers.push({
        id: socket.id,
        socket
      });

      socket.emit("waiting");

      console.log("Waiting:", socket.id);
    }
  });

  // Chat messages
  socket.on("send-message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive-message", {
      message
    });
  });

  // Next stranger
  socket.on("next", () => {
    removeUser(socket.id);
    socket.emit("disconnected-stranger");
  });

  // Disconnect cleanup
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("Disconnected:", socket.id);
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
