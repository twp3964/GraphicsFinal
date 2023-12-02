let gl; // Define the global variable to hold the WebGL rendering context
let program; // Variable to hold the shader program

function start() {
  const canvas = document.getElementById("webgl-canvas");
  gl = canvas.getContext("webgl2");

  if (!gl) {
    alert("WebGL isn't available");
    return;
  }

  // Vertex shader source code
  const vsSource = document.getElementById("vertex-shader").textContent;

  // Fragment shader source code
  const fsSource = document.getElementById("fragment-shader").textContent;

  // Initialize shaders and program
  initProgram(vsSource, fsSource);

  // Cube vertices and indices (Replace these with your cube data)
  const vertices = [
    // Front face
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
  
    // Back face
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
    -0.5,  0.5, -0.5,
  
    // Top face
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
  
    // Bottom face
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,
  
    // Right face
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
  
    // Left face
    -0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5,
    -0.5, -0.5, -0.5,
  ];
  

  const indices = [
    // Front face
    0, 1, 2,
    2, 3, 0,
  
    // Back face
    4, 5, 6,
    6, 7, 4,
  
    // Top face
    8, 9, 10,
    10, 11, 8,
  
    // Bottom face
    12, 13, 14,
    14, 15, 12,
  
    // Right face
    16, 17, 18,
    18, 19, 16,
  
    // Left face
    20, 21, 22,
    22, 23, 20,
  ];
  

  // Setup buffers and draw the cube
  setupBuffersAndDraw(vertices, indices);
}

function initProgram(vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
    return null;
  }

  gl.useProgram(program);

  // Specify the attribute location for 'aVertexPosition'
  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  if (program.aVertexPosition === -1) {
    console.error('Failed to get the storage location of aVertexPosition');
    return null;
  }
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function setupBuffersAndDraw(vertices, indices) {
  // Create buffer for vertices
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Set up attribute pointers for vertex position
  const vertexPositionAttribLocation = program.aVertexPosition; // Attribute location for vertex position
  gl.vertexAttribPointer(
    vertexPositionAttribLocation,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(vertexPositionAttribLocation);

  // Create buffer for indices
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  // Draw the cube
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}


window.onload = start;
