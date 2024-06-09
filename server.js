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

    socket.on('joinRoom', (data) => {
        socket.join(data.room);
        io.to(data.room).emit('receiveMessage', data);
        console.log(`${data.username} joined room ${data.room}`);
    });

    socket.on('sendMessage', (data) => {
        io.to(data.room).emit('receiveMessage', data);
        console.log(data);
    });

    socket.on('leaveRoom', (data) => {
        io.to(data.room).emit('receiveMessage', data);
        console.log("test")
        socket.leave()
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
