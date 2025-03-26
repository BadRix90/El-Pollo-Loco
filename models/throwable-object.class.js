class Bullet extends MovableObject {
  constructor(x, y, speed = 7) {
    super().loadImage('img/cyberpunk-characters-pixel-art/guns/5 Bullets/1.png');
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 10;
    this.speed = speed;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x += this.speed;
    }, 1000 / 60);
  }
}
