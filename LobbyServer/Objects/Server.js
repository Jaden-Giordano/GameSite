"use strict";
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

    this.createServer();
    this.createLobbies();
    this.createLoops();
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
      client.setLobby(this.mainLobby);
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
    lobbies.push(new Lobby(this, -1));
    lobbies.push(new Lobby(this, 5));
    lobbies.push(new Lobby(this, 5));
    lobbies.push(new Lobby(this, 5));

    this.mainLobby = lobbies[0];
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

    this.il.add(mainLoop);

    this.il.run();
  }
}
