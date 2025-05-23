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

    const defaultKittenImage = 'images/Kitten.png';
    const kittenJumpFrames = [
        'images/Jumping Kitten/Jumping Kitten 1.png', // Take-off
        'images/Jumping Kitten/Jumping Kitten 2.png', // Mid-air ascending/peak
        'images/Jumping Kitten/Jumping Kitten 3.png', // Mid-air descending
        'images/Jumping Kitten/Jumping Kitten 4.png'  // Landing
    ];


    // --- SCENE DIALOGUES ---
    const sceneDialogues = [
        {
            text: "The frog led the way across the rushing stream...", // Example narrator text
            action: function(actionCallback) {
                // Kitten and Frog appear at their initial CSS-defined positions
                // For .scene-03-stream-crossing:
                // Kitten: left: 70%, bottom: 25% (facing left)
                // Frog:   left: 5%,  bottom: 15% (facing right, towards kitten)
                $kittenSprite.attr('src', defaultKittenImage); // Ensure kitten starts with default image
                gsap.to([$kittenSprite, $frogSprite], {
                    autoAlpha: 1,
                    duration: 0.5,
                    display: 'block',
                    onComplete: actionCallback
                });
            }
        },
        {
            text: "The frog jumped onto a rock, motioning for the kitten to follow. It chose the sturdiest rocks, ones that weren't too slippery. The kitten cautiously placed its paws where the frog stepped, heart pounding. One step… two steps… Finally, the kitten successfully made it to the other side!",
            action: function(actionCallback){
                const startLeftPercent = 70; // Kitten's initial CSS left position
                const endLeftPercent = 20;   // Kitten's target CSS left position (next to frog)
                const numJumps = 4;          // Number of jumps kitten will make
                const jumpHeightPx = 60;     // Increased jump height for more dramatic effect
                const totalCrossingDuration = 3.5; // Slightly longer for better visibility
                const jumpingSpriteScale = 1.5; // Make jumping sprite bigger

                // Define the target bottom position for the kitten to match the frog
                const kittenFinalBottomPercent = 20; // Assuming frog is at bottom: 15%

                const horizontalChangePerJump = (startLeftPercent - endLeftPercent) / numJumps;
                const durationPerJumpSegment = totalCrossingDuration / (numJumps * 2); // Duration for up or down part of jump

                // Get the dialogue box element
                const $dialogueBoxContainer = $('#dialogue-box-container');

                const tl = gsap.timeline({
                    delay: 0.3, // Reduced delay for quicker start
                    onStart: function() {
                        // Hide the dialogue box before starting the jumping animation
                        gsap.to($dialogueBoxContainer, { autoAlpha: 0, duration: 0.3 });
                    },
                    onComplete: function() {
                        // Ensure kitten is on default image AND properly reset all transforms
                        $kittenSprite.attr('src', defaultKittenImage);
                        gsap.set($kittenSprite, { 
                            scaleX: 1,   // Reset horizontal scale to normal (not flipped)
                            scaleY: -1,   // Reset vertical scale to normal (explicitly set)
                            scale: 1,
                        });
                        
                        // Show the dialogue box again after animation finishes
                        gsap.to($dialogueBoxContainer, { 
                            autoAlpha: 1, 
                            duration: 0.3,
                            onComplete: actionCallback // Call actionCallback after dialogue box is shown
                        });
                    }
                });

                let currentTargetLeft = startLeftPercent;

                for (let i = 0; i < numJumps; i++) {
                    // 1. Jump Up - Start with take-off frame
                    tl.set($kittenSprite, { 
                        attr: { src: kittenJumpFrames[0] },
                        scaleX: -jumpingSpriteScale, // Flip horizontally AND make bigger for jumping frames
                        scaleY: -jumpingSpriteScale   // Make bigger vertically too
                    })
                    .to($kittenSprite, {
                        y: -jumpHeightPx, // Move up (negative y relative to current bottom)
                        duration: durationPerJumpSegment * 0.6, // Slightly faster upward motion
                        ease: "power2.out", // Changed to power2.out for snappier jump
                        onComplete: () => {
                            $kittenSprite.attr('src', kittenJumpFrames[1]); // Peak/mid-air ascending frame
                            // No need to reset scale here, it should maintain the jumping scale
                        }
                    });

                    // Update the target horizontal position for this jump
                    currentTargetLeft -= horizontalChangePerJump;

                    // 2. Move Forward (left) and Land
                    if (i < numJumps - 1) {
                        // For all jumps except the last one, land at original y baseline
                        tl.to($kittenSprite, {
                            left: currentTargetLeft + "%",
                            y: 0, // Return to the original vertical baseline
                            duration: durationPerJumpSegment * 1.4, // Slightly longer landing motion
                            ease: "power2.in", // Changed to power2.in for better landing feel
                            onStart: () => {
                                $kittenSprite.attr('src', kittenJumpFrames[2]); // Mid-air descending frame
                            },
                            onComplete: () => {
                                $kittenSprite.attr('src', kittenJumpFrames[3]); // Landed frame
                                // Keep the jumping scale for the landing frame too
                            }
                        });
                    } else {
                        // For the very last jump, adjust final bottom position and land flat
                        tl.to($kittenSprite, {
                            left: currentTargetLeft + "%",          // Final horizontal position
                            bottom: kittenFinalBottomPercent + "%", // Animate to the target bottom percentage
                            y: 0,                                   // Ensure y transform is reset
                            duration: durationPerJumpSegment * 1.4, // Slightly longer final landing
                            ease: "power2.in",
                            onStart: () => {
                                $kittenSprite.attr('src', kittenJumpFrames[2]); // Mid-air descending frame
                            },
                            onComplete: () => {
                                $kittenSprite.attr('src', kittenJumpFrames[3]); // Final landed frame
                                // The main timeline's onComplete will handle the reset to defaultKittenImage and normal scale
                            }
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
        defaultKittenImage, // Default idle kitten image
        'images/Frog.png',
        ...kittenJumpFrames     // Add all jumping frames for preloading
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