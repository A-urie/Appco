/*================
 Template Name: AppCo App Landing Page Template
 Description: AppCo is app and product landing page template.
 Version: 1.0
 Author: https://themeforest.net/user/themetags
 =======================*/

// TABLE OF CONTENTS
// 1. fixed navbar
// 2. closes the responsive menu on menu item click
// 3. magnify popup video
// 4. client testimonial slider
// 5. Screenshots slider
// 6. our clients logo carousel
//
// `window.appcoTheme.init()` est exposee et idempotente : le DOM de la page
// d'accueil est recree a chaque activation de la route, les plugins doivent donc
// etre reinitialises a chaque fois, sans jamais etre appliques deux fois.
//
// Le bloc « custom counter », « client-testimonial-1 », « wow js », « #clock
// countdown », « #getQuoteFrm », « contact form » et « page scrolling » du
// fichier d'origine ont ete supprimes : ils ciblaient des elements absents du
// template ou des back-ends inexistants. La validation des formulaires est
// portee par les Reactive Forms Angular et le defilement vers les ancres par le
// routeur.

window.appcoTheme = (function () {
    'use strict';

    var windowHandlersBound = false;

    // 1. fixed navbar
    function bindWindowHandlers() {
        if (windowHandlersBound) {
            return;
        }
        windowHandlersBound = true;

        jQuery(window).on('scroll', function () {
            // checks if window is scrolled more than 60px, adds/removes solid class
            if (jQuery(this).scrollTop() > 60) {
                jQuery('.navbar').addClass('affix');
            } else {
                jQuery('.navbar').removeClass('affix');
            }
        });
    }

    // 2. closes the responsive menu on menu item click
    function bindMenuLinks($) {
        $('.navbar-nav li a').each(function () {
            var $link = $(this);
            if ($link.data('appcoMenuBound')) {
                return;
            }
            $link.data('appcoMenuBound', true);
            $link.on('click', function () {
                if (!$link.parent().hasClass('dropdown')) {
                    $('.navbar-collapse').collapse('hide');
                }
            });
        });
    }

    // 3. magnify popup video
    function initMagnificPopup($) {
        $('.popup-youtube, .popup-vimeo, .popup-gmaps').each(function () {
            var $target = $(this);
            if ($target.data('appcoMagnific')) {
                return;
            }
            $target.data('appcoMagnific', true);
            $target.magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });
        });
    }

    // 4. client testimonial slider
    // 5. Screenshots slider
    // 6. our clients logo carousel
    function initCarousels($) {
        // Owl Carousel ajoute la classe `owl-loaded` : elle sert de garde-fou
        // pour ne pas reinitialiser un carrousel deja monte.
        $('.client-testimonial:not(.owl-loaded)').owlCarousel({
            loop: false,
            margin: 30,
            items: 1,
            nav: true,
            dots: false,
            responsiveClass: true,
            autoplay: false,
            autoplayHoverPause: true,
            lazyLoad: true,
        });

        $('.screen-carousel:not(.owl-loaded)').owlCarousel({
            loop: true,
            margin: 0,
            center: true,
            dots: true,
            nav: false,
            autoplay: true,
            responsive: {
                0: { items: 1 },
                768: { items: 3 },
                991: { items: 4 },
                1200: { items: 4 },
                1920: { items: 4 }
            }
        });

        $('.clients-carousel:not(.owl-loaded)').owlCarousel({
            autoplay: true,
            loop: true,
            margin: 15,
            dots: true,
            slideTransition: 'linear',
            autoplayTimeout: 4500,
            autoplayHoverPause: true,
            autoplaySpeed: 4500,
            responsive: {
                0: { items: 2 },
                500: { items: 3 },
                600: { items: 4 },
                800: { items: 5 },
                1200: { items: 6 }
            }
        });
    }

    function init() {
        if (typeof jQuery === 'undefined') {
            return;
        }
        var $ = jQuery;

        bindWindowHandlers();
        bindMenuLinks($);
        initMagnificPopup($);
        initCarousels($);
    }

    return { init: init };
})();

jQuery(function () {
    window.appcoTheme.init();
});