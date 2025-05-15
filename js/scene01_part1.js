// js/scene01_part1.js
$(document).ready(function() {
    const $gameContainer = $('#game-container');
    const $sceneBackground = $('#scene-background');
    const $kittenSprite = $('#kitten-sprite');
    const $butterflySprite = $('#butterfly-sprite');
    const $dialogueText = $('#dialogue-text');
    const $dialogueBoxContainer = $('#dialogue-box-container');
    const $nextSceneButton = $('#next-scene-button');
    const $sceneSoundToggleButton = $('#scene-sound-toggle'); // Added for mute button
    // --- Audio & Mute State ---
    let sceneIsMuted = sessionStorage.getItem('meowAdventureMuted') === 'true' ||
                       (sessionStorage.getItem('meowAdventureMuted') === null && localStorage.getItem('meowAdventureMuted') !== 'false');
    const bgMusic = $('#bg-music-scene1')[0];
    const clickSoundEffect = $('#click-sound')[0];
    const meowSound = $('#meow-sound')[0];
    const flutterSound = $('#butterfly-flutter-sound')[0];

    function applySceneMuteState() {
        if (bgMusic) bgMusic.muted = sceneIsMuted;
        if (clickSoundEffect) clickSoundEffect.muted = sceneIsMuted;
        if (meowSound) meowSound.muted = sceneIsMuted;
        if (flutterSound) flutterSound.muted = sceneIsMuted;
        // Update scene sound toggle button UI
        if ($sceneSoundToggleButton) {
            $sceneSoundToggleButton.text(sceneIsMuted ? '🔇' : '🔊');
        }
    }
    function playSfx(soundElement) {
        if (soundElement && !sceneIsMuted) {
            soundElement.currentTime = 0;
            soundElement.play().catch(e=>console.warn("SFX error for " + soundElement.id, e));
        }
    }
    if (bgMusic) bgMusic.volume = 0.2;
    if (clickSoundEffect) clickSoundEffect.volume = 0.4;
    if (meowSound) meowSound.volume = 0.6;
    if (flutterSound) flutterSound.volume = 0.5;
    applySceneMuteState();
    if (bgMusic && !sceneIsMuted) bgMusic.play().catch(e => console.warn("BG Music Error", e));
    // --- End Audio ---

    const butterflyFrames = [
        "images/Butterfly Animation/Butterfly 1.png",
        "images/Butterfly Animation/Butterfly 2.png",
        "images/Butterfly Animation/Butterfly 3.png"
    ];
    let butterflyAnimTween, kittenAnimTween;

    function animateSprite(element, frames, frameDuration, repeat = -1) {
        if (element.data('animationTween')) element.data('animationTween').kill();
        let currentFrameIndex = 0;
        element.attr('src', frames[0]); // Set initial frame before animation starts
        const tween = gsap.to({ frame: 0 }, {
            duration: frameDuration, repeat: repeat, ease: "steps(1)",
            onRepeat: function() {
                currentFrameIndex = (currentFrameIndex + 1) % frames.length;
                element.attr('src', frames[currentFrameIndex]);
            }
        });
        element.data('animationTween', tween);
        return tween;
    }

    let currentDialogueIndex = 0;
    let sceneClickEnabled = false; // Start with clicks disabled until first dialogue is fully shown

    const dialogues = [
        { text: "On a beautiful sunny day, a pure white kitten was curled up, sleeping soundly on the porch." },
        {
            text: "Suddenly, a brilliantly colored butterfly fluttered around before gently landing on the kitten’s nose.",
            action: function(callback) {
                $butterflySprite.css('display', 'block');
                butterflyAnimTween = animateSprite($butterflySprite, butterflyFrames, 0.12);
                playSfx(flutterSound);
                gsap.fromTo($butterflySprite,
                    { autoAlpha: 0, scale: 0.6, x: "+=150px", y: "-=80px" },
                    { autoAlpha: 1, scale: 1, x: "0px", y: "0px", duration: 2, ease: "power2.out", onComplete: callback }
                );
            }
        },
        {
            text: "Meow meow! What’s this? Who woke me up?", character: "Kitten", sfx: meowSound,
            action: function(callback) {
                // playSfx is handled by animateTextAndProceed, this ensures sound syncs with text appearance
                $sceneBackground.attr('src', 'images/Back1.png');
                $kittenSprite.css('display', 'block');
                gsap.to($butterflySprite, { y: "-=30px", scale:1.1, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut"});
                gsap.to($kittenSprite, { autoAlpha: 1, duration: 0.7, delay: 0.2, onComplete: callback });
            }
        },
        { text: "Oh! What a beautiful butterfly! I’ve never seen such a vibrant butterfly before!", character: "Kitten", sfx: meowSound },
        {
            text: "The butterfly flapped its wings and slowly took off, circling around the kitten as if inviting it to play.",
            action: function(callback) {
                if (flutterSound && !sceneIsMuted && flutterSound.paused) playSfx(flutterSound);
                if (!butterflyAnimTween || !butterflyAnimTween.isActive()) {
                    butterflyAnimTween = animateSprite($butterflySprite, butterflyFrames, 0.12);
                }
                gsap.to($butterflySprite, {
                    duration: 2.0, // Reduced duration for circling
                    x: "+=20", yoyo: true, repeat:3, ease:"sine.inOut",
                    rotationY:"+=720",
                    onComplete: callback
                });
            },
            endPart: true
        }
    ];

    function displayDialogue() {
        sceneClickEnabled = false;
        if (currentDialogueIndex < dialogues.length) {
            const current = dialogues[currentDialogueIndex];
            animateTextAndProceed(current);
            if (!current.endPart) {
                 $dialogueBoxContainer.css('cursor', 'pointer');
            } else {
                 $dialogueBoxContainer.css('cursor', 'default');
            }
        }
    }

  function animateTextAndProceed(currentDialogueItem) {
        let fullText = (currentDialogueItem.character ? `<strong>${currentDialogueItem.character}:</strong> ` : "") + currentDialogueItem.text;
        $dialogueText.html(fullText);

        let boxFadeDuration = 0.1; // Very quick fade for the box if it's already mostly visible
        if (currentDialogueIndex === 0 || $dialogueBoxContainer.css('opacity') === '0') {
            // Ensure the dialogue box is fully opaque before animating text for the first time
            // or if it was hidden for some reason.
            boxFadeDuration = 0.3;
        }

        gsap.to($dialogueBoxContainer, {
            autoAlpha: 1,
            duration: boxFadeDuration,
            onComplete: () => { // This ensures box is visible THEN text animates
                gsap.fromTo($dialogueText, { autoAlpha: 0, y: 10 }, {
                    autoAlpha: 1, y: 0, duration: 0.4,
                    onComplete: () => {
                        if (currentDialogueItem.sfx) playSfx(currentDialogueItem.sfx);
                        if (currentDialogueItem.action) {
                            currentDialogueItem.action(() => {
                                sceneClickEnabled = true;
                                if (currentDialogueItem.endPart) showNextPartButton();
                            });
                        } else {
                            sceneClickEnabled = true;
                            if (currentDialogueItem.endPart) showNextPartButton();
                        }
                    }
                });
            }
        });
    }

    function showNextPartButton() {
        $dialogueBoxContainer.css('cursor', 'default');
        // Button appears almost immediately after the last action/dialogue text
        gsap.to($nextSceneButton, {
            autoAlpha: 1,
            duration: 0.3, // Fast fade-in
            delay: 0.05,   // Very short delay
            onStart: () => $nextSceneButton.show()
        });
    }

    $gameContainer.on('click', function(e) {
        // Prevent advancing if a button itself was clicked
        if ($(e.target).is('button') || $(e.target).closest('button').length) {
            return;
        }

        if (sceneClickEnabled && !$nextSceneButton.is(':visible')) {
            // Check if there's a next dialogue to advance to
            if (currentDialogueIndex < dialogues.length - 1) {
                playSfx(clickSoundEffect);
                currentDialogueIndex++;
                displayDialogue();
            } else if (dialogues[currentDialogueIndex] && dialogues[currentDialogueIndex].endPart && !$nextSceneButton.is(':visible')) {
                // This case means it's the last dialogue that should show the button,
                // but the button isn't visible yet (e.g., action still running).
                // Click should ideally do nothing here, or perhaps trigger button if action is done.
                // The `sceneClickEnabled` flag and button visibility check should handle this.
            }
        }
    });

    $nextSceneButton.on('click', function() {
        playSfx(clickSoundEffect);
        sessionStorage.setItem('meowAdventureMuted', sceneIsMuted.toString());
        if (bgMusic && !bgMusic.paused && !sceneIsMuted) {
            sessionStorage.setItem('musicTime', bgMusic.currentTime);
            sessionStorage.setItem('musicSrc', bgMusic.src);
            sessionStorage.setItem('musicPlaying', 'true');
        } else {
            sessionStorage.setItem('musicPlaying', 'false');
        }
        gsap.to($gameContainer, { autoAlpha: 0, duration: 0.5, onComplete: () => {
            window.location.href = $(this).data('nextscene');
        }});
    });

        $sceneSoundToggleButton.on('click', function() {
        sceneIsMuted = !sceneIsMuted;
        applySceneMuteState(); // This will mute/unmute audio AND update button text

        // Save preference to localStorage so it persists across sessions for this game
        localStorage.setItem('meowAdventureMuted', sceneIsMuted.toString());
        // Also update sessionStorage for immediate next page load (if user navigates away quickly)
        sessionStorage.setItem('meowAdventureMuted', sceneIsMuted.toString());

        // If unmuting, play a click sound (if you want)
        if (!sceneIsMuted && clickSoundEffect) {
            // Temporarily unmute click sound for this one play, then re-apply global mute
            const originalClickMuteState = clickSoundEffect.muted;
            clickSoundEffect.muted = false;
            playSfx(clickSoundEffect);
            clickSoundEffect.muted = originalClickMuteState; // Revert to its state before this specific click
        }

        // If unmuting and background music was supposed to be playing but was paused due to mute
        if (!sceneIsMuted && bgMusic && bgMusic.paused) {
            bgMusic.play().catch(e => console.warn("BG Music play on unmute error", e));
        } else if (sceneIsMuted && bgMusic && !bgMusic.paused) {
            bgMusic.pause();
        }
    });

    function preloadImages(urls, callback) {
        let loadedCount = 0;
        const numImages = urls.length;
        if (numImages === 0) { callback(); return; }
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = () => { loadedCount++; if (loadedCount === numImages) callback(); };
            img.onerror = () => { console.error("Failed to load image:", url); loadedCount++; if (loadedCount === numImages) callback(); };
        });
    }

    let imagesToPreload = [
        'images/Back1_Kittenn.png', 'images/Back1.png', 'images/Kitten.png',
        ...butterflyFrames
    ].filter(Boolean);

    function initScene() {
        // Set initial state of dialogue box container to hidden if it's not already by CSS
        // This ensures our GSAP animation for it on first dialogue is clean
        gsap.set($dialogueBoxContainer, { autoAlpha: 0 });

        gsap.from($sceneBackground, { duration: 1, autoAlpha: 0, ease: "power2.out", onComplete: () => {
            displayDialogue(); // Start displaying dialogue *after* background is visible
        }});
    }
    preloadImages(imagesToPreload, initScene);
});