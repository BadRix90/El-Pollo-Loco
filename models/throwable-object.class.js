/**
 * This file contains:
 * - Bullet: handles projectiles
 * - BulletManager: manages bullets
 * - ShootEffect: visual effect when shooting
 */

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

    /**
     * Initializes a Bullet.
     */
    constructor(x, y, direction, bulletType, owner) {
        super();
        this.IMAGES_BULLETS = [
            "img/cyberpunk-characters-pixel-art/guns/5 Bullets/9.png",
            "img/cyberpunk-characters-pixel-art/guns/5 Bullets/4_1.png"
        ];
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 5;
        this.speed = 10;
        this.direction = direction;
        this.maxDistance = 500;
        this.travelledDistance = 0;
        this.owner = owner;
        this.bulletType = bulletType;

        this.img = new Image();
        this.img.src = this.IMAGES_BULLETS[this.bulletType];
        this.animate();
    }


    /**
     * Draws the bullet.
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        if (this.img?.complete && this.img?.naturalWidth > 0) {
            ctx.save();
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            ctx.restore();
        }
    }

    /**
     * Returns bullet's hitbox.
     */
    getHitbox() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    /**
     * Animates bullet movement and animation.
     */
    animate() {
        this.moveBullet();
    }

    /**
     * Moves the bullet and marks for deletion if needed.
     */
    moveBullet() {
        setInterval(() => {
            this.x += this.speed * this.direction;
            this.travelledDistance += this.speed;
            if (this.travelledDistance >= this.maxDistance) {
                this.markedForDeletion = true;
            }
        }, 1000 / 60);
    }

    /**
     * Plays bullet animation.
     */
    animateBulletImage() {
        setInterval(() => {
            this.playAnimation([this.IMAGES_BULLETS[this.bulletType]]);
        }, 50);
    }
}

class BulletManager {
    /**
     * Initializes the BulletManager.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Spawns a bullet.
     */
    spawnBullet(x, y, direction, owner, bulletType) {
        const bullet = new Bullet(x, y, direction, bulletType, owner);
        if (owner === this.world.character) {
            this.world.playerBullets.push(bullet);
            this.world.throwableObjects.push(new ShootEffect(x, y));
        } else {
            this.world.enemyBullets.push(bullet);
        }
    }

    /**
     * Checks bullet collisions.
     */
    checkBulletHits() {
        this.checkPlayerBulletHits();
        this.checkEnemyBulletHits();
        this.removeMarkedBullets();
    }

    /**
     * Checks player bullet collisions.
     */
    checkPlayerBulletHits() {
        const world = this.world;
        world.playerBullets.forEach(bullet => {
            if (!bullet.markedForDeletion) {
                world.level.enemies.forEach(enemy => {
                    if (bullet.isColliding(enemy)) {
                        enemy.hit(50);
                        bullet.markedForDeletion = true;
                    }
                });
                this.checkEndbossCollision(bullet);
            }
        });
    }

    /**
     * Checks enemy bullet collisions.
     */
    checkEnemyBulletHits() {
        const world = this.world;
        world.enemyBullets.forEach(bullet => {
            if (!bullet.markedForDeletion && bullet.isColliding(world.character)) {
                world.character.hit(10);
                world.statusBar.setPercentage(world.character.energy);
                bullet.markedForDeletion = true;
            }
        });
    }

    /**
     * Removes bullets marked for deletion.
     */
    removeMarkedBullets() {
        this.world.playerBullets = this.world.playerBullets.filter(b => !b.markedForDeletion);
        this.world.enemyBullets = this.world.enemyBullets.filter(b => !b.markedForDeletion);
    }

    /**
     * Checks if bullet hits Endboss.
     */
    checkEndbossCollision(bullet) {
        const world = this.world;
        if (world.level.endboss && bullet.isColliding(world.level.endboss)) {
            world.level.endboss.hit(30);
            bullet.markedForDeletion = true;
            if (world.level.endboss.isDead() && !world.endbossDefeatedAt) {
                world.endbossDefeatedAt = Date.now();
                world.showReturnTimer = true;
            }
        }
    }
}

class ShootEffect extends MovableObject {
    /**
     * Creates a new ShootEffect.
     */
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
        this.initDeathTimer();
    }

    /**
     * Starts timer to remove effect.
     */
    initDeathTimer() {
        setTimeout(() => {
            this.markedForDeletion = true;
        }, this.lifeTime);
    }
}
