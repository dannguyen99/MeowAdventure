// js/scene02_outro.js
$(document).ready(function() {
    const $kittenSprite = $('#kitten-sprite');
    const $squirrelSprite = $('#squirrel-sprite');

    const audioSelectors = {
        bgMusic: '#bg-music-scene2',
        click: '#click-sound',
        squirrelChatter: '#squirrel-chatter-sound',
        meowGrateful: '#meow-grateful-sound'
    };
    // Get actual audio elements
    const squirrelChatterSound = $(audioSelectors.squirrelChatter)[0];
    const meowGratefulSound = $(audioSelectors.meowGrateful)[0];

    // If you want idle animations
    const kittenIdleFrames = ["images/Kitten Animation 1/Kitten 1.png", /* ... */];
    // const squirrelIdleFrames = [ ... ]; // If you have them

    const sceneDialogues = [
        {
            text: "You did great! I knew you could do it!", character: "Squirrel", sfx: squirrelChatterSound,
            action: function(callback) {
                // Kitten and Squirrel should be positioned by CSS. Fade them in.
                gsap.to([$kittenSprite, $squirrelSprite], { autoAlpha: 1, duration: 0.7, display: 'block' });

                // Optional: Start idle animations if you have them
                // animateGameSprite($kittenSprite, kittenIdleFrames, 0.3);
                // animateGameSprite($squirrelSprite, squirrelIdleFrames, 0.25);
                gsap.delayedCall(0.5, callback); // Short pause
            }
        },
        { text: "As promised, I'll show you the way out of this part of the forest. Follow me!", character: "Squirrel", sfx: squirrelChatterSound,
            action: function(callback) {
                // Optional: Squirrel turns or gestures towards an exit
                // Example: Squirrel quickly hops towards one side
                gsap.to($squirrelSprite, {
                    x: "+=80px", // Move to the right
                    duration: 0.8,
                    ease: "power1.inOut",
                    onComplete: () => {
                        // Optional: Squirrel faces a new direction if sprite sheet allows or use scaleX
                        // $squirrelSprite.css('transform', 'translate(-50%, -50%) scaleX(1)');
                    }
                });
                gsap.delayedCall(1.0, callback); // Wait for squirrel's small move
            }
        },
        { text: "Thank you so much, Squirrel!", character: "Kitten", sfx: meowGratefulSound,
            action: function(callback){
                // Optional: Kitten nods or looks towards squirrel
                // gsap.to($kittenSprite, {rotation:5, yoyo:true, repeat:1, duration:0.3});
                callback(); // Immediately proceed to show button after text
            },
            endScene: true // Flag to show "Follow Squirrel" button
        }
    ];

    const imagesForThisScene = [
        'images/Lv1.jpg',
        'images/Kitten.png', // Or first frame of kittenIdleFrames
        'images/Squirrel.png' // Or first frame of squirrelIdleFrames
    ].filter(Boolean);


    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 02 Outro is ready!");
            // Any final setup after common init and first dialogue
        }
    };

    initializeSceneFramework(sceneData);
});