// performs parallax effect on all layers of hero section
function doParallaxHero() {
    var top = this.pageYOffset;

    var layers = document.getElementsByClassName("hero-art-layer");
    var layer, speed, yPos;
    for (var i = layers.length - 1; i >= 0; i--) {
        layer = layers[i];
        speed = layer.getAttribute('data-speed');

        if (speed == "100") continue; // skip if speed is 100

        var yPos = -(top * speed / 100);
        layer.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');

    }
}

// are we currently within the scroll range of the museum section
let withinMuseumScrollRange = false;

// does museum scroll effect based on scroll position
function doMuseumScroll() { 
    if (window.innerWidth < 900)  { // don't do on mobile
        $("#museumSlide2Container").css("left", `0`); // reset
        $("#museumSlide2Container").css("margin-left", `0`);

        return;
    }

    const museumSlideStickyThreshold = $("#museumSlide1").height() / 8; // number of pixels to scroll before allowing museum slide to move

    const currentScrollPosition = this.pageYOffset; // current offset from top
    const museumScrollHeight = $("#museumSlide1").height() - museumSlideStickyThreshold - museumSlideStickyThreshold; // subtract beginning and end sticky threshold
    const museumScrollWidth = $("#museumSlide1").width();
    const museumScrollTop = $("#museumSlide1").offset().top + museumSlideStickyThreshold; // offset of museum section from top

    // values without sticky threshold
    const museumScrollHeightNoSticky = $("#museumSlide1").height();
    const museumScrollTopNoSticky = $("#museumSlide1").offset().top;

    // calculate scroll position and adjust for bounds
    let horizontalScrollPosition = museumScrollWidth * ((currentScrollPosition - museumScrollTop) / (museumScrollHeight - $(window).height()));
    horizontalScrollPosition = Math.min(horizontalScrollPosition, museumScrollWidth);
    horizontalScrollPosition = Math.min(horizontalScrollPosition * -1, 0);

    // do minecart movement without sticky thresholds
    let minecartScrollWidth = (museumScrollWidth - $("#museumMinecart").outerWidth() - $("#museumChest img").outerWidth()); // amount that minecart can move
    let horizontalScrollNoSticky = minecartScrollWidth * ((currentScrollPosition - museumScrollTopNoSticky) / (museumScrollHeightNoSticky - $(window).height()));
    horizontalScrollNoSticky = Math.min(horizontalScrollNoSticky, minecartScrollWidth);
    horizontalScrollNoSticky = Math.min(horizontalScrollNoSticky * -1, 0);
    $("#museumMinecart").css("transform", `translateX(${(horizontalScrollNoSticky * (-100) / 100)}px)`);

    if (horizontalScrollNoSticky == minecartScrollWidth * -1 || horizontalScrollNoSticky == 0) withinMuseumScrollRange = true; // we are within the scroll range of museum section
    else withinMuseumScrollRange = false;

    // do parallax
    const layers = document.getElementsByClassName("museum-art-layer");
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var speed = layer.getAttribute('data-speed-x');
        var xPos = (horizontalScrollPosition * speed / 100);

        layer.setAttribute('style', `transform: translateX(${xPos}px)`);
    }
    $("#museumSlide2Container").css("left", `-20%`); // center museum slide 2

    // prevent slide content from overlapping middle pillar
    if ($("#museumSlideImage1").offset().left + $("#museumSlideImage1").width() >= $("#museumParallax1 > #museumLayer1").offset().left + $("#museumParallax1 > #museumLayer1").width()) {
        const overlapAmount = ($("#museumSlideImage1").offset().left + $("#museumSlideImage1").width()) - ($("#museumParallax1 > #museumLayer1").offset().left + $("#museumParallax1 > #museumLayer1").width());
        let clipAmount = $("#museumSlideImage1").width() - overlapAmount;
        $("#museumSlideImage1").css("clip-path", `polygon(0 0, ${clipAmount}px 0, ${clipAmount}px 100%, 0 100%)`); // hide right side of video that overlaps
    }
    else {
        $("#museumSlideImage1").css("clip-path", `none`); // show video
    }

    if ($("#museumSlideDescription2").offset().left <= $("#museumParallax2 > #museumLayer1").offset().left) {
        let overlapAmount = $("#museumParallax2 > #museumLayer1").offset().left - $("#museumSlideDescription2").offset().left;
        $("#museumSlideDescription2").css("clip-path", `polygon(${overlapAmount}px 0%, 100% 0, 100% 100%, ${overlapAmount}px 100%)`); // hide left side of video that overlaps
    }
    else {
        $("#museumSlideDescription2").css("clip-path", `none`); // show text
    }

    // $("#museumSlides").css("transform", `translateX(${horizontalScrollPosition}px)`);

}

// plays treasure chest gif and stop at last frame
async function playTreasureChest() {
    if ($("#treasureChestImage").attr("src") != "/assets/chest/chestClosed.png") return; // already started

    $("#treasureChestImage").attr("src", "/assets/chest/chestClosed.png"); // closed
    $("#treasureChestImage").attr("src", "/assets/chest/chestOpen.gif"); // opening

    await new Promise (resolve => setTimeout(resolve, 2400));

    $("#treasureChestImage").attr("src", "/assets/chest/chestIdle.gif"); // open
}

// resets treasure chest to frame 1
function resetTreasureChest() {
    $("#treasureChestImage").attr("src", "/assets/chest/chestClosed.png");
}

// does treasure chest animation
async function doTreasureChestAnimation() {
    playTreasureChest();
}

// hide mobile nav menu 
//async function hideMobileNav() {
   
// show mobile nav menu
async function showMobileNav() {
    $(".nav-mobile-links").css("display", "flex");

    var mobileNav = $(".nav-mobile-overlay");
    mobileNav.css("display", "block");
    await new Promise (resolve => setTimeout(resolve, 10)); // give time for display to be set
    mobileNav.removeClass("hide");
    mobileNav.addClass("show");
}
$(() => { // on page load
    // mobile remove videos
    if (window.innerWidth <= 600) {
        
    }

    // reset x scroll
    window.scrollTo(0, window.pageYOffset)

    if (window.innerWidth < 900) { // skip chest opening animation on mobile
        $("#treasureChestImage").attr("src", "/assets/chest/mobileIdle.gif");
    }

    // hamburger menu listener
    $('#menu-toggle').on('change', function() {
        if ($(this).is(':checked')) {
            showMobileNav();
        }
        else {
            hideMobileNav();
        }
    });

    // do treasure chest animation if token section is in view
    if (window.innerWidth >= 900 && window.pageYOffset + 200 > $("#tokenSection").offset().top) {
        doTreasureChestAnimation();
    }
    doMuseumScroll(); // initial museum scroll
    doParallaxHero(); // initial parallax (if user is not at top of page)

    // scroll listener
    let isScrolling = false;
    window.addEventListener("scroll", function (event) {
        isScrolling = true;

        doParallaxHero(); // parallax effect for hero art on scroll

        // do museum horizontal scroll
        doMuseumScroll();
        
        // do treasure chest animation if token section is in view
        if (window.innerWidth >= 900 && window.pageYOffset + 200 > $("#tokenSection").offset().top) {
            doTreasureChestAnimation();
        }
    });

    // play minecart gif when scrolling
    if (window.innerWidth >= 900) {
        setInterval(() => {
            if (isScrolling && !withinMuseumScrollRange) {
                isScrolling = false;
                if ($("#museumMinecart").attr("src") != "/assets/museumBg/minecart.gif") 
                    $("#museumMinecart").attr("src", "/assets/museumBg/minecart.gif"); 
            }
            else {
                $("#museumMinecart").attr("src", "/assets/museumBg/minecartStill.png");
            }
        }, 100);
    }
});
