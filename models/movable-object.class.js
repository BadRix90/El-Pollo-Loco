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
    const shrink = 70;
  
    return (
      this.x + shrink + this.width - shrink * 2 > mo.x + shrink &&
      this.y + shrink + this.height - shrink * 2 > mo.y + shrink &&
      this.x + shrink < mo.x + mo.width - shrink &&
      this.y + shrink < mo.y + mo.height - shrink
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
    this.speedY = 34;
  }
}
