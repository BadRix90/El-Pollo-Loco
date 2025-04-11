// Add this code to your main game initialization file
function setupResponsiveCanvas() {
    const canvas = document.getElementById("canvas")
    if (!canvas) return
  
    function resizeCanvas() {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
  
      // Set canvas size based on device
      if (isMobile || window.innerWidth < 1024) {
        // Mobile-optimized size
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
  
        // Apply mobile-specific styles
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        document.body.style.overflow = "hidden"
      } else {
        // Desktop size (original game dimensions)
        canvas.width = 720
        canvas.height = 480
        canvas.style.width = "720px"
        canvas.style.height = "480px"
      }
    }
  
    // Initial resize
    resizeCanvas()
  
    // Listen for orientation changes and window resizes
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("orientationchange", resizeCanvas)
  }
  
  // Call this function when the game loads
  document.addEventListener("DOMContentLoaded", setupResponsiveCanvas)
  