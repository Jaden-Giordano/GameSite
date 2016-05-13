"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function Vector2Distance(start, end) {
  return Math.sqrt(Math.pow((end.x - start.x), 2)+Math.pow((end.y - start.y), 2));
}

class Projectile {

  constructor(position, size, velocity, maxDistance) {
    this.position = this.start = position;
    this.size = size;
    this.velocity = velocity;
    this.maxDistance = maxDistance;
    this.destroy = false;
  }

  update(dt) {
    if (MathUtil.Vector2Distance(this.start, this.position) > maxDistance) {
      this.destroy = true;
    }
    else {
      this.position.x += this.velocity.x*dt;
      this.position.y += this.velocity.y*dt;
    }
  }

  overlaps(aabb) {
    var o = false;
    if (aabb.w > this.size) {
      //if (aabb.x > this.position.x+this.size && aabb.x+aabb.w <)
    }
    else {

    }
  }

}


class Client {
  constructor(socket, server) {
    this.socket = socket;
    this.server = server;
    this.position = {x: 0, y: 0};
    this.speed = 10;
    this.mov = {x:0, y:0};
    this.lobby = null;
    this.ready = false;

    this.socket.on("move", function(data) {
      var x = (data.right)?1:0;
      x -= (data.left)?1:0;
      var y = (data.up)?1:0;
      y -= (data.down)?1:0;
      if (x != 0 && y != 0) {
        var mul = Math.sin(45*(Math.PI/180));
        x *= mul;
        y *= mul;
      }
      this.move(x, y);
    });

    this.socket.on("getUsers", function() {
      var u = getUserByHandle(handle);
      if (u != null) {
        if (this.lobby !== null) {
          this.socket.emit('returnLobby', this.lobby);
        }
      }
    });
  }

  move(x, y) {
    this.mov.x = x;
    this.mov.y = y;
  }

  update(dt) {
    this.position.x += this.mov.x*this.speed*dt;
    this.position.y += this.mov.y*this.speed*dt;
  }

  joinLobby(lob) {
    this.disconnect();
    lob.join(this);
    this.lobby = lobby;
  }

  disconnect() {
    if (this.lobby !== null) {
      this.lobby.leave(this);
    }
    this.lobby = null;
  }

}


class Lobby {

  //var server;
  //var clients = [];
  //var size;

  //var type; // 0 = Main Lobby (Can only move into other lobbies), 1 = Queue Lobby (Used to queue players for a game)

  //var name;

  constuctor(server, size, type) {
    this.server = server;
    this.size = size;
    this.type = type;
    this.name = '';
  }

  update(dt) {
    for (var i = 0; i < this.clients.length; i++) {
      this.clients[i].update(dt);
    }
    if (this.type != 0 && allClientsReady()) {
      // Attempt a server transfer
    }
  }

  join(client) {
    if (this.clients.length != size) {
      client.setLobby(this);
      this.clients.push(client);
    }
  }

  leave(client) {
    var index = -1;
    for (var i = 0; i < this.clients.length; i++) {
      if (this.clients[i] == client)
        index = i;
    }
    if (index != -1) {
      this.clients.splice(index, 1);
    }
  }

  allClientsReady() {
    for (var i = 0; i < this.clients.length; i++) {
      if (!this.clients.ready)
        return false;
    }
    return true;
  }
}


var InfiniteLoop = require('infinite-loop');

class Server {

/*
  var http;
  var app;
  var io;
  var port;

  var il;
  var lastUpdate;
  var dt;

  var clients = [];
  var lobbies = [];

  var mainLobby;
*/
  constructor(http, app, io, port) {
    this.port = port;
    this.app = app;
    this.io = io;
    this.http = http;

    this.createLoops();
    this.createLobbies();
    this.createServer();
  }

  createServer() {
    this.http.listen(this.port, function() {
      console.log('New server listening on port: '+this.port+'.')
    });

    this.app.use(express.static('public'));

    this.app.get('/', function(req, resp) {
      resp.sendFile(__dirname+"/index.html");
    });

    this.io.on('connection', function(socket) {
      var client = new Client(socket);
      client.joinLobby(this.mainLobby);
      this.clients.push(client, this);

      socket.on('disconnect', function() {
        var index = -1;
        for (var i = 0; i < this.clients.length; i++) {
          if (this.clients[i] == client) {
            index = i;
          }
        }
        if (index != -1) {
          this.clients[i].disconnect();
          this.clients.splice(index, 1);
        }
      })
    });
  }

  createLobbies() {
    this.lobbies = new Array();

    this.lobbies[0] = new Lobby(this, -1);
    this.lobbies[1] = new Lobby(this, 5);

    console.log(this.lobbies[0].size);
    this.mainLobby = this.lobbies[0];
  }

  createLoops() {
    this.il = new InfiniteLoop;

    this.lastUpdate = Date.now();
    this.dt = 0;

    this.mainLoop = function() {
      var now = Date.now();
      this.dt = (now - this.lastUpdate)*.0005;
      this.lastUpdate = now;

      for (var i = 0; i < this.lobbies; i++) {
        this.lobbies[i].update(this.dt);
      }
    }

    this.il.add(this.mainLoop);

    this.il.run();
  }
}


var hport = 27015;

var server = new Server(http, app, io, hport);
