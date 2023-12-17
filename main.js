let camX = 0;
let camY = -60;
let camZ = 300;
let camLookX = 0;
let camLookZ = 0;
let zRoad = 600;

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
  let treeHeight = 100; // Set the height of the tree
  let baseRadius = 10; // Set the base radius of the tree trunk

  push();
  translate(x, y - treeHeight / 2, z); // Adjust the starting position of the tree

  // Create the tree trunk using Perlin noise
  beginShape();
  for (let i = 0; i < treeHeight; i += 5) {
    let noiseValue = perlin.get(i * 0.1, 0); // Use Perlin noise for variation
    let radius = map(noiseValue, 0, 1, baseRadius / 2, baseRadius); // Vary the radius based on Perlin noise
    let angle = map(i, 0, treeHeight, 0, TWO_PI);

    let xOffset = cos(angle) * radius;
    let zOffset = sin(angle) * radius;
    vertex(xOffset, i - treeHeight / 2, zOffset); // Adjust the height of the trunk
  }
  endShape();

  // Draw leaves on top of the trunk
  noStroke();
  fill(34, 139, 34); // Set the color for the leaves

  let leafLength = 30; // Set the length of the leaves
  let leafWidth = 8; // Set the width of the leaves
  let leavesCount = 8; // Set the number of leaves

  // Move to the top of the trunk to draw the leaves
  translate(0, -treeHeight / 2, 0);

  for (let i = 0; i < leavesCount; i++) {
    let angle = map(i, 0, leavesCount, 0, TWO_PI);
    let xOffset = cos(angle) * baseRadius * 1.5;
    let zOffset = sin(angle) * baseRadius * 1.5;

    push();
    translate(xOffset, 0, zOffset);
    rotateY(angle + HALF_PI); // Orient the leaves outward

    // Draw leaves as ellipsoids or any other desired shape
    ellipsoid(leafLength, leafWidth, leafWidth * 0.5);
    pop();
  }
  pop();
}


function setup() {
  createCanvas(400, 400, WEBGL);
  background(220);
  camera(camX, camY, camZ, camLookX, 0, camLookZ, 0, 5, 0);

  let xoff = 0.0;
  let yoff = 0.0;
  let scl_off = 0.25;
  let counter = 0;

  for (let x = -300; x < 300; x += 20) {
    for (let z = -zRoad; z < zRoad; z += 20) {
      push();
      translate(x, 0, z);

      if (x < 60 && x > -60) {
        box(20, 20, 20);
        if ((x == 20 || x == -20) && counter > 2){
          drawTree(x, 10, z);
          counter = 0;
        }
      } else if (x < 80 && x > -80) {
        box(20, map(perlin.get(xoff, yoff), 0, 1, 0, 20), 20);
      } else if (x < 100 && x > -100) {
        box(20, map(perlin.get(xoff, yoff), 0, 1, 0, 70), 20);
      } else if (x < 120 && x > -120) {
        box(20, map(perlin.get(xoff, yoff), 0, 1, 0, 100), 20);
      } else {
        box(20, map(perlin.get(xoff, yoff), 0, 1, 0, 200), 20);
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
  const step = 20; // Set the step value for movement
  const rotationAngle = 0.1; // Set the angle for rotation

  switch (event.key) {
    case 'w':
      camZ -= step;
      camLookZ -= step;
      zRoad += step;
      break;
    case 's':
      camZ += step;
      camLookZ += step;
      zRoad -= step;
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