let initGiftScreen = (giftBox, giftScreen) => {
    giftScreen.classList.add('weather', 'rain');

    /*
     *   TODO: handle it via events
     * */
    setTimeout(() => {
        giftBox.classList.remove('hidden');
        giftBox.classList.add('visible', 'shake');
    }, 2000);


    giftBox.onclick = () => {
        giftBox.src = DOMElements.giftBoxOpened.src;
        giftBox.classList.remove('shake');
        giftBox.onclick = () => {
        };

        setTimeout(() => {
            DOMElements.giftScreen.style.display = 'none';

            setTimeout(() => {
                DOMElements.slidersContainer.offsetParent.classList.remove('hidden');
                DOMElements.slidersContainer.offsetParent.classList.add('visible');
            }, 1000)
        }, 1000);

        document.body.classList.add('sunny-day');

    };

    giftBox.alt = 'Test your luck and look inside the box';
    giftBox.classList.add('gift', 'hidden');

    document.body.appendChild(giftBox);

};


export {initGiftScreen}
