const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (user) => {
    activeUsers.set(socket.id, { ...user, socketId: socket.id });
    io.emit('users_update', Array.from(activeUsers.values()));
  });

  socket.on('send_message', (data) => {
    console.log("Message received", data);
    // data should contain { to: socketId/roomId, message: {...} }
    if (data.to) {
      io.to(data.to).emit('receive_message', data.message);
    } else {
      socket.broadcast.emit('receive_message', data.message);
    }
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    io.emit('users_update', Array.from(activeUsers.values()));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3031;
server.listen(PORT, () => {
  console.log(`Socket.IO Server running on port ${PORT}`);
});
