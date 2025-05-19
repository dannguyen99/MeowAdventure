// js/scene02_minigame.js
$(document).ready(function () {
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

    const hintData = [
        { acornId: "1", spotId: "#spot-bush1", arrowPos: { top: "50%", left: "55%" }, text: "I think one might be hidden near that big bush!" },
        { acornId: "2", spotId: "#spot-rocks", arrowPos: { top: "65%", left: "20%" }, text: "Check those rocks over there!" },
        { acornId: "3", spotId: "#spot-treebase", arrowPos: { top: "35%", left: "5%" }, text: "The base of that old tree looks suspicious..." }
    ];
    let currentHintIndex = 0;

    function showHint(immediate = false) { // Added 'immediate' flag
        if (currentHintIndex < hintData.length && acornsFound < acornsToFind) { // Only show if more acorns to find
            const hint = hintData[currentHintIndex];
            // Ensure arrow is ready to be shown (kill previous animations if any)
            gsap.killTweensOf($hintArrow); // Stop any ongoing animations on the arrow

            $hintArrow.css({
                top: hint.arrowPos.top,
                left: hint.arrowPos.left,
                // transform: 'rotate(-45deg) scale(0.8)' // Set initial transform if needed before animation
            });

            // Animation to show the arrow
            // If 'immediate' is true, skip the delay and use a faster animation
            let animDelay = immediate ? 0 : 0.3;
            let animDuration = immediate ? 0.2 : 0.5;

            gsap.fromTo($hintArrow,
                { autoAlpha: 0, scale: 0.7, rotation: 0 }, // Start small, rotated, and invisible
                {
                    autoAlpha: 1,
                    scale: 1,
                    rotation: 150, // Settle to this rotation
                    duration: animDuration,
                    delay: animDelay,
                    ease: "back.out(1.7)",
                    onStart: () => $hintArrow.css('display', 'block') // Ensure display is block
                }
            );
        } else {
            gsap.to($hintArrow, { autoAlpha: 0, duration: 0.3, onComplete: () => $hintArrow.css('display', 'none') }); // Ensure it's hidden if no more hints
        }
    }

    const sceneDialogues = [
        {
            text: "Great! Let’s get started! I’ll help you look for clues.", character: "Squirrel", sfx: squirrelChatterSound,
            action: function (callback) {
                // Position and show Kitten and Squirrel
                gsap.to([$kittenSprite, $squirrelSprite], { autoAlpha: 1, duration: 0.5, display: 'block' });
                gsap.to('#acorn-ui-container', { autoAlpha: 1, duration: 0.3, delay: 0.2 });
                callback();
            }
        },
        {
            text: "See those bushes over there? An arrow will point the way!",
            character: "Squirrel", sfx: $(audioSelectors.squirrelChatter)[0],
            action: function (callback) {
                showHint(); // Show first hint (will have its default delay)
                gsap.to([$kittenSprite, $squirrelSprite], {
                    autoAlpha: 0, duration: 0.8, delay: 1, onComplete: () => {
                        canClickSpots = true;
                        callback();
                    }
                });
            }
        }
        // More dialogue items will be added dynamically after finding acorns or for success
    ];

    function handleSpotClick(event) {
        if (!canClickSpots) return;
        const $spot = $(event.currentTarget);
        if ($spot.hasClass('searched')) return;

        playGameSfx($(audioSelectors.click)[0]);
        $spot.addClass('searched');

        // Hide the current arrow immediately when a spot is clicked.
        // The next call to showHint() will bring it back if needed.
        gsap.to($hintArrow, { autoAlpha: 0, duration: 0.2, scale: 0.7, onComplete: () => $hintArrow.css('display', 'none') });

        const acornId = $spot.data('acorn-id');

        if (acornId) {
            canClickSpots = false;
            playGameSfx($(audioSelectors.acornFound)[0]);
            acornsFound++;
            $acornsFoundCount.text(acornsFound);

            const $foundAcornImg = $('#acorn-' + acornId);
            // ... (positioning and showing found acorn image - GSAP animation for it)
            const spotPos = $spot.position(), spotW = $spot.width(), spotH = $spot.height();
            let acornTop = spotPos.top + (parseFloat(acornPositions[acornId].topOffset) / 100 * spotH) - ($foundAcornImg.height() / 2);
            let acornLeft = spotPos.left + (parseFloat(acornPositions[acornId].leftOffset) / 100 * spotW) - ($foundAcornImg.width() / 2);
            $foundAcornImg.css({ top: acornTop + 'px', left: acornLeft + 'px', display: 'block' });
            gsap.fromTo($foundAcornImg, { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.7)" });


            if (acornsFound >= acornsToFind) {
                gsap.delayedCall(1, allAcornsFound);
            } else {
                currentHintIndex++;
                gsap.delayedCall(0.8, () => { // Slightly shorter delay before next hint
                    showHint(); // Show next hint (will have its own animation delay)
                    canClickSpots = true;
                });
            }
        } else { // Decoy spot
            playGameSfx($(audioSelectors.rustleDecoy)[0]);
            gsap.delayedCall(0.5, () => { // After decoy sound
                if (acornsFound < acornsToFind) { // Only re-show hint if game not over
                    showHint(true); // Re-show the *same* current hint, but faster
                }
            });
        }
    }

    function allAcornsFound() {
        canClickSpots = false; // Disable spot clicks
        gsap.to($hintArrow, { autoAlpha: 0, duration: 0.3 });
        gsap.to('#acorn-ui-container', { y: "-=10", autoAlpha: 0, duration: 0.5, delay: 0.2 }); // Slight delay before UI hides

        // --- HIDE THE FOUND ACORN IMAGES ---
        gsap.to($foundAcornImages, {
            autoAlpha: 0, duration: 0.5, delay: 0.3, onComplete: () => {
                $foundAcornImages.css('display', 'none'); // Ensure they are fully hidden
            }
        });
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
        'images/Arrow.png'
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues, // Initial dialogues
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function () {
            console.log("Scene 02 Minigame is ready!");
            // Bind click events to hiding spots AFTER common setup
            $hidingSpots.on('click', handleSpotClick);
        }
    };

    initializeSceneFramework(sceneData);
});