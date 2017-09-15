$(document).ready(function () {

    window.plugin = new Plugin3d($('#plugin-3d'),
        {
            'transparent': false,
            'host': 'http://plugin-web.globedrobe.com/api',
            'clearColor': 0xffffff,
            'showAddToHomeScreenBlock': false,
            'VRLoader': '../images/loading.png',
            'showGallery': true,
            'VRRotationOptions': {
                rightAngle: {
                    min: -0.75, //минимальный правый угол (radians)
                    max: -0.10  //максимальный правый угол (radians)
                },
                leftAngle: {
                    min: 0.10,  //минимальный левый угол (radians)
                    max: 0.75   //максимальный левый угол (radians)
                },
                rotationTimeout: 800,  //задержка перед вращением (mc)
                rotationMaxSpeed: 0.08, //максимальная скорость (radians)
                rotationAcceleration: 0.0007 //ускорение  (radians)
            },
            //'host': ''
            'images': '../images/',
            'catalogApiEndpoint': GLOBAL_SETTINGS.catalogApiEndpoint
        }
    );

    var onResize = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        $('#controls').hide();
        $('#plugin-3d').css({ 'width': w + 'px' });
        plugin.resize(w, h);
    };

    onResize();
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

    plugin.loadScene(12, function (e) {

        plugin.loadDummy(GLOBAL_SETTINGS.avatarId, function () {
            plugin.hideLoadingPlane(); 
        }, true);

    }, true);

    plugin.container.addEventListener('onVRButtonClick', function (e) {

        if (e.detail.buttonName == 'galleryItem') {

            var data = {
                cloth_body_type: e.detail.currentClothBodyType,
                ident: e.detail.currentProductId
            };

            console.log('Loading size: %j', data);

            var products = ProductLoader.getProductsToLoad(data);

            // use only one already loaded avatar
            plugin.loadProducts(products, function () {
                plugin.hideLoadingPlane();
                plugin.showStaticButtons();
            }, 1, true);

        }

    }, false);



});
