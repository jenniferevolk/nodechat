var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.use(express.static(__dirname))

//detect connect/disconnect
io.on('connect',function(socket){
	console.log('connected');

	socket.on('disconnect',function(){ 
		console.log('disconnected');
	});

//communications

	//client to server
	socket.on('message', function(msg){
		console.log('message: '+msg);
		
	//server to everyone 
		 io.emit('message', msg);
	});
});



//serve page
app.get('/',function(req,res){
	res.sendFile('index.html');
});

server.listen(8080);

