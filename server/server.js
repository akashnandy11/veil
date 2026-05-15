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

// Store active users: socket.id -> User Object
const activeUsers = new Map();
// Users waiting to be matched: socket.id -> User Object
const waitingQueue = new Map();
// Active chats: socket.id -> partner socket.id
const activeChats = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (user) => {
    activeUsers.set(socket.id, { ...user, socketId: socket.id });
    io.emit('users_update', Array.from(activeUsers.values()).length);
  });

  socket.on('join_queue', () => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    console.log(`User ${user.username} (${user.gender}) joined queue`);
    
    // Check if there is an opposite gender waiting
    let matchFound = false;
    for (const [waitingId, waitingUser] of waitingQueue.entries()) {
      if (waitingUser.gender !== user.gender) {
        // Match found!
        matchFound = true;
        waitingQueue.delete(waitingId);
        
        // Link them
        activeChats.set(socket.id, waitingId);
        activeChats.set(waitingId, socket.id);
        
        // Create a unique room
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        socket.join(roomId);
        io.sockets.sockets.get(waitingId)?.join(roomId);
        
        // Notify both
        socket.emit('chat_started', { partner: waitingUser, roomId });
        io.to(waitingId).emit('chat_started', { partner: user, roomId });
        
        console.log(`Matched ${user.username} with ${waitingUser.username}`);
        break;
      }
    }

    if (!matchFound) {
      waitingQueue.set(socket.id, user);
      socket.emit('queue_status', { status: 'waiting' });
    }
  });

  socket.on('leave_queue', () => {
    waitingQueue.delete(socket.id);
  });

  socket.on('send_message', (data) => {
    // data: { roomId: string, message: object }
    if (data.roomId) {
      socket.to(data.roomId).emit('receive_message', data.message);
    }
  });

  socket.on('leave_chat', () => {
    handleDisconnect(socket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    handleDisconnect(socket);
    activeUsers.delete(socket.id);
    waitingQueue.delete(socket.id);
    io.emit('users_update', Array.from(activeUsers.values()).length);
  });

  function handleDisconnect(socket) {
    const partnerId = activeChats.get(socket.id);
    if (partnerId) {
      activeChats.delete(socket.id);
      activeChats.delete(partnerId);
      io.to(partnerId).emit('partner_disconnected');
    }
  }
});

const PORT = process.env.PORT || 3031;
server.listen(PORT, () => {
  console.log(`Socket.IO Server running on port ${PORT}`);
});
