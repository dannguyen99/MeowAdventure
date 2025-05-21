// js/scene03_crossing_dialogue.js
$(document).ready(function() {
    // Scene-specific DOM elements
    const $kittenSprite = $('#kitten-sprite');
    const $frogSprite = $('#frog-sprite');

    // Audio selectors
    const audioSelectors = {
        bgMusic: '#bg-music-scene3',
        click: '#click-sound',
        meowRelieved: '#meow-relieved-sound',
        frogCroak: '#frog-croak-sound'
        // Removed hop/step sounds
    };
    // Get actual audio elements for direct playback
    const meowRelievedSound = $(audioSelectors.meowRelieved)[0];
    const frogCroakSound = $(audioSelectors.frogCroak)[0];


    // --- SCENE DIALOGUES ---
    const sceneDialogues = [
        {
            // This first dialogue item ensures the sprites are visible and sets the stage.
            // It could contain a narrator line if desired, e.g., "The frog nodded, pleased."
            text: "", // Can be empty if no narrator text here
            isActionOnly: true, // To primarily run the action
            action: function(actionCallback) {
                // Ensure sprites are visible and at their CSS-defined starting positions for this scene.
                gsap.to([$kittenSprite, $frogSprite], {
                    autoAlpha: 1,
                    duration: 0.5,
                    display: 'block',
                    onComplete: actionCallback // Tell dialogue system this action is complete
                });
            }
        },
        // The story text implies the frog guides the kitten *after* the success dialogue from the riddle.
        // So, the dialogue here is the *conclusion* of that interaction.
        {
            text: "The frog jumped onto a rock, motioning for the kitten to follow. It chose the sturdiest rocks, ones that weren’t too slippery. The kitten cautiously placed its paws where the frog stepped, heart pounding. One step… two steps… Finally, the kitten successfully made it to the other side!",
            // This long text acts as a narrator describing the crossing.
            // No character, so it will appear as narrator text.
            // No specific SFX here, stream sounds are background.
            action: function(actionCallback){
                gsap.delayedCall(0.1, actionCallback); // Almost immediate callback after text is shown
            }
        },
        { text: "I did it! Thank you so much, Frog!", character: "Kitten", sfx: meowRelievedSound },
        {
            text: "No problem! Good luck on your journey home! And remember, don’t underestimate the power of intelligence next time!",
            character: "Frog", sfx: frogCroakSound,
            endScene: true // Triggers "Continue Journey" button
        }
    ];

    // --- IMAGES TO PRELOAD ---
    const imagesForThisScene = [
        'images/Lv2.png',
        'images/Kitten.png',
        'images/Frog.png'
        // Add paths to idle animation frames if you use them
    ].filter(Boolean);


    // --- SCENE DATA FOR FRAMEWORK ---
    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 03 Crossing (Dialogue Version) is ready!");
            // Sprites' visibility is handled by the first dialogue item's action.
            // CSS handles their initial positions.
        }
    };

    // Initialize the scene using the common framework
    if (typeof initializeSceneFramework === 'function') {
        initializeSceneFramework(sceneData);
    } else {
        console.error("initializeSceneFramework function not found in scene03_crossing_dialogue.js.");
    }
});