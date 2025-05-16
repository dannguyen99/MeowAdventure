// js/game-navigation.js
function navigateToNextScene(buttonElement) {
    const clickSfx = sceneAudioElements.find(audio => audio && audio.id === 'click-sound');
    if (clickSfx && typeof playGameSfx === 'function') playGameSfx(clickSfx);

    // Save sound state to sessionStorage (ensure gameIsMuted is accessible or passed)
    sessionStorage.setItem('meowAdventureMuted', gameIsMuted.toString());

    const bgMusic = sceneAudioElements.find(audio => audio && audio.id.includes('bg-music'));
    if (bgMusic && !bgMusic.paused && !gameIsMuted) { // Check gameIsMuted
        sessionStorage.setItem('musicTime', bgMusic.currentTime);
        sessionStorage.setItem('musicSrc', bgMusic.src);
        sessionStorage.setItem('musicPlaying', 'true'); // THIS IS KEY
    } else {
        // If music is paused or game is muted, explicitly set musicPlaying to false
        // unless you have a scenario where muted music should still "resume" its conceptual play state.
        sessionStorage.setItem('musicPlaying', 'false'); // THIS IS ALSO KEY
        if (bgMusic) { // Still save src and time if music element exists
            sessionStorage.setItem('musicSrc', bgMusic.src);
            sessionStorage.setItem('musicTime', bgMusic.currentTime || 0); // Store current time or 0
        }
    }

    const nextSceneUrl = $(buttonElement).data('nextscene');
    if (nextSceneUrl) {
        gsap.to('#game-container', { autoAlpha: 0, duration: 0.5, onComplete: () => {
            window.location.href = nextSceneUrl;
        }});
    } else {
        console.error("Next scene URL not found on button:", buttonElement);
    }
}