const socket = io("http://localhost:8000");


const form = document.getElementById('form');
const messageInput = document.querySelector('.sendInput');
const messageContainer = document.querySelector(".chat");

// audio alerts
const audioSend = new Audio('audio/send.mp3');
const audioRecieve= new Audio('audio/recieve.mp3');
const audioJoined = new Audio('audio/joined.mp3');
const audioLeft= new Audio('audio/left.mp3');


// who joined sends to server (socket.io)
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);


// function to append your message to the chat
const append = (message, position) => {
    // creating div
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;

    //adding div-classes for styling 
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
};


socket.on('user-joined', name => {
    append(`<b>${name}</b> joined the chat`, 'left');
    if(audioJoined) audioJoined.play();
});

// message sent to 
socket.on('receive', data => {
    append(`<b>${data.name}</b>: ${data.message}`, 'left');
    if (audioRecieve) audioRecieve.play();
});

// when user leaves
socket.on('left', name => {
    append(`<b>${name}</b> left the chat`, 'left');
    if(audioLeft) audioLeft.play();
});

// form-message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    // prevents reloading page everytime when user sends message

    const message = messageInput.value;
    if (message === "") return;
    // if message is empty, do not send
    append(`<b>You</b>: ${message}`, 'right');
    socket.emit('send', message);
    if (audioSend) audioSend.play();
    messageInput.value = ''; 
    // clear input field after sending
})

