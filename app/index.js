import './scss/_config.scss';
import animate from 'animo-animate';

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

    const data = window.iTunesData,
        name = data.trackName,
        screenShotsUrls = data.screenshotUrls,

        // TODO: In order to support some other resolutions,
        // TODO: make proper decision which art work to download
        // TODO: based on window sizes e.g. for iPad
        gameIcon = data.artworkUrl60, gameUrl = data.trackViewUrl,

        // Specified image[1] for  Cat Room game as a background,
        // image[0] is more generic and goes for other games.
        iPadScreenShotForBackground = data.ipadScreenshotUrls[1] ||
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
        addClass(DOMElements.giftScreen, ['weather', 'rain']);

        image = image[0];
        let imageDiv = document.createElement('div');
        imageDiv.style.backgroundImage = 'url(' + image.src + ')';
        DOMElements.giftBox = imageDiv;

        DOMElements.giftBox.alt = 'Test your luck and look inside the box';
        addClass(DOMElements.giftBox, ['gift', 'hidden', 'animate']);

        document.body.appendChild(DOMElements.giftBox);

        animate(DOMElements.spinner, {
            classNames : ['hidden'],
            keep : true
        }).then(() => {
            fadeIn(DOMElements.giftBox).then(() => {
                DOMElements.giftBox.onclick = giftOnClickHandler;
                animate(DOMElements.giftBox, { classNames : ['shake'] });
            });
        });

        preLoadImages(screenShotsUrls).then((images) => {
            initCarousel(images, DOMElements.slidersContainer);
        });

    });

    preLoadImages([iPadScreenShotForBackground]).then((image) => {
        image = image[0];

        if (typeof image !== 'undefined') {
            insertStyleToHead('body::before{background-image:url(' + image.src + ')');
        }

    });

    preLoadImages([gameIcon]).then((image) => {
        DOMElements.gameIcon = image[0];
        addClass(DOMElements.gameIcon, ['game-icon', 'hidden']);
        document.body.appendChild(DOMElements.gameIcon);
    });

};

let giftOnClickHandler = () => {
    DOMElements.giftBox.classList.remove('shake');

    DOMElements.giftBox.onclick = () => {
    };

    DOMElements.giftBox.style.backgroundImage = 'url(' + DOMElements.kitty.src + ')';

    animate(DOMElements.giftScreen, {
        classNames : ['hidden'],
        keep : true
    }).then(() => {

        animate(DOMElements.giftBox, {
            classNames : ['move-to-bottom'],
            keep : true
        }).then(() => {
            // animate(DOMElements.giftBox, { classNames : ['talk'] });
            DOMElements.giftBox.classList.add('talk');

            insertStyleToHead(
                'body .gift.talk::after{content: "Get ' + document.title + ' now! And receive a FREE bonus.";} ' +
                'body .gift.talk::before{content: "";}'
            );

            DOMElements.giftBox.onclick = () => {
                DOMElements.giftBox.classList.toggle('talk');
            };


        });

        fadeIn(DOMElements.downloadButton);
        fadeIn(DOMElements.gameIcon);
        fadeIn(DOMElements.slidersContainer.offsetParent);
    })
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

let fadeIn = (el) => {
    addClass(el, 'animate');

    removeClass(el, 'hidden');

    return animate(el, { classNames : ['visible'], keep : true });
};


let insertStyleToHead = (innerHtml) => {
    let style = document.createElement('style'),
        head = document.head;

    style.innerHTML = innerHtml;

    head.appendChild(style);
};


let addClass = (el, className) => {
    className = className || [];

    if (typeof className !== 'object') {
        className = [className];
    }

    let cl = el.classList;
    cl.add.apply(cl, className);
};

let removeClass = (el, className) => {
    className = className || [];

    if (typeof className !== 'object') {
        className = [className];
    }

    let cl = el.classList;
    cl.remove.apply(cl, className);
};

/*
 *   Waiting for iTunesRequestPromise, once it is resolved,
 *   we are free to proceed with the actual end screen.
 * */
if (typeof window !== 'undefined' && window.hasOwnProperty('iTunesRequestPromise')) {
    window.iTunesRequestPromise.then(initApp);
}


