"use strict";
class GameObject extend THREE.Mesh {
  constructor(geometry, materials){
    super(geometry, materials);
    this.networkData;
  }
  update(dt) {
    if(this.networkData != null){

      this.position.x = this.networkData.position.x;
      this.position.y = this.networkData.position.y;
    }
  }
};
