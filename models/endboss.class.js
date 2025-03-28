class Endboss extends MovableObject {
  x = 5300;
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
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB_FLY);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM_DUST);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  startAttack() {
    if (this.isDead() || this.isAttacking) return;
  
    this.isAttacking = true;
    this.currentImage = 0;
  
    let attackInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ATTACK);
    }, 100);
  
    setTimeout(() => {
      clearInterval(attackInterval);
      this.isAttacking = false;
    }, this.IMAGES_ATTACK.length * 100);
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
      this.playAnimation(this.IMAGES_WALKING);
      this.otherDirection = true;
    }, 200);
  }
  
}
