"use strict";
class Player extends GameObject{
  constructor() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    super(geometry, material);

    this.handle;
    this.speed = 10;
  }

  getHandle() {
    return this.handle;
  }

  setHandle(handle) {
    this.handle = handle;
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  update(dt) {
    super.update(dt);

    var x = r?1:0;
    x -= l?1:0;
    var y = u?1:0;
    y -= d?1:0;
    if (x != 0 && y != 0) {
      var mul = Math.sin(45*(Math.PI/180));
      x *= mul;
      y *= mul;
    }
    this.translateX(x*this.speed*dt);
    this.translateY(y*dt*this.speed);
  }
});
