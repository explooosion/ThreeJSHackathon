function initGL() {
    var canvas = document.querySelector('#canvas');
    var gl = canvas.getContext('webgl');

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 1, 1, 1);

    return gl;
}

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

    var isSuccessful = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!isSuccessful) {
        throw Error();
    }
    gl.useProgram(shaderProgram);

}

function draw(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
}

function main() {
    var gl = initGL();
    initShaders(gl);
    draw(gl);
}

main();