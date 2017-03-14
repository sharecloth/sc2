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
  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.scrollToTop(), this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      return $(this.oldContainer).animate({
        opacity: 0,
        top: "-100px"
       }).promise();
    },

    scrollToTop: function() {
      return $("body").animate({scrollTop: 0}).promise();
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : 0,
        top: "-100px",
      });

      $el.animate({ opacity: 1, top: 0 }, 400, function() {
        _this.done();
      });
    }
  });

  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  var protocol = window.location.protocol;

  if(protocol == "http:" || protocol == "https:") {
    Barba.Prefetch.init();
    Barba.Pjax.start();
    Barba.Dispatcher.on("transitionCompleted", function() {
      $.StartKit.init();
    })
  } else {
    console.log("Please serve this page from a web server to see AJAX page transitions")
  }


});


$(function() {
  $('#subscribe').smoothScroll({speed: 800});
  $('#features-link').smoothScroll({speed: 800});

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
  var $head = $('#headline-cover');
  $head.height(window.innerHeight - 200);

  $('.player').YTPlayer();
});
