canvas = document.getElementById("cubesCanvas")
initWebGL(canvas)
if (gl)
{ // продолжать только если WebGL доступен и работает
    // Устанавливаем размер вьюпорта
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // включает использование буфера глубины
    gl.enable(gl.DEPTH_TEST);
    // определяет работу буфера глубины: более ближние объекты перекрывают дальние
    gl.depthFunc(gl.LEQUAL);
    // очистить буфер цвета и буфер глубины
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
}

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
enableVertexCubeAttribs(shaderProgram);

//Инициализация текстур
enableVertexTextureAttribs(shaderProgram);
enableVertexTextureAttrib2(shaderProgram);
let goldTexture = loadTexture("src/textures/gold.png");
let silverTexture = loadTexture("src/textures/silver.png");
let bronzeTexture = loadTexture("src/textures/bronze.png");
let numberOneTexture = loadTexture("src/textures/one.png");
let numberTwoTexture = loadTexture("src/textures/two.png");
let numberThreeTexture = loadTexture("src/textures/three.png");
//---------------------

let goldCubeTop = new Float32Array(16);
let goldCubeBot = new Float32Array(16);
let silverCubeLeft = new Float32Array(16);
let bronzeCubeRight = new Float32Array(16);

const startPosX = 0.5;
const startPosY = -1;
const startPosZ = -1;

let worldMatrix = new Float32Array(16);
let viewMatrix = new Float32Array(16);
let projMatrix = new Float32Array(16);

let matWorldLocationCube = gl.getUniformLocation(shaderProgram, "mWorld");
let matViewLocationCube = gl.getUniformLocation(shaderProgram, "mView");
let matProjLocationCube = gl.getUniformLocation(shaderProgram, "mProj");

//цвет
let uColors = gl.getUniformLocation(shaderProgram, "uColors");

//текстуры
let uSampler = gl.getUniformLocation(shaderProgram, "uTexture");
let uSampler2 = gl.getUniformLocation(shaderProgram, 'uTexture2');
let texMixerLocation = gl.getUniformLocation(shaderProgram, "texMixer");

//освещение
let KaLocation = gl.getUniformLocation(shaderProgram, "Ka");
let KdLocation = gl.getUniformLocation(shaderProgram, "Kd");
let KsLocation = gl.getUniformLocation(shaderProgram, "Ks");
let lightPosLocation = gl.getUniformLocation(shaderProgram, "lightPos");
let shininessLocation = gl.getUniformLocation(shaderProgram, "shininess");
let diffuseColorLocation = gl.getUniformLocation(shaderProgram, "diffuseColor");
let ambientColorLocation = gl.getUniformLocation(shaderProgram, "ambientColor");
let specularColorLocation = gl.getUniformLocation(shaderProgram, "specularColor");
let lightPowerLocation = gl.getUniformLocation(shaderProgram, "lightPower");

//modes
let shadingModeLocation = gl.getUniformLocation(shaderProgram, "shadingMode");
let lightModelModeLocation = gl.getUniformLocation(shaderProgram, "lightModelMode");

glMatrix.mat4.identity(worldMatrix)
glMatrix.mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
glMatrix.mat4.perspective(projMatrix, Math.PI / 7, canvas.width / canvas.height, 0.1, 1000.0);

gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrix);
gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrix);
gl.uniformMatrix4fv(matProjLocationCube, false, projMatrix);
gl.uniform1i(uSampler, 0);

let identityMatrix = glMatrix.mat4.identity(new Float32Array(16));

glMatrix.mat4.translate(goldCubeTop, identityMatrix, [startPosX, startPosY + 1, startPosZ]);

glMatrix.mat4.translate(goldCubeBot, identityMatrix, [startPosX, startPosY, startPosZ]);

glMatrix.mat4.translate(silverCubeLeft, identityMatrix, [startPosX + 1, startPosY, startPosZ]);

glMatrix.mat4.translate(bronzeCubeRight, identityMatrix, [startPosX - 1, startPosY, startPosZ]);

let cubes = [goldCubeBot, goldCubeTop, silverCubeLeft, bronzeCubeRight];
let switcher = 0;

document.addEventListener('keyup', (event) => {
    if(event.code === 'KeyF') {
        switcher = switcher === 3 ? 0 : switcher + 1;
    }
});

ranges()

let draw = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrix);

    //Top
    gl.uniform3fv(uColors, [0.72, 0.52, 0.04]);
    glMatrix.mat4.copy(worldMatrix, goldCubeTop);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, goldTexture);
    gl.uniform1i(uSampler, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, numberOneTexture);
    gl.uniform1i(uSampler2, 1);

    gl.drawArrays(gl.TRIANGLES, 0, 40);

    //Bot
    glMatrix.mat4.copy(worldMatrix, goldCubeBot);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrix);
    gl.bindTexture(gl.TEXTURE_2D, goldTexture);
    gl.uniform1i(uSampler, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 40);

    //Left
    gl.uniform3fv(uColors, [0.75, 0.75, 0.75])
    glMatrix.mat4.copy(worldMatrix, silverCubeLeft);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, silverTexture);
    gl.uniform1i(uSampler, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, numberTwoTexture);
    gl.uniform1i(uSampler2, 1);

    gl.drawArrays(gl.TRIANGLES, 0, 40);

    //Right
    gl.uniform3fv(uColors, [0.8, 0.5, 0.2])
    glMatrix.mat4.copy(worldMatrix, bronzeCubeRight);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, bronzeTexture);
    gl.uniform1i(uSampler, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, numberThreeTexture);
    gl.uniform1i(uSampler2, 1);

    gl.drawArrays(gl.TRIANGLES, 0, 40);

    requestAnimationFrame(draw);
}

draw();