
$(document).ready(function () {
    const $kittenSprite = $('#kitten-sprite');
    const $squirrelSprite = $('#squirrel-sprite');
    const $hintArrow = $('#hint-arrow');
    const $acornsFoundCount = $('#acorns-found-count');
    const $hidingSpots = $('.hiding-spot'); 
    const $foundAcornImages = $('.found-acorn');


    const audioSelectors = {
        bgMusic: '#bg-music-scene2',
        click: '#click-sound',
        squirrelChatter: '#squirrel-chatter-sound',
        meowCurious: '#meow-curious-sound', 
        acornFound: '#acorn-found-sound',
        rustleDecoy: '#rustle-decoy-sound'
    };
    const squirrelChatterSound = $(audioSelectors.squirrelChatter)[0];
    const acornFoundSound = $(audioSelectors.acornFound)[0];
    const rustleDecoySound = $(audioSelectors.rustleDecoy)[0];

    let acornsToFind = 3;
    let acornsFound = 0;
    let canClickSpots = false; 

    const acornPositions = { 
        "1": { topOffset: '30%', leftOffset: '40%' }, 
        "2": { topOffset: '25%', leftOffset: '35%' }, 
        "3": { topOffset: '50%', leftOffset: '45%' }  
    };

    const hintData = [
        { acornId: "1", spotId: "#spot-bush1", arrowPos: { top: "50%", left: "55%" }, text: "I think one might be hidden near that big bush!" },
        { acornId: "2", spotId: "#spot-rocks", arrowPos: { top: "65%", left: "20%" }, text: "Check those rocks over there!" },
        { acornId: "3", spotId: "#spot-treebase", arrowPos: { top: "35%", left: "5%" }, text: "The base of that old tree looks suspicious..." }
    ];
    let currentHintIndex = 0;

    function showHint(immediate = false) { 
        if (currentHintIndex < hintData.length && acornsFound < acornsToFind) { 
            const hint = hintData[currentHintIndex];
            
            gsap.killTweensOf($hintArrow); 

            $hintArrow.css({
                top: hint.arrowPos.top,
                left: hint.arrowPos.left,
                
            });

            
            
            let animDelay = immediate ? 0 : 0.3;
            let animDuration = immediate ? 0.2 : 0.5;

            gsap.fromTo($hintArrow,
                { autoAlpha: 0, scale: 0.7, rotation: 0 }, 
                {
                    autoAlpha: 1,
                    scale: 1,
                    rotation: 150, 
                    duration: animDuration,
                    delay: animDelay,
                    ease: "back.out(1.7)",
                    onStart: () => $hintArrow.css('display', 'block') 
                }
            );
        } else {
            gsap.to($hintArrow, { autoAlpha: 0, duration: 0.3, onComplete: () => $hintArrow.css('display', 'none') }); 
        }
    }

    const sceneDialogues = [
        {
            text: "Great! Let’s get started! I’ll help you look for clues.", character: "Squirrel", sfx: squirrelChatterSound,
            action: function (callback) {
                
                gsap.to([$kittenSprite, $squirrelSprite], { autoAlpha: 1, duration: 0.5, display: 'block' });
                gsap.to('#acorn-ui-container', { autoAlpha: 1, duration: 0.3, delay: 0.2 });
                callback();
            }
        },
        {
            text: "See those bushes over there? An arrow will point the way!",
            character: "Squirrel", sfx: $(audioSelectors.squirrelChatter)[0],
            action: function (callback) {
                showHint(); 
                gsap.to([$kittenSprite, $squirrelSprite], {
                    autoAlpha: 0, duration: 0.8, delay: 1, onComplete: () => {
                        canClickSpots = true;
                        callback();
                    }
                });
            }
        }
        
    ];

    function handleSpotClick(event) {
        if (!canClickSpots) return;
        const $spot = $(event.currentTarget);
        if ($spot.hasClass('searched')) return;

        playGameSfx($(audioSelectors.click)[0]);
        $spot.addClass('searched');

        
        
        gsap.to($hintArrow, { autoAlpha: 0, duration: 0.2, scale: 0.7, onComplete: () => $hintArrow.css('display', 'none') });

        const acornId = $spot.data('acorn-id');

        if (acornId) {
            canClickSpots = false;
            playGameSfx($(audioSelectors.acornFound)[0]);
            acornsFound++;
            $acornsFoundCount.text(acornsFound);

            const $foundAcornImg = $('#acorn-' + acornId);
            
            const spotPos = $spot.position(), spotW = $spot.width(), spotH = $spot.height();
            let acornTop = spotPos.top + (parseFloat(acornPositions[acornId].topOffset) / 100 * spotH) - ($foundAcornImg.height() / 2);
            let acornLeft = spotPos.left + (parseFloat(acornPositions[acornId].leftOffset) / 100 * spotW) - ($foundAcornImg.width() / 2);
            $foundAcornImg.css({ top: acornTop + 'px', left: acornLeft + 'px', display: 'block' });
            gsap.fromTo($foundAcornImg, { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.7)" });


            if (acornsFound >= acornsToFind) {
                gsap.delayedCall(1, allAcornsFound);
            } else {
                currentHintIndex++;
                gsap.delayedCall(0.8, () => { 
                    showHint(); 
                    canClickSpots = true;
                });
            }
        } else { 
            playGameSfx($(audioSelectors.rustleDecoy)[0]);
            gsap.delayedCall(0.5, () => { 
                if (acornsFound < acornsToFind) { 
                    showHint(true); 
                }
            });
        }
    }

    function allAcornsFound() {
        canClickSpots = false; 
        gsap.to($hintArrow, { autoAlpha: 0, duration: 0.3 });
        gsap.to('#acorn-ui-container', { y: "-=10", autoAlpha: 0, duration: 0.5, delay: 0.2 }); 

        
        gsap.to($foundAcornImages, {
            autoAlpha: 0, duration: 0.5, delay: 0.3, onComplete: () => {
                $foundAcornImages.css('display', 'none'); 
            }
        });
        

        
        gsap.to([$kittenSprite, $squirrelSprite], { autoAlpha: 1, duration: 0.8, delay: 0.6 });

        
        if (window.gameDialogueSystem && typeof window.gameDialogueSystem.addDialogueItems === 'function') {
            const successDialogue = [
                { text: "You found them all! Thank you so much, little kitten!", character: "Squirrel", sfx: squirrelChatterSound, endPart: true }
            ];
            window.gameDialogueSystem.addDialogueItems(successDialogue);

            
            
            const newDialogueStartIndex = window.gameDialogueSystem.items.length - successDialogue.length;
            
            
            gsap.delayedCall(1.0, () => { 
                if (typeof window.gameDialogueSystem.setCurrentIndexAndShow === 'function') {
                    window.gameDialogueSystem.setCurrentIndexAndShow(newDialogueStartIndex);
                } else if (typeof window.gameDialogueSystem.showNext === 'function') {
                    
                    
                    window.gameDialogueSystem.currentIndex = newDialogueStartIndex;
                    window.gameDialogueSystem.showNext();
                } else {
                    console.error("Dialogue system methods (setCurrentIndexAndShow or showNext) not found.");
                }
            });

        } else {
            console.error("gameDialogueSystem not properly set up for adding dialogues.");
        }
    }


    const imagesForThisScene = [
        'images/Lv1.jpg', 'images/Kitten.png', 'images/Squirrel.png', 'images/Chestnut.png',
        'images/Arrow.png'
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues, 
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function () {
            console.log("Scene 02 Minigame is ready!");
            
            $hidingSpots.on('click', handleSpotClick);
        }
    };

    initializeSceneFramework(sceneData);
});