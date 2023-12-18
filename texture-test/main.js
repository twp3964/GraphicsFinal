window.onload = function () {
    // Get the WebGL context
    var canvas = document.getElementById("webgl-canvas");
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
        -0.5, -0.5, 0.0, 0.0, 1.0,  // Vertex 1
            0.5, -0.5, 0.0, 1.0, 1.0,  // Vertex 2
            0.0,  0.5, 0.0, 0.5, 0.0,   // Vertex 3
    ]);
///////
    // Set up perspective projection
    var projectionMatrix = mat4.create();
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

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};
