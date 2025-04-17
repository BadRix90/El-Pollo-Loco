<<<<<<< HEAD
let audioContext;
let introMusic;
let muteMusic = false;

function initializeAudioSystem() {
  introMusic = document.getElementById('intro-music');
  document.addEventListener('click', createAudioContextIfNeeded, { once: true });
  document.addEventListener('keydown', createAudioContextIfNeeded, { once: true });
  document.addEventListener('touchstart', createAudioContextIfNeeded, { once: true });
}

function createAudioContextIfNeeded() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!audioContext && AudioContextClass) {
    audioContext = new AudioContextClass();
  }
  if (audioContext?.state === 'suspended') {
    audioContext.resume();
  }
}

function playAudio(audioElement) {
  if (audioElement && !muteMusic) {
    audioElement.play().catch(e => console.log('Audio play prevented:', e));
  }
}

function pauseAudio(audioElement) {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
}

function startGameMusic() {
  if (introMusic && !muteMusic) {
    introMusic.volume = 0.015;
    introMusic.currentTime = 0;
    playAudio(introMusic);
  }
}

function stopMusic() {
  pauseAudio(introMusic);
}

function toggleMusic() {
  muteMusic = !muteMusic;
  if (muteMusic) {
    stopMusic();
  } else {
    startGameMusic();
  }
}
=======
/**
 * Safely plays audio elements only after user interaction
 * Handles the NotAllowedError that occurs when trying to play audio
 * before user interaction with the document
 *
 * @param {HTMLAudioElement} audioElement - The audio element to play
 * @returns {Promise} - A promise that resolves when audio plays or rejects with error
 */
function safePlay(audioElement) {
    if (!audioElement) return Promise.resolve()
  
    return audioElement.play().catch((error) => {
      if (error.name === "NotAllowedError") {
        console.log("Audio playback was prevented by browser autoplay policy. Waiting for user interaction.")
        // We'll set up a one-time event listener for the entire document
        const playOnInteraction = () => {
          audioElement
            .play()
            .then(() => {
              // Remove the event listeners once we've successfully played
              document.removeEventListener("click", playOnInteraction)
              document.removeEventListener("keydown", playOnInteraction)
              document.removeEventListener("touchstart", playOnInteraction)
            })
            .catch((e) => console.error("Still could not play audio:", e))
        }
  
        // Add event listeners for common user interactions
        document.addEventListener("click", playOnInteraction, { once: true })
        document.addEventListener("keydown", playOnInteraction, { once: true })
        document.addEventListener("touchstart", playOnInteraction, { once: true })
      } else {
        console.error("Error playing audio:", error)
      }
    })
  }
  
  /**
   * Initializes audio elements to be ready for playback
   * Should be called early in the application lifecycle
   */
  function initializeAudio() {
    // Create a context on page load
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext) {
      const audioContext = new AudioContext()
  
      // Resume the audio context on user interaction
      const resumeAudioContext = () => {
        if (audioContext.state === "suspended") {
          audioContext.resume()
        }
  
        document.removeEventListener("click", resumeAudioContext)
        document.removeEventListener("keydown", resumeAudioContext)
        document.removeEventListener("touchstart", resumeAudioContext)
      }
  
      document.addEventListener("click", resumeAudioContext, { once: true })
      document.addEventListener("keydown", resumeAudioContext, { once: true })
      document.addEventListener("touchstart", resumeAudioContext, { once: true })
    }
  
    // Pre-load audio elements
    const audioElements = document.querySelectorAll("audio")
    audioElements.forEach((audio) => {
      audio.load()
    })
  }
  
  // Make these functions available globally
  window.safePlay = safePlay
  window.initializeAudio = initializeAudio
  
>>>>>>> parent of 2e36381 (refactor: remove music logic but keep music button structure for future use)
