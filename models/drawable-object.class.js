class DrawableObject {
  img;
  imageCache = [];
  currentImage = 0;
  x = 120;
  y = 250;
  height = 150;
  width = 100;


  /**
 * Loads a single image and sets it as the current image.
 * @param {string} path - The file path to the image.
 */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }


  /**
 * Draws the current image to the given canvas context.
 * If the object is a Character, it optionally draws attached weapon and hand images.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 */
  draw(ctx) {
    this.drawSelf(ctx);
    if (this instanceof Character) {
      this.drawCharacterExtras(ctx);
    }
    this.drawSelf(ctx); // (falls wirklich doppelt nötig)
  }

  /**
   * Draws the main image.
   */
  drawSelf(ctx) {
    if (this.img instanceof HTMLImageElement && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Draws additional parts for characters like hands and weapons.
   */
  drawCharacterExtras(ctx) {
    if (this.currentHandImage) {
      ctx.drawImage(this.currentHandImage, this.x, this.y, this.width, this.height);
    }
    if (this.currentWeaponImage) {
      ctx.drawImage(this.currentWeaponImage, this.x, this.y, this.width, this.height);
    }
  }

  /**
 * Loads multiple images and stores them in the image cache for animation purposes.
 * @param {string[]} arr - An array of image file paths to load.
 */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

}
