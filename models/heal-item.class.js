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
      // Berechne den Heilwert (immer auf 100% der maximalen Energie)
      const healedAmount =
        this.world.character.maxEnergy - this.world.character.energy;

      // Setze die Energie des Charakters auf den Maximalwert
      this.world.character.energy = this.world.character.maxEnergy;

      // Konsolenausgabe für geheilte Energie und neue HP
      console.log(`🍀 Healed: ${healedAmount} HP`);
      console.log(`New HP: ${this.world.character.energy} HP`);

      // Aktualisiere die Statusbar
      this.world.statusBar.setPercentage(this.world.character.energy);

      // Entferne das Item nach dem Sammeln
      this.remove();
    }
  }

  remove() {
    const index = this.world.healItems.indexOf(this);
    if (index !== -1) {
      this.world.healItems.splice(index, 1); // Entfernt das Item aus dem Array
    }
  }
}
