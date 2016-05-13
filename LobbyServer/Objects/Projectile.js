var MathUtil = require('../../MathUtils.js');

class Projectile {

  var start;
  var maxDistance;
  var position;
  var velocity;
  var destroy;

  constructor(position, size, velocity, maxDistance) {
    this.position = this.start = position;
    this.size = size;
    this.velocity = velocity;
    this.maxDistance = maxDistance;
    this.destroy = false;
  }

  function update(dt) {
    if (MathUtil.Vector2Distance(this.start, this.position) > maxDistance) {
      this.destroy = true;
    }
    else {
      this.position.x += this.velocity.x*dt;
      this.position.y += this.velocity.y*dt;
    }
  }

  function overlaps(aabb) {
    var o = false;
    if (aabb.w > this.size) {
      if (aabb.x > this.position.x+this.size && aabb.x+aabb.w <)
    }
    else {

    }
  }

}
