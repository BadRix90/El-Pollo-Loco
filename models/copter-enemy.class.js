class CopterEnemy extends MovableObject {
    speed = 0.4 + Math.random() * 0.2;
    energy = 100;
    mode = "idle";
    
    // Eigenschaften für den lokalen Patrouillenbereich:
    patrolStart = 0;
    patrolEnd = 0;
  
    // Animationsbilder für den Copter:
    IMAGES_FLYING = [
      "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Run/Run_frame_1.png",
      "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Run/Run_frame_2.png",
      "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Run/Run_frame_3.png",
      "img/cyberpunk-characters-pixel-art/4 Enemies/5 Copter/frames/Run/Run_frame_3.png"
    ];
  
    constructor() {
      super().loadImage(this.IMAGES_FLYING[0]);
      this.loadImages(this.IMAGES_FLYING);
      // Höhe des Copters – anpassbar:
      this.y = 100;
      // Der initiale x-Wert wird später überschrieben:
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
  