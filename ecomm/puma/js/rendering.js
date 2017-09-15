// drop-in replacement for vrEffect on desktop
// ideally, this would be merged with actual VREffect
THREE.VREffectAlternative = function( renderer, onError, scene, camera, width, height ) {
	this.isPresenting = false;
	this.renderer = renderer;
	this.composer = new THREE.EffectComposer( renderer );

	// set up postprocessing
	// based on https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html

    var renderScene = new THREE.RenderPass(scene, camera);

    //alert(window.devicePixelRatio);

	this.effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
    this.effectFXAA.uniforms['resolution'].value.set(1 / (width * 2), 1 / (height * 2));

	var copyShader = new THREE.ShaderPass( THREE.CopyShader );
	copyShader.renderToScreen = true;

	var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( width, height), 0.1, 0.1, 0.95 );

    this.composer.setSize(width * 2, height * 2);
	this.composer.addPass( renderScene );
	this.composer.addPass( this.effectFXAA );
	this.composer.addPass( bloomPass );
	this.composer.addPass( copyShader );
};

THREE.VREffectAlternative.prototype.requestAnimationFrame = function( f ) {
	return requestAnimationFrame( f );
};

THREE.VREffectAlternative.prototype.setSize = function( width, height ) {
    this.renderer.setSize(width, height);
    this.composer.setSize(width * 2, height * 2);
    this.effectFXAA.uniforms['resolution'].value.set(1 / (width * 2), 1 / (height * 2));
};

THREE.VREffectAlternative.prototype.render = function( scene, camera ) {
	this.composer.render();
};
