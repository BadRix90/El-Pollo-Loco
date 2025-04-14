class Street extends MovableObject {
  y = 70;
  height = 32;
  width = 32;


  /**
 * Creates a new Street tile at the given x-position.
 * Loads the default street tile image and positions it at ground level.
 * @param {number} x - The horizontal position of the tile.
 */
  constructor(x) {
    super().loadImage('img/cyberpunk-characters-pixel-art/5 Street/1 Tiles/IndustrialTile_05.png');
    this.x = x;
    this.y = 480 - this.height;
  }

  
}
