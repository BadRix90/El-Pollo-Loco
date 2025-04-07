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
      this.x = 900;
      this.y = 300;
      this.width = 250;
      this.height = 120;
      this.speed = 4;
      this.world = world;
      this.visible = true;
      this.animate();
    }
  
    animate() {
      let frame = 0;
      const moveInterval = setInterval(() => {
        this.x -= this.speed;
        if (this.x < -this.width) {
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
  }
  