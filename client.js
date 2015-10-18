var socket=io();
var nickname;
var $messages=$('.messages')
socket.on('connect',function(){

	//get username and join chat
	nickname=prompt('what is your nickname?');
	$('#status').html('you are now connected');
	socket.emit('user joined',nickname);

	//receive message
	socket.on('message',function(message){
	console.log(message);
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
socket.on('disconnect',function(){
	$('#status').html('you are now disconnected');
});



