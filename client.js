var socket=io();
var nickname;
var userlist=[];
socket.on('connect',function(){

	//get username and join chat
	nickname=prompt('what is your nickname?');
	$('#status').html('you are now connected');
	socket.emit('user joined',nickname);

	//maintain userlist
	socket.on('add',function(username){
		userlist.push(username)
		updateUserList();
	});
	socket.on('userlist',function(list){
		userlist=list;
		updateUserList();
	});
	socket.on('remove',function(username){
		userlist.splice(userlist.indexOf(socket.username),1);
		updateUserList();
	});

	//receive message
	socket.on('message',function(message){
		$('#messages').append($('<ul>').text(message));
		$('#messages').animate({scrollTop: $('#messages').height()});
	});

	//send message
	$('form').submit(function(event){
		socket.emit('message',$('#send').val())
		$("#send").val("");
		event.preventDefault();
	});
});

function updateUserList(){
	var numusers=userlist.length;
	userlist.sort();
	$('#userlist').empty();
	for(var i=0;i<numusers;i++){	
	$('#userlist').append($('<ul>').text(userlist[i]));
	}
	$('#userlist').animate({scrollTop: $('#userlist').height()});
};
	

socket.on('disconnect',function(){
	$('#status').html('you are now disconnected');
});



