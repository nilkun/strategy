'use strict'

const vertexSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

const fragSource = `
    varying lowp vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
`;

class Matrix {
    constructor(arr = new Array(16).fill(0)) {
        for(let i = 0; i < arr.length; i++) {
            this[i] = arr[i];
        }
        this[0] = 1;
        this[5] = 1;
        this[10] = 1;
        this[15] = 1;
    }

    createPerspective(fieldOfView, aspect, near, far) {
        let f = 1.0 / Math.tan(fieldOfView / 2);
        let nearFar;
        this[0] = f / aspect;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = f;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[11] = -1;
        this[12] = 0;
        this[13] = 0;
        this[15] = 0;

        if (far != null && far !== Infinity) {
          nearFar = 1 / (near - far);
          this[10] = (far + near) * nearFar;
          this[14] = (2 * far * near) * nearFar;
        } else {
          this[10] = -1;
          this[14] = -2 * near;
        }
    }

    translate(vector) {
        let x = vector[0];
        let y = vector[1];
        let z = vector[2];

        this[12] = this[0] * x + this[4] * y + this[8] * z + this[12];
        this[13] = this[1] * x + this[5] * y + this[9] * z + this[13];
        this[14] = this[2] * x + this[6] * y + this[10] * z + this[14];
        this[15] = this[3] * x + this[7] * y + this[11] * z + this[15];
    }
}

const WebGL = () => {
    
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl");
    let programInfo;
    let buffers;

    if(!gl) console.log("Sorry. WebGL not supported! Buy a new computer.");
    else console.log("WebGL initialized.")

    const initShaderProgram = () => {
        const vertexShader = loadShader(gl.VERTEX_SHADER, vertexSource);
        const fragShader = loadShader(gl.FRAGMENT_SHADER, fragSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);

        if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.log("unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
            return null;
        };
        return shaderProgram;
    };
    const loadShader = (type, source) =>  {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    const initBuffers = () => {
        const colors = [
            1,1,1,1,
            1,0,0,1,
            0,1,0,1,
            0,0,1,1
        ];

        const positions = [
              1.0,  1.0,
             -1.0,  1.0,
              1.0, -1.0,
             -1.0, -1.0
        ];

        const positionBuffer = gl.createBuffer();
        const colorBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER, 
            new Float32Array(positions), 
            gl.STATIC_DRAW
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        

        return {
            position: positionBuffer,
            color: colorBuffer
        };
    }

    return {
        clear() {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        },
        draw() {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            const fov = 45 * Math.PI / 180;
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;
            const projectionMatrix2 = new Matrix();
            projectionMatrix2.createPerspective(fov, aspect, zNear, zFar);

            const modelViewMatrix2 = new Matrix();
            modelViewMatrix2.translate([-0.0, 0.0, -6.0]);

            const projectionMatrix = new Float32Array(16);
            const modelViewMatrix = new Float32Array(16);
            for(let i = 0; i < 16; i++) {
                projectionMatrix[i] = projectionMatrix2[i];
                modelViewMatrix[i] = modelViewMatrix2[i];
            }
            
            {
                const numOfComponents = 2;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
                gl.vertexAttribPointer( 
                    programInfo.attribLocations.vertexPosition,
                    numOfComponents,
                    type,
                    normalize,
                    stride,
                    offset);
                gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
            }
            { 
                const numOfComponents = 4;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);

                gl.vertexAttribPointer(
                    programInfo.attribLocations.vertexColor,
                    numOfComponents,
                    type,
                    normalize,
                    stride,
                    offset
                );
                    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
            }




            gl.useProgram(programInfo.program);

            gl.uniformMatrix4fv(
                programInfo.uniformLocations.projectionMatrix,
                false,
                projectionMatrix
            );
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.modelViewMatrix,
                false,
                modelViewMatrix
            );

            {
                const offset = 0;
                const vertexCount = 4;
                gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
            }
        },
        init() {
            canvas.width = 640;
            canvas.height = 480;
            // If you resize the canvas, you have to update the viewport
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            
            this.clear();
            const shaderProgram = initShaderProgram();
            programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                    vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                    modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                },
            };

            buffers = initBuffers();
            this.draw();
        }
    }
}

export default WebGL;