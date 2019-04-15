var socket = io();
var nickname;
var userlist = [];
var textarea = $('#send');
var usersTyping = [];
var typing = 0;
var lastTypedTime;


socket.on('connect', function() {


  //receive userlist
  socket.on('userlist', function(list) {
    $('#status').html('you are now connected');
    userlist = list;
    updateUserList();
  });

  socket.on('username', function(username) {
    nickname = username;
    $('#nick').val(username);

  });
  socket.on('rename', function(data) {
    userlist[userlist.indexOf(data.old)] = data.new;
    updateMessages("", data.old + " is now known as " + data.new, 1);
    updateUserList();
  });

  //add user
  socket.on('add', function(username) {
    userlist.push(username);
    updateUserList();
    if (username !== nickname) {
      updateMessages("", username + " has joined.", 1);
    }
  });


  //remove user
  socket.on('remove', function(username) {
    userlist.splice(userlist.indexOf(socket.username), 1);
    updateUserList();
    updateMessages("", username + " has left.", 1);
  });

  //receive message
  socket.on('message', function(data) {
    updateMessages(data.user, data.message);
  });

  //send message
  $('#send').keypress(function(event) {
    if (event.which == 13) {
      socket.emit('message', $('#send').val());
      $("#send").val("");
      event.preventDefault();
    }
  });

  //Get nickname
  $('#nick').keypress(function(event) {
    if (event.which == 13) {
      nickname = $("#nick").val();
      socket.emit('rename', nickname);
      event.preventDefault();
    }
  });


  //another person is typing
  socket.on('typing on', function(username) {
    if (username != nickname) {
      typingMessageON(username);
    }
  });

  //another person stopped typing
  socket.on('typing off', function(username) {
    if ($.inArray(username, usersTyping) > -1 && username != nickname) {
      typingMessageOFF(username);
    }
  });


  //watch for keypresses and refesh our typing status
  setInterval(refreshTypingStatus, 100);
  textarea.keypress(updateLastTypedTime);
  textarea.blur(refreshTypingStatus);

});

//if we started typing let them know ONCE and set the timer
function updateLastTypedTime() {
  if (typing == 0) {
    socket.emit('typing on', '');
    typing = 1;
  }
  lastTypedTime = new Date();
}

//if we haven't pressed a key for over a second let them know we stopped
function refreshTypingStatus() {
  if (typing == 1 && new Date().getTime() - lastTypedTime > 500) {
    socket.emit('typing off', '');
    typing = 0;
  }
}

function typingMessageON(username) {
  if (username != null) {
    usersTyping.push(username);
  }
  if (usersTyping.length == 0) {
    return;
  }
  if (usersTyping.length == 1) {
    isAre = " is typing";
  } else {
    isAre = " are typing";
  }
  $('#messages').append('<ul id="temporaryMessage"><i>' + usersTyping + isAre + '</i></ul>');
  $('#messages').animate({
    scrollTop: $('#messages').height()
  });
}


function typingMessageOFF(username) {
  if (username != null) {
    usersTyping.splice(username, 1);
  }
  $('#temporaryMessage').remove();
}



function updateUserList() {
  var numusers = userlist.length;
  userlist.sort();
  $('#userlist').empty();
  for (var i = 0; i < numusers; i++) {
    $('#userlist').append('<ul>' + userlist[i] + '</ul>');
  }
  $('#userlist').animate({
    scrollTop: $('#userlist').height()
  });
}

function updateMessages(user, message, system) {
  typingMessageOFF();
  if (system == 1) {
    $('#messages').append('<ul><i>' + message + '</i></ul>');
  } else {
    $('#messages').append('<ul><b>' + user + ": </b>" + message + '</ul>');
  }
  $('#messages').animate({
    scrollTop: $('#messages').height()
  });
  typingMessageON();
}

socket.on('disconnect', function() {
  $('#status').html('you are now disconnected');
});
