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
