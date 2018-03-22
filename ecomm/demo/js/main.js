// tabs
$('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
});

// sprites
$(function () {
    var $sprite = $("#sprite");

    function calcSize() {
        var width = $('.main-image-large').width();
        var height = width * 640 / 360;

        console.log('%s - %s', width, height);

        return {w: width, h: height};
    }

    function initSprite(key) {
        console.log('init sprinte with key - ' + key);

        var sizes = calcSize();
        $sprite.spritespin({
            // path to the source images.
            source: key,
            width: sizes.w,  // width in pixels of the window/frame
            height: sizes.h,  // height in pixels of the window/frame
        });
    }

    function resizeSprite() {
        var sizes = calcSize();
        $sprite.width(sizes.w);
        $sprite.height(sizes.h);
    }

    initSprite(window.SOURCES['source1']);
    resizeSprite();

    $(window).on('resize', resizeSprite);

    $('a[role=look-trg]').on('click', function(e) {
        e.preventDefault();
        var key = 'source' + $(this).data('id');
        initSprite(window.SOURCES[key]);
    });
});


//fotorama
$(function () {
    // 1. Initialize fotorama manually.
    var $fotoramaDiv = $('#fotorama').fotorama();

    // 2. Get the API object.
    var fotorama = $fotoramaDiv.data('fotorama');

    // 3. Inspect it in console.
    $('.fotorama')
    // Listen to the events
        .on(
            'fotorama:show',
            function (e, fotorama, extra) {
                $('.fotorama-text').hide();
                var i = fotorama.activeFrame.i;
                $('.fotorama-text-' + i).show();
            }
        )
});

//contact us form
$(function () {
    // this is default options
    $('#contact-us-form').ptmForm(
        {
            'handler': '../../php/handler.php',
            'onSuccess': function () {
                $('#contact-us-form').find('.form-result').removeClass('alert-danger').addClass('alert alert-success');
            },
            'onError': function () {
                $('#contact-us-form').find('.form-result').removeClass('alert-success').addClass('alert alert-danger');
            },
            'beforeSubmit': function () {
                $('#contact-us-form').find('.form-result').removeClass('alert-success').removeClass('alert-danger');
            }

        }
    )
});