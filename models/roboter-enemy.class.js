class RobotEnemy extends MovableObject {
  speed = 0.3 + Math.random() * 0.2;
  energy = 60;
  mode = "idle";
  deathPlayed = false;


  IMAGES_RUNNING = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Run/Run_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Run/Run_frame_2.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Run/Run_frame_3.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Run/Run_frame_4.png",
  ];

  IMAGES_HURT = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Hurt/Hurt_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Hurt/Hurt_frame_2.png",
  ];

  IMAGES_DEAD = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Death/Death_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Death/Death_frame_2.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Death/Death_frame_3.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Death/Death_frame_4.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Death/Death_frame_5.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Death/Death_frame_6.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_RUNNING[0]);
    this.loadImages(this.IMAGES_RUNNING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.y = this.defaultYPosition;
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
      this.playAnimation(this.IMAGES_RUNNING);
    }, 120);
  }
}
