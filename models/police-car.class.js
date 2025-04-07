class PoliceCar extends MovableObject {
    IMAGES_POLICECAR = [
        'img/cyberpunk-characters-pixel-art/policecar/policecar1.png', // red light
        'img/cyberpunk-characters-pixel-art/policecar/policecar1.png', // red light
        'img/cyberpunk-characters-pixel-art/policecar/policecar2.png', // red light
        'img/cyberpunk-characters-pixel-art/policecar/policecar3.png', // red light
        'img/cyberpunk-characters-pixel-art/policecar/policecar4.png', // blue light
        'img/cyberpunk-characters-pixel-art/policecar/policecar5.png', // blue light
        'img/cyberpunk-characters-pixel-art/policecar/policecar6.png', // red light
    ];

    constructor(world) {
        super().loadImage(this.IMAGES_POLICECAR[0]);
        this.loadImages(this.IMAGES_POLICECAR);
        this.x = -this.width;
        this.y = 340;
        this.width = 300;
        this.height = 150;
        this.speed = 4;
        this.world = world;
        this.visible = true;
        this.otherDirection = false;
        this.animate();
    }

    animate() {
        let frame = 0;
        const moveInterval = setInterval(() => {
            this.x += this.speed;
            if (this.x > this.world.canvas.width) {
                clearInterval(moveInterval);
                this.visible = false;
                this.world.character.startIntroRun();
            }
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_POLICECAR);
            frame++;
        }, 100);
    }


    draw(ctx) {
        if (!this.visible) return;
      
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.filter = 'blur(1px)';
        super.draw(ctx); // normales Auto zeichnen
        ctx.restore();
      
        this.drawPoliceLight(ctx);
      }
      
      drawPoliceLight(ctx) {
        const currentFrame = this.currentImage % this.IMAGES_POLICECAR.length;
        const isRed = [0, 1, 2, 3, 6].includes(currentFrame);
        const color = isRed ? 'red' : 'blue';
      
        const shimmerX = this.x + this.width / 1;
        const shimmerY = this.y + this.height / 3; // TIEFER: näher an Dach
        const shimmerWidth = 50;
        const shimmerHeight = 10;
      
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.filter = `blur(6px)`;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 25;
      
        // Ovaler Lichtschimmer
        ctx.beginPath();
        ctx.ellipse(shimmerX, shimmerY, shimmerWidth, shimmerHeight, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
      
      

}
