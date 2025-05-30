$(document).ready(function() {
    const $streamSceneBackground = $('#stream-scene-background');
    const $kittenSprite = $('#kitten-sprite');
    const $fluffyDogSprite = $('#fluffy-dog-sprite');
    const $otterSprite = $('#otter-sprite');
    const $gearSprite = $('#gear-sprite');

    // Fishing Game UI
    const $fishingGameContainer = $('#fishing-game-container');
    const $fishNeededCount = $('#fish-needed-count');
    const $fishCaughtCount = $('#fish-caught-count');
    const $fishArea = $('#fish-area');

    const audioSelectors = {
        bgMusic: '#bg-music-scene5-stream',
        click: '#click-sound',
        meowCurious: '#meow-curious-sound',
        meowCheerful: '#meow-cheerful-sound',
        fluffyEnthusiastic: '#fluffy-dog-enthusiastic-sound',
        otterChatter: '#otter-chatter-sound',
        waterSplash: '#water-splash-sound',
        fishCatch: '#fish-catch-sound',
        success: '#success-sound'
    };

    const meowCuriousSound = $(audioSelectors.meowCurious)[0];
    const meowCheerfulSound = $(audioSelectors.meowCheerful)[0];
    const fluffyEnthusiasticSound = $(audioSelectors.fluffyEnthusiastic)[0];
    const otterChatterSound = $(audioSelectors.otterChatter)[0];
    const waterSplashSound = $(audioSelectors.waterSplash)[0];
    const fishCatchSound = $(audioSelectors.fishCatch)[0];
    const successSound = $(audioSelectors.success)[0];

    // Fishing Game State
    const totalFishNeeded = 3;
    let fishCaught = 0;
    let fishingGameActive = false;
    let onFishingGameCompleteCallback = null;

    function startFishingGame() {
        fishCaught = 0;
        $fishCaughtCount.text(fishCaught);
        $fishNeededCount.text(totalFishNeeded);
        $fishArea.empty(); // Clear previous fish

        gsap.to($fishingGameContainer, { autoAlpha: 1, duration: 0.5, display: 'block' });
        fishingGameActive = true;

        // Spawn fish
        for (let i = 0; i < 5; i++) { // Spawn a few more fish than needed
            const $fish = $('<div class="fish-item"></div>');
            $fish.css({
                left: Math.random() * ($fishArea.width() - 50) + 'px',
                top: Math.random() * ($fishArea.height() - 30) + 'px'
            });
            $fish.on('click', handleFishClick);
            $fishArea.append($fish);
            animateFish($fish);
        }
    }

    function animateFish($fish) {
        const moveDuration = Math.random() * 3 + 2; // 2-5 seconds
        gsap.to($fish, {
            x: (Math.random() - 0.5) * ($fishArea.width() * 0.6), // Move horizontally
            y: (Math.random() - 0.5) * ($fishArea.height() * 0.6), // Move vertically
            rotation: (Math.random() - 0.5) * 20, // Slight rotation
            duration: moveDuration,
            ease: "sine.inOut",
            onComplete: () => {
                if (fishingGameActive && $fish.parent().length) { // Check if fish still exists and game is active
                    animateFish($fish);
                }
            }
        });
    }

    function handleFishClick(event) {
        if (!fishingGameActive) return;

        const $fish = $(event.currentTarget);
        if (typeof playGameSfx === 'function') { playGameSfx(fishCatchSound); }

        gsap.to($fish, {
            scale: 0,
            autoAlpha: 0,
            duration: 0.3,
            onComplete: () => $fish.remove()
        });

        fishCaught++;
        $fishCaughtCount.text(fishCaught);

        if (fishCaught >= totalFishNeeded) {
            completeFishingGame();
        }
    }

    function completeFishingGame() {
        fishingGameActive = false;
        gsap.to($fishingGameContainer, {
            autoAlpha: 0,
            duration: 0.5,
            delay: 0.5,
            onComplete: () => {
                $fishingGameContainer.css('display', 'none');
                if (onFishingGameCompleteCallback) {
                    onFishingGameCompleteCallback();
                    onFishingGameCompleteCallback = null;
                }
            }
        });
    }


    const sceneDialogues = [
        {
            text: "The two friends reached a small stream where a playful otter was swimming.",
            character: "Narrator",
            action: function(cb) {
                gsap.timeline({ onComplete: cb })
                    .to([$kittenSprite, $fluffyDogSprite], { autoAlpha: 1, duration: 0.5, stagger: 0.2 })
                    .fromTo($otterSprite, { autoAlpha: 0, y: "+=30" }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" })
                    // Otter playful animation
                    .to($otterSprite, { rotation: 10, yoyo: true, repeat: 3, duration: 0.3, ease: "sine.inOut" }, "-=0.5");
            }
        },
        {
            text: "Hello, Otter! Have you seen a gear fall into the water?",
            character: "Kitten",
            sfx: meowCuriousSound,
            action: function(cb) {
                gsap.to($kittenSprite, { y: "-=5px", yoyo: true, repeat: 1, duration: 0.2, onComplete: cb });
            }
        },
        {
            text: "Yes! But it’s stuck under a big rock. If you help me find some food, I'll help you get it!",
            character: "Otter",
            sfx: otterChatterSound,
            action: function(cb) {
                gsap.timeline({ onComplete: cb })
                    .to($otterSprite, { scale: 1.1, duration: 0.2 })
                    .to($otterSprite, { scale: 1.0, duration: 0.2 });
            }
        },
        {
            text: "Deal! What do you want to eat?",
            character: "Fluffy Dog",
            sfx: fluffyEnthusiasticSound,
            action: function(cb) {
                gsap.to($fluffyDogSprite, { y: "-=10px", yoyo: true, repeat: 1, duration: 0.3, ease: "bounce.out", onComplete: cb });
            }
        },
        {
            text: "I love the little fish upstream, but the current is too strong for me to swim there.",
            character: "Otter",
            sfx: otterChatterSound,
            action: function(cb) {
                // Otter points upstream (can be a simple rotation or arm gesture if sprite allows)
                gsap.to($otterSprite, { rotation: -15, duration: 0.3, onComplete: () => {
                    gsap.to($otterSprite, {rotation: 0, duration: 0.3, delay: 0.5, onComplete: cb});
                }});
            }
        },
        { // This dialogue triggers the fishing game
            text: "Let's help the Otter catch some fish!",
            character: "Kitten",
            action: function(cb) {
                onFishingGameCompleteCallback = cb; // Store callback for when game ends
                startFishingGame();
                // Dialogue pauses here until onFishingGameCompleteCallback is called
            }
        },
        { // This dialogue plays after the fishing game is completed
            text: "The otter happily dives into the water...",
            character: "Narrator",
            sfx: waterSplashSound,
            action: function(cb) {
                // Otter dives (moves down and fades, then reappears with gear)
                const otterOriginalPos = { y: $otterSprite.position().top, x: $otterSprite.position().left };
                gsap.timeline({ onComplete: cb })
                    .to($otterSprite, { y: "+=100", autoAlpha: 0, duration: 0.8, ease: "power2.in" })
                    .set($gearSprite, { // Position gear near where otter will reappear (e.g., shore)
                        left: "50%", // Adjust as needed
                        bottom: "10%",
                        autoAlpha: 0,
                        scale: 0.2
                    })
                    .to($otterSprite, { // Otter reappears, maybe pushing gear
                        y: otterOriginalPos.y, // Back to original y or slightly different
                        x: otterOriginalPos.x - 30, // Moves a bit
                        autoAlpha: 1,
                        duration: 0.6,
                        delay: 0.5,
                        ease: "power2.out"
                    })
                    .to($gearSprite, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3");
            }
        },
        {
            text: "We got them all! Let's hurry back to the tower!",
            character: "Kitten",
            sfx: meowCheerfulSound,
            action: function(cb) {
                gsap.timeline({ onComplete: cb })
                    .to($kittenSprite, { y: "-=15px", duration: 0.2, ease: "power2.out" })
                    .to($kittenSprite, { y: "0px", duration: 0.3, ease: "bounce.out" });
            },
            endScene: true
        }
    ];

    const imagesForThisScene = [
        'images/Lv4_TheSteam.png',
        'images/Kitten.png',
        'images/FluffyDog.png',
        'images/Otter.png',
        'images/Fish.png',
        'images/Gear.png'
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 05 Stream Gear is ready!");
            gsap.set($streamSceneBackground, { autoAlpha: 1 });
            gsap.set([$kittenSprite, $fluffyDogSprite, $otterSprite, $gearSprite, $fishingGameContainer], {
                autoAlpha: 0,
                display: 'block'
            });
            gsap.set($fishingGameContainer, {display: 'none'}); // Explicitly none
        }
    };

    initializeSceneFramework(sceneData);
});