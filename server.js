var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.use(express.static(__dirname))
var userlist=[];
var userRoom={};
//socket actions
io.on('connect',function(socket){

	//user joined
	socket.on('user joined', function(username){
		socket.username=username;
		userRoom.username.room="main";
		//update userlists
				
		socket.emit('userlist',userlist);
		userlist.push(username);
		io.emit('add',username);
		
	});	
		
	//user left
	socket.on('disconnect',function(){
		userlist.splice(userlist.indexOf(socket.username),1);
		io.emit('remove',socket.username);
	});

	//receive message
	socket.on('message', function(msg){
		sendMessage({user: socket.username, message: msg});
	});
	
	//send message
	function sendMessage(message){
		console.log(message);
		io.sockets.in(userRoom.socket.username.room).emit('message',message);
	};	 	


socket.on('room', function(room){
	socket.join(room);
	userRoom.socket.username.room=room
		});
	

});



//serve page
app.get('/',function(req,res){
	res.sendFile('index.html');
});
server.listen(8080);

