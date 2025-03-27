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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character.world = this;
    this.draw();
    this.setWorld();
    this.run();
    this.playerBullets = [];
    this.enemyBullets = [];
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
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkBulletHits();
      this.removeOffscreenBullets();
      this.handleShootingEnemy();
    }, 100);
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
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
      }
    });

    this.enemyBullets.forEach((bullet) => {
      if (!bullet.markedForDeletion && !this.character.isDead()) {
        if (bullet.isColliding(this.character)) {
          this.character.hit(5);
          bullet.markedForDeletion = true;
        }
      }
    });

    this.playerBullets = this.playerBullets.filter(
      (bullet) => !bullet.markedForDeletion
    );
    this.enemyBullets = this.enemyBullets.filter(
      (bullet) => !bullet.markedForDeletion
    );
  }

  removeOffscreenBullets() {
    this.playerBullets = this.playerBullets.filter(
      (bullet) => bullet.x > 0 && bullet.x < this.canvas.width
    );
    this.enemyBullets = this.enemyBullets.filter(
      (bullet) => bullet.x > 0 && bullet.x < this.canvas.width
    );
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundObjects();

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.street);
    this.addToMap(this.character);

    this.addObjectsToMap(this.level.enemies);

    this.addObjectsToMap(this.playerBullets);
    this.addObjectsToMap(this.enemyBullets);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
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
    mo.drawFrame(this.ctx); //frame in rot

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

  handleShootingEnemy() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isShooting) {
        const now = Date.now();
        if (now - enemy.lastShotTime >= enemy.shootCooldown) {
          const bulletX = enemy.x + (enemy.otherDirection ? 25 : enemy.width - 35);
          const bulletY = enemy.y + enemy.height / 2 + 25;
          const direction = enemy.otherDirection ? -1 : 1;
          this.spawnBullet(bulletX, bulletY, direction, enemy, 0);
          enemy.lastShotTime = now;
        }
      }
    });
  }
 

  spawnBullet(x, y, direction, owner, bulletType) {
    const bullet = new Bullet(x, y, direction, bulletType, owner);

    if (owner === this.character) {
      this.playerBullets.push(bullet);
    } else {
      this.enemyBullets.push(bullet);
    }
  }
}
