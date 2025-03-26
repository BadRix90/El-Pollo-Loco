class MovableObject extends DrawableObject {
  speed = 0.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 4;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }

      if (!(this instanceof ThrowableObject) && this.y > 250) {
        this.y = 250;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 480;
    } else {
      return this.y < 250;
    }
  }

  isColliding(mo) {
    const offsetA = this.hitboxOffset || {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
    const offsetB = mo.hitboxOffset || { top: 0, bottom: 0, left: 0, right: 0 };

    return (
      this.x + this.width - offsetA.right > mo.x + offsetB.left &&
      this.y + this.height - offsetA.bottom > mo.y + offsetB.top &&
      this.x + offsetA.left < mo.x + mo.width - offsetB.right &&
      this.y + offsetA.top < mo.y + mo.height - offsetB.bottom
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
    this.speedY = 50;
  }
}
