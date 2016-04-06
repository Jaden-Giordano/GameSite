"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var InfiniteLoop = require('infinite-loop');

require('./Objects/User.js');
require('./Objects/Lobby.js');

var port = 27015;

var lastUpdate = Date.now();
var dt = 0;

var il = new InfiniteLoop;

function loop() {
  var now = Date.now();
  dt = (now - lastUpdate)*.0005;
  lastUpdate = now;

  for (var i = 0; i < users.length; i++) {
    users[i].position.x += users[i].move.x*users[i].speed*dt;
    users[i].position.y += users[i].move.y*users[i].speed*dt;
  }
}


function queue() {
  for (var i = 0; i < lobbies.lengthl; i++) {
    lobbies[i].update();
  }
}

il.add(loop, []);
il.add(queue, []);


http.listen(port, function() {
  console.log('Listening on localhost:'+port+'.');
});

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


// Userdata
var currentHandle = 0;
var users = [];


// Lobby data
var lobbies = [];

io.on('connection', function(socket) {
  console.log('User connected creating data...');
  var handle = getNextHandle();

  users.push(new User(handle));

  console.log('User data created: {Handle: '+handle+'}');
  socket.on('disconnect', function() {
    var hi = getIdOfHandle(handle);
    users.splice(hi, 1);
    console.log('User diconnnected: {Handle'+handle+'}');
  });

  socket.on('move', function(data) {
    var u = getUserByHandle(handle);
    if (u !== null && data !== null) {
      var x = (data.right)?1:0;
      x -= (data.left)?1:0;
      var y = (data.up)?1:0;
      y -= (data.down)?1:0;
      if (x != 0 && y != 0) {
        var mul = Math.sin(45*(Math.PI/180));
        x *= mul;
        y *= mul;
      }
      u.nmove(x, y);
    }
  });

  socket.on('getUsers', function() {
    var u = getUserByHandle(handle);
    if (u != null) {
      if (u.inLobby && u.lobby !== null) {
        socket.emit('returnLobby', u.lobby);
      }
      else {
        socket.emit('returnUsers', users);
      }
    }
  });

  socket.on('getHandle', function() {
    socket.emit('returnHandle', handle);
  });

  socket.on('joinQueue', function() {
    var u = getUserByHandle(handle);
    if (u !== null) {
      for (var i = 0; i < lobbies.length; i++) {
        if (lobbies[i].isOpen()) {
          u.inLobby = true;
          u.lobby = lobbies[i];
          lobbies[i].userJoin(u);
        }
      }
    }
  });

  socket.on('leaveQueue', function() {
    var u = getUserByHandle(handle);
    if (u !== null) {
      u.inLobby = false;
      u.lobby = null;
    }
  });
});

function getNextHandle() {
  var c = currentHandle;
  currentHandle++;
  return c;
}

function getIdOfHandle(handle) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].handle == handle)
      return i;
  }
}

function getUserByHandle(handle) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].handle == handle)
      return users[i];
  }
  return null;
}

il.run();
