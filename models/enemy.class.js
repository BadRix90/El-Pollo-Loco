class Enemy extends MovableObject {
  speed = 0.3 + Math.random() * 0.25;
  energy = 100;
  deathPlayed = false;
  mode = "idle";
  attackDistance = 300;


  IMAGES_WALKING = [
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_1.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_2.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_3.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_4.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_5.png",
    "img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Run/Run_frame_6.png",
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

  IMAGES_ATTACK = [
    'img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Attack/Attack_frame_1.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Attack/Attack_frame_2.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Attack/Attack_frame_3.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Attack/Attack_frame_4.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Attack/Attack_frame_5.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Attack/Attack_frame_6.png'
  ];

  IMAGES_HURT = [
    'img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Hurt/Hurt_frame_1.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/2 Specialist/frames/Hurt/Hurt_frame_2.png'
  ];

  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.y = this.defaultYPosition;
    this.x = 720 + Math.random() * 300;
    this.world = null;
    this.startShooting();

  }

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
      } else if (this.mode === "attack") {
        this.playAnimation(this.IMAGES_ATTACK);
      }
    }, 120);
  }

  startAI() {
    setInterval(() => {
      if (!this.world || this.isDead()) return;

      const distanceToPlayer = Math.abs(this.world.character.x - this.x);

      if (distanceToPlayer < this.attackDistance) {
        this.mode = "attack";
      
        this.otherDirection = this.world.character.x < this.x;
      
      } else {
        this.mode = "idle";
      }
      
    }, 200);
  }

  startShooting() {
    setInterval(() => {
      if (!this.world || this.isDead()) return;
  
      const distanceToPlayer = Math.abs(this.world.character.x - this.x);
  
      if (distanceToPlayer < this.attackDistance) {
        this.mode = 'attack';
  
        const bulletX = this.x + (this.otherDirection ? -20 : this.width + 10);
        const bulletY = this.y + this.height / 2 - 5;
  
        const speed = this.otherDirection ? -10 : 10;
  
        this.world.spawnBullet(bulletX, bulletY, speed > 0 ? 1 : -1, this);
      }
    }, 1200);
  }
  
  
  resetPosition() {
    if (this.x < -this.width) {
      this.x = 720;
    }
  }

  playHurtAnimation() {
    let i = 0;
    let interval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_HURT[i]];
      i++;
      if (i >= this.IMAGES_HURT.length) {
        clearInterval(interval);
        this.mode = "idle"; 
      }
    }, 100);
  }

  hit() {
    if (this.isDead()) return;

    this.energy -= 50;

    if (this.energy <= 0) {
      this.energy = 0;
      this.speed = 0;
      this.playDeathAnimation();
    } else {
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
        this.startBlinkAndRemove();
      }
    }, 100);
  }

  startBlinkAndRemove() {
    let blinkCount = 0;
    const maxBlinks = 5;

    const blinkInterval = setInterval(() => {
      this.visible = !this.visible;
      blinkCount++;

      if (blinkCount >= maxBlinks) {
        clearInterval(blinkInterval);

        const index = this.world.level.enemies.indexOf(this);
        if (index > -1) {
          this.world.level.enemies.splice(index, 1);
        }
      }
    }, 200);
  }
}
