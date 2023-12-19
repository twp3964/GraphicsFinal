window.onload = function () {
    // Get the WebGL context
    var canvas = document.getElementById("webgl-canvas-texture1");
    var gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }

    // Define vertex and fragment shaders
    var vertexShaderSource = `
        attribute vec4 a_position;
        attribute vec2 a_texcoord;
        varying vec2 v_texcoord;
        uniform mat4 u_modelViewProjection;
        
        void main() {
            gl_Position = u_modelViewProjection * a_position;
            v_texcoord = a_texcoord;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        uniform sampler2D u_texture;
        varying vec2 v_texcoord;
        void main() {
            gl_FragColor = texture2D(u_texture, v_texcoord);
        }
    `;

    // Compile shaders
    function compileShader(source, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader compilation failed:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    var vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    var fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    // Link shaders into a program
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Unable to link the program:", gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);

    var vertices = new Float32Array([
        -0.0, 0.0, 0.0, 0.0, 1.0,  // Vertex 1
        0.5, -0.5, 0.0, 1.0, 1.0,  // Vertex 2
        -0.5,  0.5, 0.0, 0.5, 0.0,   // Vertex 3
    ]);
    // Set up perspective projection
    var projectionMatrix = new Float32Array(16);
    var fieldOfView = Math.PI / 4;
    var aspect = canvas.width / canvas.height;
    var zNear = 0.1;
    var zFar = 10.0;
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    var modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -2.0]);
    var modelViewProjectionMatrix = mat4.create();
    mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);
    var mvpLocation = gl.getUniformLocation(program, "u_modelViewProjection");
    gl.uniformMatrix4fv(mvpLocation, false, modelViewProjectionMatrix);

   // Clear the canvas
   gl.clear(gl.COLOR_BUFFER_BIT);
   gl.clearColor(0.0, 0.0, 0.0, 0.0);

    // Create a buffer and put the vertices in it
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
    var textureLocation = gl.getUniformLocation(program, "u_texture");

    // Set up vertex attribute pointers
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(texcoordLocation);

    // Create a texture
    var texture = gl.createTexture();
    var image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(textureLocation, 0); 
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    image.src = 'texture-floor.jpg'; // Change the path to your image

        // Define vertices and attributes for the second shape (a box)
        var vertices2 = new Float32Array([
            // Define vertices for a square
            -0.5, -0.5,
             0.5, -0.5,
            -0.5,  0.5,
            
            -0.5,  0.5,
             0.5, -0.5,
             0.5,  0.5
        ]);
        
        // Create buffer for the second shape (box)
        var vertexBuffer2 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
        gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);
        
        // Get attribute locations for the second shape (box)
        var positionLocation2 = gl.getAttribLocation(program, "a_position");
        gl.vertexAttribPointer(positionLocation2, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation2);
        
        // Create a texture for the second shape (box)
        var texture2 = gl.createTexture();
        var image2 = new Image();
        image2.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture2);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
            // Set the transformation for the second shape (box) to position it in -x direction
            var modelViewMatrix2 = mat4.create();
            mat4.translate(modelViewMatrix2, modelViewMatrix2, [-2.0, 0.0, -2.0]); // Translate to -x direction
            var modelViewProjectionMatrix2 = new Float32Array(16);
            mat4.multiply(modelViewProjectionMatrix2, projectionMatrix, modelViewMatrix2);
            var mvpLocation2 = gl.getUniformLocation(program, "u_modelViewProjection");
            gl.uniformMatrix4fv(mvpLocation2, false, modelViewProjectionMatrix2);
        
            // Draw the second shape (box)
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };
        image2.src = 'leafTexture.jpeg'; // Path to the second texture
        

 

};
