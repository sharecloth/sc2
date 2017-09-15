$(document).ready(function () {

    window.plugin = new Plugin3d($('#plugin-3d'),
            {
                'transparent': false,
                //'answer': 'web_sockets',
                'answer': 'rabbit_mq',
                'onAnswerReceive': function(data) {
                    console.log(data);
                },

                'host' : 'http://dev.plugin-web.globedrobe.com/api',
                //'host': 'http://plugin-admin-local.local:20000/api',

                'clearColor': 0xffffff,
            //'host': ''
            //,'images': '/images/'
            'setLightsUp'
    :
    function (scene) {
        // например, обычный белый свет
        var light = new THREE.DirectionalLight(0xeff5fb, 0.65);
        light.position.set(0, 1, 0.2);
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

    plugin.loadScene(4, function () {
        $('#b_load').toggleClass('hidden').click(function () {
            $('#b_load').toggleClass('hidden')

            var avatar = $('#s_avatar').val();
            var product = $('#s_product').val();

            $.when(
                    $.Deferred(function (deferred) {
                        plugin.loadDummy(avatar, function () {
                            deferred.resolve();
                        });
                    })
                    ,
                    $.Deferred (function (deferred) {
                        plugin.loadProducts([
                            {
                                "product": product,
                                "texture": "http://google.com/test.zip",
                            }
                        ], function () {
                            deferred.resolve ();
                        }, 1);
                    })
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

});
