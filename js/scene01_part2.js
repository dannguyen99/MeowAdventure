// js/scene01_part2.js
$(document).ready(function() {
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

                gsap.set($kittenSprite, { scale: 1.2 }); // Kitten larger for chase

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

                // --- MODIFIED CHASE PARAMETERS ---
                const butterflyInitialXCss = parseFloat($butterflySprite.css('left')); // Get initial CSS left position
                const kittenInitialXCss = parseFloat($kittenSprite.css('left'));

                // Butterfly leads to the LEFT. Kitten is to its RIGHT.
                // Gap between butterfly (leading) and kitten (chasing)
                const chaseGap = 180; // INCREASED GAP: Was implicitly butterflyLeadAmount, now more explicit and larger

                // How far they run to the LEFT across the screen
                // Needs to be enough to take them off-screen from their starting positions
                const chaseDistanceToLeft = 800; // Adjust this based on stage width and starting pos

                const verticalVariance = 30;
                // --- END MODIFIED CHASE PARAMETERS ---

                tl.add("startChase")
                    // Butterfly quickly moves to its starting chase position (further left)
                    .to($butterflySprite, {
                        // x is relative to its current CSS position.
                        // If kitten starts at 300px, butterfly target is 300 - 180 = 120px
                        // So, x needs to be butterfly_target - butterfly_current_css_pos
                        x: (kittenInitialXCss - chaseGap) - butterflyInitialXCss,
                        y: `random(-${verticalVariance / 2}, ${verticalVariance / 2})`,
                        duration: 0.7,
                        ease: "power1.out"
                    }, "startChase")

                    // Kitten makes a small initial dash to the left
                    .to($kittenSprite, {
                        x: "-=30", // Small initial movement TO THE LEFT
                        duration: 0.4,
                        ease: "power1.out"
                    }, "startChase+=0.2") // Kitten starts slightly after

                    .add("mainChase", "+=0.1")

                    // Butterfly moves across the screen TO THE LEFT
                    .to($butterflySprite, {
                        x: `-=${chaseDistanceToLeft}`, // Move left by chaseDistance
                        y: `random(-${verticalVariance}, ${verticalVariance})`,
                        duration: 3.5,
                        ease: "none"
                    }, "mainChase")

                    // Kitten chases across the screen TO THE LEFT
                    .to($kittenSprite, {
                        x: `-=${chaseDistanceToLeft}`, // Kitten also moves left by chaseDistance
                        y: `random(-${verticalVariance}, ${verticalVariance})`,
                        duration: 3.5,
                        ease: "none"
                    }, "mainChase") // Kitten and Butterfly move simultaneously

                    // Fade them out as they approach the LEFT edge
                    // Start fading when they are about 75-80% through their run
                    .to($butterflySprite, { autoAlpha: 0, duration: 0.7, ease: "power1.in" }, `mainChase+=${3.5 * 0.75}`)
                    .to($kittenSprite, { autoAlpha: 0, duration: 0.7, ease: "power1.in" }, `mainChase+=${3.5 * 0.75}`);

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
             // Flip sprites horizontally if they are facing right by default
            // gsap.set($kittenSprite, { scaleX: -1 });    // Flip kitten to face left
            // gsap.set($butterflySprite, { scaleX: -1 }); // Flip butterfly to face left
        }
    };
    // Initialize the scene using the common framework
    if (typeof initializeSceneFramework === 'function') {
        initializeSceneFramework(sceneData);
    } else {
        console.error("initializeSceneFramework function not found. Ensure game-main.js is loaded.");
    }
});