if (typeof jQuery === "undefined") {
  throw new Error("StartKit requires jQuery");
}

$.StartKit = {}

$(function() {
  $.StartKit.activateTooltips = function() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  $.StartKit.activateSliders = function() {
    if($("#logo-slider").length) {
      $('#logo-slider').slick({
        dots: true,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 3,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }

    // Related projects
    if($("#related-projects-slider").length) {
      $('#related-projects-slider').slick({
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }

    // Team slider
    if($("#team-slider").length) {
      $('#team-slider').slick({
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [

          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }


    // Office images
    if($("#office-slider").length) {
      $('#office-slider').slick({
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
      });
    }
  }

  $.StartKit.activateCounter = function() {
    if($(".animated-counters").length) {
      var employee = new CountUp("chemicals-count", 0, 25);
      employee.start();

      var product = new CountUp("dioxide-count", 0, 10);
      product.start();

      var experience = new CountUp("pesticides-count", 0, 11);
      experience.start();

      var customer = new CountUp("trees-count", 69990000, 70000000);
      customer.start();
    }
  }

  $.StartKit.activateGallery = function() {
    var $container = $("#gallery-container");

    $container
    .on('click', '[data-toggle="lightbox"]', function(event) {
      event.preventDefault();
      $(this).ekkoLightbox();
    });
  }

  $.StartKit.activateFiltering = function() {
    if($("#filterable-list").length) {
      var $container = $('#filterable-list');
      $container.isotope({
        filter: '*',
        animationOptions: {
          duration: 750,
          easing: 'linear',
          queue: false
        }
      });

      $('#filterable-nav a').click(function(){
        $('#filterable-nav .active').removeClass('active');
        $(this).addClass('active');

        var selector = $(this).attr('data-filter');
        $container.isotope({
          filter: selector,
          animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
          }
        });
        return false;
      });
    }
  }

  $.StartKit.activateScrollAnimations = function() {
    AOS.init();
  }

  // INIT
  $.StartKit.init = function() {
    $.StartKit.activateGallery();
    $.StartKit.activateFiltering();
    $.StartKit.activateTooltips();
    $.StartKit.activateSliders();
    $.StartKit.activateCounter();
    $.StartKit.activateScrollAnimations();
  }


  $.StartKit.init();
})




$(function() {
  if ( $('#subscribe').size() > 0) {
    $('#subscribe').smoothScroll({speed: 800});
  }
  if ($('#features-link').size() > 0) {
    $('#features-link').smoothScroll({speed: 800});
  }

  $('.subscribe-form').submit(function(e) {
    e.preventDefault();
    var postdata = $('.subscribe-form').serialize();
    $.ajax({
      type: 'POST',
      url: 'php/subscribe.php',
      data: postdata,
      dataType: 'json',
      success: function(json) {
        if(json.valid == 0) {
          $('.success-message').hide();
          $('.error-message').html(json.message).show();
        }
        else {
          $('.error-message').hide();
          $('.success-message').hide();
          $('.subscribe-form').hide();
          $('.success-message').html(json.message).show();
        }
      }
    });
  });

});


$(function() {
  var height = window.innerHeight;
  console.log(height);
  var $head = $('#headline-cover');

  if ($head.find('a.player')[0]) {
    $head.css('height', window.innerHeight + 'px');
    $('.player').YTPlayer();
  }

});



$(function() {

  var $form = $('.white-paper-form');
  var $success = $form.find('.success');
  var $error = $form.find('.error');

  $form.on('submit', function(e) {
    e.preventDefault();

    $form.find('button').button('loading');
    $.ajax({
      method: 'POST',
      url: 'php/register.php',
      dataType: 'json',
      data: $(this).serialize(),
      success: function(r) {
        if (r.valid) {
          $error.hide();
          $success.show().find('.alert').text(r.message);
          ga('send', 'event', 'leadform', 'submition', 'sucess');
        } else {
          $error.show().find('.alert').text(r.message);
          $success.hide();
        }
        $form.find('button').button('reset');
        console.log(r);
      }
    });
  });

});


$(function() {
  // this is default options
  $('#contact-us-form').ptmForm(
      {
        'handler': 'php/handler.php',
        'onSuccess' : function() {
          $('#contact-us-form').find('.form-result').removeClass('alert-danger').addClass('alert alert-success');
        },
        'onError' : function() {
          $('#contact-us-form').find('.form-result').removeClass('alert-success').addClass('alert alert-danger');
        },
        'beforeSubmit': function() {
          $('#contact-us-form').find('.form-result').removeClass('alert-success').removeClass('alert-danger');
        }

      }
  )
});