// js/scene04_intro.js
$(document).ready(function() {
    const $kittenSprite = $('#kitten-sprite');
    const $fluffyDogSprite = $('#fluffy-dog-sprite');
    const $fierceDogSprite = $('#fierce-dog-sprite');

    const audioSelectors = {
        bgMusic: '#bg-music-scene4',
        click: '#click-sound',
        meowSurprised: '#meow-surprised-sound',
        meowScared: '#meow-scared-sound',
        fluffyBark: '#fluffy-dog-bark-sound',
        fierceBark: '#fierce-dog-bark-sound',
        fierceGrowl: '#fierce-dog-growl-sound',
        furShake: '#fur-shake-sound'
    };
    // Get actual audio elements
    const meowSurprisedSound = $(audioSelectors.meowSurprised)[0];
    const meowScaredSound = $(audioSelectors.meowScared)[0];
    const fluffyBarkSound = $(audioSelectors.fluffyBark)[0];
    const fierceBarkSound = $(audioSelectors.fierceBark)[0];
    const fierceGrowlSound = $(audioSelectors.fierceGrowl)[0];
    const furShakeSound = $(audioSelectors.furShake)[0];

    const sceneDialogues = [
        {
            text: "Just after crossing the stream, the kitten shook its soaking wet fur, shivering slightly as a gentle breeze brushed past.",
            action: function(callback) {
                gsap.to($kittenSprite, { autoAlpha: 1, duration: 0.5, display: 'block' });
                if(furShakeSound && typeof playGameSfx === 'function') playGameSfx(furShakeSound);
                // Kitten shake animation for drying off
                gsap.fromTo($kittenSprite,
                    { rotation: -3 },
                    { rotation: 3, duration: 0.1, repeat: 6, yoyo: true, ease: "sine.inOut",
                    onComplete: () => {
                        gsap.set($kittenSprite, { rotation: 0, scaleX: -1 }); // Reset rotation
                        callback(); 
                    }
                });
            }
        },
        { 
            text: "The sun shone down on the lush green meadow ahead, bringing a sense of warmth and comfort. The kitten sighed in relief, but before it could fully relax, a loud bark echoed from a distance."
        },
        {
            text: "???: Woof! Hey, little one! Where are you going? You look worried!",
            sfx: fluffyBarkSound,
            action: function(callback) {
                // Kitten turns around startled
                gsap.to($kittenSprite, {
                    scaleX: 1, // Turn around to face the fluffy dog
                    duration: 0.3,
                    ease: "power2.inOut"
                });
                
                // Fluffy Dog appears from behind
                $fluffyDogSprite.css('display', 'block');
                gsap.fromTo($fluffyDogSprite,
                    { autoAlpha: 0, x: "+=100px" },
                    { autoAlpha: 1, x: "0px", duration: 0.8, ease: "power2.out", onComplete: callback }
                );
            }
        },
        { 
            text: "Startled, the kitten quickly turned around. A fluffy golden dog stood on the small path; its bright eyes filled with friendliness.",
            action: function(callback) {
                // Kitten steps back slightly (cautious)
                gsap.to($kittenSprite, {
                    x: "+=20px", // Step back slightly
                    duration: 0.4,
                    ease: "power1.out",
                    onComplete: callback
                });
            }
        },
        { text: "Uh… Hello! I'm Kitten. I got lost and I'm trying to find my way home.", character: "Kitten", sfx: meowSurprisedSound },
        { text: "Oh, I see! Are you traveling alone? It's not safe to wander around here!", character: "Fluffy Dog", sfx: fluffyBarkSound },
        { text: "I know… but I have no other choice. Can you help me?", character: "Kitten", sfx: meowScaredSound },
        { text: "Of course! Follow me, I know a way that can lead you out of here.", character: "Fluffy Dog", sfx: fluffyBarkSound },
        { 
            text: "Overjoyed, the kitten trotted after the fluffy dog. The two walked along the narrow path, with wildflowers swaying gently in the wind. The atmosphere became much lighter and more pleasant.",
            action: function(callback) {
                // Both characters move forward together
                const tl = gsap.timeline({ onComplete: callback });
                
                tl.to($kittenSprite, { 
                    x: "+=60px", 
                    duration: 2.0, 
                    ease: "power1.inOut" 
                })
                .to($fluffyDogSprite, { 
                    x: "+=50px", 
                    duration: 2.0, 
                    ease: "power1.inOut" 
                }, 0); // Start at the same time
            }
        },
        { text: "Do you live here?", character: "Kitten", sfx: meowSurprisedSound },
        { text: "Yep! I know every path in this area. If you ever need help, just ask me!", character: "Fluffy Dog", sfx: fluffyBarkSound },
        { text: "Thank you! Without you, I wouldn't know where to go...", character: "Kitten", sfx: meowSurprisedSound },
        { 
            text: "As they chatted and walked together, the kitten slowly started to feel less anxious. But before they could go much farther, a low, menacing growl rumbled from up ahead.",
            sfx: fierceGrowlSound
        },
        {
            text: "???: Stop right there!",
            sfx: fierceBarkSound,
            action: function(callback) {
                // Kitten freezes in fear
                gsap.to($kittenSprite, {
                    scale: 0.95, // Slightly smaller to show fear
                    duration: 0.2,
                    ease: "power2.out"
                });
                
                // Fierce Dog emerges from behind bush
                $fierceDogSprite.css('display', 'block');
                gsap.fromTo($fierceDogSprite,
                    { autoAlpha: 0, y: "+=50px", scale: 0.8 },
                    { autoAlpha: 1, y: "0px", scale: 1, duration: 0.8, ease: "back.out(1.2)" }
                );
                
                // Kitten turns to face the fierce dog
                gsap.to($kittenSprite, {
                    scaleX: -1, // Turn to face left (towards fierce dog)
                    scale: 1, // Reset scale
                    duration: 0.3,
                    ease: "power2.inOut",
                    delay: 0.3,
                    onComplete: callback
                });
            }
        },
        { 
            text: "The kitten froze, its whole body stiff with fear. From behind a bush, a large, black-furred dog emerged. Its bristling fur, sharp eyes, and bared fangs made it look truly terrifying."
        },
        { text: "Kitten! You're not allowed to pass! This is my territory!", character: "Fierce Dog", sfx: fierceGrowlSound },
        { 
            text: "I… I just want to go home! I don't mean any trouble!", 
            character: "Kitten", 
            sfx: meowScaredSound,
            action: function(callback) {
                // Kitten steps back in terror
                gsap.to($kittenSprite, {
                    x: "+=30px", // Step back
                    scale: 0.9, // Shrink slightly in fear
                    duration: 0.4,
                    ease: "power1.out",
                    onComplete: callback
                });
            }
        },
        { 
            text: "Calm down! He's just passing through. He doesn't mean to invade your territory!", 
            character: "Fluffy Dog", 
            sfx: fluffyBarkSound,
            action: function(callback) {
                // Fluffy dog steps forward to shield the kitten
                gsap.to($fluffyDogSprite, {
                    x: "-=40px", // Move closer to fierce dog
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: callback
                });
            }
        },
        { 
            text: "Not that easy! My rule is: if you want to pass, you must defeat me in the Three-Gem Matching Challenge!", 
            character: "Fierce Dog", 
            sfx: fierceBarkSound,
            endScene: true
        }
    ];

    const imagesForThisScene = [
        'images/MeadowPath.png', 
        'images/Kitten.png', 
        'images/FluffyDog.png', 
        'images/FierceDog.png'
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 04 Intro is ready!");
            // Initial kitten visibility and shake is handled by the first dialogue action.
        }
    };

    initializeSceneFramework(sceneData);
});