class Character extends MovableObject {
  height = 200;
  width = 150;
  y = 80;
  speed = 5;

  IMAGES_WALKING = [
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_run/Cyborg_run_frame_1.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_run/Cyborg_run_frame_2.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_run/Cyborg_run_frame_3.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_run/Cyborg_run_frame_4.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_run/Cyborg_run_frame_5.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_run/Cyborg_run_frame_6.png",
  ];

  IMAGES_JUMPING = [
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_jump/Cyborg_jump_frame_1.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_jump/Cyborg_jump_frame_2.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_jump/Cyborg_jump_frame_3.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_jump/Cyborg_jump_frame_4.png",
  ];

  IMAGES_HURT = [
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_hurt/Cyborg_hurt_frame_1.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_hurt/Cyborg_hurt_frame_2.png",
  ];

  IMAGES_DEAD = [
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_death/Cyborg_death_frame_1.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_death/Cyborg_death_frame_2.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_death/Cyborg_death_frame_3.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_death/Cyborg_death_frame_4.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_death/Cyborg_death_frame_5.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_death/Cyborg_death_frame_6.png",
  ];

  IMAGES_IDLE = [
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_idle/Cyborg_idle_frame_1.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_idle/Cyborg_idle_frame_2.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_idle/Cyborg_idle_frame_3.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_idle/Cyborg_idle_frame_4.png",
  ];

  IMAGES_SHOOT = [
    "img/cyberpunk-characters-pixel-art/guns/1 Characters/3 Cyborg/frames/Idle1/Idle1_frame_1.png",
    "img/cyberpunk-characters-pixel-art/guns/1 Characters/3 Cyborg/frames/Idle1/Idle1_frame_2.png",
    "img/cyberpunk-characters-pixel-art/guns/1 Characters/3 Cyborg/frames/Idle1/Idle1_frame_3.png",
    "img/cyberpunk-characters-pixel-art/guns/1 Characters/3 Cyborg/frames/Idle1/Idle1_frame_4.png",
  ];

  IMAGES_ATTACK = [
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack1/Cyborg_attack1_frame_1.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack1/Cyborg_attack1_frame_2.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack1/Cyborg_attack1_frame_3.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack1/Cyborg_attack1_frame_4.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack1/Cyborg_attack1_frame_5.png",
    "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack1/Cyborg_attack1_frame_6.png",
  ];

  IMAGES_SHOOT_EFFECT = [
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/1_1.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/1_2.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/2_1.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/2_2.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/3_1.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/3_2.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/4_1.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/4_2.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/5_1.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/5_2.png",
  ];

  IMAGES_BULLETS = [
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/1.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/2.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/3.png",
  ];

  world;

  constructor() {
    super().loadImage(
      "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_idle/Cyborg_idle_frame_1.png"
    );
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SHOOT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_SHOOT_EFFECT);
    this.loadImages(this.IMAGES_BULLETS);
    this.applyGravity();
    this.animate();
    this.startIntroRun();
    this.deadPlayed = false;
    this.introRunning = true;
    this.x = -100;
    this.visible = true;
  }

  startIntroRun() {
    const targetX = 100;
    let introFrame = 0;

    const animInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_WALKING[introFrame]];
      introFrame = (introFrame + 1) % this.IMAGES_WALKING.length;
    }, 100);

    const moveInterval = setInterval(() => {
      if (this.x < targetX) {
        this.x += 0.5;
      } else {
        clearInterval(moveInterval);
        clearInterval(animInterval);
        this.introRunning = false;
      }
    }, 1000 / 120);
  }

  animate() {
    setInterval(() => {
      if (
        !this.introRunning &&
        this.world.keyboard.RIGHT &&
        this.x < this.world.level.level_end_x
      ) {
        this.moveRight();
      }

      if (!this.introRunning && this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
      }

      if (
        !this.introRunning &&
        this.world.keyboard.SPACE &&
        !this.isAboveGround()
      ) {
        this.jump();
      }

      if (!this.introRunning && this.world.keyboard.q && !this.isShooting) {
        this.handleShooting();
      }

      if (!this.introRunning) {
        this.world.camera_x = -this.x + 100;
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.isShooting) return;

      if (this.isDead()) {
        if (!this.deadPlayed) this.playAnimation(this.IMAGES_DEAD);
        this.deadPlayed = true;
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        } else {
          this.playAnimation(this.IMAGES_IDLE);
        }
      }
    }, 100);
  }

  handleShooting() {
    if (this.isShooting || this.isDead()) return;

    this.isShooting = true;
    this.currentImage = 0;

    let shootInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ATTACK);
    }, 50);

    setTimeout(() => {
      this.world.drawShootEffect(
        this.x + this.width * 0.8,
        this.y + this.height / 2 - 10
      );

      this.world.spawnBullet(
        this.x + this.width * 0.8,
        this.y + this.height / 2,
        this.otherDirection ? -1 : 1
      );
    }, 100);

    setTimeout(() => {
      clearInterval(shootInterval);
      this.isShooting = false;
    }, 400);
  }
}
