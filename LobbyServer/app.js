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
    if (Vector2Distance(this.start, this.position) > maxDistance) {
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

    this.socket.on("move", this.netmove.bind(this));

    this.socket.on("getUsers", this.netGetUsers.bind(this));
  }

  netGetUsers() {
    if (this.lobby !== null) {
      this.socket.emit('returnLobby', this.lobby.getUsers());
    }
  }

  netmove(data) {
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
    this.lobby = lob;
  }

  disconnect() {
    if (this.lobby !== null) {
      this.lobby.leave(this);
    }
    this.lobby = null;
  }

  getContainer() {
    return {position:this.position, speed:this.speed, ready:this.ready};
  }

}


class Lobby {

  constructor(server, size) {
    this.server = server;
    this.size = size;
    this.name = '';

    this.clients = new Array();
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
    if (this.clients.length != this.size) {
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

  getUsers() {
    var carr = new Array();

    for (var i = 0; i < this.clients.length; i++) {
      carr.push(this.clients[i].getContainer());
    }

    return carr;
  }

  getContainer() {
    var cliArContainer = new Array();

    for (var i in this.clients) {
      cliArContainer.push(i.getContainer())
    }
    return {size:this.size, name:this.name, }
  }

}


var InfiniteLoop = require('infinite-loop');

class Server {

  constructor(http, app, io, port) {
    this.port = port;
    this.app = app;
    this.io = io;
    this.http = http;

    this.clients = new Array();

    this.createLoops();
    this.createLobbies();
    this.createServer();
  }

  listen() {
    console.log('New server listening on port: '+this.port+'.')
  }

  get(req, resp) {
    resp.sendFile(__dirname+"/index.html");
  }

  onDisconnect(client) {
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
  }

  onConnection(socket) {
    var client = new Client(socket);
    client.joinLobby(this.mainLobby);
    this.clients.push(client, this);

    socket.on('disconnect', this.onDisconnect.bind(this));
  }

  createServer() {
    this.http.listen(this.port, this.listen.bind(this));

    this.app.use(express.static('public'));

    this.app.get('/', this.get.bind(this));

    this.io.on('connection', this.onConnection.bind(this));
  }

  createLobbies() {
    this.lobbies = new Array();

    this.lobbies[0] = new Lobby(this, -1);
    this.lobbies[1] = new Lobby(this, 5);

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
