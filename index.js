const express = require('express');
const { log } = require('node:console');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);
  socket.on('message', (msg) => {
    console.log('message: ' + msg);

    io.emit('sent_messages_to_all_user',msg)
  });
  socket.on('typing', () => {
    socket.broadcast.emit('showing_typing_status')
  });
  socket.on('stop_typing', () => {
    socket.broadcast.emit('clear_typing_status')
  });
  socket.on('disconnect', () => {
    console.log("left chat ",socket.id);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});