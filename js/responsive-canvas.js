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

function setScale() {
  const canvasWidth = 720;
  const canvasHeight = 480;

  const scaleX = window.innerWidth / canvasWidth;
  const scaleY = window.innerHeight / canvasHeight;
  const scale = Math.min(scaleX, scaleY);

  document.documentElement.style.setProperty('--scale', scale);
}

window.addEventListener('resize', setScale);
window.addEventListener('orientationchange', setScale);
document.addEventListener('fullscreenchange', setScale);
window.addEventListener('load', setScale);

// optional auch gleich beim Laden ausführen
setScale();
