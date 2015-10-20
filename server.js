var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.use(express.static(__dirname))
var userlist=[];
var blocked=0;
//socket actions
io.on('connect',function(socket){
	
	//user joined
	socket.on('user joined', function(username){
		if(userlist.indexOf(username)>-1 || username==null){
			console.log('BLOCKED: invalid username: '+username);
			socket.emit('server alert','invalid username');
			socket.disconnect();
			blocked=1;	
		} else {
			socket.username=username;
			console.log(username+" joined.");
			//update userlists
			socket.emit('userlist',userlist);
			userlist.push(username);
			io.emit('add',username);
		}
	});
		
	//user left
	socket.on('disconnect',function(username){
			console.log(username+" left.");
			userlist.splice(userlist.indexOf(username),1);
			io.emit('remove',username);
	});

	//receive user message
	socket.on('message', function(msg){
		sendMessage({user: socket.username, message: msg});
	});
	
	
	//user typing
	socket.on('typing on',function(){
		io.emit('typing on',socket.username);
	});

	//user stopped typing
	socket.on('typing off',function(){
		io.emit('typing off',socket.username);
	});	 	
		
});

function sendMessage(message){
	console.log(message);
	io.emit('message',message);
};


//serve page
app.get('/',function(req,res){
	res.sendFile('index.html');
});
server.listen(8080);

