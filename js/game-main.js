
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
    
    const {
        dialogues, 
        imagesToPreload,
        audioSelectors = {},
        onSceneReady
    } = sceneSpecificData;

    
    let collectedAudioElements = [];
    for (const key in audioSelectors) {
        const el = $(audioSelectors[key])[0];
        if (el) collectedAudioElements.push(el);
        else console.warn(`Audio element not found for selector: ${audioSelectors[key]}`);
    }

    
    if (typeof initializeSoundState === 'function') {
        initializeSoundState('#scene-sound-toggle', collectedAudioElements);
    }
    if (window.gameDialogueSystem && typeof window.gameDialogueSystem.init === 'function') {
        window.gameDialogueSystem.init(dialogues, '#dialogue-text', '#dialogue-box-container', '#next-scene-button');
    } else {
        console.error("gameDialogueSystem.init function not found!");
    }

    
    const $nextSceneBtn = $('#next-scene-button');
    if ($nextSceneBtn.length && typeof navigateToNextScene === 'function') {
        $nextSceneBtn.off('click').on('click', function() { 
            navigateToNextScene(this);
        });
    }

    
    const $gameCont = $('#game-container');
    if ($gameCont.length && window.gameDialogueSystem && typeof window.gameDialogueSystem.advance === 'function') {
        $gameCont.off('click').on('click', function(e) {
            if ($(e.target).is('button') || $(e.target).closest('button').length) return;
            window.gameDialogueSystem.advance(); 
        });
    }


    
    preloadGameImages(imagesToPreload, () => {
        gsap.fromTo('#scene-background', {autoAlpha:0}, { duration: 0.7, autoAlpha: 1, ease: "power1.out", onComplete: () => {
            
            if (window.gameDialogueSystem && typeof window.gameDialogueSystem.showNext === 'function') {
                window.gameDialogueSystem.showNext(); 
            } else {
                console.error("gameDialogueSystem.showNext function not found to start dialogues!");
            }
            if (onSceneReady && typeof onSceneReady === 'function') {
                onSceneReady();
            }
        }});
    });
}