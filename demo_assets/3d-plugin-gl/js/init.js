$(document).ready(function() {

    window.plugin = new Plugin3d($('#plugin-3d'),
        {
            'transparent': true,
            //'host' : 'http://dev.globedrobe.com'
            'host' : 'http://plugin-web.globedrobe.com/api'
            //'host': ''
            //,'images': '/images/'
        }
    );

    var onResize = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        $('#controls').hide();
        $('#plugin-3d').css({ 'width': w + 'px' });
        plugin.resize (w, h);
    };

    window.addEventListener ('resize', onResize);

    plugin.setAddPointCallback (function (pointNum, meshIndex, x, y, z) {
        console.log ('plugin.setPointsList([' + JSON.stringify ({ index: pointNum, meshIndex: meshIndex, pos: [0,0,0]}) + ']);plugin.highlightPoint(' + pointNum + ',true);');
    });

    plugin.setClickEdgeCallback (function (edgeName) {
        console.log ('You clicked edge: ' + edgeName);
    });

    plugin.loadScene (4, function () {
        $('#b_load').toggleClass('hidden').click(function () {
            $('#b_load').toggleClass('hidden')

            var avatar = $('#s_avatar').val();
            var product = $('#s_product').val();

            $.when (
                $.Deferred (function (deferred) {
                    plugin.loadDummy(avatar, function () {
                        deferred.resolve ();
                    });
                }),
                $.Deferred (function (deferred) {
                    plugin.loadProducts(product, function () {
                        deferred.resolve ();
                    }, 1);
                })
            ).then (function () {
                $('#b_load').toggleClass('hidden');
            });
        });

        $('#c_stretch').click(function () {
            plugin.stretchMode (this.checked);
        });

        $('#c_planes').click(function () {
            plugin.planeMode (this.checked);
        });

        $('#c_points').click(function () {
            plugin.pointMode (this.checked);
        });

        $('#c_measure').click(function () {
            plugin.measureMode (this.checked);
        });

        $('#c_edges').click(function () {
            plugin.edgesHighlightMode (this.checked);
        });
    });

});
