class WorldUI {
  /**
   * @param {World} world - The game world instance to control via UI actions
   */
  constructor(world) {
    this.world = world
  }

  /**
   * Handles menu actions triggered by keyboard, touch, or UI buttons.
   * @param {string} action - Action string to determine behavior
   */
  handleMenuAction(action) {
    switch (action) {
      case "start-intro":
        this.handleStartIntro();
        break;
      case "start":
        this.handleStartGame();
        break;
      case "music":
      case "sound-toggle":
        this.handleToggleMusic();
        break;
      case "restart":
      case "restart-game":
        this.handleRestart();
        break;
      case "exit":
        this.handleExit();
        break;
      case "controls":
        this.handleControls();
        break;
      case "back-to-menu":
        this.handleBackToMenu();
        break;
      case "toggle-menu":
        this.handleToggleMenu();
        break;
      case "impressum":
        this.handleImpressum();
        break;
      case "back-to-intro":
        this.handleBackToIntro();
        break;
    }
  }

  /**
   * Handles the transition from the start screen to the intro sequence.
   * Updates the world state to display the intro and show the start button.
   */
  handleStartIntro() {
    this.world.showStartIntro = false;
    this.world.showIntro = true;
    this.world.introStep = 2;
    this.world.showStartButton = true;
  }

  /**
   * Handles the start of the game by initializing necessary actions
   * and managing background music based on the mute setting.
   */
  handleStartGame() {
    this.handleStart();
    if (!muteMusic) {
      stopMusic();
      startGameMusic();
    }
  }

  /**
   * Toggles the background music on or off.
   */
  handleToggleMusic() {
    toggleMusic();
  }

  /**
   * Handles the restart of the game by stopping the current game session.
   */
  handleRestart() {
    stopGame({ goToMenu: false });
  }

  /**
   * Handles the exit action by stopping the game and returning to the menu.
   */
  handleExit() {
    stopGame({ goToMenu: true });
  }

  /**
   * Toggles the options menu visibility and updates the UI state accordingly.
   * Activates the "options" menu when shown, otherwise reverts to the "intro" menu.
   */
  handleToggleMenu() {
    this.world.showOptionsMenu = !this.world.showOptionsMenu;
    this.world.showControlsOverlay = false;

    if (this.world.showOptionsMenu) {
      this.world.menuNavigator.setActiveMenu("options");
      this.world.ui.menuGrid = [["exit"], ["controls"], ["toggle-menu"]];
      this.world.ui.activeMenuButton = "exit";
    } else {
      this.world.menuNavigator.setActiveMenu("intro");
    }
  }

  /**
   * Handles the display of the impressum overlay by hiding the intro and showing the impressum overlay.
   */
  handleImpressum() {
    this.world.showIntro = false;
    this.world.showImpressumOverlay = true;
  }

  /**
   * Resets the world state to display the intro screen.
   */
  handleBackToIntro() {
    this.world.showImpressumOverlay = false;
    this.world.showIntro = true;
    this.world.introStep = 2;
    this.world.showStartButton = true;
  }


  /**
   * Handles the start of the game by managing background music, UI elements, 
   * and initializing the police car.
   * 
   * @param {HTMLAudioElement} bgm - The background music audio element.
   * @param {HTMLAudioElement} introMusic - The intro music audio element.
   */
  handleStart(bgm, introMusic) {
    if (introMusic) {
      introMusic.pause()
      introMusic.currentTime = 0
    }
    if (bgm && !muteMusic) {
      bgm.volume = 0.015
      safePlay(bgm)
    }

    const btnMusic = document.getElementById("btn-music")
    if (btnMusic) {
      btnMusic.style.display = "block"
    }

    this.world.showIntro = false
    this.world.showMainMenu = false
    this.world.policeCar = new PoliceCar(this.world)
  }

  /**
   * Handles the display of control overlays by updating the world state.
   * Sets the last menu, hides other overlays, and shows the controls overlay.
   */
  handleControls() {
    if (this.world.showOptionsMenu) {
      this.world.lastMenu = "options";
    } else {
      this.world.lastMenu = "intro";
    }
    this.world.showIntro = false;
    this.world.showStartIntro = false;
    this.world.showOptionsMenu = false;
    this.world.showImpressumOverlay = false;
    this.world.showControlsOverlay = true;
  }

  /**
   * Handles navigation back to the menu by resetting the world state 
   * based on the currently active overlay or showing the options menu.
   */
  handleBackToMenu() {
    if (this.world.showEndscreen) {
      this.resetAfterEndscreen();
    } else if (this.world.showControlsOverlay) {
      this.resetAfterControls();
    } else if (this.world.showImpressumOverlay) {
      this.resetAfterImpressum();
    } else {
      this.world.showOptionsMenu = true;
    }
  }

  /**
   * Resets the game state after the end screen is displayed.
   * Restores initial settings for the world, character, and UI.
   */
  resetAfterEndscreen() {
    this.world.showEndscreen = false;
    this.world.showIntro = true;
    this.world.showStartIntro = false;
    this.world.introStep = 2;
    this.world.showStartButton = true;
    this.world.character = new Character();
    this.world.character.world = this.world;
    this.world.statusBar.setPercentage(100);

    this.world.ui.setupMenu(["start", "controls", "impressum"], "start");
    this.world.ui.menuGrid = [["start", "controls"], ["impressum"]];

  }

  /**
   * Resets the world state after the controls overlay is closed.
   * Restores the appropriate menu or intro screen based on the last menu state.
   */
  resetAfterControls() {
    this.world.showControlsOverlay = false;
    if (this.world.lastMenu === "options") {
      this.world.showOptionsMenu = true;
      this.world.ui.setupMenu(["exit", "controls", "toggle-menu"], "exit");
      this.world.ui.menuGrid = [["exit"], ["controls"], ["toggle-menu"]];
    } else {
      this.world.showIntro = true;
      this.world.showStartIntro = false;
      this.world.introStep = 2;
      this.world.showStartButton = true;
    }
  }

  /**
   * Resets the world state after closing the impressum overlay.
   * Restores the intro and start button visibility.
   */
  resetAfterImpressum() {
    this.world.showImpressumOverlay = false;
    this.world.showIntro = true;
    this.world.showStartIntro = false;
    this.world.introStep = 2;
    this.world.showStartButton = true;
  }
}
