var socket=io();
var nickname;
var userlist=[];
var d=new Date(),typing,n;
socket.on('connect',function(){

	//get username and join chat
	nickname=prompt('what is your nickname?');
	$('#status').html('you are now connected as '+nickname);
	socket.emit('user joined',nickname);

	//maintain userlist
	socket.on('add',function(username){
		userlist.push(username)
		updateUserList();
		if(username!==nickname){
		updateMessages("console",username+" has joined.",1);
		};
	});
	socket.on('userlist',function(list){
		userlist=list;
		updateUserList();
	});
	socket.on('remove',function(username){
		userlist.splice(userlist.indexOf(socket.username),1);
		updateUserList();
		updateMessages("console",username+" has left.");
	});

	//receive message
	socket.on('message',function(data){
		updateMessages(data.user,data.message);
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
	$('#userlist').append('<ul>'+userlist[i]+'</ul>');
	}
	$('#userlist').animate({scrollTop: $('#userlist').height()});
};
function updateMessages(user,message,system){
		if(system==1){
		$('#messages').append('<ul><i>'+message+'</i></ul>');
		} else {		
		$('#messages').append('<ul>'+user+": "+message+'</ul>');
		};
		$('#messages').animate({scrollTop: $('#messages').height()});

};

socket.on('disconnect',function(){
	$('#status').html('you are now disconnected');
});



