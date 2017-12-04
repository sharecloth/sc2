function Plugin3d(container, options) {
    var settings = $.extend( {
        // тип взаимодействия с воркером
        'answer': 'rabbit_mq',
        // callback для принятия сообщений со стороны воркера
        'onAnswerReceive': function (data) {
        },
        // единицы, в которых отображаются длины, и округление
        // length = Math.round (settings.unitsa * length в метрах) / settings.unitsb;
        // unitsa = 100, unitsb = 1 округлит до см (как сейчас)
        // unitsa = 1000, unitsb = 10 округлит до мм, но результат будет в см, и т д
        'unitsa' : 100,
        'unitsb' : 1,
        'unitsc' : 'cm.',
        // размеры корневого div-а (который добавляется в container)
        'width'  : 480,
        'height' : 600,
        // вертикальный угол обзора камеры в градусах
        'fov'    : 45,
        // расстояния (в метрах) до плоскостей отсечения камеры
        // см. напр. https://msdn.microsoft.com/en-us/library/ms924585.aspx
        'near'   : 0.1,
        'far'    : 10,
        // цвет и прозрачность заднего фона
        'clearColor' : 0xffffff,
        'transparent' : false,
        // длительность анимации шторок, мс
        'curtainsDelay' : 1000,
        // сервер с API (protocol://domain.name:port)
        'host'   : '',
        // относительный путь к использующимся скриптом изображениям
        'images' : '/3d-plugin-gl/images/',
        // разрешить дополнительные кнопки управления и зум
        'extendedCameraControls' : true,
        // запретить изменение наклона камеры
        'disablePitch' : false,
        // константы в шейдере материала техпака (в настоящее время формула в
        // шейдере не соответствует старым комментариям ниже)
        'techPackMagicNumbers' : {
            a : 1.2, // меньшее число = швы пошире
            b : 0.4, // большее число = края пошире
            c : 25, // большее число = края резче
        },
        // функция, вызывающаяся при ошибках инициализации
        'error' : function (e) { console.error (e); },
        // положение камеры и точка, в которую она смотрит (в метрах,
        // значения по умолчанию соответствуют настройкам редактора)
        'controlsCenter' : new THREE.Vector3 (0, 0.2, 0),
        'cameraPosition': new THREE.Vector3(0, 1, 2.9),
        'minRenderbufferSizeForPostprocessing': 16384,
        'showAddToHomeScreenBlock': false,
        'VRLoader': options.images + 'loading.png',
        'showGallery': false,
    }, options);

    var self = this;
    self.container = container[0];

    var debug = false;

    var subcontainer;
    var curtainsCounter = 0;
    var scene;
    var light2, shadowLights = [];
    var camera, holder;
    var clock;
    var renderer;
    var controls;
    var vrEffect, vrControls;
    var vrDisplay = null;
    var chrome = navigator.userAgent.indexOf('Chrome') > -1;
    var stats;
    var vrButtonsGroup = new THREE.Object3D();
    vrButtonsGroup.vrBtn = true;
    var vrButtonsStaticGroup = new THREE.Object3D();
    var dummyContainer = new THREE.Object3D();
    var vrButtons, gallery;

    self.hideStaticButtons = function () {
        vrButtonsStaticGroup.visible = false;
    };

    self.showStaticButtons = function () {
        vrButtonsStaticGroup.visible = true;
        vrButtonsStaticGroup.children.forEach(function (btn) {
            btn.isActive = false;
        });
    };

    function setInitialCameraPosition () {
        controls.center = settings.controlsCenter.clone ();
        camera.position.copy (settings.cameraPosition);
        var distance = camera.position.distanceTo (controls.center);
        camera.lookAt (controls.center);
        holder.position.set (0, 0, 0);
        controls.minDistance = settings.extendedCameraControls ? 1.0 : camera.position.length ();
        controls.maxDistance = distance + (settings.extendedCameraControls ? 0.5 : 0.0);
        controls.userZoomSpeed = settings.extendedCameraControls ? 2 : 0;
        controls.setScale (distance);
        if (settings.disablePitch) {
            var offset = camera.position.clone().sub(controls.center);
            controls.minPolarAngle = controls.maxPolarAngle = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);
        }
    }

    function toggleFullScreen(element) {
        if (!document.fullscreenElement && !document.fakeFullscreenElement &&
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else {
                // expand the element using position:absolute
                element.style.position = 'absolute';
                element.style.left = '0px';
                element.style.top = '0px';
                document.fakeFullscreenElement = element;
                fullscreenHandler ();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else {
                element.style.position = '';
                element.style.left = '';
                element.style.top = '';
                document.fakeFullscreenElement = undefined;
                fullscreenHandler ();
            }
        }
    }

    function init() {

        try {

            if (settings.showAddToHomeScreenBlock && Util.isIOS() && !navigator.standalone) {
                var addtohome = addToHomescreen({
                    debug: true,
                    autostart: false,
                    maxDisplayCount: 0,
                    skipFirstVisit: false,
                    lifespan: 0,
                    displayPace: 0,
                    startDelay: .5,
                    message: 'To view in fullscreen on iPhone add this web app to the home screen: tap %icon and then <strong>Add to Home Screen</strong>.'
                });
                addtohome.show(true);
            }

            scene = new THREE.Scene();

            scene.add(dummyContainer);

        // lights for standard 3js materials
        if (settings.setLightsUp) {
            settings.setLightsUp (scene);
        } else {

        var light1;
        light1 = new THREE.DirectionalLight (0xffffff, 0.1); scene.add (light1); light1.position.copy (MVMaterial.Lights[0].Direction);
        light2 = new THREE.DirectionalLight (0xffffff, 0.3); scene.add (light2);
        scene.add (new THREE.AmbientLight (0xb2b2b2));

        for (var i = /*-*/1; i < 2; i++) {
            var shadowLight = new THREE.DirectionalLight (0, 0); scene.add (shadowLight); shadowLights.push (shadowLight);
            shadowLight.position.x = 1.2 * i;
            shadowLight.position.y = 2;
            shadowLight.position.z = 2 * (1 - i * i * 0.5);
            shadowLight.castShadow = true;
            shadowLight.shadow.camera.left = -1.5;
            shadowLight.shadow.camera.right = 1.5;
            shadowLight.shadow.camera.top = 1.5;
            shadowLight.shadow.camera.bottom = -1.5;
            shadowLight.shadow.camera.near = 1;
            shadowLight.shadow.camera.far = 10;
            /**/shadowLight.shadow.mapSize.width = 512 * 4;
            /**/shadowLight.shadow.mapSize.height = 512 * 4;
            shadowLight.shadow.bias = -0.0003;
            if (debug && (i < 0)) scene.add(new THREE.CameraHelper (shadowLight.shadow.camera));
        }

        if (debug) window.bias = function (b) {
            for (var i = 0; i < shadowLights.length; i++) {
                shadowLights[i].shadow.bias = b;
            }
        }

        }

        // generateDataTexture was moved from three.js to examples, but we rely on it
        THREE.ImageUtils.generateDataTexture = function ( width, height, color ) {
            var size = width * height;
            var data = new Uint8Array( 3 * size );

            var r = Math.floor( color.r * 255 );
            var g = Math.floor( color.g * 255 );
            var b = Math.floor( color.b * 255 );

            for ( var i = 0; i < size; i ++ ) {

                data[ i * 3 ]      = r;
                data[ i * 3 + 1 ] = g;
                data[ i * 3 + 2 ] = b;

            }

            var texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat );
            texture.needsUpdate = true;

            return texture;
        };

        /*
         * this patch was creating softer shadow on the back of obj-based cloth in r71
         * three.js changed something about shaders, so now it needs to be re-done (or removed)
        var shaderPatch = '\n\
            vec3 lightDirection = normalize (vec3 (0.0, -0.3, -1.0));\n\
            vec3 normalWorld = normalize (vec3 (vec4 (normal, 0.0) * viewMatrix));\n\
            shadowColor.xyz += 0.1 * vec3 (max (0.0, dot (lightDirection, normalWorld)));\n\
            shadowColor = min (shadowColor, vec3 (1.0));\n\
        ';
        var shaderChunk = THREE.ShaderLib.phong.fragmentShader.match(/^([\s\S]*)\* shadowColor;([\s\S]*)$/);
        var shaderLines = shaderChunk[1].split ('\n');
        shaderLines.splice (shaderLines.length -1, 0, shaderPatch);
        THREE.ShaderLib.phong.fragmentShader = shaderLines.join ('\n') + '* shadowColor;' + shaderChunk[2];
        */

        var shaders = ['phong'/*, 'standard', 'physical'*/];
        for (var s = 0; s < shaders.length; s++) {
            var shaderName = shaders[s];

            THREE.ShaderLib[shaderName].vertexShader =
                'attribute vec4 uv1;\n' +
                'varying vec4 v_gl_TexCoord_1;\n' +
                'attribute vec2 uv3;\n' +
                'varying vec2 v_gl_TexCoord_2;\n' +
                THREE.ShaderLib[shaderName].vertexShader.substr(0, THREE.ShaderLib[shaderName].vertexShader.lastIndexOf('}')) +
                'v_gl_TexCoord_1 = uv1;\n' +
                'v_gl_TexCoord_2 = uv3;\n' +
                '}';

            THREE.ShaderLib[shaderName].fragmentShader = (
                'varying vec4 v_gl_TexCoord_1;\n' +
                'varying vec2 v_gl_TexCoord_2;\n' +
                THREE.ShaderLib[shaderName].fragmentShader
            )
            .split ('#include <specularmap_fragment>').join ('#ifdef PATCHED\n#include <specularmap_fragment_patched>\n#else\n#include <specularmap_fragment>\n#endif')
            .split ('#include <normalmap_pars_fragment>').join ('#ifdef PATCHED\n#include <normalmap_pars_fragment_patched>\n#else\n#include <normalmap_pars_fragment>\n#endif');

        }

        THREE.ShaderChunk.specularmap_fragment_patched =
            THREE.ShaderChunk.specularmap_fragment
                .split ('texture2D( specularMap, vUv )').join ('texture2D( specularMap, v_gl_TexCoord_2 )');

        THREE.ShaderChunk.normalmap_pars_fragment_patched =
            THREE.ShaderChunk.normalmap_pars_fragment
                .split ('texture2D( normalMap, vUv )').join ('texture2D( normalMap, vec2(v_gl_TexCoord_1.x, -v_gl_TexCoord_1.y) )');

        camera = new THREE.PerspectiveCamera(
            settings.fov,
            settings.width / settings.height,
            settings.near,
            settings.far
        );

        holder = new THREE.Object3D();
        holder.add(camera);
        scene.add(holder);

        loadingPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(settings.VRLoader), transparent: true, depthTest: false }));
        loadingPlane.position.z = -1.4;
        loadingPlane.visible = false;
        camera.add(loadingPlane); 



        clock = new THREE.Clock();

        gallery = settings.showGallery ? new Gallery(scene, settings) : null;
        vrButtons = new Plugin3dVRButtons(settings.VRRotationOptions, camera, dummyContainer, self, gallery); 

        self.container.addEventListener('onVRButtonClick', function (e) {
            loadingPlane.visible = true;
        }, false);

        self.hideLoadingPlane = function () {
            loadingPlane.visible = false;
            vrButtons.unlock();
        }

        initRenderer();

        navigator.getVRDisplays().then(function (displays) {
            if (displays.length > 0) {
                vrDisplay = displays[0];
                vrDisplay.requestAnimationFrame(render);
            }
        });
      
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.minPolarAngle = Math.PI / 4;
        controls.maxPolarAngle = Math.PI / 2;

        vrControls = new THREE.VRControls(camera);

        var gl = renderer.context;
        var maxBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

        var usePostprocessing = maxBufferSize && maxBufferSize >= settings.minRenderbufferSizeForPostprocessing;

        //vrEffect = new THREE[usePostprocessing && !Util.isMobile () ? 'VREffectAlternative': 'VREffect' ] (renderer, null,
        //    // extra params that VREffect does not need
        //    scene, camera, settings.width, settings.height);


        vrEffect = new THREE.VREffect(renderer);
        vrEffect.setSize(settings.width, settings.height, false);

        setInitialCameraPosition ();

        container.append (subcontainer = $('<div />').css({
            'width': settings.width + 'px',
            'height': settings.height + 'px',
            'overflow': 'hidden',
            'position': 'relative'
        }));


        subcontainer.append( renderer.domElement );

        if (debug) {
            stats = new Stats();
            subcontainer.append(stats.dom);
        }

        // camera controls

        if (settings.extendedCameraControls) {
        var intervals = {},
            mousedown = 'mousedown touchstart',
            mouseup = 'mouseup mouseleave touchend touchleave touchcancel',
            sup = '.up', sdown = '.down', splus = '.plus', sminus = '.minus', sfs = '.fs', svr = '.vr', svrExit = '.vrExit';

        var vrNotSupportPopup = $('<div class="vrNotSupportPopup">' +
            '<div class="centerContainer" >' +
            '<h2> How to experience VR</h2>' +
            '<p>To enter VR, use a <a href="http://webvr.info" target="_blank" rel="noopener noreferrer" style="color: rgb(255, 255, 255);">WebVR-compatible browser</a>' +
            '</div>' +
            '</div>');

        var vrNotSupportPopupCloseBtn = $('<img src="images/close-out-x-square.png" class="closeBtn" />').click(function () {
            vrNotSupportPopup.hide();
        });

        vrNotSupportPopup.hide();
        vrNotSupportPopup.append(vrNotSupportPopupCloseBtn);
        subcontainer.append(vrNotSupportPopup);

        self.exitVR = function () {
            if (!vrDisplay.isPresenting) {
                $('#rightMenu').show();
            } else {
                vrDisplay.exitPresent();
            }

            $("#rightMenu .vrExit").hide();
            $("#rightMenu .vr").show();
            setTimeout(function () {
                container.css({ 'position': 'relative', 'width': container.sizes.previousWidth });
                self.resize(container.sizes.w, container.sizes.h, true);
            }, 500);
            vrButtonsGroup.visible = false;
            vrButtonsStaticGroup.visible = false;
            vrButtons.showHideCrosshair(false);
            loadingPlane.visible = false;
        };


        var lockVRExit = false;
        self.goVR = function () { 
            container.sizes = {
                previousWidth: container.width(),
                w: settings.width,
                h: settings.height
            };
            self.resize(window.innerWidth, window.innerHeight, true);   
            container.css({ 'position': 'absolute', 'top': 0, 'left': 0, 'width': 'auto' });
            setTimeout(function () {
                controls.lockTouch();
            }, 500);
            $("#rightMenu .vrExit").show();
            $("#rightMenu .vr").hide();
            if (Util.isMobile())
                $('#rightMenu').hide();

            lockVRExit = true;

            setTimeout(function () {
                lockVRExit = false;
            }, 1000);

            vrDisplay.requestPresent([{ source: renderer.domElement }]).catch(function (reason) {
                vrNotSupportPopup.show();
                self.exitVR();
            });

            setInitialCameraPosition();
            vrButtonsGroup.visible = true;
            vrButtonsStaticGroup.visible = true;
            vrButtons.showHideCrosshair(true);


        };

        var rightMenu = $('<div id="rightMenu" class="controls">' +
            '<span class="up"></span>' +
            '<span class="down"></span>' +
            '<span class="plus"></span>' +
            '<span class="minus"></span>' +
            '<span class="fs"></span>' +
            '<span class="vrExit" style="display: none"></span>' +
            '<span class="vr"></span>' +
            '</div>').on(mousedown, sup, function () {
                intervals.sup = setInterval(function () {
                    holder.position.y = Math.min(holder.position.y + 0.03, controls.maxUpDown);
                }, 20)
            }).on(mouseup, sup, function () {
                clearInterval(intervals.sup);

            }).on(mousedown, sdown, function () {
                intervals.sdown = setInterval(function () {
                    holder.position.y = Math.max(holder.position.y - 0.03, controls.minUpDown);
                }, 20)
            }).on(mouseup, sdown, function () {
                clearInterval(intervals.sdown);

            }).on(mousedown, splus, function () {
                intervals.splus = setInterval(function () {
                    controls.zoomIn(0.96);
                }, 20)
            }).on(mouseup, splus, function () {
                clearInterval(intervals.splus);

            }).on(mousedown, sminus, function () {
                intervals.sminus = setInterval(function () {
                    controls.zoomOut(0.95);
                }, 20)
            }).on(mouseup, sminus, function () {
                clearInterval(intervals.sminus);

            }).on('mouseup touchend', sfs, function () { // can't use list of events for fullscreen, fu jquery
                toggleFullScreen(container[0]);

            }).on('mouseup touchend', svr, function (obj) {
                self.goVR();
            }).on('mouseup touchend', svrExit, function (obj) {
                self.exitVR();
            });


   
        subcontainer.append(rightMenu);
         

        }

        window.addEventListener('vrdisplaypresentchange', function () {
            if(!lockVRExit)
                self.exitVR();
        }, false);


        window.addEventListener('resize', function () {
            if (vrDisplay.isPresenting) {
                container.css({
                    "position":"fixed",
                    "top": "0px",
                    "right": "0px",
                    "bottom": "0px",
                    "left": "0px",
                    "z-index": "999999",
                    "display": "block"
                });
                self.resize($(window).width(), $(window).innerHeight(), true);
            }
        }, false);

        // click-hold-to-rotate hint

        subcontainer.append($('<div class="viewer-hint"><div class="viewer-movehint"><i class="icon"></i><span class="label">click &amp; hold<br>to rotate</span></div></div>'));

        var onMouseDown = function () {
            $('.viewer-hint').removeClass('active');
            renderer.domElement.removeEventListener('mousedown', onMouseDown);
        }

        renderer.domElement.addEventListener('mousedown', onMouseDown);

        if (document.cookie.indexOf('viewer-hint') < 0) {
            $('.viewer-hint').addClass('active'); document.cookie = 'viewer-hint=1; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
        }

        // curtains

        subcontainer.append($('<div id="curtain_left" class="curtains_closed"><img src="' + settings.images + 'curtain_left.jpg" style="display:none;" onload="this.style.display=\'\';" />'));
        subcontainer.append($('<div id="curtain_right" class="curtains_closed"><img src="' + settings.images + 'curtain_right.jpg" style="display:none;" onload="this.style.display=\'\';" />'));

        // spinner

        subcontainer.append($(createSpinnerHtml (settings.images)));

        subcontainer.append($('<div id="wait_message"><img src="' + settings.images + 'wait_message.png" style="display:none;" onload="this.style.display=\'\';" /></div>'));


        if (debug) {
            //showErrorMessage(33);
            initAxes();

            window.scene = scene;
            window.camera = camera;
            window.renderer = renderer;
        }

        } catch (ohnoes) {
            if (settings.error) {
                settings.error (ohnoes);
            }
        }
    }

    function createSpinnerHtml (imagesPath) {
        return '' +
            '<svg id="spinner" xmlns="http://www.w3.org/2000/svg"version="1.1"xmlns:xlink="http://www.w3.org/1999/xlink"preserveAspectRatio="none"x="0px"y="0px"width="91px"height="91px"viewBox="0 0 91 91"><defs><image id="spinner_gradient"x="0"y="0"width="106"height="106"xlink:href="' + imagesPath + 'spinner_gradient.jpg"/><g id="indikator_0_Layer4_0_FILL"><path fill="#B2B2B2"stroke="none"d="M 251.3 287.7 Q 251.3 279.3 245.6 273.15 239.9 267.05 231.6 266.45 L 231.6 265.4 232.7 265.4 Q 233.1 265.4 233.35 265.15 233.6 264.9 233.6 264.5 L 233.6 262.3 Q 233.6 261.95 233.35 261.65 233.1 261.4 232.7 261.4 L 227.25 261.4 Q 226.9 261.4 226.6 261.65 226.35 261.95 226.35 262.3 L 226.35 264.5 Q 226.35 264.9 226.6 265.15 226.9 265.4 227.25 265.4 L 228.35 265.4 228.35 266.45 Q 220.05 267.05 214.4 273.15 208.65 279.3 208.65 287.7 208.65 296.5 214.9 302.75 221.15 309 230 309 238.8 309 245.05 302.75 251.3 296.5 251.3 287.7 M 214.25 287.3 Q 214.25 280.8 218.85 276.2 223.45 271.6 230 271.6 236.55 271.6 241.15 276.2 245.75 280.8 245.75 287.3 245.75 293.85 241.15 298.45 236.55 303.05 230 303.05 223.5 303.05 218.85 298.45 214.25 293.85 214.25 287.3 Z"/><path fill="#FFFFFF"stroke="none"d="M 218.85 276.2 Q 214.25 280.8 214.25 287.3 214.25 293.85 218.85 298.45 223.5 303.05 230 303.05 236.55 303.05 241.15 298.45 245.75 293.85 245.75 287.3 245.75 280.8 241.15 276.2 236.55 271.6 230 271.6 223.45 271.6 218.85 276.2 Z"/></g><g id="hours_s_0_Layer0_0_FILL"><path fill="#1D1D1B"stroke="none"d="M 298.6 418.25 L 298.6 408.35 295.95 408.35 295.95 418.25 Q 294.3 419.1 294.3 420.9 294.3 422.2 295.15 423.05 296.05 423.9 297.3 423.9 298.55 423.9 299.4 423.05 300.3 422.15 300.3 420.9 300.3 419.1 298.6 418.25 Z"/></g><g id="miinute_s_0_Layer0_0_FILL"><path fill="#1D1D1B"stroke="none"d="M 299.7 419.15 Q 299.1 418.35 298.2 418.1 L 298.2 405.2 296.35 405.2 296.35 418.1 Q 295.45 418.35 294.9 419.15 294.3 419.95 294.3 420.9 294.3 422.15 295.2 423.05 296.05 423.9 297.3 423.9 298.55 423.9 299.4 423.05 300.3 422.15 300.3 420.9 300.3 419.95 299.7 419.15 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_0_FILL"><path fill="#FFFFFF"stroke="none"d="M 327.1 394.75 L 331.75 391.45 Q 326.8 385.7 320.15 381.75 L 317.75 386.95 Q 323.1 390.15 327.1 394.75 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_1_FILL"><path fill="#FFFFFF"stroke="none"d="M 297.6 375.55 L 298.1 381.25 Q 304.1 381.3 310.05 383.35 L 312.45 378.2 Q 305.4 375.65 297.6 375.55 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_2_FILL"><path fill="#FFFFFF"stroke="none"d="M 276.7 454.85 Q 271.4 451.6 267.35 446.95 L 262.65 450.2 Q 267.6 456.05 274.3 460 L 276.7 454.85 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_3_FILL"><path fill="#FFFFFF"stroke="none"d="M 274.9 381.45 L 278.2 386.15 Q 283.5 383.2 289.6 382 L 289.1 376.3 Q 281.55 377.7 274.9 381.45 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_4_FILL"><path fill="#FFFFFF"stroke="none"d="M 336.45 443.75 L 331.3 441.35 Q 328.1 446.65 323.45 450.75 L 326.7 455.4 Q 332.6 450.4 336.45 443.75 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_5_FILL"><path fill="#FFFFFF"stroke="none"d="M 271.2 391 L 267.95 386.35 Q 262.2 391.2 258.2 397.9 L 263.35 400.3 Q 266.5 395.15 271.2 391 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_6_FILL"><path fill="#FFFFFF"stroke="none"d="M 342.65 421.1 L 336.95 421.6 Q 336.9 427.75 334.85 433.65 L 340.05 436.05 Q 342.6 428.85 342.65 421.1 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_7_FILL"><path fill="#FFFFFF"stroke="none"d="M 319.75 460.3 L 316.5 455.65 Q 310.95 458.7 304.95 459.85 L 305.45 465.55 Q 313.05 464.15 319.75 460.3 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_8_FILL"><path fill="#FFFFFF"stroke="none"d="M 336.65 398.4 L 332 401.7 Q 335.05 407.15 336.2 413.15 L 341.85 412.65 Q 340.55 405.2 336.65 398.4 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_9_FILL"><path fill="#FFFFFF"stroke="none"d="M 257.8 443.25 L 262.45 440 Q 259.45 434.4 258.3 428.5 L 252.65 429 Q 254.05 436.65 257.8 443.25 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_10_FILL"><path fill="#FFFFFF"stroke="none"d="M 251.95 420.5 L 257.6 420 Q 257.75 413.85 259.75 408 L 254.6 405.6 Q 251.95 412.95 251.95 420.5 Z"/></g><g id="Mask_Mask_4_0_Layer0_0_MEMBER_11_FILL"><path fill="#FFFFFF"stroke="none"d="M 297 466.25 L 296.5 460.6 Q 290.25 460.45 284.4 458.45 L 282 463.6 Q 289.35 466.25 297 466.25 Z"/></g></defs><g id="timer_mc"transform="matrix( 1, 0, 0, 1, 45.35,45.35) "><g transform="matrix( 1, 0, 0, 1, -229.95,-288.2) "><use xlink:href="#indikator_0_Layer4_0_FILL"/></g><g id="chas_s"transform="matrix( 1, 0, 0, 1, -0.2,0.05) "><g transform="matrix( 1, 0, 0, 1, -297.3,-421.3) "><use xlink:href="#hours_s_0_Layer0_0_FILL"/></g></g><g id="minut_s"transform="matrix( 1, 0, 0, 1, -0.2,-0.2) "><g transform="matrix( 1, 0, 0, 1, -297.3,-421.1) "><use xlink:href="#miinute_s_0_Layer0_0_FILL"/></g></g><mask id="Mask_Mask_1"><g id="Mask_krug"transform="matrix( 1, 0, 0, 1, 0,0) "><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_0_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_1_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_2_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_3_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_4_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_5_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_6_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_7_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_8_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_9_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_10_FILL"/></g><g transform="matrix( 1, 0, 0, 1, -297.3,-420.9) "><use xlink:href="#Mask_Mask_4_0_Layer0_0_MEMBER_11_FILL"/></g></g></mask><g mask="url(#Mask_Mask_1)"><g id="grad"transform="matrix( 1, 0, 0, 1, 0,0) "><g transform="matrix( 1, 0, 0, 1, -53,-53) "><use xlink:href="#spinner_gradient"/></g></g></g></g></svg>'
        ;
    }

    function toggleCurtains (enabled, callback) {
        //console.log('called from ' + (new Error()).stack)
        if (enabled) {
            curtainsCounter++;
            if (curtainsCounter == 1) {
                $('#curtain_left,#curtain_right').addClass('curtains_closed');
                $.when($('#spinner,#wait_message').fadeIn(settings.curtainsDelay)).done(callback);
            } else {
                if (callback) setTimeout (callback, settings.curtainsDelay);
            }
        } else {
            curtainsCounter--;
            if (curtainsCounter <= 0) {
                curtainsCounter = 0;
            }

            if (curtainsCounter == 0) {
                $('#curtain_left,#curtain_right').removeClass('curtains_closed');
                $.when($('#spinner,#wait_message').fadeOut(settings.curtainsDelay)).done(callback);
            } else {
                if (callback) setTimeout(callback, settings.curtainsDelay);
            }
        }
    }

    function showErrorMessage (code) {
        // error popups are 414x167
        var show = function (image) {
            $('#error_popup').remove ();

            image.id = 'error_popup';
            subcontainer.append ($ (image).click (function () {
                $('#error_popup').remove ();
            }));
        }
        var image = new Image()
        image.onload = function() { show (image); }
        image.onerror = function() {
            // fall back to 20 (could not apply) or any other
            image = new Image();
            image.onload = function() { show (image); }
            image.src = settings.images + '20.png';
        }
        image.src = settings.images + code + '.png';
    }

    var glEnums = {};

    function initRenderer() {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: settings.transparent });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(settings.width, settings.height);
        renderer.setClearColor(settings.transparent ? 0 : settings.clearColor, settings.transparent ? 0 : 1);
        renderer.shadowMap.enabled = true;
        renderer.vr.enabled = true;

        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.toneMappingExposure = 1;

        var ctx = renderer.context;
        for (var propertyName in ctx) {
            if (typeof ctx[propertyName] == 'number') {
                glEnums[ctx[propertyName]] = propertyName;
            }
        }

        // shut firefox up
        ctx.getShaderInfoLog = function () { return '' };
    }

    var lastWidth = 0, lastHeight = 0, restoreLastDimensions = function () {
        if (lastWidth && lastHeight) self.resize (lastWidth, lastHeight);
    };

    this.resize = function (width, height, saveDimensions) {
        if (saveDimensions) {
            lastWidth = settings.width;
            lastHeight = settings.height;
        }

        camera.aspect = width / height;
        camera.updateProjectionMatrix ();
        vrEffect.setSize (width, height);

        $(subcontainer).css({ 'width': width + 'px', 'height': height + 'px' });

        settings.width = width;
        settings.height = height;
    };

    var fullscreenHandler = function () {
        if (!document.fullscreenElement && !document.fakeFullscreenElement &&
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
            // exiting
            restoreLastDimensions ();
        } else {
            // entering
            self.resize (screen.width, screen.height, true);
        }
    };

    document.addEventListener("fullscreenchange", fullscreenHandler, false);
    document.addEventListener("webkitfullscreenchange", fullscreenHandler, false);
    document.addEventListener("mozfullscreenchange", fullscreenHandler, false);

    function initAxes(){
        // create a set of coordinate axes to help orient user
        //    specify length in pixels in each direction
        var axes = new THREE.AxisHelper(100);
        scene.add( axes );
    }

    var avatarId = -1;
    var avatarParams = null;
    var avatarPose = null;
    var avatarSkins = null;

    var defaultSceneOffset = -0.9; // 90 cm downwards
    var correctSceneOffset = defaultSceneOffset;

    var currentClothTypeId = 1;

    var view_mat = new THREE.Matrix4 ();
    var light_mat = new THREE.Matrix4 ();

    light_mat.set (
         0.913,  0.000,  0.408, 0,
        -0.365,  0.447,  0.816, 0,
        -0.183, -0.894,  0.408, 0,
             0,      0,      0, 1
    );

    var ah = new THREE.ArrowHelper (new THREE.Vector3(1), new THREE.Vector3(), 1, 0xff7f00);

    var invisible = new THREE.Material ();
    invisible.visible = false;

    function updateSkinBoundsAndCameraLimits() {
        var boundingBox = new THREE.Box3 (), v1 = new THREE.Vector3 ();

        for (var i = 0; i < avatarSkins.length; i++) {
            avatarSkins[i].updateMatrixWorld (true);
            if (i == 0) {
                for (var j = 0, n = avatarSkins[0].geometry.attributes.position.array.length / 3; j < n; j++) {
                    v1.copy (transformedSkinVertex (avatarSkins[0], j));
                    v1.applyMatrix4 (avatarSkins[0].matrixWorld);
                    boundingBox.expandByPoint (v1);
                }

                controls.minUpDown = defaultSceneOffset;
                controls.maxUpDown = defaultSceneOffset + boundingBox.max.y - boundingBox.min.y;

                correctSceneOffset = boundingBox.min.y;
            }
            avatarSkins[i].geometry.boundingSphere = new THREE.Sphere ();
            avatarSkins[i].geometry.boundingSphere.setFromPoints ([boundingBox.min, boundingBox.max]);
            avatarSkins[i].geometry.boundingBox = boundingBox.clone ();
        }
    }

    function render() {

        if (debug)
            stats.update();

        if (avatarPose && avatarSkins) {

            for (var boneName in avatarPose) {
                for (var i = 0; i < avatarSkins.length; i++) {
                    var bone = avatarSkins[i].getObjectByName (boneName, true);
                    avatarPose[boneName].decompose (bone.position, bone.quaternion, bone.scale);
                }
            }

            if (!vrButtonsGroup.positionIsSet) {
                vrButtonsGroup.position.y = -correctSceneOffset;
                vrButtonsGroup.positionIsSet = true;
                if(gallery)
                   gallery.setOffset(-correctSceneOffset + 0.3);
            }

            updateSkinBoundsAndCameraLimits();
            avatarPose = null;
        }

        scene.traverse (function (child) {
            if (child.name.indexOf('scene') == 0 && !child.vrBtn && !child.isGalleryItem) {
               child.position.y = correctSceneOffset;
            }
        });

        // SHOW VR ON DESKTOP
        if (vrDisplay.isPresenting) {
            vrControls.update();
            vrButtons.update();
            // work around camera inside avatar thing
            camera.position.z += 2;
        } else {
            controls.update();
            dummyContainer.rotation.y = 0;
        }

        renderSingleFrame();

        vrDisplay.requestAnimationFrame(render);
    }

    function renderSingleFrame() {

/*
Второй источник привязан к камере. Направление должно менятся при изменении положения камеры по формуле
Direction=view_mat*light_mat*vec3(0,0,1)
где 
view_mat - матрица вида без переноса (матрица поворота камеры)
light_mat - матрица источника освещения, имеющия вид
    0.913 0.000 0.408
    -0.365 0.447 0.816
    -0.183 -0.894 0.408
*/
        view_mat.identity ();
        camera.updateMatrixWorld ();
        view_mat.extractRotation (camera.matrixWorld);
            // next line makes the light rotate the same way it does in the editor,
            // otherwise its direction is fixed in the camera frame
            view_mat.transpose ();
        view_mat.multiply (light_mat);
        MVMaterial.Lights[1].Direction.set (
            // https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js#L41
            // z.x = n13 = e[8], z.y = n23 = e[9], z.z = n33 = e[10]
            view_mat.elements[8], view_mat.elements[9], view_mat.elements[10]
        );

        if (light2) {
            light2.position.copy (MVMaterial.Lights[1].Direction);
        }

        if (debug) {
            if (!ah.parent) scene.add(ah);
            ah.setDirection(MVMaterial.Lights[1].Direction);
        }

        if (debug) {
            if (window.sh) window.sh.update();
        }



        vrEffect.render(scene, camera);
    }


    var processMeshFile = function (zip, fileName) {
        if (/(obj|mtl)$/i.test (fileName)) {
            return zip.file (fileName).asText ();
        }
        if (/robe(mesh|cloth)$/i.test (fileName)) {
            var t = Date.now ();
            //console.profile (fileName);
            var tree = new Btree (zip.file (fileName).asArrayBuffer ());
            //console.profileEnd ();
            console.log ('Btree for ' + fileName + ' built in ' + (Date.now () - t) + ' ms'); // TODO optimize this
            return Import (tree);
        }
        if (/skeleton$/i.test (fileName)) {
            avatarPose = {};
                // apply new skeleton pose from here
                // TODO tidy/extract the function
                var data = new DataView (zip.file (fileName).asArrayBuffer ());

                /*
                matrix = new THREE.Matrix4 ();
                matrix.set (
                    data.getFloat32 ( 0*4, true), data.getFloat32 ( 4*4, true), data.getFloat32 ( 8*4, true), data.getFloat32 (12*4, true),
                    data.getFloat32 ( 1*4, true), data.getFloat32 ( 5*4, true), data.getFloat32 ( 9*4, true), data.getFloat32 (13*4, true),
                    data.getFloat32 ( 2*4, true), data.getFloat32 ( 6*4, true), data.getFloat32 (10*4, true), data.getFloat32 (14*4, true),
                    data.getFloat32 ( 3*4, true), data.getFloat32 ( 7*4, true), data.getFloat32 (11*4, true), data.getFloat32 (15*4, true)
                );*/

                var p = 17*4;
                for (var i = 0, n = data.getUint32 (p - 4, true); i < n; i++) {
                    // name
                    var name = '', j, m = data.getUint32 (p, true); p += 4;
                    for (var j = 0; j < m; j++) {
                        name += String.fromCharCode (data.getUint8 (p + j));
                    }
                    p += j;

                    // parent name
                    p += data.getUint32 (p, true);
                    p += 4;

                    // pose
                    var matrix = new THREE.Matrix4 ();
                    matrix.set (
                        data.getFloat32 ( 0*4 +p, true), data.getFloat32 ( 4*4 +p, true), data.getFloat32 ( 8*4 +p, true), data.getFloat32 (12*4 +p, true),
                        data.getFloat32 ( 1*4 +p, true), data.getFloat32 ( 5*4 +p, true), data.getFloat32 ( 9*4 +p, true), data.getFloat32 (13*4 +p, true),
                        data.getFloat32 ( 2*4 +p, true), data.getFloat32 ( 6*4 +p, true), data.getFloat32 (10*4 +p, true), data.getFloat32 (14*4 +p, true),
                        data.getFloat32 ( 3*4 +p, true), data.getFloat32 ( 7*4 +p, true), data.getFloat32 (11*4 +p, true), data.getFloat32 (15*4 +p, true)
                    );

                    avatarPose[name] = matrix;

                    p += 16 * 4;
                }

            return null;
        }
        return null;
    };

    Math.log2 = Math.log2 || function (x) {
        return Math.log (x) / Math.LN2;
    };

    var processTextureFile = function (zip, fileName) {
        var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
        var texture = new THREE.Texture ();
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        var image = new Image ();
        image.onload = function () {
            texture.image = image;

            var wlog = Math.log2 (image.width);
            var hlog = Math.log2 (image.height);
            var wlogInt = Math.ceil (wlog);
            var hlogInt = Math.ceil (hlog);
            if ((wlog != wlogInt) || (hlog != hlogInt) || (11 < wlogInt) || (11 < hlogInt)) {
                // resize texture, if resolution is NPOT or > 2048
                var canvas = document.createElement ('canvas');
                canvas.width  = 1 << Math.min (wlogInt, 11);
                canvas.height = 1 << Math.min (hlogInt, 11);
                console.log ('resizing the texture, ' + image.width + 'x' + image.height + ' to ' + canvas.width + 'x' + canvas.height);
                var context = canvas.getContext ('2d');
                context.drawImage (image, 0, 0, canvas.width, canvas.height);
                texture.image = canvas;
            }

            texture.needsUpdate = true;
        };

        var file = zip.file (fileName);
        if (file) {
            image.src = 'data:image/' + ext + ';base64,' + JSZip.base64.encode (file.asBinary ());
        } else {
            console.error ('cant read ' + fileName + ' from zip :(');
        }

        return texture;
    };

    var processHDRFile = function (zip, fileName) {
        var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
        if (ext == 'hdr') {
            return zip.file (fileName).asArrayBuffer ()
        }
    };

    var loadZip = function (url, processFile) {
        var t = Date.now();
        return $.Deferred(function (deferred) {
            var abort, xhr =
            JSZipUtils.getBinaryContent(url, function(err, data) {
                document.removeEventListener ('keydown', abort, false);
                if (err) {
                    deferred.reject (err);
                } else {
                    console.log('Downloading ' + url + ' took ' + (Date.now() - t) + ' ms');

                    if (data.byteLength <= 20) {
                        showErrorMessage (data.byteLength);
                        deferred.reject (new Error ('Data too short: ' + data.byteLength + ' bytes, url was ' + url));
                    } else {

                        var result = null;

                        var zip = new JSZip(data);
                        for (var fileName in zip.files) {
                            if (/__MACOSX/.test (fileName)) continue;

                            t = Date.now();
                            var fileResult = processFile (zip, fileName);
                            console.log('Processing ' + fileName + ' took ' + (Date.now() - t) + ' ms');

                            if (fileResult) {
                                result = result || {};
                                result[ fileName ] = fileResult;
                            }
                        }

                        if (result) {
                            deferred.resolve (result);
                        } else {
                            deferred.reject (new Error ('No files processed successfully in ' + url));
                        }
                    }
                }
            });

            if (xhr) {
                abort = function (e) {
                    var evtobj = window.event? event : e;
                    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
                        xhr.abort (); console.warn ('Request aborted by user.')
                    }
                };
                document.addEventListener ('keydown', abort, false);
            }
        }).promise();
    };


    init();

    var hdrCubeRenderTarget;

    this.loadScene = function (sceneId, callback, waitNextAction) {

        toggleCurtains (true, function () {
        $.when(
            loadZip (settings.host + '/plugin/get-scene/' + sceneId + '?_=' + PathResolver.getUnixTimeStamp(), function (zip, fileName) {
                return processMeshFile (zip, fileName) || processHDRFile (zip, fileName) || processTextureFile (zip, fileName);
            })
        ).then(function (files) {
            var meshes = files, textures = files, i, mesh;

            hdrCubeRenderTarget = undefined;
            if (files ['px.hdr']) {
                // we have reflection map
                var hdrBuffers = [
                    files ['px.hdr'], files ['nx.hdr'],
                    files ['py.hdr'], files ['ny.hdr'],
                    files ['pz.hdr'], files ['nz.hdr']
                ];

                new THREE.HDRCubeTextureLoader().load( THREE.UnsignedByteType, hdrBuffers, function ( hdrCubeMap ) {

                    var pmremGenerator = new THREE.PMREMGenerator( hdrCubeMap );
                    pmremGenerator.update( renderer );

                    var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
                    pmremCubeUVPacker.update( renderer );

                    hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
                } );
            }

            for (var name in meshes) {
                var robemesh = meshes[name];
                if(!robemesh.geometries) continue;

                for (i = 0; i < robemesh.geometries.length; i++) {
                    var geometry = robemesh.geometries[i];
                    var material = robemesh.materials[geometry.materialIndex];

                    // hack to use createAvatarMaterial below
                    material.VertexProgramName = material.VertexProgramName || 'sceneBase';

                    mesh = new THREE.Mesh (geometry,
                        //new SceneMaterial ({
                        //    gamma: { r: 0.8, g: 0.7, b: 0.7 },

                        //new THREE.MeshLambertMaterial ({
                        //    map: textures[ material.textures[0] ]
                        //})

                        createAvatarMaterial (material, textures, false, null)
                    );

                    mesh.receiveShadow = true;
                    mesh.position.y = correctSceneOffset;

                    mesh.name = 'scene:' + name + ':' + i;

                    var btn = vrButtons.getButton(name);

                    if (btn) {
                        mesh.isVrBtn = true;
                        if (name !== "btnSeams.robemesh" && name !== "btnStressMap.robemesh")
                            vrButtonsGroup.add(mesh);
                        else {
                            vrButtonsStaticGroup.add(mesh);
                        }
                        mesh.position.copy(btn.position);
                        if (btn.hidden)
                            mesh.visible = false;
                        if (!btn.isStatic)
                            mesh.vrBtn = true;
                        else {
                            mesh.geometry.translate(0, 0.001, 0);
                        }
                        if (btn.rotation) {
                            if (btn.rotation.x)
                                mesh.rotation.x = THREE.Math.degToRad(btn.rotation.x);
                            if (btn.rotation.y)
                                mesh.rotation.y = THREE.Math.degToRad(btn.rotation.y);
                            if (btn.rotation.z)
                                mesh.rotation.z = THREE.Math.degToRad(btn.rotation.z);
                        }
                    } else {
                        scene.add(mesh);
                    }
                }
            }

            // SHOW VR ON DESKTOP
            vrButtonsGroup.visible = false;
            vrButtonsStaticGroup.visible = false;
            scene.add(vrButtonsGroup);
            scene.add(vrButtonsStaticGroup);

            vrButtons.setGroup(vrButtonsGroup.children.concat(vrButtonsStaticGroup.children));

            // Сделать позиционирование камеры и освещения в относительных координатах,
            // систему кооринат привязывать к полу сцены (mokhov)
            if (mesh) {
                var hack = new THREE.Object3D (); mesh.add (hack);
                hack.position.y = -defaultSceneOffset;

                hack.add (holder);
                for (i = 0; i < shadowLights.length; i++) {
                    hack.add (shadowLights[i]);
                }

                // re-parent any custom lights so that shadows work properly
                var lightsReg = /light$/i;
                for (var i = scene.children.length -1; i >= 0; i--) {
                    if (lightsReg.test (scene.children[i].type)) {
                        hack.add (scene.children[i]);
                    }
                }
            }

        }).fail(function (err) {

            if (err) console.error (err);

        }).always(function () {

            if (waitNextAction) {
                callback();
            } else {
                toggleCurtains (false, callback);
            }
          
        });

        });
    };

    var pathfinder = null;

    var removeMeshes = function (prefix) {

        var bag = [];
        scene.traverse (function (child) {
            if (child.name.indexOf (prefix) == 0) {
                bag.push (child);
            }
        });
        while (bag.length > 0) {
            var child = bag.pop ();
            var props = ['geometry', 'material', 'secondMaterial'];
            for (var i = 0; i < props.length; i++) {
                if (child[props[i]]) {
                    child[props[i]].dispose ();
                }
            }
            child.parent.remove (child);
        }

        // kill pathfinder and turn off special modes if removing cloth
        if (prefix == 'cloth') {
            pathfinder = null;
            turnSpecialModesOff ();
        }

    }

    this.loadDummy = function (dummyId, callback, hideCurtains) {

        vrButtonsGroup.positionIsSet = false;
        self.avatarId = dummyId;
        avatarId = dummyId;
        avatarParams = null;
        avatarSkins = null;

        var load = function () {

            removeMeshes('avatar');
            removeMeshes('cloth');
            removeMeshes('plane');

            $.when(
                $.getJSON(settings.host + '/plugin/get-avatar-parameters/' + avatarId + '?_=' + PathResolver.getUnixTimeStamp()),
                loadZip(settings.host + '/plugin/get-user-avatar/' + avatarId + '?_=' + PathResolver.getUnixTimeStamp(), processMeshFile),
                loadZip(settings.host + '/plugin/avatar-texture/' + avatarId + '?_=' + PathResolver.getUnixTimeStamp(), processTextureFile)
            ).then(function (params, meshes, textures) {
                avatarParams = params[0];
                avatarSkins = [];

                var min_y = 0, max_y = 0;


                var mtlText, objText;

                for (name in meshes) {
                    if (/mtl$/i.test(name)) mtlText = meshes[name];
                    if (/obj$/i.test(name)) objText = meshes[name];
                }

                // obj format

                if (mtlText && objText) {
                    var mtlLoader = new THREE.MTLLoader('');
                    var objLoader = new THREE.OBJMTLLoader();

                    var materialsCreator = mtlLoader.parse(mtlText);
                    materialsCreator.loadTexture = function (url) {
                        // assumes unique texture file names
                        return textures[url.match(/([^\/\\]*)$/)[1]] || THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0xafafaf));
                    };

                    var object = objLoader.parse(objText);
                    object.traverse(function (object) {
                        if (object instanceof THREE.Mesh) {
                            object.castShadow = true;
                            if (object.material.name) {
                                var material = materialsCreator.create(object.material.name);
                                if (material) {
                                    if (material.bumpMap) {
                                        material.normalMap = material.bumpMap;
                                        material.bumpMap = null;
                                    }
                                    material.side = THREE.DoubleSide; object.material = material;
                                }
                            }
                        }
                    });

                    // Kosty: В плагине его всегда нужно поворачивать на 90 градусов вокруг оси Х и опускать на 0,86m по оси Z
                    // makc: OBJMTLLoader поворачивает всё за нас, благодаря чему ось Z превращается в Y
                    object.position.y = -0.86;

                    object.name = 'avatar:obj:0';
                    dummyContainer.add(object);

                    return;
                }


                for (var name in meshes) {
                    var robemesh = meshes[name];
                    for (var i = 0; i < robemesh.geometries.length; i++) {
                        var geometry = robemesh.geometries[i];
                        var material = robemesh.materials[geometry.materialIndex];

                        var hasBones = (geometry.bones.length > 0);
                        var mesh = new THREE.SkinnedMesh(geometry,
                            createAvatarMaterial(material, textures, hasBones, hdrCubeRenderTarget ? hdrCubeRenderTarget.texture : undefined)
                        );

                        if (hasBones) {
                            if (debug) {
                                if (window.sh) scene.remove(window.sh);
                                dummyContainer.add(window.sh = new THREE.SkeletonHelper(mesh));
                            }
                            avatarSkins.push(mesh);
                        }

                        mesh.castShadow = true;
                        mesh.name = 'avatar:' + name + ':' + i;
                        dummyContainer.add(mesh);

                        geometry.computeBoundingBox();
                        min_y = Math.min(geometry.boundingBox.min.y, min_y);
                        max_y = Math.max(geometry.boundingBox.max.y, max_y);
                    }
                }

                controls.minUpDown = defaultSceneOffset;
                controls.maxUpDown = defaultSceneOffset + max_y - min_y;

                correctSceneOffset = min_y;

                updateSkinBoundsAndCameraLimits();

            }).fail(function (err) {

                if (err) console.error(err);

            }).always(function () {
                toggleCurtains(false, callback);

            });

        };

        if (hideCurtains) {
            load();
        } else {
            toggleCurtains (true, function () {
                load();
            });
        }

    };

    var stretchModeEnabled = false;

    this.stretchMode = function (enabled, callback) {

        if (enabled) {
            turnSpecialModesOff ();
        }

        if (stretchModeEnabled != enabled) {
            stretchModeEnabled  = enabled;

            scene.traverse (function (child) {
                if ((child.name.indexOf ('cloth') == 0) && child.material && child.secondMaterial) {
                    var material = child.material;
                    child.material = child.secondMaterial;
                    child.secondMaterial = material;
                }
            });
        }

        // TODO defer until after next render
        if (callback) {
            callback ();
        }
    };

    var techPackMeasurements = null;

    this.loadProducts = function (products, callback, clothTypeId, hideCurtains) {

        self.productIds = products;

        if (avatarId < 0) {
            throw new Error ('Avatar ID was not set.');
        }

        var load = function () {

            removeMeshes('cloth');
            removeMeshes('edges');

            techPackMeasurements = null;

            if (!products || (products == '')) {

                toggleCurtains(false, callback);
                return;
            }

            currentClothTypeId = clothTypeId;

            var args = [];

            var combinationIdsUrl = PathResolver.getCombinationIds(products, avatarId, settings);
            console.log('CombinationIdsUrl ids: ' + combinationIdsUrl);

            //todo этот кусок кода еще до конца не доработан.. его бы влить в другую ветку.. или создать еще какую вариацию
            if (settings.answer == 'rabbit_mq') {
                console.log('user rabbit_mq answer');
                args.push(
                    loadZip(combinationIdsUrl, processMeshFile)
                );
            } else if (settings.answer == 'web_sockets') {
                console.log('user web_sockets answer');
                // code from this line on develop - WEB-2135
                args.push(
                    $.Deferred(function (deferred) {
                        $.ajax({
                            url: combinationIdsUrl,
                            success: function (result) {
                                console.log('Web sockets request result is: ');
                                console.log(result.webSocketServer);

                                var client = new WebSocket(result.webSocketServer);

                                client.onopen = function (evt) {
                                    console.log('Connected to web socket server')
                                };

                                client.onclose = function (evt) {
                                    console.log('Close connection')
                                };

                                client.onmessage = function (evt) {
                                    console.log('receiver messages from web socket server:');

                                    var data = JSON.parse(evt.data);
                                    settings.onAnswerReceive(JSON.parse(evt.data));

                                    if (data.command == 'CalcClothesV2Command' && data.succeed == "true") {
                                        client.close();
                                        //load zip and other things
                                        loadZip(settings.host + '/plugin/product-mesh/get-ident/' + data.ident, processMeshFile).then(
                                            function (result) {
                                                deferred.resolve(result);
                                            }
                                        )
                                    }
                                };

                                client.onerror = function (evt) {
                                    console.log('Can not connect to web socket server')
                                    deferred.error();
                                };
                            }
                        });
                    }).promise()
                );
            }

            var textures = PathResolver.getProductTextures(products, settings);

            textures.forEach(function (t) {
                args.push(
                    loadZip(t, processTextureFile)
                );
            });


            $.when.apply(
                $, args
            ).then(function () {
                // restore after stream mode
                setInitialCameraPosition();

                var meshes = arguments[0];

                var name, textures = {};
                for (var a = 1; a < arguments.length; a++) {
                    for (name in arguments[a]) {
                        textures[name] = arguments[a][name];
                    }
                }

                var makeSausages = function () {
                    var count = 0;
                    scene.traverse(function (object) {
                        if (object.geometry && object.geometry.perimeter) {
                            var o = object;
                            while (o) {
                                o.updateMatrixWorld(true); o = o.parent;
                            }

                            // делаем колбасу (here for performance reasons)

                            for (var i = 0; i < object.geometry.perimeter.length; i++) {
                                createPolyLine(object.geometry.perimeter[i].map(function (vector) {
                                    return object.localToWorld(vector.clone());
                                }), 'edges' + (count++), false).visible = false;
                            }

                        }
                    });
                };

                var mtlText, objText;

                for (name in meshes) {
                    if (/mtl$/i.test(name)) mtlText = meshes[name];
                    if (/obj$/i.test(name)) objText = meshes[name];
                }

                // obj format

                if (mtlText && objText) {
                    var mtlLoader = new THREE.MTLLoader('');
                    var objLoader = new THREE.OBJMTLLoader();

                    var materialsCreator = mtlLoader.parse(mtlText);
                    materialsCreator.loadTexture = function (url) {
                        // assumes unique texture file names
                        return textures[url.match(/([^\/\\]*)$/)[1]] || THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0xafafaf));
                    };

                    var object = objLoader.parse(objText), i = 0, geometry, perimeters = [];
                    object.traverse(function (object) {
                        if (object.name == 'perimeter') {
                            return;
                        }
                        if (object instanceof THREE.Mesh) {
                            object.castShadow = true;
                            object.receiveShadow = true;
                            if (object.material.name) {
                                var material = materialsCreator.create(object.material.name);
                                if (material) {
                                    material.side = THREE.DoubleSide; object.material = material;

                                    // находим периметр и создаём "шов"
                                    var a, b, c, e, f, face, k, perimeter = {};
                                    for (f = 0; f < object.geometry.faces.length; f++) {
                                        face = object.geometry.faces[f];
                                        for (e = 0; e < 3; e++) {
                                            a = face[String.fromCharCode(97 + e)]; // 'a', 'b', 'c'
                                            b = face[String.fromCharCode(97 + (e + 1) % 3)];
                                            k = (a < b) ? a + '_' + b : b + '_' + a;
                                            if (perimeter[k]) {
                                                delete perimeter[k];
                                            } else {
                                                perimeter[k] = { e: e, f: f, face: face }
                                            }
                                        }
                                    }

                                    var width = 0.15, height = 0.001;
                                    var vertices = {}, vertexNormals = {}, uvs;

                                    geometry = new THREE.Geometry();
                                    geometry.vertices = object.geometry.vertices.concat();

                                    // сохраняем вершины для колбасы
                                    for (k in perimeter) {
                                        e = perimeter[k].e;
                                        face = perimeter[k].face;

                                        uvs = object.geometry.faceVertexUvs[0][perimeter[k].f];

                                        a = face[String.fromCharCode(97 + e)]; // 'a', 'b', 'c'
                                        b = face[String.fromCharCode(97 + (e + 1) % 3)];
                                        c = face[String.fromCharCode(97 + (e + 2) % 3)];

                                        // calculate new vertices, ac and bc
                                        // if previous ax or bx vertices exist, use them instead
                                        var ac = vertices[a], bc = vertices[b], vac, vbc, nac, nbc;

                                        if (ac) {
                                            vac = geometry.vertices[ac]; nac = vertexNormals[ac];
                                        } else {
                                            vac = geometry.vertices[a].clone().lerp(geometry.vertices[c], width);
                                            vertices[a] = ac = geometry.vertices.length; geometry.vertices.push(vac);
                                            vertexNormals[ac] = nac = face.vertexNormals[e].clone().lerp(face.vertexNormals[(e + 2) % 3], width);
                                            vac.add(nac.multiplyScalar(height));

                                        }

                                        if (bc) {
                                            vbc = geometry.vertices[bc]; nbc = vertexNormals[bc];
                                        } else {
                                            vbc = geometry.vertices[b].clone().lerp(geometry.vertices[c], width);
                                            vertices[b] = bc = geometry.vertices.length; geometry.vertices.push(vbc);
                                            vertexNormals[bc] = nbc = face.vertexNormals[(e + 1) % 3].clone().lerp(face.vertexNormals[(e + 2) % 3], width);
                                            vbc.add(nbc.multiplyScalar(height));
                                        }

                                        // create two faces
                                        geometry.faces.push(new THREE.Face3(a, b, bc, face.normal));
                                        geometry.faces.push(new THREE.Face3(a, bc, ac, face.normal));

                                        var uac = uvs[e].clone().lerp(uvs[(e + 2) % 3], width);
                                        var ubc = uvs[(e + 1) % 3].clone().lerp(uvs[(e + 2) % 3], width);

                                        geometry.faceVertexUvs[0].push([uvs[e], uvs[(e + 1) % 3], ubc]);
                                        geometry.faceVertexUvs[0].push([uvs[e], ubc, uac]);

                                        var min_ab = Math.min(a, b);
                                        var max_ab = Math.max(a, b);
                                        perimeters.push([geometry.vertices[a], geometry.vertices[b]]);
                                    }

                                    geometry.computeFaceNormals();
                                    geometry.computeVertexNormals();

                                    var mesh = new THREE.Mesh(geometry, material);
                                    mesh.name = 'perimeter';
                                    object.add(mesh);

                                    mesh.techPackMaterial = new THREE.MeshBasicMaterial({
                                        color: 0, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1
                                    });

                                    // point and measure mode expects BufferGeometry, so let us convert it here
                                    if (object.geometry.faces.length > 0) {
                                        geometry = new THREE.BufferGeometry();

                                        var n = object.geometry.vertices.length;
                                        var position = new Float32Array(n * 3);
                                        var normal = new Float32Array(n * 3);
                                        var uv = new Float32Array(n * 2);

                                        var index = new Uint16Array(object.geometry.faces.length * 3);

                                        // many vertices will be unused so bounding box
                                        // will include 0,0,0 - must pre-fill positions
                                        var vertex = object.geometry.vertices[0];
                                        for (f = 0; f < n; f++) {
                                            position[f * 3] = vertex.x;
                                            position[f * 3 + 1] = vertex.y;
                                            position[f * 3 + 2] = vertex.z;
                                        }

                                        for (f = 0; f < object.geometry.faces.length; f++) {
                                            face = object.geometry.faces[f];
                                            // assuming uniform UVs and vertex normals...
                                            vertex = object.geometry.vertices[face.a];
                                            position[face.a * 3] = vertex.x;
                                            position[face.a * 3 + 1] = vertex.y;
                                            position[face.a * 3 + 2] = vertex.z;

                                            vertex = object.geometry.vertices[face.b];
                                            position[face.b * 3] = vertex.x;
                                            position[face.b * 3 + 1] = vertex.y;
                                            position[face.b * 3 + 2] = vertex.z;

                                            vertex = object.geometry.vertices[face.c];
                                            position[face.c * 3] = vertex.x;
                                            position[face.c * 3 + 1] = vertex.y;
                                            position[face.c * 3 + 2] = vertex.z;

                                            uvs = object.geometry.faceVertexUvs[0][f];
                                            uv[face.a * 2] = uvs[0].x;
                                            uv[face.a * 2 + 1] = uvs[0].y;

                                            uv[face.b * 2] = uvs[1].x;
                                            uv[face.b * 2 + 1] = uvs[1].y;

                                            uv[face.c * 2] = uvs[2].x;
                                            uv[face.c * 2 + 1] = uvs[2].y;

                                            normal[face.a * 3] = face.vertexNormals[0].x;
                                            normal[face.a * 3 + 1] = face.vertexNormals[0].y;
                                            normal[face.a * 3 + 2] = face.vertexNormals[0].z;

                                            normal[face.b * 3] = face.vertexNormals[1].x;
                                            normal[face.b * 3 + 1] = face.vertexNormals[1].y;
                                            normal[face.b * 3 + 2] = face.vertexNormals[1].z;

                                            normal[face.c * 3] = face.vertexNormals[2].x;
                                            normal[face.c * 3 + 1] = face.vertexNormals[2].y;
                                            normal[face.c * 3 + 2] = face.vertexNormals[2].z;

                                            index[f * 3] = face.a;
                                            index[f * 3 + 1] = face.b;
                                            index[f * 3 + 2] = face.c;
                                        }

                                        geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
                                        geometry.addAttribute('normal', new THREE.BufferAttribute(normal, 3));
                                        geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
                                        geometry.setIndex(new THREE.BufferAttribute(index, 1));

                                        object.geometry = geometry;
                                        object.name = 'cloth:obj:' + (++i); // 1+

                                        object.techPackMaterial = new TechPackMaterial({}, {}, settings.techPackMagicNumbers);
                                    }
                                }
                            }
                        }
                    });

                    geometry.perimeter = [];

                    // собираем куски
                    var threshold = 1e-4, s1, s2, currentArray, lastVertex, candidate;
                    for (s1 = 0; s1 < perimeters.length; s1++) {
                        currentArray = perimeters[s1];
                        var isDuplicated = false;
                        for (s2 = s1 + 1; s2 < perimeters.length; s2++) {
                            candidate = perimeters[s2];
                            if ((
                                (currentArray[0].distanceTo(candidate[0]) < threshold) &&
                                (currentArray[1].distanceTo(candidate[1]) < threshold)
                            ) || (
                                    (currentArray[0].distanceTo(candidate[1]) < threshold) &&
                                    (currentArray[1].distanceTo(candidate[0]) < threshold)
                                )
                            ) {
                                // это шов
                                isDuplicated = true; break;
                            }
                        }
                        if (isDuplicated) {
                            geometry.perimeter.push(currentArray);
                        }
                    }

                    // Kosty: В плагине его всегда нужно поворачивать на 90 градусов вокруг оси Х и опускать на 0,86m по оси Z
                    // makc: OBJMTLLoader поворачивает всё за нас, благодаря чему ось Z превращается в Y
                    object.position.y = -0.86;

                    object.name = 'cloth:obj:0';
                    dummyContainer.add(object);

                    makeSausages();
                    return;
                }

                // robecloth binary format

                for (name in meshes) {
                    var robecloth = meshes[name];

                    techPackMeasurements = robecloth.techpack;

                    for (var i = 0; i < robecloth.geometries.length; i++) {
                        var geometry = robecloth.geometries[i];
                        var material = robecloth.materials[geometry.materialIndex];

                        var clothMaterials = [
                            new MVMaterial(material, geometry.materialAttributes, textures)
                        ];

                        clothMaterials[1] = (material.overlayType != undefined) ? ((material.overlayType == 1) ? clothMaterials[0] : invisible) : new StretchMaterial();

                        var mesh = new THREE.Mesh(geometry, clothMaterials[stretchModeEnabled ? 1 : 0]);
                        mesh.secondMaterial = clothMaterials[stretchModeEnabled ? 0 : 1];
                        mesh.techPackMaterial = new TechPackMaterial(material, geometry.materialAttributes, settings.techPackMagicNumbers);

                        mesh.castShadow = true;
                        mesh.name = 'cloth:' + name + ':' + i;
                        dummyContainer.add(mesh);
                    }
                }

                makeSausages();

            }).fail(function (err) {

                if (err) console.error(err);

            }).always(function () {
                toggleCurtains(false, callback);
            });
        };

        if (hideCurtains) {
            load();
        } else {
            toggleCurtains(true, function () {
                load();
            });
        }

    };

    var turnSpecialModesOff = function () {
        // this assumes there is no waiting to quit special mode
        self.stretchMode (false);
        self.planeMode (false);
        self.pointMode (false);
        self.measureMode (false);
        self.edgesHighlightMode (false);
    };

    var transformedSkinVertex = (function () {
        var siv = new THREE.Vector4 ();
        var swv = new THREE.Vector4 ();
        var svv = new THREE.Vector3 ();
        var result = new THREE.Vector3 (), temp = new THREE.Vector3 (), tempMatrix = new THREE.Matrix4 (), properties = ['x', 'y', 'z', 'w'];

        return function (skin, index) {
            var skinIndices = siv.fromBufferAttribute (skin.geometry.getAttribute ('skinIndex'), index);
            var skinWeights = swv.fromBufferAttribute (skin.geometry.getAttribute ('skinWeight'), index);
            var skinVertex = svv.fromBufferAttribute (skin.geometry.getAttribute ('position'), index).applyMatrix4 (skin.bindMatrix);
            result.set (0, 0, 0);
            for (var i = 0; i < 4; i++) {
                var skinWeight = skinWeights[properties[i]];
                if (skinWeight > 0) {
                    var boneIndex = skinIndices[properties[i]];
                    tempMatrix.multiplyMatrices (skin.skeleton.bones[boneIndex].matrixWorld, skin.skeleton.boneInverses[boneIndex]);
                    result.add (temp.copy (skinVertex).applyMatrix4 (tempMatrix).multiplyScalar (skinWeight));
                }
            }
            var s = result.applyMatrix4 (skin.bindMatrixInverse);
            if (s.y < -1.773) {
                console.log (s, skinIndices, skinWeights, index);
            }
            return s;
        };
    }) ();

    this.calculatePlanes = function (render) {

        var results = {};

                var whitelist = ['BUST_ID', 'WAIST_ID', 'HIPS_ID',
                    'LEFT_BICEPS_ID', 'RIGHT_BICEPS_ID',
                    'LEFT_ELBOW_ID',  'RIGHT_ELBOW_ID',
                    'LEFT_WRIST_ID',  'RIGHT_WRIST_ID'
                ];
                if (currentClothTypeId == 1) {
                    whitelist.push ('LEFT_HIP_ID', 'RIGHT_HIP_ID', 'LEFT_CALF_ID', 'RIGHT_CALF_ID', 'LEFT_KNEES_ID',  'RIGHT_KNEES_ID');
                } else {
                    whitelist.push ('KNEES_ID');
                }

                for (var key in avatarParams.data.normal) if (whitelist.indexOf (key) >= 0) {

                    var planeData = avatarParams.data.normal[key];
                    if (planeData.length) planeData = planeData[0];

                    var vertex = transformedSkinVertex (avatarSkins[0], planeData);

                    // find the bone
                    var boneLine = new THREE.Line3 ();
                    if (/BUST|WAIST|HIPS/.test (key) || (key == 'KNEES_ID')) {
                        boneLine.start.set (0, -10, 0); boneLine.end.set (0, 10, 0);
                    } else {
                        var bone = avatarSkins[0].getObjectByName ({
                            LEFT_BICEPS_ID: 'LoArm_L', RIGHT_BICEPS_ID: 'LoArm_R',
                            LEFT_ELBOW_ID: 'Hand_L', RIGHT_ELBOW_ID: 'Hand_R',
                            LEFT_WRIST_ID: 'Hand_L', RIGHT_WRIST_ID: 'Hand_R',
                            LEFT_KNEES_ID: 'LoLeg_L', RIGHT_KNEES_ID: 'LoLeg_R',
                            LEFT_CALF_ID: 'LoLeg_L', RIGHT_CALF_ID: 'LoLeg_R',
                            LEFT_HIP_ID: 'LoLeg_L', RIGHT_HIP_ID: 'LoLeg_R'
                        } [key]);

                        bone.parent.localToWorld (boneLine.start);
                        bone.localToWorld (boneLine.end);

                        if (/CALF/.test (key)) {
                            boneLine.start.z -= 0.04; boneLine.end.z -= 0.04;
                        }

                        switch (key) {
                            case 'LEFT_CALF_ID':
                            case 'LEFT_HIP_ID':
                            case 'LEFT_KNEES_ID':
                                boneLine.start.x += 0.1; boneLine.end.x += 0.1;
                            break;
                            case 'RIGHT_CALF_ID':
                            case 'RIGHT_HIP_ID':
                            case 'RIGHT_KNEES_ID':
                                boneLine.start.x -= 0.1; boneLine.end.x -= 0.1;
                            break;
                        }
                    }

                    var size = 0.35, rotationZ = 0;
                    if (/BICEPS|ELBOW|WRIST/.test (key)) {
                        size = 0.15;
                    } else if (/CALF|HIP_|_KNEE/.test (key)) {
                        size = 0.39;
                        rotationZ = 2.36;
                        switch (key) {
                            case 'LEFT_CALF_ID':  rotationZ = 1.05; break;
                            case 'LEFT_KNEES_ID': rotationZ = 1.05; break;
                            case 'LEFT_HIP_ID':   rotationZ = -2.6; break;
                        }
                    } else switch (key) {
                        case 'WAIST_ID': size = 0.45; break;
                        case 'HIPS_ID':  size = 0.80; break;
                        case 'KNEES_ID': size = 1.00; break;
                    }

                    var mesh;
                    if (render) {
                        mesh = new THREE.Mesh (
                            new THREE.PlaneBufferGeometry (size, size),
                            new THREE.MeshBasicMaterial ({
                                color: 0xffff77,
                                opacity: 0.5,
                                side: THREE.DoubleSide,
                                depthWrite: false,
                                transparent: true
                            })
                        );
                        mesh.geometry.applyMatrix ((new THREE.Matrix4 ()).makeRotationZ (rotationZ));
                    } else {
                        // dummy object, to use its localToWorld()
                        // these are removed below
                        mesh = new THREE.Object3D ();
                    }
                    mesh.name = 'plane' + key;
                    boneLine.closestPointToPoint (vertex, false, mesh.position);
                    mesh.lookAt (boneLine.end);
                    dummyContainer.add(mesh);

                    mesh.updateMatrixWorld (true);

                    var size2 = size / 2;
                    var size8 = size / 8;

                    var lineGeometry;
                    if (render) {
                        lineGeometry = new THREE.Geometry ();
                    }

                    // cloth intersections length - ?
                    var triangle = new THREE.Triangle ();
                    mesh.localToWorld (triangle.a);
                    triangle.b.x = 1; mesh.localToWorld (triangle.b);
                    triangle.c.y = 1; mesh.localToWorld (triangle.c);

                    var plane = new THREE.Plane (); plane.setFromCoplanarPoints (triangle.a, triangle.b, triangle.c);
                    var length = 0, line = new THREE.Line3 (), vFrom = new THREE.Vector3 (), vTo = new THREE.Vector3 ();
                    var invRotMatrix = (new THREE.Matrix4 ()).makeRotationZ (-rotationZ);
                    scene.traverse (function (object) {
                        if (object.geometry && (object.name.indexOf ('cloth') == 0)) {
                            var positions = object.geometry.getAttribute ('position');
                            var indicesArray = object.geometry.getIndex().array;
                            for (var i = 0, n = indicesArray.length; i < n; i += 3) {
                                triangle.a.fromBufferAttribute (positions, indicesArray[i]); object.localToWorld (triangle.a);
                                triangle.b.fromBufferAttribute (positions, indicesArray[i + 1]); object.localToWorld (triangle.b);
                                triangle.c.fromBufferAttribute (positions, indicesArray[i + 2]); object.localToWorld (triangle.c);

                                triangle.midpoint (vTo); mesh.worldToLocal (vTo).applyMatrix4 (invRotMatrix);
                                if ((Math.abs (vTo.x) > size2) || (Math.abs (vTo.y) > size2) || (Math.abs (vTo.z) > size8)) continue;

                                vFrom.set (0, 0, 0); vTo.set (0, 0, 0);

                                var plane2a = plane.distanceToPoint (triangle.a);
                                var plane2b = plane.distanceToPoint (triangle.b);
                                var plane2c = plane.distanceToPoint (triangle.c);

                                if (plane2a * plane2b <= 0) {
                                    if (plane2a * plane2c <= 0) {
                                        //   a
                                        // -----
                                        // b   c
                                        line.set (triangle.a, triangle.b); plane.intersectLine (line, vFrom);
                                        line.set (triangle.a, triangle.c); plane.intersectLine (line, vTo);
                                    } else {
                                        //   b
                                        // -----
                                        // a   c
                                        line.set (triangle.b, triangle.a); plane.intersectLine (line, vFrom);
                                        line.set (triangle.b, triangle.c); plane.intersectLine (line, vTo);
                                    }
                                } else if (plane2a * plane2c <= 0) {
                                    //   c
                                    // -----
                                    // a   b
                                    line.set (triangle.c, triangle.a); plane.intersectLine (line, vFrom);
                                    line.set (triangle.c, triangle.b); plane.intersectLine (line, vTo);
                                }

                                var distance = vFrom.distanceTo (vTo)

                                if((distance > 0) && render) {

                                    lineGeometry.vertices.push (vFrom.clone ());
                                    lineGeometry.vertices.push (vTo.clone ());

                                }

                                length += distance;
                            }
                        }
                    });

                    results[key] = length;

                    if (render) {
                        var line = new THREE.Line (lineGeometry, new THREE.LineBasicMaterial ({ color: 0xffffff, linewidth: 3 }), THREE.LinePieces);
                        line.name = 'plane_line';
                        dummyContainer.add(line);
                    }

                    length = Math.round (settings.unitsa * length) / settings.unitsb;

                    if ((length > 0) && render) {

                        var popupCoords = (new THREE.Vector3 (-size2, size2, 0)).applyMatrix4 ((new THREE.Matrix4 ()).makeRotationZ (rotationZ));

                        addPopupToObject3D(
                            '<div class="img-point img-point-planes">' +
                                '<div class="point-message">' +
                                    '<div class="point-arrow"></div>' +
                                    '<div class="message-inner">' + length + ' ' + settings.unitsc + '</div>' +
                                '</div>' +
                                //'<div class="point-dot"></div>' +
                            '</div>',
                            mesh, false, popupCoords.x, popupCoords.y, 0, 30, 28
                        ).css ({
                            'pointer-events': 'none'
                        });

                    }
                }

        if (!render) {
            // clean up
            removeMeshes ('plane');
        }

        return results;
    };

    this.planeMode = function (enabled, callback) {
        // remove all the planes
        removeMeshes ('plane');

        if (enabled) {

            turnSpecialModesOff ();

            this.calculatePlanes (true);
        }

        if (callback) {
            callback ();
        }

    };

    var pointsCallback = null;

    this.setAddPointCallback = function (callback) {
        // (pointNum, meshIndex, x, y, z)
        pointsCallback = callback;
    };

    // [ { 'index': 0, 'meshIndex': '"Mesh0_3174"', 'pos': [vector.x, vector.y, vector.z] }, ... ]
    var pointsList = [];

    pointsList.nextPointNum = function () {
        var n = -1;
        for (var i = 0; i < this.length; i++) {
            n = Math.max (n, this[i].index);
        }
        return n + 1;
    };

    pointsList.findPoint = function (pointNum) {
        for (var i = 0; i < this.length; i++) {
            if (pointNum == this[i].index) {
                return this[i];
            }
        }
    };


    var getVertex = (function () {
        var vertex = new THREE.Vector3();
        return function (mesh, index) {
            var vertices = mesh.geometry.attributes.position/*getAttribute('position')*/.array;
            index *= 3;
            if (vertices.length > index + 2) {
                vertex.x = vertices [index];
                vertex.y = vertices [index + 1];
                vertex.z = vertices [index + 2];
                return vertex;
            }
        }
    })();

    var raycaster = new THREE.Raycaster();

    var intersectionCandidates = {}, intersectionCandidateCollectors = {};

    var findIntersection = function (x, y, prefix) {

        prefix = prefix || 'cloth';

        var candidates = intersectionCandidates[prefix] || [];
        candidates.length = 0; intersectionCandidates[prefix] = candidates;

        var collector = intersectionCandidateCollectors[prefix] || function (object) {
            if (object.name.indexOf (prefix) == 0) {
                candidates.push (object);
            }
        }; intersectionCandidateCollectors[prefix] = collector;

        scene.traverse (collector);

        var canvasRect = renderer.domElement.getBoundingClientRect ();

        // this might be fixed in future versions
        // https://github.com/mrdoob/three.js/pull/6297
        //raycaster.setFromCamera ({
        //    x:  ((x - canvasRect.left) / settings.width) * 2 - 1,
        //    y: -((y - canvasRect.top) / settings.height) * 2 + 1
        //}, camera);

        raycaster.ray.origin.set (0, 0, 0);
        camera.localToWorld (raycaster.ray.origin);
        raycaster.ray.direction.set (
            ((x - canvasRect.left) / settings.width) * 2 - 1,
            ((canvasRect.top - y) / settings.height) * 2 + 1,
        0.5).unproject (camera).sub (raycaster.ray.origin).normalize ();

        var intersects = raycaster.intersectObjects (candidates);
        if (intersects) {
            // find closest cloth intersection
            for (var i = 0; i < intersects.length; i++) {
                var objectName = intersects[i].object.name;
                var result = { meshName: objectName };

                if (intersects[i].object.geometry.attributes) {

                    // this code assumes that we hit the cloth (which has buffer geometry)

                    var indices = [intersects[i].face.a, intersects[i].face.b, intersects[i].face.c];

                    var min_d = 1e9, min_i = -1, vertex;
                    for (var j = 0; j < 3; j++) {
                        vertex = getVertex (intersects[i].object, indices[j]);
                        var d = vertex.distanceTo (intersects[i].point);
                        if (min_d > d) {
                            min_d = d; min_i = indices[j];
                        }
                    }

                    vertex = getVertex (intersects[i].object, min_i);
                    intersects[i].object.localToWorld (vertex);

                    result.index = pointsList.nextPointNum ();
                    result.meshIndex = objectName + '_' + min_i;
                    result.pos = [vertex.x, vertex.y, vertex.z];
                }

                return result;
            }
        }
    };

    var isPointVisible = function (screenVector) {
        raycaster.ray.direction.copy (screenVector);

        raycaster.ray.origin.set (0, 0, 0); camera.localToWorld (raycaster.ray.origin);
        raycaster.ray.direction.sub (raycaster.ray.origin);
        
        var distance = raycaster.ray.direction.length ();
        raycaster.ray.direction.normalize ();

        var intersections = raycaster.intersectObject( scene, true );

        // filter out the lines
        while (intersections.length && (!intersections[0].face
            || (intersections[0].object.name.indexOf ('measure') == 0)
            // ignore avatar arms
            || ((intersections[0].object.name.indexOf ('avatar') == 0) && (Math.abs (intersections[0].point.x) > 0.12))
        )) {
            intersections.shift ();
        }
        
        if (intersections.length && (intersections[0].distance < distance - 0.001)) {

            // point is obscured
            return false
        }

        return true;
    };

    var addPopupToObject3D = function (html, object, alwaysVisible, x, y, z, dx, dy) {

        var screenVector = new THREE.Vector3 ();
        var popup = $(html);

        popup.insertBefore ($ (renderer.domElement.nextSibling));

        var style = popup[0].style;

        object.updateMatrixWorld = function (force) {
            THREE.Object3D.prototype.updateMatrixWorld.call (this, force);

            screenVector.set (x || 0, y || 0, z || 0); this.localToWorld (screenVector);

            if (alwaysVisible || isPointVisible (screenVector)) {

                style.display = '';

                screenVector.project (camera);
                
                style.left = Math.round((screenVector.x + 1) * settings.width / 2 - (dx || 55)) + 'px';
                style.top = Math.round((1 - screenVector.y) * settings.height / 2 - (dy || 40)) + 'px';

                style.zIndex = Math.round((1 - screenVector.z) * 1e4);

            } else {

                style.display = 'none';

            }
        };

        object.addEventListener ('removed', function () {
            popup.remove ();
        });

        return popup;
    };

    var smoothPath = function (points) {
        return points;
    };

    var createPolyLine = function (points, name, showLength) {
        var positions = new Array (points.length);
        var lastPoint = points[points.length - 1];

        var length = 0;
        for (var r = 0; r < points.length; r++) {
            var point = points[r];
            positions[r] = new THREE.Vector3 (point.x - lastPoint.x, point.y - lastPoint.y, point.z - lastPoint.z);
            if (r > 0) {
                length += positions[r].distanceTo (positions[r - 1]);
            }
        }
        length = Math.round (settings.unitsa * length) / settings.unitsb;

        var line = new THREE.Mesh (
            new THREE.ExtrudeGeometry (
                new THREE.Shape (
                    [{"x":0.006,"y":0},{"x":0.001854,"y":0.005706},{"x":-0.004854,"y":0.003526},{"x":-0.004854,"y":-0.003526},{"x":0.001854,"y":-0.005706}]
                ), {
                    steps: 3 * points.length, bevelEnabled: false, extrudePath: new THREE.CatmullRomCurve3 (positions)
                }
            ),
            new LineMaterial ()
        );
        line.position.copy (lastPoint);
        line.name = name;
        dummyContainer.add (line);

        if (showLength) {
            addPopupToObject3D(
                '<div class="img-point">' +
                    '<div class="point-message">' +
                        '<div class="point-arrow"></div>' +
                        '<div class="message-inner">' + length + ' ' + settings.unitsc + '</div>' +
                    '</div>' +
                    '<div class="point-dot"></div>' +
                '</div>',
                line
            );
        }

        return line;
    };

    var createMeasurePoint = function (point) {
        var mesh = new THREE.Object3D ();
        mesh.name = 'measure' + point.index;
        mesh.position.set (point.pos[0], point.pos[1], point.pos[2]);
        dummyContainer.add(mesh);

        var popup = addPopupToObject3D(
            '<div class="img-point">' +
                '<div class="point-message">' +
                    '<div class="point-arrow"></div>' +
                    '<div class="message-inner">&nbsp;</div>' +
                '</div>' +
                '<div class="point-dot"></div>' +
            '</div>',
            mesh
        );

        popup.css({ pointerEvents: 'none' });
        popup.find('.point-message, .point-arrow').css ({ backgroundColor: 'rgba(0,0,0,0)', border: '0px solid' });

        return mesh;
    };

    var initPointPosition = function (point) {
        var meshIndex = point.meshIndex.split ('_');
        var mesh = scene.getObjectByName (meshIndex[0]);
        if (mesh) {
            var vertex = getVertex (mesh, parseInt (meshIndex[1]));
            if (vertex) mesh.localToWorld (vertex); else vertex = { x: point.pos[0], y: point.pos[1], z: point.pos[2] };
            point.pos = [ vertex.x, vertex.y, vertex.z ];
        }        
    };

    var createPointMesh = function (point, noPlus) {
        initPointPosition (point);

        var mesh = new THREE.Object3D ();
        mesh.name = 'point' + point.index;
        mesh.position.set (point.pos[0], point.pos[1], point.pos[2]);
        dummyContainer.add(mesh);

        var popup = addPopupToObject3D(
            '<div class="img-point">' +
                '<div class="point-message">' +
                    '<div class="point-arrow"></div>' +
                    '<div class="message-inner">Point ' + point.index + (noPlus ? '' : ' <span class="message-add"><a href="javascript:void(0);"><span class="glyphicon glyphicon-plus"></span></a></span>') + '</div>' +
                '</div>' +
                '<div class="point-dot"></div>' +
            '</div>',
            mesh
        );

        if (!noPlus) {
            popup.find('a').click (function () {
                if (pointsCallback) {
                    pointsCallback (point.index, point.meshIndex, point.pos[0], point.pos[1], point.pos[2]);
                }
            });
        }

        return mesh;
    };

    this.setPointsList = function (list) {
        pointsList.length = 0;
        pointsList.push.apply (pointsList, list);

        removeMeshes ('point');
    };

    this.highlightPoint = function (pointNum, show) {
        removeMeshes ('point' + pointNum);
        if (show) {
            createPointMesh (pointsList.findPoint (pointNum), true);
        }
    };

    this.deletePoint = function (pointNum) {
        var index = pointsList.indexOf (pointsList.findPoint (pointNum));
        if (index >= 0) {
            pointsList.splice (index, 1);

            this.highlightPoint (pointNum, false);
        }
    };

    this.pointMode = function (enabled) {

        removeMeshes ('point');

        controls.onclick = null;

        if (enabled) {

            turnSpecialModesOff ();

            controls.onclick = function (x, y) {

                var point = findIntersection (x, y);
                if (point) {

                    self.highlightPoint (point.index, false);

                    createPointMesh (point);

                    if (pointsCallback) {
                        pointsCallback (point.index, point.meshIndex, point.pos[0], point.pos[1], point.pos[2]);
                    }

                }

            }
        }
    };


    this.measureMode = function (enabled, callback) {

        removeMeshes ('measure');

        controls.onclick = null;

        if (enabled) {

            turnSpecialModesOff ();

            if (!pathfinder) {

                var t = Date.now ();
                
                pathfinder = new Pathfinder();

                console.log ('pathfinder instance created in ' + (Date.now () - t) + ' ms');

                t = Date.now ();

                scene.traverse (function (child) { if (child.geometry) {
                    var objectName = child.name;
                    if (objectName.indexOf ('cloth') == 0) {
                        var indices = child.geometry.getIndex().array;

                        for (var i = 0; i < indices.length; i += 3) {

                            var j, a, b, meshIndexA, meshIndexB;

                            for (j = 0; j < 3; j++) {
                                a = indices[i + j];

                                meshIndexA = objectName + '_' + a;
                                if(!pathfinder.hasNode (meshIndexA)) {
                                    var vertex = getVertex (child, a);
                                    pathfinder.addNode (meshIndexA, vertex.x, vertex.y, vertex.z);
                                }
                            }

                            for (j = 0; j < 3; j++) {
                                a = indices[i + j];
                                b = indices[i + (j + 1) % 3];
                                meshIndexA = objectName + '_' + a;
                                meshIndexB = objectName + '_' + b;
                                pathfinder.addEdge (meshIndexA, meshIndexB);
                            }
                        }
                    }
                }});

                console.log ('cloth graph created in ' + (Date.now () - t) + ' ms');

                t = Date.now ();

                pathfinder.weld (0.0001);

                console.log ('cloth graph welded in ' + (Date.now () - t) + ' ms');
            }

            var p1;

            controls.onclick = function (x, y) {

                var point = findIntersection (x, y);
                if (point) {

                    removeMeshes ('measure');

                    if (!p1) {
                        p1 = point;
                        console.log ('p1', point);

                        createMeasurePoint (point);
                    } else {
                        console.log ('p2', point);

                        createMeasurePoint (p1);

                        var t = Date.now ();
                        
                        var result = pathfinder.findPath(p1.meshIndex, point.meshIndex);

                        console.log ('astar finished in ' + (Date.now () - t) + ' ms');
                        console.log (result);

                        if (result) {
                            result = result.concat ();

                            var object = scene.getObjectByName (point.meshIndex.split ('_') [0]);
                            for (var i = 0; i < result.length; i++) {
                                var ri = new THREE.Vector3 (); ri.copy (result[i]); object.localToWorld (ri); result[i] = ri;
                            }

                            createPolyLine (smoothPath (result), 'measure', true);
                            p1 = null;
                        } else {
                            alert ('Cannot connect the points.')
                        }

                    }

                }
            }
        }

        if (callback) {
            callback ();
        }

    };


    this.getScreenShots = function (techPack) {

        var viewParams = [
            // x, y, z, rot.y - front
            [0, 0, controls.startingZoom, 0],
            // left
            [controls.startingZoom, 0, 0, Math.PI / 2],
            // back
            [0, 0, -controls.startingZoom, Math.PI],
            // right
            [-controls.startingZoom, 0, 0, -Math.PI / 2]
        ];

        var i, materials = {}, boundingBox;

        var tempCanvas = document.createElement ('canvas');
        tempCanvas.width  = renderer.domElement.width;
        tempCanvas.height = renderer.domElement.height;
        var tempCanvasContext = tempCanvas.getContext ('2d');

        var clearColor = renderer.getClearColor ().getHex ();
        var clearAlpha = renderer.getClearAlpha ();

        if (techPack) {

            renderer.setClearColor (0xff0000, 1);

            // change materials for certain objects
            boundingBox = new THREE.Box3 ();
            boundingBox.makeEmpty = function () { return this; }

            scene.traverse (function (object) {
                if (object.material) {
                    materials[object.id] = object.material;
                    if (object.techPackMaterial) {
                        // set black and white shader
                        object.material = object.techPackMaterial;
                    }
                    else {
                        // turn off everything else
                        object.material = invisible;
                    }
                }

                if (object.name.indexOf ('cloth') == 0) {
                    // boundingBox has its makeEmpty method disabled,
                    // so setFromObject actually expands it
                    boundingBox.setFromObject (object);
                }
            });
        }

        var matrixH = holder.matrix.clone ();
        var matrixC = camera.matrix.clone ();

        holder.matrix.identity ();
        holder.matrix.decompose (holder.position, holder.quaternion, holder.scale);

        camera.matrix.identity ();
        camera.matrix.decompose (camera.position, camera.quaternion, camera.scale);

        var results = [], ratio = 1, screenVector = new THREE.Vector3 ();

        for (i = 0; i < viewParams.length; i++) {
            camera.position.copy ({ x: viewParams[i][0], y: viewParams[i][1], z: viewParams[i][2] });
            camera.rotation.y = viewParams[i][3];

            if (techPack && (i == 0)) {
                // try to auto-fit front view
                ratio = Math.max (
                    // hoizontally
                     (new THREE.Vector3 (boundingBox.max.x, 0.5 * (boundingBox.max.y + boundingBox.min.y), boundingBox.max.z)).project (camera).x,
                    -(new THREE.Vector3 (boundingBox.min.x, 0.5 * (boundingBox.max.y + boundingBox.min.y), boundingBox.max.z)).project (camera).x,
                    // vertically
                     (new THREE.Vector3 (0.5 * (boundingBox.max.x + boundingBox.min.x), boundingBox.max.y, boundingBox.max.z)).project (camera).y,
                    -(new THREE.Vector3 (0.5 * (boundingBox.max.x + boundingBox.min.x), boundingBox.min.y, boundingBox.max.z)).project (camera).y
                );

                // this method is approximate, we need some safety padding
                ratio = Math.max (0.66, Math.min (1, ratio + 0.03));

                /*
                var bbox = new THREE.BoundingBoxHelper(null, 0xff00);
                boundingBox.size(bbox.scale); boundingBox.center(bbox.position);
                scene.add( bbox );
                */
            }

            camera.position.multiplyScalar (ratio);

            renderSingleFrame ();

            tempCanvasContext.drawImage (renderer.domElement, 0, 0, tempCanvas.width, tempCanvas.height);

            if (techPack) {
                var pixels = tempCanvasContext.getImageData (0, 0, tempCanvas.width, tempCanvas.height);
                for (var y = 0; y < pixels.height; y++)
                for (var x = 0; x < pixels.width;  x++) {
                    var ptr = ( y * pixels.width + x ) * 4;
                    if ((x == 0) || (y == 0) || (x == pixels.width - 1) || (y == pixels.width - 1)) {
                        // make the perimeter white
                        pixels.data[ptr] = 255; pixels.data[ptr + 1] = 255; pixels.data[ptr + 2] = 255;
                    } else {
                        // we have pixels of three kinds
                        // 1 all red
                        // 2 some red some b&w
                        // 3 all b&w
                        // in case 1 we must put white pixel
                        // in case 2 we must put black pixel
                        var red00 = (pixels.data[ptr]     > pixels.data[ptr + 1] + 5);
                        var red10 = (pixels.data[ptr + 4] > pixels.data[ptr + 5] + 5);
                        var red01 = (pixels.data[ptr + pixels.width * 4] > pixels.data[ptr + pixels.width * 4 + 1] + 5);
                        if (red00 && red01 && red10) {
                            // case 1
                            pixels.data[ptr] = 255; pixels.data[ptr + 1] = 255; pixels.data[ptr + 2] = 255;
                        } else if (! (red00 || red01 || red10)) {
                            // case 3
                        } else {
                            // case 2
                            pixels.data[ptr] = 0; pixels.data[ptr + 1] = 0; pixels.data[ptr + 2] = 0;

                            // 2px outline
                            ptr -= 4;
                            pixels.data[ptr] = 0; pixels.data[ptr + 1] = 0; pixels.data[ptr + 2] = 0;
                            ptr -= 4 * pixels.width;
                            pixels.data[ptr] = 0; pixels.data[ptr + 1] = 0; pixels.data[ptr + 2] = 0;
                        }
                    }
                }
                tempCanvasContext.putImageData (pixels, 0, 0);

                if (techPackMeasurements) {
                    tempCanvasContext.lineWidth = 2;
                    tempCanvasContext.strokeStyle = '#ff0000';

                    for (var m in techPackMeasurements) {
                        // F, N  Эти метрики нужно выводить толко на виде сзади.
                        if ((i != 2) && ((m == 'F') || (m == 'N'))) continue;

                        // сзади только эти метрики?
                        if ((i == 2) && ((m != 'F') && (m != 'N'))) continue;

                        var v, measure = techPackMeasurements[m], projectedVetices = [];
                        for (v = 0; v < measure.vertices.length; v++) {
                            screenVector.copy (measure.vertices[v]);

                            // Или можно все линии тогда рисовать в одной плоскости.
                            // Например в плоскости Y X  тогда в тех точках что я передаю
                            // можешь просто не учитывать Z координат. 
                            screenVector.z = 0;

                            screenVector.project (camera);
                            //tempCanvasContext [(v == 0) ? 'moveTo' : 'lineTo'] (
                            projectedVetices.push ({
                                x: Math.round((screenVector.x + 1) * settings.width / 2),
                                y: Math.round((1 - screenVector.y) * settings.height / 2)
                            });
                        }

                        if (projectedVetices.length > 3) {
                            if (m == 'H') {
                                // bct_measure_across_armhole_straigth - вертикальная плоскость.
                                projectedVetices.sort (function (a, b) {
                                    if (a.y > b.y) return +1;
                                    if (a.y < b.y) return -1;
                                    return 0;
                                });
                            } else {
                                // bct_measure_across_chest - горизонтальная плоскость.
                                // bct_measure_across_underchest - горизонтальная плоскость.
                                // bct_measure_across_waist - горизонтальная плоскость.
                                projectedVetices.sort (function (a, b) {
                                    if (a.x > b.x) return +1;
                                    if (a.x < b.x) return -1;
                                    return 0;
                                });
                            }
                            projectedVetices.splice (1, projectedVetices.length - 2);
                        }

                        // Не рисовать линии на рисунке текпака, если она менее 15 пикселей
                        if ((new THREE.Vector2 (
                            projectedVetices[1].x - projectedVetices[0].x,
                            projectedVetices[1].y - projectedVetices[0].y
                        )).length () < 15) {
                            console.log('Skipping metric ' + m + ' (less than 15 pixels) in view ' + i);
                            continue;
                        }

                        tempCanvasContext.beginPath ();

                        for (v = 0; v < projectedVetices.length; v++) {
                            tempCanvasContext [(v == 0) ? 'moveTo' : 'lineTo'] (
                                projectedVetices[v].x, projectedVetices[v].y
                            );
                        }

                        // left arrow
                        screenVector.set (
                            projectedVetices[1].x - projectedVetices[0].x,
                            projectedVetices[1].y - projectedVetices[0].y,
                        0).normalize ().multiplyScalar (6);

                        tempCanvasContext.moveTo (
                            projectedVetices[0].x + screenVector.x - 0.5 * screenVector.y,
                            projectedVetices[0].y + screenVector.y + 0.5 * screenVector.x
                        );
                        tempCanvasContext.lineTo (
                            projectedVetices[0].x,
                            projectedVetices[0].y
                        );
                        tempCanvasContext.lineTo (
                            projectedVetices[0].x + screenVector.x + 0.5 * screenVector.y,
                            projectedVetices[0].y + screenVector.y - 0.5 * screenVector.x
                        );

                        // right arrow
                        screenVector.set (
                            projectedVetices[projectedVetices.length - 2].x - projectedVetices[projectedVetices.length - 1].x,
                            projectedVetices[projectedVetices.length - 2].y - projectedVetices[projectedVetices.length - 1].y,
                        0).normalize ().multiplyScalar (6);

                        tempCanvasContext.moveTo (
                            projectedVetices[projectedVetices.length - 1].x + screenVector.x - 0.5 * screenVector.y,
                            projectedVetices[projectedVetices.length - 1].y + screenVector.y + 0.5 * screenVector.x
                        );
                        tempCanvasContext.lineTo (
                            projectedVetices[projectedVetices.length - 1].x,
                            projectedVetices[projectedVetices.length - 1].y
                        );
                        tempCanvasContext.lineTo (
                            projectedVetices[projectedVetices.length - 1].x + screenVector.x + 0.5 * screenVector.y,
                            projectedVetices[projectedVetices.length - 1].y + screenVector.y - 0.5 * screenVector.x
                        );

                        tempCanvasContext.stroke ();

                        // letter
                        tempCanvasContext.font = '14px Ariel bold';
                        tempCanvasContext.fillStyle = '#ff0000';
                        tempCanvasContext.fillText (m,
                            projectedVetices[projectedVetices.length - 1].x + 5,
                            projectedVetices[projectedVetices.length - 1].y + 5
                        );
                    }
                }
            }

            var result = {
                position: i + 1,
                image: tempCanvas.toDataURL ('image/' + (techPack ? 'png' : 'jpeg'), 0.5),
                points: []
            };

            for (var j = 0; j < pointsList.length; j++) {
                initPointPosition (pointsList[j]);

                screenVector.set (pointsList[j].pos[0], pointsList[j].pos[1], pointsList[j].pos[2]);

                if (isPointVisible (screenVector)) {
                    screenVector.project (camera);

                    var point = {
                        point_num: pointsList[j].index,
                        x: Math.round((screenVector.x + 1) * settings.width / 2),
                        y: Math.round((1 - screenVector.y) * settings.height / 2)
                    };

                    result.points.push (point);
                }
            }

            results.push (result);
        }

        // restore camera parameters
        holder.matrix.copy (matrixH);
        holder.matrix.decompose (holder.position, holder.quaternion, holder.scale);

        camera.matrix.copy (matrixC);
        camera.matrix.decompose (camera.position, camera.quaternion, camera.scale);

        // restore materials
        for (var id in materials) {
            var object = scene.getObjectById (parseInt (id));
            if (object) {
                object.material = materials[id];
            }
        }

        renderer.setClearColor (clearColor, clearAlpha);


        if (techPack) {
            var measurements = {};
            if (techPackMeasurements) {
                for (var m in techPackMeasurements) {
                    measurements[ techPackMeasurements[m].key ] = techPackMeasurements[m].length
                }
            }

            return {
                images: results, measurements: measurements
            };
        }

        return results;
    };


    var edgesCallback = null;

    this.setClickEdgeCallback = function (callback) {
        // (edgeName)
        edgesCallback = callback;
    };

    var highlightEdgeWithoutSelection = function (edge, show) {
        edge.material.uniforms.color.value.setHex (show ? 0x6C6CEB : 0xEB6C6C);
    };


    this.highlightEdge = function (edgeName, show) {
        var edge = scene.getObjectByName (edgeName);
        if (edge) {
            edge.selected = show;
            highlightEdgeWithoutSelection (edge, show);
        }
    };


    this.edgesHighlightMode = function (enabled) {

        scene.traverse (function (object) {

            if (object.name.indexOf ('edges') == 0) {
                object.visible = false;
            }

        });

        controls.onclick = null; controls.onmove = null;

        scene.traverse (function (object) {

            if (object.material && (object.name.indexOf ('cloth') == 0)) {

                // opacity off

                if (object.material.uniforms && object.material.uniforms.opacity) object.material.uniforms.opacity.value = 1; else object.material.opacity = 1;

            }
        })

        if (enabled) {

            turnSpecialModesOff ();

            scene.traverse (function (object) {

                if (object.name.indexOf ('edges') == 0) {
                    // TURN off/on pink lines
                    object.visible = false;
                }

                if (object.geometry && object.material && (object.name.indexOf ('cloth') == 0)) {
                        
                        // opacity on

                        if (object.material.uniforms) object.material.uniforms.opacity.value = 0.3; else {
                            object.material.opacity = 0.3;
                            object.material.transparent = true;
                        }

                }

            });

            var handler = function (click) {

                return function (x, y) {

                    scene.traverse (function (object) {
                        if (object.name.indexOf ('edges') == 0) {
                            highlightEdgeWithoutSelection (object, object.selected);
                        }
                    });

                    var point = findIntersection (x, y, 'edges');
                    if (point) {

                        renderer.domElement.style.cursor = 'pointer';

                        highlightEdgeWithoutSelection (scene.getObjectByName (point.meshName), true);

                        if (click) {

                            scene.traverse (function (object) {
                                if (object.name.indexOf ('edges') == 0) {
                                    object.selected = (object.name == point.meshName);

                                    // again
                                    highlightEdgeWithoutSelection (object, object.selected);
                                }
                            });

                            if (edgesCallback) {
                                edgesCallback (point.meshName);
                            }

                        }

                    } else {

                        renderer.domElement.style.cursor = '';

                    }

                };

            }

            controls.onclick = handler (true);
            controls.onmove = handler (false);

        }

    };

    this.showCurtains = function(){
        toggleCurtains(true, function(){});
    };

    this.hideCurtains = function(){
        toggleCurtains(false, function(){});
    };

    for (var prop in this) {
        if (this[prop] instanceof Function) {
            this[prop] = this[prop].bind (this);
        }
    }

    return this;
}