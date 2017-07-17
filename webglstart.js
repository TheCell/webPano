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

	setupShaders();
}

function setupShaders()
{
	'use strict';
	let gl = window.gl;
	let vertexShader = gl.createShader(gl.VERTEX_SHADER);
	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	/*
	gl.shaderSource(vertexShader, "vertexshader.glsl");
	if (!window.gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
	{
		console.log("Error compiling vertex Shader", gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.shaderSource(fragmentShader, "fragmentshader.glsl");
	if (!window.gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
	{
		console.log("Error compiling fragment Shader", gl.getShaderInfoLog(fragmentShader));
		return;
	}
	*/
}