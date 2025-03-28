class Endboss extends MovableObject {
  x = 300;
  y = 100;
  height = 350;
  width = 300;
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

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  startAI() {
    setInterval(() => {
      if (!this.world || this.isDead() || this.isAttacking) return;

      const distance = Math.abs(this.world.character.x - this.x);
      const attackRange = 250;

      if (distance < attackRange) {
        const r = Math.random();
        if (
          r < 0.3 &&
          (!this.lastSpecial || Date.now() - this.lastSpecial > 10000)
        ) {
          this.startSpecialAttack();
          this.lastSpecial = Date.now(); // Cooldown für Spezialangriff
        } else {
          this.startAttack();
        }
      }
    }, 300);
  }

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
        this.world.spawnBullet(bulletX, bulletY, direction, this, 1);
      }

      if (i >= this.IMAGES_ATTACK.length) {
        clearInterval(interval);
        this.isAttacking = false;
        this.mode = "idle";
      }
    }, 100);
  }

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

  spawnBomb() {
    const bomb = new Bomb(this.world.character.x, -200, this.world, this);
    this.world.activeBombs.push(bomb);
  }

  hit(damage = 50) {
    if (this.isDead() || this.deathPlayed) return;

    this.energy -= damage;

    if (this.energy <= 0) {
      this.energy = 0;
      this.speed = 0;
      this.deathPlayed = true;
      this.playDeathAnimation();
    } else {
      this.mode = "hurt";
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
        this.otherDirection = false;
        this.speed = 0;
      }
    }, 100);
  }

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
