const socket = io.connect('http://localhost:8080/');
let user = '';

window.onload = () => {

  const usersContainer = document.getElementById('userslist');
  const messageContainer = document.getElementById('messages');
  const btn = document.getElementById('btn');
  const messageInput = document.getElementById('input');

  messageContainer.style.height = window.innerHeight - 200 + 'px';

  socket.emit('load users');
  socket.on('users loaded', (data) => {
    let displayUsers = data.users.map((username) => {
      return (`<li>${username}</li>`);
    });
    usersContainer.innerHTML = displayUsers.join('');
  });

  socket.emit('load messages');
  socket.on('messages loaded', (data) => {
    const displayMessages = data.messages.map((message) => {
      return (`<div class="panel well">
                <h4>${message.author}</h4>
                <h5>${message.text}</h5>
              </div>`)
    });
    messageContainer.innerHtml = displayMessages.join(' ');
  });

  socket.on('chat message', (message) => {
    console.log(message);
    messageContainer.innerHTML += `<div class="panel well">
                                     <h4>${message.author}</h4>
                                     <h5>${message.text}</h5>
                                   </div>`;
  });

  socket.on('new user', (data) => {
    user = data.name;
    console.log(user);
  });

  btn.onclick = () => {
    socket.emit('send message', { text: messageInput.value, author: user });
  }

};
