
let gameIsMuted = false; 
let $soundToggleButtonElement = null; 



let sceneAudioElements = []; 


window.gameAudio = {
    bgMusic: null,
    clickSound: null,
    
};

function initializeSoundState(toggleButtonSelector, audioElementsArray, commonSoundSelectors = {}) {
    $soundToggleButtonElement = $(toggleButtonSelector);
    sceneAudioElements = audioElementsArray.filter(Boolean);

    gameIsMuted = sessionStorage.getItem('meowAdventureMuted') === 'true' ||
                   (sessionStorage.getItem('meowAdventureMuted') === null && localStorage.getItem('meowAdventureMuted') !== 'false');

    
    if (commonSoundSelectors.bgMusic) {
        const bgMusicEl = $(commonSoundSelectors.bgMusic)[0];
        if (bgMusicEl) {
            window.gameAudio.bgMusic = bgMusicEl;
        } else {
            console.warn(`Background music element not found for selector: ${commonSoundSelectors.bgMusic}`);
        }
    }
    if (commonSoundSelectors.clickSound) {
        const clickSoundEl = $(commonSoundSelectors.clickSound)[0]; 
        if (clickSoundEl) {
            window.gameAudio.clickSound = clickSoundEl;
        } else {
            console.warn(`Click sound element not found for selector: ${commonSoundSelectors.clickSound}`);
        }
    }

    
    sceneAudioElements.forEach(audioEl => {
        if (audioEl) {
            
            if (audioEl.id.includes('bg-music')) audioEl.volume = 0.2;
            else if (audioEl.id === 'click-sound') audioEl.volume = 0.4;
            
        }
    });

    applyGameMuteState(); 

    
    const bgMusic = sceneAudioElements.find(audio => audio && audio.id.includes('bg-music'));
    if (bgMusic) {
        const prevMusicTime = parseFloat(sessionStorage.getItem('musicTime')) || 0;
        const prevMusicSrc = sessionStorage.getItem('musicSrc');
        const musicShouldBePlaying = sessionStorage.getItem('musicPlaying') === 'true';

        if (!gameIsMuted) {
            if (musicShouldBePlaying && prevMusicSrc === bgMusic.src) {
                
                bgMusic.currentTime = prevMusicTime;
                bgMusic.play().then(() => {
                    console.log("BG Music resumed successfully at", bgMusic.currentTime);
                }).catch(e => {
                    console.warn("BG Music resume error. Will try fresh play. Error:", e);
                    
                    
                    
                    
                    
                    
                    
                });
            } else if (prevMusicSrc !== bgMusic.src || !musicShouldBePlaying) {
                
                
                bgMusic.currentTime = 0; 
                bgMusic.play().then(() => {
                    console.log("BG Music started fresh for this scene.");
                }).catch(e => {
                    console.warn("BG Music fresh play error:", e);
                    
                    
                });
            }
            
        } else {
            
            if (!bgMusic.paused) {
                bgMusic.pause();
            }
            
            if (musicShouldBePlaying && prevMusicSrc === bgMusic.src) {
                 sessionStorage.setItem('musicTime', bgMusic.currentTime); 
            }
        }
    }
    


    if ($soundToggleButtonElement && $soundToggleButtonElement.length) {
        $soundToggleButtonElement.off('click').on('click', function() { 
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
    if (!soundElement) {
        
        return;
    }
    
    const audioEl = soundElement instanceof jQuery ? soundElement[0] : soundElement;

    if (gameIsMuted) {
        
        return;
    }

    if (audioEl && typeof audioEl.play === 'function') {
        audioEl.loop = loop;
        audioEl.currentTime = 0; 
        audioEl.play().catch(error => {
            console.warn(`SFX error for ${audioEl.id || audioEl.src}:`, error);
        });
    } else {
        console.warn("playGameSfx: Provided soundElement is not a playable audio element or is missing.", soundElement); 
    }
}

function stopGameSfx(soundElement) {
    if (soundElement) {
        soundElement.pause();
        soundElement.currentTime = 0;
        soundElement.loop = false;
    }
}

function setGlobalVolume(volumeLevel) { 
    sceneAudioElements.forEach(audioEl => {
        if (audioEl) audioEl.volume = volumeLevel;
    });
}