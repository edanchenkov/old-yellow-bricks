import './scss/_config.scss';
import {initCarousel} from './carousel';

let DOMElements = {};

/*
 *   Load gift boxes images via loader to know their state
 *   TODO: Make it better
 * */
const giftBox = [
    './images/closed-gift-box.png'
];

const kitty = [
    './images/kitty.png'
];

/*
 *   Prepare end screen to be shown to the user
 * */
let initApp = () => {

    console.info('Running the app', Date.now());

    const data = window.iTunesData;
    const name = data.trackName;
    const screenShotsUrls = data.screenshotUrls;

    // TODO: In order to support some other resolutions,
    // TODO: make proper decision which art work to download
    // TODO: based on window sizes
    const gameIcon = data.artworkUrl60;
    const gameUrl = data.trackViewUrl
        ;

    // Specified image[1] for  Cat Room game,
    // image[0] is more generic and goes for other games.
    const iPadScreenShotForBackground = data.ipadScreenshotUrls[1] ||
        data.ipadScreenshotUrls[0];

    DOMElements.spinner = document.getElementById('spinner');
    DOMElements.slidersContainer = document.getElementsByClassName('swiper-wrapper')[0];
    DOMElements.giftScreen = document.getElementsByClassName('gift-screen-background')[0];
    DOMElements.downloadButton = document.getElementsByClassName('pure-button')[0];


    DOMElements.downloadButton.onclick = () => {
        location.href = gameUrl;
    };

    // Set HTML title
    document.title = name;


    preLoadImages(kitty).then((image) => {
        /*
         This is not used anywhere only src, use giftBox element
         * */
        DOMElements.kitty = image[0];
    });

    preLoadImages(giftBox).then((image) => {
        spinner.classList.add('hidden');
        DOMElements.giftScreen.classList.add('weather', 'rain');

        image = image[0];

        let imageDiv = document.createElement('div');

        imageDiv.style.backgroundImage = 'url(' + image.src + ')';

        DOMElements.giftBox = imageDiv;

        imageDiv.onclick = giftOnClickHandler;
        imageDiv.alt = 'Test your luck and look inside the box';
        imageDiv.classList.add('gift', 'hidden');

        document.body.appendChild(imageDiv);


        /*
        *   TODO : 3 places where you do this!
        * */
        let style = document.createElement('style'),
            head = document.head;

        DOMElements.giftBox.classList.add('talk');
        style.innerHTML = 'body .gift.talk::after{content: "Meow!";}';

        head.appendChild(style);


        /*
         *   TODO: handle it via events
         * */
        setTimeout(() => {
            imageDiv.classList.remove('hidden');
            imageDiv.classList.add('visible', 'shake');
        }, 2000);

        preLoadImages(screenShotsUrls).then((images) => {
            initCarousel(images, DOMElements.slidersContainer);
        });

    });

    preLoadImages([iPadScreenShotForBackground]).then((image) => {
        image = image[0];

        if (typeof image !== 'undefined') {
            let head = document.head
                , style = document.createElement('style');

            style.innerHTML = 'body::before{background-image:url(' + image.src + ')';
            head.appendChild(style);
        }

    });

    preLoadImages([gameIcon]).then((image) => {
        DOMElements.gameIcon = image[0];
        image[0].classList.add('game-icon', 'hidden');
        document.body.appendChild(image[0]);
        // initCarousel(images, DOMElements.slidersContainer);
    });

};

let giftOnClickHandler = () => {
    DOMElements.giftBox.style.backgroundImage = 'url(' + DOMElements.kitty.src + ')';
    DOMElements.giftBox.classList.remove('shake');

    DOMElements.giftBox.onclick = () => {
    };

    setTimeout(() => {
        DOMElements.giftScreen.style.display = 'none';

        DOMElements.giftBox.classList.add('move-to-bottom');
        DOMElements.downloadButton.classList.remove('hidden');
        DOMElements.downloadButton.classList.add('visible');

        DOMElements.gameIcon.classList.remove('hidden');
        DOMElements.gameIcon.classList.add('visible');

        setTimeout(() => {
            DOMElements.slidersContainer.offsetParent.classList.remove('hidden');
            DOMElements.slidersContainer.offsetParent.classList.add('visible');

            /*
             *   Talk animation
             * */

            setTimeout(() => {
                let style = document.createElement('style'),
                    head = document.head;

                DOMElements.giftBox.classList.add('talk');
                style.innerHTML = 'body .gift.talk::after{content: "Get ' + document.title + ' now! And I help you to start.";}';

                head.appendChild(style);
            }, 2000)

        }, 1000)
    }, 1000);

    document.body.classList.add('sunny-day');
};

/*
 *   Preload images from iTunes
 *   @param {Array} urls: Urls of images to be loaded
 *   @return Promise: Promise resolved as an array of images
 * */
let preLoadImages = (urls) => {
    let promises = [];


    for (let data of urls) {

        let url = '';
        let key = '';

        if (typeof data === 'string') {
            url = data;
        }

        if (typeof data === 'object' && Object.keys(data).length) {
            key = Object.keys(data)[0];
            url = data[key];
        }

        if (url.indexOf('.jpeg') !== -1 || url.indexOf('.png') !== -1 || url.indexOf('.jpg') !== -1) {
            let promise = new Promise((resolve, reject) => {
                let image = new Image();
                image.src = url;
                image.onload = () => {

                    let _data;

                    if (key.length) {
                        _data = {};
                        _data[key] = image;
                    } else {
                        _data = image;
                    }

                    resolve(_data)
                };
                image.onerror = () => {
                    /* TODO: Try to recover */
                    reject();
                };

            });
            promises.push(promise);
        }
    }

    return Promise.all(promises)
};

/*
 *   Waiting for iTunesRequestPromise, once it is resolved,
 *   we are free to proceed with the actual end screen.
 * */
if (typeof window !== 'undefined' && window.hasOwnProperty('iTunesRequestPromise')) {
    window.iTunesRequestPromise.then(initApp);
}


