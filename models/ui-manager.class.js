class UIManager {
  constructor(world) {
    this.world = world
    this.ctx = world.ctx
    this.canvas = world.canvas
  }

  drawButton(x, y, w, h, text, action) {
    const ctx = this.ctx
    const isHovered =
      this.world.hoverX >= x - w / 2 &&
      this.world.hoverX <= x + w / 2 &&
      this.world.hoverY >= y - h / 2 &&
      this.world.hoverY <= y + h / 2

    ctx.fillStyle = "thistle"
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

    if (this.world.introY < 180 && !this.world.showStartButton) {
      this.world.introY += 2
      ctx.restore()
      return
    }

    if (this.world.introStep === 0) {
      this.world.introStep = 1
      this.world.showLyrics = true
      this.world.lyricIndex = 0

      this.world.lyricInterval = setInterval(() => {
        this.world.lyricIndex++
        if (this.world.lyricIndex >= this.world.introLyrics.length) {
          clearInterval(this.world.lyricInterval)
          this.world.showLyrics = false
          this.world.introStep = 2
        }
      }, 3000)
    }

    if (this.world.showLyrics && this.world.introLyrics[this.world.lyricIndex]) {
      ctx.font = "20px CyberpunkCraftpixPixel"
      ctx.fillStyle = "#ffffff"
      ctx.fillText(this.world.introLyrics[this.world.lyricIndex], this.canvas.width / 2, this.world.introY + 60)
    }

    if (this.world.introStep === 2) {
      ctx.font = "20px CyberpunkCraftpixPixel"
      ctx.fillStyle = "#ffffff"
      ctx.fillText("Created by Kay Dietrich", this.canvas.width / 2, this.world.introY + 60)

      ctx.font = "14px CyberpunkCraftpixPixel"
      ctx.fillText("Music: 'Power of the Beast' by Beast in Black", this.canvas.width / 2, this.world.introY + 90)
      ctx.fillText("For private and educational use only", this.canvas.width / 2, this.world.introY + 110)

      this.drawButton(this.canvas.width / 2, this.world.introY + 150, 160, 40, "START", "start")

      this.drawButton(this.canvas.width / 2, this.world.introY + 200, 160, 40, "CONTROLS", "controls")
    }

    ctx.restore()
  }

  drawOptionsMenu() {
    const ctx = this.ctx
    const centerX = this.canvas.width / 2

    this.world.menuButtons = []

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
  }

  drawControlsOverlay() {
    const ctx = this.ctx
    const centerX = this.canvas.width / 2

    this.world.menuButtons = []

    ctx.save()
    ctx.fillStyle = "rgba(0,0,0,1)"
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.font = "32px CyberpunkCraftpixPixel"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.fillText("CONTROLS", centerX, 100)

    const lines = ["A - Left", "D - Right", "SPACE - Jump", "Q - Shoot", "ESC - Menu"]

    ctx.font = "18px CyberpunkCraftpixPixel"
    lines.forEach((line, i) => {
      ctx.fillText(line, centerX, 160 + i * 30)
    })

    this.drawButton(centerX, 350, 160, 40, "BACK", "back-to-menu")

    ctx.restore()
  }

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

}
