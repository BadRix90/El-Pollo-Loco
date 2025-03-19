class Cloud extends MovableObject {
  y = 70;
  height = 300;
  width = 720;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/full.png");
    this.x = 0
    setInterval(() => {
      this.x -= 0.2;
      if (this.x < -this.width) {
        this.x = canvas.width;
      }
    }, 1000 / 60);
  }
}
