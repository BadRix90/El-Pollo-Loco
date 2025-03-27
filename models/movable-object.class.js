class MovableObject extends DrawableObject {
  height = 150;
  width = 100;
  speed = 0.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 4;
  energy = 100;
  lastHit = 0;
  defaultYPosition = 300;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }

      if (!(this instanceof Bullet) && this.y > this.defaultYPosition) {
        this.y = this.defaultYPosition;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof Bullet) {
      return this.y < 480;
    } else {
      return this.y < this.defaultYPosition; 
    }
  }

  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  moveRight() {
    if (this.isDead && this.isDead()) return;
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    if (this.isDead && this.isDead()) return;
    this.x -= this.speed;
    this.otherDirection = true;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    if (this.isDead && this.isDead()) return;
    this.speedY = 40;
  }
}
