'use strict';

// Global variables that are set and used
// across the application
let gl,
  program
// VAO stuff
var myVAO = null;
var myVertexBuffer = null;
var myBaryBuffer = null;
var myIndexBuffer = null;
  
// Other globals with default values;
var division1 = 3;
var division2 = 1;
var updateDisplay = true;
var anglesReset = [0.0, 0.0, 0.0];
var angles = [80.0, 0.0, 0.0];
var Tx = -1.0, Ty = 0.0, Tz = -1.0;
var angleInc = 5.0;
var translateInc = 0.1;

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

// Create a program with the appropriate vertex and fragment shaders
function initProgram() {
  const vertexShader = getShader('vertex-shader');
  const fragmentShader = getShader('fragment-shader');

  // Create a program
  program = gl.createProgram();
  // Attach the shaders to this program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
  }

  // Use this program instance
  gl.useProgram(program);
  // We attach the location of these shader values to the program instance
  // for easy access later in the code
  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  program.aBary = gl.getAttribLocation(program, 'bary');
  program.uTheta = gl.getUniformLocation (program, 'theta');
  program.translation = gl.getUniformLocation(program, 'translation'); // Get uniform location for translation
}

// Initialize arrays
let points = [];
let bary = [];
let indices = [];

// Function to add a triangle to the cube using addTriangle
function addTriangle(x0, y0, z0, x1, y1, z1, x2, y2, z2) {

    var nverts = points.length / 4;
    // Push first vertex
    points.push(x0);  bary.push(1.0);
    points.push(y0);  bary.push(0.0);
    points.push(z0);  bary.push(0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;

    // Push second vertex
    points.push(x1); bary.push(0.0);
    points.push(y1); bary.push(1.0);
    points.push(z1); bary.push(0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++

    // Push third vertex
    points.push(x2); bary.push(0.0);
    points.push(y2); bary.push(0.0);
    points.push(z2); bary.push(1.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
}

function createCube(x, y, z) {
    addTriangle(x - 0.5, y - 0.5, z - 0.5, x + 0.5, y - 0.5, z - 0.5, x + 0.5, y + 0.5, z - 0.5); // Front face
    addTriangle(x - 0.5, y - 0.5, z - 0.5, x + 0.5, y + 0.5, z - 0.5, x - 0.5, y + 0.5, z - 0.5); // Front face
    
    if (myVAO == null) myVAO = gl.createVertexArray();
      gl.bindVertexArray(myVAO);
      
      // create and bind vertex buffer
      if (myVertexBuffer == null) myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 4, gl.FLOAT, false, 0, 0);
      
      // create and bind bary buffer
      if (myBaryBuffer == null) myBaryBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bary), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aBary);
      gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);
      
      // uniform values
      gl.uniform3fv(program.uTheta, new Float32Array(angles)); // Rotation angles
      gl.uniform4f(program.translation, Tx, Ty, Tz, 0.0); // Translation values

      
      // Setting up the IBO
      if (myIndexBuffer == null) myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
          
      // indicate a redraw is required.
      updateDisplay = true;
}

function createRoad(length) {
  const roadWidth = 5.0; // Width of the road along the x-axis

  const halfWidth = roadWidth / 2.0;

  // Calculate the starting y-position
  const startY = -0.5 * length;

  for (let y = 0; y < length; y++) {
    // Calculate y-position for the current road segment
    const yPos = startY + y;

    // Create a road segment as a cube at each y-position
    for (let x = -halfWidth; x <= halfWidth; x++) {
      createCube(x, yPos, 0); // Adjust the z-position as needed
    }
  }
}

// Create a mountain using 3D Perlin Noise
function createMountain(width, height, depth) {
  const vertices = [];
  const barycentric = [];
  const indices = [];

  const scaleX = 2 / width; // Adjust scaling based on terrain width
  const scaleY = 2 / height; // Adjust scaling based on terrain height
  const scaleZ = 2 / depth; // Adjust scaling based on terrain depth

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const xCoord = x * scaleX - 1;
      const yCoord = y * scaleY - 1;
      const zCoord = perlin3D(xCoord, yCoord, 0) * depth * scaleZ; // Adjust height using perlin3D noise

      vertices.push(xCoord, yCoord, zCoord);
      barycentric.push(1, 0, 0); // Adjust as needed
    }
  }

  for (let x = 0; x < width - 1; x++) {
    for (let y = 0; y < height - 1; y++) {
      const i = x * height + y;
      indices.push(i, i + height, i + 1);
      indices.push(i + height, i + height + 1, i + 1);
    }
  }

  // Create and bind the vertex array object
  myVAO = gl.createVertexArray();
  gl.bindVertexArray(myVAO);

  // Create and bind vertex buffer
  myVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

  // Create and bind barycentric buffer
  myBaryBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barycentric), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aBary);
  gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);

  // Create index buffer
  myIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  // Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // Set flag for update
  updateDisplay = true;
}

// Simple 3D Perlin Noise function
function perlin3D(x, y, z) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);

  const u = fade(x);
  const v = fade(y);
  const w = fade(z);

  const A = p[X] + Y;
  const AA = p[A] + Z;
  const AB = p[A + 1] + Z;
  const B = p[X + 1] + Y;
  const BA = p[B] + Z;
  const BB = p[B + 1] + Z;

  return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
                          lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))),
                  lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
                          lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))));
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t, a, b) {
  return a + t * (b - a);
}

function grad(hash, x, y, z) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

// Initialize permutation array (you can create your own permutation here)
const p = [];
for (let i = 0; i < 256; i++) {
  p[i] = Math.floor(Math.random() * 256);
}
for (let i = 0; i < 256; i++) {
  const j = Math.floor(Math.random() * 256);
  const temp = p[i];
  p[i] = p[j];
  p[j] = temp;
}


  // We call draw to render to our canvas
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Bind the VAO
    gl.bindVertexArray(myVAO);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);

    // Draw to the scene using triangle primitives
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

// Entry point to our application
function init() {
  // Retrieve the canvas
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) {
    console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
    return null;
  }

  // deal with keypress
  window.addEventListener('keydown', gotKey ,false);

  // Retrieve a WebGL context
  gl = canvas.getContext('webgl2');
  // Set the clear color to be black
  gl.clearColor(0, 0, 0, 1);
    
  // some GL initialization
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  gl.clearColor(0.0,0.0,0.0,1.0)
  gl.depthFunc(gl.LEQUAL)
  gl.clearDepth(1.0)

  // Create and bind the VAO
  myVAO = gl.createVertexArray();
  gl.bindVertexArray(myVAO);

  // Read, compile, and link your shaders
  initProgram();
  
  // create and bind your current object
  //createRoad(20)

  createMountain(100,100,10);
  
  // do a draw
  draw();
}
