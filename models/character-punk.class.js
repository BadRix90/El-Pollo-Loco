class CharacterPunk extends Character {
    height = 150;
    width = 100;
    speed = 5;
    maxEnergy = 100;
    energy = this.maxEnergy;
    deathPlayed = false;
  
  
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
        "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_idle/Punk_idle_frame_4.png",
      ];
    
      IMAGES_SHOOT = [
        "img/cyberpunk-characters-pixel-art/guns/1 Characters/2 Punk/frames/Idle1/Idle1_frame_1.png",
        "img/cyberpunk-characters-pixel-art/guns/1 Characters/2 Punk/frames/Idle1/Idle1_frame_2.png",
        "img/cyberpunk-characters-pixel-art/guns/1 Characters/2 Punk/frames/Idle1/Idle1_frame_3.png",
        "img/cyberpunk-characters-pixel-art/guns/1 Characters/2 Punk/frames/Idle1/Idle1_frame_4.png",
      ];
    
      IMAGES_ATTACK = [
        "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_attack3/Punk_attack3_frame_1.png",
        "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_attack3/Punk_attack3_frame_2.png",
        "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_attack3/Punk_attack3_frame_3.png",
        "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_attack3/Punk_attack3_frame_4.png",
        "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_attack3/Punk_attack3_frame_5.png",
        "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_attack3/Punk_attack3_frame_6.png",
        "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_attack3/Punk_attack3_frame_7.png",
        "img/cyberpunk-characters-pixel-art/2 Punk/frames/Punk_attack3/Punk_attack3_frame_8.png",
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
      this.loadImages(this.IMAGES_SHOOT);
      this.loadImages(this.IMAGES_ATTACK);
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
  
        if (!this.introRunning && this.world.keyboard.SPACE) {
          const now = Date.now();
        
          if (!this.isAboveGround()) {
            this.canDoubleJump = true;
          }
        
          if (now - this.lastJumpTime <= this.doubleJumpWindow && this.canDoubleJump && this.isAboveGround()) {
            this.jump(true); // Double Jump
            this.canDoubleJump = false;
          } else if (!this.isAboveGround()) {
            this.jump(); // Normaler Jump
          }
        
          this.lastJumpTime = now;
        }
        
  
        if (!this.introRunning && this.world.keyboard.q && !this.alreadyShot) {
          this.handleShooting();
          this.alreadyShot = true;
        }
  
        if (!this.world.keyboard.q) {
          this.alreadyShot = false;
        }
  
        if (!this.introRunning) {
          this.world.camera_x = -this.x + 100;
        }
      }, 1000 / 60);
  
      setInterval(() => {
        if (this.isShooting || this.isDead()) return;
  
        const now = Date.now();
        if (now - this.lastShotTime < this.shootCooldown) return;
  
        this.lastShotTime = now;
  
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
      let bulletSpawned = false;
  
      let shootInterval = setInterval(() => {
        this.playAnimation(this.IMAGES_ATTACK);
        if (
          !bulletSpawned &&
          this.currentImage >= this.IMAGES_ATTACK.length - 1
        ) {
          const bulletX = this.x + (this.otherDirection ? 30 : this.width - 40);
          const bulletY = this.y + this.height / 2 - 5;
          const direction = this.otherDirection ? -1 : 1;
          this.world.spawnBullet(bulletX, bulletY, direction, this, 0);
          bulletSpawned = true;
        }
      }, 50);
  
      setTimeout(() => {
        clearInterval(shootInterval);
        this.isShooting = false;
      }, 400);
    }
  
    hit(damage = 5) {
      super.hit(damage); // ruft MovableObject.hit() auf
  
      if (this.world && this.world.statusBar) {
        this.world.statusBar.setPercentage(
          Math.round((this.energy / this.maxEnergy) * 100)
        );
      }
    }
  }
  