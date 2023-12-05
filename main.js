let camX = 0;
let camY = -60;
let camZ = 300;
let camLookX = 0;
let camLookZ = 0;


function setup() {
  createCanvas(400, 400, WEBGL);
  background(220);
  camera(camX, camY, camZ, 
        camLookX, 0, camLookZ, 0, 5, 0);

  for (let x = -200; x < 200; x += 20) {
    for (let z = -500; z < 500; z += 20) {
      push();
      translate(x, 0, z);
      box(20);
      pop();
    }
  }
}

window.addEventListener('keydown', gotKey, false);

function gotKey(event) {
  const step = 10; // Set the step value for movement
  const rotationAngle = 0.1; // Set the angle for rotation

  switch (event.key) {
    case 'w':
      camZ -= step;
      camLookZ -= step;
      break;
    case 's':
      camZ += step;
      camLookZ += step;
      break;
    case 'a':
      camX = cos(-rotationAngle) * (camX - camLookX) - sin(-rotationAngle) * (camZ - camLookZ) + camLookX;
      camZ = sin(-rotationAngle) * (camX - camLookX) + cos(-rotationAngle) * (camZ - camLookZ) + camLookZ;
      break;
    case 'd':
      camX = cos(rotationAngle) * (camX - camLookX) - sin(rotationAngle) * (camZ - camLookZ) + camLookX;
      camZ = sin(rotationAngle) * (camX - camLookX) + cos(rotationAngle) * (camZ - camLookZ) + camLookZ;
      break;
  }
  // Redraw the scene after updating the camera position or rotation
  setup();
}
