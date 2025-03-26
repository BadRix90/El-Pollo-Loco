class Character extends MovableObject {
  height = 200;
width = 150;
  y = 80;
  speed = 5;

  IMAGES_WALKING = [
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_run/Punk_run_frame_1.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_run/Punk_run_frame_2.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_run/Punk_run_frame_3.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_run/Punk_run_frame_4.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_run/Punk_run_frame_5.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_run/Punk_run_frame_6.png",
  ];

  IMAGES_JUMPING = [
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_jump/Punk_jump_frame_1.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_jump/Punk_jump_frame_2.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_jump/Punk_jump_frame_3.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_jump/Punk_jump_frame_4.png",
  ];

  IMAGES_HURT = [
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_hurt/Punk_hurt_frame_1.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_hurt/Punk_hurt_frame_2.png",
  ];

  IMAGES_DEAD = [
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_death/Punk_death_frame_1.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_death/Punk_death_frame_2.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_death/Punk_death_frame_3.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_death/Punk_death_frame_4.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_death/Punk_death_frame_5.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_death/Punk_death_frame_6.png",
  ];

  IMAGES_IDLE = [
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_idle/Punk_idle_frame_1.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_idle/Punk_idle_frame_2.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_idle/Punk_idle_frame_3.png",
    "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_idle/Punk_idle_frame_4.png"
  ];

  world;

  constructor() {
    super().loadImage(
      "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_idle/Punk_idle_frame_1.png"
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
}
