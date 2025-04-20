/**
 * Class managing canvas click and touch events.
 */
class EventManager {
  /**
   * Initializes the EventManager with event listeners.
   * @param {World} world - The game world instance.
   */
  constructor(world) {
    this.world = world
    this.canvas = world.canvas
    this.registerEvents()
  }

  /**
   * Registers both click and touch events.
   */
  registerEvents() {
    this.registerClickEvents()
    this.registerTouchEvents()
    this.registerKeyboardEvents()
  }

  /**
   * Registers keyboard event listeners for handling menu navigation and selection.
   * This method listens for specific key presses (Arrow keys and Enter) and delegates
   * the actions to the `menuNavigator` if certain overlays or menus are active in the game world.
   * 
   * Key functionalities:
   * - Navigates through menu options using Arrow keys.
   * - Confirms a menu selection using the Enter key.
   * - Prevents default browser behavior for these keys when a menu or overlay is active.
   */
  registerKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      if (this.world.showOptionsMenu || this.world.showIntro || this.world.showControlsOverlay || this.world.showStartIntro || this.world.showImpressumOverlay) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          const dir = e.key.replace("Arrow", "").toLowerCase();
          this.world.menuNavigator.navigate(dir);
        }
        if (e.key === "Enter") {
          this.world.menuNavigator.confirmSelection();
        }
        e.preventDefault();
      }
    });
  }

  /**
   * Registers a click event on the canvas.
   */
  registerClickEvents() {
    this.canvas.addEventListener("click", (e) => this.handleCanvasClick(e))
  }

  /**
   * Registers a touchstart event on the canvas.
   */
  registerTouchEvents() {
    this.canvas.addEventListener("touchstart", (e) => this.handleTouchStart(e), { passive: false })
  }

  /**
   * Handles a mouse click on the canvas.
   * @param {MouseEvent} e
   */
  handleCanvasClick(e) {
    const { clickX, clickY } = this.getClickCoordinates(e)
    this.processButtonClick(clickX, clickY)
  }

  /**
   * Processes button clicks.
   * @param {number} clickX
   * @param {number} clickY
   */
  processButtonClick(clickX, clickY) {
    if (!this.world.menuButtons) return
    for (const button of this.world.menuButtons) {
      if (this.isButtonHit(button, clickX, clickY)) {
        this.world.menuNavigator.handleTouch(button.action);
        return;
      }
    }
  }

  /**
   * Handles a touchstart event.
   * @param {TouchEvent} e
   */
  handleTouchStart(e) {
    const touches = Array.from(e.changedTouches);
    touches.forEach(touch => this.processTouch(touch));
  }


  /**
   * Processes a single touch event.
   * @param {Touch} touch
   */
  processTouch(touch) {
    const { clickX, clickY } = this.getTouchCoordinates(touch);
    if (!this.world.menuButtons) return;
    for (const button of this.world.menuButtons) {
      if (this.isButtonHit(button, clickX, clickY)) {
        this.world.menuNavigator.handleTouch(button.action);
        return;
      }
    }
  }

  /**
   * Processes what happens when a touch hits a button.
   * @param {Object} button
   */
  processTouchHit(button) {
    if (this.world.showEndscreen) {
      this.handleEndscreenTouch(button)
    } else if (this.world.menuButtons.length === 1) {
      this.handleSingleButtonTouch(button)
    } else {
      this.handleGeneralTouch(button)
    }
  }

  /**
   * Handles touches during the endscreen.
   * @param {Object} button
   */
  handleEndscreenTouch(button) {
    if (button.action === "restart-game") {
      stopGame()
    } else if (button.action === "back-to-menu") {
      this.world.showEndscreen = false
      this.world.showIntro = true
      this.world.showStartIntro = false
      this.world.introStep = 2
      this.world.showStartButton = true
    }
  }

  /**
   * Handles touches when only one menu button is available.
   * @param {Object} button
   */
  handleSingleButtonTouch(button) {
    if (button.action === "start-intro") {
      this.world.showStartIntro = false
      this.world.showIntro = true
    } else {
      this.world.uiHandler.handleMenuAction(button.action)
    }
  }

  /**
   * Handles general menu button touches.
   * @param {Object} button
   */
  handleGeneralTouch(button) {
    if (this.world.ui.activeMenuButton === button.action) {
      this.triggerMenuAction(button.action)
    } else {
      this.world.ui.activeMenuButton = button.action
    }
  }

  /**
   * Triggers the correct action based on button.
   * @param {string} action
   */
  triggerMenuAction(action) {
    if (action === "start-intro") {
      this.world.showStartIntro = false
      this.world.showIntro = true
    } else if (action === "restart-game") {
      stopGame()
    } else if (action === "back-to-menu") {
      this.world.uiHandler.handleMenuAction("back-to-menu")
    } else {
      this.world.uiHandler.handleMenuAction(action)
    }
  }

  /**
   * Checks if a click or touch hit a button.
   * @param {Object} button
   * @param {number} x
   * @param {number} y
   */
  isButtonHit(button, x, y) {
    return x >= button.x && x <= button.x + button.w && y >= button.y && y <= button.y + button.h
  }

  /**
   * Gets click coordinates relative to canvas.
   * @param {MouseEvent} e
   */
  getClickCoordinates(e) {
    const rect = this.canvas.getBoundingClientRect()
    return {
      clickX: e.clientX - rect.left,
      clickY: e.clientY - rect.top,
    }
  }

  /**
   * Gets touch coordinates relative to canvas.
   * @param {Touch} touch
   */
  getTouchCoordinates(touch) {
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / this.canvas.clientWidth
    const scaleY = this.canvas.height / this.canvas.clientHeight
    return {
      clickX: (touch.clientX - rect.left) * scaleX,
      clickY: (touch.clientY - rect.top) * scaleY,
    }
  }
}
