const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//Let us get username and room from url

const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true,
});

console.log(username);

const socket = io();

//Joining chatroom 
socket.emit('joinRoom', {username, room});

//Get room and users
socket.on('roomUsers', ({room, users})=>{
outputRoomName(room);
outputUsers(users);
});

socket.on('message', message=>{
    console.log("server said: " + message);
    outputMessage(message);

    //scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

//message submission event listen

chatForm.addEventListener('submit', (e)=>{
e.preventDefault();

//We take input the message
const msg = e.target.elements.msg.value;

//console.log(msg);

socket.emit('chatMessage', msg);

// clear input after submit
e.target.elements.msg.value = '';
e.target.elements.msg.focus();

});

//Output message in chat box

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span> ${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM

function outputRoomName(room){
roomName.innerText = room;
}

//Add users to DOM

function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}