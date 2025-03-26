class Endboss extends MovableObject {
  x = 2400;
  y = 100;
  height = 350;
  width = 300;
  energy = 300;

  IMAGES_WALKING = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_1.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_2.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_3.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_4.png",
  ];

  IMAGES_DEAD = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_1.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_2.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_3.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_4.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_5.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_6.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  hit(damage = 50) {
    if (this.isDead()) return;

    this.energy -= damage;

    if (this.energy <= 0) {
      this.energy = 0;
      this.speed = 0;
      this.playDeathAnimation?.(); // optional, wenn vorhanden
    }
  }

  playDeathAnimation() {
    let i = 0;
    let interval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_DEAD[i]];
      i++;
      if (i >= this.IMAGES_DEAD.length) {
        clearInterval(interval);
        this.otherDirection = false; // bleibt liegen ohne Spiegelung
        this.speed = 0;
      }
    }, 100);
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
      this.otherDirection = true;
    }, 200);
  }
}
