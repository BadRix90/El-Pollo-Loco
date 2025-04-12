class TouchOverlay {
    constructor(canvas, keyboard) {
        const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
    
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.buttons = []; 
    
        if (!isMobile && window.innerWidth >= 768) {
            this.disabled = true;
            return;
        }
    
        this.buttons = this.createButtons();
        this.registerTouchEvents();
    }
    

    createButtons() {
        return [
            {
                id: 'left',
                relX: 40,
                relY: -70,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'LEFT'
            },
            {
                id: 'right',
                relX: 100,
                relY: -70,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'RIGHT'
            },
            {
                id: 'jump',
                relX: -100,
                relY: -70,
                width: 40,
                height: 40,
                img: new Image(),
                key: 'SPACE'
            },
            {
                id: 'shoot',
                relX: -160,
                relY: -70,
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
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / this.canvas.clientWidth;
        const scaleY = this.canvas.height / this.canvas.clientHeight;

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
        this.disabled = window.innerWidth >= 768;
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

            const x = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX;
            const y = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY;

            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.drawImage(btn.img, x, y, btn.width, btn.height);
            ctx.restore();
        });
    }

    
}
