// Description: This is a simple Node.js server using Express and Socket.io to handle real-time communication for a chat application.
const express = require('express');
const { disconnect } = require('process');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/../')); // Serves your HTML, CSS, JS


const users = {};

io.on('connection', socket=>{
    socket.on('new-user-joined', name=>{
        console.log("New user", name);
        // console to check if user is adding
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });
    
    // on dissconection or user leaving
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
        console.log("User left", users);
    });
    
})



http.listen(8000, () => {
    console.log('Server running at http://localhost:8000');
});

// to run thid server
// use it as 'npx nodemon index.js' this lets you run the server without restarting it every time you make changes
// to run this server, you can use 'node index.js' or 'npx nodemon index.js' if you have nodemon installed
// check script in package.json i applied nodemon 