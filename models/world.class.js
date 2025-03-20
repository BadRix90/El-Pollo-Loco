class World {
  character = new Character();
  // enemies = [new Chicken(), new Chicken(), new Chicken()];
  enemies = Array.from(
    { length: Math.floor(Math.random() * 4) + 2 },
    () => new Chicken()
  );

  clouds = [new Cloud()];

  backgroundObjects = [
    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/air.png", 719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
  ];

  backgroundWidth = 719 * 2;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);

    this.drawBackgroundObjects()

    this.addToMap(this.character);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  drawBackgroundObjects() {
    const cameraXAbs = Math.abs(this.camera_x)
    const startSection = Math.floor(cameraXAbs / this.backgroundWidth) - 1
    const visibleSections = Math.ceil(this.canvas.width / this.backgroundWidth) + 2

    for (let i = 0; i < visibleSections; i++) {
      const sectionX = (startSection + i) * this.backgroundWidth

      this.backgroundObjects.forEach((bgObj) => {
        const tempObj = {
          ...bgObj,
          x: bgObj.x + sectionX,
          img: bgObj.img,
          width: bgObj.width,
          height: bgObj.height,
        }
        this.addToMap(tempObj)
      })
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mo.width, 0);
      this.ctx.scale(-1, 1);
      mo.x = mo.x * -1;
    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    if (mo.otherDirection) {
      mo.x = mo.x * -1;
      this.ctx.restore();
    }
  }
}
