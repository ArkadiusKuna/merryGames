var swiper = new Swiper(".video-games-slider", {
    allowTouchMove: false,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

swiper.on("slideChange", function () {
    let video = document.querySelectorAll(".video-games-slider__video");

    video.forEach(video => {
        video.currentTime = 0;
    })
});