/**
 * Manages UI rendering and menu navigation.
 */
class UIManager {
  /**
   * @param {World} world - The current game world instance
   */
  constructor(world) {
    this.world = world
    this.ctx = world.ctx
    this.canvas = world.canvas
    this.pulseFrame = 0
  }

  /**
   * Draws all intro elements.
   */
  drawIntroScreen() {
    this.prepareIntroScreen();

    if (this.world.introY < 100) {
      this.world.introY += 2;
      return;
    }
    this.setupIntroMenu();
    this.drawIntroButtons();
    this.pulseFrame++;
  }

  /**
  * Sets up intro menu grid and default active button.
  */
  setupIntroMenu() {
    this.menuGrid = [["start", "controls"], ["impressum"]];
    if (!this.menuGrid.flat().includes(this.activeMenuButton)) {
      this.activeMenuButton = "start";
    }
  }

  /**
   * Prepares the intro screen.
   */
  prepareIntroScreen() {
    const ctx = this.ctx
    ctx.save()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.world.menuButtons = []
    this.showMusicButton()
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.font = "40px CyberpunkCraftpixPixel"
    ctx.fillStyle = "#00fff7"
    ctx.textAlign = "center"
    ctx.fillText("Power of the Beast", this.canvas.width / 2, this.world.introY)
    ctx.restore()
  }

  /**
   * Displays the music button.
   */
  showMusicButton() {
    const btnMusic = document.getElementById("btn-music")
    if (btnMusic) btnMusic.style.display = "block"
  }

  /**
   * Draws intro buttons.
   */
  drawIntroButtons() {
    const centerX = this.canvas.width / 2
    const baseY = this.world.introY
    this.drawButton(centerX - 90, baseY + 140, 160, 40, "START", "start")
    this.drawButton(centerX + 90, baseY + 140, 160, 40, "CONTROLS", "controls")
    this.drawButton(centerX, baseY + 200, 160, 40, "IMPRINT", "impressum")
  }

  /**
   * Draws a UI button.
   */
  drawButton(x, y, w, h, text, action) {
    const ctx = this.ctx
    const isActive = this.activeMenuButton === action
    const isHovered = this.isButtonHovered(x, y, w, h)

    ctx.fillStyle = isActive ? this.getPulsingColor() : "thistle"
    ctx.fillRect(x - w / 2, y - h / 2, w, h)
    ctx.strokeStyle = "#000"
    ctx.strokeRect(x - w / 2, y - h / 2, w, h)
    ctx.fillStyle = isHovered ? "#444" : "#000"
    ctx.font = "16px CyberpunkCraftpixPixel"
    ctx.textAlign = "center"
    ctx.fillText(text, x, y + 5)

    this.world.menuButtons.push({ x: x - w / 2, y: y - h / 2, w, h, action })
  }

  /**
   * Checks if a button is hovered.
   */
  isButtonHovered(x, y, w, h) {
    return (
      this.world.hoverX >= x - w / 2 &&
      this.world.hoverX <= x + w / 2 &&
      this.world.hoverY >= y - h / 2 &&
      this.world.hoverY <= y + h / 2
    )
  }

  /**
   * Returns pulsing color for active button.
   */
  getPulsingColor() {
    const pulse = 0.6 + 0.4 * Math.abs(Math.sin(this.pulseFrame / 10))
    return `rgba(216,191,216,${pulse})`
  }

  /**
   * Draws background for options menu.
   */
  drawOptionsBackground() {
    const ctx = this.ctx
    ctx.save()
    ctx.fillStyle = "rgba(0,0,0,0.5)"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.font = "32px CyberpunkCraftpixPixel"
    ctx.fillStyle = "#fff"
    ctx.textAlign = "center"
    ctx.fillText("MENU", this.canvas.width / 2, 120)
    ctx.restore()
  }

  /**
   * Draws the Controls menu.
   */
  drawControlsOverlay() {
    this.setupMenu(["back-to-menu"], "back-to-menu")
    const ctx = this.ctx
    ctx.save()
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawControlsText()
    ctx.restore()
    this.pulseFrame++
  }

  /**
   * Draws controls legend.
   */
  drawControlsText() {
    const ctx = this.ctx
    const centerX = this.canvas.width / 2
    ctx.font = "32px CyberpunkCraftpixPixel"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText("CONTROLS", centerX, 100)
    ctx.font = "18px CyberpunkCraftpixPixel"
    ctx.textAlign = "left"
      ;["A - Left", "D - Right", "SPACE - Jump", "Q - Shoot"].forEach((line, i) =>
        ctx.fillText(line, centerX - 150, 160 + i * 30),
      )
      ;["M - Menu", "F - Fullscreen", "T - Toggle Music/ Sound"].forEach((line, i) =>
        ctx.fillText(line, centerX + 20, 160 + i * 30),
      )
    this.drawButton(centerX, 350, 160, 40, "BACK", "back-to-menu")
  }

  /**
   * Draws the Impressum overlay.
   */
  drawImpressumOverlay() {
    this.setupMenu(["back-to-intro"], "back-to-intro")
    const ctx = this.ctx
    ctx.save()
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.font = "24px CyberpunkCraftpixPixel"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText("IMPRINT", this.canvas.width / 2, 80)
    ctx.font = "16px CyberpunkCraftpixPixel"
    ctx.fillText("This game is a private educational project.", this.canvas.width / 2, 130)
    ctx.fillText("Created by Kay Dietrich – Developer Academy 2025", this.canvas.width / 2, 160)
    ctx.fillText("No commercial use intended.", this.canvas.width / 2, 190)
    this.drawButton(this.canvas.width / 2, 300, 160, 40, "BACK", "back-to-intro")
    ctx.restore()
    this.pulseFrame++
  }

  /**
   * Draws the start intro.
   */
  drawStartIntro() {
    this.setupMenu(["start-intro"], "start-intro")
    const ctx = this.ctx
    ctx.save()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.font = "20px CyberpunkCraftpixPixel"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText("No mouse. Just arrows, Enter, or touch.", this.canvas.width / 2, 180)
    ctx.fillText("Old-school controls only.", this.canvas.width / 2, 220)
    this.drawButton(this.canvas.width / 2, 300, 160, 40, "START", "start-intro")
    ctx.restore()
    this.pulseFrame++
  }

  /**
   * Sets up menu options.
   */
  setupMenu(options, defaultActive) {
    this.menuOptions = options
    this.activeMenuButton = defaultActive
    this.world.menuButtons = []
  }

  /**
   * Sets up the Options menu grid and default active button.
   */
  setupOptionsMenu() {
    this.menuGrid = [["exit"], ["controls"], ["toggle-menu"]]
    if (!this.activeMenuButton || !this.menuGrid.flat().includes(this.activeMenuButton)) {
      this.activeMenuButton = "exit"
    }
  }

  /**
   * Draws the Options menu buttons.
   */
  drawOptionsButtons() {
    const centerX = this.canvas.width / 2
    const baseY = 200

    this.drawButton(centerX, baseY, 200, 40, "EXIT GAME", "exit")
    this.drawButton(centerX, baseY + 60, 200, 40, "CONTROLS", "controls")
    this.drawButton(centerX, baseY + 120, 200, 40, "BACK", "toggle-menu")
  }

  /**
   * Prepares the Options menu background.
   */
  prepareOptionsScreen() {
    const ctx = this.ctx
    ctx.save()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.font = "32px CyberpunkCraftpixPixel"
    ctx.fillStyle = "#fff"
    ctx.textAlign = "center"
    ctx.fillText("MENU", this.canvas.width / 2, 100)
    ctx.restore()
  }

  /**
   * Draws the complete Options menu screen.
   */
  drawOptionsMenu() {
    if (!this.menuGrid) {
      this.setupOptionsMenu()
    }
    this.prepareOptionsScreen()
    this.drawOptionsButtons()
    this.pulseFrame++
  }

  /**
   * Navigates menu smartly through a grid based on direction.
   */
  navigateMenuSmart(direction) {
    if (!this.menuGrid || !this.activeMenuButton) return;

    let { row, col } = this.findButtonPosition();

    if (direction === "up") {
        row = (row + 1) % this.menuGrid.length;
    } else if (direction === "down") {
        row = (row - 1 + this.menuGrid.length) % this.menuGrid.length;
    } else if (direction === "left") {
        col = (col - 1 + this.menuGrid[row].length) % this.menuGrid[row].length;
    } else if (direction === "right") {
        col = (col + 1) % this.menuGrid[row].length;
    }

    if (this.menuGrid[row] && this.menuGrid[row][col]) {
        this.activeMenuButton = this.menuGrid[row][col];
    }
}

  /**
   * Finds button position in grid.
   */
  findButtonPosition() {
    for (let r = 0; r < this.menuGrid.length; r++) {
      const c = this.menuGrid[r].indexOf(this.activeMenuButton)
      if (c !== -1) return { row: r, col: c }
    }
    return { row: 0, col: 0 }
  }

  /**
   * Calculates new position based on direction.
   */
  getNewGridPosition(row, col, dir) {
    let newRow = row,
      newCol = col
    if (dir === "up") newRow--
    if (dir === "down") newRow++
    if (dir === "left") newCol--
    if (dir === "right") newCol++
    return [newRow, newCol]
  }

  /**
   * Navigates linear menu.
   */
  navigateMenu(direction) {
    const index = this.menuOptions.indexOf(this.activeMenuButton)
    if (direction === "left" || direction === "up") {
      this.activeMenuButton = this.menuOptions[(index - 1 + this.menuOptions.length) % this.menuOptions.length]
    } else if (direction === "right" || direction === "down") {
      this.activeMenuButton = this.menuOptions[(index + 1) % this.menuOptions.length]
    }
  }

  /**
   * Draws the endscreen.
   */
  drawEndscreen() {
    const ctx = this.ctx
    ctx.save()
    this.fadeOpacity = (this.fadeOpacity || 0) + 0.01
    if (this.fadeOpacity > 1) this.fadeOpacity = 1
    ctx.globalAlpha = this.fadeOpacity
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.globalAlpha = 1
    ctx.fillStyle = "#ff0033"
    ctx.font = "48px CyberpunkCraftpixPixel"
    ctx.textAlign = "center"
    ctx.fillText(this.world.character.isDead() ? "GAME OVER" : "YOU WIN", this.canvas.width / 2, 150)
    this.drawButton(this.canvas.width / 2, 240, 180, 40, "RESTART", "restart-game")
    this.drawButton(this.canvas.width / 2, 300, 180, 40, "MENU", "back-to-menu")
    ctx.restore()
    this.pulseFrame++
  }
}
