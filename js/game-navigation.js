// js/game-navigation.js
function navigateToNextScene(buttonElement) {
    const clickSfx = sceneAudioElements.find(audio => audio && audio.id === 'click-sound');
    if (clickSfx && typeof playGameSfx === 'function') playGameSfx(clickSfx);

    // Save sound state to sessionStorage (ensure gameIsMuted is accessible or passed)
    sessionStorage.setItem('meowAdventureMuted', gameIsMuted.toString()); // Assumes gameIsMuted is global from game-audio.js

    // Save music state (ensure bgMusic is accessible or passed)
    const bgMusic = sceneAudioElements.find(audio => audio && audio.id.includes('bg-music'));
    if (bgMusic && !bgMusic.paused && !gameIsMuted) { // Check gameIsMuted
        sessionStorage.setItem('musicTime', bgMusic.currentTime);
        sessionStorage.setItem('musicSrc', bgMusic.src);
        sessionStorage.setItem('musicPlaying', 'true');
    } else {
        sessionStorage.setItem('musicPlaying', 'false');
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