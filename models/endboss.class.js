class Endboss extends MovableObject {
  x = 5500;
  y = 100;
  height = 350;
  width = 500;
  energy = 300;
  deathPlayed = false;


  IMAGES_WALKING = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_1.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_2.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_3.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_4.png",
  ];

  IMAGES_ATTACK = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack2/Attack2_frame_1.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack2/Attack2_frame_2.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack2/Attack2_frame_3.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack2/Attack2_frame_4.png",
  ];

  IMAGES_ATTACK_SPECIAL = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack3/Attack3_frame_1.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack3/Attack3_frame_2.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack3/Attack3_frame_3.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack3/Attack3_frame_4.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack3/Attack3_frame_5.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack3/Attack3_frame_6.png",
  ];

  IMAGES_HURT = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Hurt/Hurt_frame_1.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Hurt/Hurt_frame_2.png",
  ];

  IMAGES_DEAD = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_1.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_2.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_3.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_4.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_5.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Death/Death_frame_6.png",
  ];

  /**
 * Initializes the endboss with image sets, sound effects,
 * and starts idle animation.
 */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();

    this.laserSound = new Audio('audio/laser-45816.mp3');
    this.laserSound.volume = 0.01;

    this.sinusBombSound = new Audio('audio/sinusBombEndBoss.mp3');
    this.sinusBombSound.volume = 0.015;
  }


  /**
 * Starts the endboss AI behavior using a timed interval.
 * If the player is within attack range, randomly triggers a regular or special attack.
 */
  startAI() {
    setInterval(() => {
      if (!this.world || this.isDead() || this.isAttacking) return;

      const distance = Math.abs(this.world.character.x - this.x);
      const attackRange = 500;

      if (distance < attackRange) {
        const r = Math.random();
        if (
          r < 0.3 &&
          (!this.lastSpecial || Date.now() - this.lastSpecial > 10000)
        ) {
          this.startSpecialAttack();
          this.lastSpecial = Date.now();
        } else {
          this.startAttack();
        }
      }
    }, 500);
  }


  /**
 * Performs the regular attack animation and fires a projectile toward the player.
 */
  startAttack() {
    if (this.isDead() || this.isAttacking) return;

    this.isAttacking = true;
    this.mode = "attack";
    this.currentImage = 0;

    let i = 0;
    let interval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_ATTACK[i]];
      i++;

      if (i === this.IMAGES_ATTACK.length - 1) {
        const direction = this.world.character.x < this.x ? -1 : 1;
        const bulletX = this.x + (direction === 1 ? this.width - 40 : 30);
        const bulletY = this.y + this.height - 100;
        this.world.bullets.spawnBullet(bulletX, bulletY, direction, this, 1);

        this.laserSound.currentTime = 0;
        if (!muteSounds) {
          this.laserSound.play();
        }

      }

      if (i >= this.IMAGES_ATTACK.length) {
        clearInterval(interval);
        this.isAttacking = false;
        this.mode = "idle";
      }
    }, 100);
  }


  /**
 * Performs the special attack animation and spawns a bomb after the sequence.
 */
  startSpecialAttack() {
    if (this.isDead() || this.isAttacking) return;

    this.isAttacking = true;
    this.mode = "special";
    this.currentImage = 0;

    let i = 0;
    let specialInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_ATTACK_SPECIAL[i]];
      i++;
      if (i >= this.IMAGES_ATTACK_SPECIAL.length) {
        clearInterval(specialInterval);
        this.spawnBomb();
      }
    }, 100);
  }


  /**
 * Spawns a bomb object above the player and adds it to the world's active bombs.
 * Also plays the bomb sound effect.
 */
  spawnBomb() {
    const bomb = new Bomb(this.world.character.x, -200, this.world, this, 25);
    this.world.activeBombs.push(bomb);

    this.sinusBombSound.currentTime = 0;
    if (!muteSounds) {
      this.sinusBombSound.play();
    }
  }


  /**
 * Reduces the endboss's energy by the given amount.
 * Triggers hurt animation or death animation if energy reaches zero.
 * Starts endboss defeat timer and return-to-menu logic if defeated.
 * @param {number} [damage=20] - Amount of damage to apply.
 */
  hit(damage = 20) {
    if (this.isDead() || this.deathPlayed) return;

    this.energy -= damage;

    if (this.energy <= 0) {
      this.energy = 0;
      this.speed = 0;
      this.deathPlayed = true;
      this.playDeathAnimation();

      if (this.world) {
        this.world.endGame();
      }
    } else {
      this.mode = "hurt";
      this.playHurtAnimation();
    }
  }


  /**
   * Plays the death animation sequence once, then stops movement.
   */
  playDeathAnimation() {
    let i = 0;
    let interval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_DEAD[i]];
      i++;
      if (i >= this.IMAGES_DEAD.length) {
        clearInterval(interval);
        this.otherDirection = false;
        this.speed = 0;
      }
    }, 100);
  }


  /**
 * Plays the walking animation if not attacking or dead.
 * Also forces the endboss to face left by default.
 */
  animate() {
    setInterval(() => {
      if (this.isDead() || this.deathPlayed) return;
      if (this.mode === "special") {
        this.playAnimation(this.IMAGES_WALKING);
      } else if (!this.isAttacking) {
        this.playAnimation(this.IMAGES_WALKING);
      }

      this.otherDirection = true;
    }, 200);
  }

}
