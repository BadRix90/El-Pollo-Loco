/**
 * Class managing the mobile touch overlay.
 */
class TouchOverlay {
    /**
     * Initializes the TouchOverlay.
     * @param {HTMLCanvasElement} canvas
     * @param {Object} keyboard
     */
    constructor(canvas, keyboard) {
      this.canvas = canvas;
      this.keyboard = keyboard;
      this.buttons = this.createButtons();
      this.disabled = false;
      this.registerTouchEvents();
    }
  
    /**
     * Creates virtual button definitions.
     */
    createButtons() {
      return [
        { id: 'left', relX: 40, relY: -50, width: 40, height: 40, img: new Image(), key: 'LEFT' },
        { id: 'right', relX: 100, relY: -50, width: 40, height: 40, img: new Image(), key: 'RIGHT' },
        { id: 'jump', relX: -100, relY: -50, width: 40, height: 40, img: new Image(), key: 'SPACE' },
        { id: 'shoot', relX: -160, relY: -50, width: 40, height: 40, img: new Image(), key: 'q' }
      ];
    }
  
    /**
     * Registers all touch and mouse events.
     */
    registerTouchEvents() {
      this.canvas.addEventListener('touchstart', (e) => this.updateTouches(e), { passive: false });
      this.canvas.addEventListener('touchmove', (e) => this.updateTouches(e), { passive: false });
      this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
      this.canvas.addEventListener('touchcancel', (e) => this.handleTouchEnd(e));
      this.canvas.addEventListener('mousedown', (e) => this.handleMouseClick(e, true));
      this.canvas.addEventListener('mouseup', () => this.resetButtons());
    }
  
    /**
     * Updates touches and activates buttons.
     */
    updateTouches(e) {
      e.preventDefault();
      const touches = Array.from(e.touches).map(touch => this.getTouchPosition(touch));
      this.updateButtonStates(touches);
    }
  
    /**
     * Handles touch end and updates remaining buttons.
     */
    handleTouchEnd(e) {
      const touches = Array.from(e.touches).map(touch => this.getTouchPosition(touch));
      this.updateButtonStates(touches);
    }
  
    /**
     * Handles mouse clicks for desktop.
     */
    handleMouseClick(e, isStart) {
      const { x, y } = this.getMousePosition(e);
      this.buttons.forEach(btn => {
        const btnX = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX;
        const btnY = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY;
        if (x >= btnX && x <= btnX + btn.width && y >= btnY && y <= btnY + btn.height) {
          this.keyboard[btn.key] = isStart;
        }
      });
    }
  
    /**
     * Resets all virtual buttons.
     */
    resetButtons() {
      this.buttons.forEach(btn => this.keyboard[btn.key] = false);
    }
  
    /**
     * Updates button states based on active touches.
     */
    updateButtonStates(touches) {
      this.buttons.forEach(btn => this.keyboard[btn.key] = false);
      touches.forEach(touch => {
        this.buttons.forEach(btn => {
          const btnX = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX;
          const btnY = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY;
          if (touch.x >= btnX && touch.x <= btnX + btn.width && touch.y >= btnY && touch.y <= btnY + btn.height) {
            this.keyboard[btn.key] = true;
          }
        });
      });
    }
  
    /**
     * Draws the virtual buttons.
     */
    draw(ctx) {
      if (!this.buttons || this.disabled || window.innerWidth > 768) return;
      this.buttons.forEach(btn => {
        this.assignButtonImage(btn);
        const x = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX;
        const y = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY;
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.drawImage(btn.img, x, y, btn.width, btn.height);
        ctx.restore();
      });
    }
  
    /**
     * Assigns the button's image if not already set.
     */
    assignButtonImage(btn) {
      if (btn.img.src) return;
      switch (btn.id) {
        case 'left': btn.img.src = 'img/GUI/3 Icons/Icons/Icon_14.png'; break;
        case 'right': btn.img.src = 'img/GUI/3 Icons/Icons/Icon_12.png'; break;
        case 'jump': btn.img.src = 'img/GUI/3 Icons/Icons/Icon_13.png'; break;
        case 'shoot': btn.img.src = 'img/GUI/9 Other/3 Skill icons/Skillicon7_06.png'; break;
      }
    }
  
    /**
     * Converts a Touch to canvas coordinates.
     */
    getTouchPosition(touch) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / this.canvas.clientWidth;
      const scaleY = this.canvas.height / this.canvas.clientHeight;
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    }
  
    /**
     * Converts a MouseEvent to canvas coordinates.
     */
    getMousePosition(e) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / this.canvas.clientWidth;
      const scaleY = this.canvas.height / this.canvas.clientHeight;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  }