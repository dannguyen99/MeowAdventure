
$(document).ready(function() {
    
    const $kittenSprite = $('#kitten-sprite');
    const $sceneBackground = $('#scene-background'); 

    
    const audioSelectorsForScene = {
        bgMusic: '#bg-music-scene1_part3', 
        click: '#click-sound',
        meowSad: '#meow-sad-sound' 
    };
    
    const meowSadSound = $(audioSelectorsForScene.meowSad)[0];

    
    const kittenConfusedFrames = [ 
      "images/Kitten.png"
    ];


    const sceneDialogues = [
        { text: "As unfamiliar streets unfolded before it, the butterfly disappeared into the sky." },
        {
            text: "The kitten stopped in confusion, looking around anxiously:",
            action: function(callback) {
                
                gsap.to($kittenSprite, { autoAlpha: 1, duration: 1.0, display: 'block' });

                
                
                animateGameSprite($kittenSprite, kittenConfusedFrames, 0.35, -1); 

                
                

                
                gsap.delayedCall(1.5, callback); 
            }
        },
        {
            text: "Meow… I’ve gone too far! I need to find my way home! But… I don’t know which way to go...",
            character: "Kitten",
            sfx: meowSadSound, 
            endScene: true 
        }
    ];

    const imagesForThisScene = [
        'images/ForestEdge1.png', 
        $kittenSprite.attr('src'), 
        ...kittenConfusedFrames
    ].filter(Boolean);

    
    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectorsForScene,
        onSceneReady: function() {
            console.log("Scene 01 Part 3 is ready!");
            
            
            
            
        }
    };

    
    if (typeof initializeSceneFramework === 'function') {
        initializeSceneFramework(sceneData);
    } else {
        console.error("initializeSceneFramework function not found.");
    }
});