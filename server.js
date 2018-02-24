const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

const connections = [];
const users = [];
const messages = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth/auth.html'));
});

app.get('/:id', (req, res) => {
  if (req.params.id === 'client.js') {
    res.sendFile(path.join(__dirname, 'client/client.js'));
  } else if (req.params.id === 'favicon.ico') {
    res.sendStatus(404);
  } else {
    users.push(req.params.id);
    res.sendFile(path.join(__dirname, 'client/index.html'));
  }
});

io.on('connection', (socket) => {

  connections.push(socket);
  console.log('Connected: sockets connected', connections.length);

  socket.on('disconnect', () => {
    const index = connections.indexOf(socket);
    connections.splice(index, 1);

    users.splice(index, 1);
    io.sockets.emit('users loaded', { users: users });

    console.log('Disconnected: sockets connected', connections.length);
  });

  socket.on('send message', (data) => {
    messages.push(data);
    io.sockets.emit('chat message', data);
  });

  socket.on('load users', () => {
    io.sockets.emit('users loaded', { users: users });
  });

  socket.on('load messages', () => {
    socket.emit('messages loaded', { messages: messages });
  });

  socket.emit('new user', { name: users[users.length - 1] });

});

server.listen(8080, () => {
  console.log('Server listening port 8080');
});
