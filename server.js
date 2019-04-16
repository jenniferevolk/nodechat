var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname));
var userlist = [];
var blocked = 0;


//socket actions
io.on('connect', function(socket) {
  var users = userlist.length;
  var username = "User " + users;
  var count = 0;
  while (userlist.indexOf(username) > -1) {
    count++;
    username = "User " + count;
  }
  userlist.push(username);
  socket.username = username;
  socket.emit('username', username);
  io.emit('add', username);
  socket.emit('userlist', userlist);
  console.log(username + " joined.");


  //user joined
  socket.on('rename', function(username) {
    if (userlist.indexOf(username) > -1 || username == null) {
      console.log('BLOCKED: invalid username: ' + username);
      socket.emit('server error', 'invalid username');
      socket.emit('username', socket.username);
    } else {

      //rename user
      console.log(socket.username + " renamed to " + username);
      userlist[userlist.indexOf(socket.username)] = username;
      io.emit('rename', {
        old: socket.username,
        new: username
      });
      socket.username = username;
    }
  });

  //user left
  socket.on('disconnect', function(username) {
    console.log(username + " left.");
    userlist.splice(userlist.indexOf(username), 1);
    io.emit('remove', username);
  });

  //receive and share user message
  socket.on('message', function(msg) {
    io.emit('message', {
      user: socket.username,
      message: msg
    });
  });

  //user typing
  socket.on('typing on', function() {
    io.emit('typing on', socket.username);
  });

  //user stopped typing
  socket.on('typing off', function() {
    io.emit('typing off', socket.username);
  });
});

//serve page
app.get('/', function(req, res) {
  res.sendFile('index.html');
});
console.log("Web Server started port 8080");
server.listen(8080);
