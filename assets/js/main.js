var searchIcon = jQuery(".searchIcon");
var searchTextBox = jQuery(".searchText");
var sortBySelect = jQuery(".sortBySelect");
var skipField = jQuery(".skip");
var searchTerm = jQuery(".searchTerm");
var searchPageId = jQuery(".pageId");
var showMoreButton = jQuery(".showMoreBtn");

jQuery(function ($) {
    $(document).ready(function () {

        // Login/Reset Password Content
        if ($('.login-site-content').length) {
            $('body').addClass('login-reset-body');
        } else {
            $('body').removeClass('login-reset-body');
        }

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
        $(".loadColumnsBtn").click(function () {
            var parent = $(this).parent();
            var index = parent.data("index");
            index++;
            var selector = ".columnRow-" + index;

            var child = parent.children(selector);
            child.removeAttr("style");

            selector = ".columnRow-" + index + 1;
            if (parent.children(selector).length == 0) {
                $(this).attr("style", "display:none")
            }
        });

        //Load more for Video section
        $(".loadVideoBtn").click(function () {
            var parent = $(this).parent();
            var index = parent.data("index");

            var selector = ".columnVideoRow-" + index;
            var child = parent.children(selector);
            child.removeAttr("style");

            index++;
            parent.data("index", index);

            selector = ".columnVideoRow-" + index;
            if (parent.children(selector).length == 0) {
                $(this).attr("style", "display:none")
            }
        });

        //Forgot Password form validation and ajax call
        $("#reset-btn").on("click", function (e) {
            e.preventDefault();
            var email = $("#email").val();
            if (email.length == 0 || !validateEmail(email)) {
                $("#email").addClass("input-validation-error");
                $("#email").next().removeClass("hidden");
            } else {
                $("#email").removeClass("input-validation-error");
                $("#email").next().addClass("hidden");

                jQuery.post("/Password/SubmitForm", $("#forgotPasswordForm").serialize(), function (data) {
                    $("#forgotPasswordBody").addClass("hidden");
                    $("#formWrapper").addClass("hidden");

                    if (data["status"] == true) {
                        $("#forgotPasswordSuccessMessage").removeClass("hidden");
                    } else {
                        $("#forgotPasswordErrorMessage").removeClass("hidden");

                    }

                });
            }

        });


        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
        //Update password ajax call
        $("#reset-pass-btn").on("click", function (e) {
            jQuery.post("/Password/UpdatePassword", { OldPassword: "test", NewPassword: "text" }, function (data) {
                console.log("Data: ", data);
            });
        });

        //Update earnings ajax call
        $("#update-earnings-btn").on("click", function (e) {
            e.preventDefault();
            if (!isNaN($("#earningsGoal").val())) {
                jQuery.post("/UpdateYourEarning/UpdateYourEarning", $("#updateEarningsForm").serialize(), function (data) {
                    if (data.status == "true") {
                        $("#earningsGoal").val("");
                        $("#earningsGo").val("")
                    }
                })
            }
        });

        // Show/Hide Earn Product Content
        $(".earn-product-item-heading").on("click", function () {
            $(this).parents('.earn-product-item').siblings().removeClass('active');
            $(this).parents('.earn-product-item').toggleClass('active');
        });

        // Tabs to Accordion
        $(".tab-content").hide();
        $(".tab-content:first").show();
        $(".custom-tabs li").click(function () {
            $(".tab-content").hide();
            var activeTab = $(this).attr("rel");
            $("#" + activeTab).fadeIn();
            $(".custom-tabs li").removeClass("active");
            $(this).addClass("active");
            $(".tab-heading").removeClass("d-active");
            $(".tab-heading[rel^='" + activeTab + "']").addClass("d-active");
        });
        $(".tab-heading").click(function () {
            $(".tab-content").hide();
            var d_activeTab = $(this).attr("rel");
            $("#" + d_activeTab).fadeIn();
            $(".tab-heading").removeClass("d-active");
            $(this).addClass("d-active");
            $(".custom-tabs li").removeClass("active");
            $(".custom-tabs li[rel^='" + d_activeTab + "']").addClass("active");
        });

        // Registration Step Wizard
        var navListItems = $('div.setup-panel div a'),
            allWells = $('.step-content'),
            allNextBtn = $('.nextBtn'),
            allPrevBtn = $('.prevBtn');

        allWells.hide();

        navListItems.click(function (e) {
            e.preventDefault();
            var $target = $($(this).attr('href')),
                $item = $(this);

            if (!$item.hasClass('disabled')) {
                $item.addClass('active-step');
                $item.parent().addClass('active-stepwizard');
                allWells.hide();
                $target.show();
                $target.find('input:eq(0)').focus();
            }
        });

        allPrevBtn.click(function () {
            var curStep = $(this).closest(".step-content"),
                curStepBtn = curStep.attr("id"),
                prevStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().prev().children("a");
            $('div.setup-panel div a[href="#' + curStepBtn + '"]').removeClass('active-step');
            $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().removeClass('active-stepwizard');
            prevStepWizard.removeAttr('disabled').trigger('click');
        });

        $("body").on("click", ".nextBtn", function () {
            var curStep = $(this).closest(".step-content"),
                curStepBtn = curStep.attr("id"),
                nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
                curInputs = curStep.find("input[type='text'],input[type='url'], input[type='email'], input[type='password']"),
                isValid = true;

            $(".form-group").removeClass("has-error");
            for (var i = 0; i < curInputs.length; i++) {
                if (!curInputs[i].validity.valid) {
                    isValid = false;
                    $(curInputs[i]).closest(".form-group").addClass("has-error");
                }
            }

            if (isValid) {
                nextStepWizard.removeAttr('disabled').trigger('click');
            }
        });

        $('.getSchools').click(function () {
            var curStep = $(this).closest(".step-content"),
                curInputs = curStep.find("input[type='text'],input[type='url'], input[type='email'], input[type='password']");
            $(".form-group").removeClass("has-error");
            isValid = true;
            for (var i = 0; i < curInputs.length; i++) {
                if (!curInputs[i].validity.valid) {
                    isValid = false;
                    $(curInputs[i]).closest(".form-group").addClass("has-error");
                }
            }
            if (isValid) {
                getSchools();
                $(this).parents('.step-content').addClass('show-school-container');
            }
        });

        $('div.setup-panel div a.active-step, div.setup-panel div .active-stepwizard').trigger('click');

        // Custom Modal
        $('.details-td').on('click', function (e) {
            e.preventDefault();
            $('.modal').addClass('is-visible');
        });
        $('.modal-close').on('click', function (e) {
            e.preventDefault();
            $('.modal').removeClass('is-visible');
        });
        $('.school-modal').on('click', function (e) {
            e.preventDefault();
            $('.modal').addClass('is-visible');
        });

        // Edit User Infoadd-store-btn
        $('.edit-btn').on('click', function() {
            $(this).parents('.account-item-content').toggleClass('edit-user');
        });

        // Add Store
        $('.add-store-btn').on('click', function() {
            $('.link-container').addClass('add-link-account');
        });

        //Add/Remove Account Coordinator
        $('.close-add-coord-container').on('click', function() {
            $(this).parents('.add-coord-container').removeClass('show-coordinatior-account')
        });
        $('.add-coordinator-btn').on('click', function() {
            $('.add-coord-container').addClass('show-coordinatior-account')
        });

        $('.close-remove-container').on('click', function() {
            $(this).parents('.remove-tr').removeClass('show-remove')
        });
        $('.remove-coord').on('click', function() {
            $(this).parent().next().addClass('show-remove')
        });
    });

    function getSchools() {
        var text = $("#text").val()

        $.get("/Registration/searchschools?keyword=" + text, function (data) {
            var htmlData = "";
            for (var i = 0; i < data.list.length; i++) {

                htmlData += "<div class='school-select'>" +
                    "<span>" + data.list[i].SchoolName + "</span>" +
                    "<p>" + data.list[i].Address + "</p>" +
                    "<p>" + data.list[i].City + "," + data.list[i].State + " " + data.list[i].ZipCode + "</p>" +
                    "<button class='nextBtn' data-schoolId='" + data.list[i].GmilId + "'>SELECT THIS SCHOOL</button>" +
                    "</div >"
            }
            $(".school-select-container").append(htmlData)
            console.log("Data: ", data);
        });
    }

    // Submission Form Steps
    $('.submission-block:first').addClass('current first');
    $('.submission-block:last').addClass('empty last');
    $('.submission-block').not(':first, :last').addClass('empty');
    $('.next-btn').click(function () {
        var current = $('.current'),
            next = $('.current').next('div');
        current.removeClass('current').addClass('filled');
        next.removeClass('empty').addClass('current');

    });

    // Smoth scrolling to form section
    $(".go-to-form").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 100
            }, 800, function () {
                window.location.hash = hash;
            });
        }
    });

    // Show/Hide Account Content
    $(".account-item-heading").on("click", function () {
        $(this).parents('.account-item').siblings().removeClass('active');
        $(this).parents('.account-item').toggleClass('active');
    });

});

/**
 * Video Galerry 
 * --------------------------------------------------
 * This closure holds the views for the
 * Video Gallery components.
 */
(function (jQuery) {

    'use strict';

    /**
     * The "Video Gallery" view.
     * 
     * @param {Element} gallery
     */
    function View(gallery) {
        this.$el = jQuery(gallery)
        this.$feeder = this.$el.find('.video-gallery-feeder')
        this.$cards = this.$el.find('.video-gallery-card')
        this.$viewport = this.$el.find('.video-gallery-viewport')
        this.$iframes = this.$el.find('iframe')
        this.index = 0

        this.$feeder.on('click', this.onFeederClick.bind(this))
        this.$cards.on('click', this.onCardClick.bind(this))

        this.$el.find('.video-gallery-viewport-close').on('click', this.closePlayer.bind(this))
    }

    /**
     * Handle the "Load More" click.
     * 
     * @param {jQuery.Event} event
     */
    View.prototype.onFeederClick = function (event) {
        event.preventDefault()

        this.index += 1

        this.getWrapperByIndex(this.index).addClass('feature-item-wrap--visible')

        if (!this.getWrapperByIndex(this.index + 1).get(0)) {
            this.$feeder.hide()
        }
    };

    /**
     * Handle the "Card Thumbnail" click.
     * 
     * @param {jQuery.Event} event
     */
    View.prototype.onCardClick = function (event) {
        event.preventDefault()

        var $card = jQuery(event.currentTarget)
        var $player = jQuery(`#${$card.attr('data-player')}`)

        if ($card.data('open')) {
            return
        }

        this.closePlayer()

        $card.data('open', true).toggleClass('video-gallery-card--open', true)
        $player.toggleClass('video-gallery-viewport--open', true)

        var offset = $player.offset()
        var scrollTopGap = Util.isOnMobile() ? 120 : 160

        jQuery('html, body').animate({
            scrollTop: offset.top - scrollTopGap
        }, 500)
    };

    /**
     * Return a "Player Wrapper" based on the index.
     * 
     * @param {Number} index
     */
    View.prototype.getWrapperByIndex = function (index) {
        return this.$el.find('.feature-item-wrap').eq(index);
    };

    /**
     * Close all video players from the element context.
     */
    View.prototype.closePlayer = function () {
        this.$cards.data('open', false).toggleClass('video-gallery-card--open', false)
        this.$viewport.toggleClass('video-gallery-viewport--open', false)

        this.$iframes.each(function () {
            this.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
        })
    };

    /**
     * Util
     */
    var Util = {
        /**
         * Detect if the device is a mobile.
         * 
         * @return {Boolean}
         */
        isOnMobile: function () {
            return (navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i)
            )
        }
    }

    //
    // Initialize

    jQuery(document).ready(function () {
        jQuery('.video-gallery').each(function (index, gallery) {
            return new View(gallery);
        })
    });

    searchIcon.on("click", function () {
        DoSearch();
    })

    searchTextBox.keydown(function (e) {
        if (e.keyCode == 13) {
            DoSearch();
        }
    });


    var DoSearch = function () {
        if (!isEmptyOrSpaces(searchTextBox.val())) {
            location.href = "/search?q=" + searchTextBox.val();
        }
    }

    function isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
    }

    /*Search Ajax*/

    sortBySelect.on("change", function () {
        searchManager.DoSorting();
    })

    showMoreButton.on("click", function () {
        searchManager.ShowMore();
    })

    var searchManager = {
        DoSorting: function () {
            skipField.val(0);
            jQuery(".search-result-item-container").html("");
            this.fetchResults();
        },
        ShowMore: function () {
            var temp = parseInt(skipField.val()) + 1;
            skipField.val(temp);
            this.fetchResults();
        },
        fetchResults: function () {
            var term = searchTerm.val();
            var skip = skipField.val();
            var pId = searchPageId.val();
            var sortBy = sortBySelect.val();
            jQuery.get("/search/getsearchresults?pageid=" + pId + "&term=" + term + "&sortby=" + sortBy + "&skip=" + skip, function (data) {

                if (data.HideShowMoreButton) {
                    showMoreButton.addClass("hidden");
                }
                else {
                    showMoreButton.removeClass("hidden");
                }
                var html = jQuery(".search-result-item-container").html();
                for (var i = 0; i < data.Results.length; i++) {
                    html += searchManager.buildHtml(data.Results[i]);
                }
                jQuery(".search-result-item-container").html(html);
            })

        },
        buildHtml: function (data) {
            var elementHtml = '<div class="search-result-item">';
            elementHtml += '<a href="' + data.Url + '">';
            elementHtml += '<span>' + data.Title + '</span>';
            elementHtml += '<p>' + data.Description + '</p></a></div>';
            return elementHtml;
        }
    }

})(jQuery)
