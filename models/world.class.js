class World {
  level = level1;
  character = null;
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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.hoverX = 0;
    this.hoverY = 0;

    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (this.showCharacterSelect) {
        if (clickX >= 150 && clickX <= 290 && clickY >= 140 && clickY <= 360) {
          this.handleCharacterClick("punk");
        }

        if (clickX >= 430 && clickX <= 570 && clickY >= 140 && clickY <= 360) {
          this.handleCharacterClick("cyborg");
        }

        if (
          this.selectedCharacter &&
          clickX >= 280 &&
          clickX <= 440 &&
          clickY >= 380 &&
          clickY <= 420
        ) {
          this.confirmCharacter = true;
          this.startGameWithCharacter();
        }

        return;
      }
    });
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
      this.checkBulletHits();
      this.removeOffscreenBullets();
      this.checkEndbossAttack();
      this.checkCollisions();
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

  checkBulletHits() {
    this.playerBullets.forEach((bullet) => {
      if (!bullet.markedForDeletion) {
        this.level.enemies.forEach((enemy) => {
          if (bullet.isColliding(enemy)) {
            enemy.hit(50);
            bullet.markedForDeletion = true;
          }
        });

        if (this.level.endboss && bullet.isColliding(this.level.endboss)) {
          this.level.endboss.hit(30);
          bullet.markedForDeletion = true;
        }
      }
    });

    this.enemyBullets.forEach((bullet) => {
      if (!bullet.markedForDeletion && bullet.isColliding(this.character)) {
        const damage = 10;
        this.character.hit(damage);
        this.statusBar.setPercentage(this.character.energy);
        bullet.markedForDeletion = true;
      }
    });

    this.playerBullets = this.playerBullets.filter((b) => !b.markedForDeletion);
    this.enemyBullets = this.enemyBullets.filter((b) => !b.markedForDeletion);
  }

  removeOffscreenBullets() {
    this.playerBullets = this.playerBullets.filter((b) => !b.markedForDeletion);
  }

  spawnBullet(x, y, direction, owner, bulletType) {
    const bullet = new Bullet(x, y, direction, bulletType, owner);

    if (owner === this.character) {
      this.playerBullets.push(bullet);
    } else {
      this.enemyBullets.push(bullet);
    }
  }

  draw() {
    if (this.showIntro) {
      this.drawIntroScreen();
      requestAnimationFrame(() => this.draw());
      return;
    }

    if (this.showCharacterSelect) {
      this.drawCharacterSelection();
      requestAnimationFrame(() => this.draw());
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundObjects();

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);

    this.ctx.translate(this.camera_x, 0);
    this.drawHP();
    this.addObjectsToMap(this.level.street);
    this.addToMap(this.character);

    this.addObjectsToMap(this.level.enemies);

    this.addObjectsToMap(this.playerBullets);
    this.addObjectsToMap(this.enemyBullets);
    this.addObjectsToMap(this.activeBombs);
    this.addObjectsToMap(this.healItems);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });

    if (this.showMainMenu) {
      this.drawMainMenu();
      return;
    }
  }

  drawMainMenu() {
    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.font = "32px CyberpunkCraftpixPixel";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Blade Runner", centerX, 120);

    this.drawButton(centerX, 200, 200, 40, "Start Game", "start");
    this.drawButton(centerX, 260, 200, 40, "Music On/Off", "music");
    this.drawButton(centerX, 320, 200, 40, "Controls", "controls");

    ctx.restore();
  }

  drawButton(x, y, w, h, text, action) {
    const ctx = this.ctx;
    const isHovered =
      this.hoverX >= x - w / 2 &&
      this.hoverX <= x + w / 2 &&
      this.hoverY >= y - h / 2 &&
      this.hoverY <= y + h / 2;

    ctx.fillStyle = "thistle";
    ctx.fillRect(x - w / 2, y - h / 2, w, h);

    ctx.strokeStyle = "#000";
    ctx.strokeRect(x - w / 2, y - h / 2, w, h);

    ctx.fillStyle = isHovered ? "#444" : "#000";
    ctx.font = "16px CyberpunkCraftpixPixel";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 5);

    this.menuButtons = this.menuButtons || [];
    this.menuButtons.push({ x: x - w / 2, y: y - h / 2, w, h, action });
  }

  handleMenuAction(action) {
    if (action === "start") {
      this.showIntro = false;
      this.showMainMenu = false;
      this.showCharacterSelect = true;
    } else if (action === "music") {
      toggleMusic();
    } else if (action === "controls") {
      alert("Controls:\n- A/D = bewegen\n- SPACE = springen\n- Q = schießen");
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

  drawIntroScreen() {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.font = "40px CyberpunkCraftpixPixel";
    ctx.fillStyle = "#00fff7";
    ctx.textAlign = "center";
    ctx.fillText("Blade Runner", this.canvas.width / 2, this.introY);

    if (this.introY < 180) {
      this.introY += 2;
    } else if (this.introStep === 0) {
      setTimeout(() => {
        this.introStep = 1;
        this.showStartButton = true;
      }, 1000);
      this.introStep = -1;
    }

    if (this.introStep >= 1) {
      ctx.font = "20px CyberpunkCraftpixPixel";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        "Created by Kay Dietrich",
        this.canvas.width / 2,
        this.introY + 60
      );
    }

    if (this.showStartButton) {
      this.drawButton(
        this.canvas.width / 2,
        this.introY + 120,
        160,
        40,
        "START",
        "start"
      );
    }

    ctx.restore();
  }

  drawCharacterSelection() {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.font = "28px CyberpunkCraftpixPixel";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Choose Your Runner", this.canvas.width / 2, 80);

    const punkX = 150;
    const punkY = 140;
    ctx.fillStyle = this.selectedCharacter === "punk" ? "#00ffff" : "#888";
    ctx.fillRect(punkX, punkY, 140, 220);
    ctx.fillStyle = "#000";
    ctx.fillText("PUNK", punkX + 70, punkY + 240);

    const cyborgX = 430;
    const cyborgY = 140;
    ctx.fillStyle = this.selectedCharacter === "cyborg" ? "#00ffff" : "#888";
    ctx.fillRect(cyborgX, cyborgY, 140, 220);
    ctx.fillStyle = "#000";
    ctx.fillText("CYBORG", cyborgX + 70, cyborgY + 240);

    if (this.selectedCharacter) {
      this.drawButton(
        this.canvas.width / 2,
        400,
        160,
        40,
        "CONFIRM",
        "confirm"
      );
    }

    ctx.restore();
  }

  handleCharacterClick(choice) {
    if (this.selectedCharacter === choice) {
      this.confirmCharacter = true;
      this.startGameWithCharacter();
    } else {
      this.selectedCharacter = choice;
    }
  }

  startGameWithCharacter() {
    if (this.selectedCharacter === "cyborg") {
      this.character = new CharacterCyborg();
    } else {
      this.character = new CharacterPunk();
    }
  
    this.character.world = this;
    this.setWorld();
    this.run();
  }
  








































}
