"use strict";
class Lobby {
  constuctor(size) {
    this.users = [];
    this.size = size;
  }
  userJoin(user) {
    if (this.users.length < 4) {
      this.users.push(user);
    }
  }
  userLeave(user) {
    var hanI = -1;
    for (var i = 0; i < this.users.length; i++) {
      if (user.handle == users[i].handle) {
        hanI = i;
      }
    }
    if (hanI != -1) {
      this.users.splice(hanI, 1);
    }
  }
  update(dt) {
    for (var i = 0; i < this.users.length; i++) {
      this.users[i].update();
    }
  }
  getUser(handle) {
    for (var i = 0; i < users.length; i++) {
      if (this.users[i].handle == handle)
        return this.users[i];
    }
    return null;
  }
});
