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

    function multiply(out, a, b) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    
        var b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
        var b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
        var b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
        var b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];
    
        out[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
        out[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
        out[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
        out[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
    
        out[4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
        out[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
        out[6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
        out[7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
    
        out[8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
        out[9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
        out[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
        out[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
    
        out[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
        out[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
        out[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
        out[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
    
        return out;
    }

    
    function perspective(out, fovy, aspect, near, far) {
        var f = 1.0 / Math.tan(fovy / 2);
        out[0] = f / aspect;
        out[5] = f;
        out[10] = (far + near) / (near - far);
        out[11] = -1;
        out[14] = (2 * far * near) / (near - far);
        out[15] = 0;
        return out;
    }
    
    function translate(out, v, scalar) {
        out[12] = v[0] * scalar[0];
        out[13] = v[1] * scalar[1];
        out[14] = v[2] * scalar[2];
    }

    gl.useProgram(program);

    // // Define vertices and texture coordinates
    // var vertices = new Float32Array([
    //     -0.5, -0.5, 0.0, 1.0,
    //      0.5, -0.5, 1.0, 1.0,
    //      0.0,  0.5, 0.5, 0.0,


    //      -1.5, -1.5, 0.0, 1.0,
    //      1.5, -1.5, 1.0, 1.0,
    //      1.0,  1.5, 0.5, 0.0
    // ]);

    // Update the vertices to include z coordinates
    var vertices = new Float32Array([
        -0.0, 0.0, 0.0, 0.0, 1.0,  // Vertex 1
        0.5, -0.5, 0.0, 1.0, 1.0,  // Vertex 2
        -0.5,  0.5, 0.0, 0.5, 0.0,   // Vertex 3
    ]);
///////
    // // Set up perspective projection
    // var projectionMatrix = mat4.create();
    // var fieldOfView = Math.PI / 4;
    // var aspect = canvas.width / canvas.height;
    // var zNear = 0.1;
    // var zFar = 10.0;
    // mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);


    // Set up perspective projection
    var projectionMatrix = new Float32Array(16);
    var fieldOfView = Math.PI / 4;
    var aspect = canvas.width / canvas.height;
    var zNear = 0.1;
    var zFar = 10.0;
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // Set up model-view matrix (position the camera)
    var modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -2.0]);

    // Multiply the projection and model-view matrices
    var modelViewProjectionMatrix = mat4.create();
    mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

    // Get the uniform location for the model-view-projection matrix
    var mvpLocation = gl.getUniformLocation(program, "u_modelViewProjection");
    gl.uniformMatrix4fv(mvpLocation, false, modelViewProjectionMatrix);
 ////////

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
        gl.uniform1i(textureLocation, 0); // Set the texture unit to 0
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
