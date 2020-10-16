const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utility/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utility/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')))

const botName = 'Bolo-Suno Bot';

//Client connects

io.on('connection', socket=>{

    socket.on('joinRoom', ({username, room})=>{

        const user= userJoin(socket.id, username, room);

    socket.join(user.room);

//Welcomes currenct user
socket.emit('message', formatMessage(botName, 'Welcome to Chat!'));

//Broadcast when user connects to the room
socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined!`));

//send users and room info
io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room),
})
//Runs when client disconnet
socket.on('disconnect', ()=>{
    const user = userLeave(socket.id);

    if(user){
    io.to(user.room).emit('message', formatMessage(botName,`${user.username} left the chat!`));
    }
    //send users and room info
    io.to(user.room).emit('roomusers', {
    room: user.room,
    users: getRoomUsers(user.room),
})
});

    });


console.log('new connection');

//Listen for chat message

socket.on('chatMessage', (msg)=>{

const user = getCurrentUser(socket.id);
io.to(user.room).emit('message', formatMessage(user.username,msg));
});

});

const PORT = 8080 || process.env.PORT;

server.listen(PORT , () => console.log(`Server running on port ${PORT}`));