var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.use(express.static(__dirname))

//detect connect
io.on('connect',function(socket){
	console.log('connected');
socket.on('disconnect',function(){
	console.log('disconnected');
	});
});


//serve page
app.get('/',function(req,res){
	res.sendFile('index.html');
});

server.listen(8080);

