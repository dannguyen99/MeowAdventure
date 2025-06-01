$(document).ready(function() {
    const $sceneContainer = $('#game-container');
    const $sceneBackground = $('#scene-background');
    const $kittenSprite = $('#kitten-sprite');
    const $fluffyDogSprite = $('#fluffy-dog-sprite');
    const $teddyBearSprite = $('#teddy-bear-sprite');
    // const $treeSprite = $('#tree-sprite'); // Not used

    const audioSelectors = {
        bgMusic: '#bg-music-scene6',
        click: '#click-sound',
        meowJoyful: '#meow-joyful-sound',
        dogHappyBark: '#dog-happy-bark-sound',
        dashing: '#dashing-sound',
        gift: '#gift-sound'
    };

    // Get actual audio elements
    const meowJoyfulSound = $(audioSelectors.meowJoyful)[0];
    const dogHappyBarkSound = $(audioSelectors.dogHappyBark)[0];
    const dashingSound = $(audioSelectors.dashing)[0];
    const giftSound = $(audioSelectors.gift)[0];

    const homeBg = 'images/Back1.png';
    const roomBg = 'images/BackRoom.png';

    // Initial positions (adjust as needed in CSS or here if dynamic)
    const kittenInitialPos = { left: "30%", bottom: "20%", opacity: 0 };
    const fluffyDogInitialPos = { left: "55%", bottom: "20%", opacity: 0 }; // Adjusted for spacing
    const teddyInitialPos = { opacity: 0, display: 'none', width: '8%', zIndex: 5, left: "0%", bottom: "0%"}; // Will be updated

    const kittenInsideRoomPos = { left: "50%", bottom: "25%", transform: "translateX(-50%)" };


    const sceneDialogues = [
        // Part 1: Arrival Home & Gift Idea
        {
            text: "I'm home! I can't believe I went through so much to get back here!",
            character: "Kitten",
            sfx: meowJoyfulSound,
            action: function(callback) {
                gsap.to($sceneBackground, { opacity: 1, duration: 0.5 });
                gsap.set($kittenSprite, kittenInitialPos);
                gsap.set($fluffyDogSprite, fluffyDogInitialPos);
                gsap.to([$kittenSprite, $fluffyDogSprite], { opacity: 1, display: 'block', duration: 0.5 });
                gsap.fromTo($kittenSprite, { y: 0 }, { y: -20, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.out", onComplete: callback });
            }
        },
        {
            text: "I'm so happy for you! You're finally safe!",
            character: "Fluffy Dog",
            sfx: dogHappyBarkSound,
            action: function(callback) {
                gsap.fromTo($fluffyDogSprite, { rotation: 0 }, { rotation: 5, duration: 0.15, yoyo: true, repeat: 3, ease: "power1.inOut", onComplete: callback });
            }
        },
        {
            text: "I want to give you a gift to show my gratitude!",
            character: "Kitten",
            action: function(callback) { callback(); }
        },
        {
            text: "Oh, really? But I didn't do anything that special!",
            character: "Fluffy Dog",
            action: function(callback) { callback(); }
        },
        {
            text: "No! Without you, I wouldn’t have been able to face that fierce dog or find my way home. I have to give you something really special!",
            character: "Kitten",
            action: function(callback) {
                playGameSfx(dashingSound);
                gsap.to($kittenSprite, { x: "-150%", opacity: 0, duration: 0.7, ease: "power1.in", onComplete: callback });
            }
        },
        // Part 2: The Search (Inside the House)
        {
            text: "It has to be something meaningful... But what?",
            character: "Kitten",
            action: function(callback) {
                gsap.to($sceneBackground, { opacity: 0, duration: 0.3, onComplete: () => {
                    $sceneBackground.attr('src', roomBg);
                    gsap.to($sceneBackground, { opacity: 1, duration: 0.3 });
                }});
                gsap.to($fluffyDogSprite, { opacity: 0, display: 'none', duration: 0.1 });
                gsap.set($kittenSprite, { ...kittenInsideRoomPos, opacity: 0, x: "0%" }); // Reset x from previous animation
                gsap.to($kittenSprite, { opacity: 1, display: 'block', duration: 0.5, delay: 0.3 });
                gsap.set($teddyBearSprite, { ...teddyInitialPos, left: "70%", bottom: "15%", opacity: 0.3 }); // Position teddy in "corner"

                // Simulate searching
                gsap.to($kittenSprite, { x: "-=50px", y: "+=10px", duration: 0.8, delay: 0.8, ease: "sine.inOut" });
                gsap.to($kittenSprite, { x: "+=70px", y: "-=5px", duration: 1.0, delay: 1.8, ease: "sine.inOut", onComplete: callback });
            }
        },
        {
            text: "Where’s my stuffed bear? I remember leaving it here... Or maybe under the sofa?",
            character: "Kitten",
            action: function(callback) {
                // Kitten moves towards where the bear is
                gsap.to($kittenSprite, { left: "65%", bottom: "20%", duration: 0.7, ease: "power1.inOut", onComplete: callback });
            }
        },
        {
            text: "Aha! There it is!",
            character: "Kitten",
            action: function(callback) {
                gsap.to($teddyBearSprite, { opacity: 1, display: 'block', duration: 0.3 });
                // Kitten "picks up" bear - bear will move with kitten in next step
                gsap.to($kittenSprite, { duration: 0.1, onComplete: callback }); // Short delay
            }
        },
        {
            text: "I’ve hugged this every night when I slept... But now, it will have a new owner!",
            character: "Kitten",
            action: function(callback) {
                playGameSfx(dashingSound);
                // Kitten dashes out, teddy bear moves with kitten
                // We'll make teddy bear follow kitten by animating it to the same destination
                const kittenExitPos = { x: "150%", opacity: 0 };
                gsap.to($kittenSprite, { ...kittenExitPos, duration: 0.7, ease: "power1.in" });
                gsap.to($teddyBearSprite, { x: "+=100%", opacity: 0, duration: 0.7, ease: "power1.in", onComplete: callback }); // Adjust x to match kitten's relative movement
            }
        },
        // Part 3: The Gift Exchange & Farewell
        {
            text: "Here! I want you to have this! It’s my most treasured thing!",
            character: "Kitten",
            action: function(callback) {
                gsap.to($sceneBackground, { opacity: 0, duration: 0.3, onComplete: () => {
                    $sceneBackground.attr('src', homeBg);
                    gsap.to($sceneBackground, { opacity: 1, duration: 0.3 });
                }});
                gsap.set($fluffyDogSprite, { ...fluffyDogInitialPos, opacity: 0, display: 'block' });
                gsap.to($fluffyDogSprite, { opacity: 1, duration: 0.5, delay: 0.3 });

                gsap.set($kittenSprite, { ...kittenInitialPos, x: "0%", opacity: 0, display: 'block' }); // Reset kitten's position
                gsap.to($kittenSprite, { opacity: 1, duration: 0.5, delay: 0.3 });

                gsap.set($teddyBearSprite, { // Position teddy with kitten
                    left: $kittenSprite.css('left'), 
                    bottom: `calc(${$kittenSprite.css('bottom')} + 20px)`, // Slightly above kitten's paws
                    opacity: 0, 
                    display: 'block',
                    x: "0%" // Reset x
                }); 
                gsap.to($teddyBearSprite, { opacity: 1, duration: 0.1, delay: 0.5 });

                // Animate teddy bear to Fluffy Dog
                gsap.to($teddyBearSprite, {
                    left: $fluffyDogSprite.css('left'),
                    bottom: `calc(${$fluffyDogSprite.css('bottom')} + 25px)`, // Position with Fluffy
                    duration: 0.8,
                    delay: 0.8,
                    ease: "power1.out",
                    onComplete: callback
                });
            }
        },
        {
            text: "Oh... really? But this is your favourite toy!",
            character: "Fluffy Dog",
            action: function(callback) {
                // Teddy bear is now "with" Fluffy Dog, no specific animation needed here for the bear itself
                callback();
            }
        },
        {
            text: "That’s exactly why I want to give it to you! You helped me get home safely, and I want you to have something to remember me by!",
            character: "Kitten",
            action: function(callback) { callback(); }
        },
        {
            text: "Thank you, Kitten! I’ll take great care of it!",
            character: "Fluffy Dog",
            sfx: giftSound,
            action: function(callback) {
                // Fluffy Dog "hugs" bear - subtle animation
                gsap.fromTo($fluffyDogSprite, { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" });
                gsap.fromTo($teddyBearSprite, { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut", onComplete: callback });
            }
        },
        {
            text: "If you ever visit again, bring it with you so I know it’s you!",
            character: "Kitten",
            action: function(callback) { callback(); }
        },
        {
            text: "Of course! I’ll come back to visit you!",
            character: "Fluffy Dog",
            action: function(callback) {
                // Fluffy Dog leaves with the bear
                const fluffyExitPos = { x: "150%", opacity: 0 };
                gsap.to($fluffyDogSprite, { ...fluffyExitPos, duration: 1.0, ease: "power1.in" });
                gsap.to($teddyBearSprite, { x: "+=150%", opacity: 0, duration: 1.0, ease: "power1.in", onComplete: callback }); // Bear moves with Fluffy
            }
        },
        // Part 4: Final Narration
        {
            text: "Though the challenging journey had come to an end, a new friendship had begun—a true, heartfelt friendship that would last forever.",
            character: "Narrator",
            action: function(callback) { callback(); }
        },
        {
            text: "The adventure ended in joy, and the Kitten had learned the valuable lessons of courage, friendship, and gratitude.",
            character: "Narrator",
            action: function(callback) { callback(); },
            endScene: true // This will trigger the game-dialogue system to show the next scene button
        }
    ];

    const imagesForThisScene = [
        homeBg,
        roomBg,
        'images/Kitten.png',
        'images/FluffyDog.png',
        'images/Teddy.png'
    ];

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors, // Pass the map of selectors
        onSceneReady: function() {
            console.log("Scene 06 Homecoming is ready!");
            $sceneBackground.attr('src', homeBg).css('opacity', 0);
            $kittenSprite.css({...kittenInitialPos, display: 'block'});
            $fluffyDogSprite.css({...fluffyDogInitialPos, display: 'block'});
            $teddyBearSprite.css({...teddyInitialPos, display: 'block'}); // Keep it ready but invisible
            // $treeSprite.css({opacity:0, display:'none'}); // Not used
        }
    };

    initializeSceneFramework(sceneData);
});