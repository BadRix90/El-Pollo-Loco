class PoliceCar extends MovableObject {
    IMAGES_POLICECAR = [
        'img/cyberpunk-characters-pixel-art/policecar/policecar1.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar2.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar3.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar4.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar5.png',
        'img/cyberpunk-characters-pixel-art/policecar/policecar6.png',
    ];

    constructor(world) {
        super().loadImage(this.IMAGES_POLICECAR[0]);
        this.loadImages(this.IMAGES_POLICECAR);
        this.x = -this.width;
        this.y = 375;
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
      
        super.draw(ctx);
      
        ctx.restore();
      }
      

}
