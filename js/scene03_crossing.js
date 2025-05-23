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
            text: "The frog led the way across the rushing stream...", // Example narrator text
            action: function(actionCallback) {
                // Kitten and Frog appear at their initial CSS-defined positions
                // For .scene-03-stream-crossing:
                // Kitten: left: 70%, bottom: 25% (facing left)
                // Frog:   left: 5%,  bottom: 15% (facing right, towards kitten)
                gsap.to([$kittenSprite, $frogSprite], {
                    autoAlpha: 1,
                    duration: 0.5,
                    display: 'block',
                    onComplete: actionCallback
                });
            }
        },
        {
            text: "The frog jumped onto a rock, motioning for the kitten to follow. It chose the sturdiest rocks, ones that weren’t too slippery. The kitten cautiously placed its paws where the frog stepped, heart pounding. One step… two steps… Finally, the kitten successfully made it to the other side!",
            action: function(actionCallback){
                const startLeftPercent = 70; // Kitten's initial CSS left position
                const endLeftPercent = 20;   // Kitten's target CSS left position (next to frog)
                const numJumps = 4;          // Number of jumps kitten will make
                const jumpHeightPx = 30;     // How high (in pixels) each jump goes
                const totalCrossingDuration = 4.0; // Total time for the entire crossing animation

                // Define the target bottom position for the kitten to match the frog
                const kittenFinalBottomPercent = 15; // Assuming frog is at bottom: 15%

                const horizontalChangePerJump = (startLeftPercent - endLeftPercent) / numJumps;
                const durationPerJumpSegment = totalCrossingDuration / (numJumps * 2);

                const tl = gsap.timeline({
                    delay: 0.5, // Start animation shortly after the narrator's text appears
                    onComplete: actionCallback // Continue dialogue after kitten has finished all jumps
                });

                let currentTargetLeft = startLeftPercent;

                for (let i = 0; i < numJumps; i++) {
                    // 1. Jump Up
                    tl.to($kittenSprite, {
                        y: -jumpHeightPx, // Move up (negative y relative to current bottom)
                        duration: durationPerJumpSegment,
                        ease: "circ.out" // Ease for the upward part of the jump
                    });

                    // Update the target horizontal position for this jump
                    currentTargetLeft -= horizontalChangePerJump;

                    // 2. Move Forward (left) and Land
                    if (i < numJumps - 1) {
                        // For all jumps except the last one, land at original y baseline
                        tl.to($kittenSprite, {
                            left: currentTargetLeft + "%",
                            y: 0, // Return to the original vertical baseline (relative to current bottom)
                            duration: durationPerJumpSegment,
                            ease: "circ.in"
                        });
                    } else {
                        // For the very last jump, adjust final bottom position and land flat
                        tl.to($kittenSprite, {
                            left: currentTargetLeft + "%",          // Final horizontal position
                            bottom: kittenFinalBottomPercent + "%", // Animate to the target bottom percentage
                            y: 0,                                   // Ensure y transform is reset, landing flat at the new bottom
                            duration: durationPerJumpSegment,
                            ease: "circ.in"
                        });
                    }
                }
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