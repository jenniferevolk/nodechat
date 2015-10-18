var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.use(express.static(__dirname))

//socket actions
io.on('connect',function(socket){
	//disconnect
	socket.on('disconnect',function(){ 
		console.log('disconnected');
	});

	//receive message
	socket.on('message', function(msg){
		console.log(socket.username+': '+msg);
		io.emit('message',{username: socket.username, message:  msg});
	});

	//new user
	socket.on('new user', function(username){
		socket.username=username;
		console.log(username+' has joined');

	});
	
	//server to everyone 
		 
	
});



//serve page
app.get('/',function(req,res){
	res.sendFile('index.html');
});

server.listen(8080);

