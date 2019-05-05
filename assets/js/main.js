$(document).ready(function () {

    // Menu
    $('#navtoggle').on('click', function () {
        $('.nav').toggleClass('open');
        $('body').removeClass('search-open');
        $('body').toggleClass('menu-open');
    });

    // Mobile Search Open
    $('.mobile-search-icon').on('click', function () {
        $('body').toggleClass('search-open');
        $('.nav').removeClass('open');
        $('body').removeClass('menu-open');
    });

    // Open/Close Desktop Search Open
    $('.search-icon-wrapper').on('click', function () {
        $('.header-search').slideDown();
    });
    $('.desktop-close-search').on('click', function () {
        $('.header-search').slideUp();
    });

    // Hide Sign Up Form
    $('.close-promo-offers').on('click', function () {
        $(this).parents('.promo-offers-container').slideUp();
        $('body').removeClass('has-promo-offers');
    });

    // Check Mobile OS
    if ( navigator.userAgent.match(/Android/i) ) {
        $('.download-app').addClass('android-app');
    } 
    else if ( navigator.userAgent.match(/iPhone|iPad|iPod/i) ) {
        $('.download-app').addClass('ios-app');
    } 
    else {
        $('.download-app').addClass('desktop-app');
    }
    
});
