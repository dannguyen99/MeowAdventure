// js/script.js (for scene01.html)
$(document).ready(function() {
    console.log("Scene 1 Ready with new assets!");

    // --- DOM Elements ---
    const $gameContainer = $('#game-container');
    const $sceneBackground = $('#scene-background');
    const $kittenSprite = $('#kitten-sprite');
    const $butterflySprite = $('#butterfly-sprite');

    const $dialogueText = $('#dialogue-text');
    const $dialogueBoxContainer = $('#dialogue-box-container'); // For showing/hiding
    const $nextSceneButton = $('#next-scene-button');

    // --- Audio Setup ---
    // ... (Audio elements and sceneIsMuted setup as in your previous correct version)
    let sceneIsMuted = sessionStorage.getItem('meowAdventureMuted') === 'true' ||
                       (sessionStorage.getItem('meowAdventureMuted') === null && localStorage.getItem('meowAdventureMuted') !== 'false');

    const bgMusic = $('#bg-music-scene1')[0];
    const clickSoundEffect = $('#click-sound')[0]; // Renamed to avoid conflict with click event
    const meowSound = $('#meow-sound')[0];
    const flutterSound = $('#butterfly-flutter-sound')[0];

    function applySceneMuteState() {
        if (bgMusic) bgMusic.muted = sceneIsMuted;
        if (clickSoundEffect) clickSoundEffect.muted = sceneIsMuted;
        if (meowSound) meowSound.muted = sceneIsMuted;
        if (flutterSound) flutterSound.muted = sceneIsMuted;
    }
    if (bgMusic) bgMusic.volume = 0.2;
    if (clickSoundEffect) clickSoundEffect.volume = 0.4;
    if (meowSound) meowSound.volume = 0.6;
    if (flutterSound) flutterSound.volume = 0.5;
    applySceneMuteState();
    // ... (logic for resuming/playing main background music if needed, as per previous steps)
    if (bgMusic && !sceneIsMuted) { // Play scene-specific music
        bgMusic.play().catch(e => console.warn("Scene 1 BG Music Autoplay Error:", e));
    }


    // --- Asset Paths for Animations ---
    const butterflyFrames = [
        "images/Butterfly Animation/Butterfly 1.png",
        "images/Butterfly Animation/Butterfly 2.png",
        "images/Butterfly Animation/Butterfly 3.png"
    ];
    const kittenIdleFrames = [ // Assuming Kitten Animation 1 is for idle/talking
        "images/Kitten Animation 1/Kitten 1.png",
        "images/Kitten Animation 1/Kitten 2.png",
        "images/Kitten Animation 1/Kitten 3.png"
    ];
    const kittenRunFrames = [ // Assuming Kitten Animation 2 is for running/chasing
        "images/Kitten Animation 2/Kitten Animation 1.png",
        "images/Kitten Animation 2/Kitten Animation 2.png",
        "images/Kitten Animation 2/Kitten Animation 3.png",
        "images/Kitten Animation 2/Kitten Animation 4.png",
        "images/Kitten Animation 2/Kitten Animation 5.png",
        "images/Kitten Animation 2/Kitten Animation 6.png",
        "images/Kitten Animation 2/Kitten Animation 7.png",
        "images/Kitten Animation 2/Kitten Animation 8.png"
    ];

    let currentDialogueIndex = 0;
    let sceneClickEnabled = true; // To prevent rapid clicks during animations
    let butterflyAnimationTween = null; // To control looping animations
    let kittenAnimationTween = null;

    // --- Sprite Animation Function ---
    function animateSprite(element, frames, frameDuration) {
        // Stop previous animation on this element if any
        if (element.data('animationTween')) {
            element.data('animationTween').kill();
        }

        let currentFrameIndex = 0;
        element.attr('src', frames[0]); // Set initial frame

        const tween = gsap.to({frame: 0}, { // Animate a dummy object
            duration: frameDuration,
            repeat: -1,
            ease: "steps(1)",
            onRepeat: function() {
                currentFrameIndex = (currentFrameIndex + 1) % frames.length;
                element.attr('src', frames[currentFrameIndex]);
            }
        });
        element.data('animationTween', tween); // Store the tween
        return tween;
    }

    // --- Dialogue Data & Actions ---
    const dialogues = [
        { text: "On a beautiful sunny day, a pure white kitten was curled up, sleeping soundly on the porch." },
        {
            text: "Suddenly, a brilliantly colored butterfly fluttered around before gently landing on the kitten’s nose.",
            action: function(callback) {
                $butterflySprite.css('display', 'block'); // Make it visible for GSAP
                // Butterfly appears (e.g., flies from off-screen or fades in)
                // Start fluttering animation
                butterflyAnimationTween = animateSprite($butterflySprite, butterflyFrames, 0.12);
                if (flutterSound && !sceneIsMuted) flutterSound.play();

                gsap.fromTo($butterflySprite,
                    { autoAlpha: 0, scale: 0.5, x: "+=100", y:"-=50" }, // Start from offset, small and transparent
                    {
                        autoAlpha: 1, scale: 1, duration: 1.5, x: "0", y:"0", // Fly to its designated CSS position
                        ease: "power2.out",
                        onComplete: function() {
                            // "Lands" - maybe a slight bob or pause in complex movement
                            gsap.to($butterflySprite, { y: "+=3", duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut", onComplete: callback });
                        }
                    }
                );
            }
        },
        {
            text: "Meow meow! What’s this? Who woke me up?", character: "Kitten", sound: meowSound,
            action: function(callback) {
                // Kitten "wakes up"
                // 1. Change background to house without sleeping kitten
                $sceneBackground.attr('src', 'images/Back1.png');
                // 2. Show the kitten sprite in an awake pose/animation
                $kittenSprite.css('display', 'block'); // Make visible for GSAP
                kittenAnimationTween = animateSprite($kittenSprite, kittenIdleFrames, 0.2); // Idle animation
                gsap.to($kittenSprite, { autoAlpha: 1, duration: 0.5, onComplete: callback });
            }
        },
        {
            text: "The butterfly flapped its wings and slowly took off, circling around the kitten as if inviting it to play.",
            action: function(callback) {
                if (flutterSound && !sceneIsMuted && flutterSound.paused) flutterSound.play();
                if (!butterflyAnimationTween || !butterflyAnimationTween.isActive()) { // Restart if stopped
                    butterflyAnimationTween = animateSprite($butterflySprite, butterflyFrames, 0.12);
                }
                // Butterfly flies around a bit
                gsap.to($butterflySprite, {
                    duration: 2.5,
                    physics2D: { // GSAP Physics2DPlugin can create nice random floaty movement
                        velocity: gsap.utils.random(50, 100), // pixels per second
                        angle: gsap.utils.random(240, 300), // general upward direction
                        gravity: 30 // slight pull down to make it look like it's fighting gravity
                    },
                    scale: 1.1, // Looks like it's coming closer
                    ease: "power1.inOut",
                    onComplete: function() {
                        gsap.to($butterflySprite, {scale:1, duration:0.5}); // Settle scale
                        callback();
                    }
                });
            }
        },
        { text: "Oh! What a beautiful butterfly! I have to chase it! I’ve never seen such a vibrant butterfly before!", character: "Kitten", sound: meowSound },
        {
            text: "Unaware of what was happening, the kitten eagerly ran after the butterfly, unknowingly straying far from its beloved home.",
            action: function(callback) {
                // Kitten starts "running" animation
                if(kittenAnimationTween) kittenAnimationTween.kill(); // Stop idle
                kittenAnimationTween = animateSprite($kittenSprite, kittenRunFrames, 0.08);

                // Butterfly flies away, kitten "chases"
                // Define a path for butterfly to exit
                const butterflyExitPath = [
                    { x: "+=80", y: "-=60", duration: 0.8, ease:"sine.out"},
                    { x: "+=150", y: "-=100", duration: 1.2, ease:"sine.inOut", autoAlpha:0 } // Fly off screen
                ];
                // Define a path for kitten to exit (or move towards edge)
                const kittenExitPath = [
                    { x: "+=120", duration: 1.5, ease:"power1.in" }, // Move kitten right
                    { autoAlpha:0, duration:0.5, delay:-0.3} // Kitten fades as it exits
                ];

                let tl = gsap.timeline({ onComplete: callback });
                tl.add("chaseStart");
                tl.to($butterflySprite, {
                    motionPath: { path: butterflyExitPath, curviness:1 }, // Using motionPath for smoother curves
                    duration: butterflyExitPath.reduce((sum, p) => sum + p.duration, 0), // Total duration of path segments
                }, "chaseStart");

                tl.to($kittenSprite, {
                    motionPath: { path: kittenExitPath, curviness:0 },
                    duration: kittenExitPath.reduce((sum, p) => sum + p.duration, 0),
                }, "chaseStart+=0.3"); // Kitten starts chasing slightly after

                if (flutterSound && !sceneIsMuted) flutterSound.pause(); // Butterfly sound stops as it exits
            }
        },
        { text: "As unfamiliar streets unfolded before it, the butterfly disappeared into the sky." }, // Butterfly already gone
        { text: "The kitten stopped in confusion, looking around anxiously:"}, // Kitten already gone or should reappear confused? For now, assume off-screen
        { text: "Meow… I’ve gone too far! I need to find my way home! But… I don’t know which way to go...", character: "Kitten", sound: meowSound, endScene: true }
    ];

    function playDialogueClickSound() {
        if (clickSoundEffect && !sceneIsMuted) {
            clickSoundEffect.currentTime = 0;
            clickSoundEffect.play().catch(e => console.warn("Click sound effect error", e));
        }
    }

    function displayDialogue() {
        sceneClickEnabled = false; // Disable clicks while dialogue/animation is processing

        if (currentDialogueIndex < dialogues.length) {
            const current = dialogues[currentDialogueIndex];
            let fullText = "";
            if (current.character && current.character !== "Narrator") {
                fullText = `<strong>${current.character}:</strong> `;
            }
            fullText += current.text;

            // Animate dialogue box and text
            gsap.fromTo($dialogueText,
                { autoAlpha: 0, y: 10 },
                {
                    autoAlpha: 1, y: 0, duration: 0.4,
                    onComplete: function() {
                        if (current.sound && !sceneIsMuted) {
                            current.sound.currentTime = 0;
                            current.sound.play().catch(e => console.warn("Dialogue sound error", e));
                        }

                        if (current.action) {
                            current.action(function() { // Pass a callback to the action
                                sceneClickEnabled = true; // Re-enable click after action completes
                                if (current.endScene) { // Check if endScene after action
                                    gsap.to($nextSceneButton, {autoAlpha: 1, duration: 0.5, delay:0.2, onStart: () => $nextSceneButton.show() });
                                    $dialogueBoxContainer.css('cursor', 'default'); // No more clicking dialogue
                                }
                            });
                        } else {
                            sceneClickEnabled = true; // Re-enable click if no action
                            if (current.endScene) {
                                gsap.to($nextSceneButton, {autoAlpha: 1, duration: 0.5, delay:0.2, onStart: () => $nextSceneButton.show() });
                                $dialogueBoxContainer.css('cursor', 'default');
                            }
                        }
                    }
                }
            );
            $dialogueText.html(fullText); // Set text

            // Show dialogue box if it's the first dialogue or was hidden
            if (currentDialogueIndex === 0) {
                gsap.to($dialogueBoxContainer, {autoAlpha:1, duration:0.3});
            }

            if (!current.endScene) {
                 $dialogueBoxContainer.css('cursor', 'pointer'); // Indicate clickable
            }

        } else {
            // Should not happen if endScene logic is correct
            sceneClickEnabled = true;
        }
    }

    // --- Click Anywhere to Advance Logic ---
    $gameContainer.on('click', function() {
        // Only advance if click is enabled, not on next scene button, and not end of dialogue for clicks
        if (sceneClickEnabled && !$nextSceneButton.is(':visible')) {
            playDialogueClickSound();
            currentDialogueIndex++;
            if (currentDialogueIndex < dialogues.length) {
                displayDialogue();
            }
            // If it was the last dialogue before endScene button, it's handled by endScene flag
        }
    });

    $nextSceneButton.on('click', function() {
        playDialogueClickSound();
        // ... (sessionStorage logic for sound state as before) ...
        sessionStorage.setItem('meowAdventureMuted', sceneIsMuted);
        if (bgMusic && !bgMusic.paused && !sceneIsMuted) {
            sessionStorage.setItem('musicTime', bgMusic.currentTime);
            sessionStorage.setItem('musicSrc', bgMusic.src);
            sessionStorage.setItem('musicPlaying', 'true');
        } else {
            sessionStorage.setItem('musicPlaying', 'false');
        }

        gsap.to('#game-container', { autoAlpha: 0, duration: 0.5, onComplete: () => {
            window.location.href = $(this).data('nextscene');
        }});
    });

    // --- Image Preloader (CRUCIAL) ---
    function preloadImages(urls, callback) {
        let loadedCount = 0;
        const numImages = urls.length;
        if (numImages === 0) {
            callback();
            return;
        }
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                loadedCount++;
                console.log(`Loaded: ${url} (${loadedCount}/${numImages})`);
                if (loadedCount === numImages) callback();
            };
            img.onerror = () => {
                console.error("Failed to load image:", url);
                loadedCount++; // Count error as loaded to not block forever
                if (loadedCount === numImages) callback();
            };
        });
    }

    // --- Initialize Scene ---
    function initScene() {
        console.log("All images preloaded. Initializing scene animations and dialogue.");
        gsap.from($sceneBackground, { duration: 1, autoAlpha: 0, ease: "power2.out" });
        // Dialogue box appears with first dialogue
        displayDialogue();
    }

    // --- Start Preloading ---
    let imagesToPreload = [
        $sceneBackground.attr('src'), // Initial background
        'images/Back1.png',           // Awake background
        ...butterflyFrames,
        ...kittenIdleFrames,
        ...kittenRunFrames,
        $kittenSprite.attr('src'),    // Initial kitten sprite frame
        $butterflySprite.attr('src')  // Initial butterfly sprite frame
    ].filter(url => url && typeof url === 'string'); // Filter out any undefined/nulls

    console.log("Preloading images:", imagesToPreload);
    preloadImages(imagesToPreload, initScene);

});