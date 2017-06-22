function Import (tree) {

	function readString (data) {
		var s = '';
		for (var i = 0; i < data.byteLength - 1; i++) {
			s += String.fromCharCode (data.getUint8 (i));
		}
		return s;
	}

	function readMatrix4 (data, matrix) {
		matrix = matrix || new THREE.Matrix4 ();
		matrix.set (
			data.getFloat32 ( 0*4, true), data.getFloat32 ( 1*4, true), data.getFloat32 ( 2*4, true), data.getFloat32 ( 3*4, true),
			data.getFloat32 ( 4*4, true), data.getFloat32 ( 5*4, true), data.getFloat32 ( 6*4, true), data.getFloat32 ( 7*4, true),
			data.getFloat32 ( 8*4, true), data.getFloat32 ( 9*4, true), data.getFloat32 (10*4, true), data.getFloat32 (11*4, true),
			data.getFloat32 (12*4, true), data.getFloat32 (13*4, true), data.getFloat32 (14*4, true), data.getFloat32 (15*4, true)
		);
		return matrix;
	}

	function createVertexBuffers (vdata, vsize, complete) {
		var n = vdata.byteLength / vsize;
		var position = new Float32Array (n * 3);
		var normal = new Float32Array (n * 3);
		var uv = new Float32Array (n * 2);

		var uv1 = new Float32Array (n * 4);
		var colour = new Float32Array (n * 3);
		var binormal = new Float32Array (n * 3);
		var tangent = new Float32Array (n * 3);
		var uv3 = new Float32Array (n * 2);

		// vertex format: 19 float32 numbers (4 bytes each)
		// pos.xyz, normal.xyz, uv.uv, uv2.xyzw, stretchValue, binormal.xyz, tangent.xyz
		for (var i = 0, j = 0, k = 0, m = 0; i < n; i++, j+=3, k+=2, m+=4) {
			var p = i * vsize;
			position[j]     = vdata.getFloat32(p, true);
			position[j + 1] = vdata.getFloat32(p + 4, true);
			position[j + 2] = vdata.getFloat32(p + 8, true);

			normal[j]     = vdata.getFloat32(p + 12, true);
			normal[j + 1] = vdata.getFloat32(p + 16, true);
			normal[j + 2] = vdata.getFloat32(p + 20, true);

			uv[k]     = vdata.getFloat32(p + 24, true);
			uv[k + 1] = 1 - vdata.getFloat32(p + 28, true);

			if (complete) {
				uv1[m]     = vdata.getFloat32(p + 32, true);
				uv1[m + 1] = vdata.getFloat32(p + 36, true);
				uv1[m + 2] = vdata.getFloat32(p + 40, true);
				uv1[m + 3] = vdata.getFloat32(p + 44, true);

				var val = vdata.getFloat32(p + 48, true);

				// calculate color from stretchValue like in packFloatToVec4i(), glsl_std_light.vsh
				colour[j]     = 1.0/256*((val>>16)&0xff);
				colour[j + 1] = 1.0/256*((val>>8)&0xff);
				colour[j + 2] = 1.0/256*((val)&0xff);

				binormal[j]     = vdata.getFloat32(p + 52, true);
				binormal[j + 1] = vdata.getFloat32(p + 56, true);
				binormal[j + 2] = vdata.getFloat32(p + 60, true);

				tangent[j]     = vdata.getFloat32(p + 64, true);
				tangent[j + 1] = vdata.getFloat32(p + 68, true);
				tangent[j + 2] = vdata.getFloat32(p + 72, true);

				if (vsize > 76) {
					// struct VertexV3, added Core::Vec2 uv3
					uv3[k]     = vdata.getFloat32(p + 76, true);
					uv3[k + 1] = 1 - vdata.getFloat32(p + 80, true);
				}
			}
		}

		var buffers = {
			position: new THREE.BufferAttribute(position, 3),
			normal: new THREE.BufferAttribute(normal, 3),
			uv: new THREE.BufferAttribute(uv, 2),
		};

		if (complete) {
			buffers.uv1 = new THREE.BufferAttribute(uv1, 4);
			buffers.colour = new THREE.BufferAttribute(colour, 3);
			buffers.binormal = new THREE.BufferAttribute(binormal, 3);
			buffers.tangent = new THREE.BufferAttribute(tangent, 3);
			if (vsize > 76) {
				buffers.uv3 = new THREE.BufferAttribute(uv3, 2);
			}
		}

		return buffers;
	}

	function createMaterialInfos (root) {
		var materialInfos = [], i, j, k;
		var materialNodes = root.getChildren(bct.Material);
		for (k = 0; k < materialNodes.length; k++) {
			var materialNode = materialNodes[k];
			var materialInfo = { textures: [] };
			var textureNodes = materialNode.getChildren(bct.Texture);
			textureNodes = textureNodes.concat (materialNode.getChildren(bct.TextureFileName));
			for (i = 0; i < textureNodes.length; i++) {
				materialInfo.textures.push (readString (textureNodes[i].data));
			}

			var ambientData = materialNode.getChild(bct.Ambient).data;
			materialInfo.Ambient = new THREE.Color (
				THREE.Math.clamp (ambientData.getFloat32(0, true), 0, 1),
				THREE.Math.clamp (ambientData.getFloat32(4, true), 0, 1),
				THREE.Math.clamp (ambientData.getFloat32(8, true), 0, 1)
			);
			materialInfo.Ambient.a = THREE.Math.clamp (ambientData.getFloat32(12, true), 0, 1);

			var diffuseData = materialNode.getChild(bct.Diffuse).data;
			materialInfo.Diffuse = new THREE.Color (
				THREE.Math.clamp (diffuseData.getFloat32(0, true), 0, 1),
				THREE.Math.clamp (diffuseData.getFloat32(4, true), 0, 1),
				THREE.Math.clamp (diffuseData.getFloat32(8, true), 0, 1)
			);
			materialInfo.Diffuse.a = THREE.Math.clamp (diffuseData.getFloat32(12, true), 0, 1);

			var specularData = materialNode.getChild(bct.Specular).data;
			materialInfo.Specular = new THREE.Color (
				THREE.Math.clamp (specularData.getFloat32(0, true), 0, 1),
				THREE.Math.clamp (specularData.getFloat32(4, true), 0, 1),
				THREE.Math.clamp (specularData.getFloat32(8, true), 0, 1)
			);
			materialInfo.Specular.a = THREE.Math.clamp (specularData.getFloat32(12, true), 0, 1);

			materialInfo.Shininess = materialNode.getChild(bct.Shininess).data.getFloat32(0, true);

			materialInfo.VertexProgramName   = readString (materialNode.getChild (bct.VertexProgramName).data);
			materialInfo.FragmentProgramName = readString (materialNode.getChild (bct.FragmentProgramName).data);

			// console.log(materialNode + '');
			materialInfos.push (materialInfo);
		}
		return materialInfos;
	}

	function createBonesAndSkin (skeleton, skin, vnum) {
		var bones = [], buffers = {};

		if (skin) {

			var bonesMap = {};
			var m = new THREE.Matrix4 (), p = new THREE.Vector3 (), r = new THREE.Quaternion(), s = new THREE.Vector3 ();
			var parseBones = function (node) {
				var boneNodes = node.getChildren (bct.Bone);
				for (var i = 0; i < boneNodes.length; i++) {
					var boneNode = boneNodes[i];
					var boneName = readString (boneNode.getChild (bct.BoneName).data);
					var boneParentName = readString (boneNode.getChild (bct.BoneParentName).data);

					readMatrix4 (boneNode.getChild (bct.BoneOriginalPos).data, m);
					m.decompose (p, r, s);

					var parent = bonesMap [boneParentName];
					bones.push ({
						parent: (parent != undefined) ? parent : -1,
						name: boneName,
						pos: [p.x, p.y, p.z],
						scl: [s.x, s.y, s.z],
						rotq: [r.x, r.y, r.z, r.w]
					});

					bonesMap [boneName] = bones.length -1;

					parseBones (boneNode.getChild (bct.Bones));
				}
			};

			// console.log(readMatrix4(skeleton.getChild(bct.SkeletonPos).data)) // identity
			parseBones (skeleton);

			// three.js expects per-vertex vec4 skinIndex (of bone) and skinWeight
			var skinIndex = new Float32Array (vnum * 4);
			var skinWeight = new Float32Array (vnum * 4);
			var lastUsedSlot = new Uint8Array (vnum);

			// our input is array of skin elements (= vertex index + array of bone name and weight tuples)
			var elements = skin.getChildren (bct.SkinElement);
			for (var i = 0, n = elements.length; i < n; i++) {
				var element = elements[i];
				var index = element.getChild(bct.Index).data.getUint32(0, true), index4 = index << 2;

				var weightsRootSkipped = false;
				element.traverse(function (weight) {
					if (weight == element) return true;
					if (weight.tag == bct.VertexWeights) {
						if (!weightsRootSkipped) return (weightsRootSkipped = true);
						var ptr = index4 + lastUsedSlot[index]++;
						if (ptr - index4 < 4) {
							skinIndex [ptr] = bonesMap [readString (weight.getChild(bct.BoneName).data)];
							skinWeight [ptr] = weight.getChild(bct.VertexWeight).data.getFloat32(0, true); // TODO three.js expects normalized weights
						}
					}
				});
			}

			buffers.skinIndex = new THREE.BufferAttribute(skinIndex, 4);
			buffers.skinWeight = new THREE.BufferAttribute(skinWeight, 4);
		}

		return {
			bones: bones, buffers: buffers
		};
	}

	var standardAttributes = ['position', 'normal', 'tangent', 'uv', 'skinIndex', 'skinWeight'];

	function createGeometry (buffers, root) {
		var idata = root.getChild(bct.Indexes).data, n = idata.byteLength / 4;
		var index = new Uint32Array (n);
		for (var i = 0; i < n; i++) {
			index[i] = idata.getUint32(i * 4, true);
		}

		var geometry = new THREE.BufferGeometry();
		geometry.materialAttributes = {};
		geometry.setIndex (new THREE.BufferAttribute(index, 1));
		for (var name in buffers) {
			geometry.addAttribute (name, buffers[name]);
			// custom attributes no longer go to materials,
			// but our custom materials now rely on this data
			if (standardAttributes.indexOf (name) < 0) {
				geometry.materialAttributes[name] = {};
			}
		}

		var materialIndexNode = root.getChild(bct.MatIdx);
		if (materialIndexNode) {
			geometry.materialIndex = materialIndexNode.data.getUint32(0, true);
		}

		return geometry;
	}

	function importAvatarV3 (tree) {
		var geometryNode = tree.getRoot().getChild(bct.Geometry);
		// parse vertices
		var buffers = createVertexBuffers (geometryNode.getChild(bct.Vertices).data, geometryNode.getChild(bct.VertexSize).data.getUint32(0, true), false);

		// skeleton and skin
		var bonesAndSkin = createBonesAndSkin (
			tree.getRoot().getChild (bct.Skeleton),
			tree.getRoot().getChild (bct.Skin),
			buffers.position.array.length / 3
		);

		for (var name in bonesAndSkin.buffers) {
			buffers[name] = bonesAndSkin.buffers[name];
		}

		// separate geometry for every SubMesh
		var geometries = [];
		var subMeshes = geometryNode.getChildren(bct.SubMesh);

		for (var k = 0; k < subMeshes.length; k++) {
			var geometry = createGeometry (buffers, subMeshes[k]);
			geometry.bones = bonesAndSkin.bones;
			geometries.push (geometry);
		}

		// parse materials
		var materials = createMaterialInfos (tree.getRoot().getChild(bct.Materials));

		return {
			geometries: geometries, materials: materials
		};
	}

	function importClothV1 (tree) {
		var geometries = [], overlayMaterials = [], overlayGeometries = [];
		var curveNodes = tree.getRoot().getChildren(bct.Curve);
		for (var c = 0; c < curveNodes.length; c++) {
			var curveNode = curveNodes[c];

			var buffers = createVertexBuffers (curveNode.getChild(bct.Vertices).data, curveNode.getChild(bct.VertexSize).data.getUint32(0, true), true);

			geometries.push (createGeometry (buffers, curveNode));

			// curves have overlays with thier own vertices and material
			var overlays = curveNode.getChildren (bct.Overlay);
			for (var o = 0; o < overlays.length; o++) {
				var overlayNode = overlays[o];

				var overlayBuffers = createVertexBuffers (overlayNode.getChild(bct.Vertices).data, overlayNode.getChild(bct.VertexSize).data.getUint32(0, true), true);

				overlayGeometries.push (createGeometry (overlayBuffers, overlayNode));

				var material = createMaterialInfos (overlayNode);

				material[0].overlayType = overlayNode.getChild(bct.Type).data.getUint32(0, true);

				overlayMaterials = overlayMaterials.concat (material);
			}
		}

		// parse materials
		var materials = createMaterialInfos (tree.getRoot().getChild(bct.Materials));

		for (var i = 0; i < overlayGeometries.length; i++) {
			overlayGeometries[i].materialIndex = materials.length + i;
		}

		geometries = geometries.concat (overlayGeometries);
		materials = materials.concat (overlayMaterials);

		// parse sewings
		var sewings = tree.getRoot().getChildren(bct.Sewing);
		for (var s = 0; s < sewings.length; s++) {
			var sewingGeometry = geometries[ sewings[s].getChild(bct.MeshIndex1).data.getUint32(0, true) ];

			var sewingCoordinates = [];
			var sewingIndices = sewings[s].getChild(bct.Indexes1).data;
			for (var j = 0; j < sewingIndices.byteLength; j += 4) {
				var coordinatesIndex = sewingIndices.getUint32 (j, true);
				sewingCoordinates.push (
					(new THREE.Vector3 ()).fromArray (sewingGeometry.attributes.position.array, coordinatesIndex * 3)
				);
			}

			sewingGeometry.perimeter = sewingGeometry.perimeter || [];
			sewingGeometry.perimeter.push (sewingCoordinates);
		}

		// parse techpack metrics
		var techpack = {
			A: 'measure_full_length',
			B: 'measure_across_shoulders',
			C: 'measure_across_front',
			D: 'measure_across_chest',
			E: 'measure_across_underchest',
			F: 'measure_across_back',
			G: 'measure_shoulder_length',
			H: 'measure_across_armhole_straigth',
			I: 'measure_sleeve_lenght',
			J: 'measure_across_sleeve_opening',
			K: 'measure_across_sleeve_bicep',
			L: 'measure_across_sleeve_elbow',
			M: 'measure_HPS_to_seam_front',
			N: 'measure_HPS_to_seam_back',
			O: 'measure_across_waist',
		};
		for (var m in techpack) {
			var mNode = tree.getRoot().getChild(bct[ techpack[m] ]);
			if (mNode && mNode.getChild(bct.measure_length)) {
				// got metric
				var mResult = {
					key: 'bct_' + techpack[m],
					length: mNode.getChild(bct.measure_length).data.getFloat32(0, true),
					vertices: []
				};

				techpack[m] = mResult;

				var mVertices = mNode.getChildren(bct.measure_vertex);
				for (var v = 0; v < mVertices.length; v++) {
					var mVertexData = mVertices[v].data;
					if (mVertexData && mVertexData.byteLength) {
						for (var p = 0; p < mVertexData.byteLength; p += 12) {
							mResult.vertices.push({
								x: mVertexData.getFloat32(p, true),
								y: mVertexData.getFloat32(p + 4, true),
								z: mVertexData.getFloat32(p + 8, true),
							});
						}
					} else {
						delete techpack[m];
						break;
					}
				}
			} else {
				// got not
				delete techpack[m];
			}
		}

		return {
			geometries: geometries, materials: materials, techpack: techpack
		};
	}

	// use appropriate parser	
	if ((tree.getSignature () == 'ROBJ') && (tree.getMajorVersion () == 3) && (tree.getMinorVersion () == 0)) {
		return importAvatarV3 (tree);
	}
	if ((tree.getSignature () == 'DRES') && (tree.getMajorVersion () == 3) && (tree.getMinorVersion () == 0)) {
		return importClothV1 (tree);
	}
	if ((tree.getSignature () == 'CURV') && (tree.getMajorVersion () == 1) && (tree.getMinorVersion () == 0)) {
		return importClothV1 (tree);
	}
}

