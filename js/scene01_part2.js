
$(document).ready(function() {
    const $gameContainer = $('#game-container'); 
    const gameContainerWidth = $gameContainer.width(); 
    
    const $sceneBackground = $('#scene-background');
    const $kittenSprite = $('#kitten-sprite');
    const $butterflySprite = $('#butterfly-sprite');

    
    const audioSelectorsForScene = {
        bgMusic: '#bg-music-scene1',
        click: '#click-sound',
        meow: '#meow-sound',
        flutter: '#butterfly-flutter-sound',
        run: '#run-sound'
    };
    
    const meowSound = $(audioSelectorsForScene.meow)[0];
    const flutterSound = $(audioSelectorsForScene.flutter)[0];
    const runSound = $(audioSelectorsForScene.run)[0];


    const butterflyFrames = [
        "images/Butterfly Animation/Butterfly 1.png",
        "images/Butterfly Animation/Butterfly 2.png",
        "images/Butterfly Animation/Butterfly 3.png"
    ];
    const kittenRunFrames = ['images/Kitten Animation 2/Kitten Animation 1.png',
        'images/Kitten Animation 2/Kitten Animation 2.png',
        'images/Kitten Animation 2/Kitten Animation 3.png',
        'images/Kitten Animation 2/Kitten Animation 4.png',
        'images/Kitten Animation 2/Kitten Animation 5.png',
        'images/Kitten Animation 2/Kitten Animation 6.png',
        'images/Kitten Animation 2/Kitten Animation 7.png',
        'images/Kitten Animation 2/Kitten Animation 8.png'
    ];
    

     const sceneDialogues = [
        { text: "Oh! What a beautiful butterfly! I have to chase it! I’ve never seen such a vibrant butterfly before!", character: "Kitten", sfx: meowSound },
        {
            text: "Unaware of what was happening, the kitten eagerly ran after the butterfly, unknowingly straying far from its beloved home.",
            action: function(callback) {
                sceneClickEnabled = false;
                $sceneBackground.addClass('background-zoomed-focused');

                playGameSfx(flutterSound, true);
                if ($butterflySprite.data('animationTween')) $butterflySprite.data('animationTween').kill();
                animateGameSprite($butterflySprite, butterflyFrames, 0.1);

                gsap.set($kittenSprite, { scale: 2 }); 

                if ($kittenSprite.data('animationTween')) $kittenSprite.data('animationTween').kill();
                animateGameSprite($kittenSprite, kittenRunFrames, 0.07);
                playGameSfx(runSound, true);

                let tl = gsap.timeline({
                    onComplete: () => {
                        stopGameSfx(flutterSound);
                        stopGameSfx(runSound);
                        gsap.set($kittenSprite, { scale: 1 }); 
                        callback();
                    }
                });

                

                
                
                
                
                gsap.set($butterflySprite, { x: gameContainerWidth - 200 }); 
                gsap.set($kittenSprite, { x: gameContainerWidth }); 

                
                const targetXButterfly = -gameContainerWidth; 
                const targetXKitten = -gameContainerWidth + 200;     

                
                

                const verticalVariance = 30;
                const chaseDuration = 6.5; 
                

                tl.add("startChase")
                    
                    

                    .add("mainChase") 
                    
                    .to($butterflySprite, {
                        x: targetXButterfly,
                        y: `random(-${verticalVariance}, ${verticalVariance})`,
                        duration: chaseDuration,
                        ease: "none" 
                    }, "mainChase")

                    
                    
                    .to($kittenSprite, {
                        x: targetXKitten,
                        y: `random(-${verticalVariance}, ${verticalVariance})`,
                        duration: chaseDuration, 
                        ease: "none"
                    }, "mainChase") 

                    
                    
                    
                    
                    .set([$butterflySprite, $kittenSprite], { autoAlpha: 0 }, `+=${chaseDuration}`); 

            },
            endPart: true
        }
    ];

    const imagesForThisScene = [
        'images/Back1.png',
        'images/Kitten.png',
        ...butterflyFrames,
        ...kittenRunFrames
    ].filter(Boolean);

    
    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectorsForScene,
        onSceneReady: function() {
            console.log("Scene 01 Part 2 is ready!");
            gsap.set([$kittenSprite, $butterflySprite], { autoAlpha: 1, display:'block', scale: 1 });
        }
    };
    
    if (typeof initializeSceneFramework === 'function') {
        initializeSceneFramework(sceneData);
    } else {
        console.error("initializeSceneFramework function not found. Ensure game-main.js is loaded.");
    }
});