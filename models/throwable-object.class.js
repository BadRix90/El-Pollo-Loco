class Bullet extends MovableObject {
  constructor(x, y, speed = 7, owner = null) {
    super().loadImage('img/cyberpunk-characters-pixel-art/guns/5 Bullets/1.png');
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
