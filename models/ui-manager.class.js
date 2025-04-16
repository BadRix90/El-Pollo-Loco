class UIManager {


  /**
 * Creates a new UIManager instance.
 * @param {World} world - The current game world instance.
 */
  constructor(world) {
    this.world = world
    this.ctx = world.ctx
    this.canvas = world.canvas
    this.pulseFrame = 0;
  }


  /**
 * Draws a styled button on the canvas and registers it for interaction.
 * @param {number} x - Center x-position of the button.
 * @param {number} y - Center y-position of the button.
 * @param {number} w - Button width.
 * @param {number} h - Button height.
 * @param {string} text - Label text shown on the button.
 * @param {string} action - The action identifier triggered on click.
 */
  drawButton(x, y, w, h, text, action) {
    const ctx = this.ctx
    const isHovered =
      this.world.hoverX >= x - w / 2 &&
      this.world.hoverX <= x + w / 2 &&
      this.world.hoverY >= y - h / 2 &&
      this.world.hoverY <= y + h / 2

    const isActive = this.activeMenuButton === action;

    ctx.fillStyle = isActive
      ? `rgba(216,191,216,${0.6 + 0.4 * Math.abs(Math.sin(this.pulseFrame / 10))})`
      : "thistle";

    ctx.fillRect(x - w / 2, y - h / 2, w, h)

    ctx.strokeStyle = "#000"
    ctx.strokeRect(x - w / 2, y - h / 2, w, h)

    ctx.fillStyle = isHovered ? "#444" : "#000"
    ctx.font = "16px CyberpunkCraftpixPixel"
    ctx.textAlign = "center"
    ctx.fillText(text, x, y + 5)

    this.world.menuButtons = this.world.menuButtons || []
    this.world.menuButtons.push({ x: x - w / 2, y: y - h / 2, w, h, action })
  }


  /**
 * Renders the animated intro screen including title, lyrics,
 * and start/control buttons based on intro progress.
 */
  drawIntroScreen() {
    const ctx = this.ctx
    ctx.save()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.world.menuButtons = []

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.font = "40px CyberpunkCraftpixPixel"
    ctx.fillStyle = "#00fff7"
    ctx.textAlign = "center"
    ctx.fillText("Power of the Beast", this.canvas.width / 2, this.world.introY)

    if (this.world.introY < 100 && !this.world.showStartButton) {
      this.world.introY += 2
      ctx.restore()
      return
    }

    this.menuGrid = [
      ["start", "controls"],
      ["impressum",]
    ];

    if (
      !this.activeMenuButton ||
      !this.menuGrid.flat().includes(this.activeMenuButton)
    ) {
      this.activeMenuButton = "start";
    } 

    if (this.world.introStep === 2) {
      ctx.font = "20px CyberpunkCraftpixPixel"
      ctx.fillStyle = "#ffffff"
      ctx.fillText("Created by Kay Dietrich", this.canvas.width / 2, this.world.introY + 40)

      ctx.font = "14px CyberpunkCraftpixPixel"
      ctx.fillText("Music: 'Power of the Beast' by Beast in Black", this.canvas.width / 2, this.world.introY + 70)
      ctx.fillText("For private and educational use only", this.canvas.width / 2, this.world.introY + 90)
      this.drawButton(this.canvas.width / 2 - 90, this.world.introY + 140, 160, 40, "START", "start")
      this.drawButton(this.canvas.width / 2 + 90, this.world.introY + 140, 160, 40, "CONTROLS", "controls")
      this.drawButton(this.canvas.width / 2, this.world.introY + 200, 160, 40, "IMPRINT", "impressum");

    }
    ctx.restore()
    this.pulseFrame++;
  }


  /**
 * Renders the in-game options menu with buttons for exit, controls, and going back.
 */
  drawOptionsMenu() {
    const ctx = this.ctx
    const centerX = this.canvas.width / 2

    this.world.menuButtons = [];

    this.menuOptions = ["exit", "controls", "toggle-menu"];
    if (!this.activeMenuButton || !this.menuOptions.includes(this.activeMenuButton)) {
      this.activeMenuButton = "exit";
    }

    ctx.save()
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.font = "32px CyberpunkCraftpixPixel"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.fillText("MENU", centerX, 120)

    this.drawButton(centerX, 200, 200, 40, "Exit Game", "exit")
    this.drawButton(centerX, 260, 200, 40, "Controls", "controls")
    this.drawButton(centerX, 320, 200, 40, "BACK", "toggle-menu")

    ctx.restore()
    this.pulseFrame++;

  }


  /**
 * Displays a control legend with keybindings on a black overlay.
 */
  drawControlsOverlay() {
    const ctx = this.ctx
    const centerX = this.canvas.width / 2

    this.world.menuButtons = []

    this.menuOptions = ["back-to-menu"];
    this.activeMenuButton = "back-to-menu";

    ctx.save()
    ctx.fillStyle = "rgba(0,0,0,1)"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.font = "32px CyberpunkCraftpixPixel"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.fillText("CONTROLS", centerX, 100)

    ctx.textAlign = "left";
    ctx.font = "18px CyberpunkCraftpixPixel";

    const linesLeft = [
      "A - Left",
      "D - Right",
      "SPACE - Jump",
      "Q - Shoot"
    ];

    const linesRight = [
      "M - Menu",
      "F - Fullscreen",
      "T - Toggle Music"
    ];

    linesLeft.forEach((line, i) => {
      ctx.fillText(line, centerX - 150, 160 + i * 30);
    });

    linesRight.forEach((line, i) => {
      ctx.fillText(line, centerX + 20, 160 + i * 30);
    });


    this.drawButton(centerX, 350, 160, 40, "BACK", "back-to-menu")

    ctx.restore()
    this.pulseFrame++;

  }


  /**
 * Resets the game state to the intro screen.
 * Stops music, clears intervals, resets game variables and reinitializes key objects.
 */
  returnToMainMenu() {
    const bgm = document.getElementById('background-music');
    const introMusic = document.getElementById('intro-music');

    if (bgm) {
      bgm.pause();
      bgm.currentTime = 0;
    }

    if (introMusic) {
      introMusic.currentTime = 32;
      introMusic.volume = 0.02;
      introMusic.play();
    }

    clearInterval(this.world.lyricSetupInterval);
    clearInterval(this.world.lyricInterval);
    this.world.lyricInterval = null;
    this.world.lyricSetupInterval = null;
    this.world.showLyrics = false;

    this.world.showIntro = true;
    this.world.introY = -100;
    this.world.introStep = 0;
    this.world.showStartButton = false;
    this.world.showOptionsMenu = false;

    this.world.character = new Character();
    this.world.character.world = this.world;
    this.world.character.introRunning = true;

    this.world.statusBar = new StatusBar();
    this.world.camera_x = 0;
    this.world.level = level1;

    this.world.endbossDefeatedAt = null;
    this.world.showReturnTimer = false;

    this.world.setWorld();
  }

  navigateMenuSmart(direction) {
    if (!this.menuGrid || !this.activeMenuButton) return;

    let row = 0, col = 0;

    for (let r = 0; r < this.menuGrid.length; r++) {
      const c = this.menuGrid[r].indexOf(this.activeMenuButton);
      if (c !== -1) {
        row = r;
        col = c;
        break;
      }
    }

    let newRow = row;
    let newCol = col;

    if (direction === "up") newRow--;
    if (direction === "down") newRow++;
    if (direction === "left") newCol--;
    if (direction === "right") newCol++;

    if (
      this.menuGrid[newRow] &&
      this.menuGrid[newRow][newCol]
    ) {
      this.activeMenuButton = this.menuGrid[newRow][newCol];
    }
  }


  navigateMenu(direction) {
    const index = this.menuOptions.indexOf(this.activeMenuButton);

    if (direction === "left" || direction === "up") {
      this.activeMenuButton = this.menuOptions[(index - 1 + this.menuOptions.length) % this.menuOptions.length];
    } else if (direction === "right" || direction === "down") {
      this.activeMenuButton = this.menuOptions[(index + 1) % this.menuOptions.length];
    }
  }

  drawImpressumOverlay() {
    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;

    this.menuOptions = ["back-to-intro"];
    this.activeMenuButton = "back-to-intro";
    this.world.menuButtons = [];

    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.font = "24px CyberpunkCraftpixPixel";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("IMPRINT", centerX, 80);

    ctx.font = "16px CyberpunkCraftpixPixel";
    ctx.fillText("This game is a private educational project.", centerX, 130);
    ctx.fillText("Created by Kay Dietrich – Developer Academy 2025", centerX, 160);
    ctx.fillText("No commercial use intended.", centerX, 190);

    this.drawButton(centerX, 300, 160, 40, "BACK", "back-to-intro");

    ctx.restore();
    this.pulseFrame++;
  }

  drawStartIntro() {
    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
  
    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
    ctx.font = "20px CyberpunkCraftpixPixel";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("No mouse. Just arrows, Enter, or touch.", centerX, 180);
    ctx.fillText("Old-school controls only.", centerX, 220);
  
    this.activeMenuButton = "start-intro";
    this.menuOptions = ["start-intro"];
    this.world.menuButtons = [];
  
    const pulse = 0.6 + 0.4 * Math.abs(Math.sin(this.pulseFrame / 10));
    ctx.fillStyle = `rgba(216,191,216,${pulse})`;
    this.drawButton(centerX, 300, 160, 40, "START", "start-intro");
  
    ctx.restore();
    this.pulseFrame++;
  }
  

}
