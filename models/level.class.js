class Level {
  enemies;
  street;
  backgroundObjects;
  level_end_x = 15000;

  constructor(enemies, street, backgroundObjects) {
    this.enemies = enemies;
    this.street = street;
    this.backgroundObjects = backgroundObjects;
  }
}