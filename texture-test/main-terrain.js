document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("webgl-canvas-terrian");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }

    function initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    function loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    const vsSource = `
        attribute vec4 aVertexPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `;

    const fsSource = `
        precision mediump float;
        void main(void) {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Green color for the ground
        }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // POSITION GENERATOR for floor

    //left to right and then right to left
    const gridSize = 100; // Adjust the size of the grid as needed
    const tileSize = 1; // Size of each tile

    const positions = [];

    let verticies = 0;

    for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
        for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
            const x0 = x * tileSize;
            const z0 = z * tileSize;
            const x1 = (x + 1) * tileSize;
            const z1 = (z + 1) * tileSize;

            const divFactor = 10;
    
            // Add Perlin noise to the Y values to create a mountainous appearance
            let y00 = perlinNoise(x0 / divFactor, z0 / divFactor);
            let y01 = perlinNoise(x0 / divFactor, z1 / divFactor);
            let y10 = perlinNoise(x1 / divFactor, z0 / divFactor);
            let y11 = perlinNoise(x1 / divFactor, z1 / divFactor);
            
            // dont' allow negative y values
            if (y00 < 0){
                y00 = 0;
            }

            if (y01 < 0){
                y01 = 0;
            }

            if (y10 < 0){
                y10 = 0;
            }

            if (y11 < 0){
                y11 = 0;
            }

            const scl1 = 0.0;
            const scl5 = 1.25;

            // makes the "road" in the middle flat
            if (x < 2 && x > -2){
                y00 = y00 * scl1;
                y01 = y01 * scl1;
                y10 = y10 * scl1;
                y11 = y11 * scl1;
            }else{
                y00 = y00 * scl5;
                y01 = y01 * scl5;
                y10 = y10 * scl5;
                y11 = y11 * scl5;
            }

            positions.push(x0, y00, z0);
            positions.push(x1, y10, z0);
            positions.push(x0, y01, z1);
    
            positions.push(x0, y01, z1);
            positions.push(x1, y10, z0);
            positions.push(x1, y11, z1);

            verticies+=6;
        }
    }

    let triangleVerticiesStart = verticies;
    let triangleVerticiesEnd = 0;

    // Grass heights
    const minGrassHeight = 0.1;
    const maxGrassHeight = 0.5;

    for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
        for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
            if ((x === -1 || x === 1) && z >= -100 && z <= 100 && x % 1 === 0) {

                const bladeCount = 5; 
                for (let i = 0; i < bladeCount; i++) {
                    // Setting grass
                    const xOffset = (Math.random() - 0.5) * 0.5;
                    const zOffset = (Math.random() - 0.5) * 0.5;
                    const x0 = (x + xOffset) * tileSize;
                    const z0 = (z + zOffset) * tileSize;

                    // Height and Width of grass
                    const x1 = x0 - 0.05; 
                    const z1 = z0 + 0.1;  
                    
                    // Set the Y-values for the grass blade
                    const grassHeight = Math.random() * (maxGrassHeight - minGrassHeight) + minGrassHeight;
                    const y00 = 0;
                    const y01 = 0 + grassHeight;

                    // Push triangles
                    positions.push(x0, y00, z0);
                    positions.push(x1, y01, z1);
                    positions.push(x0 + 0.05, y00, z0);

                    triangleVerticiesEnd += 3; 
                }
            }
        }
    }



    function normalize(vec) {
        const length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
        if (length > 0) {
            vec[0] /= length;
            vec[1] /= length;
            vec[2] /= length;
        }
        return vec;
    }

    function subtractVectors(a, b) {
        return [
            a[0] - b[0],
            a[1] - b[1],
            a[2] - b[2]
        ];
    }
    
    function cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }
    


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        },
    };


    function lookAt(out, eye, center, up) {
        const zAxis = normalize(subtractVectors(eye, center));
        const xAxis = normalize(cross(up, zAxis));
        const yAxis = cross(zAxis, xAxis);
    
        out[0] = xAxis[0];
        out[1] = xAxis[1];
        out[2] = xAxis[2];
        out[3] = 0;
        out[4] = yAxis[0];
        out[5] = yAxis[1];
        out[6] = yAxis[2];
        out[7] = 0;
        out[8] = zAxis[0];
        out[9] = zAxis[1];
        out[10] = zAxis[2];
        out[11] = 0;
        out[12] = eye[0];
        out[13] = eye[1];
        out[14] = eye[2];
        out[15] = 1;
    
        return out;
    }
    
    function perspective(out, fov, aspect, near, far) {
        const f = 1.0 / Math.tan(fov / 2);
        const nf = 1 / (near - far);
    
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = 2 * far * near * nf;
        out[15] = 0;
    
        return out;
    }

    function translate(out, tx, ty, tz) {
        // Extract the translation components
        const txComponent = tx;
        const tyComponent = ty;
        const tzComponent = tz;
    
        // Update the translation components without affecting the rotation elements
        out[12] += out[0] * txComponent + out[4] * tyComponent + out[8] * tzComponent;
        out[13] += out[1] * txComponent + out[5] * tyComponent + out[9] * tzComponent;
        out[14] += out[2] * txComponent + out[6] * tyComponent + out[10] * tzComponent;
        out[15] += out[3] * txComponent + out[7] * tyComponent + out[11] * tzComponent;
    
        return out;
    }
    
    function rotateY(out, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const a00 = out[0], a10 = out[4], a20 = out[8], a30 = out[12];
        const a01 = out[1], a11 = out[5], a21 = out[9], a31 = out[13];
    
        // Perform rotation without altering the translation elements
        out[0] = a00 * c - a20 * s;
        out[1] = a01 * c - a21 * s;
        out[4] = a10 * c + a30 * s;
        out[5] = a11 * c + a31 * s;
        out[8] = a20 * c + a00 * s;
        out[9] = a21 * c + a01 * s;
        out[12] = a30 * c - a10 * s;
        out[13] = a31 * c - a11 * s;
    
        return out;
    }
    

    let cameraPosition = [0, 5, 5];
    let cameraRotation = 0;

    // Event listener for keydown events
    document.addEventListener('keydown', handleKeyDown);

    function handleKeyDown(event) {
        const key = event.key.toLowerCase();
    
        // Calculate the camera's forward direction based on the rotation angle
        const forwardX = Math.sin(cameraRotation);
        const forwardZ = -Math.cos(cameraRotation);
    
        // Translate the camera 
        if (key === 'w') {
            cameraPosition[0] -= forwardX * 0.1; // Move forward in X
            cameraPosition[2] += forwardZ * 0.1; // Move forward in Z
        } else if (key === 's') {
            cameraPosition[0] += forwardX * 0.1; // Move backward in X
            cameraPosition[2] -= forwardZ * 0.1; // Move backward in Z
        }
    
        // Rotate around Y-axis 
        if (key === 'a') {
            cameraRotation += 0.05; 
        } else if (key === 'd') {
            cameraRotation -= 0.05;
        }
    }

    
    
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.0 / 256, 0.0 / 256, 0.0 / 256, 0.0);
    
        const modelViewMatrix = new Float32Array(16);
        const projectionMatrix = new Float32Array(16);
    
        const eye = cameraPosition;
        const center = [0, 4, 0];
        const up = [0, 1, 0];
    
        lookAt(modelViewMatrix, eye, center, up);
    
        const fieldOfView = Math.PI / 4;
        const aspect = canvas.width / canvas.height;
        const near = 0.1;
        const far = 100.0;
    
        translate(modelViewMatrix, -eye[0], -eye[1], -eye[2]);

        rotateY(modelViewMatrix, cameraRotation);
    
        perspective(projectionMatrix, fieldOfView, aspect, near, far);
    
    
        gl.useProgram(programInfo.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

        gl.drawArrays(gl.LINES, 0, verticies);
        gl.drawArrays(gl.TRIANGLES, triangleVerticiesStart, triangleVerticiesEnd);
    
        requestAnimationFrame(render);
    }
    
    render();
});