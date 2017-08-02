function initGL() {
    var canvas = document.querySelector('#canvas');
    var gl = canvas.getContext('webgl');

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);

    return gl;
}



function draw(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.drawArrays(gl.LINES, 0, 3);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
    gl.drawArrays(gl.POINTS, 0, 3);


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

function createPoints(gl, program) {
    var points = gl.getAttribLocation(program, "position");
    var size = gl.getAttribLocation(program, "size");
    var vertices = [
        -0.9, -0.9, 0.0,    // point1
        0.9, -0.9, 0.0,     // point2
        0.0, 0.9, 0.0       // point3
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    //                 type                    data              usage
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)


    // gl.vertexAttrib3f(points, 0.0, 0, 0);
    // gl.vertexAttrib3f(points, 0, 0, 0);
    // 使用 gl.vertexAttribPointer 來指向指標
    // 我們需要告訴它，每個頂點將有三個值 X，Y，Z ，它們是浮點數。
    // 後面三個參數分別為 normalized, type stride
    // 之後會再討論，暫時先不理他
    gl.vertexAttribPointer(points, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(points);
    gl.vertexAttrib1f(size, 100.0);

    var color = gl.getUniformLocation(program, "color");
    gl.uniform4f(color, 0, 1, 0, 1);
}

function createVertices(gl, program) {

}

function main() {
    var gl = initGL();
    var shaderProgram = initShaders(gl);
    createPoints(gl, shaderProgram);
    draw(gl);
}

main();