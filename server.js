var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.use(express.static(__dirname))
var userlist=[];
//socket actions
io.on('connect',function(socket){
	
	//user joined
	socket.on('user joined', function(username){
		if(userlist.indexOf(username)>-1 || username==null){
			console.log('invalid username: '+username);
			socket.emit('server message','invalid username');
			socket.disconnect();
		}
		socket.username=username;
		
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

	//receive user message
	socket.on('message', function(msg){
		sendMessage({user: socket.username, message: msg});
	});
	
	//send user message
	function sendMessage(message){
		console.log(message);
		io.emit('message',message);
	};

	//user typing
	socket.on('typing on',function(){
		io.emit('typing on',socket.username);
	});

	//user stopped typing
	socket.on('typing off',function(){
		io.emit('typing off',socket.username);
	});	 	
	

	

});



//serve page
app.get('/',function(req,res){
	res.sendFile('index.html');
});
server.listen(8080);

