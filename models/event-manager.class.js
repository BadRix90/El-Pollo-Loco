class EventManager {
  constructor(world) {
    this.world = world;
    this.canvas = world.canvas;

    this.registerClickEvents();
    this.registerTouchEvents();
  }

  registerClickEvents() {
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (this.world.menuButtons) {
        for (const button of this.world.menuButtons) {
          if (
            clickX >= button.x &&
            clickX <= button.x + button.w &&
            clickY >= button.y &&
            clickY <= button.y + button.h
          ) {
            this.world.handleMenuAction(button.action);
            return;
          }
        }
      }
    });
  }

  registerTouchEvents() {
    this.canvas.addEventListener("touchstart", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / this.canvas.clientWidth;
      const scaleY = this.canvas.height / this.canvas.clientHeight;

      for (const touch of e.changedTouches) {
        const clickX = (touch.clientX - rect.left) * scaleX;
        const clickY = (touch.clientY - rect.top) * scaleY;

        if (this.world.menuButtons) {
          for (const button of this.world.menuButtons) {
            if (
              clickX >= button.x &&
              clickX <= button.x + button.w &&
              clickY >= button.y &&
              clickY <= button.y + button.h
            ) {
              this.world.handleMenuAction(button.action);
              return;
            }
          }
        }
      }
    }, { passive: false });
  }


}
