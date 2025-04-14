
function resizeCanvas() {
  const canvas = document.getElementById("canvas")
  const container = document.getElementById("canvas-container")

  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

  const originalWidth = 720
  const originalHeight = 480

  const aspectRatio = originalWidth / originalHeight

  let newWidth, newHeight

  if (containerWidth / containerHeight > aspectRatio) {
    newHeight = containerHeight
    newWidth = newHeight * aspectRatio
  } else {
    newWidth = containerWidth
    newHeight = newWidth / aspectRatio
  }

  canvas.style.width = `${newWidth}px`
  canvas.style.height = `${newHeight}px`
  canvas.width = originalWidth
  canvas.height = originalHeight
}

window.addEventListener("load", resizeCanvas)
window.addEventListener("resize", resizeCanvas)
window.addEventListener("orientationchange", () => {
  setTimeout(resizeCanvas, 100)
})
