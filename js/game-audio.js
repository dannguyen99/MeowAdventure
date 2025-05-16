// js/game-audio.js
let gameIsMuted = false; // This will be initialized
let $soundToggleButtonElement = null; // To be set by the scene

// Audio elements that need to be globally accessible for muting
// These would be defined in each scene's HTML and then potentially passed here or discovered
let sceneAudioElements = []; // e.g., [bgMusic, clickSoundEffect, meowSound, ...]

function initializeSoundState(toggleButtonSelector, audioElementsArray) {
    $soundToggleButtonElement = $(toggleButtonSelector);
    sceneAudioElements = audioElementsArray.filter(Boolean);

    gameIsMuted = sessionStorage.getItem('meowAdventureMuted') === 'true' ||
                   (sessionStorage.getItem('meowAdventureMuted') === null && localStorage.getItem('meowAdventureMuted') !== 'false');

    // Apply volumes before attempting to play
    sceneAudioElements.forEach(audioEl => {
        if (audioEl) {
            // You might want to set default volumes here or pass them from scene data
            if (audioEl.id.includes('bg-music')) audioEl.volume = 0.2;
            else if (audioEl.id === 'click-sound') audioEl.volume = 0.4;
            // ... other default volumes
        }
    });

    applyGameMuteState(); // Apply initial mute state (which also updates button)

    // --- Robust Music Start/Resume Logic ---
    const bgMusic = sceneAudioElements.find(audio => audio && audio.id.includes('bg-music'));
    if (bgMusic) {
        const prevMusicTime = parseFloat(sessionStorage.getItem('musicTime')) || 0;
        const prevMusicSrc = sessionStorage.getItem('musicSrc');
        const musicShouldBePlaying = sessionStorage.getItem('musicPlaying') === 'true';

        if (!gameIsMuted) {
            if (musicShouldBePlaying && prevMusicSrc === bgMusic.src) {
                // Attempt to resume existing track
                bgMusic.currentTime = prevMusicTime;
                bgMusic.play().then(() => {
                    console.log("BG Music resumed successfully at", bgMusic.currentTime);
                }).catch(e => {
                    console.warn("BG Music resume error. Will try fresh play. Error:", e);
                    // Fallback to fresh play if resume fails (e.g., currentTime invalid)
                    // Or if user hasn't interacted enough for *this specific document load*
                    // Often, a fresh play attempt after user interaction (like first dialogue click) is better.
                    // For now, we'll just log it. A more complex solution would queue play until interaction.
                    // However, since initializeSceneFramework is called in $(document).ready(),
                    // and the first dialogue display usually happens after a slight delay or background anim,
                    // sometimes the browser considers this "enough" interaction from previous page click.
                });
            } else if (prevMusicSrc !== bgMusic.src || !musicShouldBePlaying) {
                // New music track for this scene OR music wasn't explicitly set to be playing
                // (e.g., first scene part or after music explicitly stopped)
                bgMusic.currentTime = 0; // Start new track from beginning
                bgMusic.play().then(() => {
                    console.log("BG Music started fresh for this scene.");
                }).catch(e => {
                    console.warn("BG Music fresh play error:", e);
                    // Autoplay restrictions are common here.
                    // The click on gameContainer to advance dialogue will often "unlock" audio.
                });
            }
            // If musicShouldBePlaying is false, we don't attempt to play, respecting that state.
        } else {
            // Music is muted, ensure it's paused if it was trying to play
            if (!bgMusic.paused) {
                bgMusic.pause();
            }
            // If music was playing and is now muted, store its current time for potential resume
            if (musicShouldBePlaying && prevMusicSrc === bgMusic.src) {
                 sessionStorage.setItem('musicTime', bgMusic.currentTime); // Update time even if muted
            }
        }
    }
    // --- End Robust Music Logic ---


    if ($soundToggleButtonElement && $soundToggleButtonElement.length) {
        $soundToggleButtonElement.off('click').on('click', function() { // .off().on()
            gameIsMuted = !gameIsMuted;
            applyGameMuteState();
            localStorage.setItem('meowAdventureMuted', gameIsMuted.toString());
            sessionStorage.setItem('meowAdventureMuted', gameIsMuted.toString());

            const clickSfx = sceneAudioElements.find(audio => audio && audio.id === 'click-sound');
            if (!gameIsMuted && clickSfx && typeof playGameSfx === 'function') {
                const originalMute = clickSfx.muted;
                clickSfx.muted = false;
                playGameSfx(clickSfx);
                clickSfx.muted = originalMute;
            }

            if (bgMusic) {
                if (!gameIsMuted && bgMusic.paused) {
                    // If music was explicitly meant to be playing (check sessionStorage again or a new flag)
                    // or if it's a new scene where music should start
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