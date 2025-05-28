// js/scene05_gear_oak.js
$(document).ready(function() {
    const $oakTreeSprite = $('#oak-tree-sprite');
    const $kittenSprite = $('#kitten-sprite');
    const $fluffyDogSprite = $('#fluffy-dog-sprite');
    const $gearSprite = $('#gear-sprite');
    const $diggingSpots = $('.dig-spot');
    const $gameUI = $('#game-ui');
    const $attemptCount = $('#attempt-count');

    // Game state
    let currentAttempts = 0;
    const maxAttempts = 3;
    const correctSpot = Math.floor(Math.random() * 6) + 1; // Random spot 1-6
    let gameActive = false;

    const audioSelectors = {
        bgMusic: '#bg-music-scene5',
        click: '#click-sound',
        meowExcited: '#meow-excited-sound',
        meowDisappointed: '#meow-disappointed-sound',
        fluffyExcited: '#fluffy-dog-excited-sound',
        digSound: '#dig-sound',
        successSound: '#success-sound'
    };
    
    const meowExcitedSound = $(audioSelectors.meowExcited)[0];
    const meowDisappointedSound = $(audioSelectors.meowDisappointed)[0];
    const fluffyExcitedSound = $(audioSelectors.fluffyExcited)[0];
    const digSound = $(audioSelectors.digSound)[0];
    const successSound = $(audioSelectors.successSound)[0];

    // Digging game functions
    function startDiggingGame() {
        gameActive = true;
        
        // Show UI and make spots clickable
        gsap.to($gameUI, { autoAlpha: 1, duration: 0.5 });
        gsap.to($diggingSpots, { 
            autoAlpha: 0.8, 
            duration: 0.3, 
            stagger: 0.1 
        });
        
        // Add glow effect to spots
        $diggingSpots.addClass('glowing');
        
        // Add click handlers
        $diggingSpots.on('click.digging', handleDigClick);
    }

    function handleDigClick(event) {
        if (!gameActive) return;
        
        const $spot = $(event.currentTarget);
        const spotNumber = parseInt($spot.data('spot'));
        
        // Play dig sound
        if (typeof playGameSfx === 'function') {
            playGameSfx('#dig-sound');
        }
        
        // Visual feedback
        gsap.timeline()
            .to($spot, { scale: 1.2, duration: 0.1 })
            .to($spot, { scale: 0.8, duration: 0.2 })
            .to($spot, { autoAlpha: 0.3, duration: 0.2 });
        
        currentAttempts++;
        $attemptCount.text(currentAttempts);
        
        if (spotNumber === correctSpot) {
            // Success!
            foundGear($spot);
        } else {
            // Wrong spot
            if (currentAttempts >= maxAttempts) {
                // Game over - reveal correct spot
                gameOver();
            } else {
                // Try again
                wrongSpotFeedback();
            }
        }
        
        $spot.off('click.digging');
    }

    function foundGear($spot) {
        gameActive = false;
        $diggingSpots.off('click.digging');
        
        // Hide UI
        gsap.to($gameUI, { autoAlpha: 0, duration: 0.3 });
        
        // Success sound
        if (typeof playGameSfx === 'function') {
            playGameSfx('#success-sound');
        }
        
        // Show gear appearing from the spot
        gsap.set($gearSprite, {
            x: $spot.offset().left - $('#game-container').offset().left,
            y: $spot.offset().top - $('#game-container').offset().top,
            scale: 0.1,
            autoAlpha: 1
        });
        
        gsap.timeline()
            .to($gearSprite, { 
                scale: 1.2, 
                duration: 0.4, 
                ease: "back.out(1.7)" 
            })
            .to($gearSprite, { 
                scale: 1.0, 
                duration: 0.2 
            })
            .to([$kittenSprite, $fluffyDogSprite], {
                y: "-=10px",
                duration: 0.2,
                ease: "power2.out"
            }, "-=0.3")
            .to([$kittenSprite, $fluffyDogSprite], {
                y: "+=10px",
                duration: 0.3,
                ease: "bounce.out"
            });
        
        // Continue to success dialogue
        setTimeout(() => {
            window.gameDialogueSystem.advance();
        }, 1500);
    }

    function wrongSpotFeedback() {
        // Characters react with disappointment
        gsap.timeline()
            .to($kittenSprite, { 
                rotation: -10, 
                duration: 0.2 
            })
            .to($kittenSprite, { 
                rotation: 0, 
                duration: 0.3 
            })
            .to($fluffyDogSprite, {
                scaleY: 0.9,
                duration: 0.2
            }, "-=0.5")
            .to($fluffyDogSprite, {
                scaleY: 1.0,
                duration: 0.3
            });
        
        if (typeof playGameSfx === 'function') {
            playGameSfx('#meow-disappointed-sound');
        }
    }

    function gameOver() {
        gameActive = false;
        $diggingSpots.off('click.digging');
        
        // Hide UI
        gsap.to($gameUI, { autoAlpha: 0, duration: 0.3 });
        
        // Reveal the correct spot and show gear
        const $correctSpot = $(`.dig-spot[data-spot="${correctSpot}"]`);
        
        gsap.timeline()
            .to($correctSpot, { 
                autoAlpha: 1, 
                scale: 1.3, 
                duration: 0.5 
            })
            .call(() => foundGear($correctSpot));
    }

    const sceneDialogues = [
        {
            text: "Here's the old oak tree! The gear must be buried somewhere around its roots.", 
            character: "Kitten",
            sfx: meowExcitedSound,
            action: function(cb) {
                // Oak tree appears
                gsap.timeline({ onComplete: cb })
                    .to($oakTreeSprite, { 
                        autoAlpha: 1, 
                        scale: 0.8,
                        duration: 0.1 
                    })
                    .to($oakTreeSprite, { 
                        scale: 1.1, 
                        duration: 0.4, 
                        ease: "power2.out" 
                    })
                    .to($oakTreeSprite, { 
                        scale: 1.0, 
                        duration: 0.3, 
                        ease: "bounce.out" 
                    });
            }
        },
        {
            text: "I can smell something metallic around here! Let's search carefully!", 
            character: "Fluffy Dog",
            sfx: fluffyExcitedSound,
            action: function(cb) {
                // Dog sniffing animation
                gsap.timeline({ onComplete: cb })
                    .to($fluffyDogSprite, { 
                        scaleX: 1.1, 
                        duration: 0.3 
                    })
                    .to($fluffyDogSprite, { 
                        scaleX: 1.0, 
                        duration: 0.2 
                    })
                    .to($fluffyDogSprite, { 
                        y: "-=5px", 
                        duration: 0.2 
                    })
                    .to($fluffyDogSprite, { 
                        y: "+=5px", 
                        duration: 0.2 
                    });
            }
        },
        {
            text: "Look! There are some soft spots in the ground. Maybe we should try digging in different places?",
            character: "Kitten", 
            action: function(cb) {
                // Show digging spots and start the game
                gsap.timeline({ onComplete: cb })
                    .call(() => startDiggingGame());
            },
            skipAdvance: true // Don't auto-advance, wait for game completion
        },
        {
            text: "We found it! The first gear!", 
            character: "Kitten",
            sfx: meowExcitedSound,
            action: function(cb) {
                // Celebration animation
                gsap.timeline({ onComplete: cb })
                    .to($kittenSprite, { 
                        y: "-=15px", 
                        rotation: 10,
                        duration: 0.3, 
                        ease: "power2.out" 
                    })
                    .to($kittenSprite, { 
                        y: "+=15px", 
                        rotation: 0,
                        duration: 0.4, 
                        ease: "bounce.out" 
                    })
                    .to($fluffyDogSprite, {
                        rotation: 5,
                        duration: 0.2
                    }, "-=0.5")
                    .to($fluffyDogSprite, {
                        rotation: -5,
                        duration: 0.2
                    })
                    .to($fluffyDogSprite, {
                        rotation: 0,
                        duration: 0.2
                    });
            }
        },
        {
            text: "Great teamwork! Now we need to find the second gear in the starling's nest. That's going to be tricky!", 
            character: "Fluffy Dog",
            sfx: fluffyExcitedSound,
            action: function(cb) {
                // Final celebration
                gsap.timeline({ onComplete: cb })
                    .to([$kittenSprite, $fluffyDogSprite], {
                        y: "-=8px",
                        duration: 0.2,
                        ease: "power2.out"
                    })
                    .to([$kittenSprite, $fluffyDogSprite], {
                        y: "+=8px",
                        duration: 0.3,
                        ease: "bounce.out"
                    });
            },
            endScene: true
        }
    ];

    const imagesForThisScene = [
        'images/Lv4.jpeg', // Background
        'images/Lv4_OakTree.png',
        'images/Kitten.png', 
        'images/FluffyDog.png',
        'images/Gear.png'
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 05 Oak Tree Gear Hunt is ready!");
            
            // Initialize character positions
            gsap.set($kittenSprite, { 
                autoAlpha: 1, 
                display: 'block'
            });
            
            gsap.set($fluffyDogSprite, { 
                autoAlpha: 1, 
                display: 'block'
            });
            
            gsap.set($oakTreeSprite, { 
                autoAlpha: 0, 
                display: 'block'
            });
            
            gsap.set($gearSprite, { 
                autoAlpha: 0, 
                display: 'block'
            });

            gsap.set($diggingSpots, { 
                autoAlpha: 0, 
                display: 'block'
            });
        }
    };

    initializeSceneFramework(sceneData);
});