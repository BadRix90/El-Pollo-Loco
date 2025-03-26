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

  /**
   * Checks if bullets hit any enemies and applies damage.
   */
  checkBulletHits() {
    const bulletsToKeep = [];
  
    this.throwableObjects.forEach((bullet) => {
      if (bullet.markedForDeletion) {
        bullet.deletionDelay -= bullet.speed;
        if (bullet.deletionDelay <= 0) return;
        bulletsToKeep.push(bullet);
        return;
      }
  

      if (
        !this.character.isDead() &&
        bullet.isColliding(this.character) &&
        bullet.owner !== this.character
      ) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        bullet.markedForDeletion = true;
        bullet.deletionDelay = 5;
        return; 
      }
  
      let hitSomething = false;
  
      this.level.enemies.forEach((enemy) => {
        if (
          !enemy.isDead() &&
          bullet.isColliding(enemy) &&
          bullet.owner !== enemy
        ) {
          enemy.hit(50);
          bullet.markedForDeletion = true;
          bullet.deletionDelay = 10;
          hitSomething = true;
        }
      });
  
      if (
        this.level.endboss &&
        !this.level.endboss.isDead() &&
        bullet.isColliding(this.level.endboss)
      ) {
        this.level.endboss.hit(25);
        bullet.markedForDeletion = true;
        bullet.deletionDelay = 5;
        hitSomething = true;
      }
  
      bulletsToKeep.push(bullet);
    });
  
    this.throwableObjects = bulletsToKeep;
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
    this.addObjectsToMap(this.throwableObjects);
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

  spawnBullet(x, y, direction = 1) {
    const bullet = new Bullet(x, y);
    bullet.speed *= direction;
    this.throwableObjects.push(bullet);
  }

  drawShootEffect(x, y) {
    const effect = new MovableObject();
    effect.loadImages(this.character.IMAGES_SHOOT_EFFECT);
    effect.img = effect.imageCache[this.character.IMAGES_SHOOT_EFFECT[0]];
    effect.width = 40;
    effect.height = 40;
    effect.x = x;
    effect.y = y;
    let frame = 0;

    let interval = setInterval(() => {
      effect.img = effect.imageCache[this.character.IMAGES_SHOOT_EFFECT[frame]];
      frame++;
      if (frame >= this.character.IMAGES_SHOOT_EFFECT.length) {
        clearInterval(interval);
        const index = this.throwableObjects.indexOf(effect);
        if (index > -1) this.throwableObjects.splice(index, 1);
      }
    }, 30);

    this.throwableObjects.push(effect);
  }
}
