let allGameSounds = [];
let canvas;
let world;
let keyboard = new Keyboard();
let muteSounds = false;

/**
 * Initializes the game by setting up the canvas, background music,
 * and creating a new instance of the game world.
 */
function init() {
    canvas = document.getElementById('canvas');
    initializeAudioSystem();
    muteMusic = localStorage.getItem("muteMusic") === "true";
    muteSounds = localStorage.getItem("muteSounds") === "true";

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add("mobile");
    }

    stopMusic();
    world = new World(canvas, keyboard);

    if (!muteMusic) {
        startIntroMusic();
    }
}


/**
 * Displays a mute notification for music and sounds.
 */
function showMuteNotification(text) {
    const notification = document.getElementById('mute-notification');
    if (notification) {
        notification.textContent = text;
        notification.style.opacity = 1;
        setTimeout(() => {
            notification.style.opacity = 0;
        }, 2000);
    }
}

/**
 * Toggles the background music and sound effects on or off.
 */
function toggleMusic() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    muteMusic = !muteMusic;
    muteSounds = muteMusic;
    localStorage.setItem("muteMusic", muteMusic);
    localStorage.setItem("muteSounds", muteSounds);

    const introMusic = document.getElementById('intro-music');
    const backgroundMusic = document.getElementById('background-music');

    const inGame = world && !world.showIntro && !world.showStartIntro && !world.showControlsOverlay && !world.showOptionsMenu && !world.showImpressumOverlay;

    if (muteMusic) {
        if (introMusic) introMusic.pause();
        if (backgroundMusic) backgroundMusic.pause();
        stopAllSounds();
    } else {
        if (inGame) {
            if (backgroundMusic) backgroundMusic.play();
            if (introMusic) introMusic.pause();
        } else {
            if (introMusic) {
                introMusic.currentTime = 32;
                introMusic.volume = 0.01;
                safePlay(introMusic);
            }
            if (backgroundMusic) backgroundMusic.pause();
        }
    }

    const btnMusic = document.getElementById('btn-music');
    if (btnMusic) {
        btnMusic.src = muteMusic
            ? "img/GUI/3 Icons/Icons/Icon_34.png"
            : "img/GUI/3 Icons/Icons/Icon_03.png";
    }

    showMuteNotification(muteMusic ? "MUSIC/SOUND OFF" : "MUSIC/SOUND ON");
    updateSoundVolumes();

}


/**
 * Toggles the in-game options menu visibility.
 */
function toggleMenu() {
    world.uiHandler.handleMenuAction("toggle-menu");
}

/**
 * Stops the current game session and resets the world.
 */
function stopGame({ goToMenu = false } = {}) {
    if (world) {
        cancelAnimationFrame(world.drawLoopId);
    }

    world = new World(canvas, keyboard);

    if (world.touchOverlay) {
        world.touchOverlay.disabled = false;
    }

    if (goToMenu) {
        world.showStartIntro = false;
        world.showIntro = true;
        world.introStep = 2;
        world.introY = -100;
        world.showMainMenu = true;
        world.showEndscreen = false;

        if (!muteMusic) {
            startIntroMusic();
        }
    } else {
        world.showStartIntro = false;
        world.showIntro = false;
        world.showMainMenu = false;
        world.showEndscreen = false;
        world.setWorld();
        world.character.startIntroRun();
        world.policeCar = new PoliceCar(world);

        if (!muteMusic) {
            startGameMusic();
        }
    }
}


/**
 * Handles keydown events and updates the keyboard state.
 */
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && world) {
        world.showOptionsMenu = !world.showOptionsMenu;
    } else if (e.key.toLowerCase() === "m") {
        world.showOptionsMenu = !world.showOptionsMenu;
    }

    if (world && world.showImpressumOverlay && e.key === "Enter") {
        world.uiHandler.handleMenuAction("back-to-intro");
    }

    if (world && world.showStartIntro && e.key === "Enter") {
        const introMusic = document.getElementById('intro-music');
        if (!muteMusic && introMusic) {
            introMusic.currentTime = 32;
            introMusic.volume = 0.005;
            safePlay(introMusic);
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
        if (world && !world.showIntro && !world.showStartIntro && !world.showControlsOverlay && !world.showOptionsMenu && !world.showImpressumOverlay) {
            toggleMusic();
        }
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
                world.uiHandler.handleMenuAction(world.ui.activeMenuButton);
            }
        }
    }

    if (world && world.showControlsOverlay && e.key === "Enter") {
        world.uiHandler.handleMenuAction("back-to-menu");
    }

    if (world && world.showOptionsMenu) {
        if (e.key === "ArrowUp") {
            world.ui.navigateMenu("up");
        } else if (e.key === "ArrowDown") {
            world.ui.navigateMenu("down");
        } else if (e.key === "Enter") {
            if (world.ui.activeMenuButton) {
                world.uiHandler.handleMenuAction(world.ui.activeMenuButton);
            }
        }
    }

    if (world && world.showIntro) {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
            const dir = e.key.replace("Arrow", "").toLowerCase();
            world.ui.navigateMenuSmart(dir);
        } else if (e.key === "Enter") {
            if (world.ui.activeMenuButton) {
                world.uiHandler.handleMenuAction(world.ui.activeMenuButton.toLowerCase());
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

/**
 * Safely plays audio elements.
 */
function safePlay(audioElement) {
    if (audioElement && typeof audioElement.play === "function") {
        audioElement.play().catch((e) => {
            if (e.name !== "AbortError") {
            }
        });
    }
}


/**
 * Stops all sounds in the game.
 */
function updateSoundVolumes() {
    if (!world) return;

    if (world.level?.endboss) {
        world.level.endboss.laserSound.volume = muteSounds ? 0 : 0.03;
        world.level.endboss.sinusBombSound.volume = muteSounds ? 0 : 0.03;
    }

    if (world.character) {
        world.character.laserSound.volume = muteSounds ? 0 : 0.03;
    }

    if (world.activeBombs.length > 0) {
        world.activeBombs.forEach(bomb => {
            bomb.explodeSound.volume = muteSounds ? 0 : 0.06;
        });
    }
}
