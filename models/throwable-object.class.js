class Bullet extends MovableObject {
  IMAGES_SHOOT_EFFECT = [
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/1_1.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/1_2.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/2_1.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/2_2.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/3_1.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/3_2.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/4_1.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/4_2.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/5_1.png",
    "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/5_2.png",
  ];

  IMAGES_BULLETS = ["img/cyberpunk-characters-pixel-art/guns/5 Bullets/9.png"];

  constructor(x, y, direction, bulletType, owner) {
    super().loadImage(this.IMAGES_BULLETS[bulletType]);
    this.loadImages(this.IMAGES_BULLETS);
    this.loadImages(this.IMAGES_SHOOT_EFFECT);
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 10;
    this.speed = 10;
    this.direction = direction;
    this.maxDistance = 500;
    this.travelledDistance = 0;
    this.owner = owner;
    this.animate();
    this.effectFrame = 0;
    this.effectActive = true;
    this.effectX = this.x + (this.direction === -1 ? -50 : this.width - 20);
    this.effectY = this.y - 10;
  }

  draw(ctx) {
    if (this.visible !== false) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    if (this.effectActive) {
      const path =
        this.IMAGES_SHOOT_EFFECT[
          this.effectFrame % this.IMAGES_SHOOT_EFFECT.length
        ];
      const img = this.imageCache[path];

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, this.effectX, this.effectY, 30, 30);
      }
    }
  }

  animate() {
    setInterval(() => {
      this.x += this.speed * this.direction;
      this.travelledDistance += this.speed;
      if (this.travelledDistance >= this.maxDistance) {
        this.markedForDeletion = true;
      }
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_BULLETS);
    }, 50);

    let effectInterval = setInterval(() => {
      if (this.effectActive) {
        this.effectFrame++;
      }
    }, 50);

    setTimeout(() => {
      this.effectActive = false;
      clearInterval(effectInterval);
    }, 300);
  }
}
