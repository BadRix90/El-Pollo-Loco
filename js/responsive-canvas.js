/**
 * Resizes the canvas element to maintain a fixed aspect ratio (720x480)
 * based on the size of its container. Ensures the canvas fits the screen
 * without distortion by adjusting width or height accordingly.
 */
function resizeCanvas() {
  const canvas = document.getElementById("canvas");
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  const originalWidth = 720;
  const originalHeight = 480;
  const aspectRatio = calculateAspectRatio(originalWidth, originalHeight);

  let { newWidth, newHeight } = calculateNewCanvasSize(containerWidth, containerHeight, aspectRatio);

  applyCanvasSize(canvas, newWidth, newHeight, originalWidth, originalHeight);
}

/**
 * Calculates the aspect ratio.
 */
function calculateAspectRatio(width, height) {
  return width / height;
}

/**
 * Calculates new canvas dimensions based on container size and aspect ratio.
 */
function calculateNewCanvasSize(containerWidth, containerHeight, aspectRatio) {
  let newWidth, newHeight;

  if (containerWidth / containerHeight > aspectRatio) {
    newHeight = containerHeight;
    newWidth = newHeight * aspectRatio;
  } else {
    newWidth = containerWidth;
    newHeight = newWidth / aspectRatio;
  }

  return {
    newWidth: Math.min(newWidth, 720),
    newHeight: Math.min(newHeight, 480)
  };
}

/**
 * Applies the calculated size to the canvas.
 */
function applyCanvasSize(canvas, width, height, originalWidth, originalHeight) {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = originalWidth;
  canvas.height = originalHeight;
}

/**
 * Resizes the canvas when the window loads to ensure initial proper sizing.
 */
window.addEventListener("load", resizeCanvas)

/**
 * Resizes the canvas dynamically when the window is resized.
 */
window.addEventListener("resize", resizeCanvas)

/**
 * Resizes the canvas after a slight delay when the device orientation changes,
 * allowing layout to settle before recalculating size.
 */
window.addEventListener("orientationchange", () => {
  setTimeout(resizeCanvas, 100)
})
