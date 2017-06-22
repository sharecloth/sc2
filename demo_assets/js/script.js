$(function() {

    var email, password;

    var $getTokenButton = $('#get-token-button');
    var $email = $('input[name=email]');
    var $password = $('input[name=password]');
    var $lists = $('#lists');
    var $getAvatarList =$('#get-avatar-list');
    var $getClothList = $('#get-cloth-list');
    var $avatarPreview = $('#avatar-preview');

    var $selectedAvatarId = $('#selectedAvatarId');
    var $selectedClothId = $('#selectedClothId');

    var $showEbmedButton = $('#show-embed-button');
    var $embedWrapper = $('.sharecloth-embed-wrapper');


    function initPage()
    {
        email = $email.val();
        password = $password.val();

        $('.login-error').addClass('hidden');
    }


    $getTokenButton.on('click', function(e) {
        e.preventDefault();

        initPage();

        $getTokenButton.button('loading');

        $.ajax({
            'url' : 'api.php?method=login',
            'method': 'POST',
            'dataType': 'json',
            'data' : {
                "email": email,
                "password" : password
            },
            'success' : function(r) {
                $getTokenButton.button('reset');
                if (r.result) {
                    $('.login-result').removeClass('hidden');
                    $('.login-result strong').text(r.apiSecret);

                    $lists.removeClass('hidden');
                    $avatarPreview.removeClass('hidden');
                } else {
                    $('.login-error').removeClass('hidden');
                }

            }
        })
    });


    $getAvatarList.on('click', function(e) {
        e.preventDefault();
        $getAvatarList.button('loading');
        $.ajax({
            'url': 'api.php?method=avatarList',
            'method' : 'POST',
            'dataType': 'json',
            'data': {
                "email": email,
                "password" : password
            },
            'success': function(r) {
                $getAvatarList.button('reset');
                if (r.result) {
                    $('.avatar-table-wrapper').html(r.html);
                }
            }
        });
    });

    $getClothList.on('click', function(e) {
        e.preventDefault();
        $getClothList.button('loading');
        $.ajax({
            'url': 'api.php?method=itemList',
            'method' : 'POST',
            'dataType': 'json',
            'data': {
                "email": email,
                "password" : password,
                "list" : "with_gdcb"
            },
            'success': function(r) {
                $getClothList.button('reset');
                if (r.result) {
                    $('.cloth-table-wrapper').html(r.html);
                }
            }
        });
    });


    $lists.on('click', 'tr.selectable', function() {
        var $el = $(this);

        $el.closest('table').find('.selectable').removeClass('info');
        $el.addClass('info');

        var type = $el.data('type');
        if (type == 'avatar') {
            $selectedAvatarId.text($el.data('id'));
        } else {
            $selectedClothId.text($el.data('id'))
        }

        if ($selectedAvatarId.text() != '' && $selectedClothId.text() != '') {
            $showEbmedButton.removeClass('hidden');
        }
    });

    $showEbmedButton.on('click', function(e) {
        e.preventDefault();
        $embedWrapper.html('<iframe width="400" height="700" src="http://app.sharecloth.com/ru/embed/'+$selectedClothId.text()+'/'+$selectedAvatarId.text()+'" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel=""></iframe>')
    });

    //
});