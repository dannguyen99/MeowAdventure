// js/game-audio.js
let gameIsMuted = false; // This will be initialized
let $soundToggleButtonElement = null; // To be set by the scene

// Audio elements that need to be globally accessible for muting
// These would be defined in each scene's HTML and then potentially passed here or discovered
let sceneAudioElements = []; // e.g., [bgMusic, clickSoundEffect, meowSound, ...]

function initializeSoundState(toggleButtonSelector, audioElementsArray) {
    $soundToggleButtonElement = $(toggleButtonSelector);
    sceneAudioElements = audioElementsArray.filter(Boolean); // Filter out any null/undefined

    gameIsMuted = sessionStorage.getItem('meowAdventureMuted') === 'true' ||
                   (sessionStorage.getItem('meowAdventureMuted') === null && localStorage.getItem('meowAdventureMuted') !== 'false');

    applyGameMuteState(); // Apply initial state

    if ($soundToggleButtonElement.length) {
        $soundToggleButtonElement.on('click', function() {
            gameIsMuted = !gameIsMuted;
            applyGameMuteState();
            localStorage.setItem('meowAdventureMuted', gameIsMuted.toString());
            sessionStorage.setItem('meowAdventureMuted', gameIsMuted.toString());

            // Optional: Play click sound on unmute
            const clickSfx = sceneAudioElements.find(audio => audio && audio.id === 'click-sound');
            if (!gameIsMuted && clickSfx) {
                const originalMute = clickSfx.muted;
                clickSfx.muted = false;
                playGameSfx(clickSfx); // Assuming playGameSfx exists
                clickSfx.muted = originalMute;
            }

            // Handle background music play/pause
            const bgMusic = sceneAudioElements.find(audio => audio && audio.id.includes('bg-music')); // More flexible ID check
            if (bgMusic) {
                if (!gameIsMuted && bgMusic.paused) {
                    bgMusic.play().catch(e => console.warn("BG Music play on unmute error", e));
                } else if (gameIsMuted && !bgMusic.paused) {
                    bgMusic.pause();
                }
            }
        });
    }
}

function applyGameMuteState() {
    sceneAudioElements.forEach(audioEl => {
        if (audioEl) audioEl.muted = gameIsMuted;
    });
    if ($soundToggleButtonElement && $soundToggleButtonElement.length) {
        $soundToggleButtonElement.text(gameIsMuted ? '🔇' : '🔊');
    }
}

function playGameSfx(soundElement, loop = false) {
    if (soundElement && !gameIsMuted) {
        soundElement.currentTime = 0;
        soundElement.loop = loop;
        soundElement.play().catch(e=>console.warn("SFX error for " + soundElement.id, e));
    }
}

function stopGameSfx(soundElement) {
    if (soundElement) {
        soundElement.pause();
        soundElement.currentTime = 0;
        soundElement.loop = false;
    }
}

function setGlobalVolume(volumeLevel) { // Example for global volume control on all sounds
    sceneAudioElements.forEach(audioEl => {
        if (audioEl) audioEl.volume = volumeLevel;
    });
}