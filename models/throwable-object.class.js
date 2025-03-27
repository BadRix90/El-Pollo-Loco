class Bullet extends MovableObject {
  constructor(x, y, speed = 7, owner = null, bulletImages = []) {
    super().loadImage(bulletImages[0]);
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 5;
    this.speed = speed;
    this.owner = owner;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x += this.speed;
    }, 1000 / 60);
  }
}
