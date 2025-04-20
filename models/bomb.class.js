class Bomb extends MovableObject {

  /**
   * Creates a new Bomb instance.
   * @param {number} x - The x-position of the bomb.
   * @param {number} y - The initial y-position of the bomb.
   * @param {World} world - The game world instance this bomb belongs to.
   * @param {Endboss} endboss - The endboss that launched the bomb.
   */
  constructor(x, y, world, endboss) {
    super().loadImage("img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Bomb/Bomb_frame_1.png");
    this.loadAllImages();
    this.x = x;
    this.y = y;
    this.world = world;
    this.endboss = endboss;
    this.speedY = -20;
    this.gravity = 2;
    this.state = "fly";
    this.explodeSound = new Audio('audio/explosionEndboss.mp3');
    this.explodeSound.volume = 0.06;
    this.animate();
  }

  /**
   * Loads all bomb animation images.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB_FLY);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM_DUST);
  }

  IMAGES_ATTACK_SPECIAL_BOMB_FLY = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Bomb/Bomb_frame_1.png",
  ];

  IMAGES_ATTACK_SPECIAL_BOMB = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack4/Attack4_frame_1.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack4/Attack4_frame_2.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack4/Attack4_frame_3.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack4/Attack4_frame_4.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack4/Attack4_frame_5.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Attack4/Attack4_frame_6.png",
  ];

  IMAGES_ATTACK_SPECIAL_BOMB_BOOM = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/BOOM_bomb/BOOM_bomb_frame_1.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/BOOM_bomb/BOOM_bomb_frame_2.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/BOOM_bomb/BOOM_bomb_frame_3.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/BOOM_bomb/BOOM_bomb_frame_4.png",
  ];

  IMAGES_ATTACK_SPECIAL_BOMB_BOOM_DUST = [
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Dust/Dust_frame_1.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Dust/Dust_frame_2.png",
    "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Dust/Dust_frame_3.png",
  ];

  /**
   * Starts the bomb's animation cycle.
   */
  animate() {
    let i = 0;
    const interval = setInterval(() => {
      this.updateBombState(i, interval);
      i++;
    }, 1000 / 60);
  }

  /**
   * Updates the bomb behavior based on its current state.
   * @param {number} i - Current animation frame counter.
   * @param {number} interval - The interval ID.
   */
  updateBombState(i, interval) {
    switch (this.state) {
      case "fly":
        this.handleFlyState();
        break;
      case "idle":
        this.handleIdleState(i);
        break;
      case "boom":
        this.handleBoomState(i);
        break;
      case "dust":
        this.handleDustState(i, interval);
        break;
    }
  }

  /**
   * Handles the flying state of the bomb.
   */
  handleFlyState() {
    this.y += 4;
    this.playAnimation(this.IMAGES_ATTACK_SPECIAL_BOMB_FLY);
    if (this.y >= this.defaultYPosition) {
      this.landBomb();
    }
  }

  /**
   * Transitions bomb from flying to idle.
   */
  landBomb() {
    this.y = this.defaultYPosition;
    this.state = "idle";
    this.explodeSound.currentTime = 0;
    if (!muteSounds) this.explodeSound.play();
  }

  /**
   * Handles the idle state before explosion.
   * @param {number} i - Current animation frame counter.
   */
  handleIdleState(i) {
    this.playAnimation(this.IMAGES_ATTACK_SPECIAL_BOMB);
    if (i >= this.IMAGES_ATTACK_SPECIAL_BOMB.length) {
      this.state = "boom";
    }
  }

  /**
   * Handles the boom (explosion) state.
   * @param {number} i - Current animation frame counter.
   */
  handleBoomState(i) {
    this.playAnimation(this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM);
    if (i === 1) this.applyExplosionDamage();
    if (i >= this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM.length) {
      this.state = "dust";
    }
  }

  /**
   * Applies damage to the character based on distance.
   */
  applyExplosionDamage() {
    const distance = Math.abs(this.x - this.world.character.x);
    const maxRange = 150;
    const maxDamage = 30;
    if (distance < maxRange) {
      const damageFactor = 1 - distance / maxRange;
      const damage = Math.round(maxDamage * damageFactor);
      this.world.character.hit(damage);
      this.world.statusBar.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Handles the dust state after the explosion.
   * @param {number} i - Current animation frame counter.
   * @param {number} interval - The interval ID.
   */
  handleDustState(i, interval) {
    this.playAnimation(this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM_DUST);
    if (i >= this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM_DUST.length) {
      clearInterval(interval);
      this.cleanupBomb();
    }
  }

  /**
   * Cleans up the bomb after the animation finishes.
   */
  cleanupBomb() {
    this.world.activeBombs = this.world.activeBombs.filter(b => b !== this);
    this.world.shakeCamera(500, 15);
    if (this.endboss) {
      this.endboss.isAttacking = false;
      this.endboss.mode = "idle";
    }
  }
}