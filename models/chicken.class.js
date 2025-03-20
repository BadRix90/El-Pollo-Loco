class Chicken extends MovableObject {
  y = 400;
  height = 50;
  width = 50;
  speed = 0.3 + Math.random() * 0.25;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 200 + Math.random() * 500;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {
    this.moveLeft();
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path];
      this.currentImage++;
      setInterval(() => this.resetPosition(), 1000 / 600);
    }, 100 / this.speed);
  }

  resetPosition() {
    if (this.x < -this.width) {
      this.x = 720;
    }
  }
}
