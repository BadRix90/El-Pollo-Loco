class MovableObject extends DrawableObject {
  height = 150;
  width = 100;
  speed = 0.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 4;
  lastHit = 0;
  hitCooldown = 500;
  defaultYPosition = 300;

  IMAGES_HURT = [];
  IMAGES_DEAD = [];

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
    this.speedY = 45;
  }

  playHurtAnimation() {
    let i = 0;
    let interval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_HURT[i]];
      i++;
      if (i >= this.IMAGES_HURT.length) {
        clearInterval(interval);
        this.mode = "idle";
      }
    }, 100);
  }

  hit(damage = 5) {
    let currentTime = Date.now();
    if (currentTime - this.lastHit < this.hitCooldown) {
      return;
    }
    this.lastHit = currentTime;
    this.energy -= damage;

    console.log(`Character HP: ${this.energy}`);

    if (this.energy <= 0) {
      this.energy = 0;
      this.speed = 0;

      if (!this.deathPlayed) {
        this.deathPlayed = true;
        this.playDeathAnimation();
      }
    } else {
      this.playHurtAnimation();
    }
  }

  playDeathAnimation() {
    let i = 0;
    let interval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_DEAD[i]];
      i++;
      if (i >= this.IMAGES_DEAD.length) {
        clearInterval(interval);
        this.startBlinkAndRemove();
      }
    }, 100);
  }

  startBlinkAndRemove() {
    let blinkCount = 0;
    const maxBlinks = 5;

    const blinkInterval = setInterval(() => {
      this.visible = !this.visible;
      blinkCount++;

      if (blinkCount >= maxBlinks) {
        clearInterval(blinkInterval);

        const index = this.world.level.enemies.indexOf(this);
        if (index > -1) {
          this.world.level.enemies.splice(index, 1);
        }
      }
    }, 200);
  }
}
