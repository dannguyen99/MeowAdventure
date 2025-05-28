// js/scene05_tower_intro.js
$(document).ready(function() {
    const $clockSprite = $('#clock-sprite'); // Changed from $towerSprite
    const $kittenSprite = $('#kitten-sprite');
    const $fluffyDogSprite = $('#fluffy-dog-sprite');
    const $owlSprite = $('#owl-sprite');
    const $kittenRunFrames = $('#kitten-running-frames img');
    const $dogRunFrames = $('#dog-running-frames img');

    const audioSelectors = {
        bgMusic: '#bg-music-scene5',
        click: '#click-sound',
        meowTired: '#meow-tired-sound',
        meowDetermined: '#meow-determined-sound',
        meowCurious: '#meow-curious-sound',
        fluffyWag: '#fluffy-dog-wag-sound',
        fluffyThinking: '#fluffy-dog-thinking-sound',
        fluffyExcited: '#fluffy-dog-excited-sound',
        owlHoot: '#owl-hoot-sound',
        owlMysterious: '#owl-mysterious-sound'
    };
    
    const meowTiredSound = $(audioSelectors.meowTired)[0];
    const meowDeterminedSound = $(audioSelectors.meowDetermined)[0];
    const meowCuriousSound = $(audioSelectors.meowCurious)[0];
    const fluffyWagSound = $(audioSelectors.fluffyWag)[0];
    const fluffyThinkingSound = $(audioSelectors.fluffyThinking)[0];
    const fluffyExcitedSound = $(audioSelectors.fluffyExcited)[0];
    const owlHootSound = $(audioSelectors.owlHoot)[0];
    const owlMysteriousSound = $(audioSelectors.owlMysterious)[0];

    // Animation helper functions
    function animateKittenRunning(duration = 2.0) {
        $kittenSprite.hide();
        
        const runTL = gsap.timeline({
            repeat: Math.floor(duration * 8), // ~8 FPS
            onComplete: () => {
                $kittenRunFrames.hide();
                $kittenSprite.show();
            }
        });
        
        $kittenRunFrames.each(function(index) {
            runTL.to($(this), { 
                autoAlpha: 1, 
                duration: 0.1 
            }, index * 0.125)
            .to($(this), { 
                autoAlpha: 0, 
                duration: 0.025 
            }, index * 0.125 + 0.1);
        });
        
        return runTL;
    }
    
    function animateDogRunning(duration = 2.0) {
        $fluffyDogSprite.hide();
        
        const runTL = gsap.timeline({
            repeat: Math.floor(duration * 6), // ~6 FPS for dog
            onComplete: () => {
                $dogRunFrames.hide();
                $fluffyDogSprite.show();
            }
        });
        
        $dogRunFrames.each(function(index) {
            runTL.to($(this), { 
                autoAlpha: 1, 
                duration: 0.12 
            }, index * 0.166)
            .to($(this), { 
                autoAlpha: 0, 
                duration: 0.04 
            }, index * 0.166 + 0.12);
        });
        
        return runTL;
    }

    const sceneDialogues = [
        {
            text: "I thought getting home would be easier! But it looks like more challenges are ahead...", 
            character: "Kitten", 
            sfx: meowTiredSound,
            action: function(cb) {
                // Kitten stretching, looking tired
                gsap.timeline({ onComplete: cb })
                    .to($kittenSprite, { 
                        scaleY: 1.2, 
                        duration: 0.4, 
                        ease: "power2.out" 
                    })
                    .to($kittenSprite, { 
                        scaleY: 1.0, 
                        duration: 0.3, 
                        ease: "bounce.out" 
                    })
                    .to($kittenSprite, { 
                        rotation: -5, 
                        duration: 0.3 
                    })
                    .to($kittenSprite, { 
                        rotation: 0, 
                        duration: 0.3 
                    });
            }
        },
        {
            text: "Don't worry! No matter what happens, I'll always be by your side!", 
            character: "Fluffy Dog", 
            sfx: fluffyWagSound,
            action: function(cb) {
                // Fluffy dog wagging tail enthusiastically
                gsap.timeline({ onComplete: cb })
                    .to($fluffyDogSprite, { 
                        rotation: 3, 
                        duration: 0.15 
                    })
                    .to($fluffyDogSprite, { 
                        rotation: -3, 
                        duration: 0.15 
                    })
                    .to($fluffyDogSprite, { 
                        rotation: 2, 
                        duration: 0.1 
                    })
                    .to($fluffyDogSprite, { 
                        rotation: -2, 
                        duration: 0.1 
                    })
                    .to($fluffyDogSprite, { 
                        rotation: 0, 
                        duration: 0.1 
                    })
                    .to($fluffyDogSprite, { 
                        y: "-=8px", 
                        duration: 0.2, 
                        ease: "power2.out" 
                    })
                    .to($fluffyDogSprite, { 
                        y: "+=8px", 
                        duration: 0.2, 
                        ease: "bounce.out" 
                    });
            }
        },
        {
            text: "*Just then, they noticed an old stone tower with a massive clock...*", 
            action: function(cb) {
                // Clock appears dramatically
                gsap.timeline({ onComplete: cb })
                    .to($clockSprite, { 
                        autoAlpha: 1, 
                        scale: 0.5,
                        duration: 0.1 
                    })
                    .to($clockSprite, { 
                        scale: 1.1, 
                        duration: 0.4, 
                        ease: "power2.out" 
                    })
                    .to($clockSprite, { 
                        scale: 1.0, 
                        duration: 0.3, 
                        ease: "bounce.out" 
                    })
                    // Both characters react to seeing the clock
                    .to([$kittenSprite, $fluffyDogSprite], { 
                        x: "-=10px", 
                        duration: 0.2, 
                        ease: "power2.out" 
                    }, "-=0.5")
                    .to([$kittenSprite, $fluffyDogSprite], { 
                        x: "+=10px", 
                        duration: 0.3, 
                        ease: "bounce.out" 
                    });
            }
        },
        {
            text: "*The clock's hands were frozen in place...*", 
            action: function(cb) {
                // Focus on the clock (subtle zoom/highlight effect)
                gsap.timeline({ onComplete: cb })
                    .to($clockSprite, { 
                        scale: 1.05, 
                        duration: 0.3, 
                        ease: "power2.out" 
                    })
                    .to($clockSprite, { 
                        scale: 1.0, 
                        duration: 0.4, 
                        ease: "power2.inOut" 
                    });
            }
        },
        {
            text: '"Whoever wishes to pass must make time move again." What does this mean?', 
            character: "Kitten", 
            sfx: meowCuriousSound,
            action: function(cb) {
                // Kitten reading aloud, frowning
                gsap.timeline({ onComplete: cb })
                    .to($kittenSprite, { 
                        x: "+=15px", 
                        duration: 0.3, 
                        ease: "power2.out" 
                    })
                    .to($kittenSprite, { 
                        rotation: 10, 
                        duration: 0.3 
                    })
                    .to($kittenSprite, { 
                        rotation: -5, 
                        duration: 0.2 
                    })
                    .to($kittenSprite, { 
                        rotation: 0, 
                        x: "-=15px",
                        duration: 0.3 
                    });
            }
        },
        {
            text: "Maybe... we have to do something to get the clock working again?", 
            character: "Fluffy Dog", 
            sfx: fluffyThinkingSound,
            action: function(cb) {
                // Fluffy dog tilting head, thinking
                gsap.timeline({ onComplete: cb })
                    .to($fluffyDogSprite, { 
                        rotation: -15, 
                        duration: 0.4, 
                        ease: "power2.out" 
                    })
                    .to($fluffyDogSprite, { 
                        rotation: 15, 
                        duration: 0.4 
                    })
                    .to($fluffyDogSprite, { 
                        rotation: 0, 
                        duration: 0.3 
                    });
            }
        },
        {
            text: "*Suddenly, an old owl swooped down from above...*", 
            action: function(cb) {
                // Owl dramatic entrance
                gsap.timeline({ onComplete: cb })
                    .set($owlSprite, { 
                        y: "-200px", 
                        x: "100px", 
                        autoAlpha: 1, 
                        rotation: -20 
                    })
                    .to($owlSprite, { 
                        y: "0px", 
                        x: "0px", 
                        rotation: 0,
                        duration: 0.8, 
                        ease: "power2.out" 
                    })
                    // Characters react with surprise
                    .to([$kittenSprite, $fluffyDogSprite], { 
                        y: "-=5px", 
                        duration: 0.1, 
                        ease: "power2.out" 
                    }, "-=0.3")
                    .to([$kittenSprite, $fluffyDogSprite], { 
                        y: "+=5px", 
                        duration: 0.2, 
                        ease: "bounce.out" 
                    });
            }
        },
        {
            text: "Greetings, little travellers. Do you wish to pass?", 
            character: "Old Owl", 
            sfx: owlHootSound,
            action: function(cb) {
                // Owl wise gesture
                gsap.timeline({ onComplete: cb })
                    .to($owlSprite, { 
                        y: "-=10px", 
                        duration: 0.3, 
                        ease: "power2.out" 
                    })
                    .to($owlSprite, { 
                        y: "+=10px", 
                        duration: 0.4, 
                        ease: "bounce.out" 
                    });
            }
        },
        {
            text: "Yes! We're on our way home!", 
            character: "Kitten", 
            sfx: meowDeterminedSound,
            action: function(cb) {
                // Kitten nodding determinedly
                gsap.timeline({ onComplete: cb })
                    .to($kittenSprite, { 
                        y: "-=8px", 
                        duration: 0.2, 
                        ease: "power2.out" 
                    })
                    .to($kittenSprite, { 
                        y: "+=8px", 
                        duration: 0.2, 
                        ease: "bounce.out" 
                    })
                    .to($kittenSprite, { 
                        y: "-=5px", 
                        duration: 0.15 
                    })
                    .to($kittenSprite, { 
                        y: "+=5px", 
                        duration: 0.15, 
                        ease: "bounce.out" 
                    });
            }
        },
        {
            text: "Then there's only one way forward: You must find the three lost gears to restore the movement of this ancient clock.", 
            character: "Old Owl", 
            sfx: owlMysteriousSound,
            action: function(cb) {
                // Owl mysterious gesture
                gsap.timeline({ onComplete: cb })
                    .to($owlSprite, { 
                        rotation: -5, 
                        duration: 0.3 
                    })
                    .to($owlSprite, { 
                        rotation: 5, 
                        duration: 0.3 
                    })
                    .to($owlSprite, { 
                        rotation: 0, 
                        duration: 0.3 
                    });
            }
        },
        {
            text: "Three gears? That sounds easy! Where are they?", 
            character: "Fluffy Dog", 
            sfx: fluffyExcitedSound,
            action: function(cb) {
                // Fluffy dog excited
                gsap.timeline({ onComplete: cb })
                    .to($fluffyDogSprite, { 
                        y: "-=12px", 
                        scale: 1.05,
                        duration: 0.2, 
                        ease: "power2.out" 
                    })
                    .to($fluffyDogSprite, { 
                        y: "+=12px", 
                        scale: 1.0,
                        duration: 0.3, 
                        ease: "bounce.out" 
                    });
            }
        },
        {
            text: "One is buried under the roots of the old oak tree. One was taken by a starling and placed in its nest high in the trees. The last one fell into the depths of the stream.", 
            character: "Old Owl", 
            sfx: owlHootSound,
            action: function(cb) {
                // Owl explaining with wing gestures (simulate with movements)
                gsap.timeline({ onComplete: cb })
                    .to($owlSprite, { 
                        x: "-=10px", 
                        duration: 0.3 
                    })
                    .to($owlSprite, { 
                        y: "-=8px", 
                        duration: 0.3 
                    })
                    .to($owlSprite, { 
                        x: "+=20px", 
                        duration: 0.4 
                    })
                    .to($owlSprite, { 
                        x: "-=10px", 
                        y: "+=8px", 
                        duration: 0.4 
                    });
            }
        },
        {
            text: "All three places seem hard to reach… But if we work together, we can do it!", 
            character: "Kitten", 
            sfx: meowDeterminedSound,
            action: function(cb) {
                // Kitten determined despite concern
                gsap.timeline({ onComplete: cb })
                    .to($kittenSprite, { 
                        rotation: -8, 
                        duration: 0.2 
                    })
                    .to($kittenSprite, { 
                        rotation: 0, 
                        y: "-=10px", 
                        duration: 0.3, 
                        ease: "power2.out" 
                    })
                    .to($kittenSprite, { 
                        y: "+=10px", 
                        duration: 0.3, 
                        ease: "bounce.out" 
                    });
            }
        },
        {
            text: "Then what are we waiting for? Let's go!", 
            character: "Fluffy Dog", 
            sfx: fluffyExcitedSound,
            action: function(cb) {
                // Both characters prepare to leave with running animation
                const mainTL = gsap.timeline({ onComplete: cb });
                
                // First, excited reaction
                mainTL.to($fluffyDogSprite, { 
                    y: "-=12px", 
                    scale: 1.05,
                    duration: 0.2, 
                    ease: "power2.out" 
                })
                .to($fluffyDogSprite, { 
                    y: "+=12px", 
                    scale: 1.0,
                    duration: 0.3, 
                    ease: "bounce.out" 
                })
                
                // Then run animation for both
                .add(() => {
                    animateKittenRunning(1.5);
                    animateDogRunning(1.5);
                }, "+=0.2")
                
                // Move them slightly during running
                .to([$kittenSprite, $fluffyDogSprite], { 
                    x: "+=20px", 
                    duration: 1.5, 
                    ease: "power2.inOut" 
                }, "-=1.5");
            },
            endScene: true // Shows "Begin Quest" button
        }
    ];

    const imagesForThisScene = [
        'images/Lv4.jpeg', // Background
        'images/TheClock.png', // The actual clock image
        'images/Kitten.png', 
        'images/FluffyDog.png',
        'images/Owl.png',
        // Preload animation frames
        'images/Kitten Animation 2/Kitten Animation 1.png',
        'images/Kitten Animation 2/Kitten Animation 2.png',
        'images/Kitten Animation 2/Kitten Animation 3.png',
        'images/Kitten Animation 2/Kitten Animation 4.png',
        'images/Kitten Animation 2/Kitten Animation 5.png',
        'images/Kitten Animation 2/Kitten Animation 6.png',
        'images/Kitten Animation 2/Kitten Animation 7.png',
        'images/Kitten Animation 2/Kitten Animation 8.png',
        'images/Golden Dog Animation/Dog 1.png',
        'images/Golden Dog Animation/Dog 2.png',
        'images/Golden Dog Animation/Dog 3.png',
        'images/Golden Dog Animation/Dog 4.png',
        'images/Golden Dog Animation/Dog 5.png',
        'images/Golden Dog Animation/Dog 6.png'
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 05 Tower Intro is ready!");
            
            // Initialize character positions
            gsap.set($kittenSprite, { 
                autoAlpha: 1, 
                display: 'block'
            });
            
            gsap.set($fluffyDogSprite, { 
                autoAlpha: 1, 
                display: 'block'
            });
            
            gsap.set($clockSprite, { // Changed from $towerSprite
                autoAlpha: 0, 
                display: 'block'
            });
            
            gsap.set($owlSprite, { 
                autoAlpha: 0, 
                display: 'block'
            });

            // Initialize animation frames
            gsap.set($kittenRunFrames, { 
                autoAlpha: 0, 
                display: 'block'
            });
            
            gsap.set($dogRunFrames, { 
                autoAlpha: 0, 
                display: 'block'
            });
        }
    };

    initializeSceneFramework(sceneData);
});