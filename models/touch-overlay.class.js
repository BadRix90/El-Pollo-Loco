class TouchOverlay {


    /**
 * Creates a new TouchOverlay instance.
 * @param {HTMLCanvasElement} canvas - The canvas element used for rendering and interaction.
 * @param {Object} keyboard - The shared keyboard state object to modify based on touch input.
 */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.buttons = [];
        this.disabled = false;

        this.buttons = this.createButtons();
        this.registerTouchEvents();
    }


    /**
 * Defines and returns an array of virtual button configurations
 * with position, size, image, and associated keyboard key.
 * @returns {Object[]} Array of button definitions.
 */
    createButtons() {
        return [
            {
                id: 'left',
                relX: 40,
                relY: -50,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'LEFT'
            },
            {
                id: 'right',
                relX: 100,
                relY: -50,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'RIGHT'
            },
            {
                id: 'jump',
                relX: -100,
                relY: -50,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'SPACE'
            },
            {
                id: 'shoot',
                relX: -160,
                relY: -50,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'q'
            }
        ];
    }


    /**
 * Registers touch and mouse events on the canvas.
 * Handles start, move, end, and cancel events to simulate key presses.
 */
    registerTouchEvents() {
        this.canvas.addEventListener('touchstart', (e) => this.updateTouches(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.updateTouches(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.updateTouches(e));
        this.canvas.addEventListener('touchcancel', (e) => this.updateTouches(e));

        this.canvas.addEventListener('mousedown', (e) => this.handleMouse(e, true));
        this.canvas.addEventListener('mouseup', () => this.resetButtons());
    }


    /**
 * Handles remaining touches when one is removed.
 * Resets all keys and rechecks remaining touches to update active buttons.
 * @param {TouchEvent} e - The touch event.
 */
    handleTouchEnd(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / this.canvas.clientWidth;
        const scaleY = this.canvas.height / this.canvas.clientHeight;

        const remainingTouches = Array.from(e.touches).map(touch => ({
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        }));

        this.buttons.forEach(btn => {
            this.keyboard[btn.key] = false;
        });

        for (const touch of remainingTouches) {
            this.buttons.forEach(btn => {
                const btnX = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX;
                const btnY = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY;

                if (
                    touch.x >= btnX &&
                    touch.x <= btnX + btn.width &&
                    touch.y >= btnY &&
                    touch.y <= btnY + btn.height
                ) {
                    this.keyboard[btn.key] = true;
                }
            });
        }
    }


    /**
 * Handles touchstart and touchmove events.
 * Converts touch coordinates to canvas space and activates matching virtual buttons.
 * @param {TouchEvent} e - The touch event.
 */
    updateTouches(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / this.canvas.clientWidth;
        const scaleY = this.canvas.height / this.canvas.clientHeight;

        this.buttons.forEach(btn => {
            this.keyboard[btn.key] = false;
        });

        for (const touch of e.touches) {
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;

            this.buttons.forEach(btn => {
                const btnX = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX;
                const btnY = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY;

                if (
                    x >= btnX &&
                    x <= btnX + btn.width &&
                    y >= btnY &&
                    y <= btnY + btn.height
                ) {
                    this.keyboard[btn.key] = true;
                }
            });
        }
    }


    /**
 * Handles mouse interaction (e.g., for testing on desktop).
 * Converts click coordinates to canvas space and sets keyboard key state.
 * @param {MouseEvent} e - The mouse event.
 * @param {boolean} isStart - Whether the mouse button is pressed or released.
 */
    handleMouse(e, isStart) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / this.canvas.clientWidth;
        const scaleY = this.canvas.height / this.canvas.clientHeight;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        this.buttons.forEach(btn => {
            const btnX = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX;
            const btnY = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY;

            if (
                x >= btnX &&
                x <= btnX + btn.width &&
                y >= btnY &&
                y <= btnY + btn.height
            ) {
                this.keyboard[btn.key] = isStart;
            }
        });
    }


    /**
 * Resets all virtual button states in the keyboard object to false.
 */
    resetButtons() {
        this.buttons.forEach(btn => {
            this.keyboard[btn.key] = false;
        });
    }


    /**
 * Draws the virtual buttons on the canvas with semi-transparency.
 * Dynamically assigns the correct image if not already set.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 */

    draw(ctx) {
        if (!this.buttons) return;

        this.buttons.forEach(btn => {
            if (!btn.img.src) {
                switch (btn.id) {
                    case 'left': btn.img.src = 'img/GUI/3 Icons/Icons/Icon_14.png'; break;
                    case 'right': btn.img.src = 'img/GUI/3 Icons/Icons/Icon_12.png'; break;
                    case 'jump': btn.img.src = 'img/GUI/3 Icons/Icons/Icon_13.png'; break;
                    case 'shoot': btn.img.src = 'img/GUI/9 Other/3 Skill icons/Skillicon7_06.png'; break;
                }
            }

            const x = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX;
            const y = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY;

            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.drawImage(btn.img, x, y, btn.width, btn.height);
            ctx.restore();
        });
    }


}
