/**
 * Handles all world logic, rendering, and game loop updates.
 */
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
   * Initializes the game world.
   * @param {HTMLCanvasElement} canvas 
   * @param {Keyboard} keyboard 
   */
  constructor(canvas, keyboard) {
    this.setupCanvas(canvas);
    this.keyboard = keyboard;
    this.initializeWorld();
    this.draw();
  }

  /**
   * Sets up canvas context.
   * @param {HTMLCanvasElement} canvas 
   */
  setupCanvas(canvas) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
  }

  /**
   * Initializes all world components.
   */
  initializeWorld() {
    this.initializeComponents();
    this.initializeAudio();
    this.initializeUI();
    this.setWorld();
    this.run();
  }

  /**
   * Initializes game entities and managers.
   */
  initializeComponents() {
    this.character.world = this;
    this.events = new EventManager(this);
    this.ui = new UIManager(this);
    this.weather = new WeatherSystem(this.canvas);
    this.bullets = new BulletManager(this);
    this.touchOverlay = new TouchOverlay(this.canvas, this.keyboard);
    this.uiHandler = new WorldUI(this);
  }

  /**
   * Initializes audio system if available.
   */
  initializeAudio() {
    if (typeof initializeAudio === "function") {
      initializeAudio();
    }
  }

  /**
   * Initializes UI-related state.
   */
  initializeUI() {
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

  /**
   * Resets intro music to initial state.
   */
  resetIntroMusic() {
    const introMusic = document.getElementById("intro-music");
    if (introMusic) {
      introMusic.pause();
      introMusic.currentTime = 0;
    }
  }

  /**
   * Assigns world references and spawns items.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => {
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

  /**
   * Spawns healing items into the world.
   */
  spawnHealItems() {
    const positions = [1000, 2000, 4500];
    positions.forEach(pos => this.healItems.push(new HealItem(pos, 300, this)));
  }

  /**
   * Starts the main game loop.
   */
  run() {
    setInterval(() => this.updateWorldState(), 1000 / 60);
  }

  /**
   * Updates world logic each frame.
   */
  updateWorldState() {
    this.checkCollisions();
    this.bullets.checkBulletHits();
    this.bullets.removeMarkedBullets();
    this.checkEndbossAttack();
    this.cleanupObjects();
  }

  /**
   * Removes deleted throwable objects.
   */
  cleanupObjects() {
    this.throwableObjects = this.throwableObjects.filter(o => !o.markedForDeletion);
  }

  /**
   * Checks for collisions with enemies and items.
   */
  checkCollisions() {
    this.level.enemies.forEach(enemy => {
      if (!enemy.isDead() && this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
    this.healItems.forEach(item => item.collect());
    if (this.character.isDead() && !this.showEndscreen) {
      this.endGame();
    }
  }

  /**
   * Triggers endboss attack if player is near.
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
   * Main draw loop.
   */
  draw() {
    this.menuButtons = [];
    if (this.showEndscreen) return this.drawEndscreenFrame();
    if (this.handleOverlayScreens()) return;
    if (this.drawStartIntroScreen()) return;
    this.drawWorld();
    this.drawLoopId = requestAnimationFrame(() => this.draw());
    this.drawGameOverText();
  }

  /**
   * Draws endscreen frame.
   */
  drawEndscreenFrame() {
    this.ui.drawEndscreen();
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Handles drawing intro overlays or menu screens.
   */
  handleOverlayScreens() {
    if (this.showImpressumOverlay) return this.drawOverlay(this.ui.drawImpressumOverlay);
    if (this.showIntro) return this.drawOverlay(this.ui.drawIntroScreen);
    if (this.showControlsOverlay) return this.drawOverlay(this.ui.drawControlsOverlay);
    if (this.showOptionsMenu) return this.drawOverlay(this.ui.drawOptionsMenu);
    return false;
  }

  /**
   * Draws a given overlay function.
   * @param {Function} drawFunction 
   */
  drawOverlay(drawFunction) {
    drawFunction.call(this.ui);
    requestAnimationFrame(() => this.draw());
    return true;
  }

  /**
   * Draws the start intro screen.
   */
  drawStartIntroScreen() {
    if (!this.showStartIntro) return false;
    document.getElementById("btn-music")?.style.setProperty("display", "none");
    this.ui.drawStartIntro();
    requestAnimationFrame(() => this.draw());
    return true;
  }

  /**
   * Draws the entire world.
   */
  drawWorld() {
    this.clearCanvas();
    this.drawBackground();
    this.drawEntities();
    this.touchOverlay?.draw(this.ctx);
  }

  /**
   * Clears the canvas.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws background objects with parallax.
   */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.level.backgroundObjects.forEach(bgObj => {
      const scrollX = this.camera_x * bgObj.speedModifier;
      const originalX = bgObj.x;
      bgObj.x = originalX + scrollX;
      this.addToMap(bgObj);
      bgObj.x = originalX;
    });
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws main world entities.
   */
  drawEntities() {
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.street);
    if (this.policeCar) this.addToMap(this.policeCar);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.playerBullets);
    this.addObjectsToMap(this.enemyBullets);
    this.addObjectsToMap(this.activeBombs);
    this.addObjectsToMap(this.healItems);
    this.ctx.translate(-this.camera_x, 0);
    this.drawComingSoon();
  }

  /**
   * Adds multiple objects to map.
   * @param {Array} objects 
   */
  addObjectsToMap(objects) {
    if (!Array.isArray(objects)) return;
    objects.forEach(obj => this.addToMap(obj));
  }

  /**
   * Draws a single map object.
   * @param {Object} mo 
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame?.(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Flips image horizontally.
   * @param {Object} mo 
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Resets image flip.
   * @param {Object} mo 
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Draws 'COMING SOON' at end of map.
   */
  drawComingSoon() {
    this.ctx.save();
    this.ctx.font = "32px CyberpunkCraftpixPixel";
    this.ctx.fillStyle = "#ff00ff";
    this.ctx.textAlign = "center";
    this.ctx.fillText("COMING SOON", 7100, 300);
    this.ctx.fillText("--->", 7100, 250);
    this.ctx.restore();
  }

  /**
   * Draws animated 'Game Over' text.
   */
  drawGameOverText() {
    if (!this.showGameOver) return;
    if (this.gameOverY < this.canvas.height / 2) this.gameOverY += 5;
    this.ctx.save();
    this.ctx.font = "48px CyberpunkCraftpixPixel";
    this.ctx.fillStyle = "#ff0066";
    this.ctx.textAlign = "center";
    this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.gameOverY);
    this.ctx.restore();
  }

  /**
   * Triggers end of game sequence.
   */
  endGame() {
    this.showEndscreen = true;
    this.ui.activeMenuButton = "restart-game";
    this.ui.menuOptions = ["restart-game", "back-to-menu"];
    if (this.touchOverlay) this.touchOverlay.disabled = true;
  }

  /**
   * Shakes the camera for effect.
   * @param {number} duration 
   * @param {number} intensity 
   */
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
}
