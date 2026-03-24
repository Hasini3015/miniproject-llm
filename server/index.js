const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/chat', require('./routes/chat'));

// Health check
app.get('/', (req, res) => res.json({ message: 'NavAIgate API running ✓' }));

// Socket.io - Real-time chat
const chatRooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', ({ room, username }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;
    if (!chatRooms[room]) chatRooms[room] = [];
    
    socket.emit('room_history', chatRooms[room].slice(-50));
    socket.to(room).emit('user_joined', { username, message: `${username} joined the group!` });
    console.log(`${username} joined room: ${room}`);
  });

  socket.on('send_message', ({ room, message, username }) => {
    const msgData = {
      id: Date.now(),
      username,
      message,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    if (!chatRooms[room]) chatRooms[room] = [];
    chatRooms[room].push(msgData);
    if (chatRooms[room].length > 100) chatRooms[room].shift();
    io.to(room).emit('receive_message', msgData);
  });

  socket.on('disconnect', () => {
    if (socket.room && socket.username) {
      socket.to(socket.room).emit('user_left', { username: socket.username, message: `${socket.username} left the group.` });
    }
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/navaigate')
  .then(() => console.log('MongoDB connected ✓'))
  .catch(err => console.log('MongoDB error:', err.message));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`NavAIgate server running on port ${PORT}`));
