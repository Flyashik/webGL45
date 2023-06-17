let currentAngleLeftX = 0;
let currentAngleLeftZ = 0;

let currentAngleRightX = 0;
let currentAngleRightZ = 0;

document.addEventListener('keydown', (event) => {
    if(event.code === 'ArrowLeft') {
        currentAngleLeftX = cubes[switcher] === silverCubeLeft ? currentAngleLeftX - 0.05 : currentAngleLeftX;
        currentAngleLeftZ = cubes[switcher] === silverCubeLeft ? currentAngleLeftZ - 0.05 : currentAngleLeftZ;
        currentAngleRightX = cubes[switcher] === bronzeCubeRight ? currentAngleRightX - 0.05 : currentAngleRightX;
        currentAngleRightZ = cubes[switcher] === bronzeCubeRight ? currentAngleRightZ - 0.05 : currentAngleRightZ;
        glMatrix.mat4.rotate(cubes[switcher], cubes[switcher], -0.05, [0, 1, 0]);
    }
    if(event.code === 'ArrowRight') {
        currentAngleLeftX = cubes[switcher] === silverCubeLeft ? currentAngleLeftX + 0.05 : currentAngleLeftX;
        currentAngleLeftZ = cubes[switcher] === silverCubeLeft ? currentAngleLeftZ + 0.05 : currentAngleLeftZ;
        currentAngleRightX = cubes[switcher] === bronzeCubeRight ? currentAngleRightX + 0.05 : currentAngleRightX;
        currentAngleRightZ = cubes[switcher] === bronzeCubeRight ? currentAngleRightZ + 0.05 : currentAngleRightZ;
        glMatrix.mat4.rotate(cubes[switcher], cubes[switcher], 0.05, [0, 1, 0]);
    }
    if (event.code === 'KeyQ')
    {
        glMatrix.mat4.rotate(viewMatrix, viewMatrix, -0.05, [0, 1, 0]);
    }
    if (event.code === 'KeyE')
    {
        glMatrix.mat4.rotate(viewMatrix, viewMatrix, 0.05, [0, 1, 0]);
    }
    if (event.code === 'KeyA')
    {
        currentAngleLeftX -= 0.05;
        currentAngleRightX -= 0.05;
        glMatrix.mat4.rotate(goldCubeTop, goldCubeTop, -0.05, [0, 1, 0]);
        glMatrix.mat4.rotate(goldCubeBot, goldCubeBot, -0.05, [0, 1, 0]);

        glMatrix.mat4.translate(silverCubeLeft, identityMatrix, [Math.cos(-currentAngleLeftX + currentAngleLeftZ) + startPosX, startPosY, Math.sin(-currentAngleLeftX + currentAngleLeftZ) + startPosZ]);
        glMatrix.mat4.rotate(silverCubeLeft, silverCubeLeft, currentAngleLeftX, [0, 1, 0]);

        glMatrix.mat4.translate(bronzeCubeRight, identityMatrix, [Math.cos(Math.PI - currentAngleRightX + currentAngleRightZ) + startPosX, startPosY, Math.sin(Math.PI - currentAngleRightX + currentAngleRightZ) + startPosZ]);
        glMatrix.mat4.rotate(bronzeCubeRight, bronzeCubeRight, currentAngleLeftX, [0, 1, 0]);
    }
    if (event.code === 'KeyD')
    {
        currentAngleLeftX += 0.05;
        currentAngleRightX += 0.05;
        glMatrix.mat4.rotate(goldCubeTop, goldCubeTop, 0.05, [0, 1, 0]);
        glMatrix.mat4.rotate(goldCubeBot, goldCubeBot, 0.05, [0, 1, 0]);

        glMatrix.mat4.translate(silverCubeLeft, identityMatrix, [Math.cos(-currentAngleLeftX + currentAngleLeftZ) + startPosX, startPosY, Math.sin(-currentAngleLeftX + currentAngleLeftZ) + startPosZ]);
        glMatrix.mat4.rotate(silverCubeLeft, silverCubeLeft, currentAngleLeftX, [0, 1, 0]);

        glMatrix.mat4.translate(bronzeCubeRight, identityMatrix, [Math.cos(Math.PI - currentAngleRightX + currentAngleRightZ) + startPosX, startPosY, Math.sin(Math.PI - currentAngleRightX + currentAngleRightZ) + startPosZ]);
        glMatrix.mat4.rotate(bronzeCubeRight, bronzeCubeRight, currentAngleRightX, [0, 1, 0]);
    }
});

function ranges() {
    //Texture Mixer
    let texMixer = document.getElementById("textureMixer");
    gl.uniform1f(texMixerLocation, texMixer.value / 1000);

    texMixer.addEventListener("input", () => {
        gl.uniform1f(texMixerLocation, texMixer.value / 1000);
    });

    //Light Pos
    let lightPosX = document.getElementById("lightPosX");
    let lightPosY = document.getElementById("lightPosY");
    let lightPosZ = document.getElementById("lightPosZ");
    gl.uniform3fv(lightPosLocation, [lightPosX.value / 100, lightPosY.value / 100, lightPosZ.value / 100]);

    lightPosX.addEventListener("input", () => {
        gl.uniform3fv(lightPosLocation, [lightPosX.value / 100, lightPosY.value / 100, lightPosZ.value / 100]);
    });
    lightPosY.addEventListener("input", () => {
        gl.uniform3fv(lightPosLocation, [lightPosX.value / 100, lightPosY.value / 100, lightPosZ.value / 100]);
    });
    lightPosZ.addEventListener("input", () => {
        gl.uniform3fv(lightPosLocation, [lightPosX.value / 100, lightPosY.value / 100, lightPosZ.value / 100]);
    });

    //Reflection
    let Ka = document.getElementById("ka");
    let Kd = document.getElementById("kd");
    let Ks = document.getElementById("ks");
    gl.uniform1f(KaLocation, Ka.value / 1000);
    gl.uniform1f(KdLocation, Kd.value / 1000);
    gl.uniform1f(KsLocation, Ks.value / 1000);

    Ka.addEventListener("input", () => {
        gl.uniform1f(KaLocation, Ka.value / 1000);
    });
    Kd.addEventListener("input", () => {
        gl.uniform1f(KdLocation, Kd.value / 1000);
    });
    Ks.addEventListener("input", () => {
        gl.uniform1f(KsLocation, Ks.value / 1000);
    });

    //Shininess
    let shininess = document.getElementById("shininess");
    gl.uniform1f(shininessLocation, shininess.value / 1);

    shininess.addEventListener("input", () => {
        gl.uniform1f(shininessLocation, shininess.value / 1);
    });

    //Colors
    let diffuseColor = document.getElementById("diffuseColor");
    gl.uniform3fv(diffuseColorLocation, convertColor(diffuseColor.value));

    let ambientColor = document.getElementById("ambientColor");
    gl.uniform3fv(ambientColorLocation, convertColor(ambientColor.value));

    let specularColor = document.getElementById("specularColor");
    gl.uniform3fv(specularColorLocation, convertColor(specularColor.value));

    diffuseColor.addEventListener("input", () => {
        gl.uniform3fv(diffuseColorLocation, convertColor(diffuseColor.value));
    });

    ambientColor.addEventListener("input", () => {
        gl.uniform3fv(ambientColorLocation, convertColor(ambientColor.value));
    });

    specularColor.addEventListener("input", () => {
        gl.uniform3fv(specularColorLocation, convertColor(specularColor.value));
    });

    //Light Power
    let lightPower = document.getElementById("lightPower");
    gl.uniform1f(lightPowerLocation, lightPower.value / 100);

    lightPower.addEventListener("input", () => {
        gl.uniform1f(lightPowerLocation, lightPower.value / 100);
    });

    //Modes
    let shadingMode = document.getElementById("shadingMode");
    gl.uniform1i(shadingModeLocation, 0);

    shadingMode.addEventListener("change", () => {
        gl.uniform1i(shadingModeLocation, shadingMode.value);
    });

    let lightModelMode = document.getElementById("lightModelMode");
    gl.uniform1f(lightModelModeLocation, 0);

    lightModelMode.addEventListener("change", () => {
        gl.uniform1i(lightModelModeLocation, lightModelMode.value);
    });
}

function convertColor(hex) {
    const r = parseInt(hex.substr(1,2), 16) / 255;
    const g = parseInt(hex.substr(3, 2), 16) / 255;
    const b = parseInt(hex.substr(5, 2), 16) / 255;

    return new Float32Array([r, g, b]);
}