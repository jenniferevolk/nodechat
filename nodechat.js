var express=require('express');
var app=express();
var server=require('http').connect(app);
var io=require('socket.io').listen(server)

io.on('connection',function(client){
	console.log('client connected...');
});
server.listen(8080);
