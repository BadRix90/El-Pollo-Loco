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

  IMAGES_WEAPON = [
    "img/cyberpunk-characters-pixel-art/guns/2 Guns/1_1.png",
    "img/cyberpunk-characters-pixel-art/guns/2 Guns/1_2.png",
    "img/cyberpunk-characters-pixel-art/guns/2 Guns/2_1.png",
    "img/cyberpunk-characters-pixel-art/guns/2 Guns/2_2.png",
    "img/cyberpunk-characters-pixel-art/guns/2 Guns/3_1.png",
    "img/cyberpunk-characters-pixel-art/guns/2 Guns/3_2.png",
  ];

  IMAGES_HANDS = [
    "img/cyberpunk-characters-pixel-art/guns/3 Hands/3 Cyborg/1.png",
    "img/cyberpunk-characters-pixel-art/guns/3 Hands/3 Cyborg/2.png",
    "img/cyberpunk-characters-pixel-art/guns/3 Hands/3 Cyborg/3.png",
    "img/cyberpunk-characters-pixel-art/guns/3 Hands/3 Cyborg/4.png",
    "img/cyberpunk-characters-pixel-art/guns/3 Hands/3 Cyborg/5.png",
    "img/cyberpunk-characters-pixel-art/guns/3 Hands/3 Cyborg/6.png",
    "img/cyberpunk-characters-pixel-art/guns/3 Hands/3 Cyborg/7.png",
    "img/cyberpunk-characters-pixel-art/guns/3 Hands/3 Cyborg/8.png",
    "img/cyberpunk-characters-pixel-art/guns/3 Hands/3 Cyborg/9.png",
    "img/cyberpunk-characters-pixel-art/guns/3 Hands/3 Cyborg/10.png",
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
    this.applyGravity();
    this.animate();
    this.startIntroRun();
    this.deadPlayed = false;
    this.introRunning = true;
    this.x = -100;
  }

  startIntroRun() {
    let targetX = 100;
    let introFrame = 0;

    let animInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_WALKING[introFrame]];
      introFrame = (introFrame + 1) % this.IMAGES_WALKING.length;
    }, 100);

    let moveInterval = setInterval(() => {
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

      if (this.world.keyboard.Q && !this.isShooting) {
        this.shoot();
      }

      if (
        !this.introRunning &&
        this.world.keyboard.SPACE &&
        !this.isAboveGround()
      ) {
        this.jump();
      }

      if (!this.introRunning) {
        this.world.camera_x = -this.x + 100;
      }
    }, 1000 / 60);

    setInterval(() => {
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

  shoot() {
    this.isShooting = true;

    this.playAnimation(this.IMAGES_SHOOT);

    let handFrame = 0;
    const handInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_HANDS[handFrame]];
      handFrame++;

      if (handFrame >= this.IMAGES_HANDS.length) {
        clearInterval(handInterval);
        this.spawnBullet();
        this.isShooting = false;
      }
    }, 50);
  }

  spawnBullet() {
    a;
    const bullet = new Bullet(
      this.x + this.width - 20, // Startposition rechts vom Cyborg
      this.y + 60 // auf Armhöhe
    );

    this.world.throwables.push(bullet);
  }
}
