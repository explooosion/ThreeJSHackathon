var POINTS_COUNT = 1000;

function initGL() {
   var canvas = document.querySelector('#canvas');
   var gl = canvas.getContext('webgl');
  
   gl.viewport(0,0, canvas.width, canvas.height);
   gl.clearColor(1,1,1,1);
  
   return gl;
}

// shader
// OpenGL Shader
// GLSL

// vec4 vector 3 x,y,z w
function createShaders(gl, type) {
  var shaderScript = '';
  var shader;

  switch(type) {
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
  for(var i = 0; i < times; i++) {
    array.push(null);
  }
  
  return array;
}

function createPoints(gl, program) {
  var points = gl.getAttribLocation(program, "position");
  var aVertexColor = gl.getAttribLocation(program, "aVertexColor");
  var vertices = [
    0.9,  0.9,  0.0,
    -0.9, 0.9,  0.0,
    0.9,  -0.9, 0.0,
    -0.9, -0.9, 0.0
  ];
  
  var colors = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0     // blue
  ];

  
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(points, 3, gl.FLOAT, false, 0 , 0);
  gl.enableVertexAttribArray(points);
  
  
  var colorBuffer = gl.createBuffer();
  
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aVertexColor);
  
  return vertices;
}

function draw(gl, vertices) {
  
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
}

function main() {
  var gl = initGL();
  var shaderProgram = initShaders(gl);
  var vertices = createPoints(gl, shaderProgram);
  draw(gl, vertices);
}

main();