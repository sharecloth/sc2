var EcommCustomModule = (function(){

    var $triggers;
    var $ecommPlaceholder, $apply;

    var $printTab, $colorTab, $fabricTab;

    var plugin;

    function _init() {
        $triggers = $('.ecomm-trigger');

        $printTab = $('#print');
        $colorTab = $('#color');
        $fabricTab = $('#fabric');

        $apply = $('.ecomm-custom-apply');

        $triggers.on('click', function(e) {
            e.preventDefault();
            
            var $allIntab = $(this).parent().parent().find('.ecomm-trigger');

            $allIntab.removeClass('active');
            $(this).addClass('active');
        });

        $apply.on('click', function(e) {
            e.preventDefault();

            var form = $('form');

            ensureTextureSelected($printTab);
            ensureTextureSelected($colorTab);
            ensureTextureSelected($fabricTab);

            form.find('input[name=print]').val( $printTab.find('a.active').data('name'));
            form.find('input[name=color]').val( $colorTab.find('a.active').data('name'));
            form.find('input[name=fabric]').val( $fabricTab.find('a.active').data('name'));

            var data = form.serialize();

            plugin.loadProducts({
                mesh: '/ecomm/custom/api_data/mesh.zip',
                texture: '/ecomm/custom/api.php?' + data
            }, function() {
                plugin.hideCurtains();
                console.log('done!');
            });
        });

        $ecommPlaceholder = $('.ecomm-custom-plugin-placeholder');
        plugin = new Plugin3d($ecommPlaceholder,
            {
                'images': '/demo_assets/3d-plugin-gl/images/'
            }
        );
        plugin.resize ($ecommPlaceholder.width(), $ecommPlaceholder.height());

        plugin.loadScene({
            url: '/ecomm/custom/api_data/scene.zip'
        }, function() {
            console.log('load scene complete');
        });

        plugin.showCurtains();
        plugin.loadDummy({
            avatar: '/ecomm/custom/api_data/avatar.zip',
            texture: '/ecomm/custom/api_data/avatar_texture.zip',
            params: '/ecomm/custom/api_data/avatar_params.json'
        }, function() {
            console.log('init plugin with avatar complete');
            $apply.trigger('click');
        });

        // plugin.loadProducts({
        //     mesh: '/ecomm/custom/api_data/mesh.zip',
        //     texture: '/ecomm/custom/api_data/mesh_textures.zip'
        // }, function() {
        //     console.log('done!');
        // })
    }

    function ensureTextureSelected($tab) {
        if ( $tab.find('a.active').size() == 0) {
            $tab.find('a').eq(0).addClass('active');
        }
    }

    return {
        init: _init
    }
})();


$(function() {
    EcommCustomModule.init();
});
