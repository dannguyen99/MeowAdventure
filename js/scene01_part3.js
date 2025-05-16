// js/scene01_part3.js
$(document).ready(function() {
    // Scene-specific DOM elements
    const $kittenSprite = $('#kitten-sprite');
    const $sceneBackground = $('#scene-background'); // For potential transition out effect

    // Define scene-specific audio element selectors
    const audioSelectorsForScene = {
        bgMusic: '#bg-music-scene1_part3', // New background music ID
        click: '#click-sound',
        meowSad: '#meow-sad-sound' // New sad meow ID
    };
    // Get actual audio elements
    const meowSadSound = $(audioSelectorsForScene.meowSad)[0];

    // Kitten animation frames for "looking around" or "idle anxious"
    const kittenConfusedFrames = [ // Using Kitten Animation 1 for this example
      "images/Kitten.png"
    ];


    const sceneDialogues = [
        { text: "As unfamiliar streets unfolded before it, the butterfly disappeared into the sky." },
        {
            text: "The kitten stopped in confusion, looking around anxiously:",
            action: function(callback) {
                // Kitten fades in on the new background
                gsap.to($kittenSprite, { autoAlpha: 1, duration: 1.0, display: 'block' });

                // Start "confused/looking around" animation
                // animateGameSprite is from game-animations.js
                animateGameSprite($kittenSprite, kittenConfusedFrames, 0.35, -1); // Loop indefinitely for now

                // Optional: Slight camera pan or background shift to emphasize being lost
                // gsap.to($sceneBackground, { x: "-=20px", duration: 3, yoyo: true, repeat: 1, ease: "sine.inOut" });

                // Give a moment for the visual before proceeding
                gsap.delayedCall(1.5, callback); // Wait 1.5s then call the callback
            }
        },
        {
            text: "Meow… I’ve gone too far! I need to find my way home! But… I don’t know which way to go...",
            character: "Kitten",
            sfx: meowSadSound, // Use the sad meow
            endScene: true // Flag to show "Enter the Forest" button
        }
    ];

    const imagesForThisScene = [
        'images/ForestEdge1.png', // New background
        $kittenSprite.attr('src'), // Initial kitten pose for this scene
        ...kittenConfusedFrames
    ].filter(Boolean);

    // Data object for the scene framework
    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectorsForScene,
        onSceneReady: function() {
            console.log("Scene 01 Part 3 is ready!");
            // Stop the looped animation from the action when dialogue advances past it,
            // or let it run until scene changes. For now, it runs.
            // If the kitten needs to stop animating at the last dialogue:
            // You might need to add another action to stop it or modify dialogue system.
        }
    };

    // Initialize the scene using the common framework
    if (typeof initializeSceneFramework === 'function') {
        initializeSceneFramework(sceneData);
    } else {
        console.error("initializeSceneFramework function not found.");
    }
});