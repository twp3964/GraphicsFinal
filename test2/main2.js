document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("webgl-canvas");
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

    // POSITION GENERATOR

    //left to right and then right to left
    const gridSize = 100; // Adjust the size of the grid as needed
    const tileSize = 1; // Size of each tile

    const positions = [];

    let verticies = 0

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
            const scl2 = 0.1;
            const scl3 = 0.25;
            const scl4 = 0.75;
            const scl5 = 1.25;

            // if ((x == -2) || (x == 2)){
            //     y00 = y00 * scl5;
            //     y01 = y01 * scl5;
            //     y10 = y10 * scl5;
            //     y11 = y11 * scl5;

            //     positions.push(x0, y00, z0);
            //     positions.push(x1, y10, z0);
            //     positions.push(x0, y01, z1);
        
            //     positions.push(x0, y01, z1);
            //     positions.push(x1, y10, z0);
            //     positions.push(x1, y11, z1);
    
            //     verticies+=6;

            //     console.log('hi');
            // }
            
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

            // else if (x < 2 && x > -2){
            //     y00 = y00 * scl2;
            //     y01 = y01 * scl2;
            //     y10 = y10 * scl2;
            //     y11 = y11 * scl2;
            // }else if (x < 3 && x > -3){
            //     y00 = y00 * scl3;
            //     y01 = y01 * scl3;
            //     y10 = y10 * scl3;
            //     y11 = y11 * scl3;
            // }else if (x < 4 && x > -4){
            //     y00 = y00 * scl4;
            //     y01 = y01 * scl4;
            //     y10 = y10 * scl4;
            //     y11 = y11 * scl4;
            // }


    
            // Add the vertices for the tile with the Perlin noise applied to Y values
            positions.push(x0, y00, z0);
            positions.push(x1, y10, z0);
            positions.push(x0, y01, z1);
    
            positions.push(x0, y01, z1);
            positions.push(x1, y10, z0);
            positions.push(x1, y11, z1);

            verticies+=6;
        }
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

    function render() {
        gl.clearColor(112.0/256,128.0/256,144.0/256,1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const modelViewMatrix = mat4.create();
        const projectionMatrix = mat4.create();

        mat4.lookAt(modelViewMatrix, [0, 5, 5], [0, 4, 0], [0, 1, 0]);
        mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);

        gl.useProgram(programInfo.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

        gl.drawArrays(gl.LINES, 0, verticies);
        console.log(verticies);






        requestAnimationFrame(render);
    }

    render();
});