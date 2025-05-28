// js/scene04_victory.js
$(document).ready(function() {
    const $kittenSprite = $('#kitten-sprite');
    const $fluffyDogSprite = $('#fluffy-dog-sprite');
    const $fierceDogSprite = $('#fierce-dog-sprite');

    const audioSelectors = {
        bgMusic: '#bg-music-scene4',
        click: '#click-sound',
        meowHappy: '#meow-happy-sound',
        meowRelieved: '#meow-relieved-sound',
        fluffyLaugh: '#fluffy-dog-laugh-sound',
        fluffyBark: '#fluffy-dog-bark-sound',
        fluffyCheer: '#fluffy-dog-cheer-sound',
        fierceDogDefeat: '#fierce-dog-defeat-sound',
        fierceDogFrustrated: '#fierce-dog-frustrated-sound'
    };
    
    const meowHappySound = $(audioSelectors.meowHappy)[0];
    const meowRelievedSound = $(audioSelectors.meowRelieved)[0];
    const fluffyLaughSound = $(audioSelectors.fluffyLaugh)[0];
    const fluffyBarkSound = $(audioSelectors.fluffyBark)[0];
    const fluffyCheerSound = $(audioSelectors.fluffyCheer)[0];
    const fierceDogDefeatSound = $(audioSelectors.fierceDogDefeat)[0];
    const fierceDogFrustratedSound = $(audioSelectors.fierceDogFrustrated)[0];

    const sceneDialogues = [
        {
            text: "Keep going, Kitten! You're almost there!", 
            character: "Fluffy Dog", 
            sfx: fluffyCheerSound,
            action: function(cb) {
                // Fluffy dog cheering enthusiastically
                gsap.timeline({ onComplete: cb })
                    .to($fluffyDogSprite, { y: "-=10px", duration: 0.2, ease: "power2.out" })
                    .to($fluffyDogSprite, { y: "+=10px", duration: 0.2, ease: "bounce.out" })
            }
        },
        {
            text: "No… Impossible! How are you winning?!", 
            character: "Fierce Dog", 
            sfx: fierceDogDefeatSound,
            action: function(cb) {
                // Fierce dog shaking head, stepping back
                gsap.timeline({ onComplete: cb })
                    .to($fierceDogSprite, { 
                        rotation: -10, 
                        x: "-=30px", 
                        scale: 0.85,
                        duration: 0.4, 
                        ease: "power2.out" 
                    })
                    .to($fierceDogSprite, { 
                        rotation: 10, 
                        duration: 0.2 
                    })
                    .to($fierceDogSprite, { 
                        rotation: -5, 
                        duration: 0.2 
                    })
                    .to($fierceDogSprite, { 
                        rotation: 0, 
                        duration: 0.2 
                    });
            }
        },
        {
            text: "I did it!", 
            character: "Kitten", 
            sfx: meowRelievedSound,
        },
        {
            text: "Hmph… You're good. Fine, go! But don't come back here again!", 
            character: "Fierce Dog", 
            sfx: fierceDogFrustratedSound,
            action: function(cb) {
                // Fierce dog gritting teeth, frustrated
                gsap.timeline({ onComplete: cb })
                    .to($fierceDogSprite, { 
                        rotation: -15, 
                        duration: 0.2 
                    })
                    .to($fierceDogSprite, { 
                        rotation: 15, 
                        duration: 0.2 
                    })
                    .to($fierceDogSprite, { 
                        rotation: 0, 
                        duration: 0.2 
                    });
            }
        },
        {
            text: "*The fierce dog turns and disappears into the bushes...*", 
            character: "Narrator",
            action: function(cb) {
                // Fierce dog turns and disappears into bushes
                gsap.timeline({ onComplete: cb })
                    .to($fierceDogSprite, { 
                        scaleX: -1, // Turn around
                        duration: 0.3 
                    })
                    .to($fierceDogSprite, { 
                        x: "-=100px", 
                        autoAlpha: 0,
                        duration: 0.8, 
                        ease: "power2.in" 
                    });
            }
        },
        {
            text: "You did great! I knew you could do it!", 
            character: "Fluffy Dog", 
            sfx: fluffyLaughSound,
            action: function(cb) {
                // Fluffy dog "pats kitten" - move closer and bounce
                gsap.timeline({ onComplete: cb })
                    .to($fluffyDogSprite, { 
                        x: "-=15px", 
                        duration: 0.3, 
                        ease: "power1.out" 
                    })
                    .to($fluffyDogSprite, { 
                        y: "-=5px", 
                        duration: 0.1 
                    })
                    .to($fluffyDogSprite, { 
                        y: "+=5px", 
                        duration: 0.2, 
                        ease: "bounce.out" 
                    });
            }
        },
        {
            text: "Thank you for cheering me on! Without you, I might've been too scared to even try!", 
            character: "Kitten", 
            sfx: meowHappySound,
        },
        {
            text: "Haha, you're stronger than you think! Now, let's keep moving! Your journey isn't over yet!", 
            character: "Fluffy Dog", 
            sfx: fluffyBarkSound,
            action: function(cb) {
                // Both characters prepare to continue journey
                gsap.timeline({ onComplete: cb })
                    .to($fluffyDogSprite, { 
                        x: "+=10px", 
                        duration: 0.3 
                    })
                    .to($kittenSprite, { 
                        x: "+=5px", 
                        duration: 0.3 
                    }, "-=0.1");
            },
            endScene: true // Triggers "Keep Moving" button
        }
    ];

    const imagesForThisScene = [
        'images/Lv3.jfif', 
        'images/Kitten.png', 
        'images/FluffyDog.png',
        'images/FierceDog.png'
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 04 Victory is ready!");
            
            // Show all three characters initially - fierce dog looks weakened
            gsap.set($fierceDogSprite, { autoAlpha: 1, scale: 0.9, x: "-20px" });
            gsap.set([$kittenSprite, $fluffyDogSprite, $fierceDogSprite], { 
                autoAlpha: 1, 
                display: 'block'
            });
        }
    };

    initializeSceneFramework(sceneData);
});