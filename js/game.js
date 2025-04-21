/**
 * Global Variables
 */
let allGameSounds = [];
let canvas;
let world;
let keyboard = new Keyboard();
let muteSounds = false;

/**
 * Initializes the game setup.
 */
function init() {
    setupCanvas();
    setupAudioSettings();
    setupMobileView();
    createWorld();
}

/**
 * Sets up the canvas and audio system.
 */
function setupCanvas() {
    canvas = document.getElementById('canvas');
    initializeAudioSystem();
}

/**
 * Initializes audio settings from localStorage.
 */
function setupAudioSettings() {
    muteMusic = localStorage.getItem("muteMusic") === "true";
    muteSounds = localStorage.getItem("muteSounds") === "true";
    stopMusic();
}

/**
 * Adjusts view settings for mobile devices.
 */
function setupMobileView() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) document.body.classList.add("mobile");
}

/**
 * Creates a new game world.
 */
function createWorld() {
    world = new World(canvas, keyboard);
    if (!muteMusic) startIntroMusic();
}

/**
 * Toggles music and sound mute status.
 */
function toggleMusic() {
    if (audioContext?.state === 'suspended') audioContext.resume();
    handleMusicToggle();
    updateMusicButtonIcon();
    updateSoundVolumes();
}

/**
 * Handles the mute toggle logic.
 */
function handleMusicToggle() {
    muteMusic = !muteMusic;
    muteSounds = muteMusic;
    localStorage.setItem("muteMusic", muteMusic);
    localStorage.setItem("muteSounds", muteSounds);
    handleGameMusic();
}

/**
 * Starts or pauses appropriate music based on game state.
 */
function handleGameMusic() {
    const introMusic = document.getElementById('intro-music');
    const backgroundMusic = document.getElementById('background-music');
    const inGame = isInGame();

    if (muteMusic) {
        pauseAllMusic(introMusic, backgroundMusic);
    } else {
        playCorrectMusic(introMusic, backgroundMusic, inGame);
    }
}
/**
 * Updates the music button icon.
 */
function updateMusicButtonIcon() {
    const btnMusic = document.getElementById('btn-music');
    if (!btnMusic) return;
    btnMusic.src = muteMusic ? "img/GUI/3 Icons/Icons/Icon_34.png" : "img/GUI/3 Icons/Icons/Icon_03.png";
    showMuteNotification(muteMusic ? "MUSIC/SOUND OFF" : "MUSIC/SOUND ON");
}

/**
 * Displays a short mute notification popup.
 * @param {string} message - The message to display
 */
function showMuteNotification(text) {
    const notif = document.getElementById('mute-notification');
    if (notif) {
        notif.innerText = text;
        notif.style.opacity = 1;
        setTimeout(() => {
            notif.style.opacity = 0;
        }, 2000);
    }
}


/**
 * Determines if the player is currently in gameplay.
 */
function isInGame() {
    return world && !world.showIntro && !world.showStartIntro && !world.showControlsOverlay && !world.showOptionsMenu && !world.showImpressumOverlay;
}

/**
 * Pauses all music tracks.
 */
function pauseAllMusic(introMusic, backgroundMusic) {
    introMusic?.pause();
    backgroundMusic?.pause();
    stopAllSounds();
}

/**
 * Plays the correct music based on game state.
 */
function playCorrectMusic(introMusic, backgroundMusic, inGame) {
    if (inGame) {
        if (backgroundMusic) {
            backgroundMusic.volume = 0.1; // Stellen Sie die Lautstärke ein
            safePlay(backgroundMusic);
        }
        introMusic?.pause();
    } else {
        if (introMusic) {
            introMusic.currentTime = 32;
            introMusic.volume = 0.01;
            safePlay(introMusic);
        }
        backgroundMusic?.pause();
    }
}

/**
 * Stops the current game and resets the world.
 */
function stopGame({ goToMenu = false } = {}) {
    resetWorld();
    if (goToMenu) setupMenuWorld();
    else setupNewGame();
}

/**
 * Resets the world instance.
 */
function resetWorld() {
    if (world) cancelAnimationFrame(world.drawLoopId);
    world = new World(canvas, keyboard);
    world.touchOverlay && (world.touchOverlay.disabled = false);
}

/**
 * Sets up the world for returning to menu.
 */
function setupMenuWorld() {
    world.showStartIntro = false;
    world.showIntro = true;
    world.introStep = 2;
    world.introY = -100;
    world.showMainMenu = true;
    world.showEndscreen = false;
    if (!muteMusic) startIntroMusic();
}

/**
 * Sets up a new game session.
 */
function setupNewGame() {
    world.showStartIntro = false;
    world.showIntro = false;
    world.showMainMenu = false;
    world.showEndscreen = false;
    world.setWorld();
    world.character.startIntroRun();
    world.policeCar = new PoliceCar(world);
    if (!muteMusic) startGameMusic();
}

// Keyboard Event Listeners
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

/**
 * Handles all key down events.
 */
function handleKeyDown(e) {
    processGeneralKeyDown(e);
    if (world?.showEndscreen) processMenuKeyDown(e);
    if (world?.showControlsOverlay && e.key === "Enter") world.uiHandler.handleMenuAction("back-to-menu");
    if (world?.showOptionsMenu) processIntroKeyDown(e);
    if (world?.showIntro) processIntroKeyDown(e);
}

/**
 * Processes general gameplay key inputs.
 */
function processGeneralKeyDown(e) {
    if (e.key === " ") { e.preventDefault(); keyboard.SPACE = true; }
    else if (['a', 'ArrowLeft'].includes(e.key.toLowerCase())) keyboard.LEFT = true;
    else if (['w', 'ArrowUp'].includes(e.key.toLowerCase())) keyboard.UP = true;
    else if (['d', 'ArrowRight'].includes(e.key.toLowerCase())) keyboard.RIGHT = true;
    else if (['s', 'ArrowDown'].includes(e.key.toLowerCase())) keyboard.DOWN = true;
    else if (e.key.toLowerCase() === 'q') keyboard.q = true;
    else if (e.key === "Control") keyboard.CTRL = true;
    else if (e.key === "Shift") keyboard.SHIFT = true;
    else if (e.key.toLowerCase() === "t") { if (isInGame()) toggleMusic(); }
    else if (e.key.toLowerCase() === "f") toggleFullscreen();
}

/**
 * Processes menu navigation key inputs.
 */
function processMenuKeyDown(e) {
    if (e.key === "ArrowUp") world.ui.navigateMenu("up");
    else if (e.key === "ArrowDown") world.ui.navigateMenu("down");
    else if (e.key === "Enter" && world.ui.activeMenuButton) world.uiHandler.handleMenuAction(world.ui.activeMenuButton);
}

/**
 * Processes intro screen navigation key inputs.
 */
function processIntroKeyDown(e) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        const dir = e.key.replace("Arrow", "").toLowerCase();
        world.ui.navigateMenuSmart(dir);
    } else if (e.key === "Enter" && world.ui.activeMenuButton) {
        world.uiHandler.handleMenuAction(world.ui.activeMenuButton.toLowerCase());
    }
}

/**
 * Handles all key up events.
 */
function handleKeyUp(e) {
    if (e.key === " ") keyboard.SPACE = false;
    else if (['a', 'ArrowLeft'].includes(e.key.toLowerCase())) keyboard.LEFT = false;
    else if (['w', 'ArrowUp'].includes(e.key.toLowerCase())) keyboard.UP = false;
    else if (['d', 'ArrowRight'].includes(e.key.toLowerCase())) keyboard.RIGHT = false;
    else if (['s', 'ArrowDown'].includes(e.key.toLowerCase())) keyboard.DOWN = false;
    else if (e.key.toLowerCase() === 'q') keyboard.q = false;
    else if (e.key === "Control") keyboard.CTRL = false;
    else if (e.key === "Shift") keyboard.SHIFT = false;
}

/**
 * Safely plays audio elements without throwing errors.
 */
function safePlay(audioElement) {
    if (audioElement && typeof audioElement.play === "function") {
        audioElement.play().catch((e) => {
            if (e.name !== "AbortError") { }
        });
    }
}

/**
 * Updates volumes for all sound effects based on mute state.
 */
function updateSoundVolumes() {
    if (!world) return;
    if (world.level?.endboss) updateBossSounds();
    if (world.character) world.character.laserSound.volume = muteSounds ? 0 : 0.03;
    if (world.activeBombs.length > 0) updateBombSounds();
}

/**
 * Updates the boss's sound volumes.
 */
function updateBossSounds() {
    world.level.endboss.laserSound.volume = muteSounds ? 0 : 0.03;
    world.level.endboss.sinusBombSound.volume = muteSounds ? 0 : 0.03;
}

/**
 * Updates active bomb sound volumes.
 */
function updateBombSounds() {
    world.activeBombs.forEach(bomb => {
        bomb.explodeSound.volume = muteSounds ? 0 : 0.06;
    });
}

/**
 * Updates the sound button icon based on the current mute state.
 * If the `muteSounds` variable is true, the button icon is set to the muted icon.
 * Otherwise, it is set to the unmuted icon.
 * 
 * The function first checks if the sound button element exists in the DOM.
 * If it does not exist, the function exits early.
 */
function updateSoundButtonIcon() {
    const btnSound = document.getElementById('btn-sound');
    if (!btnSound) return;
    btnSound.src = muteSounds ? "img/GUI/3 Icons/Icons/Icon_34.png" : "img/GUI/3 Icons/Icons/Icon_03.png";
}

/**
 * Initializes the audio settings by retrieving mute preferences from localStorage.
 * Updates the UI icons for music and sound buttons and stops any playing music.
 */
function setupAudioSettings() {
    muteMusic = localStorage.getItem("muteMusic") === "true";
    muteSounds = localStorage.getItem("muteSounds") === "true";
    updateMusicButtonIcon();
    updateSoundButtonIcon();
    
    if (!muteMusic) {
      handleGameMusic();
    } else {
      stopMusic();
    }
  }