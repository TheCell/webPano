// this will be in vertexshader.glsl and fragmentshader.glsl later
var vertexShaderText =
[
	'precision mediump float;',
	'',
	'attribute vec3 vertexPosition;',
	'attribute vec4 vertexColor;',
	'varying vec4 fragColor;',
	'',
	'void main()',
	'{',
	'	fragColor = vertexColor;',
	'	gl_Position = vec4(vertexPosition, 1.0);',
	'}'
].join('\n');

var fragmentShaderText =
[
	'precision mediump float;',
	'',
	'varying vec4 fragColor;',
	'',
	'void main()',
	'{',
	'	gl_FragColor = fragColor;',
	'}'
].join('\n');

function initDemo()
{
	'use strict';
	console.log("Webgl init");

	let canvas = document.getElementById("2dCanvas");
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

	/*
	gl.shaderSource(vertexShader, "vertexshader.glsl");

	gl.shaderSource(fragmentShader, "fragmentshader.glsl");
	*/

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
	let triangleVertices =
	[ // X, Y, Z,			R, G, B, A
		0.0, 0.5, 1.0,		1.0, 0.3, 0.5, 1.0,
		0.5, -0.5, 1.0,		1.0, 1.0, 0.5, 1.0,
		-0.5, -0.5, 1.0,	0.0, 0.0, 0.5, 1.0
	];

	// setup buffer and feed Data
	let triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	// link ShaderAttribute to Javascript and set how to read bytes
	let positionAttributeLocation = gl.getAttribLocation(program, 'vertexPosition');
	let colorAttributeLocation = gl.getAttribLocation(program, 'vertexColor');

	// points
	gl.vertexAttribPointer(
		positionAttributeLocation, // Attribute location
		3, // Number of elements per Vertex
		gl.FLOAT, // Type of Elements
		gl.FALSE,
		7 * Float32Array.BYTES_PER_ELEMENT, // Size of an indivitual Vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

	// color
	gl.vertexAttribPointer(
		colorAttributeLocation, // color location
		4, // Number of elements per color
		gl.FLOAT, // Type of Elements
		gl.FALSE,
		7 * Float32Array.BYTES_PER_ELEMENT, // Size of an indivitual Vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.enableVertexAttribArray(colorAttributeLocation);

	// Main render loop here
	gl.useProgram(program);
	// how to interpret for drawing, how many skips, how many vertex
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}