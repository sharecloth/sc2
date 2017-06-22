// npm install
// node build.js
var buildify = require('buildify');
buildify()
	.concat([
		'js/webvr-polyfill.js',
		'js/three.js',
		'js/VRControls.js',
		'js/VREffect.js',
		'js/WebVR.js',
		'js/OrbitControls.js',
		'js/MTLLoader.js',
		'js/OBJMTLLoader.js',
		'js/zip/jszip.js',
		'js/zip/utils/jszip-utils.js',
		'js/parser/fileIO.js',
		'js/parser/btree.js',
		'js/importer.js',
		'js/materials.js',
		'js/pathfinder.js',
		//'js/3d-client.js'
	])
	.uglify()
	.save('js/3d-client.min.js');