
$(document).ready(function() {
    const $kittenSprite = $('#kitten-sprite');
    const $squirrelSprite = $('#squirrel-sprite');

    const audioSelectors = {
        bgMusic: '#bg-music-scene2',
        click: '#click-sound',
        squirrelChatter: '#squirrel-chatter-sound',
        meowGrateful: '#meow-grateful-sound'
    };
    
    const squirrelChatterSound = $(audioSelectors.squirrelChatter)[0];
    const meowGratefulSound = $(audioSelectors.meowGrateful)[0];

    
    const kittenIdleFrames = ["images/Kitten Animation 1/Kitten 1.png", ];
    

    const sceneDialogues = [
        {
            text: "You did great! I knew you could do it!", character: "Squirrel", sfx: squirrelChatterSound,
            action: function(callback) {
                
                gsap.to([$kittenSprite, $squirrelSprite], { autoAlpha: 1, duration: 0.7, display: 'block' });

                
                
                
                gsap.delayedCall(0.5, callback); 
            }
        },
        { text: "As promised, I'll show you the way out of this part of the forest. Follow me!", character: "Squirrel", sfx: squirrelChatterSound,
            action: function(callback) {
                
                
                gsap.to($squirrelSprite, {
                    x: "+=80px", 
                    duration: 0.8,
                    ease: "power1.inOut",
                    onComplete: () => {
                        
                        
                    }
                });
                gsap.delayedCall(1.0, callback); 
            }
        },
        { text: "Thank you so much, Squirrel!", character: "Kitten", sfx: meowGratefulSound,
            action: function(callback){
                
                
                callback(); 
            },
            endScene: true 
        }
    ];

    const imagesForThisScene = [
        'images/Lv1.jpg',
        'images/Kitten.png', 
        'images/Squirrel.png' 
    ].filter(Boolean);


    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 02 Outro is ready!");
            
        }
    };

    initializeSceneFramework(sceneData);
});