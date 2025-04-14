class Level {
  enemies;
  street;
  backgroundObjects;
  level_end_x = 7000;


  /**
 * Creates a new Level instance.
 * @param {MovableObject[]} enemies - All enemies present in the level.
 * @param {DrawableObject[]} street - Ground tiles for the level's layout.
 * @param {DrawableObject[]} backgroundObjects - Parallax background elements.
 */
  constructor(enemies, street, backgroundObjects) {
    this.enemies = enemies;
    this.street = street;
    this.backgroundObjects = backgroundObjects;
  }
}