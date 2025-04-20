class World {
  character = new Character();
  level = level1;
  backgroundWidth = 719 * 2;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];
  enemyBullets = [];
  activeBombs = [];
  playerBullets = [];
  healItems = [];
  introY = -100;
  showIntro = true;
  showStartButton = false;
  introStep = 0;
  showOptionsMenu = false;
  showControlsOverlay = false;
  policeCar = null;
  touchOverlay = null;

  /**
   * Initializes the game world with all components.
   */
  constructor(canvas, keyboard) {
    this.setupCanvas(canvas);
    this.keyboard = keyboard;
    this.initializeWorldComponents();
    this.initializeAudioSystem();
    this.draw();
    this.setWorld();
    this.run();
    this.initializeUIState();
  }

  setupCanvas(canvas) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
  }

  initializeWorldComponents() {
    this.character.world = this;
    this.events = new EventManager(this);
    this.ui = new UIManager(this);
    this.weather = new WeatherSystem(this.canvas);
    this.bullets = new BulletManager(this);
    this.touchOverlay = new TouchOverlay(this.canvas, this.keyboard);
    this.uiHandler = new WorldUI(this);
  }

  initializeAudioSystem() {
    if (typeof initializeAudio === "function") {
      initializeAudio();
    }
  }

  initializeUIState() {
    this.hoverX = 0;
    this.hoverY = 0;
    this.fromIntroToControls = false;
    this.gameOverHandled = false;
    this.showGameOver = false;
    this.gameOverY = -50;
    this.showEndscreen = false;
    this.showStartIntro = true;
    this.showIntro = false;
    this.introStep = 2;
    this.resetIntroMusic();
  }

  resetIntroMusic() {
    const introMusic = document.getElementById("intro-music");
    if (introMusic) {
      introMusic.pause();
      introMusic.currentTime = 0;
    }
  }

  /**
   * Assigns world references to all entities and spawns heal items.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      enemy.animate?.();
      enemy.startAI?.();
    });
    if (this.level.endboss) {
      this.level.endboss.world = this;
      this.level.endboss.animate?.();
    }
    this.spawnHealItems();
  }

  spawnHealItems() {
    const positions = [1000, 2000, 4500];
    positions.forEach(pos => this.healItems.push(new HealItem(pos, 300, this)));
  }

  /**
   * Main game loop (60 FPS).
   */
  run() {
    setInterval(() => {
      this.updateWorldState();
    }, 1000 / 60);
  }

  updateWorldState() {
    this.checkCollisions();
    this.bullets.checkBulletHits();
    this.bullets.removeMarkedBullets();
    this.checkEndbossAttack();
    this.throwableObjects = this.throwableObjects.filter((o) => !o.markedForDeletion);
  }

  /**
   * Checks collisions between character and enemies or heal items.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead() && this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
    this.healItems.forEach((item) => item.collect());
    if (this.character.isDead() && !this.showEndscreen) {
      this.endGame();
    }
  }

  /**
   * Triggers endboss attack if the character is close enough.
   */
  checkEndbossAttack() {
    if (!this.level.endboss || this.level.endboss.isDead()) return;
    const distance = Math.abs(this.character.x - this.level.endboss.x);
    if (distance < 250) {
      this.level.endboss.startAttack();
      if (!this.character.isHurt()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    }
  }

  /**
   * Main render loop.
   */
  draw() {
    this.menuButtons = [];
    if (this.showEndscreen) return this.drawEndscreenFrame();
    if (this.handleOverlayScreens()) return;
    if (this.drawStartIntroScreen()) return;
    this.drawWorldScene();
    this.drawLoopId = requestAnimationFrame(() => this.draw());
    this.drawGameOverText();
  }

  drawEndscreenFrame() {
    this.ui.drawEndscreen();
    requestAnimationFrame(() => this.draw());
  }

  drawWorldScene() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);
    this.addStreetAndEntities();
    this.ctx.translate(-this.camera_x, 0);
    this.touchOverlay?.draw(this.ctx);
  }

  addStreetAndEntities() {
    this.addObjectsToMap(this.level.street);
    if (this.policeCar) this.addToMap(this.policeCar);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.playerBullets);
    this.addObjectsToMap(this.enemyBullets);
    this.addObjectsToMap(this.activeBombs);
    this.addObjectsToMap(this.healItems);
    this.drawComingSoon();
  }

  drawComingSoon() {
    this.ctx.save();
    this.ctx.font = "32px CyberpunkCraftpixPixel";
    this.ctx.fillStyle = "#ff00ff";
    this.ctx.textAlign = "center";
    this.ctx.fillText("COMING SOON", 7100, 300);
    this.ctx.fillText("--->", 7100, 250);
    this.ctx.restore();
  }

  drawGameOverText() {
    if (this.showGameOver && this.gameOverY < this.canvas.height / 2) {
      this.gameOverY += 5;
    }
    if (this.showGameOver) {
      this.ctx.save();
      this.ctx.font = "48px CyberpunkCraftpixPixel";
      this.ctx.fillStyle = "#ff0066";
      this.ctx.textAlign = "center";
      this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.gameOverY);
      this.ctx.restore();
    }
  }

  drawStartIntroScreen() {
    if (!this.showStartIntro) return false;
    const btnMusic = document.getElementById("btn-music");
    if (btnMusic) btnMusic.style.display = "none";
    this.ui.drawStartIntro();
    requestAnimationFrame(() => this.draw());
    return true;
  }

  handleOverlayScreens() {
    if (this.showImpressumOverlay) return this.drawOverlay(this.ui.drawImpressumOverlay);
    if (this.showIntro) return this.drawOverlay(this.ui.drawIntroScreen);
    if (this.showControlsOverlay) return this.drawOverlay(this.ui.drawControlsOverlay);
    if (this.showOptionsMenu) return this.drawOverlay(this.ui.drawOptionsMenu);
    return false;
  }

  drawOverlay(drawFunction) {
    drawFunction.call(this.ui);
    requestAnimationFrame(() => this.draw());
    return true;
  }

  handleIntroMusic() {
    const introMusic = document.getElementById("intro-music");
    const shouldPlay = this.showIntro || this.showImpressumOverlay || (this.showControlsOverlay && this.fromIntroToControls);
    if (shouldPlay && introMusic?.paused) {
      introMusic.volume = 0.01;
      introMusic.currentTime = 32;
    } else if (!shouldPlay && introMusic && !introMusic.paused) {
      introMusic.pause();
      introMusic.currentTime = 0;
    }
  }

  drawHP() {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("HP: " + this.character.energy, 20 - this.camera_x, 30);
  }

  drawBackgroundObjects() {
    this.level.backgroundObjects.forEach((bgObj) => {
      const scrollX = this.camera_x * bgObj.speedModifier;
      const originalX = bgObj.x;
      bgObj.x = originalX + scrollX;
      this.addToMap(bgObj);
      bgObj.x = originalX;
    });
  }

  addObjectsToMap(objects) {
    if (!Array.isArray(objects)) return;
    objects.forEach((obj) => this.addToMap(obj));
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame?.(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  shakeCamera(duration = 500, intensity = 10) {
    const startTime = Date.now();
    const originalX = this.camera_x;
    const shakeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(shakeInterval);
        this.camera_x = originalX;
      } else {
        this.camera_x = originalX + Math.sin(elapsed / 50) * intensity;
      }
    }, 16);
  }

  endGame() {
    this.showEndscreen = true;
    this.ui.activeMenuButton = "restart-game";
    this.ui.menuOptions = ["restart-game", "back-to-menu"];
    if (this.touchOverlay) this.touchOverlay.disabled = true;
  }
}
