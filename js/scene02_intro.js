// js/scene02_intro.js
$(document).ready(function() {
    const $kittenSprite = $('#kitten-sprite');
    const $squirrelSprite = $('#squirrel-sprite');
    // No specific scene background manipulation needed beyond initial load for this part

    const audioSelectors = {
        bgMusic: '#bg-music-scene2',
        click: '#click-sound',
        meowNervous: '#meow-nervous-sound',
        squirrelChatter: '#squirrel-chatter-sound',
        rustle: '#rustle-sound'
    };
    // Get actual audio elements for direct use in actions/sfx
    const meowNervousSound = $(audioSelectors.meowNervous)[0];
    const squirrelChatterSound = $(audioSelectors.squirrelChatter)[0];
    const rustleSound = $(audioSelectors.rustle)[0];

    // Assuming you have Kitten Animation 1 for idle/talking if needed
    const kittenIdleFrames = [
        "images/Kitten Animation 1/Kitten 1.png",
        "images/Kitten Animation 1/Kitten 2.png",
        "images/Kitten Animation 1/Kitten 3.png"
    ];
    // No specific squirrel animation frames mentioned yet, so using static image

    const sceneDialogues = [
        { text: "The kitten stepped into a dense forest, where sunlight barely managed to filter through the towering trees." },
        { text: "The unfamiliar surroundings made the little kitten shiver.",
            action: function(callback) {
                // Kitten appears
                gsap.to($kittenSprite, { autoAlpha: 1, duration: 0.8, display: 'block' });
                // Optional: Kitten "shiver" or "look around" animation
                // For now, static Kitten.png is used via CSS. If animation:
                // animateGameSprite($kittenSprite, kittenIdleFrames, 0.3, 3); // Play a few loops
                gsap.delayedCall(0.5, callback); // Short pause
            }
        },
        { text: "I need to find a way out of here! But which way should I go? This place is so overgrown...", character: "Kitten", sfx: meowNervousSound },
        {
            text: "A gentle breeze rustled the leaves, creating a soft whispering sound. Suddenly, from a high branch, a small squirrel jumped down, eyeing the kitten with curiosity.",
            action: function(callback) {
                playGameSfx(rustleSound); // Sound of squirrel appearing
                $squirrelSprite.css('display', 'block'); // Make visible for GSAP

                // Squirrel animates in (e.g., "jumps down" effect)
                // Current CSS has it at its 'landed' spot. We animate FROM above.
                gsap.fromTo($squirrelSprite,
                    { autoAlpha: 0, y: "-=100px", scale: 0.8 }, // Start above and smaller
                    {
                        autoAlpha: 1, y: "0px", scale: 1, duration: 0.7, ease: "bounce.out", // Bounce eases the landing
                        onComplete: callback
                    }
                );
            }
        },
        { text: "Who are you? Why have you come to this forest? You look pretty lost!", character: "Squirrel", sfx: squirrelChatterSound },
        { text: "Uh... I’m just a kitten. I got lost! Do you know the way out of the forest? I just want to go home.", character: "Kitten", sfx: meowNervousSound },
        { text: "Of course I do! But it won’t be easy. This forest is huge, and if you don’t know the paths, you could end up even more lost!", character: "Squirrel", sfx: squirrelChatterSound },
        { text: "Then please help me! I don’t want to stay here any longer...", character: "Kitten", sfx: meowNervousSound },
        { text: "Hmm... there’s a small problem. I’m in trouble too! A group of crows stole my acorns and hid them somewhere.", character: "Squirrel", sfx: squirrelChatterSound },
        { text: "If you help me find them, I’ll guide you out of here!", character: "Squirrel", sfx: squirrelChatterSound },
        { text: "Acorns? I’ve never searched for acorns before… but do you know where they might have hidden them?", character: "Kitten", sfx: meowNervousSound },
        { text: "I think they hid them somewhere in the bushes nearby. I saw them hovering around there earlier.", character: "Squirrel", sfx: squirrelChatterSound },
        { text: "Are the crows dangerous? I don’t want them to attack me!", character: "Kitten", sfx: meowNervousSound },
        { text: "They’re just mischievous! If we move quietly, there shouldn’t be any problems.", character: "Squirrel", sfx: squirrelChatterSound },
        { text: "Alright! I’ll help you find your acorns. Hopefully, it won’t take too long.", character: "Kitten", sfx: meowNervousSound,
            endPart: true // Triggers the "Start Acorn Hunt" button
        }
        // The line "Great! Let’s get started! I’ll help you look for clues." will be at the start of scene02_minigame.html
    ];

    const imagesForThisScene = [
        'images/Lv1.jpg',
        'images/Kitten.png', // Or first frame of kittenIdleFrames if used
        'images/Squirrel.png'
        // ...kittenIdleFrames, // Add if kitten idle animation is used
    ].filter(Boolean);

    // If using kitten idle animation for first action
    // imagesForThisScene.push(...kittenIdleFrames);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 02 Intro is ready!");
            // Any additional setup after common init and first dialogue
            // For example, if kitten needs a talking animation during dialogues:
            // (This would require modifications to game-dialogue.js to trigger start/stop)
        }
    };

    initializeSceneFramework(sceneData);
});