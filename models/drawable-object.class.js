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
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  drawFrame(ctx) {
    if (this.hitboxOffset) {
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "lime";
      ctx.rect(
        this.x + this.hitboxOffset.left,
        this.y + this.hitboxOffset.top,
        this.width - this.hitboxOffset.left - this.hitboxOffset.right,
        this.height - this.hitboxOffset.top - this.hitboxOffset.bottom
      );
      ctx.stroke();
    }
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
