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
        direction : 'horizontal',
        loop : true,
        initialSlide : 0,
        // slidesPerView: 2,
        autoplay : 800,
        freeModeFluid : true,
        freeMode : true,
        speed : 2000
    });

};

export {initCarousel};
