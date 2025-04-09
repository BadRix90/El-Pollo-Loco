class TouchOverlay {

    constructor(canvas, keyboard) {
        if (window.innerWidth >= 768) {
            this.disabled = true;
            return;
        }

        this.canvas = canvas;
        this.keyboard = keyboard;
        this.buttons = this.createButtons();
        this.registerTouchEvents();
    }

    createButtons() {
        return [
            {
                id: 'left',
                x: 40,
                y: this.canvas.height - 70,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'LEFT'
            },
            {
                id: 'right',
                x: 100,
                y: this.canvas.height - 70,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'RIGHT'
            },
            {
                id: 'jump',
                x: this.canvas.width - 100,
                y: this.canvas.height - 70,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'SPACE'
            },
            {
                id: 'shoot',
                x: this.canvas.width - 160,
                y: this.canvas.height - 70,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'q'
            }
        ];
    }


    registerTouchEvents() {
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e, true));
        this.canvas.addEventListener('touchend', (e) => this.resetButtons());
    }

    handleTouch(e, isStart) {
        const rect = this.canvas.getBoundingClientRect();
        for (const touch of e.touches) {
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            this.buttons.forEach(btn => {
                if (
                    x >= btn.x &&
                    x <= btn.x + btn.width &&
                    y >= btn.y &&
                    y <= btn.y + btn.height
                ) {
                    this.keyboard[btn.key] = isStart;
                }
            });
        }
    }

    resetButtons() {
        this.buttons.forEach(btn => {
            this.keyboard[btn.key] = false;
        });
    }


    draw(ctx) {
        if (this.disabled) return;
        this.buttons.forEach(btn => {
            if (!btn.img.src) {
                switch (btn.id) {
                    case 'left': btn.img.src = 'img/GUI/3 Icons/Icons/Icon_14.png'; break;
                    case 'right': btn.img.src = 'img/GUI/3 Icons/Icons/Icon_12.png'; break;
                    case 'jump': btn.img.src = 'img/GUI/3 Icons/Icons/Icon_13.png'; break;
                    case 'shoot': btn.img.src = 'img/GUI/3 Icons/Icons/Icon_19.png'; break;
                }
            }

            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.drawImage(btn.img, btn.x, btn.y, btn.width, btn.height);
            ctx.restore();
        });
    }
}
