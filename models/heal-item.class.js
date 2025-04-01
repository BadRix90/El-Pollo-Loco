class HealItem extends DrawableObject {
  constructor(x, y, world) {
    super().loadImage("img/GUI/9 Other/3 Skill icons/Skillicon7_11.png");
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 48;
    this.world = world;
  }

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

  collect() {
    if (this.isCollidingWithCharacter()) {
      const healedAmount =
        this.world.character.maxEnergy - this.world.character.energy;
      this.world.character.energy = this.world.character.maxEnergy;
      console.log(`🍀 Healed: ${healedAmount} HP`);
      console.log(`New HP: ${this.world.character.energy} HP`);

      this.world.statusBar.setPercentage(
        Math.round(
          (this.world.character.energy / this.world.character.maxEnergy) * 100
        )
      );

      this.remove();
    }
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }  

  remove() {
    const index = this.world.healItems.indexOf(this);
    if (index !== -1) {
      this.world.healItems.splice(index, 1);
    }
  }
}
