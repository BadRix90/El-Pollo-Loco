/**
 * Class representing the touch overlay for mobile controls.
 */
class TouchOverlay {
    /**
     * Creates a new TouchOverlay instance.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Object} keyboard - The shared keyboard state.
     */
    constructor(canvas, keyboard) {
      this.canvas = canvas;
      this.keyboard = keyboard;
      this.buttons = this.createButtons();
      this.disabled = false;
      this.registerTouchEvents();
    }
  
    /**
     * Creates virtual control buttons.
     * @returns {Object[]} Array of button definitions.
     */
    createButtons() {
      return [
        { id: 'left', relX: 40, relY: -50, width: 40, height: 40, img: new Image(), key: 'LEFT' },
        { id: 'right', relX: 100, relY: -50, width: 40, height: 40, img: new Image(), key: 'RIGHT' },
        { id: 'jump', relX: -100, relY: -50, width: 40, height: 40, img: new Image(), key: 'SPACE' },
        { id: 'shoot', relX: -160, relY: -50, width: 40, height: 40, img: new Image(), key: 'q' },
      ];
    }
  
    /**
     * Registers all touch and mouse events.
     */
    registerTouchEvents() {
      const options = { passive: false };
      this.canvas.addEventListener('touchstart', (e) => this.updateTouches(e), options);
      this.canvas.addEventListener('touchmove', (e) => this.updateTouches(e), options);
      this.canvas.addEventListener('touchend', (e) => this.updateTouches(e));
      this.canvas.addEventListener('touchcancel', (e) => this.updateTouches(e));
      this.canvas.addEventListener('mousedown', (e) => this.handleMouse(e, true));
      this.canvas.addEventListener('mouseup', () => this.resetButtons());
    }
  
    /**
     * Updates button states based on current touches.
     * @param {TouchEvent} e
     */
    updateTouches(e) {
      e.preventDefault();
      this.resetButtons();
      const touches = Array.from(e.touches).map(touch => this.getCanvasCoords(touch.clientX, touch.clientY));
      this.activateButtons(touches);
    }
  
    /**
     * Handles mouse events for button activation.
     * @param {MouseEvent} e
     * @param {boolean} isStart
     */
    handleMouse(e, isStart) {
      const { x, y } = this.getCanvasCoords(e.clientX, e.clientY);
      this.buttons.forEach(btn => {
        if (this.isTouchingButton(x, y, btn)) {
          this.keyboard[btn.key] = isStart;
        }
      });
    }
  
    /**
     * Activates buttons if any touches overlap them.
     * @param {Array} touches
     */
    activateButtons(touches) {
      touches.forEach(({ x, y }) => {
        this.buttons.forEach(btn => {
          if (this.isTouchingButton(x, y, btn)) {
            this.keyboard[btn.key] = true;
          }
        });
      });
    }
  
    /**
     * Resets all button key states.
     */
    resetButtons() {
      this.buttons.forEach(btn => {
        this.keyboard[btn.key] = false;
      });
    }
  
    /**
     * Converts screen coordinates to canvas space.
     * @param {number} clientX
     * @param {number} clientY
     * @returns {{x: number, y: number}}
     */
    getCanvasCoords(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / this.canvas.clientWidth;
      const scaleY = this.canvas.height / this.canvas.clientHeight;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }
  
    /**
     * Checks if a point is touching a button.
     * @param {number} x
     * @param {number} y
     * @param {Object} btn
     * @returns {boolean}
     */
    isTouchingButton(x, y, btn) {
      const btnX = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX;
      const btnY = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY;
      return x >= btnX && x <= btnX + btn.width && y >= btnY && y <= btnY + btn.height;
    }
  
    /**
     * Draws virtual buttons onto the canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      if (!this.buttons || this.disabled || window.innerWidth > 768) return;
  
      this.buttons.forEach(btn => {
        if (!btn.img.src) this.setButtonImage(btn);
        const x = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX;
        const y = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY;
  
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.drawImage(btn.img, x, y, btn.width, btn.height);
        ctx.restore();
      });
    }
  
    /**
     * Assigns the correct image source to a button.
     * @param {Object} btn
     */
    setButtonImage(btn) {
      const images = {
        left: 'img/GUI/3 Icons/Icons/Icon_14.png',
        right: 'img/GUI/3 Icons/Icons/Icon_12.png',
        jump: 'img/GUI/3 Icons/Icons/Icon_13.png',
        shoot: 'img/GUI/9 Other/3 Skill icons/Skillicon7_06.png'
      };
      btn.img.src = images[btn.id];
    }
  }