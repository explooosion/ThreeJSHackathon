var matrix = mat4.create();

function handleTextureLoaded(gl, texture, image) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // 紋理座標垂直翻轉

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

}

function initGL() {
    var canvas = document.querySelector('#canvas');
    var gl = canvas.getContext('webgl');

    // uncomment to enable gl.DEPTH_TEST
    gl.enable(gl.DEPTH_TEST);
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

function createTexture(gl, program) {
    var textureCoords = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        1.0, 0.0,
        1.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

    var textureCoords = gl.getAttribLocation(program, 'textureCoords');
    gl.vertexAttribPointer(textureCoords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(textureCoords);

    return buffer;


}

function createPoints(gl, program) {
    var vertices = [-1, -1, -1, 1, 0, 0, 1, // 0
        1, -1, -1, 1, 1, 0, 1, // 1
        -1, 1, -1, 0, 1, 1, 1, // 2
        1, 1, -1, 0, 0, 1, 1, // 3
        -1, 1, 1, 1, 0.5, 0, 1, // 4
        1, 1, 1, 0.5, 1, 1, 1, // 5
        -1, -1, 1, 1, 0, 0.5, 1, // 6
        1, -1, 1, 0.5, 0, 1, 1, // 7
    ];

    var vertexCount = vertices.length / 7;

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var coords = gl.getAttribLocation(program, "coords");
    gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0);
    gl.enableVertexAttribArray(coords);

    var colorsLocation = gl.getAttribLocation(program, "colors");
    gl.vertexAttribPointer(colorsLocation, 4, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, Float32Array.BYTES_PER_ELEMENT * 3);

    gl.enableVertexAttribArray(colorsLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var pointSize = gl.getAttribLocation(program, "pointSize");
    gl.vertexAttrib1f(pointSize, 20);

    var perspectiveMatrix = mat4.create();
    mat4.perspective(perspectiveMatrix, 1, canvas.width / canvas.height, 0.1, 11);
    var perspectiveLoc = gl.getUniformLocation(program, 'u_perspectiveMatrix');
    gl.uniformMatrix4fv(perspectiveLoc, false, perspectiveMatrix);

    mat4.translate(matrix, matrix, [0, 0, -4]);
}

function createIndices(gl) {
    var indices = [
        0, 1, 2, 1, 2, 3,
        2, 3, 4, 3, 4, 5,
        4, 5, 6, 5, 6, 7,
        6, 7, 0, 7, 0, 1,
        0, 2, 6, 2, 6, 4,
        1, 3, 7, 3, 7, 5
    ];
    var indexCount = indices.length;

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    return indexCount;
}

function draw(gl, vertices, shaderProgram, indexCount) {

    // mat4.rotateX(matrix, matrix, -0.007);
    mat4.rotateY(matrix, matrix, 0.01);
    // mat4.rotateZ(matrix, matrix, 0.01);
    var transformMatrix = gl.getUniformLocation(shaderProgram, "u_transformMatrix");
    gl.uniformMatrix4fv(transformMatrix, false, matrix);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var sampler = gl.getUniformLocation(shaderProgram, 'sampler');
    gl.uniform1i(sampler, 0);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
    // gl.drawElements(gl.LINE_LOOP, indexCount, gl.UNSIGNED_BYTE, 0);
    const bindDraw = (gl, vertices, shaderProgram, indexCount) => () => {
        draw(gl, vertices, shaderProgram, indexCount);
    }
    requestAnimationFrame(bindDraw(gl, vertices, shaderProgram, indexCount));
}

function initImage(gl) {
    var cubeTexture = gl.createTexture();
    var image = new Image();
    image.crossOrigin = '';
    image.src = 'http://3.bp.blogspot.com/-xQ50cuaGanI/VSyfX1Bn2WI/AAAAAAABJDk/I8hDcQ_bvSw/s1600/unsplash-guyonwall.jpg';

    image.onload = function () {
        handleTextureLoaded(gl, cubeTexture, image);
    }
}

function main() {
    var gl = initGL();
    var shaderProgram = initShaders(gl);
    var vertices = createPoints(gl, shaderProgram);
    var indexCount = createIndices(gl);
    initImage(gl);
    createTexture(gl, shaderProgram);
    draw(gl, vertices, shaderProgram, indexCount);
}

main();