
$(document).ready(function() {
    
    const $kittenSprite = $('#kitten-sprite');
    const $frogSprite = $('#frog-sprite');

    
    const audioSelectors = {
        bgMusic: '#bg-music-scene3',
        click: '#click-sound',
        meowRelieved: '#meow-relieved-sound',
        frogCroak: '#frog-croak-sound'
        
    };
    
    const meowRelievedSound = $(audioSelectors.meowRelieved)[0];
    const frogCroakSound = $(audioSelectors.frogCroak)[0];

    const defaultKittenImage = 'images/Kitten.png';
    const kittenJumpFrames = [
        'images/Jumping Kitten/Jumping Kitten 1.png', 
        'images/Jumping Kitten/Jumping Kitten 2.png', 
        'images/Jumping Kitten/Jumping Kitten 3.png', 
        'images/Jumping Kitten/Jumping Kitten 4.png'  
    ];


    
    const sceneDialogues = [
        {
            text: "The frog led the way across the rushing stream...", 
            action: function(actionCallback) {
                
                
                
                
                $kittenSprite.attr('src', defaultKittenImage); 
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
                const startLeftPercent = 70; 
                const endLeftPercent = 20;   
                const numJumps = 4;          
                const jumpHeightPx = 60;     
                const totalCrossingDuration = 3.5; 
                const jumpingSpriteScale = 1.5; 

                
                const kittenFinalBottomPercent = 20; 

                const horizontalChangePerJump = (startLeftPercent - endLeftPercent) / numJumps;
                const durationPerJumpSegment = totalCrossingDuration / (numJumps * 2); 

                
                const $dialogueBoxContainer = $('#dialogue-box-container');

                const tl = gsap.timeline({
                    delay: 0.3, 
                    onStart: function() {
                        
                        gsap.to($dialogueBoxContainer, { autoAlpha: 0, duration: 0.3 });
                    },
                    onComplete: function() {
                        
                        $kittenSprite.attr('src', defaultKittenImage);
                        gsap.set($kittenSprite, { 
                            scaleX: 1,   
                            scaleY: -1,   
                            scale: 1,
                        });
                        
                        
                        gsap.to($dialogueBoxContainer, { 
                            autoAlpha: 1, 
                            duration: 0.3,
                            onComplete: actionCallback 
                        });
                    }
                });

                let currentTargetLeft = startLeftPercent;

                for (let i = 0; i < numJumps; i++) {
                    
                    tl.set($kittenSprite, { 
                        attr: { src: kittenJumpFrames[0] },
                        scaleX: -jumpingSpriteScale, 
                        scaleY: -jumpingSpriteScale   
                    })
                    .to($kittenSprite, {
                        y: -jumpHeightPx, 
                        duration: durationPerJumpSegment * 0.6, 
                        ease: "power2.out", 
                        onComplete: () => {
                            $kittenSprite.attr('src', kittenJumpFrames[1]); 
                            
                        }
                    });

                    
                    currentTargetLeft -= horizontalChangePerJump;

                    
                    if (i < numJumps - 1) {
                        
                        tl.to($kittenSprite, {
                            left: currentTargetLeft + "%",
                            y: 0, 
                            duration: durationPerJumpSegment * 1.4, 
                            ease: "power2.in", 
                            onStart: () => {
                                $kittenSprite.attr('src', kittenJumpFrames[2]); 
                            },
                            onComplete: () => {
                                $kittenSprite.attr('src', kittenJumpFrames[3]); 
                                
                            }
                        });
                    } else {
                        
                        tl.to($kittenSprite, {
                            left: currentTargetLeft + "%",          
                            bottom: kittenFinalBottomPercent + "%", 
                            y: 0,                                   
                            duration: durationPerJumpSegment * 1.4, 
                            ease: "power2.in",
                            onStart: () => {
                                $kittenSprite.attr('src', kittenJumpFrames[2]); 
                            },
                            onComplete: () => {
                                $kittenSprite.attr('src', kittenJumpFrames[3]); 
                                
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
            endScene: true 
        }
    ];

    
    const imagesForThisScene = [
        'images/Lv2.png',
        defaultKittenImage, 
        'images/Frog.png',
        ...kittenJumpFrames     
    ].filter(Boolean);


    
    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 03 Crossing (Dialogue Version) is ready!");
            
            
        }
    };

    
    if (typeof initializeSceneFramework === 'function') {
        initializeSceneFramework(sceneData);
    } else {
        console.error("initializeSceneFramework function not found in scene03_crossing_dialogue.js.");
    }
});