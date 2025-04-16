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


  /**
 * Simulates gravity by adjusting the object's vertical speed and position over time.
 */
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


  /**
 * Checks if the object is currently above the ground level.
 * @returns {boolean} True if above ground, false otherwise.
 */
  isAboveGround() {
    if (this instanceof Bullet) {
      return this.y < 480;
    } else {
      return this.y < this.defaultYPosition;
    }
  }


  /**
 * Checks for a bounding box collision with another movable object.
 * @param {MovableObject} mo - The other object to check collision with.
 * @returns {boolean} True if colliding, false otherwise.
 */
  isColliding(mo) {
    const a = this.getHitbox();
    const b = mo.getHitbox();
  
    return (
      a.x + a.width > b.x &&
      a.y + a.height > b.y &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height
    );
  }
  

  /**
 * Determines if the object was recently hit.
 * @returns {boolean} True if the object is currently hurt.
 */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }


  /**
 * Checks if the object's energy has reached zero.
 * @returns {boolean} True if dead, false otherwise.
 */
  isDead() {
    return this.energy == 0;
  }


  /**
 * Moves the object horizontally and sets direction.
 * Skips movement if the object is dead.
 */

  moveRight() {
    if (this.isDead && this.isDead()) return;
    this.x += this.speed;
    this.otherDirection = false;
  }


  /**
 * Moves the object horizontally and sets direction.
 * Skips movement if the object is dead.
 */
  moveLeft() {
    if (this.isDead && this.isDead()) return;
    this.x -= this.speed;
    this.otherDirection = true;
  }


  /**
 * Plays a looping animation using the provided image array.
 * @param {string[]} images - Array of image paths.
 */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }


  /**
 * Initiates a jump by setting the vertical speed.
 * Skips jump if object is dead.
 */
  jump() {
    if (this.isDead && this.isDead()) return;
    this.speedY = 45;
  }


  /**
 * Plays the hurt animation and resets the mode to idle afterward.
 */
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


  /**
 * Applies damage to the object and triggers hurt or death behavior.
 * @param {number} [damage=5] - The amount of damage to apply.
 */
  hit(damage = 15) {
    let currentTime = Date.now();
    if (currentTime - this.lastHit < this.hitCooldown) {
      return;
    }
    this.lastHit = currentTime;
    this.energy -= damage;

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


  /**
 * Returns the current hitbox of the object with applied offsets.
 * @returns {Object} A hitbox object with x, y, width, and height.
 */
  getHitbox() {
    const offsetX = 30;
    const offsetYTop = 40; 
    const offsetYBottom = 0;
  
    return {
      x: this.x + offsetX,
      y: this.y + offsetYTop,
      width: this.width - offsetX * 2,
      height: this.height - offsetYTop - offsetYBottom
    };
  }
  

  /**
 * Plays the death animation sequence, then starts the blinking removal effect.
 */
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


  /**
 * Triggers a blinking effect and removes the object from the world's enemy list after completion.
 */
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
