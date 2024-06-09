const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Server } = socketIo;
const cors = require('cors');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        socket.broadcast.to(room).emit('message', `${username} has joined the chat`);
        console.log(`${username} joined room ${room}`);

        socket.on('chatMessage', (msg) => {
            io.to(room).emit('message', `${username}: ${msg}`);
        });

        socket.on('leaveRoom', () => {
            io.to(room).emit('message', `${username} has left the chat`);
        });
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
