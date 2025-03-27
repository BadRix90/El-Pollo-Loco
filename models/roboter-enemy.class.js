class RobotEnemy extends MovableObject {
    speed = 0.3 + Math.random() * 0.2;
    energy = 100;
    mode = "idle";
    
    // Animationsbilder für den Roboter
    IMAGES_RUNNING = [
      "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Run/Run_frame_1.png",
      "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Run/Run_frame_2.png",
      "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Run/Run_frame_3.png",
      "img/cyberpunk-characters-pixel-art/4 Enemies/4 Alarmobot/frames/Run/Run_frame_4.png"
    ];
    
    constructor() {
      super().loadImage(this.IMAGES_RUNNING[0]);
      this.loadImages(this.IMAGES_RUNNING);
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
  