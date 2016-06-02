var wave = (function() {
    "use strict";

    var currentStamp = 0,
        currentTime = null,
        autoplay = true,
        scrubberDown = false,
        volumeScrubberDown = false,
        playing = false,
        lastSeeked = 0,
        currentStatus = false;

     return {
        device: null,
        startVolume: 0.8,
        rootPlayer: null,
        owl: null,
        dragging: false,
        owlButton: false,
        currentSlide: 0,
        timeoutHandle: null,
        windowObject: null,
        updateIcons: function(selector){
            if(!Modernizr.backgroundsize){
                $(selector).toggle().toggle(); // force redraw for IE 8 as backgroundsize polyfill won't redraw icon
            }
        },
        updateLayout: function(size){

            var $layoutHold = $('.wave__layout').children();
            if(size === 'small'){
                $($layoutHold[0]).removeClass('layout__split layout__small layout__big').addClass('layout__small');
                $($layoutHold[1]).removeClass('layout__split layout__small layout__big').addClass('layout__big');
            } else if(size ==='medium'){
                $layoutHold.removeClass('layout__split layout__small layout__big').addClass('layout__split');
            } else {
                $($layoutHold[0]).removeClass('layout__split layout__small layout__big').addClass('layout__big');
                $($layoutHold[1]).removeClass('layout__split layout__small layout__big').addClass('layout__small');
            }
            $(window).trigger('resize'); // mediaelement seems to calculate wrong video size if only called once, keep mutiple calls
            $(window).trigger('resize');
        },

        updateQuality: function(quality, player){
            currentTime = player.currentTime;
            currentStatus = player.paused;
            player.setSrc(quality);
            player.load();
        },

        updateScrubber: function(time, duration){
            $('.wave__progress').width(((time / duration) * 100) + '%');
        },

        updateVolume: function(volume){
            $('.wave__currentVol').width(((volume / 1) * 100) + '%');
        },

        updateScrubberPosition: function(e, player, save){
            var $this = $('.wave__scrubber');
            var pageX;

            if (e.originalEvent.targetTouches !== undefined && e.originalEvent.targetTouches !== null) {
                pageX = e.originalEvent.targetTouches[0].pageX;
            }else {
                pageX = e.pageX;
            }

            var x = pageX - $this.offset().left;
            var duration = player.duration;
            var newTime = player.duration * (x / $this.width());

            if(newTime < 0){
                newTime = 0;
            } else if(newTime > duration){
                newTime = duration;
            }

            lastSeeked = newTime;

            if(save){
                History.pushState({"stamp": parseInt(newTime)}, document.title, "?stamp=" + parseInt(newTime));
            }
            player.setCurrentTime(newTime);
            this.updateScrubber(newTime, player.duration);   
        },

        updateVolumeScrubberPosition: function(e, player){
            player.setMuted(false);
            var $this = $('.wave__volume__scrubber');
            var pageX;

            if (e.originalEvent.targetTouches !== undefined && e.originalEvent.targetTouches !== null) {
                pageX = e.originalEvent.targetTouches[0].pageX;
            }else {
                pageX = e.pageX;
            }
            
            var x = pageX - $this.offset().left;
            var newVolume = 1 * (x / $this.width());

            if(newVolume < 0){
                newVolume = 0;
            } else if(newVolume > 1){
                newVolume = 1;
            }

            player.setVolume(newVolume);
            wave.updateVolume(newVolume);
        },

        updateCurrentScrubberPosition: function(e, player){
            var $this = $('.wave__scrubber');
            var $currentScrub = $('.wave__currentScrub');
            var pageX;

            if (e.originalEvent.targetTouches !== undefined && e.originalEvent.targetTouches !== null) {
                pageX = e.originalEvent.targetTouches[0].pageX;
            }else {
                pageX = e.pageX;
            }
            
            var x = pageX - $this.offset().left;
            var duration = player.duration;
            var newTime = duration * (x / $this.width());

            if(newTime < 0){
                newTime = 0;

            } else if(newTime > duration){
                newTime = duration;
            }

            var percent = ((newTime / duration) * 100);

            if(percent < 0){
                percent = 0;
            } else if(percent > 100){
                percent = 100;
            }

            $currentScrub.css('left', percent + '%');

            if(isNaN(newTime)){
                $currentScrub.text('00:00');
            } else {
                $currentScrub.text(mejs.Utility.secondsToTimeCode(newTime, wave.rootPlayer.options));
            }
        },

        setupInteractionHandlers: function(player){
            $('.wave__play').click(function(){
                /*jshint -W030*/
                (player.paused) ? player.play() : player.pause();
            });

            $('.wave__mute').click(function(){
                /*jshint -W030*/
                (player.muted) ? player.setMuted(false) : player.setMuted(true);
            });

            $('.wave__ratio, .wave__quality, .wave__chapters').click(function(){
                $('.screenBlock').show();

                $('.ut-showing--alt').addClass('ut-hide').removeClass('ut-showing--alt');
                $('.spin180--alt').removeClass('spin180--alt');

                $($(this).children()[1]).toggleClass('ut-hide ut-showing');
                $(this).find('.ut-spinIcon').toggleClass('spin180');
                $(this).find('.ut-safariTransitionFix').toggleClass('ut-safariTransitionFix--opacity');

                wave.updateIcons('.ut-iconSize');
            });

            $('.wave__speakers').click(function(){
                $('.screenBlock').show();

                $('.ut-showing').addClass('ut-hide').removeClass('ut-showing');
                $('.spin180').removeClass('spin180');

                $($(this).children()[1]).toggleClass('ut-hide ut-showing--alt');
                $(this).find('.ut-spinIcon').toggleClass('spin180--alt');
                $(this).find('.ut-safariTransitionFix').toggleClass('ut-safariTransitionFix--opacity');
            });

            $('.screenBlock').click(function(e){
                e.stopPropagation();
                $('.ut-showing, .ut-showing--alt').addClass('ut-hide').removeClass('ut-showing ut-showing--alt');
                $('.spin180').removeClass('spin180');
                $('.ut-safariTransitionFix--opacity').removeClass('ut-safariTransitionFix--opacity');
                $(this).hide();
            });

            $('.wave__ratio li').click(function(e){
                e.stopPropagation();
                wave.updateLayout($(this).data('ratio'));
            });

            $('.wave__quality li').click(function(e){
                e.stopPropagation();
                wave.updateQuality($(this).data('quality'), player);
            });

            $('.wave__speakers li').click(function(e){
                e.stopPropagation();
            });

            $('.wave__stamps .stampButton').click(function(e){
                e.stopPropagation();
                var stamp = $(this).data('stamp');
                if(+currentStamp === +stamp) {
                    player.setCurrentTime(stamp);
                    return;
                }
                lastSeeked = stamp;
                History.pushState({"stamp": stamp}, document.title, "?stamp=" + stamp);
                currentStamp = stamp;
            });

            $('.wave__fullscreen').click(function(){
                wave.rootPlayer.enterFullScreen();
            });

            $('.wave__captions').click(function(){
                if(wave.rootPlayer.selectedTrack !== null){
                    wave.rootPlayer.setTrack('none');
                    return;
                }
                wave.rootPlayer.setTrack('en');
            });

            $('.wave__volume__scrubber').on("mousedown touchstart", function (e) {
                volumeScrubberDown = true;
                wave.updateVolumeScrubberPosition(e, player);
            });

            $('.wave__scrubber').on("mousedown touchstart", function (e) {
                if(wave.device && !playing){player.play();}

                wave.updateScrubberPosition(e, player, false);

                if(wave.device){
                    wave.updateCurrentScrubberPosition(e, player);
                    $('.wave__currentScrub').stop(true, true).show().fadeOut(1000);
                } else {
                    scrubberDown = true;
                    $('.wave__currentScrub').addClass('ut-inlineBlock');
                    $('body').addClass('ut-unselectable');
                }
            });

            $(document).on("mouseup touchend", function (e) {
                if(wave.device){return;}

                if(scrubberDown){
                    wave.updateScrubberPosition(e, player, true);
                    $('.wave__currentScrub').removeClass('ut-inlineBlock');
                    $('body').removeClass('ut-unselectable');
                }
                if(volumeScrubberDown){
                    wave.updateVolumeScrubberPosition(e, player);
                }
                volumeScrubberDown = false;
                scrubberDown = false;
            });

            $(document).on("mousemove touchmove", function (e) {
                if(wave.device){return;}

                if(scrubberDown){
                    wave.updateScrubberPosition(e, player, false);
                }
                if(volumeScrubberDown){
                    wave.updateVolumeScrubberPosition(e, player);
                }

                wave.updateCurrentScrubberPosition(e, player);
            });
        },

        removeLastPart: function(url) {
            if(typeof(url) === 'string'){
                var lastSlashIndex = url.lastIndexOf("/");
                if (lastSlashIndex > url.indexOf("/") + 1) { // if not in http://
                    return url.substr(0, lastSlashIndex); // cut it off
                } else {
                    return url;
                }
            }
            return '';
        },

        findNearestSlide: function(time){
            if(typeof(time) === 'number'){
                for(var i = 0, len = slides.length; i < len; i++){
                    if(time >= +slides[i].time && ((i + 1) === len || time < +slides[i + 1].time)){
                        return i;
                    }
                }
            }
            return 0;
        },

        updateSlideLoop: function(time){
            var nearestSlide = wave.findNearestSlide(time);

            if(wave.currentSlide === nearestSlide){
                return;
            }
            $('.wave__liveSlide').attr("src", wave.removeLastPart($('.wave__liveSlide').attr('src')) + '/' + slides[nearestSlide].slideFileName);
            wave.currentSlide = nearestSlide;
            if(!wave.dragging && !wave.owlButton){
                wave.owl.goTo(wave.currentSlide);
            }
            $('.owl-item').removeClass('activeSlide');
            $($('.owl-item')[wave.currentSlide]).addClass('activeSlide');
            $('.currentSlide').text(wave.currentSlide + 1);
        },

        updateTimings: function(time, duration){
            if(isNaN(time)){
                $($('.wave__currentTime span')[0]).html("00:00 &nbsp;");
            } else {
                $($('.wave__currentTime span')[0]).html(mejs.Utility.secondsToTimeCode(time, wave.rootPlayer.options) + "&nbsp;");
            }
            if(isNaN(duration)){
                $($('.wave__currentTime span')[1]).html("|&nbsp; 00:00");
            } else {
                $($('.wave__currentTime span')[1]).html("|&nbsp;" + mejs.Utility.secondsToTimeCode(duration, wave.rootPlayer.options));
            }
        },

        getQueryVariable: function(variable) {
            var query = wave.windowObject.substring(1);
            var vars = query.split('?');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) === variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
            return 0;
        },

        setupFlags: function(duration){
            $('.flag').each(function(i, d){
                var $d = $(d);
                var percent = ($($d.children()[0]).data('stamp')  / duration) * 100;
                $d.css({'left': percent + "%", 'opacity': 1});
                if(percent > 50){
                    $d.find('.flag__label').css('right', '100%');
                } else{
                    $d.find('.flag__label').css('left', '100%');
                }
            });
        },

        setupEventHandlers: function(player){
            player.addEventListener('canplay', function(e) {
                if(autoplay){
                    var startStamp = +wave.getQueryVariable('stamp');
                    if(startStamp !== undefined && startStamp !== null && !isNaN(startStamp)){
                        player.setCurrentTime(startStamp);
                        lastSeeked = startStamp;
                        History.pushState({"stamp": startStamp}, document.title, "?stamp=" + startStamp);
                        currentStamp = startStamp;
                    }
                    player.play();
                    autoplay = false;
                }
                if(flags){
                    wave.setupFlags(player.duration);
                    flags = false;
                }
            }, false);

            player.addEventListener('loadedmetadata', function(e) {
                if(currentTime !== null){
                    player.setCurrentTime(currentTime);
                    lastSeeked = currentTime;
                    if(!currentStatus){
                        player.play();
                    }
                }
                wave.updateTimings(player.currentTime, player.duration);
                currentTime = null;
            }, false);

            player.addEventListener('timeupdate', function(e) {
                wave.updateSlideLoop(player.currentTime);
                wave.updateScrubber(player.currentTime, player.duration);
                wave.updateTimings(player.currentTime, player.duration);
            }, false);

            player.addEventListener('seeked', function(e) {
                if(parseInt(lastSeeked) !== parseInt(player.currentTime)){
                    History.pushState({"stamp": parseInt(lastSeeked)}, document.title, "?stamp=" + parseInt(lastSeeked));
                }
            }, false);

            player.addEventListener('play', function(e) {
                $('.wave__play .icon-play-color2').removeClass('icon-play-color2').addClass('icon-pause-color2');
            }, false);

            player.addEventListener('playing', function(e) {
                playing = true;

                setTimeout(function(){
                    $(window).trigger('resize'); // If time is more than an hour, fullscreen button pops off the end of player, this fixes
                }, 1000);
                
            }, false);

            player.addEventListener('pause', function(e) {
                $('.wave__play .icon-pause-color2').removeClass('icon-pause-color2').addClass('icon-play-color2');
            }, false);

            player.addEventListener('volumechange', function(e){
                var $volumeIcon = $('.wave__mute div > div').removeClass('icon-sound-on-color2 icon-sound-off-color2');

                if(player.muted || player.volume <= 0){
                    $volumeIcon.addClass('icon-sound-off-color2');
                    wave.updateVolume(0);
                    return;
                }
                wave.updateVolume(player.volume);
                $volumeIcon.addClass('icon-sound-on-color2');
            });
        },

        init: function(player){
            History.Adapter.bind(window,'statechange',function(){
                var startStamp = History.getState("state").data.stamp;
                if(startStamp !== undefined && startStamp !== null && !isNaN(startStamp)){
                    player.setCurrentTime(startStamp);
                }
            });

            wave.setupEventHandlers(player);

            wave.setupInteractionHandlers(player);

            if (wave.device){
                $('.wave__mute, .wave__volume').hide();
            }
            if(!Modernizr.csstransforms){
                $('.wave__fullscreen, .wave__volume').hide();
            }
        }
     };
})();