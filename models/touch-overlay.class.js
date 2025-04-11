class TouchOverlay {
    constructor(canvas, keyboard) {
      this.canvas = canvas
      this.keyboard = keyboard
      this.buttons = this.createButtons()
      this.registerTouchEvents()
  
      // Always enable touch controls on mobile devices regardless of screen width
      this.updateMobileStatus()
  
      // Listen for resize events to update mobile status
      window.addEventListener("resize", () => this.updateMobileStatus())
    }
  
    updateMobileStatus() {
      // More comprehensive mobile detection
      this.isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
  
      // Force mobile mode if screen width is below threshold or if it's a mobile device
      this.disabled = !(this.isMobile || window.innerWidth < 1024)
  
      // Update the game UI based on mobile status
      if (this.isMobile && this.canvas) {
        // Adjust button positions for better mobile experience
        this.buttons.forEach((btn) => {
          if (btn.id === "left") btn.relY = -100
          if (btn.id === "right") btn.relY = -100
          if (btn.id === "jump") btn.relY = -100
          if (btn.id === "shoot") btn.relY = -100
        })
      }
    }
  
    createButtons() {
      return [
        { id: "left", relX: 50, relY: -150, width: 50, height: 50, img: new Image() },
        { id: "right", relX: 150, relY: -150, width: 50, height: 50, img: new Image() },
        { id: "jump", relX: -150, relY: -150, width: 50, height: 50, img: new Image() },
        { id: "shoot", relX: -50, relY: -150, width: 50, height: 50, img: new Image() },
      ]
    }
  
    registerTouchEvents() {
      this.canvas.addEventListener("touchstart", (event) => {
        this.handleTouchEvent(event, true)
      })
  
      this.canvas.addEventListener("touchend", (event) => {
        this.handleTouchEvent(event, false)
      })
  
      this.canvas.addEventListener("touchmove", (event) => {
        event.preventDefault() // Prevent scrolling
      })
    }
  
    handleTouchEvent(event, isPressed) {
      const touch = event.touches[0]
      if (!touch) return
  
      const rect = this.canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
  
      this.buttons.forEach((btn) => {
        const btnX = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX
        const btnY = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY
        const scaleFactor = this.isMobile ? 1.5 : 1
        if (x > btnX && x < btnX + btn.width * scaleFactor && y > btnY && y < btnY + btn.height * scaleFactor) {
          switch (btn.id) {
            case "left":
              this.keyboard.keys["ArrowLeft"] = isPressed
              break
            case "right":
              this.keyboard.keys["ArrowRight"] = isPressed
              break
            case "jump":
              this.keyboard.keys["Space"] = isPressed
              break
            case "shoot":
              this.keyboard.keys["KeyD"] = isPressed
              break
          }
        }
      })
    }
  
    draw(ctx) {
      // Update mobile status on each frame to handle orientation changes
      this.updateMobileStatus()
  
      if (this.disabled) return
  
      this.buttons.forEach((btn) => {
        if (!btn.img.src) {
          switch (btn.id) {
            case "left":
              btn.img.src = "img/GUI/3 Icons/Icons/Icon_14.png"
              break
            case "right":
              btn.img.src = "img/GUI/3 Icons/Icons/Icon_12.png"
              break
            case "jump":
              btn.img.src = "img/GUI/3 Icons/Icons/Icon_13.png"
              break
            case "shoot":
              btn.img.src = "img/GUI/3 Icons/Icons/Icon_19.png"
              break
          }
        }
  
        const x = btn.relX >= 0 ? btn.relX : this.canvas.width + btn.relX
        const y = btn.relY >= 0 ? btn.relY : this.canvas.height + btn.relY
  
        // Make buttons more visible and larger on mobile
        ctx.save()
        ctx.globalAlpha = 0.8
        const scaleFactor = this.isMobile ? 1.5 : 1
        ctx.drawImage(btn.img, x, y, btn.width * scaleFactor, btn.height * scaleFactor)
        ctx.restore()
      })
    }
  }
  