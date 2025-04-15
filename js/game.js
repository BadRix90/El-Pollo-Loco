let canvas;
let world;
let keyboard = new Keyboard();
let backgroundMusic;


/**
 * Initializes the game by setting up the canvas, background music,
 * and creating a new instance of the game world.
 */
function init() {
    canvas = document.getElementById('canvas');
    backgroundMusic = document.getElementById('background-music');
    backgroundMusic.volume = 0.015;

    world = new World(canvas, keyboard);
}


/**
 * Toggles the background music on or off and updates the UI icon accordingly.
 */
function toggleMusic() {
    if (!backgroundMusic) return;

    const btn = document.getElementById('sound-toggle-btn');

    if (backgroundMusic.paused) {
        backgroundMusic.play();
        btn.src = "img/GUI/3 Icons/Icons/Icon_03.png";
    } else {
        backgroundMusic.pause();
        btn.src = "img/GUI/3 Icons/Icons/Icon_34.png";
    }
}


/**
 * Toggles the in-game options menu visibility by delegating to the world handler.
 */
function toggleMenu() {
    world.handleMenuAction("toggle-menu");
}


/**
 * Stops the current game session, resets background and intro music,
 * clears intervals and animation frames, and reinitializes the world.
 */
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


/**
 * Handles keydown events and updates the keyboard state.
 * Also toggles the options menu with Escape and prevents default behavior for Space.
 */
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

    if (world && world.showIntro) {
        if (e.key === "ArrowLeft") {
            world.ui.navigateMenu("left");
        } else if (e.key === "ArrowRight") {
            world.ui.navigateMenu("right");
        } else if (e.key === "Enter") {
            world.handleMenuAction(world.ui.activeMenuButton.toLowerCase());
        }
    }

});


/**
 * Handles keyup events and resets the corresponding key states in the keyboard object.
 */
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


