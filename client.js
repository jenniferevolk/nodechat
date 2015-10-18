var socket=io();
var nickname;

socket.on('connect',function(){

	//connected
	$('#status').html('you are now connected');
	nickname=prompt('what is your nickname?');
	socket.emit('new user',nickname);

	//send message
	$('form').submit(function(event){
	socket.emit('message',$('#send').val())
	$("#send").val("");
	event.preventDefault();

	});


	//incoming message
	socket.on('message',function(msg){
	console.log(msg.username+":"+msg.message);
	$('#messages').append($('<ul>').text(msg.username+":"+msg.message));
	});


});
socket.on('disconnect',function(){
	$('#status').html('you are now disconnected');
});



