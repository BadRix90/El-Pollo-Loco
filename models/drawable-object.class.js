class DrawableObject {
  img;
  imageCache = [];
  currentImage = 0;
  x = 120;
  y = 250;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    if (this.visible === false) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    if (this instanceof Character) {
      if (this.currentHandImage) {
        ctx.drawImage(
          this.currentHandImage,
          this.x,
          this.y,
          this.width,
          this.height
        );
      }
      if (this.currentWeaponImage) {
        ctx.drawImage(
          this.currentWeaponImage,
          this.x,
          this.y,
          this.width,
          this.height
        );
      }
    }
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Enemy ||
      this instanceof Endboss
    ) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "red";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
}
