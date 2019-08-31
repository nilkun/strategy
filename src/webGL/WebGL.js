const vertexShader = `
    attribute vec2 aVertexPosition;
    uniform vec2 uScalingFactor;
    uniform vec2 uRotationVector;
    void main() {
        vec2 rotatedPosition = vec2(
            aVertexPosition.x * uRotationVector.y +
            aVertexPosition.y * uRotationVector.x,
            aVertexPosition.y * uRotationVector.y -
            aVertexPosition.x * uRotationVector.x
        );
        gl_Position = vec4(rotatedPosition * uScalingFactor, 0.0, 1.0);
    }
`;

const fragmentShader = `
    #ifdef GL_ES
    precision highp float;
    #endif

    uniform vec4 uGlobalColor;

    void main() {
        gl_FragColor = uGlobalColor;
    }
`;

function WebGL() {

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("webgl");
    let scale = [1.0, 1.0];
    let shaderProgram = null;

    let currentRotation;
    let vertexArray;
    let vertexArray2;
    let vertexBuffer;
    let vertexNumComponents;
    let vertexCount;
    let currentAngle;
    let uScalingFactor;
    let uGlobalColor;
    let uRotationVector;
    let previousTime = 0;
    let degreesPerSecond = 60;

    return {        
        compileShader(code, type) {
            let shader = context.createShader(type);
            context.shaderSource(shader, code);
            context.compileShader(shader);

            if(!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
                console.log(`Error compiling ${type===context.VERTEX_SHADER ? "vertex" : "fragment" } shader:`);
                console.log(context.getShaderInfoLog(shader));
            }
            return shader;
        },
        buildShaderProgram(shaderInfo) {
            let program = context.createProgram();
        
            shaderInfo.forEach(desc => {
                let shader = this.compileShader(desc.code, desc.type);
                if(shader) {
                    context.attachShader(program, shader);
                }
            });        
            context.linkProgram(program);
        
            if(!context.getProgramParameter(program, context.LINK_STATUS)) {
                console.log("Error linking shader program: ");
                console.log(context.getProgramInfoLog(program));
            }        
            return program;
        },

        testInit() {
            canvas.width = 400;
            canvas.height = 400;
            scale = [1.0, canvas.width / canvas.height];
        },

        startTexture() {
            const texture = this.getTexture();
            const textureCoordBuffer = context.createBuffer();
            console.log("END");
        },

        getTexture() {
            const texture = context.createTexture();
            context.bindTexture(context.TEXTURE_2D, texture);

            // quickfix
            const level = 0;
            const internalFormat = context.RGBA;
            const width = 1;
            const height = 1;
            const border = 0;
            const srcFormat = context.RGBA;
            const srcType = context.UNSIGNED_BYTE;
            const pixel = new Uint8Array([0,0,255,255]);
            context.texImage2D(context.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

            const image = new Image();
            image.onload = () => {
                context.bindTexture(context.TEXTURE_2D, texture);
                context.texImage2D(context.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
                console.log("image loaded...");
                this.start();
            }
            image.src = "./cat.png";
            return texture;
        },

        draw() {
            context.clear(context.COLOR_BUFFER_BIT);
            context.bufferData(context.ARRAY_BUFFER, vertexArray, context.STATIC_DRAW);
            context.drawArrays(context.TRIANGLES, 0, vertexCount);
            window.requestAnimationFrame( currentTime => {
                this.draw();
            });            
        },
        animate() {
            context.clear(context.COLOR_BUFFER_BIT);
            
            let radians = currentAngle * Math.PI / 180;
            currentRotation[0] = Math.sin(radians);
            currentRotation[1] = Math.cos(radians);
            context.uniform2fv(uRotationVector, currentRotation);

            context.bufferData(context.ARRAY_BUFFER, vertexArray, context.STATIC_DRAW);
            context.drawArrays(context.TRIANGLES, 0, vertexCount);

            // SWITCH ARRAYS
            // context.bufferData(context.ARRAY_BUFFER, vertexArray2, context.STATIC_DRAW);
            // context.drawArrays(context.TRIANGLES, 0, vertexCount);
        
            window.requestAnimationFrame( currentTime => {
                let deltaAngle = (currentTime - previousTime) / 1000 * degreesPerSecond;
                currentAngle = (currentAngle + deltaAngle) % 360;
                previousTime = currentTime;
                this.animate();
            });
        },

        start() {
            context.viewport(0, 0, canvas.width, canvas.height);
            context.clearColor(1, .5, 0.0, 1.0);
            context.clear(context.COLOR_BUFFER_BIT);
            
            let radians = currentAngle * Math.PI / 180;
            currentRotation[0] = Math.sin(radians);
            currentRotation[1] = Math.cos(radians);
        
            context.useProgram(shaderProgram);
        
            uScalingFactor = context.getUniformLocation(shaderProgram, "uScalingFactor");
            uGlobalColor = context.getUniformLocation(shaderProgram, "uGlobalColor");
            uRotationVector = context.getUniformLocation(shaderProgram, "uRotationVector");
        
            context.uniform2fv(uScalingFactor, scale);
            context.uniform2fv(uRotationVector, currentRotation);
            context.uniform4fv(uGlobalColor, [ 0, .5, 1, 1.0 ]);
        
            context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
            
            let aVertexPosition = context.getAttribLocation(shaderProgram, "aVertexPosition");
        
            context.enableVertexAttribArray(aVertexPosition);
            context.vertexAttribPointer(aVertexPosition, vertexNumComponents, context.FLOAT, false, 0, 0);
        
            context.drawArrays(context.TRIANGLES, 0, vertexCount);

            // SWITCH ARRAYS
            context.bufferData(context.ARRAY_BUFFER, vertexArray2, context.STATIC_DRAW);
            context.drawArrays(context.TRIANGLES, 0, vertexCount);

            window.requestAnimationFrame( currentTime => {
                let deltaAngle = (currentTime - previousTime) / 1000 * degreesPerSecond;
                currentAngle = (currentAngle + deltaAngle) % 360;
                previousTime = currentTime;
                this.draw();
            });        
        }, 

        init() { 
            const shaderSet = [
                {
                    type: context.VERTEX_SHADER,
                    code: vertexShader
                },
                {
                    type: context.FRAGMENT_SHADER,
                    code: fragmentShader
                }
            ];
        
            shaderProgram = this.buildShaderProgram(shaderSet);        
            currentRotation = [0, 1];
                    
            vertexArray = new Float32Array([
                -.5, .5, .5, .5, .5, -.5,
                -.5, .5, .5, -.5, -.5, -.5
            ]);

                   
            // vertexArray2 = new Float32Array([
            //     -1, 0, 0, 0, 0, -1,
            //     -1, 0, 0, -1, -1, -1
            // ]);
        
            vertexBuffer = context.createBuffer();
        
            context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
            context.bufferData(context.ARRAY_BUFFER, vertexArray, context.STATIC_DRAW);
        
            vertexNumComponents = 2;
            vertexCount = vertexArray.length / vertexNumComponents;
        
            currentAngle = 0.0;
            this.testInit();
            this.startTexture();
        }
    }
}

export default WebGL;