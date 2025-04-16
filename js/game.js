let canvas;
let world;
let keyboard = new Keyboard();
let backgroundMusic;
let muteMusic = false;
let muteSounds = false;

/**
 * Initializes the game by setting up the canvas, background music,
 * and creating a new instance of the game world.
 */
function init() {
    canvas = document.getElementById('canvas');
    backgroundMusic = document.getElementById('background-music');
    backgroundMusic.volume = 0.015;
    muteMusic = localStorage.getItem("muteMusic") === "true";
    muteSounds = localStorage.getItem("muteSounds") === "true";

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add("mobile");
    }


    world = new World(canvas, keyboard);
}


/**
 * Toggles the background music on or off and updates the UI icon accordingly.
 */
function toggleMusic() {
    muteMusic = !muteMusic;
    localStorage.setItem("muteMusic", muteMusic);

    const introMusic = document.getElementById('intro-music');

    if (muteMusic) {
        backgroundMusic.pause();
        if (introMusic) introMusic.pause();
    } else {
        backgroundMusic.play();
        if (introMusic) introMusic.play();
    }
}


function toggleSounds() {
    muteSounds = !muteSounds;
    localStorage.setItem("muteSounds", muteSounds);
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
        introMusic.volume = 0.01;
        introMusic.currentTime = 32;
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
    } else if (e.key.toLowerCase() === "m") {
        world.showOptionsMenu = !world.showOptionsMenu;
    }
    if (world && world.showImpressumOverlay && e.key === "Enter") {
        world.handleMenuAction("back-to-intro");
    }
    if (world && world.showStartIntro && e.key === "Enter") {
        const introMusic = document.getElementById('intro-music');
        if (!muteMusic && introMusic) {
            introMusic.currentTime = 32;
            introMusic.volume = 0.01;
            introMusic.play();
        }
        world.showStartIntro = false;
        world.showIntro = true;
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
    } else if (e.key.toLowerCase() === "t") {
        toggleMusic();
    } else if (e.key.toLowerCase() === "y") {
        toggleSounds();
    } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
    }

    if (world && world.showEndscreen) {
        if (e.key === "ArrowUp") {
            world.ui.navigateMenu("up");
        } else if (e.key === "ArrowDown") {
            world.ui.navigateMenu("down");
        } else if (e.key === "Enter") {
            if (world.ui.activeMenuButton) {
                world.handleMenuAction(world.ui.activeMenuButton);
            }
        }
    }


    if (world && world.showControlsOverlay && e.key === "Enter") {
        world.handleMenuAction("back-to-menu");
    }

    if (world && world.showOptionsMenu) {
        if (e.key === "ArrowUp") {
            world.ui.navigateMenu("up");
        } else if (e.key === "ArrowDown") {
            world.ui.navigateMenu("down");
        } else if (e.key === "Enter") {
            if (world.ui.activeMenuButton) {
                world.handleMenuAction(world.ui.activeMenuButton);
            }
        }
    }

    if (world && world.showIntro) {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
            const dir = e.key.replace("Arrow", "").toLowerCase();
            world.ui.navigateMenuSmart(dir);
        } else if (e.key === "Enter") {
            if (world.ui.activeMenuButton) {
                world.handleMenuAction(world.ui.activeMenuButton.toLowerCase());
            }
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


