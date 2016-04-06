"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var InfiniteLoop = require('infinite-loop');

var socket = new io.Socket('localhost', {port: 27015});
socket.connect();

require('./Objects');

var port = 25565;

var lobby = null;

var il = new InfiniteLoop;

var lastUpdate = Date.now();
var dt = 0;

function update() {
  var now = Date.now();
  dt = (now - lastUpdate)*.0005;
  lastUpdate = now;

  lobby.update();
}

il.add(update);

http.listen(port, function() {
  console.log('Listening on port '+port+'...');
});

app.use(express.static('public'));

app.get('/', function(req, res) {
  if (req.body.user !== null && lobby !== null) {
    var user = lobby.getUser(req.body.user);
    if (user !== null) {
      res.sendFile(__dirname + '/index.html');
    }
  }
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  socket.on('disconnect', function() {
    if (lobby !== null) {
    }
  });
}

socket.on('connect', function(sock) {
  sock.on('isOpen', function() {
    sock.emit('returnOpen', (lobby === null)?true:false);
  });
  sock.on('sendLobby', function(lob) {
    lobby = new Lobby(lob.size);
  });
});
il.run();
