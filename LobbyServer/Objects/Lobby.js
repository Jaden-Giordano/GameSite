"use strict";
class Lobby {

  var server;
  var clients = [];
  var size;

  constuctor(server, size) {
    this.server = server;
    this.size = size;
  }

  update(dt) {
    for (var i = 0; i < this.clients.length; i++) {
      this.clients[i].update(dt);
    }
    if (users.length == size) {
      // Attempt a server transfer
    }
  }

  function join(client) {
    if (this.clients.length != size) {
      client.setLobby(this);
      this.clients.push(client);
    }
  }

  function leave(client) {
    var index = -1;
    for (var i = 0; i < this.clients.length; i++) {
      if (this.clients[i] == client)
        index = i;
    }
    if (index != -1) {
      this.clients.splice(index, 1);
    }
  }
});
