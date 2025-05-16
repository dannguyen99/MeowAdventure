// js/scene02_minigame.js
$(document).ready(function() {
    const $kittenSprite = $('#kitten-sprite');
    const $squirrelSprite = $('#squirrel-sprite');
    const $hintArrow = $('#hint-arrow');
    const $acornsFoundCount = $('#acorns-found-count');
    const $hidingSpots = $('.hiding-spot'); // jQuery collection of all spots
    const $foundAcornImages = $('.found-acorn'); 


    const audioSelectors = {
        bgMusic: '#bg-music-scene2',
        click: '#click-sound',
        squirrelChatter: '#squirrel-chatter-sound',
        meowCurious: '#meow-curious-sound', // If kitten makes sounds during hunt
        acornFound: '#acorn-found-sound',
        rustleDecoy: '#rustle-decoy-sound'
    };
    const squirrelChatterSound = $(audioSelectors.squirrelChatter)[0];
    const acornFoundSound = $(audioSelectors.acornFound)[0];
    const rustleDecoySound = $(audioSelectors.rustleDecoy)[0];

    let acornsToFind = 3;
    let acornsFound = 0;
    let canClickSpots = false; // Control when player can click

    const acornPositions = { // Relative to their hiding spot for visual placement
        "1": { topOffset: '30%', leftOffset: '40%' }, // For acorn-1 in spot-bush1
        "2": { topOffset: '25%', leftOffset: '35%' }, // For acorn-2 in spot-rocks
        "3": { topOffset: '50%', leftOffset: '45%' }  // For acorn-3 in spot-treebase
    };

    // For hints - map acorn ID to the spot it's in and where arrow should point
    const hintData = [
        { acornId: "1", spotId: "#spot-bush1", arrowPos: { top: "50%", left: "55%" }, text: "I think one might be hidden near that big bush!" },
        { acornId: "2", spotId: "#spot-rocks", arrowPos: { top: "65%", left: "20%" }, text: "Check those rocks over there!" },
        { acornId: "3", spotId: "#spot-treebase", arrowPos: { top: "35%", left: "5%" }, text: "The base of that old tree looks suspicious..." }
    ];
    let currentHintIndex = 0;

    function showHint() {
        if (currentHintIndex < hintData.length) {
            const hint = hintData[currentHintIndex];
            // Position and show arrow
            $hintArrow.css({ top: hint.arrowPos.top, left: hint.arrowPos.left, transform: 'rotate(-45deg) scale(0.8)' }); // Example rotation
            gsap.to($hintArrow, { autoAlpha: 1, scale:1, duration: 0.5, delay:0.3 });

            // Update dialogue with squirrel's hint (optional, could be just arrow)
            // This would require a dialogue item in sceneDialogues for each hint
            // For simplicity now, let's assume dialogue is separate or handled by a global hint text area.
            console.log("Hinting for acorn in:", hint.spotId, "Squirrel says:", hint.text);
        }
    }

    const sceneDialogues = [
        {
            text: "Great! Let’s get started! I’ll help you look for clues.", character: "Squirrel", sfx: squirrelChatterSound,
            action: function(callback) {
                // Position and show Kitten and Squirrel
                gsap.to([$kittenSprite, $squirrelSprite], { autoAlpha: 1, duration: 0.5, display: 'block' });
                gsap.to('#acorn-ui-container', {autoAlpha:1, duration:0.3, delay:0.2});
                callback();
            }
        },
        {
            text: "See those bushes over there? An arrow will point the way!", // Simplified hint intro
            character: "Squirrel", sfx: squirrelChatterSound,
            action: function(callback) {
                showHint(); // Show first hint
                // Fade out kitten and squirrel to focus on game area
                gsap.to([$kittenSprite, $squirrelSprite], { autoAlpha: 0, duration: 0.8, delay: 1, onComplete: () => {
                    canClickSpots = true; // Enable clicking AFTER characters are gone
                    callback();
                }});
            }
        }
        // More dialogue items will be added dynamically after finding acorns or for success
    ];

    function handleSpotClick(event) {
        if (!canClickSpots) return;
        const $spot = $(event.currentTarget);

        if ($spot.hasClass('searched')) return; // Already searched this spot

        playGameSfx($(audioSelectors.click)[0]); // Play general click sound
        $spot.addClass('searched');
        gsap.to($hintArrow, {autoAlpha:0, duration:0.3}); // Hide arrow on click

        const acornId = $spot.data('acorn-id');

        if (acornId) { // Acorn found!
            canClickSpots = false; // Disable clicking while processing found acorn
            playGameSfx(acornFoundSound);
            acornsFound++;
            $acornsFoundCount.text(acornsFound);

            const $foundAcornImg = $('#acorn-' + acornId);
            const spotPos = $spot.position(); // Get position of the hiding spot
            const spotW = $spot.width();
            const spotH = $spot.height();

            // Position acorn within the spot based on pre-defined offsets or center
            let acornTop = spotPos.top + (parseFloat(acornPositions[acornId].topOffset) / 100 * spotH) - ($foundAcornImg.height()/2);
            let acornLeft = spotPos.left + (parseFloat(acornPositions[acornId].leftOffset) / 100 * spotW) - ($foundAcornImg.width()/2);
            $foundAcornImg.css({ top: acornTop + 'px', left: acornLeft + 'px', display:'block' });
            gsap.fromTo($foundAcornImg, {scale:0.5, autoAlpha:0}, {scale:1, autoAlpha:1, duration:0.5, ease:"back.out(1.7)"});

            if (acornsFound >= acornsToFind) {
                // All acorns found!
                gsap.delayedCall(1, allAcornsFound);
            } else {
                // Show next hint
                currentHintIndex++;
                gsap.delayedCall(1, () => {
                     showHint();
                     canClickSpots = true; // Re-enable clicking for next find
                });
            }
        } else { // Decoy spot
            playGameSfx(rustleDecoySound);
            // Briefly allow clicking again for other spots
             gsap.delayedCall(0.5, () => {
                if (acornsFound < acornsToFind) showHint(); // Re-show hint if they clicked wrong
             });
        }
    }

    function allAcornsFound() {
        canClickSpots = false; // Disable spot clicks
        gsap.to($hintArrow, {autoAlpha:0, duration:0.3});
        gsap.to('#acorn-ui-container', {y:"-=10", autoAlpha:0, duration:0.5, delay:0.2}); // Slight delay before UI hides

        // --- HIDE THE FOUND ACORN IMAGES ---
        gsap.to($foundAcornImages, { autoAlpha: 0, duration: 0.5, delay: 0.3, onComplete: () => {
            $foundAcornImages.css('display', 'none'); // Ensure they are fully hidden
        }});
        // --- END HIDE ---

        // Bring back Kitten and Squirrel (add a slightly longer delay to let acorns fade)
        gsap.to([$kittenSprite, $squirrelSprite], { autoAlpha: 1, duration: 0.8, delay: 0.6 });

        // Add success dialogue
        // Ensure currentDialogueItems is accessible here or passed if defined outside
        currentDialogueItems.push(
            { text: "You found them all! Thank you so much, little kitten!", character: "Squirrel", sfx: $(audioSelectors.squirrelChatter)[0], endPart: true }
        );
        // Adjust index to point to the dialogue *before* the newly added one,
        // so advanceDialogue() picks up the new one.
        currentDialogueIdx = currentDialogueItems.length - 2;

        // Call advanceDialogue from game-dialogue.js after a delay for visual sync
        gsap.delayedCall(1.0, () => { // Delay allows characters to fully appear before dialogue
             if (typeof advanceDialogue === 'function') {
                advanceDialogue();
            } else {
                console.error("advanceDialogue function not found. Ensure game-dialogue.js is loaded and correct.");
            }
        });
    }


    const imagesForThisScene = [
        'images/Lv1.jpg', 'images/Kitten.png', 'images/Squirrel.png', 'images/Chestnut.png',
        'images/UI/HintArrow.png' // Make sure you have this arrow image
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues, // Initial dialogues
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 02 Minigame is ready!");
            // Bind click events to hiding spots AFTER common setup
            $hidingSpots.on('click', handleSpotClick);
        }
    };

    initializeSceneFramework(sceneData);
});