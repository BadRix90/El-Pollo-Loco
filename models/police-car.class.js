/**
 * Class representing a Police Car.
 */
class PoliceCar extends MovableObject {
    IMAGES_POLICECAR = [
        'img/cyberpunk-characters-pixel-art/policecar/policecar1.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar1.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar2.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar3.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar4.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar5.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar6.png',
    ];

    /**
     * Initializes the Police Car.
     * @param {World} world - The game world instance.
     */
    constructor(world) {
        super().loadImage(this.IMAGES_POLICECAR[0]);
        this.loadImages(this.IMAGES_POLICECAR);
        this.x = -this.width;
        this.y = 338;
        this.width = 300;
        this.height = 150;
        this.speed = 4;
        this.world = world;
        this.visible = true;
        this.otherDirection = false;
        this.startAnimation();
    }

    /**
     * Starts the movement and flashing light animations.
     */
    startAnimation() {
        this.movePoliceCar();
        this.animatePoliceLights();
    }

    /**
     * Moves the Police Car across the screen.
     */
    movePoliceCar() {
        const moveInterval = setInterval(() => {
            this.x += this.speed;
            if (this.x > this.world.canvas.width) {
                clearInterval(moveInterval);
                this.visible = false;
                this.world.character.startIntroRun();
            }
        }, 1000 / 60);
    }

    /**
     * Animates the flashing lights.
     */
    animatePoliceLights() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_POLICECAR);
        }, 100);
    }

    /**
     * Draws the Police Car with special effects.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    draw(ctx) {
        if (!this.visible) return;
        this.drawBlurredCar(ctx);
        this.drawPoliceLight(ctx);
        this.drawPoliceReflection(ctx);
    }

    /**
     * Draws the blurred police car.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawBlurredCar(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.filter = 'blur(1px)';
        super.draw(ctx);
        ctx.restore();
    }

    /**
     * Draws a glowing light beneath the car.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawPoliceLight(ctx) {
        const { color, shimmerX, shimmerY } = this.getLightParameters();
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.filter = 'blur(6px)';
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.ellipse(shimmerX, shimmerY, 50, 10, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    /**
     * Draws a reflection of the light below the car.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawPoliceReflection(ctx) {
        const { color, reflectionX, reflectionY } = this.getReflectionParameters();
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.filter = 'blur(12px)';
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.ellipse(reflectionX, reflectionY, 50, 10, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    /**
     * Gets light parameters for shimmer effect.
     */
    getLightParameters() {
        const currentFrame = this.currentImage % this.IMAGES_POLICECAR.length;
        const isRed = [0, 1, 2, 3, 6].includes(currentFrame);
        const color = isRed ? 'red' : 'blue';
        const shimmerX = this.x + this.width / 2.1;
        const shimmerY = this.y + this.height / 3;
        return { color, shimmerX, shimmerY };
    }

    /**
     * Gets parameters for reflection effect.
     */
    getReflectionParameters() {
        const currentFrame = this.currentImage % this.IMAGES_POLICECAR.length;
        const isRed = [0, 1, 2, 3, 6].includes(currentFrame);
        const color = isRed ? 'red' : 'blue';
        const reflectionX = this.x + this.width / 2;
        const reflectionY = this.y + this.height + 5;
        return { color, reflectionX, reflectionY };
    }
}
