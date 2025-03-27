class Bullet extends MovableObject {
  IMAGES_BULLETS = [
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/1.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/2.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/3.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/4.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/5.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/6.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/7_1.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/7_2.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/8.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/9.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/10.png",
  ];

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

  constructor(x, y, direction, bulletType, owner) {
    super().loadImage(this.IMAGES_BULLETS[bulletType]);
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
  }

  animate() {
    setInterval(() => {
      this.x += this.speed * this.direction;
      this.travelledDistance += this.speed;
      if (this.travelledDistance >= this.maxDistance) {
        this.markedForDeletion = true;
      }
    }, 1000 / 60); 
  }
}
