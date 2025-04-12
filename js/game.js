let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas')
    world = new World(canvas, keyboard)
    let backgroundMusic = document.getElementById('background-music');
    backgroundMusic.volume = 0.015;
}

function stopGame() {
    const bgm = document.getElementById('background-music');
    if (bgm) {
      bgm.pause();
      bgm.currentTime = 0;
    }
  
    const introMusic = document.getElementById('intro-music');
    if (introMusic) {
      introMusic.volume = 0.02;
      introMusic.currentTime = 32;
      introMusic.play();
    }

    if (world) {
        clearInterval(world.lyricInterval);
        clearInterval(world.lyricSetupInterval);
        cancelAnimationFrame(world.drawLoopId); // <- das war wichtig!
      }
  
    world = new World(canvas, keyboard);
  }
  

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && world) {
        world.showOptionsMenu = !world.showOptionsMenu;
    }

    if (e.key === " ") {
        e.preventDefault();
        keyboard.SPACE = true;
    } else if (e.key.toLowerCase() === "a" || e.key === "ArrowLeft") {
        keyboard.LEFT = true;
    } else if (e.key.toLowerCase() === "w" || e.key === "ArrowUp") {
        keyboard.UP = true;
    } else if (e.key.toLowerCase() === "d" || e.key === "ArrowRight") {
        keyboard.RIGHT = true;
    } else if (e.key.toLowerCase() === "s" || e.key === "ArrowDown") {
        keyboard.DOWN = true;
    } else if (e.key.toLowerCase() === "q") {
        keyboard.q = true;
    } else if (e.key === "Control") {
        keyboard.CTRL = true;
    } else if (e.key === "Shift") {
        keyboard.SHIFT = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === " ") {
        keyboard.SPACE = false;
    } else if (e.key.toLowerCase() === "a" || e.key === "ArrowLeft") {
        keyboard.LEFT = false;
    } else if (e.key.toLowerCase() === "w" || e.key === "ArrowUp") {
        keyboard.UP = false;
    } else if (e.key.toLowerCase() === "d" || e.key === "ArrowRight") {
        keyboard.RIGHT = false;
    } else if (e.key.toLowerCase() === "s" || e.key === "ArrowDown") {
        keyboard.DOWN = false;
    } else if (e.key.toLowerCase() === "q") {
        keyboard.q = false;
    } else if (e.key === "Control") {
        keyboard.CTRL = false;
    } else if (e.key === "Shift") {
        keyboard.SHIFT = false;
    }
});


