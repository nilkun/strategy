'use strict'
import WebGL from "./WebGL2.js";

// let gl = null;
// let glCanvas = null;

// let aspectRatio;
// let currentRotation = [0,1];
// let currentScale = [1.0, 1.0];

// let vertexArray;
// let vertexBuffer;
// let vertexNumComponents;
// let vertexCount;

// let uScalingFactor;
// let uGlobalColor;
// let uRotationVector;
// let aVertexPosition;

// let previousTime = 0.0;
// let degreesPerSecond = 90.0;
// let currentAngle = 0.0;
// let rotationRate;

// let shaderProgram;

// const animateScene2 = () => {
//     gl.clear(gl.COLOR_BUFFER_BIT);
    
//     let radians = currentAngle * Math.PI / 180;
//     currentRotation[0] = Math.sin(radians);
//     currentRotation[1] = Math.cos(radians);
//     gl.uniform2fv(uRotationVector, currentRotation);
//     gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

//     window.requestAnimationFrame( currentTime => {
//         let deltaAngle = (currentTime - previousTime) / 1000 * degreesPerSecond;
//         currentAngle = (currentAngle + deltaAngle) % 360;
//         previousTime = currentTime;
//         animateScene2();
//     });
// }
// const animateScene = () => {
//     gl.viewport(0, 0, glCanvas.width, glCanvas.height);
//     gl.clearColor(1, .5, 0.0, 1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT);
    
//     let radians = currentAngle * Math.PI / 180;
//     currentRotation[0] = Math.sin(radians);
//     currentRotation[1] = Math.cos(radians);

//     gl.useProgram(shaderProgram);

//     uScalingFactor = gl.getUniformLocation(shaderProgram, "uScalingFactor");
//     uGlobalColor = gl.getUniformLocation(shaderProgram, "uGlobalColor");
//     uRotationVector = gl.getUniformLocation(shaderProgram, "uRotationVector");

//     gl.uniform2fv(uScalingFactor, currentScale);
//     gl.uniform2fv(uRotationVector, currentRotation);
//     gl.uniform4fv(uGlobalColor, [ 0, .5, 1, 1.0 ]);

//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

//     aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");

//     gl.enableVertexAttribArray(aVertexPosition);
//     gl.vertexAttribPointer(aVertexPosition, vertexNumComponents, gl.FLOAT, false, 0, 0);

//     gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

//     window.requestAnimationFrame( currentTime => {
//         let deltaAngle = (currentTime - previousTime) / 1000 * degreesPerSecond;
//         currentAngle = (currentAngle + deltaAngle) % 360;
//         previousTime = currentTime;
//         animateScene2();
//     });

// }

// const compileShader = (id, type) => {
//     let code = document.getElementById(id).firstChild.nodeValue;
//     let shader = gl.createShader(type);

//     gl.shaderSource(shader, code);
//     gl.compileShader(shader);

//     if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         console.log(`Error compiling ${type===gl.VERTEX_SHADER ? "vertex" : "fragment" } shader:`);
//         console.log(gl.getShaderInfoLog(shader));
//     }
//     return shader;
// }

// const buildShaderProgram = shaderInfo => {
//     let program = gl.createProgram();

//     shaderInfo.forEach(desc => {
//         let shader = compileShader(desc.id, desc.type);
//         if(shader) {
//             gl.attachShader(program, shader);
//         }
//     });

//     gl.linkProgram(program);

//     if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//         console.log("Error linking shader program: ");
//         console.log(gl.getProgramInfoLog(program));
//     }

//     return program;
// }

// const startup = () => {
//     glCanvas = document.getElementById("canvas");
//     gl = glCanvas.getContext("webgl");
//     glCanvas.width = 400;
//     glCanvas.height = 400;

//     const shaderSet = [
//         {
//             type: gl.VERTEX_SHADER,
//             id: "vertex-shader"
//         },
//         {
//             type: gl.FRAGMENT_SHADER,
//             id: "fragment-shader"
//         }
//     ];

//     shaderProgram = buildShaderProgram(shaderSet);

//     aspectRatio = glCanvas.width / glCanvas.height;
//     // aspectRatio = 8 / 3;
//     currentRotation = [0, 1];
//     currentScale = [1.0, aspectRatio];

//     vertexArray = new Float32Array([
//         -.5, .5, .5, .5, .5, -.5,
//         -.5, .5, .5, -.5, -.5, -.5
//     ]);

//     vertexBuffer = gl.createBuffer();

//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

//     vertexNumComponents = 2;
//     vertexCount = vertexArray.length / vertexNumComponents;

//     currentAngle = 0.0;
//     rotationRate = 6;

//     animateScene();
// }

// window.addEventListener("load", startup, false);

const program = WebGL();
program.init();