class Lobby {

  var server;
  var clients = [];
  var size;

  var type; // 0 = Main Lobby (Can only move into other lobbies), 1 = Queue Lobby (Used to queue players for a game)

  var name;

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

  function allClientsReady() {
    for (var i = 0; i < this.clients.length; i++) {
      if (!this.clients.ready)
        return false;
    }
    return true;
  }
}
