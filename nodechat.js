var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
var jquery=require('jquery');
app.use(express.static(__dirname))

//detect connect
io.on('connect',function(client){
	console.log('connected');
});


//serve page
app.get('/',function(req,res){
	res.sendFile('index.html');
});

server.listen(8080);

