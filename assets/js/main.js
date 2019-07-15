"use strict";

var searchIcon = jQuery(".searchIcon");
var searchTextBox = jQuery(".searchText");
var sortBySelect = jQuery(".sortBySelect");
var skipField = jQuery(".skip");
var searchTerm = jQuery(".searchTerm");
var searchPageId = jQuery(".pageId");
var showMoreButton = jQuery(".showMoreBtn");
var totalClips = jQuery(".totalClips");
var totalBonus = jQuery(".totalBonus");
var firstStepButton = jQuery(".firstStep-next-btn");
var secondStepButton = jQuery(".secondStep-next-btn");
var generatePdfButton = jQuery(".generatePdf");
var passwordTextbox = jQuery(".password");
var confirmPasswordTextbox = jQuery(".confirmPassword");

jQuery(function ($) {

    $(document).ready(function () {

        $(".datepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: "100:+0"
        });
        $(".datepicker").datepicker("option", "dateFormat", "yy-mm-dd");

        // Scroll to center on tabs
        $(".tab-heading").on('click', function () {
            var tabHeading = $(this);
            var tabHeadingOffset = tabHeading.offset().top;
            var tabHeadingHeight = tabHeading.height();
            var windowHeight = $(window).height();
            var offset;

            if (tabHeadingHeight < windowHeight) {
                offset = tabHeadingOffset - ((windowHeight / 2) - (tabHeadingHeight / 2));
            }
            else {
                offset = tabHeadingOffset;
            }
            var speed = 700;
            $('html, body').animate({ scrollTop: offset }, speed);
        });

        // Remove space if there is no header
        if ($('#masthead').length == 0) {
            $('.site-content').css('margin-top', '0');
        }

        // $(window).load(function () {
        //     if ($(window).width() > 767) {
        //         $('.earn-product-container').masonry({
        //             itemSelector: '.earn-product-item',
        //             gutter: 60
        //         });
        //     }
        // });

        // Login/Reset Password Content
        if ($('.login-site-content').length) {
            $('body').addClass('login-reset-body');
        } else {
            $('body').removeClass('login-reset-body');
        }

        $("#login-btn").on("click", function (e) {
            e.preventDefault();
            var isValid = true;
            var email = $("#login-email");
            var password = $("#login-password");
            if (!validateEmail(email.val())) {
                isValid = false;
                email.addClass("input-validation-error");
                email.next(".login-field-validation").removeClass("hidden");
            } else {
                email.removeClass("input-validation-error");
                email.next(".login-field-validation").addClass("hidden");
            }
            if (password.val() == null || password.val() == "") {
                isValid = false;
                password.addClass("input-validation-error");
                password.next(".login-field-validation").removeClass("hidden");
            } else {
                password.removeClass("input-validation-error");
                password.next(".login-field-validation").addClass("hidden");
            }
            if (isValid) {

                password.removeClass("input-validation-error");
                password.next(".login-field-validation").addClass("hidden");

                email.removeClass("input-validation-error");
                email.next(".login-field-validation").addClass("hidden");

                var action = $("#loginAction").val();
                $.post("/LoginPage/" + action + window.location.search, { Email: email.val(), Password: password.val(), RedirectUri: $("#redirectUri").val(), ClientId: $("#clientId").val(), NotAcceptedTermsUrl: $("#NotAcceptedTermsUrl").val(), AcceptedTermsUrl: $("#AcceptedTermsUrl").val() }, function (data) {
                    if (data.status) {
                        if (data.showTermsAndConditions) {
                            $(".login-page-wrapper").hide();
                            $(".redirectUrl").val(data.redirectUri);
                            $(".token").val(data.token);
                            $(".type").val(data.type);
                            $(".terms-conditions-wrapper").show();
                        }
                        else {
                            window.location.href = data.redirectUri;
                        }
                    } else {
                        $(".login-field-wrapper").next(".custom-error").text(data.message);
                        $(".login-field-wrapper").next(".custom-error").addClass("show-custom-error");
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 404) {
                        var data = jqXHR.responseJSON;
                        console.log(data);
                        if (data.status == true) {
                            $(".login-field-wrapper").next(".custom-error").removeClass("show-custom-error");
                            if (action == "LoginPageConsumer") {
                                window.location.href = "/Consumer Logged in Landing Page";
                            } else if (action == "LoginPageCoordinator") {
                                window.location.href = "/Coordinator Logged in Landing Page";
                            }
                        }
                        else {
                            $(".login-field-wrapper").next(".custom-error").text(data.message);
                            $(".login-field-wrapper").next(".custom-error").addClass("show-custom-error");
                        }
                    }
                });
            }
        });

        $(".login-field-handler").on("keyup", function (e) {
            $(this).removeClass("input-validation-error");
            $(this).next(".login-field-validation").addClass("hidden");
        });

        //Custom Feature Section Mobile Nav
        if ($("body").find("#customFeatureNav").length > 0) {
            //$("#navmenu").append($("#customFeatureMobileNav"));
            $("#customFeatureMobileNav").insertAfter(".mobile-account-btn");
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

        $('#years').on('change', function () {
            var yearVal = this.value;
            $("#school-activity-table tbody").empty();
            jQuery.get(
                "/SchoolEarningActivity/GetData?yearFilter=" + yearVal, function (data) {
                    var tableData = appendToTable(data);
                    $("#school-activity-table tbody").append(tableData);
                });
        });

        $('#school-earning-years').on('change', function () {
            var year = this.value;
            $("#school-earning-table tbody").empty();
            jQuery.get(
                "/ActivityComponent/GetActivityData?year=" + year, function (data) {
                    var tableData = appendToTable(data);
                    $("#school-earning-table tbody").append(tableData);
                });
        });

        //$('#school-earning-years').on('change', function () {
        //    var year = this.value;
        //    $("#SchoolEarningTotal").empty();
        //    jQuery.get(
        //        "/SchoolEarningHistory/GetSchoolEarning?year=" + year, function (data) {
        //            $("#SchoolEarningTotal").append(data);
        //        });
        //});

        $('#subm-years').on('change', function () {
            var year = this.value;
            jQuery(".page").val(1);
            jQuery(".submissions-list").empty();
            jQuery.get(
                "/SchoolSubmission/GetSubmissionByYear?year=" + year + "&itemId=" + jQuery(".itemId").val(), function (data) {
                    jQuery(".submissions-list").html(data);
                });
        });

        jQuery(".school-submission-next-btn").on("click", function () {
            var currentPage = parseInt(jQuery(".page").val());
            SwitchStep(currentPage + 1);
        });

        jQuery(".school-submission-previous-btn").on("click", function () {
            var currentPage = parseInt(jQuery(".page").val());
            SwitchStep(currentPage - 1);
        });

        function SwitchStep(step) {
            jQuery(".page").val(step);
            if (step > 1) {
                jQuery(".school-submission-previous-btn").removeAttr("disabled");
                if (step == parseInt(jQuery(".numberOfPages").val())) {
                    jQuery(".school-submission-next-btn").attr("disabled", "disabled");
                }
                else {
                    jQuery(".school-submission-next-btn").removeAttr("disabled");
                }
            }
            else {
                jQuery(".school-submission-previous-btn").attr("disabled", "disabled");
            }
            jQuery(".custom-table").addClass("hidden");
            jQuery(".page-" + step).removeClass("hidden");
        }

        //function appendToSubmissionTable(data) {
        //    var tableData = "";
        //    for (var i = 0; i < data.submissions.length; i++) {
        //        tableData += 
        //    }
        //    return tableData;
        //}

        function appendToTable(data) {
            var tableData = "";
            for (var i = 0; i < data.list.schoolActivity.length; i++) {
                var date = new Date(parseInt(data.list.schoolActivity[i].date.substr(6)));
                tableData += "<tr>" +
                    //"<td>" + data.list.schoolActivity[i].date + "</td>" +
                    "<td>" + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "/" + date.getDate() + "/" + date.getFullYear() + "</td>" +
                    "<td>" + data.list.schoolActivity[i].description + "</td>" +
                    "<td>" + "$" + data.list.schoolActivity[i].amount_earned + "</td>" +
                    "</tr>";
            }
            return tableData;
        }

        // Check Subscribe Form
        if ($('.promo-offers-container').length) {
            $('body').addClass('has-promo-offers');
            $(window).scroll(function () {
                var winOffset = document.documentElement.scrollTop || document.body.scrollTop;
                if (winOffset > 0) {
                    $('body').removeClass('has-promo-offers');
                } else {
                    $('body').addClass('has-promo-offers');
                }
            });
        } else {
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
                $(this).attr("style", "display:none");
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
                $(this).attr("style", "display:none");
            }
        });

        //Forgot Password form validation and ajax call
        $("#reset-btn").on("click", function (e) {
            e.preventDefault();
            var email = $("#email").val();
            if (email.length == 0 || !validateEmail(email)) {
                jQuery(".custom-error").text("");
                jQuery(".custom-error").text(jQuery("#forgotPasswordErrorMesssage").text());
                jQuery(".custom-error").show();
            } else {
                $("#email").removeClass("input-validation-error");
                $("#email").next().addClass("hidden");

                jQuery.post("/Password/SubmitForm", $("#forgotPasswordForm").serialize(), function (data) {
                    if (data.status) {
                        $("#forgotPasswordBody").addClass("hidden");
                        $("#formWrapper").addClass("hidden");
                        $("#forgotPasswordSuccessMessage").removeClass("hidden");
                    } else {
                        jQuery(".custom-error").text("");
                        jQuery(".custom-error").text(jQuery("#forgotPasswordErrorMesssage").text());
                        jQuery(".custom-error").show();
                    }
                });
            }
        });

        // Reset Password

        jQuery("#change-password-btn").on("click", function (e) {
            e.preventDefault();
            var passwordsValid = true;
            var regex = /(?=^.{6,20}$)(?=.*\d)(?=.*[a-zA-Z])(?!.*\s)(\w|[~!$&+,:;=?\[\]@#_|<>{}()^%*\.\-\+])*$/;
            if (passwordTextbox.val() != confirmPasswordTextbox.val()) {
                passwordsValid = false;
                jQuery(".custom-error").text("");
                jQuery(".custom-error").text(jQuery("#passwordsDoNotMatch").text());
                jQuery(".custom-error").show();
            } else {
                if (!regex.test(confirmPasswordTextbox.val())) {
                    passwordsValid = false;
                    jQuery(".custom-error").text("");
                    jQuery(".custom-error").text(jQuery("#forgotPasswordErrorMesssage").text());
                    jQuery(".custom-error").show();
                }
            }

            if (passwordsValid) {
                jQuery(".custom-error").hide();
                jQuery.post("/Password/SubmitForm", jQuery("#resetPasswordForm").serialize(), function (data) {
                    if (data.status) {
                        window.location.href = "/";
                    } else {
                        jQuery(".custom-error").text("");
                        jQuery(".custom-error").text(jQuery("#forgotPasswordErrorMesssage").text());
                        jQuery(".custom-error").show();
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
            if (validateUpdatePasswordForm()) {
                jQuery.post("/Password/UpdatePassword", { OldPassword: "test", NewPassword: "text" }, function (data) {
                    console.log("Data: ", data);
                });
            }
        });

        //Sweestake details form validation
        $("#submit-form").on("click", function (e) {
            e.preventDefault();
            var isValid = true;
            var sweepFirstName = $("#firstName");
            var sweepLastName = $("#lastName");
            var sweepAddress = $("#address");
            var sweepCity = $("#city");
            var sweepZipcode = $("#zipCode");
            var statesEr = $(".select");
            var states = $('#states_id option:selected').val();
            var regex = /^[0-9]{5}(?:-[0-9]{4})?$/;
            var sweepBirthdate = $("#birthdate");
            var checkAgree = $(".agreeCheckBox").is(":checked") ? 1 : 0;
            if (states == "") {
                isValid = false;
                statesEr.parents(".form-group").addClass("has-error");
            } else {
                statesEr.parents(".form-group").removeClass("has-error");
            }
            if (sweepBirthdate.val() == "" || !isFullyMature(sweepBirthdate)) {
                sweepBirthdate.parents(".form-group").addClass("has-error");
                if (sweepBirthdate.val() == "") {
                    $("#mature_err").addClass("hidden");
                }
                else if (!isFullyMature(sweepBirthdate)) {
                    $("#brqrd_err").addClass("hidden");
                    $("#mature_err").removeClass("hidden");
                }
                isValid = false;
            } else {
                sweepBirthdate.parents(".form-group").removeClass("has-error");
            }
            if (sweepFirstName.val() == "") {
                isValid = false;
                sweepFirstName.parents(".form-group").addClass("has-error");
            }
            else {
                sweepFirstName.parents(".form-group").removeClass("has-error");
            }
            if (sweepLastName.val() == "") {
                isValid = false;
                sweepLastName.parents(".form-group").addClass("has-error");
            }
            else {
                sweepLastName.parents(".form-group").removeClass("has-error");
            }
            if (sweepAddress.val() == "") {
                isValid = false;
                sweepAddress.parents(".form-group").addClass("has-error");
            }
            else {
                sweepAddress.parents(".form-group").removeClass("has-error");
            }
            if (sweepCity.val() == "") {
                isValid = false;
                sweepCity.parents(".form-group").addClass("has-error");
            }
            else {
                sweepCity.parents(".form-group").removeClass("has-error");
            }
            if (sweepZipcode.val() == "" || !regex.test(sweepZipcode.val())) {
                sweepZipcode.parents(".form-group").addClass("has-error");
                if (sweepZipcode.val() == "") {
                    $("#format_err").addClass("hidden");
                }
                else if (!regex.test(sweepZipcode.val())) {
                    $("#rqrd_err").addClass("hidden");
                    $("#format_err").removeClass("hidden");
                }
                isValid = false;
            }
            else {
                sweepZipcode.parents(".form-group").removeClass("has-error");
            }
            if (checkAgree == 0) {
                isValid = false;
            }
            if (isValid) {
                var id = $("#sweepId").val();
                jQuery.post(
                    "/SweepstakesDetailsForm/Submit", { SweepstakeId: id }, function (data) {
                        if (data.success) {
                            window.location.href = "/Offer Sweep Details With Download";
                        }
                    });
            }
        });
        function isFullyMature(selector) {
            var today = new Date();
            var date = new Date(selector.val());
            if (date < today) {
                const diffTime = Math.abs(today.getTime() - date.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const diffYears = diffDays / 365;
                if (diffYears < 18)
                    return false;
            } else if (date > today) {
                return false;
            }
            return true;
        }
        function validateUpdatePasswordForm() {
            var oldPass = $("#oldPassword");
            var newPass = $("#newPassword");
            var confirmPass = $("#confirmNewPassword");

            var isValid = true;

            if (oldPass.val() == "") {
                oldPass.parents(".form-group").addClass("form-error");
                isValid = false;
            } else {
                oldPass.parents(".form-group").removeClass("form-error");
                isValid = true;
            }

            if (newPass.val() == "") {
                newPass.parents(".form-group").addClass("form-error");
                isValid = false;
            } else {
                newPass.parents(".form-group").removeClass("form-error");
                isValid = true;
            }

            if (confirmPass.val() == "" || confirmPass.val() != newPass.val()) {
                confirmPass.parents(".form-group").addClass("form-error");
                isValid = false;
            } else {
                confirmPass.parents(".form-group").removeClass("form-error");
                isValid = true;
            }
            return isValid;
        }

        //Update earnings ajax call
        $("#update-earnings-btn").on("click", function (e) {
            e.preventDefault();
            if (!isNaN($("#earningsGoal").val())) {
                jQuery.post("/UpdateYourEarning/UpdateYourEarning", $("#updateEarningsForm").serialize(), function (data) {
                    if (data.status == "true") {
                        $("#earningsGoal").val("");
                        $("#earningsGo").val("");
                    }
                });
            }
        });

        // Show/Hide Earn Product Content
        $(".earn-product-item-heading").on("click", function () {
            $(this).parents('.earn-product-item').siblings().removeClass('active');
            $(this).parents('.earn-product-item').toggleClass('active');
        });

        //Redeem code
        $("#redeemCodeBtn").on("click", function () {
            var code = $("#redeemCodeText").val();
            if (code == "" || code == null) {
                $("#redeemCodeError").removeClass("hidden");
                $("#redeemCodeText").parents(".form-group").addClass("has-error");
            } else {
                $("#redeemCodeText").next(".error-msg").addClass("hidden");
                $.post("RedeemBox/SubmitCode", { code: code }, function (data) {
                    if (data.status) {
                        $("#redeemCodeText").val("");
                    } else {
                        $("#redeemCodeError").addClass("hidden");
                        $("#redeemCodeText").parents(".form-group").removeClass("has-error");
                    }
                });

            }
        });
        // Tabs to Accordion
        $(".custom-tabs li").click(function () {
            var activeTab = $(this).attr("rel");
            $("#" + activeTab).toggleClass("t-active").siblings().removeClass("t-active");
            $(".custom-tabs li").removeClass("active");
            $(this).addClass("active");
            $(".tab-heading").removeClass("d-active");
            $(".tab-heading[rel^='" + activeTab + "']").addClass("d-active");
        });
        $(".tab-heading").click(function () {
            $(this).parent().addClass('active-content');
            var d_activeTab = $(this).attr("rel");
            $("#" + d_activeTab).toggleClass("t-active");
            $(this).toggleClass("d-active");
            $(".custom-tabs li").removeClass("active");
            $(".custom-tabs li[rel^='" + d_activeTab + "']").toggleClass("active");
        });

        // Checkbox value
        $(".control-checkbox").on("click", function () {
            console.log("Test click");
            if ($(".checkbox-value").is(":checked")) {
                $(".checkbox-value").attr("value", "true");
            } else {
                $(".checkbox-value").attr("value", "false");
            }
        });

        //Cookie
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        //Hide Hero Banner
        $(".app-download-link").on("click", function (e) {

            e.preventDefault();
            setCookie("AppDownloadCookie", true, 10);
            window.open(jQuery(this).attr("href"), '_blank')
            $(".hero-banner-container").fadeOut();

        })

        // Registration Step Wizard
        var navListItems = $('div.setup-panel div a'),
            allWells = $('.step-content').not(".experienceEditorMode"),
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
            var curStep = $(this).closest(".step-content");
            var currentStep = curStep.data("step");
            var curStepBtn = curStep.attr("id");
            var nextStep = parseInt(currentStep) + 1;
            var nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a");
            var curInputs = curStep.find("input[type='text'],input[type='url'], input[type='email'], input[type='password']");
            var isValid = true;

            $(".form-group").removeClass("has-error");
            for (var i = 0; i < curInputs.length; i++) {
                if (!curInputs[i].validity.valid) {
                    isValid = false;
                    $(curInputs[i]).closest(".form-group").addClass("has-error");
                }
            }

            if ($(this).data("schoolid")) {
                $("#schoolId").val($(this).data("schoolid"));
                $("#schoolName").val($(this).data("schoolname"));
                isValid = true;
            }

            if (parseInt(currentStep) == 2 && (!isFullyMature($("#birthdate")) || $("#birthdate").val() == "")) {
                $("#birthdate").closest(".form-group").addClass("has-error");
                if ($("#birthdate").val() == "") {
                    $("#mature_err").addClass("hidden");
                }
                else if (!isFullyMature($("#birthdate"))) {
                    $("#brqrd_err").addClass("hidden");
                    $("#mature_err").removeClass("hidden");
                }
                isValid = false;
            }
            if (parseInt(currentStep) == 3) {
                var passwordTextbox = $("#password");
                var confirmPasswordTextbox = $("#confirmPassword");
                var passHasValue = true;
                if (passwordTextbox.val() == "" || passwordTextbox.val() == null) {
                    var errPTxt = passwordTextbox.closest(".input-group").find(".pass-err-msg").text();

                    passwordTextbox.closest(".input-group").find(".error-msg").text(errPTxt)
                    passHasValue = false;
                    passwordTextbox.closest(".form-group").addClass("has-error");
                } else {
                    passwordTextbox.closest(".error-msg").addClass("hidden");
                }

                if (confirmPasswordTextbox.val() == "" || confirmPasswordTextbox.val() == null) {
                    var errCPTxt = confirmPasswordTextbox.closest(".input-group").find(".pass-err-msg").text();

                    confirmPasswordTextbox.closest(".input-group").find(".error-msg").text(errCPTxt);
                    confirmPasswordTextbox.closest(".error-msg").removeClass("hidden");
                    passHasValue = false;
                    confirmPasswordTextbox.closest(".form-group").addClass("has-error");
                } else {
                    confirmPasswordTextbox.closest(".error-msg").addClass("hidden");
                }
                if (passHasValue) {
                    if (passwordTextbox.val() != confirmPasswordTextbox.val()) {
                        isValid = false;

                        var errTxt = confirmPasswordTextbox.closest(".input-group").find(".pass-not-match").text();
                        confirmPasswordTextbox.closest(".input-group").find(".error-msg").text(errTxt);
                        passwordTextbox.closest(".input-group").find(".error-msg").text(errTxt);

                        passwordTextbox.closest(".form-group").addClass("has-error");
                        confirmPasswordTextbox.closest(".form-group").addClass("has-error");
                    } else {
                        var regex = /(?=^.{6,20}$)(?=.*\d)(?=.*[a-zA-Z])(?!.*\s)(\w|[~!$&+,:;=?\[\]@#_|<>{}()^%*\.\-\+])*$/;
                        if (!regex.test(confirmPasswordTextbox.val())) {
                            isValid = false;
                            var errTxt = confirmPasswordTextbox.closest(".input-group").find(".pass-format-err").text();
                            confirmPasswordTextbox.closest(".input-group").find(".error-msg").text(errTxt);
                            passwordTextbox.closest(".input-group").find(".error-msg").text(errTxt);

                            passwordTextbox.closest(".form-group").addClass("has-error");
                            confirmPasswordTextbox.closest(".form-group").addClass("has-error");
                        } else {
                            passwordTextbox.closest(".form-group").removeClass("has-error")
                            confirmPasswordTextbox.closest(".form-group").removeClass("has-error")
                        }
                    }
                }
            }
            if (isValid) {

                if ($(this).hasClass("last")) {
                    if (acceptedTerms() || $("#cAction").val() == "RetailerRegister") {
                        postRegistration();
                    }
                    else {
                        jQuery(".error-msg").show();
                    }
                    return;
                }
                if ($(this).hasClass("last-upgrade-coord")) {
                    if (acceptedTerms()) {
                        postUpgradeCoordinator();
                    }
                    else {
                        jQuery(".error-msg").show();
                    }
                    return;
                }


                if (!$(this).hasClass("final-step-btn")) {
                    jQuery(".step-content").hide();
                    jQuery(".step-content[data-step='" + nextStep + "']").show();
                    nextStepWizard.removeAttr('disabled').trigger('click');
                }
                else {
                    jQuery(".sign-up-container").hide();
                    jQuery(".submit-container").show();
                }
            }
        });

        function acceptedTerms() {
            return (($(".accept-terms").length > 0 && jQuery(".accept-terms").is(':checked')) || $(".accept-terms").length == 0);
        }

        function postUpgradeCoordinator() {
            $.post("/UpgradeToCoordinator/UpgradeTo", $("#upgradeCoord").serialize(), function (data) {
                if (status == true) {
                    $(".custom-error").removeClass("show-custom-error");
                    window.location.href = "/";
                } else {
                    $(".custom-error").text(data.message);
                    $(".custom-error").addClass("show-custom-error");
                }
            });
        }

        function postRegistration() {
            var cAction = $("#cAction").val();
            console.log("action: ", cAction);
            $.post("/Registration/" + $("#cAction").val() + window.location.search, $("#registerForm").serialize(), function (data) {
                if (data.status == true) {
                    console.log("status: ", data.status);
                    $(".custom-error").removeClass("show-custom-error");
                    if (cAction == "ConsumerRegister") {
                        window.location.href = "/Consumer Login Page";
                    } else if (cAction == "CoordinatorRegister") {
                        window.location.href = "/Coordinators login";
                    } else if (cAction == "RetailerRegister") {

                        window.location.href = data.redirectUri;
                    }
                } else {
                    $(".custom-error").text(data.message);
                    $(".custom-error").addClass("show-custom-error");
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 404) {
                    var data = jqXHR.responseJSON;
                    if (data.status == true) {
                        $(".custom-error").removeClass("show-custom-error");
                        if (cAction == "ConsumerRegister") {
                            window.location.href = "/Consumer Login Page";
                        } else if (cAction == "CoordinatorRegister") {
                            window.location.href = "/Coordinators login";
                        } else if (cAction == "RetailerRegister") {
                            window.location.href = data.redirectUri;
                        }
                    }
                    else {
                        $(".custom-error").text(data.message);
                        $(".custom-error").addClass("show-custom-error");
                    }
                }
            });
        }
        $("body").on("click", ".upgrade-step .nextBtn", function () {
            var curStep = $(this).closest(".step-content"),
                curStepBtn = curStep.attr("id");
            $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a").removeAttr('disabled').trigger('click');
        });

        $('.getSchools').click(function () {
            var isValid = true;
            var curStep = $(this).closest(".step-content"),
                curInputs = curStep.find("input[type='text'],input[type='url'], input[type='email'], input[type='password']");
            $(".form-group").removeClass("has-error");
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

        $('.schoolBack').on('click', function (e) {
            e.preventDefault();
            $(".schoolBack").parents('.step-content').removeClass('show-school-container');
        });

        $('div.setup-panel div a.active-step, div.setup-panel div .active-stepwizard').trigger('click');

        // Custom Modal
        $('.details-td').on('click', function (e) {
            e.preventDefault();
            var submissionId = $(this).data("id");
            $(".modal-content").empty();

            jQuery.get(
                "/SchoolSubmission/GetSubmission?submId=" + submissionId, function (data) {
                    $('.get-details-modal').addClass('is-visible');
                    $(".modal-content").html(data);
                });
        });
        $('.question-help').on('click', function (e) {
            e.preventDefault();
            $('.help-modal').addClass('is-visible');
        });
        $('.modal-close').on('click', function (e) {
            e.preventDefault();
            $('.modal').removeClass('is-visible');
            $('body').removeClass('modal-open');
        });
        $('.school-modal').on('click', function (e) {
            e.preventDefault();

            if ($("#text").val() === null || $("#text").val().match(/^ *$/) !== null) {
                $(".school-form .error-msg").removeClass("hidden");
                $(".school-form .form-group").addClass("form-error");
            } else {
                $(".school-form .error-msg").addClass("hidden");
                $(".school-form .form-group").removeClass("form-error");

                getSchools();
            }
            $('.modal').addClass('is-visible');
            $('body').addClass('modal-open');
        });
        $('.accountBack').on('click', function (e) {
            e.preventDefault();
            $('.modal').removeClass('is-visible');
            $('body').addClass('modal-open');
        });

        // Edit User Infoadd-store-btn
        $('.edit-btn').on('click', function () {
            var oldFirstName;
            var oldLastName;
            var oldZipCode;
            var oldBirthDate;
            var isValid = true;
            var fnSelector = $("#consAccFirstName");
            var lnSelector = $("#consAccLastName");
            var zcSelector = $("#consAccZipCode");
            var bdSelector = $("#consAccBirthDate");

            if ($(this).parents('.account-item-content').hasClass('edit-user')) {

                $(".edit-btn").text("EDIT");
                var firstName = fnSelector.val();
                var lastName = lnSelector.val();
                var zipCode = zcSelector.val();
                var birthDate = bdSelector.val();
                var obj = {};

                obj["FirstName"] = firstName;
                obj["LastName"] = lastName;
                obj["ZipCode"] = zipCode;
                obj["BirthDate"] = birthDate;

                $.post("/Account/UpdateUserInfo", obj, function (data) {

                    fnSelector.attr("placeholder", data.data["FirstName"]);
                    fnSelector.val("");

                    lnSelector.attr("placeholder", data.data["LastName"]);
                    lnSelector.val("");

                    zcSelector.attr("placeholder", data.data["ZipCode"]);
                    zcSelector.val("");

                    bdSelector.attr("placeholder", data.data["BirthDate"]);
                    bdSelector.val("");

                    oldFirstName = data["FirstName"];
                    oldLastName = data["LastName"];
                    oldZipCode = data["ZipCode"];
                    oldBirthDate = data["BirthDate"];
                });

            } else {

                $(".edit-btn").text("UPDATE");

                fnSelector.attr("value", fnSelector.attr("placeholder"));
                lnSelector.attr("value", lnSelector.attr("placeholder"));
                zcSelector.attr("value", zcSelector.attr("placeholder"));
                bdSelector.attr("value", bdSelector.attr("placeholder"));
                oldFirstName = fnSelector.attr("placeholder");
                oldLastName = lnSelector.attr("placeholder");
                oldZipCode = zcSelector.attr("placeholder");
                oldBirthDate = bdSelector.attr("placeholder");
            }

            $(this).parents('.account-item-content').toggleClass('edit-user');
        });
        //Search school on the Accounts page
        $(".accounts-select-schools").on("click", ".nextBtn", function (e) {
            e.preventDefault();
            var schoolId = $(this).data("schoolid");
            var schoolName = $(this).data("schoolname");
            $('.modal').removeClass('is-visible');
            $('body').removeClass('modal-open');


            $.post("/Account/ChangeSchool", { SchoolId: schoolId, SchoolName: schoolName }, function (data) {
                $("#suppSchool").text(data.schoolName);
            });
        });

        //Email Preference
        $("#ep-update-btn").on("click", function (e) {
            e.preventDefault();
            $.post("/Account/UpdateEmailPreference", { subscribed: $("#ep-checkbox").is(":checked") }, function (data) { });
        });

        // Add Store
        $('.add-store-btn').on('click', function () {
            $('.link-container').addClass('add-link-account');
        });

        //Add/Remove Account Coordinator
        $('.close-add-coord-container').on('click', function () {
            $(this).parents('.add-coord-container').removeClass('show-coordinatior-account');
        });
        $('.add-coordinator-btn').on('click', function () {
            $('.add-coord-container').addClass('show-coordinatior-account');
        });

        $('.close-remove-container').on('click', function () {
            $(this).parents('.remove-tr').removeClass('show-remove');
        });
        $('.remove-coord').on('click', function () {
            $(this).parent().next().addClass('show-remove');
        });
    });

    function getSchools() {
        var text = $("#text").val();
        $(".school-removal").remove();
        $.get("/Registration/searchschools?keyword=" + text, function (data) {
            var htmlData = "";

            if (data.list.length == 0) {
                htmlData += "<h3 class='school-removal'>No schools matched your search term.</h3>"
            } else {
                for (var i = 0; i < data.list.length; i++) {

                    htmlData += "<div class='school-select school-removal'>" + "<span>" + data.list[i].SchoolName + "</span>" + "<p>" + data.list[i].Address + "</p>" + "<p>" + data.list[i].City + "," + data.list[i].State + " " + data.list[i].ZipCode + "</p>" + "<button class='nextBtn' type='button' data-schoolId='" + data.list[i].GmilId + "' data-schoolName='" + data.list[i].SchoolName + "'>SELECT THIS SCHOOL</button>" + "</div >";
                }
            }
            if (!$("#text").hasClass("registerPage")) {
                $("#text").val("");
            }
            if ($(".school-select-container").hasClass("register-select-schools")) {
                $(".school-select-container").prepend(htmlData);
            } else {
                $(".school-select-container").append(htmlData);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 404) {
                var data = jqXHR.responseJSON;
                console.log(data);
                if (data.list.length == 0) {
                    return false;
                }
                var htmlData = "";
                for (var i = 0; i < data.list.length; i++) {

                    htmlData += "<div class='school-select'>" + "<span>" + data.list[i].SchoolName + "</span>" + "<p>" + data.list[i].Address + "</p>" + "<p>" + data.list[i].City + "," + data.list[i].State + " " + data.list[i].ZipCode + "</p>" + "<button class='nextBtn' type='button' data-schoolId='" + data.list[i].GmilId + "' data-schoolName='" + data.list[i].SchoolName + "'>SELECT THIS SCHOOL</button>" + "</div >";
                }
                if (!$("#text").hasClass("registerPage")) {
                    $("#text").val("");
                }

                if ($(".school-select-container").hasClass("register-select-schools")) {
                    $(".school-select-container").prepend(htmlData);
                } else {
                    $(".school-select-container").append(htmlData);
                }
            }
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
    //Get Started Coordinators
    $("#getStartedChk").on("click", function (e) {
        e.preventDefault();
        $.post("/Account/UpdateEmailPreference", { subscribed: $(this).is(":checked") }, function (data) {
            console.log("Data: ", data);
        });
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
        this.$el = jQuery(gallery);
        this.$feeder = this.$el.find('.video-gallery-feeder');
        this.$cards = this.$el.find('.video-gallery-card');
        this.$viewport = this.$el.find('.video-gallery-viewport');
        this.$iframes = this.$el.find('iframe');
        this.index = 0;

        this.$feeder.on('click', this.onFeederClick.bind(this));
        this.$cards.on('click', this.onCardClick.bind(this));

        this.$el.find('.video-gallery-viewport-close').on('click', this.closePlayer.bind(this));
    }

    /**
     * Handle the "Load More" click.
     * 
     * @param {jQuery.Event} event
     */
    View.prototype.onFeederClick = function (event) {
        event.preventDefault();

        this.index += 1;

        this.getWrapperByIndex(this.index).addClass('feature-item-wrap--visible');

        if (!this.getWrapperByIndex(this.index + 1).get(0)) {
            this.$feeder.hide();
        }
    };

    /**
     * Handle the "Card Thumbnail" click.
     * 
     * @param {jQuery.Event} event
     */
    View.prototype.onCardClick = function (event) {
        event.preventDefault();

        var $card = jQuery(event.currentTarget);
        var $player = jQuery("#" + $card.attr('data-player'));

        if ($card.data('open')) {
            return;
        }

        this.closePlayer();

        $card.data('open', true).toggleClass('video-gallery-card--open', true);
        $player.toggleClass('video-gallery-viewport--open', true);

        var offset = $player.offset();
        var scrollTopGap = Util.isOnMobile() ? 120 : 160;

        jQuery('html, body').animate({
            scrollTop: offset.top - scrollTopGap
        }, 500);
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
        this.$cards.data('open', false).toggleClass('video-gallery-card--open', false);
        this.$viewport.toggleClass('video-gallery-viewport--open', false);

        this.$iframes.each(function () {
            this.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        });
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
        isOnMobile: function isOnMobile() {
            return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i);
        }
    };

    //
    // Initialize

    jQuery(document).ready(function () {
        jQuery('.video-gallery').each(function (index, gallery) {
            return new View(gallery);
        });
    });

    searchIcon.on("click", function () {
        DoSearch();
    });

    searchTextBox.keydown(function (e) {
        if (e.keyCode == 13) {
            DoSearch();
        }
    });

    var DoSearch = function DoSearch() {
        if (!isEmptyOrSpaces(searchTextBox.val())) {
            location.href = "/search?q=" + searchTextBox.val();
        }
    };

    function isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
    }

    /*Search Ajax*/

    sortBySelect.on("change", function () {
        searchManager.DoSorting();
    });

    showMoreButton.on("click", function () {
        searchManager.ShowMore();
    });

    var searchManager = {
        DoSorting: function DoSorting() {
            skipField.val(0);
            jQuery(".search-result-item-container").html("");
            this.fetchResults();
        },
        ShowMore: function ShowMore() {
            var temp = parseInt(skipField.val()) + 1;
            skipField.val(temp);
            this.fetchResults();
        },
        fetchResults: function fetchResults() {
            var term = searchTerm.val();
            var skip = skipField.val();
            var pId = searchPageId.val();
            var sortBy = sortBySelect.val();
            jQuery.get("/search/getsearchresults?pageid=" + pId + "&term=" + term + "&sortby=" + sortBy + "&skip=" + skip, function (data) {

                if (data.HideShowMoreButton) {
                    showMoreButton.addClass("hidden");
                } else {
                    showMoreButton.removeClass("hidden");
                }
                var html = jQuery(".search-result-item-container").html();
                for (var i = 0; i < data.Results.length; i++) {
                    html += searchManager.buildHtml(data.Results[i]);
                }
                jQuery(".search-result-item-container").html(html);
            });
        },
        buildHtml: function buildHtml(data) {
            var elementHtml = '<div class="search-result-item">';
            elementHtml += '<a href="' + data.Url + '">';
            elementHtml += '<span>' + data.Title + '</span>';
            elementHtml += '<p>' + data.Description + '</p></a></div>';
            return elementHtml;
        }
    };

    function setInputFilter(textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
            textbox.addEventListener(event, function () {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                }
            });
        });
    }

    if (totalBonus.length > 0 && totalClips.length > 0) {
        setInputFilter(document.getElementById("TotalClips"), function (value) {
            return (/^\d*$/.test(value)
            );
        });

        setInputFilter(document.getElementById("TotalBonus"), function (value) {
            return (/^\d*$/.test(value)
            );
        });
    }

    firstStepButton.on("click", function () {
        changeStep();
    });

    secondStepButton.on("click", function () {
        if (jQuery(this).data("editmode") == "True") {
            changeStep();
        }
        else {
            jQuery.post(
                "/form/insertsubmission",
                {
                    clipsAmount: totalClips.val(),
                    bonusAmount: totalBonus.val()
                },
                function (data) {
                    if (data.success == true) {
                        jQuery(".submissionNumber").text(data.submissionId);
                        changeStep();
                    }
                    else {
                        alert("Something went wrong please try again later");
                    }
                })
        }
    });

    function changeStep() {
        var current = jQuery('.current'),
            next = jQuery('.current').next('div');
        current.removeClass('current').addClass('filled');
        next.removeClass('empty').addClass('current');
    }

    totalClips.on("keyup", function (e) {
        CalculateClips();
        CalculateAll();
    });

    totalBonus.bind("keyup", function (e) {
        CalculateBonus();
        CalculateAll();
    });

    function CalculateClips() {
        if (isEmptyOrSpaces(totalClips.val())) {
            jQuery(".calculatedClips").text("0.00");
            jQuery(".enteredClips").text(0);
        } else {
            jQuery(".enteredClips").text(totalClips.val());
            var multipleBy = parseFloat(jQuery(".clipsMultipleWith").text());
            jQuery(".calculatedClips").text((multipleBy * totalClips.val()).toFixed(2));
        }
    }

    function CalculateBonus() {
        if (isEmptyOrSpaces(totalBonus.val())) {
            jQuery(".calculatedBonus").text("0.00");
            jQuery(".enteredBonus").text(0);
        } else {
            jQuery(".enteredBonus").text(totalBonus.val());
            var multipleBy = parseFloat(jQuery(".bonusMultipleWith").text());
            jQuery(".calculatedBonus").text((multipleBy * totalBonus.val()).toFixed(2));
        }
    }

    function CalculateAll() {
        var calculatedBonus = parseFloat(jQuery(".calculatedBonus").text());
        var calculatedClips = parseFloat(jQuery(".calculatedClips").text());
        jQuery(".totalAmmount").text((calculatedBonus + calculatedClips).toFixed(2));
    }

    generatePdfButton.on("click", function () {
        downloadURI("/form/generatepdf?noOfBonusBoxtopsRequested=" + totalBonus.val() +
            "&noOfBoxtopsRequested=" + totalClips.val() +
            "&bonusMultiplyWith=" + parseFloat(jQuery(".bonusMultipleWith").text()) +
            "&clipsMultiplyWith=" + parseFloat(jQuery(".clipsMultipleWith").text()) +
            "&submissionId=" + jQuery(".submissionNumber").text());
    });

    function downloadURI(uri) {
        jQuery.get(uri, function (data) {
            if (data.success != "false") {
                var link = document.createElement("a");
                link.download = "";
                link.href = uri;
                link.click();
            } else {
                alert("Something went wrong please try again later");
            }
        });
    }

    jQuery(".cookie-btn").on("click", function (e) {
        e.preventDefault();
        if (jQuery(".acceptTerms").is(":checked")) {
            jQuery.get("/cookie/setcookie?token=" + jQuery(".token").val() + "&email=" + jQuery("#login-email").val() + "&type=" + jQuery(".type").val(), function (data) {
                if (data.success) {
                    window.location.href = jQuery(".redirectUrl").val();
                }
                else {
                    jQuery(".error-msg").css("display", "block");
                }
            });
        }
        else {
            jQuery(".error-msg").css("display", "block");
        }

    });

})(jQuery);

