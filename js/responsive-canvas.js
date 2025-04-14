// Add this code to your main game initialization file
function setupResponsiveCanvas() {
    const canvas = document.getElementById("canvas")
    if (!canvas) return
  
    function resizeCanvas() {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
  

      if (isMobile || window.innerWidth < 1024) {

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
  

        canvas.style.width = "100%"
        canvas.style.height = "100%"
        document.body.style.overflow = "hidden"
      } else {

        canvas.width = 720
        canvas.height = 480
        canvas.style.width = "720px"
        canvas.style.height = "480px"
      }
    }
  

    resizeCanvas()

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("orientationchange", resizeCanvas)
  }
  
  document.addEventListener("DOMContentLoaded", setupResponsiveCanvas)
  