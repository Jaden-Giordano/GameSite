"use strict";
class GameObject{
  constructor(geometry, materials){
    this.mesh = new THREE.Mesh(geometry, materials);
    this.networkData;
  }
  update(dt) {
    if(this.networkData != null){

      this.position.x = this.networkData.position.x;
      this.position.y = this.networkData.position.y;
    }
  }
};
