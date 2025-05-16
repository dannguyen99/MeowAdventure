// js/scene01_part2.js
$(document).ready(function() {
    const $gameContainer = $('#game-container'); // Assuming this is your 900px wide container
    const gameContainerWidth = $gameContainer.width(); // Get actual width
    // Scene-specific DOM elements if needed for unique actions
    const $sceneBackground = $('#scene-background');
    const $kittenSprite = $('#kitten-sprite');
    const $butterflySprite = $('#butterfly-sprite');

    // Define scene-specific audio element selectors (IDs from your HTML)
    const audioSelectorsForScene = {
        bgMusic: '#bg-music-scene1',
        click: '#click-sound',
        meow: '#meow-sound',
        flutter: '#butterfly-flutter-sound',
        run: '#run-sound'
    };
    // Get actual audio elements to pass to dialogue actions if needed directly
    const meowSound = $(audioSelectorsForScene.meow)[0];
    const flutterSound = $(audioSelectorsForScene.flutter)[0];
    const runSound = $(audioSelectorsForScene.run)[0];


    const butterflyFrames = [
        "images/Butterfly Animation/Butterfly 1.png",
        "images/Butterfly Animation/Butterfly 2.png",
        "images/Butterfly Animation/Butterfly 3.png"
    ];
    const kittenRunFrames = ['images/Kitten Animation 2/Kitten Animation 1.png',
        'images/Kitten Animation 2/Kitten Animation 2.png',
        'images/Kitten Animation 2/Kitten Animation 3.png',
        'images/Kitten Animation 2/Kitten Animation 4.png',
        'images/Kitten Animation 2/Kitten Animation 5.png',
        'images/Kitten Animation 2/Kitten Animation 6.png',
        'images/Kitten Animation 2/Kitten Animation 7.png',
        'images/Kitten Animation 2/Kitten Animation 8.png'
    ];
    // No need for global butterflyAnimTween, kittenAnimTween here unless part of a complex unique action

     const sceneDialogues = [
        { text: "Oh! What a beautiful butterfly! I have to chase it! I’ve never seen such a vibrant butterfly before!", character: "Kitten", sfx: meowSound },
        {
            text: "Unaware of what was happening, the kitten eagerly ran after the butterfly, unknowingly straying far from its beloved home.",
            action: function(callback) {
                sceneClickEnabled = false;
                $sceneBackground.addClass('background-zoomed-focused');

                playGameSfx(flutterSound, true);
                if ($butterflySprite.data('animationTween')) $butterflySprite.data('animationTween').kill();
                animateGameSprite($butterflySprite, butterflyFrames, 0.1);

                gsap.set($kittenSprite, { scale: 2 }); // Kitten larger for chase

                if ($kittenSprite.data('animationTween')) $kittenSprite.data('animationTween').kill();
                animateGameSprite($kittenSprite, kittenRunFrames, 0.07);
                playGameSfx(runSound, true);

                let tl = gsap.timeline({
                    onComplete: () => {
                        stopGameSfx(flutterSound);
                        stopGameSfx(runSound);
                        gsap.set($kittenSprite, { scale: 1 }); // Reset kitten scale
                        callback();
                    }
                });

                // --- MODIFIED CHASE PARAMETERS FOR FULL SCREEN WIDTH ---

                // Starting positions: Off-screen right
                // GSAP's x/y are relative to the element's CSS left/top.
                // So, to place them off-screen right, their CSS 'left' could be '100%' or gameContainerWidth.
                // We will set their initial X position using GSAP to be off-screen right.
                gsap.set($butterflySprite, { x: gameContainerWidth - 200 }); // Butterfly's left edge at right screen edge
                gsap.set($kittenSprite, { x: gameContainerWidth }); // Kitten starts further right, effectively "behind" butterfly

                // Target for exiting: Off-screen left
                const targetXButterfly = -gameContainerWidth; // Butterfly's right edge off left screen
                const targetXKitten = -gameContainerWidth + 200;     // Kitten's right edge off left screen

                // Gap between butterfly (leading) and kitten (chasing) is effectively set by their start X and speed
                // We want butterfly to be visually ahead.

                const verticalVariance = 30;
                const chaseDuration = 6.5; // INCREASED DURATION for full screen travel
                // --- END MODIFIED CHASE PARAMETERS ---

                tl.add("startChase")
                    // Sprites are already set off-screen right by gsap.set above.
                    // No initial "positioning" tween needed here unless you want a slight delay or stagger.

                    .add("mainChase") // Can start immediately or with a slight delay after dialogue
                    // Butterfly moves from off-screen right to off-screen left
                    .to($butterflySprite, {
                        x: targetXButterfly,
                        y: `random(-${verticalVariance}, ${verticalVariance})`,
                        duration: chaseDuration,
                        ease: "none" // Linear movement
                    }, "mainChase")

                    // Kitten chases from off-screen right to off-screen left
                    // It starts further right, so it will appear to be chasing
                    .to($kittenSprite, {
                        x: targetXKitten,
                        y: `random(-${verticalVariance}, ${verticalVariance})`,
                        duration: chaseDuration, // Same duration to maintain relative positions
                        ease: "none"
                    }, "mainChase") // Start at the same time as butterfly

                    // No explicit fade-out needed if they travel completely off-screen
                    // unless you want them to fade before fully exiting.
                    // If they are fully off-screen, autoAlpha:0 isn't strictly necessary.
                    // However, good practice to hide them once done.
                    .set([$butterflySprite, $kittenSprite], { autoAlpha: 0 }, `+=${chaseDuration}`); // Hide after they've gone

            },
            endPart: true
        }
    ];

    const imagesForThisScene = [
        'images/Back1.png',
        'images/Kitten.png',
        ...butterflyFrames,
        ...kittenRunFrames
    ].filter(Boolean);

    // Data object for the scene framework
    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectorsForScene,
        onSceneReady: function() {
            console.log("Scene 01 Part 2 is ready!");
            gsap.set([$kittenSprite, $butterflySprite], { autoAlpha: 1, display:'block', scale: 1 });
        }
    };
    // Initialize the scene using the common framework
    if (typeof initializeSceneFramework === 'function') {
        initializeSceneFramework(sceneData);
    } else {
        console.error("initializeSceneFramework function not found. Ensure game-main.js is loaded.");
    }
});