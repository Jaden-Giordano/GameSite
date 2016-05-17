function createTile(type, x, y, color){
var tile;
switch (type) {
    case 'floor':
          tile = new floor(x,y,color);
         return tile
        break;
    case 'wall':
        tile = new wall(x,y,color)
        break;
}

return tile
}

class tiles extends GameObject{
  constructor(geometry, materials) {
    super(geometry, materials);
    this.collision = false;
    this.animated = false;
    this.breakable = false;
    this.health = null;
    this.flamable = false;
    this.image;
  }
  break() {

  }
};

class floor extends tiles {
  constructor(x, y, color) {

    if (!color) {
      color = 0x00FF00;
    }
    super(new THREE.PlaneGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color:  color}));

  }
};

class wall extends tiles {
  constructor(x, y, color) {
    if(!color){
      color = 0x00FFFF;
    }
    super(new THREE.BoxGeometry(1, 0.5, 1.2), new THREE.MeshBasicMaterial({color: color}));
    this.health = 100;
    this.collision = true;
  }
};
