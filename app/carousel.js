/*
 *   Swiper should be replaced first as a part of proper optimisation
 * */
import './../node_modules/swiper/dist/js/swiper.min.js'

let initCarousel = (images, slidersContainer) => {

    for (let i = 0; i < images.length; i++) {
        let img = images[i];
        let swiperSlideDiv = document.createElement('div');
        let imageDiv = document.createElement('div');

        imageDiv.style.backgroundImage = 'url(' + img.src + ')';

        swiperSlideDiv.classList.add('swiper-slide');
        swiperSlideDiv.appendChild(imageDiv);


        slidersContainer.appendChild(swiperSlideDiv);
    }


    /*
     *   Init Swiper
     * */
    let swiper = new Swiper('.swiper-container', {
        // Optional parameters
        direction : 'horizontal',
        loop : true,

        // And if we need scrollbar
        // scrollbar : '.swiper-scrollbar',
        initialSlide : 0,
        // slidesPerView: 2,
        // Not sure why is that
        autoplay : 800,
        freeModeFluid : true,
        freeMode : true,
        speed : 2000
    });

    // window.swiper = swiper

    // setInterval(() => {
    //     console.log('here')
    //
    //     console.log(swiper)
    //
    // }, 10000)

};

export {initCarousel};
