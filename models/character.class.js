class Character extends MovableObject {
  imageCache = {};
  currentImage = 0;
  isShooting = false;
  lastShotTime = 0;
  shootCooldown = 500;
  alreadyShot = false;
  canDoubleJump = false;
  lastJumpTime = 0;
  doubleJumpWindow = 250;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
