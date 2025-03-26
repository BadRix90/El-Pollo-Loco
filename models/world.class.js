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
    this.throwables = [];
    const enemy = new Enemy();
    enemy.world = this;
    this.level.enemies.push(enemy);
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => {
      enemy.world = this;
      enemy.animate();
    });
  
    if (this.level.endboss) {
      this.level.endboss.world = this;
      this.level.endboss.animate?.();
    }
  }
  

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkBulletHits();
    }, 100);
  }

  checkThrowObjects() {
    if (this.keyboard.q && !this.character.introRunning) {
      let bullet = new Bullet(this.character.x + 100, this.character.y + 100);
      this.throwables.push(bullet);
    }
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
    this.throwables.forEach((bullet, bIndex) => {
      this.level.enemies.forEach((enemy, eIndex) => {
        if (bullet.isColliding(enemy)) {
          enemy.hit();
          this.throwables.splice(bIndex, 1);
        }
      });

      if (this.level.endboss && bullet.isColliding(this.level.endboss)) {
        this.level.endboss.hit();
        this.throwables.splice(bIndex, 1);
      }
    });
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

    this.addObjectsToMap(this.throwables);

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
    mo.drawFrame(this.ctx);

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

  
  
}
