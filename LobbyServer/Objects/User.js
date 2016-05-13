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

  function move(x, y) {
    this.mov.x = x;
    this.mov.y = y;
  }

  function update(dt) {
    this.position.x += this.mov.x*this.speed*dt;
    this.position.y += this.mov.y*this.speed*dt;
  }

  function joinLobby(lobby) {
    disconnect();
    lobby.join(this);
  }

  function disconnect() {
    this.lobby.leave(this);
    this.lobby = null;
  }

}
