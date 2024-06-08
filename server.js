const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        socket.broadcast.to(room).emit('message', `${username} has joined the chat`);

        socket.on('chatMessage', (msg) => {
            io.to(room).emit('message', `${username}: ${msg}`);
        });

        socket.on('leaveRoom', () => {
            io.to(room).emit('message', `${username} has left the chat`);
        });
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
