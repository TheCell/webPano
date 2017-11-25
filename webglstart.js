// this will be in vertexshader.glsl and fragmentshader.glsl later
var vertexShaderText =
[
	'precision mediump float;',
	'',
	'attribute vec3 vertexPosition;',
	'attribute vec2 vertTexCoord;',
	'varying vec2 fragTexCoord;',
	'',
	'uniform mat4 mWorld;',
	'uniform mat4 mView;',
	'uniform mat4 mProjection;',
	'',
	'void main()',
	'{',
	'	fragTexCoord = vertTexCoord;',
	'	gl_Position = mProjection * mView * mWorld * vec4(vertexPosition, 1.0);',
	'}'
].join('\n');

var fragmentShaderText =
[
	'precision mediump float;',
	'',
	'varying vec2 fragTexCoord;',
	'uniform sampler2D sampler;',
	'',
	'void main()',
	'{',
	'	gl_FragColor = texture2D(sampler, fragTexCoord);',
	'}'
].join('\n');

function initDemo()
{
	'use strict';
	console.log("Webgl init");

	let canvas = document.getElementById("panoCanvas");
	let gl = canvas.getContext("webgl");
	// promote to global for debugging etc.
	window.canvas = canvas;
	window.gl = gl;

	// check browsersupport
	if (!gl)
	{
		console.log("WebGL not supported, fallback on experimental");
		gl = canvas.getContext("experimental-webgl");
	}

	if (!gl)
	{
		alert("Your browser does not support WebGL :(");
	}

	// setup basic background
	gl.clearColor(0.8, 0.8, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// enable culling and set counter clock wise
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);
	// check every pixel if it is in front of last drawn before draw
	gl.enable(gl.DEPTH_TEST);

	setupShaders();
}

function setupShaders()
{
	'use strict';
	let gl = window.gl;

	// create shaders
	let vertexShader = gl.createShader(gl.VERTEX_SHADER);
	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	// compile vertex Shader and errorhandling
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
	{
		console.error("Error compiling vertex Shader", gl.getShaderInfoLog(vertexShader));
		return;
	}

	// compile fragment Shader and errorhandling
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
	{
		console.error("Error compiling fragment Shader", gl.getShaderInfoLog(fragmentShader));
		return;
	}

	// program is kinda like the whole pipeline
	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		console.error("ERROR linking program!", gl.getProgramInfoLog(program));
		return;
	}

	if (window.debug)
	{
		gl.validateProgram(program);
		if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
		{
			console.error("ERROR validating program!", gl.getProgramInfoLog(program));
			return;
		}
	}

	setupBuffers(program);
}

function setupBuffers(program)
{
	'use strict';
	let gl = window.gl;

	let cubeVertices =
	[ // X, Y, Z,			U, V
		// FRONT
		// front top left
		-1.0, 1.0, 1.0,		0, 0,
		// front bottom right
		1.0, -1.0, 1.0,		1, 1,
		// front top right
		1.0, 1.0, 1.0,		1, 0,
		// front top left
		-1.0, 1.0, 1.0,		0, 0,
		// front bottom left
		-1.0, -1.0, 1.0,	0, 1,
		// front bottom right
		1.0, -1.0, 1.0,		1, 1,

		// RIGHT
		// front top right
		1.0, 1.0, 1.0,		0, 1,
		// back bottom right
		1.0, -1.0, -1.0,	1, 0,
		// back top right
		1.0, 1.0, -1.0,		1, 1,
		// front top right
		1.0, 1.0, 1.0,		0, 1,
		// front bottom right
		1.0, -1.0, 1.0,		0, 0,
		// back bottom right
		1.0, -1.0, -1.0,	1, 0,

		// LEFT
		// front top left
		-1.0, 1.0, 1.0,		1, 1,
		// back top left
		-1.0, 1.0, -1.0,	0, 1,
		// back bottom left
		-1.0, -1.0, -1.0,	0, 0,
		// front top left
		-1.0, 1.0, 1.0,		1, 1,
		// back bottom left
		-1.0, -1.0, -1.0,	0, 0,
		// front bottom left
		-1.0, -1.0, 1.0,	1, 0,

		// BACK
		// back top left
		-1.0, 1.0, -1.0,	1, 1,
		// back bottom right
		1.0, -1.0, -1.0,	0, 0,
		// back bottom left
		-1.0, -1.0, -1.0,	1, 0,
		// back top left
		-1.0, 1.0, -1.0,	1, 1,
		// back top right
		1.0, 1.0, -1.0,		0, 1,
		// back bottom right
		1.0, -1.0, -1.0,	0, 0,

		// TOP
		// front top left
		-1.0, 1.0, 1.0,		0, 0,
		// back top right
		1.0, 1.0, -1.0,		1, 1,
		// back top left
		-1.0, 1.0, -1.0,	0, 1,
		// front top left
		-1.0, 1.0, 1.0,		0, 0,
		// front top right
		1.0, 1.0, 1.0,		1, 0,
		// back top right
		1.0, 1.0, -1.0,		1, 1,

		// BOTTOM
		// front bottom right
		1.0, -1.0, 1.0,		1, 0,
		// front bottom left
		-1.0, -1.0, 1.0,	0, 0,
		// back bottom left
		-1.0, -1.0, -1.0,	0, 1,
		// front bottom right
		1.0, -1.0, 1.0,		1, 0,
		// back bottom left
		-1.0, -1.0, -1.0,	0, 1,
		// back bottom right
		1.0, -1.0, -1.0,	1, 1
	];

	// setup buffer and feed Data
	let triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

	// link ShaderAttribute to Javascript and set how to read bytes
	let positionAttributeLocation = gl.getAttribLocation(program, 'vertexPosition');
	let texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');

	// points
	gl.vertexAttribPointer(
		positionAttributeLocation, // Attribute location
		3, // Number of elements per Vertex
		gl.FLOAT, // Type of Elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an indivitual Vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

	// texture
	gl.vertexAttribPointer(
		texCoordAttribLocation, // texture location
		2, // Number of elements per texture
		gl.FLOAT, // Type of Elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an indivitual Vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.enableVertexAttribArray(texCoordAttribLocation);

	// Create texture
	var boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE),
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE),
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById("crateImage"));
	gl.bindTexture(gl.TEXTURE_2D, null);

	// Tell OpenGL state machine which program should be active
	gl.useProgram(program);

	// link variables to vertex Shader
	let matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
	let matViewUniformLocation = gl.getUniformLocation(program, "mView");
	let matProjectionUniformLocation = gl.getUniformLocation(program, "mProjection");

	// setup matrices
	let worldMatrix = new Float32Array(16); // 4x4 Matrix
	let viewMatrix = new Float32Array(16); // 4x4 Matrix
	let projectionMatrix = new Float32Array(16); // 4x4 Matrix

	// init matrices
	mat4.identity(worldMatrix);
	// output matrix, eye coordinate, center coordinate, up vector
	mat4.lookAt(viewMatrix, [0, 2, 5], [0, 0, 0], [0, 1, 0]);
	// output matrix, field of view, apsect ratio, near clipping, far clipping
	mat4.perspective(projectionMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

	// setup matrices for world and camera transformations
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjectionUniformLocation, gl.FALSE, projectionMatrix);

	// Main render loop here
	// how to interpret for drawing, how many skips, how many vertex

	let identityMatrix = new Float32Array(16); // 4x4 Matrix
	let xRotationMatrix = new Float32Array(16); // 4x4 Matrix
	let yRotationMatrix = new Float32Array(16); // 4x4 Matrix

	mat4.identity(identityMatrix); // init with identity
	let angle = 0;

	let loop = function ()
	{
		// rotate every 6 seconds;
		// performance.now The returned value represents the time elapsed since the time origin
		angle = performance.now() / 1000 / 6*(2*Math.PI);
		mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
		//mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
		// multiply the matrices for rotations into the worldmatrix
		mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.False, worldMatrix);

		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		// tell gl which buffers to clear
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		gl.bindTexture(gl.TEXTURE_2D, boxTexture);
		gl.activeTexture(gl.TEXTURE0);

		gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length / 5);

		// wait for browser to give next go at drawing
		requestAnimationFrame(loop);
	};

	requestAnimationFrame(loop);
}