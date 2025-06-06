class StatusBar extends DrawableObject {
  IMAGES_FULL = [
    'img/GUI/2 Bars/HealthBar1.png',
    'img/GUI/2 Bars/HealthBar2.png',
    'img/GUI/2 Bars/HealthBar3.png',
    'img/GUI/2 Bars/HealthBar4.png'
  ];

  IMAGES_EMPTY = [
    'img/GUI/2 Bars/HealthBar5.png',
    'img/GUI/2 Bars/HealthBar6.png',
    'img/GUI/2 Bars/HealthBar7.png',
    'img/GUI/2 Bars/HealthBar8.png'
  ];


  percentage = 100;


  /**
 * Initializes the status bar with image assets and positioning.
 * Loads all full and empty health bar segment images.
 */
  constructor() {
    super();
    this.loadImages(this.IMAGES_FULL);
    this.loadImages(this.IMAGES_EMPTY);
    this.x = 20;
    this.y = 20;
    this.width = 120;
    this.height = 20;

  }


  /**
 * Renders the health bar to the given canvas context.
 * Displays empty segments first, then overlays filled segments
 * based on the current health percentage.
 * Adds a pulsing effect if health is below 50%.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 */
  draw(ctx) {
    const partWidth = this.width / 4;
    const hpPercent = this.percentage / 100;

    ctx.save();
    ctx.globalAlpha = this.calculateOpacity(hpPercent);

    this.drawEmptyParts(ctx, partWidth);
    this.drawFilledParts(ctx, partWidth, hpPercent);

    ctx.restore();
  }

  /**
   * Calculates the opacity based on current health.
   */
  calculateOpacity(hpPercent) {
    if (hpPercent < 0.5) {
      const pulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
      return Math.min(1, pulse);
    }
    return 1;
  }

  /**
   * Draws empty health bar parts.
   */
  drawEmptyParts(ctx, partWidth) {
    this.IMAGES_EMPTY.forEach((path, index) => {
      const img = this.imageCache[path];
      ctx.drawImage(img, this.x + index * partWidth, this.y, partWidth, this.height);
    });
  }

  /**
   * Draws filled health bar parts.
   */
  drawFilledParts(ctx, partWidth, hpPercent) {
    const hpParts = Math.ceil(hpPercent * 4);
    for (let i = 0; i < hpParts; i++) {
      const path = this.IMAGES_FULL[i];
      const img = this.imageCache[path];
      ctx.drawImage(img, this.x + i * partWidth, this.y, partWidth, this.height);
    }
  }

  /**
 * Updates the current health percentage displayed by the status bar.
 * @param {number} percentage - The new health value (0–100).
 */
  setPercentage(percentage) {
    this.percentage = percentage;
  }
}
