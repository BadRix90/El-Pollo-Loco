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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character.world = this;
    this.draw();
    this.setWorld();
    this.run();
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
}
