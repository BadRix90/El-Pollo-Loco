class Cloud extends MovableObject {
  y = 70;
  height = 300;
  width = 720;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/full.png");
    this.x = Math.random() * 500;
    this.animate();
  }

  animate() {
    this.moveLeft();
    setInterval(() => this.resetPosition(), 1000 / 60);
  }

  resetPosition() {
    if (this.x < -this.width) {
      this.x = 720;
    }
  }
}
