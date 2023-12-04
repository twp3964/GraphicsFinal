function setup() {
  createCanvas(400, 400, WEBGL);
  
  background(220);
  
  camera(-200, -200, -200,   // camera position (x, y, z)
         0   , -100,    0,   // camera target (look at position) (x, y, z)
         0   ,    1,    0);  // camera up axis: Y axis here

  for (let x = 0; x < width; x += 20) {
    for (let z = 0; z < height; z += 20) {
      push();
      translate(x, 0, z);  
      box(20);
      pop(); 
    }
  }
}
