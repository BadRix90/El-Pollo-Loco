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

  IMAGES_BULLETS = [
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/9.png",
    "img/cyberpunk-characters-pixel-art/guns/5 Bullets/4_1.png"
  ];

  constructor(x, y, direction, bulletType, owner) {
    super().loadImage(this.IMAGES_BULLETS[bulletType]);
    console.log(this.IMAGES_BULLETS[bulletType]);
    this.bulletType = bulletType;
    this.loadImages(this.IMAGES_BULLETS);
    this.loadImages(this.IMAGES_SHOOT_EFFECT);
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 5;
    this.speed = 10;
    this.direction = direction;
    this.maxDistance = 500;
    this.travelledDistance = 0;
    this.owner = owner;
    this.animate();
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
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
      this.playAnimation([this.IMAGES_BULLETS[this.bulletType]]);
    }, 50);

  }
}

class BulletManager {
  constructor(world) {
    this.world = world;
  }

  spawnBullet(x, y, direction, owner, bulletType) {
    const bullet = new Bullet(x, y, direction, bulletType, owner);
    if (owner === this.world.character) {
      this.world.playerBullets.push(bullet);
      this.world.throwableObjects.push(new ShootEffect(x, y));
    } else {
      this.world.enemyBullets.push(bullet);
    }
  }

  checkBulletHits() {
    const world = this.world;

    world.playerBullets.forEach((bullet) => {
      if (!bullet.markedForDeletion) {
        world.level.enemies.forEach((enemy) => {
          if (bullet.isColliding(enemy)) {
            enemy.hit(50);
            bullet.markedForDeletion = true;
          }
        });

        if (world.level.endboss && bullet.isColliding(world.level.endboss)) {
          world.level.endboss.hit(30);
          bullet.markedForDeletion = true;
        }
      }
    });

    world.enemyBullets.forEach((bullet) => {
      if (!bullet.markedForDeletion && bullet.isColliding(world.character)) {
        const damage = 10;
        world.character.hit(damage);
        world.statusBar.setPercentage(world.character.energy);
        bullet.markedForDeletion = true;
      }
    });

    world.playerBullets = world.playerBullets.filter(b => !b.markedForDeletion);
    world.enemyBullets = world.enemyBullets.filter(b => !b.markedForDeletion);
  }

  removeOffscreenBullets() {
    this.world.playerBullets = this.world.playerBullets.filter(b => !b.markedForDeletion);
  }
}


class ShootEffect extends MovableObject {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.lifeTime = 200;

    this.IMAGES = [
      "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/1_1.png",
      "img/cyberpunk-characters-pixel-art/guns/4 Shoot_effects/1_2.png"
    ];

    this.loadImages(this.IMAGES);
    this.playAnimation(this.IMAGES);

    setTimeout(() => {
      this.markedForDeletion = true;
    }, this.lifeTime);
  }
}
