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

  handleStartIntro() {
    this.world.showStartIntro = false;
    this.world.showIntro = true;
    this.world.introStep = 2;
    this.world.showStartButton = true;
  }

  handleStartGame() {
    this.handleStart();
    if (!muteMusic) {
      stopMusic();
      startGameMusic();
    }
  }

  handleToggleMusic() {
    toggleMusic();
  }

  handleRestart() {
    stopGame({ goToMenu: false });
  }

  handleExit() {
    stopGame({ goToMenu: true });
  }

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

  handleImpressum() {
    this.world.showIntro = false;
    this.world.showImpressumOverlay = true;
  }

  handleBackToIntro() {
    this.world.showImpressumOverlay = false;
    this.world.showIntro = true;
    this.world.introStep = 2;
    this.world.showStartButton = true;
  }


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

  resetAfterImpressum() {
    this.world.showImpressumOverlay = false;
    this.world.showIntro = true;
    this.world.showStartIntro = false;
    this.world.introStep = 2;
    this.world.showStartButton = true;
  }


}
