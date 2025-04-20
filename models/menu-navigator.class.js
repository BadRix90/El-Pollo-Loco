/**
 * Class that handles global menu navigation (Intro, StartIntro, Options).
 */
class MenuNavigator {
    /**
     * Creates a new MenuNavigator.
     * @param {World} world - The world instance.
     */
    constructor(world) {
        this.world = world;
        this.activeMenu = "startIntro"; // Default menu type
    }

    /**
     * Sets which menu is currently active.
     * @param {string} menuType - Menu type: 'startIntro', 'intro', or 'options'.
     */
    setActiveMenu(menuType) {
        this.activeMenu = menuType;
        this.world.ui.activeMenuButton = this.getDefaultButton(menuType);
    }

    /**
     * Returns the default button for a menu type.
     * @param {string} menuType - Menu type.
     * @returns {string} Default button action.
     */
    getDefaultButton(menuType) {
        switch (menuType) {
            case "startIntro": return "start-intro";
            case "intro": return "start";
            case "options": return "exit";
            default: return "start";
        }
    }

    /**
     * Handles navigation input (Arrow keys).
     * @param {string} direction - 'up', 'down', 'left', or 'right'.
     */
    navigate(direction) {
        if (this.activeMenu === "intro") {
            this.world.ui.navigateMenuSmart(direction);
        } else if (this.activeMenu === "options") {
            this.world.ui.navigateMenu(direction);
        }
    }

    /**
     * Confirms the currently active button (Enter key or second Touch).
     */
    confirmSelection() {
        if (this.world.ui.activeMenuButton) {
            this.world.uiHandler.handleMenuAction(this.world.ui.activeMenuButton);
        }
    }

    /**
     * Handles a touch input on a button.
     * If the touched button is already selected, confirm it.
     * Otherwise, just set the focus.
     * @param {string} action - Button action string.
     */
    handleTouch(action) {
        if (this.world.ui.activeMenuButton === action) {
            this.confirmSelection();
        } else {
            this.world.ui.activeMenuButton = action;
        }
    }
}
