function SceneMaterial (parameters) {
	parameters = parameters || {};

	parameters.vertexShader = parameters.vertexShader || '\
		varying vec2 vUv;\
		varying vec3 vViewPosition;\
		void main () {\
			vec4 mvPosition = modelViewMatrix * vec4 (position, 1.0);\
			vViewPosition = -mvPosition.xyz;\
			gl_Position = projectionMatrix * mvPosition;\
			vUv = uv;\
		}\
	';

	parameters.fragmentShader = parameters.fragmentShader || '#extension GL_OES_standard_derivatives : enable\n\
		varying vec2 vUv;\
		varying vec3 vViewPosition;\
		uniform sampler2D texture;\
		void main () {\
			gl_FragColor = texture2D( texture, vUv );\
			vec3 fdx = dFdx(vViewPosition);\
			vec3 fdy = dFdy(vViewPosition);\
			vec3 n = normalize(cross(fdx,fdy));\
			gl_FragColor.xyz *= 0.95 + 0.1 * max(0.0, n.y + n.z);' +

			// optional gamma correction
			(parameters.gamma ? '\
				gl_FragColor.r = pow(gl_FragColor.r, ' + parameters.gamma.r + ');\
				gl_FragColor.g = pow(gl_FragColor.g, ' + parameters.gamma.g + ');\
				gl_FragColor.b = pow(gl_FragColor.b, ' + parameters.gamma.b + ');' : '') +

			'\
		}\
	';

	THREE.ShaderMaterial.call (this);

	this.uniforms.texture = {
		type: 't', value: parameters.map || THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0xafafaf))
	};

	this.setValues (parameters);
};

SceneMaterial.prototype = Object.create (THREE.ShaderMaterial.prototype);


function LineMaterial (parameters) {
	parameters = parameters || {};

	parameters.vertexShader = parameters.vertexShader || '\
		void main () {\
			gl_Position = projectionMatrix * (modelViewMatrix * vec4 (position, 1.0));\
			gl_Position.z -= 0.003;\
		}\
	';

	parameters.fragmentShader = parameters.fragmentShader || '\
		uniform vec3 color;\
		void main () {\
			gl_FragColor = vec4 (color, 1.0);\
		}\
	';

	THREE.ShaderMaterial.call (this);

	this.uniforms.color = {
		type: 'c', value: new THREE.Color (0xEB6C6C)
	};

	this.setValues (parameters);
};

LineMaterial.prototype = Object.create (THREE.ShaderMaterial.prototype);


function StretchMaterial (parameters) {
	parameters = parameters || {};

	parameters.vertexShader = parameters.vertexShader || '\
		attribute vec3 colour;\
		\
		varying vec4 v_colour;\
		\
		void main () {\
			gl_Position = projectionMatrix * (modelViewMatrix * vec4 (position, 1.0));\
			v_colour = vec4 (colour, 1.0);\
		}\
	';

	parameters.fragmentShader = parameters.fragmentShader || '\
		varying vec4 v_colour;\
		\
		void main () {\
			gl_FragColor = v_colour;\
		}\
	';

	parameters.side = THREE.DoubleSide;

	THREE.ShaderMaterial.call (this);

	this.setValues (parameters);
};

StretchMaterial.prototype = Object.create (THREE.ShaderMaterial.prototype);


function TechPackMaterial (material, attributes, params) {

	THREE.ShaderMaterial.call (this);

	var defines = '';

	if (attributes) {
		if (material.overlayType != undefined) {
			// print or weld
			defines += '#define positionOffset 0.001\n';

			if (material.overlayType == 1) {
				// weld
				defines += '#define textureUnit\n';

				// make sure this weld is visible ??
				defines += '#define bUseDoubleSidedLighting\n';
				this.side = THREE.DoubleSide;
			}
		}

		else {
			defines += '#define bUseDoubleSidedLighting\n';
			this.side = THREE.DoubleSide;
		}
	}

	this.vertexShader = defines + '\
		// we prefix all varying names with v_ to prevent collisions with three.js stuff\n\
		varying vec3 v_normal;\n\
		varying vec3 v_viewDirAtEye;\n\
		#ifdef textureUnit\n\
		attribute vec4 uv1;\n\
		varying vec4 v_gl_TexCoord_1;\n\
		#endif\n\
		varying float v_z;\n\
		void main () {\n\
			vec4 vertex = vec4 (position, 1.0);\n\
			gl_Position = projectionMatrix * (modelViewMatrix * vertex);\n\
			#ifdef positionOffset\n\
			gl_Position.z-= positionOffset;\n\
			#endif\n\
			v_normal = normalMatrix * normal;\n\
			v_viewDirAtEye = vec3(normalize(modelViewMatrix * -vertex));\n\
			#ifdef textureUnit\n\
			v_gl_TexCoord_1 = uv1;\n\
			#endif\n\
			v_z = gl_Position.z;\n\
		}\n\
	';

	this.fragmentShader = defines + '\
			#extension GL_OES_standard_derivatives : enable\n\
			varying vec3 v_viewDirAtEye;\n\
			varying vec3 v_normal;\n\
			#ifdef textureUnit\n\
			varying vec4 v_gl_TexCoord_1;\n\
			#endif\n\
			varying float v_z;\n\
			void main () {\n\
				vec3 normalVec = normalize(v_normal);\n\
				#ifdef bUseDoubleSidedLighting\n\
				if (normalVec.z < 0.0) {\n\
					normalVec = -normalVec;\n\
				}\n\
				#endif\n\
				\n\
				float m = 1.0;\n\
				#ifdef textureUnit\n\
				m = ' + params.a.toFixed(1) + ' * (1.0 - v_gl_TexCoord_1.z);\n\
				#endif\n\
				float d = dot (normalVec, normalize(v_viewDirAtEye));\n\
				// try to account for distance\n\
				d = d * (4.0 - v_z) * 0.25;\n\
				// try to account for curvature\n\
				float dx = dFdx(d);\n\
				float dy = dFdy(d);\n\
				d = d / (dx * dx + dy * dy) * 0.005;\n\
				//gl_FragColor = vec4 (vec3(d), 1.0);\n\
				gl_FragColor = vec4 (vec3(min(1.0, ' + params.c.toFixed(1) + ' * (d - ' + params.b.toFixed(1) + ')) * m), 1.0);\n\
			}\n\
		';

};

TechPackMaterial.prototype = Object.create (THREE.ShaderMaterial.prototype);


function MVMaterial (material, attributes, textures, skinning) {

	THREE.ShaderMaterial.call (this);

	this.skinning = !!skinning;

	this.uniforms = {

		LightDir : { type: 'v3v', value: [
			MVMaterial.Lights[0].Direction,
			MVMaterial.Lights[1].Direction
		] },

		LightProductAmbient : { type: 'v4v', value: [
			new THREE.Vector4 (
				MVMaterial.Lights[0].Ambient.r * material.Ambient.r,
				MVMaterial.Lights[0].Ambient.g * material.Ambient.g,
				MVMaterial.Lights[0].Ambient.b * material.Ambient.b,
				material.Ambient.a
			),
			new THREE.Vector4 (
				MVMaterial.Lights[1].Ambient.r * material.Ambient.r,
				MVMaterial.Lights[1].Ambient.g * material.Ambient.g,
				MVMaterial.Lights[1].Ambient.b * material.Ambient.b,
				material.Ambient.a
			)
		] },

		FrontMaterialShininess : { type: 'f', value: material.Shininess },

		FrontMaterialSpecular : { type: 'v4', value: new THREE.Vector4 (
			material.Specular.r,
			material.Specular.g,
			material.Specular.b,
			material.Specular.a
		) },

		FrontLightProductDiffuse : { type: 'v4v', value: [
			new THREE.Vector4 (
				MVMaterial.Lights[0].Diffuse.r * material.Diffuse.r,
				MVMaterial.Lights[0].Diffuse.g * material.Diffuse.g,
				MVMaterial.Lights[0].Diffuse.b * material.Diffuse.b,
				material.Diffuse.a
			),
			new THREE.Vector4 (
				MVMaterial.Lights[1].Diffuse.r * material.Diffuse.r,
				MVMaterial.Lights[1].Diffuse.g * material.Diffuse.g,
				MVMaterial.Lights[1].Diffuse.b * material.Diffuse.b,
				material.Diffuse.a
			)
		] },

		FrontLightProductSpecular : { type: 'v4v', value: [
			new THREE.Vector4 (
				MVMaterial.Lights[0].Specular.r * material.Specular.r,
				MVMaterial.Lights[0].Specular.g * material.Specular.g,
				MVMaterial.Lights[0].Specular.b * material.Specular.b,
				material.Specular.a
			),
			new THREE.Vector4 (
				MVMaterial.Lights[1].Specular.r * material.Specular.r,
				MVMaterial.Lights[1].Specular.g * material.Specular.g,
				MVMaterial.Lights[1].Specular.b * material.Specular.b,
				material.Specular.a
			)
		] },

		FrontMaterialDiffuseA : { type: 'f', value: material.Diffuse.a },

		threshold : { type: 'f', value: 0 },

		opacity : { type: 'f', value: 1 }

	};

	var defines = '#define uLightCount 2\n';

	var version = 1;

	if (attributes) {
		// cloth or overlay
		this.transparent = true;

		if (material.FragmentProgramName.indexOf ('V2') > 0) version = 2;
		if (material.FragmentProgramName.indexOf ('V3') > 0) version = 3;

		if (material.overlayType != undefined) {
			// print or weld
			defines += '#define positionOffset 0.001\n';

			if (material.overlayType == 1) {
				// weld
				defines += '#define textureUnit\n';
			}
		}

		defines += '#define bUseDoubleSidedLighting\n';
		this.side = THREE.DoubleSide;
	}

	if (version > 1) {
		defines += '#define useSecondUVs\n';
	}

	// set textures

	this.uniforms.sTexture0 = {
		type: 't',
		value: textures[ material.textures[0] ] || THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0xafafaf))
	};

	if (material.textures.length > 1) {
		defines += '#define bUseNormal\n';
		this.uniforms.sTexture1 = {
			type: 't',
			value: textures[ material.textures[1] ] || THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0x7f7fff))
		};

		if (material.textures.length > 2) {
			defines += '#define bUseSpecular\n';
			this.uniforms.sTexture2 = {
				type: 't',
				value: textures[ material.textures[2] ] || THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0))
			};			
		};
	}

	this.vertexShader = defines + '\
		// we prefix all varying names with v_ to prevent collisions with three.js stuff\n\
		varying vec3 v_normal;\n\
		varying vec3 v_posAtEye;\n\
		varying vec3 v_ambientCubeColor;\n\
		varying vec2 v_gl_TexCoord_0;\n\
		#ifdef bUseNormal\n\
		varying vec3 v_viewDirAtEye;\n\
		#endif\n\
		#if defined(textureUnit) || (defined(useSecondUVs) && defined(bUseNormal))\n\
		attribute vec4 uv1;\n\
		varying vec4 v_gl_TexCoord_1;\n\
		#endif\n\
		#ifdef bUseSpecular\n\
		attribute vec2 uv3;\n\
		varying vec2 v_gl_TexCoord_2;\n\
		#endif\n\
		\n\
		#ifdef USE_SKINNING\n\
		uniform mat4 bindMatrix;\n\
		uniform mat4 bindMatrixInverse;\n\
		uniform sampler2D boneTexture;\n\
		uniform int boneTextureWidth;\n\
		uniform int boneTextureHeight;\n\
		mat4 getBoneMatrix( const in float i ) {\n\
			float j = i * 4.0;\n\
			float x = mod( j, float( boneTextureWidth ) );\n\
			float y = floor( j / float( boneTextureWidth ) );\n\
			float dx = 1.0 / float( boneTextureWidth );\n\
			float dy = 1.0 / float( boneTextureHeight );\n\
			y = dy * ( y + 0.5 );\n\
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n\
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n\
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n\
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\
			mat4 bone = mat4( v1, v2, v3, v4 );\n\
			return bone;\n\
		}\n\
		#endif\n\
		void main () {\n\
			vec4 vertex;\n\
			#ifdef USE_SKINNING\n\
			mat4 boneMatX = getBoneMatrix( skinIndex.x );\n\
			mat4 boneMatY = getBoneMatrix( skinIndex.y );\n\
			mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n\
			mat4 boneMatW = getBoneMatrix( skinIndex.w );\n\
			vec4 skinVertex = bindMatrix * vec4( position, 1.0 );\n\
			vertex = vec4( 0.0 );\n\
			vertex += boneMatX * skinVertex * skinWeight.x;\n\
			vertex += boneMatY * skinVertex * skinWeight.y;\n\
			vertex += boneMatZ * skinVertex * skinWeight.z;\n\
			vertex += boneMatW * skinVertex * skinWeight.w;\n\
			vertex  = bindMatrixInverse * vertex;\n\
			#else\n\
			vertex = vec4 (position, 1.0);\n\
			#endif\n\
			gl_Position = projectionMatrix * (modelViewMatrix * vertex);\n\
			#ifdef positionOffset\n\
			gl_Position.z-= positionOffset;\n\
			#endif\n\
			\n\
			v_normal = normalMatrix * normal;\n\
			v_posAtEye = vec3(modelViewMatrix * vertex);\n\
			#ifdef bUseNormal\n\
			v_viewDirAtEye = vec3(normalize(modelViewMatrix * -vertex));\n\
			#endif\n\
			\n\
			vec3 nSquared = normal * normal;\n\
			\n\
			// "Index expression must be constant"\n\
			v_ambientCubeColor = vec3 (\n\
				(nSquared.x * (normal.x < 0.0 ? 1.0 : 0.6)) +\n\
				(nSquared.y * (normal.y < 0.0 ? 0.9 : 0.3)) +\n\
				(nSquared.z * (normal.z < 0.0 ? 1.0 : 0.4)));\n\
			\n\
			v_gl_TexCoord_0 = uv;\n\
			#if defined(textureUnit) || (defined(useSecondUVs) && defined(bUseNormal))\n\
			v_gl_TexCoord_1 = uv1;\n\
			#endif\n\
			v_gl_TexCoord_0 = uv;\n\
			#ifdef bUseSpecular\n\
			v_gl_TexCoord_2 = uv3;\n\
			#endif\n\
		}\n\
	';

	this.fragmentShader = defines + '\
			#ifdef bUseNormal\n\
			#extension GL_OES_standard_derivatives : enable\n\
			#endif\n\
			uniform float threshold;\n\
			uniform float opacity;\n\
			uniform sampler2D sTexture0;\n\
			#ifdef bUseNormal\n\
			uniform sampler2D sTexture1;\n\
			mat3 cotangent_frame(vec3 N, vec3 p, vec2 uv) {\n\
				vec2 st = vec2(uv.x, -uv.y);\n\
				vec3 dp1 = dFdx(p);\n\
				vec3 dp2 = dFdy(p);\n\
				vec2 duv1 = dFdx(st);\n\
				vec2 duv2 = dFdy(st);\n\
				vec3 dp2perp = cross(dp2, N);\n\
				vec3 dp1perp = cross(N, dp1);\n\
				vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;\n\
				vec3 B = dp1perp * duv1.y + dp1perp * duv2.y;\n\
				float invmax = inversesqrt( max(dot(T,T), dot(B,B)));\n\
				return mat3(T * invmax, B * invmax, N);\n\
			}\n\
			vec3 perturb_normal(vec3 N, vec3 V, vec2 texcoord, sampler2D texture) {\n\
				vec3 map = texture2D(texture,texcoord).xyz;\n\
				map = (map * 255.0/127.0) - 128.0/127.0;\n\
				mat3 TBN = cotangent_frame(N,-V,texcoord);\n\
				return normalize(TBN * map);\n\
			}\n\
			varying vec3 v_viewDirAtEye;\n\
			#endif\n\
			uniform vec3 LightDir[uLightCount];\n\
			uniform vec4 LightProductAmbient[uLightCount];\n\
			// gl_FrontMaterial.xxx, gl_FrontLightProduct.xxx\n\
			uniform float FrontMaterialShininess;\n\
			uniform vec4 FrontMaterialSpecular;\n\
			uniform vec4 FrontLightProductDiffuse[uLightCount];\n\
			uniform vec4 FrontLightProductSpecular[uLightCount];\n\
			uniform float FrontMaterialDiffuseA;\n\
			\n\
			varying vec3 v_normal;\n\
			varying vec3 v_posAtEye;\n\
			varying vec3 v_ambientCubeColor;\n\
			varying vec2 v_gl_TexCoord_0;\n\
			#if defined(textureUnit) || (defined(useSecondUVs) && defined(bUseNormal))\n\
			varying vec4 v_gl_TexCoord_1;\n\
			#endif\n\
			#ifdef bUseSpecular\n\
			uniform sampler2D sTexture2;\n\
			varying vec2 v_gl_TexCoord_2;\n\
			#endif\n\
			void phongModel(inout vec4 ambient, inout vec4 diffuse, inout vec4 specular, in vec3 normal) {\n\
				#ifdef bUseSpecular\n\
				vec4 spec = texture2D(sTexture2, v_gl_TexCoord_2) * FrontMaterialSpecular;\n\
				#endif\n\
				for(int i=0;i<uLightCount;i++) {\n\
					vec3 L = normalize(LightDir[i]);\n\
					vec3 E = normalize(-v_posAtEye);\n\
					vec3 R = -reflect(L,normal);\n\
					ambient.rgb += (LightProductAmbient[i].rgb * v_ambientCubeColor.rgb);\n\
					/* both ios and android seem to have problems with pow(), so...\n\
					diffuse += (0.3 * max(dot(normal,L), 0.0) + 0.7 * pow(0.5 * dot(normal,L) + 0.5, 2.0)) * FrontLightProductDiffuse[i]; // half lambert\n\
					specular += pow(max(dot(R,E),0.0),FrontMaterialShininess) * FrontLightProductSpecular[i];\n\
					*/\n\
						float dot1 = dot (normal, L);\n\
						float dot2 = max (dot1, 0.0);\n\
						float dot3 = 0.5 * dot1 + 0.5;\n\
						float dot4 = dot (R,E);\n\
						diffuse += (0.3 * dot2 + 0.7 * dot3 * dot3) * FrontLightProductDiffuse[i];\n\
						#ifndef bUseSpecular\n\
						vec4 spec = FrontLightProductSpecular[i];\n\
						#endif\n\
						if (dot4 > 0.0)\n\
						specular += pow(dot4, FrontMaterialShininess) * spec;\n\
				}\n\
			}\n\
			void main () {\n\
				vec4 texColor = texture2D(sTexture0, v_gl_TexCoord_0);\n\
				if (texColor.a < threshold) discard;\n\
				vec3 normalVec = normalize(v_normal);\n\
				#ifdef bUseDoubleSidedLighting\n\
				normalVec *= 1.0 - 2.0 * smoothstep(0.0, 0.7, dot(v_posAtEye, normalVec));\n\
				#endif\n\
				vec4 ambient = vec4(0.0), diffuse = vec4(0.0), specular = vec4(0.0);\n\
				#ifdef bUseNormal\n\
					vec3 perturbNormal = vec3(0.0);\n\
					#ifdef textureUnit\n\
						perturbNormal = perturb_normal(normalVec, v_viewDirAtEye, vec2(v_gl_TexCoord_1.z,fract(v_gl_TexCoord_1.w)), sTexture1);\n\
					#else\n\
						#ifdef useSecondUVs\n\
							perturbNormal = perturb_normal(normalVec, v_viewDirAtEye, vec2(v_gl_TexCoord_1.x, -v_gl_TexCoord_1.y), sTexture1);\n\
						#else\n\
							perturbNormal = perturb_normal(normalVec, v_viewDirAtEye, v_gl_TexCoord_0, sTexture1);\n\
						#endif\n\
					#endif\n\
					phongModel(ambient, diffuse, specular, perturbNormal);\n\
				#else\n\
					phongModel(ambient, diffuse, specular, normalVec);\n\
				#endif\n\
				ambient = clamp(ambient, 0.0, 1.0);\n\
				diffuse = clamp(diffuse, 0.0, 1.0);\n\
				specular = clamp(specular, 0.0, 1.0);\n\
				gl_FragColor = (ambient + diffuse + specular)*texColor;\n\
				gl_FragColor.a = FrontMaterialDiffuseA * texColor.a * opacity;\n\
			}\n\
		';

	if ((material.Ambient.a < 1) || (material.Diffuse.a < 1)) {
		this.depthWrite = false;
	}
}

MVMaterial.Lights = [
	{
		Direction: new THREE.Vector3 (0, 0, 1),
//		Ambient: new THREE.Color (0x7a7a7a),
		Ambient: new THREE.Color (0x4c4c4c),
		Diffuse: new THREE.Color (0xb0b0b0),
		Specular: new THREE.Color (0)
	},
	{
		Direction: new THREE.Vector3 (1, 0, 0), // dynamic
//		Ambient: new THREE.Color (0x3d3d3d),
		Ambient: new THREE.Color (0x4c4c4c),
		Diffuse: new THREE.Color (0xb0b0b0),
		Specular: new THREE.Color (0)
	},
]

MVMaterial.prototype = Object.create (THREE.ShaderMaterial.prototype);
