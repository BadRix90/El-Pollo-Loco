class HealItem extends DrawableObject {
    constructor(x, y, world) {
      super().loadImage("img/cyberpunk-characters-pixel-art/icons/glitch effect/without background/18.png");
      this.x = x;
      this.y = y;
      this.width = 48;
      this.height = 48;
      this.world = world;
    }
  

isCollidingWithCharacter() {
    return (
      this.x < this.world.character.x + this.world.character.width &&
      this.x + this.width > this.world.character.x &&
      this.y < this.world.character.y + this.world.character.height &&
      this.y + this.height > this.world.character.y
    );
  }

  collect() {
    if (this.isCollidingWithCharacter()) {
      console.log("🍀 Character healed!");
      this.world.character.energy = Math.min(this.world.character.energy + 10, 100);  // Charakter heilt um 10, maximal 100 HP
      this.world.statusBar.setPercentage(this.world.character.energy);
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
  