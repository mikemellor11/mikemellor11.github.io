(function(){
    "use strict";

    wave.windowObject = window.location.search;

    if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream){
        $('html').addClass('iPhone');
        $($('.my_video_1')[0]).remove();
    } else {
        $('html').addClass('no-iPhone');
        $($('.my_video_1')[1]).remove();
    }

    FastClick.attach(document.body);

    $("a[rel*=leanModal]").leanModal({closeButton: ".modal_close"});

    $(".lazyOwl__aspectCalc").on('load', function() {
        var slideWidth = $(this).outerWidth(true);
        var slideHeight = $(this).outerHeight(true);
        var aspectRatio = (slideHeight / slideWidth) * 100;
        $(this).show();
        $('.owl-item > div').css('padding-bottom', aspectRatio + '%');
        $('.lazyOwl__aspectCalc--static').removeClass('lazyOwl__aspectCalc--static');
    });

    $(".owl-carousel").owlCarousel({
        items : 6,
        itemsDesktop : [1024, 5],
        itemsDesktopSmall : false,
        itemsTablet : [750, 3],
        itemsTabletSmall : false,
        itemsMobile : [500, 2],
        lazyLoad : true,
        navigation : true,
        pagination: false,
        startDragging: function(){
            wave.dragging = true;
            if(wave.timeoutHandle !== null){
                window.clearTimeout(wave.timeoutHandle);
            }
        },
        afterAction: function(){
            if(wave.dragging || wave.owlButton){
                wave.timeoutHandle = window.setTimeout(function(){
                    wave.dragging = false;
                    wave.owlButton = false;
                }, 2000);
            }
        },
        afterInit: function(){
            $($('.owl-item')[wave.currentSlide]).addClass('activeSlide');
        },
        navigationText: ["<div class=\"icon-__left-sml-color3\"></div>", "<div class=\"icon-__right-sml-color3\"></div>"]
    });

    if($('.owl-carousel').length){
        wave.owl = $(".owl-carousel").data('owlCarousel');
    }

    if($('.my_video_1').length){
        wave.rootPlayer = MediaElementPlayer('.my_video_1',{
            plugins: ['flash', 'silverlight'],
            toggleCaptionsButtonWhenOnlyOne: true,
            startVolume: wave.startVolume,
            success: function(mediaElement, domObject) {
                if(mejs.MediaFeatures.isAndroid || mejs.MediaFeatures.isiOS){
                    wave.device = true;
                    $('.wave__currentScrub').removeClass('currentScrub--hover');
                }

                wave.init(mediaElement);
            },
            error: function() {
                alert('Error setting media!');
            }
        });
    }
})();