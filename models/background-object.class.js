class BackgroundObject extends MovableObject{
    height = 480;
    width = 720;
    

    /**
 * Creates a new BackgroundObject.
 * @param {string} imagePath - Path to the background image.
 * @param {number} x - Initial horizontal position.
 * @param {number} speedModifier - Scroll speed factor for parallax effect.
 */
    constructor(imagePath, x, speedModifier){
        super().loadImage(imagePath)
        this.x = x;
        this.y = 480 - this.height;
        this.speedModifier = speedModifier;
    }
}
