$(document).ready(function () {

    // Menu
    $('.nav-icon').on('click', function () {
        $('body').toggleClass('menu-open');
        $('body').removeClass('search-open');
    });

    // Mobile Search Open
    $('.search-icon').on('click', function () {
        $('body').toggleClass('search-open');
        $('body').removeClass('menu-open');
    });

    // Hide Adverb
    $('.close-adverb').on('click', function () {
        $(this).parents('.adverb-container').slideUp();
    });

    // Hide Sign Up Form
    $('.close-promo-offers').on('click', function () {
        $(this).parents('.promo-offers-container').slideUp();
    });

    // Open Desktop Search
    $(".fa-search-header").on('click', function () {
        $(this).parents(".search-wrapper-header").toggleClass("opened");
    });
    $(".close-search-header").on('click', function () {
        $(this).parents(".search-wrapper-header").removeClass("opened");
        $(".search-wrapper-header input").val('');
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
