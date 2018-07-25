// ADD MODULES
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// EXPRESS APLICATION AND SERVER
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const UsersService = require('./UsersService');

const userService = new UsersService();

//SERVING FILES
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//NEW USER LOG IN/LOG OUT AND SEND MESSAGE
io.on('connection', function(socket) {
    socket.on('join', function(name) {
        userService.addUser({
            id: socket.id,
            name
        });
    io.emit('update', {
        users: userService.getAllUsers()
        });
    });
    
    socket.on('disconnect', () => {
        userService.removeUser(socket.id);
        socket.broadcast.emit('update', {
            users: userService.getAllUsers()
        });
    });
});

//START SERVER
server.listen(3000, function(){
  console.log('listening on *:3000');
});