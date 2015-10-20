var socket=io();
var nickname;
var userlist=[];
var textarea=$('#send');
var usersTyping=[];
var typing=0;
var lastTypedTime;


socket.on('connect',function(){

	//get username and join chat
	nickname=prompt('what is your nickname?');
	$('#status').html('you are now connected as '+nickname);
	socket.emit('user joined',nickname);

	//receive userlist
	socket.on('userlist',function(list){
		userlist=list;
		updateUserList();
	});

	//another user joined
	socket.on('add',function(username){
		userlist.push(username)
		updateUserList();
		if(username!==nickname){
		updateMessages("",username+" has joined.",1);
		};
	});


	//another user left
	socket.on('remove',function(username){
		userlist.splice(userlist.indexOf(socket.username),1);
		updateUserList();
		updateMessages("",username+" has left.",1);
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
	
	//another person is typing
	socket.on('typing on',function(username){
		console.log("typing on"+username);
		typingMessageON(username);

	});

	//another person stopped typing
	socket.on('typing off',function(username){
		if ($.inArray(username,usersTyping)>-1){
			typingMessageOFF(username);
		}
	});

	//are we typing?
	//
	

//typingStatus.html('nobody is typing');
//	console.log("off");


setInterval(refreshTypingStatus,100);
textarea.keypress(updateLastTypedTime);
textarea.blur(refreshTypingStatus);
});

//if we started typing let them know ONCE and set the timer
function updateLastTypedTime(){
	if(typing==0){
		socket.emit('typing on','');
		typing=1;
	}
	lastTypedTime=new Date();
}

//if we haven't pressed a key for over a second let them know we stopped
function refreshTypingStatus(){
	if(typing==1 && new Date().getTime()-lastTypedTime>5000){
		socket.emit('typing off','');
		typing=0;
	}
}

function typingMessageON(username){
	usersTyping.push(username);
	console.log(usersTyping);
	if(usersTyping.length==1){
		var isAre=" is typing";
	} else {
		var isAre=" are typing";
	}
	$('#messages').append('<ul id="temporaryMessage"><i>'+usersTyping+isAre+'</i></ul>');		
	$('#messages').animate({scrollTop: $('#messages').height()});
}


function typingMessageOFF(username){
	usersTyping.splice(username,1);
	$('#temporaryMessage').remove();
}



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


