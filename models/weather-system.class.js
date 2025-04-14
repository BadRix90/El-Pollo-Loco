class WeatherSystem {


  /**
 * Creates a new WeatherSystem instance.
 * Initializes the canvas context and generates an array of raindrop objects.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw the weather effect on.
 */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.raindrops = this.createRaindrops(120);
  }


  /**
* Generates a specified number of random raindrop objects with position,
* length, and speed properties.
* @param {number} count - The number of raindrops to create.
* @returns {Object[]} Array of raindrop objects.
*/
  createRaindrops(count) {
    const drops = [];
    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        length: Math.random() * 15 + 10,
        speed: Math.random() * 5 + 4
      });
    }
    return drops;
  }


  /**
* Draws and animates raindrops falling down the canvas.
* Resets raindrops to the top when they reach the bottom.
*/
  drawRain() {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(173,216,230,0.3)';
    this.ctx.lineWidth = 1.2;
    this.ctx.lineCap = 'round';

    this.raindrops.forEach(drop => {
      this.ctx.beginPath();
      this.ctx.moveTo(drop.x, drop.y);
      this.ctx.lineTo(drop.x, drop.y + drop.length);
      this.ctx.stroke();

      drop.y += drop.speed;
      if (drop.y > this.canvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * this.canvas.width;
      }
    });

    this.ctx.restore();
  }
}
