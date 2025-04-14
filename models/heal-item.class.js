class HealItem extends DrawableObject {

  /**
 * Creates a new HealItem at a given position and links it to the game world.
 * @param {number} x - The x-coordinate of the heal item.
 * @param {number} y - The y-coordinate of the heal item.
 * @param {World} world - The game world instance.
 */
  constructor(x, y, world) {
    super().loadImage("img/GUI/9 Other/3 Skill icons/Skillicon7_11.png");
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 48;
    this.world = world;
  }


  /**
 * Checks whether the heal item is colliding with the player character.
 * @returns {boolean} True if the item collides with the character.
 */
  isCollidingWithCharacter() {
    const a = this.getHitbox();
    const b = this.world.character.getHitbox();

    return (
      a.x + a.width > b.x &&
      a.x < b.x + b.width &&
      a.y + a.height > b.y &&
      a.y < b.y + b.height
    );
  }


  /**
 * Heals the character to full energy if a collision occurs.
 * Updates the status bar and removes the item from the world.
 */
  collect() {
    if (this.isCollidingWithCharacter()) {
      const healedAmount =
        this.world.character.maxEnergy - this.world.character.energy;
      this.world.character.energy = this.world.character.maxEnergy;
      this.world.statusBar.setPercentage(
        Math.round(
          (this.world.character.energy / this.world.character.maxEnergy) * 100
        )
      );

      this.remove();
    }
  }


  /**
 * Returns the hitbox of the heal item for collision detection.
 * @returns {{x: number, y: number, width: number, height: number}} The hitbox rectangle.
 */
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }  


  /**
 * Removes the heal item from the world's list of active heal items.
 */
  remove() {
    const index = this.world.healItems.indexOf(this);
    if (index !== -1) {
      this.world.healItems.splice(index, 1);
    }
  }
}
