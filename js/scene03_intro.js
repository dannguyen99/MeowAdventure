
$(document).ready(function() {
    const $kittenSprite = $('#kitten-sprite');
    const $frogSprite = $('#frog-sprite');

    const audioSelectors = {
        bgMusic: '#bg-music-scene3',
        click: '#click-sound',
        meowWorried: '#meow-worried-sound',
        frogCroak: '#frog-croak-sound',
        waterSplash: '#water-splash-sound'
    };
    
    const meowWorriedSound = $(audioSelectors.meowWorried)[0];
    const frogCroakSound = $(audioSelectors.frogCroak)[0];
    const waterSplashSound = $(audioSelectors.waterSplash)[0];


    const sceneDialogues = [
        {
            text: "After leaving the forest, the kitten stepped into an open clearing. In front of it lay a wide, rushing stream...",
            action: function(callback) {
                gsap.to($kittenSprite, { autoAlpha: 1, duration: 0.8, display: 'block' });
                
                
                gsap.delayedCall(0.8, callback);
            }
        },
        { text: "How am I supposed to get across? I don’t know how to swim! What if I slip while jumping?", character: "Kitten", sfx: meowWorriedSound },
        { text: "Should I turn back to the forest? But if I go back… I’ll be completely lost!", character: "Kitten", sfx: meowWorriedSound },
        {
            text: "Suddenly, a voice called out from a nearby rock.",
            action: function(callback) {
                playGameSfx(waterSplashSound); 
                $frogSprite.css('display', 'block');

                
                

                gsap.to($frogSprite,
                    {
                        autoAlpha: 1, 
                        onComplete: callback
                    }
                );
            }
        },
        { text: "Meow meow, you look troubled!", character: "Frog", sfx: frogCroakSound }, 
        { text: "Oh… who are you?", character: "Kitten", sfx: meowWorriedSound },
        { text: "I’m Frog! The guardian of this stream! And who might you be? Why do you look so down?", character: "Frog", sfx: frogCroakSound },
        { text: "I’m just a little kitten. I’m trying to find my way home, but this stream is too strong… I don’t know how to cross it.", character: "Kitten", sfx: meowWorriedSound },
        { text: "Ah, I see! You want to cross the stream, don’t you?", character: "Frog", sfx: frogCroakSound },
        { text: "Yes! Do you know a way to help me?", character: "Kitten", sfx: meowWorriedSound },
        { text: "Hmm… There is a way… but it won’t be easy!", character: "Frog", sfx: frogCroakSound },
        { text: "If you want to cross, you must prove you’re smart! If you can solve my riddle, I’ll show you a safe way across!", character: "Frog", sfx: frogCroakSound },
        { text: "A riddle? Why a riddle?", character: "Kitten", sfx: meowWorriedSound },
        { text: "Because that’s my rule! Only those with intelligence deserve my help to cross the stream! If you’re smart, you won’t get swept away!", character: "Frog", sfx: frogCroakSound },
        { text: "Alright, I’ll try! As long as I can reach the other side.", character: "Kitten", sfx: meowWorriedSound,
            endPart: true 
        }
    ];

    const imagesForThisScene = [
        'images/Lv2.png',
        'images/Kitten.png', 
        'images/Frog.png'   
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 03 Intro is ready!");
            
        }
    };

    initializeSceneFramework(sceneData);
});