$(document).ready(function () {

    window.plugin = new Plugin3d($('#plugin-3d'),
            {
                'transparent': false,
                //'host' : 'http://dev.globedrobe.com'
                //'host': 'http://dev.plugin-web.globedrobe.com/api',
                'host': 'http://plugin-web.globedrobe.com/api',
                'clearColor': 0xffffff,
                'showAddToHomeScreenBlock': true,
                'VRLoader': 'images/loading.png',
                'showGallery': false,
                'VRRotationOptions': {
                    rightAngle: {
                        min: -0.75, //минимальный правый угол (radians)
                        max: -0.25  //максимальный правый угол (radians)
                    },
                    leftAngle: {
                        min: 0.25,  //минимальный левый угол (radians)
                        max: 0.75   //максимальный левый угол (radians)
                    },
                    rotationTimeout: 1000,  //задержка перед вращением (mc)
                    rotationMaxSpeed: 0.05, //максимальная скорость (radians)
                    rotationAcceleration: 0.0005 //ускорение  (radians)
                },
            //'host': ''
          //  'images': '/images/',
            'setLightsUp'
    :
    function (scene) {
        // например, обычный белый свет
        var light = new THREE.DirectionalLight(0xeff5fb, 0.2);
        light.position.set(0, 1, 0.2).normalize();
        scene.add(light);


        // отбросить тень
        light.castShadow = true;

        // настройки тени (опционально)
        light.shadow.camera.left = -1.5;
        light.shadow.camera.right = 1.5;
        light.shadow.camera.top = 1.5;
        light.shadow.camera.bottom = -1.5;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 10;
        light.shadow.mapSize.width = 512 * 4;
        light.shadow.mapSize.height = 512 * 4;

        // посмотреть, куда оно светит
        //var helper = new THREE.DirectionalLightHelper (light, 0.1);
        //scene.add (helper);

        // посмотреть, где считается тень
       // helper = new THREE.CameraHelper (light.shadow.camera);
       // scene.add (helper);

        //Create a PointLight and turn on shadows for the light
        var light2 = new THREE.PointLight(0xffffff, 0.7);
        light2.position.set(0, 1, 1);
        light2.castShadow = false;            // default false
        scene.add(light2);

    }
}
    )
    ;

    var onResize = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        $('#controls').hide();
        $('#plugin-3d').css({'width': w + 'px'});
        plugin.resize(w, h);
    };

    window.addEventListener('resize', onResize);

    plugin.setAddPointCallback(function (pointNum, meshIndex, x, y, z) {
        console.log('plugin.setPointsList([' + JSON.stringify({
                    index: pointNum,
                    meshIndex: meshIndex,
                    pos: [0, 0, 0]
                }) + ']);plugin.highlightPoint(' + pointNum + ',true);');
    });

    plugin.setClickEdgeCallback(function (edgeName) {
        console.log('You clicked edge: ' + edgeName);
    });

    var lastAvatar = null
    plugin.loadScene(11, function () {
        $('#b_load').toggleClass('hidden').click(function () {
            $('#b_load').toggleClass('hidden')

            var avatar = $('#s_avatar').val();
            var product = $('#s_product').val();

            $.when(
                    $.Deferred(function (deferred) {
                    if (lastAvatar != avatar) {
                        plugin.loadDummy(avatar, function () {
                            lastAvatar = avatar;                           
                            plugin.loadProducts(product, function () {
                                deferred.resolve();
                                plugin.hideLoadingPlane();
                            }, 1, true);
                        });
                    } else {
                        plugin.loadProducts(product, function () {
                            deferred.resolve();
                            plugin.hideLoadingPlane();
                        }, 1);
                    }
                    })
                    // ,
                    // $.Deferred (function (deferred) {
                    //     plugin.loadProducts(product, function () {
                    //         deferred.resolve ();
                    //     }, 1);
                    // })
            ).then(function () {
                $('#b_load').toggleClass('hidden');
            });
        });

        $('#c_stretch').click(function () {
            plugin.stretchMode(this.checked);
        });

        $('#c_planes').click(function () {
            plugin.planeMode(this.checked);
        });

        $('#c_points').click(function () {
            plugin.pointMode(this.checked);
        });

        $('#c_measure').click(function () {
            plugin.measureMode(this.checked);
        });

        $('#c_edges').click(function () {
            plugin.edgesHighlightMode(this.checked);
        });
    });

    plugin.container.addEventListener('onVRButtonClick', function (e) {

        if (e.detail.buttonName == 'right') {
            plugin.loadProducts('c-251', function () {
                plugin.hideLoadingPlane();
            }, 1);
        } else if(e.detail.buttonName == 'left'){
            plugin.loadProducts('c-251', function () {
                plugin.hideLoadingPlane();
            }, 1);
        } 

        //  alert(e.detail.buttonName);
        //  alert(e.detail.currentAvatarId);
        //  alert(e.detail.currentProductId);

    }, false);

    //plugin.goVR();
    //plugin.exitVR();
    //isMobile();

});