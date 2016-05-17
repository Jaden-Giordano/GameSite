var scene;
var camera;
var renderer;
var pointlight;

var lastUpdate = Date.now();
var p = new Player();
var users = [];
var players = [];
var gameObjects = [];

var width = window.innerWidth;
var height = window.innerHeight;
// array include function

function includes(k) {
  for(var i=0; i < this.length; i++){
    if( this[i] === k || ( this[i] !== this[i] && k !== k ) ){
      return true;
    }
  }
  return false;
}

// Base Functions

function init() {
  scene = new THREE.Scene();
  var aspect = width/height;

  camera = new THREE.OrthographicCamera(-25, 25, 25/aspect, -25/aspect, 1, 1000);
  //camera = new THREE.PerspectiveCamera(45, window.innerWidth-2/window.innerHeight-2, 0.1, 1000);
  scene.add(camera);
  camera.rotation.x = 25 * Math.PI / 180
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width-4, height-4);
  document.body.appendChild(renderer.domElement);

  //var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  //scene.add( light );
  pointlight = new THREE.PointLight( 0xff0000)
  p.mesh.position.set(0,0,0);
  scene.add(p.mesh);
  pointlight.position.set(0 ,-3,0);
  scene.add(pointlight);
  var wall = createTile('wall', 0, 0);
  scene.add(wall.mesh);
  var floor = createTile('floor', 0, 0);
  scene.add(floor.mesh);
  camera.position.z = 10;
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );
  document.addEventListener( 'mousemove', showcoords, false );

  socket.on('returnHandle', function(data){
    p.setHandle(data);
  });

  socket.on('returnUsers', function(data) {
    users = data;
var handlestorem = [];
var presenthandles = [];
var allhandles = [];
    for (var i = 0; i < users.length; i++) {
      if(users[i].handle != p.getHandle()){
                  var exists = false;
                  allhandles.push(users[i].handle);
        for (var j = 0; j < gameObjects.length; j++){
          presenthandles.push(gameObjects[j].networkData.handle);
          if(users[i].handle == gameObjects[j].networkData.handle){
            exists = true;
            gameObjects[j].networkData = users[i];
          }
        }
        if(!exists){
          var temp = new GameObject(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000})));
          temp.networkData = users[i];
          gameObjects.push(temp);
          scene.add(temp.mesh);
          temp.mesh.position.x = users[i].position.x;
          temp.mesh.position.y = users[i].position.y;
        }
      } else {
        p.networkData = users[i];
      }
    }

    for(var i = 0; i < presenthandles.length; i++){
      if(!allhandles.includes(presenthandles[i])){
        handlestorem.push(presenthandles[i]);
      }
    }

if(handlestorem.length > 0){
    for(var i = 0; i < gameObjects.length; i++){
      for(var j = 0; j < handlestorem.length; j++){
       if(gameObjects[i].networkData.handle == handlestorem[j]){
       // console.log(handlestorem[j]);
          scene.remove(gameObjects[i].mesh);
          gameObjects.splice(i, 1);
       }
      }
    }
  }

  });
  socket.emit('getHandle');
  socket.emit('getUsers');
}


function up() {
  var now = Date.now() * 0.0005;
  var dt = now - lastUpdate;
  lastUpdate = now;
  update(dt);
}

function update(dt) {
    p.update(dt);
    socket.emit('getUsers');
    //pointlight.position.set(p.mesh.position);

    for(var i = 0; i < gameObjects.length; i++){
      gameObjects[i].update();
    }
}

function render() {
  requestAnimationFrame(render);

  up();

  renderer.render(scene, camera);
}
init();
render();

// move in game, then call the move function (socket.io), interpolate between what the server has from where the client is (client->server)
var u = false;
var l = false;
var r = false;
var d = false;



function onKeyDown ( event ) {
  var tempu = u;
  var templ = l;
  var tempd = d;
  var tempr = r;

  var keyup = 38;
  var keyW = 87;
  var keyleft = 37;
  var keyA = 65;
  var keyright = 39;
  var keyD = 68;
  var keydown = 40;
  var keyS = 83;
  //38 up 87 w
  //39 right 68 d
  //40 down 83 s
  //37 left 65 a
  if (event.keyCode == keyup || event.keyCode == keyW){
    u = true;
  }
  if (event.keyCode == keydown || event.keyCode == keyS){
    d = true;
  }
  if (event.keyCode == keyleft || event.keyCode == keyA){
    l = true;
  }
  if (event.keyCode == keyright || event.keyCode == keyD){
    r = true;
  }
  if (u != tempu || l != templ || d != tempd || r != tempr) {
  socket.emit('move', {up:u,down:d,left:l,right:r});
  }

}

function onKeyUp ( event ) {
  var tempu = u;
  var templ = l;
  var tempd = d;
  var tempr = r;
  if(event.keyCode == 38 || event.keyCode == 87){
    u = false
  }
  if(event.keyCode == 37 || event.keyCode == 65){
    l = false
  }
  if(event.keyCode == 39 || event.keyCode == 68){
    r = false
  }
  if(event.keyCode == 40 || event.keyCode == 83){
    d = false
  }
  if(u != tempu || l != templ || d != tempd || r != tempr){
  socket.emit('move', {up:u,down:d,left:l,right:r});
  }
}

function showcoords(event){
  var vector = new THREE.Vector3();

vector.set(
    ( event.clientX / window.innerWidth ) * 2 - 1,
    - ( event.clientY / window.innerHeight ) * 2 + 1,
    0.5 );

vector.unproject( camera );

var dir = vector.sub( camera.position ).normalize();

var distance = - camera.position.z / dir.z;

var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
}