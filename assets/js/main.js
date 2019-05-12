jQuery(function ($) {
    $(document).ready(function () {

        // Menu
        $('#navtoggle').on('click', function () {
            //$('.nav').toggleClass('open');
            $('body').removeClass('search-open');
            $('body').toggleClass('menu-open');
        });

        // Mobile Search Open
        $('.mobile-search-icon').on('click', function () {
            $('body').toggleClass('search-open');
            $('.nav').removeClass('open');
            $('body').removeClass('menu-open');
        });
        $('.site-content').on('click', function (e) {
            console.log('test');
            if ($(e.target).is('.header-search') === false) {
                $('body').removeClass('search-open');

            }
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
            $(window).scroll(function () {
                $('body').removeClass('has-promo-offers');
            });
        });

        // Check Mobile OS
        // if (navigator.userAgent.match(/Android/i)) {
        //     $('.download-app').addClass('android-app');
        // }
        // else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        //     $('.download-app').addClass('ios-app');
        // }
        // else {
        //     $('.download-app').addClass('desktop-app');
        // }

        // Check Subscribe Form
        if ($('.promo-offers-container').length) {
            $('body').addClass('has-promo-offers');
            $(window).scroll(function () {
                var winOffset = document.documentElement.scrollTop || document.body.scrollTop;
                if (winOffset > 59) {
                    $('body').removeClass('has-promo-offers');
                } else {
                    $('body').addClass('has-promo-offers');
                }
            });
        }
        else {
            $('body').removeClass('has-promo-offers');
        }

        // Load more for Multiple  Columns Component
        var indexColumns = 0;

        $("#loadColumnsBtn").click(function () {
            indexColumns++;
            var selector = "columnRow-" + indexColumns;
            document.getElementById(selector).removeAttribute("style");

            selector = "columnRow-" + indexColumns + 1;
            if (document.getElementById(selector) == null) {
                document.getElementById("loadColumnsBtn").setAttribute("style", "display:none")
            }
        });

        //Load more for Video section
        var indexVideos = 0;

        $("#loadVideoBtn").click(function () {
            
            var selector = "columnVideoRow-" + indexVideos;
            document.getElementById(selector).removeAttribute("style");
            indexVideos++;

            selector = "columnVideoRow-" + indexVideos;
            if (document.getElementById(selector) == null) {
                document.getElementById("loadVideoBtn").setAttribute("style", "display:none")
            }
        });  

        // Show/Hide Earn Product Content
        $(".earn-product-item-heading").on("click", function() {
            $(this).parents('.earn-product-item').siblings().removeClass('active');
            $(this).parents('.earn-product-item').toggleClass('active');
        });

    });
});