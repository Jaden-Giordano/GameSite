class User{
  constructor(handle) {
    this.handle = handle;
    this.position = {x: 0, y: 0};
    this.speed = 10;
    this.move = {x:0, y:0}
    this.inQueue = false;
  }
  move(x, y) {
    this.move.x = x;
    this.move.y = y;
  }
};
