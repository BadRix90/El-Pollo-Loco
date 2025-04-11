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
  showMainMenu = true;
  introY = -100;
  showIntro = true;
  showStartButton = false;
  introStep = 0;
  selectedCharacter = null;
  confirmCharacter = false;
  showCharacterSelect = false;
  showOptionsMenu = false;
  showControlsOverlay = false;
  policeCar = null;
  touchOverlay = null;


  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character.world = this;
    this.events = new EventManager(this);
    this.ui = new UIManager(this);
    this.weather = new WeatherSystem(this.canvas);
    this.bullets = new BulletManager(this);
    this.touchOverlay = new TouchOverlay(this.canvas, this.keyboard);
    this.draw();
    this.setWorld();
    this.run();
    this.hoverX = 0;
    this.hoverY = 0;
    this.lyricInterval = null;
    this.fromIntroToControls = false;

    this.lyricSetupInterval = setInterval(() => {
      if (this.introStep === 0 && !this.lyricInterval && this.introY >= 180) {
        this.showLyrics = true;
        this.lyricIndex = 0;
        this.lyricInterval = setInterval(() => {
          this.lyricIndex++;
          if (this.lyricIndex >= this.introLyrics.length) {
            clearInterval(this.lyricInterval);
            this.lyricInterval = null;
            this.showLyrics = false;
            this.introStep = 1;
            this.showStartButton = true;
          }
        }, 3000);
      }
    }, 100);


    this.introLyrics = [
      "The silence of a tortured heart",
      "Is telling you to start",
      "To fight the monsters that hurt you in the dark",
      "They fear the fire and you're the spark",
      "Power of the Beast is all you need"
    ];
    this.lyricIndex = 0;
    this.lyricY = this.canvas.height - 80;
    this.showLyrics = true;
  }

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

    let healItem1 = new HealItem(1000, 300, this);
    let healItem2 = new HealItem(2000, 300, this);
    let healItem3 = new HealItem(4500, 300, this);

    this.healItems.push(healItem1, healItem2, healItem3);
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.bullets.checkBulletHits();
      this.bullets.removeOffscreenBullets();
      this.checkEndbossAttack();
      this.throwableObjects = this.throwableObjects.filter(o => !o.markedForDeletion);
    }, 100);
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead() && this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        this.healItems.forEach((item) => item.collect());
      }
    });
    this.healItems.forEach((item) => {
      item.collect();
    });
  }

  checkEndbossAttack() {
    if (!this.level.endboss || this.level.endboss.isDead()) return;

    const distance = Math.abs(this.character.x - this.level.endboss.x);
    const attackRange = 250;

    if (distance < attackRange) {
      this.level.endboss.startAttack();
      if (!this.character.isHurt()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    }
  }

  draw() {
    if (this.showIntro) {
      this.ui.drawIntroScreen();
      requestAnimationFrame(() => this.draw());
      return;
    }

    if (this.showControlsOverlay) {
      this.ui.drawControlsOverlay();
      requestAnimationFrame(() => this.draw());
      return;
    }

    if (this.showOptionsMenu) {
      this.ui.drawOptionsMenu();
      requestAnimationFrame(() => this.draw());
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundObjects();

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.street);
    if (this.policeCar) {
      this.addToMap(this.policeCar);
    }
    this.addToMap(this.character);

    this.addObjectsToMap(this.level.enemies);

    this.addObjectsToMap(this.playerBullets);
    this.addObjectsToMap(this.enemyBullets);
    this.addObjectsToMap(this.activeBombs);
    this.addObjectsToMap(this.healItems);

    this.ctx.save();
    this.ctx.font = "32px CyberpunkCraftpixPixel";
    this.ctx.fillStyle = "#ff00ff";
    this.ctx.textAlign = "center";
    this.ctx.fillText("COMING SOON", 7100, 300);
    this.ctx.fillText("--->", 7100, 250);
    this.ctx.restore();

    this.ctx.translate(-this.camera_x, 0);

    this.ctx.font = "16px CyberpunkCraftpixPixel";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "right";
    const menuText = window.innerWidth >= 768 ? "ESC for Menu" : "Click for Menu";
    this.ctx.fillText(menuText, this.canvas.width - 20, 30);


    this.menuButtons = this.menuButtons || [];
    this.menuButtons.push({
      x: this.canvas.width - 140,
      y: 15,
      w: 120,
      h: 20,
      action: "toggle-menu"
    });

    this.weather.drawRain();
    this.touchOverlay.draw(this.ctx);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  handleMenuAction(action) {
    if (action === "start") {
      this.showIntro = false;
      this.showMainMenu = false;
      toggleMusic();
      this.policeCar = new PoliceCar(this);
    } else if (action === "music" || action === "sound-toggle") {
      toggleMusic();
    } else if (action === "restart") {
      this.restartGame();
    } else if (action === "exit") {
      clearInterval(this.lyricSetupInterval);
      clearInterval(this.lyricInterval);
      this.lyricInterval = null;
      this.lyricSetupInterval = null;

      const bgm = document.getElementById('background-music');
      if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
      }

      this.level = level1;
      this.character = new Character();
      this.character.world = this;
      this.statusBar = new StatusBar();
      this.throwableObjects = [];
      this.enemyBullets = [];
      this.activeBombs = [];
      this.playerBullets = [];
      this.healItems = [];
      this.camera_x = 0;

      this.introY = 180;
      this.introStep = 2;
      this.showLyrics = false;
      this.showIntro = true;
      this.showStartButton = true;
      this.showOptionsMenu = false;

      this.setWorld();
    } else if (action === "controls") {
      if (this.showIntro) {
        this.fromIntroToControls = true;
        this.showIntro = false;
      } else {
        this.fromIntroToControls = false;
      }

      this.showControlsOverlay = true;

    } else if (action === "back-to-menu") {
      if (this.showControlsOverlay) {
        this.showControlsOverlay = false;
        if (this.fromIntroToControls) {
          this.showIntro = true;
          this.showStartButton = true;
          this.introStep = 2;
        } else {
          this.showOptionsMenu = true;
        }
      }
    } else if (action === "toggle-menu") {
      this.showOptionsMenu = !this.showOptionsMenu;
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
      let originalX = bgObj.x;
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
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame?.(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
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
    let startTime = Date.now();
    let originalX = this.camera_x;

    let shakeInterval = setInterval(() => {
      let elapsed = Date.now() - startTime;

      if (elapsed >= duration) {
        clearInterval(shakeInterval);
        this.camera_x = originalX;
      } else {
        this.camera_x = originalX + Math.sin(elapsed / 50) * intensity;
      }
    }, 16);
  }

  restartGame() {
    clearInterval(this.lyricSetupInterval);
    clearInterval(this.lyricInterval);
    this.lyricInterval = null;
    this.lyricSetupInterval = null;

    this.level = level1;
    this.character = new Character();
    this.character.world = this;
    this.statusBar = new StatusBar();
    this.throwableObjects = [];
    this.enemyBullets = [];
    this.activeBombs = [];
    this.playerBullets = [];
    this.healItems = [];
    this.camera_x = 0;
    this.policeCar = new PoliceCar(this);
    this.showIntro = false;
    this.showMainMenu = false;
    this.showOptionsMenu = false;
    this.showStartButton = false;
    this.showLyrics = false;
    this.introStep = 1;
    this.introY = -100;

    const bgm = document.getElementById('background-music');
    if (bgm) {
      bgm.pause();
      bgm.currentTime = 0;
      bgm.play();
    }

    this.setWorld();
  }

}