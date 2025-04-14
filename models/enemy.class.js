class Enemy extends MovableObject {
  speed = 0.3 + Math.random() * 0.25;
  energy = 100;
  deathPlayed = false;
  mode = "idle";

  IMAGES_WALKING = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_2.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_3.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_4.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_5.png",
  ];

  IMAGES_DEAD = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Death/Death_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Death/Death_frame_2.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Death/Death_frame_3.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Death/Death_frame_4.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Death/Death_frame_5.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Death/Death_frame_6.png",
  ];

  IMAGES_IDLE = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Idle/Idle_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Idle/Idle_frame_2.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Idle/Idle_frame_3.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Idle/Idle_frame_4.png",
  ];

  IMAGES_HURT = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Hurt/Hurt_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Hurt/Hurt_frame_2.png",
  ];


  /**
 * Creates a new Enemy instance.
 * Loads image assets for animations and sets initial position and state.
 */
  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_HURT);
    this.y = this.defaultYPosition;
    this.x = 720 + Math.random() * 300;
    this.world = null;
  }


  /**
 * Starts two animation loops:
 * - Movement: changes direction at patrol boundaries
 * - Visuals: plays walking animation while in idle mode
 */
  animate() {
    setInterval(() => {
      if (this.isDead()) return;

      if (this.mode === "idle") {
        this.x += this.speed;
        if (this.x >= this.patrolEnd || this.x <= this.patrolStart) {
          this.speed *= -1;
          this.otherDirection = !this.otherDirection;
        }
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) return;

      if (this.mode === "idle") {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 120);
  }

  /**
 * Resets the enemy's x-position to the right edge if it moves off the left side of the screen.
 */
  resetPosition() {
    if (this.x < -this.width) {
      this.x = 720;
    }
  }

  
}
