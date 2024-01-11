let audio = new Audio('../sound/ping.mp3');
class ButtonLoader {
    pressTimer;
    sizeGainer;
    hold;
    pressed;
    /**
     * 
     * @param {HTMLButtonElement} element Button for Action
     * @param {Number} pressDuration Press duration in ms
     * @param {Function} action1 Function for long press Action
     * @param {Function} action2 Function for click Action
     * @param {String} className Class toggle on click Element
     */
    constructor(element, pressDuration, action1, action2, className) {
        console.log(action1);
        console.log(action2);
        this.button = element;
        this.action1 = action1;
        this.action2 = action2;
        this.className = className;
        this.hold = false;
        this.pressed = false;
        this.pressDuration = pressDuration;
        this.#loadListeners();
    }
    #loadListeners() {
        this.button.addEventListener('mousedown', this.#startPress.bind(this));
        this.button.addEventListener('mouseup', this.#endPress.bind(this));
        this.button.addEventListener('mousemove', this.#endPress.bind(this));
        //For mobiles
        this.button.addEventListener('touchstart', this.#startPress.bind(this));
        this.button.addEventListener('touchend', this.#endPress.bind(this));
    }
    #startPress(e) {
        e.preventDefault();
        this.pressed = true;

        let intialScale = 1;
        this.sizeGainer = setInterval(() => {
            this.button.style.transform = `scale(${intialScale})`;
            intialScale += 0.02
        }, 100);

        this.pressTimer = setTimeout(() => {
            this.hold = true;
            clearInterval(this.sizeGainer);
            this.button.style.transform = 'scale(1)';
            if (navigator.vibrate)
                navigator.vibrate([200]);
            audio.play();
            this.action1();
        }, this.pressDuration);
    }

    #endPress() {
        if (this.pressed) {
            this.pressed = false;
            this.button.style.transform = 'scale(1)';
            clearInterval(this.sizeGainer);
            clearTimeout(this.pressTimer);
            if (!this.hold) {
                this.#handleClick();
            }
            this.hold = false;
        }
    }

    #handleClick() {
        this.button.style.transform = 'scale(1)';
        clearInterval(this.sizeGainer);
        clearTimeout(this.pressTimer);
        this.action2();
        this.button.classList.toggle(this.className);
    }
}

export default ButtonLoader;