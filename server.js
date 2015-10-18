var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.use(express.static(__dirname))

//socket actions
io.on('connect',function(socket){

	//user joined
	socket.on('user joined', function(username){
		socket.username=username;
		sendMessage(username+' has joined');
	});	

	//user left
	socket.on('disconnect',function(){ 
		sendMessage(socket.username+' has left');
	});

	//receive message
	socket.on('message', function(msg){
		sendMessage(socket.username+': '+msg);
	});
	
	//send message
	function sendMessage(message){
		console.log(message);
		io.emit('message',message);
	};	 	
});



//serve page
app.get('/',function(req,res){
	res.sendFile('index.html');
});
server.listen(8080);

