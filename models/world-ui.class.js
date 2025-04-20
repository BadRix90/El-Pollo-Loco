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
        this.world.showStartIntro = false;
        this.world.showIntro = true;
        this.world.introStep = 2;
        this.world.showStartButton = true;
        break;

      case "start":
        this.handleStart();
        if (!muteMusic) {
          stopMusic();
          startGameMusic();
        }
        break;

      case "music":
      case "sound-toggle":
        toggleMusic();
        break;

      case "restart":
      case "restart-game":
        stopGame({ goToMenu: false });
        break;

      case "exit":
        stopGame({ goToMenu: true });
        break;

      case "controls":
        this.handleControls();
        break;

      case "back-to-menu":
        this.handleBackToMenu();
        break;

      case "toggle-menu":
        this.world.showOptionsMenu = !this.world.showOptionsMenu;
        this.world.showControlsOverlay = false;
        break;

      case "impressum":
        this.world.showIntro = false;
        this.world.showImpressumOverlay = true;
        break;

      case "back-to-intro":
        this.world.showImpressumOverlay = false;
        this.world.showIntro = true;
        this.world.introStep = 2;
        this.world.showStartButton = true;
        break;
    }
  }


  handleStart(bgm, introMusic) {
    if (introMusic) {
      introMusic.pause()
      introMusic.currentTime = 0
    }
    if (bgm && !muteMusic) {
      bgm.volume = 0.015
      safePlay(bgm) // Use the safe play function instead of direct play
    }

    // Make music button visible in game
    const btnMusic = document.getElementById("btn-music")
    if (btnMusic) {
      btnMusic.style.display = "block"
    }

    this.world.showIntro = false
    this.world.showMainMenu = false
    this.world.policeCar = new PoliceCar(this.world)
  }

  handleControls() {
    if (this.world.showIntro) {
      this.world.fromIntroToControls = true
      this.world.showIntro = false
    } else {
      this.world.fromIntroToControls = false
    }

    this.world.showControlsOverlay = true
  }

  handleBackToMenu() {
    if (this.world.showEndscreen) {
      this.world.showEndscreen = false
      this.world.showIntro = true
      this.world.showStartIntro = false
      this.world.introStep = 2
      this.world.showStartButton = true
    } else if (this.world.showControlsOverlay) {
      this.world.showControlsOverlay = false
      if (this.world.fromIntroToControls) {
        this.world.showIntro = true
        this.world.showStartButton = true
        this.world.introStep = 2
      } else {
        this.world.showOptionsMenu = true
      }

      stopGame({ goToMenu: true })
    }
  }
}
