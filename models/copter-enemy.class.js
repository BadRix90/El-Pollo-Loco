class CopterEnemy extends MovableObject {
  speed = 0.4 + Math.random() * 0.2;
  energy = 45;
  mode = "idle";
  patrolStart = 0;
  patrolEnd = 0;
  deathPlayed = false;

  IMAGES_FLYING = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Run/Run_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Run/Run_frame_2.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Run/Run_frame_3.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Run/Run_frame_3.png",
  ];

  IMAGES_HURT = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Hurt/Hurt_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Hurt/Hurt_frame_2.png",
  ];

  IMAGES_DEAD = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Death/Death_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Death/Death_frame_2.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Death/Death_frame_3.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Death/Death_frame_4.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Death/Death_frame_5.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Death/Death_frame_6.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_FLYING[0]);
    this.loadImages(this.IMAGES_FLYING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.y = 100;
    this.x = 720 + Math.random() * 300;
    this.world = null;
  }

  animate() {
    setInterval(() => {
      if (this.isDead()) return;
      this.x += this.speed;
      if (this.x > this.patrolEnd || this.x < this.patrolStart) {
        this.speed *= -1;
        this.otherDirection = !this.otherDirection;
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) return;
      this.playAnimation(this.IMAGES_FLYING);
    }, 120);
  }
}
