/**
 * Class representing the main character.
 */
class Character extends MovableObject {
    height = 150;
    width = 100;
    speed = 5;
    maxEnergy = 100;
    energy = this.maxEnergy;
    deathPlayed = false;

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
        "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack3/Cyborg_attack3_frame_1.png",
        "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack3/Cyborg_attack3_frame_2.png",
        "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack3/Cyborg_attack3_frame_3.png",
        "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack3/Cyborg_attack3_frame_4.png",
        "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack3/Cyborg_attack3_frame_5.png",
        "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack3/Cyborg_attack3_frame_6.png",
        "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack3/Cyborg_attack3_frame_7.png",
        "img/cyberpunk-characters-pixel-art/3 Cyborg/frames/Cyborg_attack3/Cyborg_attack3_frame_8.png",
    ];

    world;

    /**
     * Initializes the character.
     */
    constructor() {
        super();
        this.loadInitialImages();
        this.applyGravity();
        this.animateCharacter();
        this.setupProperties();
    }

    /**
     * Loads all required images.
     */
    loadInitialImages() {
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SHOOT);
        this.loadImages(this.IMAGES_ATTACK);
    }

    /**
     * Sets up character properties.
     */
    setupProperties() {
        this.visible = false;
        this.deadPlayed = false;
        this.introRunning = true;
        this.x = -100;
        this.laserSound = new Audio("audio/laserBlasterCharacter.mp3");
        this.laserSound.volume = 0.01;
    }

    /**
     * Starts the intro run animation.
     */
    startIntroRun() {
        this.visible = true;
        this.animateIntroFrames();
        this.moveIntroCharacter();
    }

    /**
     * Animates the intro walking frames.
     */
    animateIntroFrames() {
        let introFrame = 0;
        this.introAnimInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_WALKING[introFrame]];
            introFrame = (introFrame + 1) % this.IMAGES_WALKING.length;
        }, 100);
    }

    /**
     * Moves the character into position during intro.
     */
    moveIntroCharacter() {
        const targetX = 100;
        this.introMoveInterval = setInterval(() => {
            if (this.x < targetX) {
                this.x += 0.5;
            } else {
                clearInterval(this.introMoveInterval);
                clearInterval(this.introAnimInterval);
                this.introRunning = false;
                this.world.inputLocked = false;

            }
        }, 1000 / 120);
    }

    /**
     * Handles the main character animation logic.
     */
    animateCharacter() {
        setInterval(() => this.handleMovement(), 1000 / 60);
        setInterval(() => this.handleAnimation(), 100);
    }

    /**
     * Handles character movement and actions.
     */
    handleMovement() {
        if (this.world.showIntro) return;
        if (!this.world.inputLocked) {
            this.moveCharacter();
            this.checkJump();
            this.checkShooting();
        }
        this.updateCameraPosition();
    }

    /**
     * Handles playing the correct animation.
     */
    handleAnimation() {
        if (this.introRunning) return;
        if (this.checkDeath()) return;
        if (this.isShooting) return;
        this.playCharacterAnimation();
    }

    /**
     * Moves the character based on keyboard input.
     */
    moveCharacter() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) this.moveRight();
        if (this.world.keyboard.LEFT && this.x > 0) this.moveLeft();
    }

    /**
     * Checks for jumping and double jumping.
     */
    checkJump() {
        if (!this.world.keyboard.SPACE) return;
        const now = Date.now();
        if (!this.isAboveGround()) this.canDoubleJump = true;
        if (now - this.lastJumpTime <= this.doubleJumpWindow && this.canDoubleJump && this.isAboveGround()) {
            this.jump(true);
            this.canDoubleJump = false;
        } else if (!this.isAboveGround()) {
            this.jump();
        }
        this.lastJumpTime = now;
    }

    /**
     * Checks if character is shooting.
     */
    checkShooting() {
        if (!this.introRunning && this.world.keyboard.q && !this.alreadyShot) {
            this.handleShooting();
            this.alreadyShot = true;
        }
        if (!this.world.keyboard.q) this.alreadyShot = false;
    }

    /**
     * Updates the camera position based on character.
     */
    updateCameraPosition() {
        if (!this.introRunning) this.world.camera_x = -this.x + 100;
    }

    /**
     * Checks if character is dead and triggers endgame.
     */
    checkDeath() {
        if (this.isDead()) {
            if (!this.deadPlayed) this.playAnimation(this.IMAGES_DEAD);
            this.deadPlayed = true;
            if (!this.world.gameOverHandled) {
                this.world.showGameOver = true;
                this.world.gameOverHandled = true;
                this.world.endGame();
            }
            return true;
        }
        return false;
    }

    /**
     * Plays appropriate animations based on state.
     */
    playCharacterAnimation() {
        if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
        else if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
        else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) this.playAnimation(this.IMAGES_WALKING);
        else this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Handles the shooting animation.
     */
    handleShooting() {
        if (this.isShooting || this.isDead()) return;
        this.isShooting = true;
        this.currentImage = 0;
        this.animateShootingFrames();
    }

    /**
     * Animates the shooting frames.
     */
    animateShootingFrames() {
        let frameIndex = 0;
        const shootInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_ATTACK[frameIndex]];
            frameIndex++;
            if (frameIndex === this.IMAGES_ATTACK.length) this.fireBullet(shootInterval);
        }, 50);
    }

    /**
     * Fires a bullet after shooting animation.
     */
    fireBullet(interval) {
        const bulletX = this.x + (this.otherDirection ? 30 : this.width - 40);
        const bulletY = this.y + this.height / 2 - 5;
        const direction = this.otherDirection ? -1 : 1;
        this.world.bullets.spawnBullet(bulletX, bulletY, direction, this, 0);
        this.laserSound.currentTime = 0;
        if (!muteSounds) this.laserSound.play();
        clearInterval(interval);
        this.isShooting = false;
        this.alreadyShot = false;
    }
}
