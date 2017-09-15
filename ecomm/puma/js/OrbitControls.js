/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 *
 * This file was seriously modified for the project - do NOT replace (makc)
 */

THREE.OrbitControls = function ( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.center = new THREE.Vector3();

	this.userZoom = true;
	this.userZoomSpeed = 1.0;

	this.userRotate = true;
	this.userRotateSpeed = 1.0;

	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.minUpDown = -0.6;
	this.maxUpDown = +0.6;
	this.speedUpDown = 0.005;

	this.startingZoom = 2.5;

	this.onchange = null; // called when either wheel zoom or UPDOWN active
	this.onclick = null; // called with (x, y) when click is detected
	this.onmove = null; // called with (x, y) when mouse is moved

	// internals

	var scope = this;

	var EPS = 0.000001;
	var PIXELS_PER_ROUND = 1800;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var phiDelta = 0;
	var thetaDelta = 0;
	var radius = this.startingZoom;

	var STATE = { NONE: -1, ROTATE: 0, UPDOWN: 3 };
	var state = STATE.NONE;
	var isLocked = false;


	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};

	this.rotateRight = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta += angle;

	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};

	this.rotateDown = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta += angle;

	};

	this.zoomIn = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		radius *= zoomScale;

	};

	this.zoomOut = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		radius /= zoomScale;

	};

	this.setScale = function ( zoomScale ) {

		radius = zoomScale;

	};

	this.getScale = function () {

		return radius;

	};

	this.update = function () {

		var position = this.object.position;
		var offset = position.clone().sub( this.center );

		// angle from z-axis around y-axis

		var theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		if ( this.autoRotate ) {

			this.rotateLeft( getAutoRotationAngle() );

		}

		theta += thetaDelta;
		phi -= phiDelta;

		// restrict phi to be between desired limits
		phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

		// restrict phi to be betwee EPS and PI-EPS
		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		// restrict radius to be between desired limits
		radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

		offset.x = radius * Math.sin( phi ) * Math.sin( theta );
		offset.y = radius * Math.cos( phi );
		offset.z = radius * Math.sin( phi ) * Math.cos( theta );

		position.copy( this.center ).add( offset );

		this.object.lookAt( this.center );

		thetaDelta = 0;
		phiDelta = 0;

		if (isLocked) {
		    this.domElement.addEventListener('mousedown', onMouseDown, false);
		    this.domElement.addEventListener('touchstart', onMouseDown, true);
		}

	};


	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.userZoomSpeed );

	}

	function makeMouseEvent( event ) {
		if ( event.type.indexOf ('mouse') == 0 ) {
			return event;
		}

		// convert touch events

		var pixelRatio = /*window.devicePixelRatio ||*/ 1;
		return {
			type : (event.type == 'touchstart') ? 'mousedown' : 'other',
			clientX: event.changedTouches[0].clientX * pixelRatio,
			clientY: event.changedTouches[0].clientY * pixelRatio,
			button: 0,
			preventDefault: function () { event.preventDefault (); }
		}
	}

	var clickDetected = false;

	function onMouseDown( event ) {

		event = makeMouseEvent( event );

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		event.preventDefault();

		if ( state === STATE.NONE )
		{
			if ( event.button === 0 )
				state = STATE.ROTATE;
			if ( event.button === 1 )
				state = STATE.UPDOWN;
		}
		
		
		if ( state === STATE.ROTATE ) {

			rotateStart.set( event.clientX, event.clientY );

			clickDetected = true;

		}

		document.addEventListener( 'mouseleave', onMouseUp, false );
		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );
		document.addEventListener( 'touchcancel', onMouseUp, true );
		document.addEventListener( 'touchleave', onMouseUp, true );
		document.addEventListener( 'touchmove', onTouchMove, true );
		document.addEventListener( 'touchend', onMouseUp, true );
	}

	var fingersDistance = -1
	function onTouchMove (e) {
		if (e.touches.length > 1) {
			var done = false;
			var dist = Math.sqrt (
				(e.touches[0].clientX-e.touches[1].clientX) * (e.touches[0].clientX-e.touches[1].clientX) +
				(e.touches[0].clientY-e.touches[1].clientY) * (e.touches[0].clientY-e.touches[1].clientY));
			if (fingersDistance > 0) {
				onMouseWheel ({ wheelDelta: (dist < fingersDistance) ? 1 : -1 });
				done = true;
			}
			fingersDistance = dist;
			if (done) {
				return;
			}
		} else {
			fingersDistance = -1;
		}

		onMouseMove(e);
	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event = makeMouseEvent( event );

		event.preventDefault();

		
		
		if ( state === STATE.ROTATE ) {

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			if (rotateDelta.lengthSq() > 10) {

				scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
				scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );

				rotateStart.copy( rotateEnd );

				clickDetected = false;

			}

		} else if ( state === STATE.UPDOWN ) {

			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			if ( scope.object.parent ) {
				scope.object.parent.position.y = Math.min (scope.maxUpDown, Math.max (scope.minUpDown,
					scope.object.parent.position.y + scope.speedUpDown * movementY
				));
				if (scope.onchange) scope.onchange();
			}
		}
	}

	function onMouseMove2( event ) {

		if ( scope.enabled === false ) return;

		event = makeMouseEvent( event );

		if (scope.onmove) scope.onmove (event.clientX, event.clientY);

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		event = makeMouseEvent( event );

		document.removeEventListener( 'mouseleave', onMouseUp, false );
		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
		document.removeEventListener( 'touchcancel', onMouseUp, true );
		document.removeEventListener( 'touchleave', onMouseUp, true );
		document.removeEventListener( 'touchmove', onTouchMove, true );
		document.removeEventListener( 'touchend', onMouseUp, true );

		state = STATE.NONE;

		if (clickDetected) {
			clickDetected = false;

			if (scope.onclick) scope.onclick (event.clientX, event.clientY);
		}
	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userZoom === false ) return;

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.zoomOut();

		} else {

			scope.zoomIn();

		}

		if (scope.onchange) scope.onchange ();

        //добавил для блокировки скрола страницы
        if (event.preventDefault)
            event.preventDefault();
        event.returnValue = false;

	}

	this.lockTouch = function () {
	    isLocked = true;
	    this.domElement.removeEventListener('mousedown', onMouseDown, false);
	    this.domElement.removeEventListener('touchstart', onMouseDown, true);
	}
    
	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'touchstart', onMouseDown, true );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox

	document.addEventListener( 'mousemove', onMouseMove2, false );
	document.addEventListener( 'touchmove', onMouseMove2, true );
    

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
