// js/game-main.js
function preloadGameImages(urls, callback) {
    let loadedCount = 0;
    const numImages = urls.length;
    if (numImages === 0) { if (callback) callback(); return; }
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
        img.onload = () => { loadedCount++; if (loadedCount === numImages && callback) callback(); };
        img.onerror = () => { console.error("Failed to load image:", url); loadedCount++; if (loadedCount === numImages && callback) callback(); };
    });
}

function initializeSceneFramework(sceneSpecificData) {
    // Unpack scene specific data
    const {
        dialogues,
        imagesToPreload,
        audioSelectors = {}, // e.g., { bgMusic: '#bg-music-scene1', click: '#click-sound', ... }
        onSceneReady // A callback function from the scene-specific JS to run after preloading
    } = sceneSpecificData;

    // Collect audio elements based on selectors
    let collectedAudioElements = [];
    for (const key in audioSelectors) {
        const el = $(audioSelectors[key])[0];
        if (el) collectedAudioElements.push(el);
        else console.warn(`Audio element not found for selector: ${audioSelectors[key]}`);
    }

    // Initialize common systems
    if (typeof initializeSoundState === 'function') {
        initializeSoundState('#scene-sound-toggle', collectedAudioElements);
    }
    if (typeof initializeDialogueSystem === 'function') {
        initializeDialogueSystem(dialogues, '#dialogue-text', '#dialogue-box-container', '#next-scene-button');
    }

    // Setup common navigation handler (if the button exists)
    const $nextSceneBtn = $('#next-scene-button');
    if ($nextSceneBtn.length && typeof navigateToNextScene === 'function') {
        $nextSceneBtn.off('click').on('click', function() { // .off to prevent multiple bindings if re-init
            navigateToNextScene(this);
        });
    }

    // Setup scene click for dialogue advancement
    const $gameCont = $('#game-container');
    if ($gameCont.length && typeof advanceDialogue === 'function') {
        $gameCont.off('click').on('click', function(e) {
            if ($(e.target).is('button') || $(e.target).closest('button').length) return;
            advanceDialogue();
        });
    }


    // Preload images and then run scene-specific setup
    preloadGameImages(imagesToPreload, () => {
        // Standard scene intro animations
        gsap.fromTo('#scene-background', {autoAlpha:0}, { duration: 0.7, autoAlpha: 1, ease: "power1.out", onComplete: () => {
            if (typeof showNextDialogue === 'function') { // from game-dialogue.js
                showNextDialogue(); // Display first dialogue
            }
            if (onSceneReady && typeof onSceneReady === 'function') {
                onSceneReady(); // Call scene-specific logic after common setup
            }
        }});
    });
}