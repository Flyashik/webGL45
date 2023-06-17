function initWebGL(canvas) {
    gl = null;
    try { // Попытаться получить стандартный контекст.
// Если не получится, попробовать получить экспериментальный.
        gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimentalwebgl");
    } catch (e) {
        console.log(e.toString())
    }
// Если мы не получили контекст GL, завершить работу
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        gl = null;
    }
    return gl;
}

function initShaderProgram(gl, vsSource, fsSource) {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
// Send the source to the shader object
    gl.shaderSource(shader, source);
// Compile the shader program
    gl.compileShader(shader);
// See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function enableVertexCubeAttribs(shaderProgram) {
    let squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    let vertices =
        [ // X, Y, Z           X, Y, Z
            // Front
            -0.5, -0.5, -0.5, 0, 0, 1, // 3
            -0.5, 0.5, -0.5, 0, 0, 1,// 1
            0.5, 0.5, -0.5, 0, 0, 1,// 2

            -0.5, -0.5, -0.5, 0, 0, 1,// 3
            0.5, 0.5, -0.5, 0, 0, 1, // 2
            0.5, -0.5, -0.5, 0, 0, 1, // 4

            // Top
            -0.5, 0.5, -0.5,0, 1, 0, // 1
            -0.5, 0.5, 0.5,0, 1, 0, // 5
            0.5, 0.5, 0.5, 0, 1, 0,// 6

            -0.5, 0.5, -0.5,0, 1, 0, // 1
            0.5, 0.5, -0.5,0, 1, 0,// 2
            0.5, 0.5, 0.5, 0, 1, 0, // 6

            // Bottom
            -0.5, -0.5, -0.5, 0, -1, 0, // 3
            0.5, -0.5, 0.5, 0, -1, 0,// 8
            0.5, -0.5, -0.5, 0, -1, 0, // 4

            -0.5, -0.5, -0.5, 0, -1, 0, // 3
            0.5, -0.5, 0.5, 0, -1, 0,// 8
            -0.5, -0.5, 0.5,0, -1, 0,  // 7

            // Left
            -0.5, -0.5, -0.5,1, 0, 0,// 3
            -0.5, 0.5, -0.5, 1, 0, 0,// 1
            -0.5, -0.5, 0.5,1, 0, 0, // 7

            -0.5, 0.5, 0.5,  1, 0, 0,// 5
            -0.5, 0.5, -0.5,  1, 0, 0, // 1
            -0.5, -0.5, 0.5,  1, 0, 0,// 7

            //Right
            0.5, 0.5, -0.5, -1, 0, 0, // 2
            0.5, -0.5, 0.5, -1, 0, 0,// 8
            0.5, -0.5, -0.5, -1, 0, 0, // 4

            0.5, 0.5, -0.5, -1, 0, 0,  // 2
            0.5, -0.5, 0.5, -1, 0, 0,  // 8
            0.5, 0.5, 0.5,  -1, 0, 0, // 6

            //Back
            -0.5, 0.5, 0.5, 0, 0, -1,// 5
            0.5, 0.5, 0.5,  0, 0, -1,// 6
            -0.5, -0.5, 0.5, 0, 0, -1, // 7

            0.5, -0.5, 0.5, 0, 0, -1, // 8
            0.5, 0.5, 0.5, 0, 0, -1,// 6
            -0.5, -0.5, 0.5,  0, 0, -1,// 7
        ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertPosition");
    let vertNormalesAttribute = gl.getAttribLocation(shaderProgram, "vertNormales");
    gl.useProgram(shaderProgram);

    //устанавливаем
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(vertNormalesAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT);

    //включаем
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.enableVertexAttribArray(vertNormalesAttribute);
}

function enableVertexTextureAttribs(shaderProgram) {
    let texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

    let texCoords = [
        // Front
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        0.0, 1.0, 1.0, 0.0, 1.0, 1.0,

        // Top
        0.0, 0.0, 0.0, 0.5, 0.5, 0.5,
        0.0, 0.0, 0.5, 0.5, 0.5, 0.0,

        // Bottom
        0.0, 0.5, 0.5, 1.0, 0.5, 0.5,
        0.0, 0.5, 0.5, 1.0, 0.0, 1.0,

        // Left
        0.5, 0.0, 0.5, 1.0, 1.0, 0.0,
        1.0, 1.0, 0.5, 1.0, 1.0, 0.0,

        // Right
        0.0, 1.0, 0.5, 0.0, 0.0, 0.0,

        0.0, 1.0, 0.5, 0.0, 0.5, 1.0,

        // Back
        0.5, 0.0, 1.0, 0.0, 0.5, 0.5,

        1.0, 0.5, 1.0, 0.0, 0.5, 0.5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    let vertTexCoordAttribute = gl.getAttribLocation(shaderProgram, "vertTexCoord");
    gl.useProgram(shaderProgram)

    gl.vertexAttribPointer(vertTexCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(vertTexCoordAttribute);
}

function enableVertexTextureAttrib2(shaderProgram) {
    let texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

    let texCoords = [
        // Front
        1, 1, 1, 0, 0, 0,
        1, 1, 0, 0, 0, 1,
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    let vertTexCoordAttribute = gl.getAttribLocation(shaderProgram, "vertTexCoord2");
    gl.useProgram(shaderProgram)

    gl.vertexAttribPointer(vertTexCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(vertTexCoordAttribute);
}

function loadTexture(url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Установка параметров текстуры
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    };
    image.src = url;

    return texture;
}