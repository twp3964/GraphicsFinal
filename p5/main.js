let camX = 0;
let camY = -60;
let camZ = 300;
let camLookX = 0;
let camLookZ = 0;
let zRoad = 600;

let cubeTexture;
let treeTexture;
let leafTexture;

'use strict';
let perlin = {
    rand_vect: function(){
        let theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    },
    dot_prod_grid: function(x, y, vx, vy){
        let g_vect;
        let d_vect = {x: x - vx, y: y - vy};
        if (this.gradients[[vx,vy]]){
            g_vect = this.gradients[[vx,vy]];
        } else {
            g_vect = this.rand_vect();
            this.gradients[[vx, vy]] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    },
    smootherstep: function(x){
        return 6*x**5 - 15*x**4 + 10*x**3;
    },
    interp: function(x, a, b){
        return a + this.smootherstep(x) * (b-a);
    },
    seed: function(){
        this.gradients = {};
        this.memory = {};
    },
    get: function(x, y) {
        if (this.memory.hasOwnProperty([x,y]))
            return this.memory[[x,y]];
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        //interpolate
        let tl = this.dot_prod_grid(x, y, xf,   yf);
        let tr = this.dot_prod_grid(x, y, xf+1, yf);
        let bl = this.dot_prod_grid(x, y, xf,   yf+1);
        let br = this.dot_prod_grid(x, y, xf+1, yf+1);
        let xt = this.interp(x-xf, tl, tr);
        let xb = this.interp(x-xf, bl, br);
        let v = this.interp(y-yf, xt, xb);
        this.memory[[x,y]] = v;
        return v;
    }
}
perlin.seed();

function drawTree(x, y, z) {
  let treeHeight = 100; 
  let baseRadius = 10; 

  push();
  translate(x, y - treeHeight / 2, z); // Adjust the starting position of the tree

  // Create the tree trunk using Perlin noise
  beginShape();
  for (let i = 0; i < treeHeight; i += 5) {
    let noiseValue = perlin.get(i * 0.1, 0); 
    let radius = map(noiseValue, 0, 1, baseRadius / 4, baseRadius); 
    let angle = map(i, 0, treeHeight, 0, TWO_PI);

    let xOffset = cos(angle) * radius;
    let zOffset = sin(angle) * radius;
    vertex(xOffset, i - treeHeight / 2, zOffset); // Adjust the height of the trunk
  }
  endShape();

  // Draw leaves on top of the trunk
  noStroke();
  fill(34, 139, 34); // Set the color for the leaves

  let leavesCount = 8; 
  let leafWidth = 8;
  let leafHeight = 20; 

  // Move to the top of the trunk to draw the leaves
  translate(0, -treeHeight / 2, 0);

  for (let i = 0; i < leavesCount; i++) {
    let angleX = random(-PI, PI); 
    let angleZ = random(-PI, PI); 
    let xOffset = cos(angleX) * baseRadius * 1.5;
    let zOffset = sin(angleZ) * baseRadius * 1.5;

    push();
    translate(xOffset, 0, zOffset);
    rotateY(random(TWO_PI));
    rotateX(angleX);
    rotateZ(angleZ); 

    // Draw ellipsoid leaves
    texture(leafTexture);
    ellipsoid(leafWidth, leafWidth * 0.5, leafHeight);
    pop();
  }
  pop();
}

function preload() {
  // Load textures for cubes and trees
  cubeTexture = loadImage('textures/neonTexture.jpg');
  treeTexture = loadImage('textures/woodTexture.jpg');
  leafTexture = loadImage('textures/leafTexture.jpeg');
}


function setup() {
  createCanvas(800, 800, WEBGL);
  background(220);
  camera(camX, camY, camZ, camLookX, 0, camLookZ, 0, 5, 0);

  let xoff = 0.0;
  let yoff = 0.0;
  let scl_off = 0.1;
  let counter = 0;

  for (let x = -300; x < 300; x += 20) {
    for (let z = -zRoad; z < zRoad; z += 20) {
      push();
      translate(x, 0, z);

      if (x < 60 && x > -60) {
        box(20, 20, 20);
        if ((x == 20 || x == -20) && counter > 2){
          texture(treeTexture);
          drawTree(x, 10, z);
          counter = 0;
        }
      } 
      else {
        let boxHeight = map(perlin.get(xoff, yoff), 0, 1, 0, 200); 
        texture(cubeTexture);
        box(20, boxHeight, 20);
      }
      pop();
      counter += 1;
      yoff += scl_off;
    }
    xoff += scl_off;
  }
}

window.addEventListener('keydown', gotKey, false);

function gotKey(event) {
  // Chanable variables for the camera
  const step = 20; 
  const rotationAngle = 0.1; 

  switch (event.key) {
    case 'w':
      camZ -= step;
      camLookZ -= step;
      zRoad += step;
      break;
    case 's':
      camZ += step;
      camLookZ += step;
      zRoad += step;
      break;
    case 'a':
      camX = cos(-rotationAngle) * (camX - camLookX) - sin(-rotationAngle) * (camZ - camLookZ) + camLookX;
      camZ = sin(-rotationAngle) * (camX - camLookX) + cos(-rotationAngle) * (camZ - camLookZ) + camLookZ;
      break;
    case 'd':
      camX = cos(rotationAngle) * (camX - camLookX) - sin(rotationAngle) * (camZ - camLookZ) + camLookX;
      camZ = sin(rotationAngle) * (camX - camLookX) + cos(rotationAngle) * (camZ - camLookZ) + camLookZ;
      break;
    case 'r':
      camX = 0;
      camZ = 300;
      camLookX = 0;
      camLookZ = 0;
      zRoad = 500;
      break;
  }
  // Redraw the scene after updating the camera position or rotation
  setup();
}