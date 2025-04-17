let audioContext;
let introMusic;
let backgroundMusic;
let muteMusic = false;


/**
 * Initializes the audio system.
 */
function initializeAudioSystem() {
    introMusic = document.getElementById('intro-music');
    backgroundMusic = document.getElementById('background-music');

    document.addEventListener('click', createAudioContextIfNeeded, { once: true });
    document.addEventListener('keydown', createAudioContextIfNeeded, { once: true });
    document.addEventListener('touchstart', createAudioContextIfNeeded, { once: true });
}

/**
 * Creates or resumes the AudioContext after user interaction.
 */
function createAudioContextIfNeeded() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!audioContext && AudioContextClass) {
        audioContext = new AudioContextClass();
    }
    if (audioContext?.state === 'suspended') {
        audioContext.resume();
    }
}

/**
 * Plays an audio element safely.
 */
function playAudio(audioElement) {
    if (audioElement && !muteMusic && !muteSounds) { 
        audioElement.play().catch(e => console.log('Audio play prevented:', e));
      }
}

/**
 * Pauses and resets an audio element.
 */
function pauseAudio(audioElement) {
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
}

/**
 * Starts the intro menu music.
 */
function startIntroMusic() {
    if (introMusic && !muteMusic) {
        introMusic.currentTime = 0;
        introMusic.volume = 0.0;
        playAudio(introMusic);
    }
}

/**
 * Starts the background game music.
 */
function startGameMusic() {
    if (backgroundMusic && !muteMusic) {
        backgroundMusic.volume = 0.01;
        playAudio(backgroundMusic);
    }
}

/**
 * Stops all music.
 */
function stopMusic() {
    pauseAudio(introMusic);
    pauseAudio(backgroundMusic);
}


function stopAllSounds() {
    const soundElements = document.querySelectorAll('audio.sound');
    soundElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}
