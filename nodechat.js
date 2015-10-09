var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);

io.on('connect',function(){
	console.log('client connected...');
});

app.get('/',function(req,res){
	res.sendFile(__dirname+'/'+'index.html');
})

server.listen(8080);

