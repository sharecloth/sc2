(function ($, window, document, Btree, Import) {$(function () {
	"use strict";

//	var uri = "temp/boxTest.robemesh";
//	var uri = "temp/avatar.robemesh";
	var uri = "temp/avatar841.robemesh";
//	var uri = "temp/Asya.robemesh";
//	var uri = "temp/testCloth.robecloth";
//	var uri = "temp/curve  test.robecloth";
//	var uri = "temp/plane.robecloth";
//	var uri = "temp/s/sceneAllIn.robemesh";
//	var uri = "temp/746.robeCloth";
//	var uri = "temp/792/336.robecloth";

	var loadModel = $.ajax(uri, {
		cache: false,
		dataType: "arraybuffer"
	});

	loadModel.done(function (data) {
		window.tree = new Btree(data);

		console.log(tree);
		console.log(tree + '');

		var robemesh = Import(tree);
		window.geometries = robemesh.geometries;

		console.log (robemesh);

		/*
		console.log(new TextDecoder('utf-8').decode( tree.getRoot().getChild(bct.FragmentProgramName).data ));
		*/

		// test three.js scene
		var scene = new THREE.Scene();

		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

		var meshes = new THREE.Object3D();

		var radius = 0;

		//var loader = new CRNLoader();
		//var texture = loader.load( 'temp/av_diffuse.crn' );

		if (geometries) {
			for (var i = 0; i < geometries.length; i++) {

				geometries[i].computeBoundingSphere();
				radius = Math.max (radius, geometries[i].boundingSphere.radius +
					geometries[i].boundingSphere.center.length());

				var shaders =
					robemesh.materials[geometries[i].materialIndex].VertexProgramName + ', ' +
					robemesh.materials[geometries[i].materialIndex].FragmentProgramName;

				console.log('Shaders: ' + shaders);

				var textures = {};

				for (var j = 0; j < robemesh.materials[geometries[i].materialIndex].textures.length; j++) {
					var textureName = robemesh.materials[geometries[i].materialIndex].textures[j];
					if(!textureName || (textureName == '')) textureName = 'round_normal.jpg';

					console.log(j + '-th texture: ' + 'temp/' + textureName);

					(function (textures, textureName) {

						textures [textureName] = THREE.ImageUtils.loadTexture ('temp/' + textureName,
							THREE.UVMapping, null,
							function () {
								textures [textureName].image = new Image ();
								textures [textureName].image.onload = function () {
									textures [textureName].needsUpdate = true;
								}
								textures [textureName].image.src = 'data:image/gif;base64,R0lGODlhgACAAJH/AP///wAAAP///wAAACH/C0FET0JFOklSMS4wAt7tACH5BAEAAAIALAAAAACAAIAAAAL/jI+pi+IPo5yQ2Zuo3hF7y4XaR2biWZUqygrq2p5vGcvzV4s3nnO71/P9LsHNkFikHEHJyZLRdD4VUcmUWk1dD1ntNtB9fLlh1xhcPqPD6rJ57G6nz3H6HH7/1vFse5/fJfenl7e1RzhoWHh1qJjIuDjVCPkoGfk0aVmJebmUybnp2Xn0KRpKOjpUinqqmvqz6toK+7oTSztrW3tzq5vLuzvj1gv8Kxz8QnxsnIwMw/wc6CcNmCVIjYjtqE3JrekNCm4qzkoua46L7qtezL7s3gxN4zwvT6IcDx9tPc1fXXXNXzaB2wh2M/gNYTiF4xiWc3gOYjqJ6yi2s/gOYz6N//sA9vP4L0pAkANJFjR5EGVClQtZNnT5EGZEmRNpVrR5EWdGnRt5dhT5EaiakE1GCi159GTSlEtXNm359GXUmFNnVq159WbWnFt3du359WfRoGOJJjFaFmlapWuZtnX6FmpcqXOp1rV6F2terXu59vX6F2xgsWfJFjZbBO1htYvZNnb7GG5kuZPpVrZ7GW9mvZv5dvb7GXBowaMJJzZ8GnEQxakZt3b8GnJsybMp17Z8G3Nuzbs59/b8G/Sw1aiJq+7B2rhr5bCZy3ZOG7pt6bip67bOG7tv7cC5C/cuOnh48KTFlydvGn09fes5tvf5Pmz8wfNL1zefHnlx/cdzJFfnvxyAzQn4HIHRGTgdgtUpeB2D2Tm4HYTdSfgdheNZeB6G+fm3H4f91fCfhwGKOCCJBZp4IIoJqrggiw26+CCMEco4IY0V2nghjhnquCGIHfr4YQxqFAAAOw==';
							}
						);

					}) (textures, textureName);
				}

                //robemesh.materials[geometries[i].materialIndex].Ambient = new THREE.Color (0xffffff);
                //robemesh.materials[geometries[i].materialIndex].Diffuse = new THREE.Color (0xffffff);

				var mesh;
				if (geometries[i].bones.length > 0) {
					mesh = new THREE.SkinnedMesh( geometries[i],
						new MVMaterial (
							robemesh.materials[geometries[i].materialIndex],
							null, textures, true
						)
					);

				} else {
					mesh = new THREE.Mesh( geometries[i],
						new MVMaterial (
							robemesh.materials[geometries[i].materialIndex],
							null, textures, false
						)
					);
				}

				//mesh.position.x = 200 * i;

				meshes.add( mesh );
			}

/*
			// bad vertices?
			var bad = [];
			for (var i = 0; i < geometries[0].attributes.skinIndex.array.length; i+=4) {
				var w = geometries[0].attributes.skinIndex.array[i] +
				geometries[0].attributes.skinIndex.array[i + 1] +
				geometries[0].attributes.skinIndex.array[i + 2] +
				geometries[0].attributes.skinIndex.array[i + 3];
				if (w == 0) bad.push (i / 4);
			}
			if (bad.length > 0) console.log ('Bad vertices: ' + bad.join (', '));
*/

			camera.position.z = radius * 1.5;
			camera.near = 0.01 * camera.position.z;
			camera.far = 10.00 * camera.position.z;
			camera.updateProjectionMatrix();
		}
		
		scene.add( meshes );

		var renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff, 1 );
		renderer.setSize( window.innerWidth, window.innerHeight );

		document.body.appendChild( renderer.domElement );

		document.body.style.margin = '0';
		document.body.style.overflow = 'hidden';

		function animate() {

			requestAnimationFrame( animate );

			meshes.rotation.x += 0.01;
			meshes.rotation.y += 0.02;
//meshes.rotation.x = 0.2;
//meshes.rotation.y = 0.5;


			renderer.render( scene, camera );
		};

		animate ();



	});

});})(window.jQuery, window, window.document, Btree, Import);
