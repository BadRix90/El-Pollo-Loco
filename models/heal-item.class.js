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
          this.world.character.energy = Math.min(this.world.character.energy + 10, 100);  // Charakter heilt um 10, maximal 100 HP
          this.world.statusBar.setPercentage(this.world.character.energy);
          this.remove();  // Entfernt das Item nach dem Sammeln
        }
      }
      


  remove() {
    const index = this.world.healItems.indexOf(this);
    if (index !== -1) {
      this.world.healItems.splice(index, 1);  // Entfernt das Item aus dem Array
    }
  }
}
  