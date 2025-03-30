class HealItem extends DrawableObject {
  constructor(x, y, world) {
    super().loadImage(
      "img/cyberpunk-characters-pixel-art/icons/glitch effect/without background/18.png"
    );
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 48;
    this.world = world;
  }

  isCollidingWithCharacter() {
    const character = this.world.character;
    const isColliding =
      this.x < character.x + character.width &&
      this.x + this.width > character.x &&
      this.y < character.y + character.height &&
      this.y + this.height > character.y;
    return isColliding;
  }

  collect() {
    if (this.isCollidingWithCharacter()) {
      const healedAmount =
        this.world.character.maxEnergy - this.world.character.energy;
      this.world.character.energy = this.world.character.maxEnergy;
      console.log(`🍀 Healed: ${healedAmount} HP`);
      console.log(`New HP: ${this.world.character.energy} HP`);
  
      this.world.statusBar.setPercentage(
        Math.round((this.world.character.energy / this.world.character.maxEnergy) * 100)
      );
  
      this.remove();
    }
  }
  

  remove() {
    const index = this.world.healItems.indexOf(this);
    if (index !== -1) {
      this.world.healItems.splice(index, 1);
    }
  }
}
