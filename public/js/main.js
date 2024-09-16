;(function () {

    'use strict';

    var mobileMenuOutsideClick = function () {

        $(document).click(function (e) {
            var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ($('body').hasClass('offcanvas')) {

                    $('body').removeClass('offcanvas');
                    $('.js-fh5co-nav-toggle').removeClass('active');
                }
            }
        });

    };


    var offcanvasMenu = function () {

        $('#page').prepend('<div id="fh5co-offcanvas" class="fh5co-offcanvas" />');
        $('#page').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle fh5co-nav-white"><i></i></a>');
        var clone1 = $('.menu-1 > ul').clone();
        $('#fh5co-offcanvas').append(clone1);
        var clone2 = $('.menu-2 > ul').clone();
        $('#fh5co-offcanvas').append(clone2);

        $('#fh5co-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown');
        $('#fh5co-offcanvas')
            .find('li')
            .removeClass('has-dropdown');

        // Hover dropdown menu on mobile
        $('.offcanvas-has-dropdown').mouseenter(function () {
            var $this = $(this);

            $this
                .addClass('active')
                .find('ul')
                .slideDown(500, 'easeOutExpo');
        }).mouseleave(function () {

            var $this = $(this);
            $this
                .removeClass('active')
                .find('ul')
                .slideUp(500, 'easeOutExpo');
        });


        $(window).resize(function () {

            if ($('body').hasClass('offcanvas')) {

                $('body').removeClass('offcanvas');
                $('.js-fh5co-nav-toggle').removeClass('active');

            }
        });
    };


    var burgerMenu = function () {

        $('body').on('click', '.js-fh5co-nav-toggle', function (event) {
            var $this = $(this);


            if ($('body').hasClass('overflow offcanvas')) {
                $('body').removeClass('overflow offcanvas');
            } else {
                $('body').addClass('overflow offcanvas');
            }
            $this.toggleClass('active');
            event.preventDefault();

        });
    };


    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('animated-fast')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            var effect = el.data('animate-effect');
                            if (effect === 'fadeIn') {
                                el.addClass('fadeIn animated-fast');
                            } else if (effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft animated-fast');
                            } else if (effect === 'fadeInRight') {
                                el.addClass('fadeInRight animated-fast');
                            } else {
                                el.addClass('fadeInUp animated-fast');
                            }

                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });

                }, 100);

            }

        }, {offset: '85%'});
    };


    var dropdown = function () {

        $('.has-dropdown').mouseenter(function () {

            var $this = $(this);
            $this
                .find('.dropdown')
                .css('display', 'block')
                .addClass('animated-fast fadeInUpMenu');

        }).mouseleave(function () {
            var $this = $(this);

            $this
                .find('.dropdown')
                .css('display', 'none')
                .removeClass('animated-fast fadeInUpMenu');
        });

    };


    var testimonialCarousel = function () {
        var owl = $('.owl-carousel-fullwidth');
        if (owl) {
            owl.owlCarousel({
                items: 1,
                loop: true,
                margin: 0,
                responsiveClass: true,
                nav: false,
                dots: true,
                smartSpeed: 800,
                autoHeight: true,
            });
        }
    };


    var goToTop = function () {

        $('.js-gotop').on('click', function (event) {

            event.preventDefault();

            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500, 'easeInOutExpo');

            return false;
        });

        $(window).scroll(function () {
            var $win = $(window);
            mobileMenuOutsideClick();
            contentWayPoint();
            if ($win.scrollTop() > 200) {
                $('.js-top').addClass('active');
            } else {
                $('.js-top').removeClass('active');
            }
        });

    };
    var activeTabWhenCLick = function () {
        $('.menu-1 li').on('click', function (event) {
            event.preventDefault();

            // Get the class name from the clicked <li>
            var className = $(this).attr('class').split(' ')[0]; // Split to handle multiple classes if present

            if (className !== 'logout') {
                // Remove 'active' class from all <li> elements
                $('.menu-1 li').removeClass('active');
                // Add 'active' class to the clicked <li>
                $(this).addClass('active');
                // Scroll to the element with the ID matching the class name
                $('html, body').animate({
                    scrollTop: $('#' + className).offset().top
                }, 500, 'easeInOutExpo');
            }  else {
                //add alert if user want to logout, yes or no
                var r = confirm("Are you sure you want to logout?");
                if (r === true) {
                    sessionStorage.clear();
                    window.location = '/';
                }
            }


            return false;
        });
        $('.fh5co-offcanvas li').on('click', function (event) {
            event.preventDefault();
            // Get the class name from the clicked <li>
            var className = $(this).attr('class').split(' ')[0]; // Split to handle multiple classes if present


            // Scroll to the element with the ID matching the class name
            if (className !== 'logout') {
                // Remove 'active' class from all <li> elements
                $('.fh5co-offcanvas li').removeClass('active');

                // Add 'active' class to the clicked <li>
                $(this).addClass('active');
                $('html, body').animate({
                    scrollTop: $('#' + className).offset().top
                }, 500, 'easeInOutExpo');
            } else {
                //add alert if user want to logout, yes or no
                var r = confirm("Are you sure you want to logout?");
                if (r === true) {
                    sessionStorage.clear();
                    window.location = '/';
                }
            }

            return false;
        });
    };
    var activeTabWhenScroll = function () {
        $(window).on('scroll', function () {
            var scrollPosition = $(window).scrollTop();

            $('.menu-1 li').each(function () {
                var className = $(this).attr('class').split(' ')[0];
                var section = $('#' + className);

                if (section.length) {
                    var sectionOffset = section.offset().top;
                    var sectionHeight = section.outerHeight();

                    if (scrollPosition >= sectionOffset - 50 && scrollPosition < sectionOffset + sectionHeight - 50) {
                        // $('.menu-1 li').removeClass('active');
                        // $(this).addClass('active');
                    }
                }
            });

            $('.fh5co-offcanvas ul li').each(function () {
                var className = $(this).attr('class').split(' ')[0];
                var section = $('#' + className);

                if (section.length) {
                    var sectionOffset = section.offset().top;
                    var sectionHeight = section.outerHeight();

                    if (scrollPosition >= sectionOffset - 50 && scrollPosition < sectionOffset + sectionHeight - 50) {
                        // $('.fh5co-offcanvas ul li').removeClass('active');
                        // $(this).addClass('active');
                    }
                }
            });
        });


    }

    // Loading page
    var loaderPage = function () {
        $('.fh5co-loader').fadeOut('slow');
    };

    var counter = function () {
        $('.js-counter').countTo({
            formatter: function (value, options) {
                return value.toFixed(options.decimals);
            },
        });
    };

    var counterWayPoint = function () {
        if ($('#fh5co-counter').length > 0) {
            $('#fh5co-counter').waypoint(function (direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {
                    setTimeout(counter, 400);
                    $(this.element).addClass('animated');
                }
            }, {offset: '90%'});
        }
    };

    // Parallax
    var parallax = function () {
        $(window).stellar();
    };

    var countdown = function () {
        var d = new Date(new Date().getTime() + 200 * 120 * 120 * 2000);

        // default example
        simplyCountdown('.simply-countdown-one', {
            year: 2024,
            month: 9,
            day: 22
        });
    }

    var handleScroll = function () {
        var $nav = $('.fh5co-nav'); // Replace with your actual navigation class or ID
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) { // Change 100 to the scroll position where you want to apply the class
                $nav.addClass('fh5co-nav-scrolled');
                $('.fh5co-nav-toggle').addClass('fh5co-nav-toggle-scrolled');
            } else {
                $nav.removeClass('fh5co-nav-scrolled');
                $('.fh5co-nav-toggle').removeClass('fh5co-nav-toggle-scrolled');
            }
        });
    };


    $(function () {
        setTimeout(function () {
            mobileMenuOutsideClick();
            parallax();
            offcanvasMenu();
            burgerMenu();
            contentWayPoint();
            dropdown();
            testimonialCarousel();
            goToTop();
            loaderPage();
            counter();
            counterWayPoint();
            countdown();
            handleScroll();
            activeTabWhenScroll();
            activeTabWhenCLick();
        }, 1000)
    });


}());