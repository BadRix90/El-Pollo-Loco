class Bomb extends MovableObject {
  constructor(x, y, world, endboss) {
    super().loadImage(
      "img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Bomb/Bomb_frame_1.png"
    );
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB_FLY);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM);
    this.loadImages(this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM_DUST);
    this.x = x;
    this.y = y;
    this.world = world;
    this.endboss = endboss;
    this.speedY = -20;
    this.gravity = 2;
    this.state = "fly";
    this.damage = damage;
    this.animate();
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

  animate() {
    let i = 0;

    let interval = setInterval(() => {
      if (this.state === "fly") {
        this.y += 4;
        this.playAnimation(this.IMAGES_ATTACK_SPECIAL_BOMB_FLY);
        if (this.y >= this.defaultYPosition) {
          this.y = this.defaultYPosition;
          this.state = "idle";
          i = 0;
        }
      } else if (this.state === "idle") {
        this.playAnimation(this.IMAGES_ATTACK_SPECIAL_BOMB);
        i++;
        if (i >= this.IMAGES_ATTACK_SPECIAL_BOMB.length) {
          this.state = "boom";
          i = 0;
        }
      } else if (this.state === "boom") {
        this.playAnimation(this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM);
        i++;
        if (i === 1) {
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

        if (i >= this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM.length) {
          this.state = "dust";
          i = 0;
        }
      } else if (this.state === "dust") {
        this.playAnimation(this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM_DUST);
        i++;
        if (i >= this.IMAGES_ATTACK_SPECIAL_BOMB_BOOM_DUST.length) {
          clearInterval(interval);
          this.world.activeBombs = this.world.activeBombs.filter(
            (b) => b !== this
          );
          this.world.shakeCamera(500, 15);
          if (this.endboss) {
            this.endboss.isAttacking = false;
            this.endboss.mode = "idle";
          }
        }
      }
    }, 1000 / 60);
  }
}
