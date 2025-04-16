class World {
  character = new Character()
  level = level1
  backgroundWidth = 719 * 2
  ctx
  canvas
  keyboard
  camera_x = 0
  statusBar = new StatusBar()
  throwableObjects = []
  enemyBullets = []
  activeBombs = []
  playerBullets = []
  healItems = []
  showMainMenu = true
  introY = -100
  showIntro = true
  showStartButton = false
  introStep = 0
  selectedCharacter = null
  confirmCharacter = false
  showCharacterSelect = false
  showOptionsMenu = false
  showControlsOverlay = false
  policeCar = null
  touchOverlay = null
  endbossDefeatedAt = null
  showReturnTimer = false

  /**
   * Initializes the game world with canvas, keyboard input,
   * character, level, UI, weather, events, and touch overlay.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {Object} keyboard - The keyboard input object.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d")
    this.ctx.imageSmoothingEnabled = false
    this.canvas = canvas
    this.keyboard = keyboard
    this.character.world = this
    this.events = new EventManager(this)
    this.ui = new UIManager(this)
    this.weather = new WeatherSystem(this.canvas)
    this.bullets = new BulletManager(this)
    this.touchOverlay = new TouchOverlay(this.canvas, this.keyboard)
    this.draw()
    this.setWorld()
    this.run()
    this.hoverX = 0
    this.hoverY = 0
    this.fromIntroToControls = false
    this.gameOverHandled = false
    this.showGameOver = false
    this.gameOverY = -50
    this.gameOverHandled = false
    this.showEndscreen = false
    this.showStartIntro = true
    this.showIntro = false
    this.introStep = 1
    this.introStep = 2
    this.handleIntroMusic()

  }

  /**
   * Sets up all entities in the world including enemies, the endboss,
   * and initial heal items. Starts enemy AI where applicable.
   */
  setWorld() {
    this.character.world = this
    this.level.enemies.forEach((enemy) => {
      enemy.world = this
      enemy.animate?.()
      enemy.startAI?.()
    })

    if (this.level.endboss) {
      this.level.endboss.world = this
      this.level.endboss.animate?.()
    }

    const healItem1 = new HealItem(1000, 300, this)
    const healItem2 = new HealItem(2000, 300, this)
    const healItem3 = new HealItem(4500, 300, this)

    this.healItems.push(healItem1, healItem2, healItem3)
  }

  /**
   * Starts the main game logic loop (60fps) including:
   * collision checks, bullet handling, and endboss attack check.
   */
  run() {
    setInterval(() => {
      this.checkCollisions()
      this.bullets.checkBulletHits()
      this.bullets.removeOffscreenBullets()
      this.checkEndbossAttack()
      this.throwableObjects = this.throwableObjects.filter((o) => !o.markedForDeletion)
    }, 1000 / 60)
  }

  /**
   * Checks collisions between the player and enemies or heal items.
   * Applies damage and collects heal items if overlapping.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead() && this.character.isColliding(enemy)) {
        this.character.hit()
        this.statusBar.setPercentage(this.character.energy)
        this.healItems.forEach((item) => item.collect())
      }
    })
    if (this.character.isDead() && !this.showEndscreen) {
      this.endGame()
    }
    this.healItems.forEach((item) => {
      item.collect()
    })
  }

  /**
   * If the character is close enough to the endboss,
   * triggers its attack and applies damage if hit.
   */
  checkEndbossAttack() {
    if (!this.level.endboss || this.level.endboss.isDead()) return

    const distance = Math.abs(this.character.x - this.level.endboss.x)
    const attackRange = 250

    if (distance < attackRange) {
      this.level.endboss.startAttack()
      if (!this.character.isHurt()) {
        this.character.hit()
        this.statusBar.setPercentage(this.character.energy)
      }
    }
  }

  /**
   * Main rendering loop for the entire world.
   * Draws backgrounds, character, enemies, projectiles, overlays, and menus.
   * Also handles intro, controls screen, and return-to-menu logic.
   */
  draw() {
    this.menuButtons = []

    if (this.showEndscreen) {
      this.ui.drawEndscreen()
      requestAnimationFrame(() => this.draw())
      return
    }

    if (this.showStartIntro) {
      this.ui.drawStartIntro()
      requestAnimationFrame(() => this.draw())
      return
    }

    if (this.showImpressumOverlay) {
      this.ui.drawImpressumOverlay()
      requestAnimationFrame(() => this.draw())
      return
    }

    if (this.showIntro) {
      this.ui.drawIntroScreen()
      requestAnimationFrame(() => this.draw())
      return
    }

    if (this.showControlsOverlay) {
      this.ui.drawControlsOverlay()
      requestAnimationFrame(() => this.draw())
      return
    }

    if (this.showOptionsMenu) {
      this.ui.drawOptionsMenu()
      requestAnimationFrame(() => this.draw())
      return
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.translate(this.camera_x, 0)
    this.drawBackgroundObjects()

    this.ctx.translate(-this.camera_x, 0)
    this.addToMap(this.statusBar)

    this.ctx.translate(this.camera_x, 0)
    this.addObjectsToMap(this.level.street)
    if (this.policeCar) {
      this.addToMap(this.policeCar)
    }
    this.addToMap(this.character)

    this.addObjectsToMap(this.level.enemies)

    this.addObjectsToMap(this.playerBullets)
    this.addObjectsToMap(this.enemyBullets)
    this.addObjectsToMap(this.activeBombs)
    this.addObjectsToMap(this.healItems)

    this.ctx.save()
    this.ctx.font = "32px CyberpunkCraftpixPixel"
    this.ctx.fillStyle = "#ff00ff"
    this.ctx.textAlign = "center"
    this.ctx.fillText("COMING SOON", 7100, 300)
    this.ctx.fillText("--->", 7100, 250)
    this.ctx.restore()

    this.ctx.translate(-this.camera_x, 0)

    this.weather.drawRain()
    this.touchOverlay.draw(this.ctx)

    if (this.showReturnTimer && !this.showEndscreen && !this.character.isDead()) {
      const secondsPassed = Math.floor((Date.now() - this.endbossDefeatedAt) / 1000)
      const secondsLeft = Math.max(0, 10 - secondsPassed)

      this.ctx.font = "28px CyberpunkCraftpixPixel"
      this.ctx.fillStyle = "white"
      this.ctx.textAlign = "center"
      this.ctx.fillText(`Returning to Menu in ${secondsLeft}`, this.canvas.width / 2, 60)

      if (secondsLeft <= 0) {
        this.ui.returnToMainMenu()
      }
    }

    this.drawLoopId = requestAnimationFrame(() => {
      this.draw()
    })

    if (this.showGameOver) {
      if (this.gameOverY < this.canvas.height / 2) {
        this.gameOverY += 5
      }

      this.ctx.save()
      this.ctx.font = "48px CyberpunkCraftpixPixel"
      this.ctx.fillStyle = "#ff0066"
      this.ctx.textAlign = "center"
      this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.gameOverY)
      this.ctx.restore()
    }
  }

  /**
   * Executes actions based on the selected menu button:
   * start, restart, exit, toggle menu, or show controls.
   * @param {string} action - The action to perform.
   */
  handleMenuAction(action) {
    const bgm = document.getElementById("background-music")
    const introMusic = document.getElementById("intro-music")

    if (action === "start") {
      if (introMusic) {
        introMusic.pause()
        introMusic.currentTime = 0
      }

      this.showIntro = false
      this.showMainMenu = false
      toggleMusic()
      this.policeCar = new PoliceCar(this)
    } else if (action === "music" || action === "sound-toggle") {
      toggleMusic()
    } else if (action === "restart") {
      if (introMusic) {
        introMusic.pause()
        introMusic.currentTime = 0
      }
      this.restartGame()
    } else if (action === "exit") {
      stopGame({ goToMenu: true })
    } else if (action === "controls") {
      if (this.showIntro) {
        this.fromIntroToControls = true
        this.showIntro = false
      } else {
        this.fromIntroToControls = false
      }

      this.showControlsOverlay = true
    } else if (action === "back-to-menu") {
      if (this.showControlsOverlay) {
        this.showControlsOverlay = false
        if (this.fromIntroToControls) {
          this.showIntro = true
          this.showStartButton = true
          this.introStep = 2
        } else {
          this.showOptionsMenu = true
        }
      } else if (this.showEndscreen) {
        stopGame({ goToMenu: true })
      } else {
        this.showOptionsMenu = !this.showOptionsMenu
      }
    } else if (action === "toggle-menu") {
      this.showOptionsMenu = !this.showOptionsMenu
    } else if (action === "impressum") {
      this.showIntro = false
      this.showImpressumOverlay = true
    } else if (action === "back-to-intro") {
      this.showImpressumOverlay = false
      this.showIntro = true
      this.introStep = 2
      this.showStartButton = true
    } else if (action === "restart-game") {
      this.showEndscreen = false;
      stopGame({ goToMenu: false });
  }
  }


  handleIntroMusic() {
    const introMusic = document.getElementById("intro-music")
    if (this.showIntro || this.showImpressumOverlay || (this.showControlsOverlay && this.fromIntroToControls)) {
      if (introMusic && introMusic.paused) {
        introMusic.volume = 0.01
        introMusic.currentTime = 32
      }
    } else {
      if (introMusic && !introMusic.paused) {
        introMusic.pause()
        introMusic.currentTime = 0
      }
    }
  }

  
  /**
   * Debug method to draw the character's current HP on screen.
   */
  drawHP() {
    this.ctx.font = "20px Arial"
    this.ctx.fillStyle = "white"
    this.ctx.fillText("HP: " + this.character.energy, 20 - this.camera_x, 30)
  }

  /**
   * Draws all background objects with a parallax scroll effect.
   */
  drawBackgroundObjects() {
    this.level.backgroundObjects.forEach((bgObj) => {
      const scrollX = this.camera_x * bgObj.speedModifier
      const originalX = bgObj.x
      bgObj.x = originalX + scrollX
      this.addToMap(bgObj)
      bgObj.x = originalX
    })
  }

  /**
   * Draws an array of game objects to the canvas.
   * @param {Object[]} objects - Array of drawable game objects.
   */
  addObjectsToMap(objects) {
    if (!Array.isArray(objects)) return
    objects.forEach((obj) => this.addToMap(obj))
  }

  /**
   * Draws a single game object to the canvas with optional horizontal flip.
   * @param {Object} mo - The game object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo)
    }

    mo.draw(this.ctx)
    mo.drawFrame?.(this.ctx)

    if (mo.otherDirection) {
      this.flipImageBack(mo)
    }
  }

  /**
   * Horizontally flips the object before drawing it (e.g., when facing left).
   * @param {Object} mo - The object to flip.
   */
  flipImage(mo) {
    this.ctx.save()
    this.ctx.translate(mo.width, 0)
    this.ctx.scale(-1, 1)
    mo.x = mo.x * -1
  }

  /**
   * Reverses the horizontal flip after drawing.
   * @param {Object} mo - The object to unflip.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1
    this.ctx.restore()
  }

  /**
   * Applies a temporary shaking effect to the camera for visual impact.
   * @param {number} duration - Duration of the shake in ms.
   * @param {number} intensity - Strength of the shake movement.
   */
  shakeCamera(duration = 500, intensity = 10) {
    const startTime = Date.now()
    const originalX = this.camera_x

    const shakeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime

      if (elapsed >= duration) {
        clearInterval(shakeInterval)
        this.camera_x = originalX
      } else {
        this.camera_x = originalX + Math.sin(elapsed / 50) * intensity
      }
    }, 16)
  }

  endGame() {
    this.showEndscreen = true
    this.showReturnTimer = false
    this.ui.activeMenuButton = "restart-game"
    this.ui.menuOptions = ["restart-game", "back-to-menu"]
  }
}