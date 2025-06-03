// js/scene04_challenge.js
$(document).ready(function() {
    const $fierceDogSprite = $('#fierce-dog-sprite');
    const $kittenSprite = $('#kitten-sprite');
    const $fluffyDogSprite = $('#fluffy-dog-sprite');
    const $strengthBarFill = $('#strength-bar-fill');
    const $strengthUiContainer = $('#fierce-dog-strength-ui');
    const $gemGridContainer = $('#gem-grid-container');

    const MAX_DOG_STRENGTH = 15;
    let currentDogStrength = MAX_DOG_STRENGTH;

    const audioSelectors = {
        bgMusic: '#bg-music-scene4-challenge',
        click: '#click-sound',
        gemSwap: '#gem-swap-sound',
        gemMatch: '#gem-match-sound',
        gemNoMatch: '#gem-no-match-sound',
        gemFall: '#gem-fall-sound',
        dogWeaken: '#dog-weaken-sound',
        kittenWin: '#kitten-win-sound',
        meowDetermined: '#meow-determined-sound',
        fluffyCheer: '#fluffy-dog-cheer-sound',
        fierceFrustrated: '#fierce-dog-frustrated-sound'
    };

    const meowDeterminedSound = $(audioSelectors.meowDetermined)[0];
    const fluffyCheerSound = $(audioSelectors.fluffyCheer)[0];
    const fierceFrustratedSound = $(audioSelectors.fierceFrustrated)[0];
    const dogWeakenSound = $(audioSelectors.dogWeaken)[0];
    const kittenWinSound = $(audioSelectors.kittenWin)[0];

    const sceneDialogues = [
        { text: "Welcome to the Gem Crystal Challenge! Match 3 or more gems in a row to weaken my resolve!", character: "Fierce Dog", sfx: fierceFrustratedSound },
        { text: "It's a bigger puzzle this time! You need to make strategic matches to win.", character: "Fluffy Dog", sfx: fluffyCheerSound },
        { text: "I can do this! I just need to think carefully about each move.", character: "Kitten", sfx: meowDeterminedSound },
        { text: "Good luck! You'll need it!", character: "Fierce Dog", sfx: fierceFrustratedSound,
            action: function(callback) {
                // Show strength UI
                if ($strengthUiContainer.length) {
                    $strengthUiContainer.css('display', 'block'); // Set display before animating
                    gsap.to($strengthUiContainer, {autoAlpha: 1, y: 0, duration: 0.5}); // Changed from 'from' to 'to'
                }

                // Show the gem grid container (placeholders)
                if ($gemGridContainer.length) {
                    // Set display to 'grid' (as defined in gem-match.css) before animating opacity
                    $gemGridContainer.css('display', 'grid'); 
                    gsap.to($gemGridContainer, { autoAlpha: 1, duration: 0.5, delay: 0.2, onComplete: function() {
                        // Initialize the gem match logic AFTER the grid is visible
                        initializeGemMatch('#gem-grid-container', handleGemMatches, handlePlayerMove);
                        
                        if (window.gameDialogueSystem && typeof $dialogueBoxElement !== 'undefined' && $dialogueBoxElement && $dialogueBoxElement.length && $dialogueBoxElement.css('opacity') !== '0') {
                             gsap.to($dialogueBoxElement, {autoAlpha:0, duration:0.3});
                        }
                        callback(); 
                    }});
                } else {
                    initializeGemMatch('#gem-grid-container', handleGemMatches, handlePlayerMove);
                    callback();
                }
            }
        }
    ];

    function updateStrengthBar() {
        const percentage = (currentDogStrength / MAX_DOG_STRENGTH) * 100;
        gsap.to($strengthBarFill, { width: percentage + "%", duration: 0.3 });
    }

    function handleGemMatches(numMatchSets) {
        console.log(`Player made ${numMatchSets} match sets!`);
        
        // More strategic scoring - bigger matches are worth more
        let damage = numMatchSets;
        if (numMatchSets >= 2) damage += 1; // Bonus for multiple matches
        if (numMatchSets >= 3) damage += 1; // Extra bonus for cascades
        
        currentDogStrength -= damage;
        if (currentDogStrength < 0) currentDogStrength = 0;
        updateStrengthBar();
        
        if (typeof playGameSfx === 'function' && dogWeakenSound) playGameSfx(dogWeakenSound);

        // Dog reaction animation
        const intensity = Math.min(damage * 2, 8);
        gsap.fromTo($fierceDogSprite, 
            {x: -intensity}, 
            {x: intensity, duration: 0.06, repeat: 5, yoyo: true, ease: "sine.inOut"}
        );

        if (currentDogStrength <= 0) {
            winGame();
        } else {
            // Encourage player based on progress
            const progressPercent = (MAX_DOG_STRENGTH - currentDogStrength) / MAX_DOG_STRENGTH;
            if (progressPercent >= 0.5 && progressPercent < 0.6 && Math.random() < 0.4) {
                showTemporaryDialogue("Fluffy Dog: You're halfway there! Keep going!", fluffyCheerSound);
            } else if (progressPercent >= 0.8 && Math.random() < 0.3) {
                showTemporaryDialogue("Fierce Dog: Impossible! How are you so good at this?", fierceFrustratedSound);
            }
        }
    }

    function handlePlayerMove(wasMatch) {
        console.log("Player made a move. Match result:", wasMatch);
        
        // Optional: Add move counter or other game mechanics here
        if (!wasMatch && Math.random() < 0.1) { // Occasional encouragement on failed moves
            showTemporaryDialogue("Fluffy Dog: Think about which gems to match next!", fluffyCheerSound);
        }
    }

    function showTemporaryDialogue(text, sfx) {
        const $tempDialogue = $('<div class="temp-ingame-dialogue"></div>').html(text);
        $('#game-container').append($tempDialogue);
        gsap.fromTo($tempDialogue, 
            {autoAlpha:0, y:20}, 
            {autoAlpha:1, y:0, duration:0.4, onComplete:()=>{
                if(sfx && typeof playGameSfx === 'function') playGameSfx(sfx);
                gsap.to($tempDialogue, {autoAlpha:0, y:-10, duration:0.4, delay:2.5, onComplete:()=>$tempDialogue.remove()});
            }}
        );
    }

    window.showTemporaryDialogue = showTemporaryDialogue;

    function winGame() {
        console.log("Kitten WINS the 5x5 Gem Challenge!");
        if (typeof playGameSfx === 'function' && kittenWinSound) playGameSfx(kittenWinSound);

        if (typeof window.disableGemMatchGame === 'function') {
            window.disableGemMatchGame();
        }

        gsap.to(['#gem-grid-container', '#fierce-dog-strength-ui'], {
            autoAlpha: 0,
            scale: 0.8,
            duration: 0.6,
            delay: 0.3,
            ease: "power2.in"
        });

        if (window.gameDialogueSystem) {
            if ($dialogueBoxElement && $dialogueBoxElement.css('opacity') === '0') {
                 gsap.to($dialogueBoxElement, {autoAlpha:1, duration:0.3, delay: 0.8});
            }

            window.gameDialogueSystem.addDialogueItems([
                { text: "Incredible! You mastered the 5x5 crystal challenge! I admit defeat!", character: "Fierce Dog", sfx: fierceFrustratedSound },
                { text: "I did it! That was challenging but so satisfying!", character: "Kitten", sfx: meowDeterminedSound },
                { text: "You're truly skilled! I'm proud to call you my friend!", character: "Fluffy Dog", sfx: fluffyCheerSound },
                { text: "Fine... you've earned safe passage. But don't expect it to be this easy next time!", character: "Fierce Dog", sfx: fierceFrustratedSound,
                    action: function(cb) {
                        gsap.to($fierceDogSprite, { 
                            autoAlpha: 0, x: "-=100px", y: "+=20px", 
                            duration: 1.0, ease: "power2.in", onComplete: cb 
                        });
                    }
                },
                { text: "Let's continue our adventure! I feel more confident now!", character: "Kitten", sfx: meowDeterminedSound, endScene: true }
            ]);
            
            gsap.delayedCall(1.0, () => {
                 window.gameDialogueSystem.advance();
            });
        }
    }

    const imagesForThisScene = [
        'images/Gem_background.jpeg', 'images/Kitten.png', 'images/FluffyDog.png', 'images/FierceDog.png',
        'images/Gem_Box.png',
        ...(window.GEM_TYPES || []).map(gemFile => `images/Gems/${gemFile}`)
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 04 Challenge (5x5) is ready!");
            if ($fierceDogSprite.length && $kittenSprite.length && $fluffyDogSprite.length) {
                gsap.set([$fierceDogSprite, $kittenSprite, $fluffyDogSprite], { autoAlpha: 1, display: 'block' });
            }
            // No need to hide $gemGridContainer here anymore, CSS handles it.
            
            if ($strengthUiContainer.length) {
                // Ensure strength UI is hidden by default if it's revealed by dialogue
                // and not already hidden by its own CSS.
                $strengthUiContainer.css({ display: 'none', opacity: 0});
            }
            updateStrengthBar();
        }
    };

    initializeSceneFramework(sceneData);
});