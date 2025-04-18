class EventManager {
  /**
   * Creates a new EventManager instance.
   * Registers click and touch event listeners for the canvas.
   * @param {World} world - The game world instance.
   */
  constructor(world) {
    this.world = world
    this.canvas = world.canvas

    this.registerClickEvents()
    this.registerTouchEvents()
  }

  /**
   * Registers a mouse click event listener on the canvas.
   * Detects if a menu button was clicked and triggers the corresponding action.
   */
  registerClickEvents() {
    this.canvas.addEventListener("click", (e) => {
      this.handleCanvasClick(e);
    });
  }

  /**
   * Registers a touchstart event listener on the canvas.
   * Translates touch coordinates to canvas space and checks for menu button hits.
   * Uses non-passive event handling to allow interaction control.
   */
  registerTouchEvents() {
    this.canvas.addEventListener(
      "touchstart",
      (e) => {
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
                if (this.world.showEndscreen) {
                  if (button.action === "restart-game") {
                    stopGame();
                    return;
                  } else if (button.action === "back-to-menu") {
                    this.world.showEndscreen = false;
                    this.world.showIntro = true;
                    this.world.showStartIntro = false;
                    this.world.introStep = 2;
                    this.world.showStartButton = true;
                    return;
                  }
                }

                if (this.world.menuButtons.length === 1) {
                  if (button.action === "start-intro") {
                    this.world.showStartIntro = false;
                    this.world.showIntro = true;
                  } else {
                    this.world.uiHandler.handleMenuAction(button.action);
                  }
                  return;
                }

                if (this.world.ui.activeMenuButton === button.action) {
                  if (button.action === "start-intro") {
                    this.world.showStartIntro = false;
                    this.world.showIntro = true;
                  } else if (button.action === "restart-game") {
                    stopGame();
                  } else if (button.action === "back-to-menu") {
                    this.world.uiHandler.handleMenuAction("back-to-menu");
                  } else {
                    this.world.uiHandler.handleMenuAction(button.action);
                  }
                } else {
                  this.world.ui.activeMenuButton = button.action;
                }

                return;
              }
            }
          }
        }
      },
      { passive: false }
    );
  }


  handleCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    if (this.world.menuButtons) {
      for (const button of this.world.menuButtons) {
        if (
          clickX >= button.x &&
          clickX <= button.x + button.w &&
          clickY >= button.y &&
          clickY <= button.y + button.h
        ) {
          this.world.uiHandler.handleMenuAction(button.action)
          return
        }
      }
    }
  }
}
