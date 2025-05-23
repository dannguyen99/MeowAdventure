// js/scene04_challenge.js
$(document).ready(function() {
    const $fierceDogSprite = $('#fierce-dog-sprite');
    const $kittenSprite = $('#kitten-sprite');
    const $fluffyDogSprite = $('#fluffy-dog-sprite');
    const $strengthBarFill = $('#strength-bar-fill');
    const $strengthUiContainer = $('#fierce-dog-strength-ui');

    const MAX_DOG_STRENGTH = 10; // Example: 10 matches to win
    let currentDogStrength = MAX_DOG_STRENGTH;

    const audioSelectors = { /* ... include all needed from HTML ... */
        bgMusic: '#bg-music-scene4-challenge',
        click: '#click-sound',
        gemSwap: '#gem-swap-sound', // These specific sounds are handled by gem-match-logic.js
        gemMatch: '#gem-match-sound',
        gemNoMatch: '#gem-no-match-sound',
        gemFall: '#gem-fall-sound',
        dogWeaken: '#dog-weaken-sound',
        kittenWin: '#kitten-win-sound',
        meowDetermined: '#meow-determined-sound',
        fluffyCheer: '#fluffy-dog-cheer-sound',
        fierceFrustrated: '#fierce-dog-frustrated-sound'
    };
    // Get audio elements for scene-specific dialogue/events
    const meowDeterminedSound = $(audioSelectors.meowDetermined)[0];
    const fluffyCheerSound = $(audioSelectors.fluffyCheer)[0];
    const fierceFrustratedSound = $(audioSelectors.fierceFrustrated)[0];
    const dogWeakenSound = $(audioSelectors.dogWeaken)[0];
    const kittenWinSound = $(audioSelectors.kittenWin)[0];


    const sceneDialogues = [
        { text: "It’s a puzzle game! You have to match three identical gems to weaken him. If you win, he’ll let us go.", character: "Fluffy Dog", sfx: fluffyCheerSound /* or a neutral bark */ },
        { text: "But I’ve never played this before… Can I really win?", character: "Kitten", sfx: meowDeterminedSound /* was meow-scared, now more determined */},
        { text: "Don’t worry! You’re smart! Just focus, and you’ll be fine!", character: "Fluffy Dog", sfx: fluffyCheerSound },
        { text: "Well? Do you dare accept the challenge?", character: "Fierce Dog", sfx: fierceFrustratedSound /* or a bark */},
        { text: "Alright! I’ll play!", character: "Kitten", sfx: meowDeterminedSound },
        { text: "Good! Let’s begin!", character: "Fierce Dog", sfx: fierceFrustratedSound /* or a growl */ ,
            action: function(callback) {
                // Start the gem matching game
                $strengthUiContainer.css('display', 'block'); // Show strength bar
                gsap.from($strengthUiContainer, {autoAlpha:0, y:-20, duration:0.5});
                initializeGemMatch('#gem-grid-container', handleGemMatches, handlePlayerMove);
                // No callback needed here, game is now player-controlled
                // Dialogue system will be paused until game ends.
                // We might need to hide the dialogue box if it's still visible.
                if (window.gameDialogueSystem && $dialogueBoxElement && $dialogueBoxElement.css('opacity') !== '0') {
                     gsap.to($dialogueBoxElement, {autoAlpha:0, duration:0.3});
                }
            }
        }
    ];

    function updateStrengthBar() {
        const percentage = (currentDogStrength / MAX_DOG_STRENGTH) * 100;
        gsap.to($strengthBarFill, { width: percentage + "%", duration: 0.3 });
    }

    function handleGemMatches(numMatches) { // Called by gem-match-logic.js
        console.log(`Matched ${numMatches} sets of gems!`);
        currentDogStrength -= numMatches; // Or some other scoring
        if (currentDogStrength < 0) currentDogStrength = 0;
        updateStrengthBar();
        if (typeof playGameSfx === 'function' && dogWeakenSound) playGameSfx(dogWeakenSound);

        // Optional: Fierce dog sprite reacts (e.g., slight shake, expression change)
        gsap.fromTo($fierceDogSprite, {x:-3},{x:3, duration:0.08, repeat:3, yoyo:true, ease:"sine.inOut"});


        if (currentDogStrength <= 0) {
            winGame();
        } else {
            // Optional: Mid-game encouragement/taunts based on strength
            if (currentDogStrength < MAX_DOG_STRENGTH / 2 && Math.random() < 0.3) { // If less than half strength and random chance
                // Briefly show a dialogue pop-up, not using main system for this
                showTemporaryDialogue("Fluffy Dog: Keep going, Kitten! You’re almost there!", fluffyCheerSound);
            }
        }
    }

    function handlePlayerMove(wasMatch) { // Called by gem-match-logic.js
        console.log("Player made a move. Was match:", wasMatch);
        // Could update a moves counter here if you add one
    }

    function showTemporaryDialogue(text, sfx) {
        const $tempDialogue = $('<div class="temp-ingame-dialogue"></div>').html(text);
        $('#game-container').append($tempDialogue); // Style .temp-ingame-dialogue in CSS
        gsap.fromTo($tempDialogue, {autoAlpha:0, y:20}, {autoAlpha:1, y:0, duration:0.4, onComplete:()=>{
            if(sfx && typeof playGameSfx === 'function') playGameSfx(sfx);
            gsap.to($tempDialogue, {autoAlpha:0, y:-10, duration:0.4, delay:2, onComplete:()=>$tempDialogue.remove()});
        }});
    }


    function winGame() {
        console.log("Kitten WINS!");
        if (typeof playGameSfx === 'function' && kittenWinSound) playGameSfx(kittenWinSound);
        // Disable gem grid interaction from gem-match-logic.js (e.g., by setting a flag there)
        isSwapping = true; // Prevent further gem clicks in gem-match-logic.js

        // Add winning dialogues to the main dialogue system
        if (window.gameDialogueSystem) {
            window.gameDialogueSystem.addDialogueItems([
                { text: "No… Impossible! How are you winning?!", character: "Fierce Dog", sfx: fierceFrustratedSound },
                { text: "I did it!", character: "Kitten", sfx: meowDeterminedSound /* or happy meow */ },
                { text: "Hmph… You’re good. Fine, go! But don’t come back here again!", character: "Fierce Dog", sfx: fierceFrustratedSound,
                    action: function(cb) {
                        gsap.to($fierceDogSprite, { autoAlpha: 0, x: "-=50px", duration: 0.8, ease: "power1.in", onComplete: cb });
                    }
                },
                // This will trigger the "Victory!" button defined in HTML
                { text: "You did great! I knew you could do it!", character: "Fluffy Dog", sfx: fluffyCheerSound, endScene: true }
            ]);
            // Start showing these new dialogues
            window.gameDialogueSystem.advance(); // Call advance to show the first of the new items
        }
    }


    const imagesForThisScene = [ /* ... images for background, characters, and ALL GEMS + SLOTS ... */
        'images/Gem_background.jpeg', 'images/Kitten.png', 'images/FluffyDog.png', 'images/FierceDog.png',
        'images/EmptySlot.png', 'images/GemBoard.png', // If used
        ...GEM_TYPES.map(gemFile => `images/gems/${gemFile}`) // Assuming gems are in images/gems/
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 04 Challenge is ready!");
            // Position characters (initial state)
            gsap.set([$fierceDogSprite, $kittenSprite, $fluffyDogSprite], { autoAlpha: 1, display: 'block' });
            updateStrengthBar(); // Initialize bar display
        }
    };

    initializeSceneFramework(sceneData);
});