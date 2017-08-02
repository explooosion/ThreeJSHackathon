var POINTS_COUNT = 10000;

function initGL() {
    var canvas = document.querySelector('#canvas');
    var gl = canvas.getContext('webgl');

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);

    return gl;
}

// shader
// OpenGL Shader
// GLSL

// vec4 vector 3 x,y,z w
function createShaders(gl, type) {
    var shaderScript = '';
    var shader;

    switch (type) {
        case 'fragment':
            shaderScript = document.querySelector('#shader-fs').textContent;
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            break;
        case 'vertex':
            shaderScript = document.querySelector('#shader-vs').textContent;
            shader = gl.createShader(gl.VERTEX_SHADER);
            break;
    }

    gl.shaderSource(shader, shaderScript);
    gl.compileShader(shader);

    return shader;
}

function initShaders(gl) {
    var vertexShader = createShaders(gl, 'vertex');
    var fragmentShader = createShaders(gl, 'fragment');

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    return shaderProgram;
}

function times(times) {
    var array = [];
    for (var i = 0; i < times; i++) {
        array.push(null);
    }

    return array;
}

function createPoints(gl, program) {
    var points = gl.getAttribLocation(program, "position");
    var size = gl.getAttribLocation(program, "size");
    var vertices = [];


    // 伯朗隨機運動
    // vertices = times(POINTS_COUNT * 2)
    //   .map((val, i) => Math.random() * 2 - 1);
    // 圓形運動
    vertices = times(POINTS_COUNT * 2)
        .map((val, i) => Math.sin(Math.random()) * -0.01);


    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    //                 type                    data              usage
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);


    // gl.vertexAttrib3f(points, 0.0, 0, 0);
    gl.vertexAttribPointer(points, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(points);

    gl.vertexAttrib1f(size, 1.0);

    var color = gl.getUniformLocation(program, "color");
    gl.uniform4f(color, 1, 0, 0, 1);

    return vertices;
}

function draw(gl, vertices) {

    for (var i = 0; i < POINTS_COUNT * 2; i += 2) {
        vertices[i] += Math.random() * 0.01 - 0.005;
        vertices[i + 1] += Math.random() * 0.01 - 0.005;
    }

    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, POINTS_COUNT);

    const bindDraw = (gl, vertices) => () => draw(gl, vertices);
    requestAnimationFrame(bindDraw(gl, vertices));
}

function main() {
    var gl = initGL();
    var shaderProgram = initShaders(gl);
    var vertices = createPoints(gl, shaderProgram);
    draw(gl, vertices);
}

main();