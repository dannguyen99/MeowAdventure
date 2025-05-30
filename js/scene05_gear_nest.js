// js/scene05_gear_nest.js
$(document).ready(function() {
    const $nestSceneBackground = $('#nest-scene-background');
    const $kittenSprite = $('#kitten-sprite');
    const $fluffyDogSprite = $('#fluffy-dog-sprite');
    const $starlingSprite = $('#starling-sprite');
    const $gearSprite = $('#gear-sprite');

    // Riddle UI Elements
    const $riddleContainer = $('#riddle-container');
    const $riddleTextDisplay = $('#riddle-text-display');
    const $answerChoicesContainer = $('#answer-choices-container');
    const $dialogueText = $('#dialogue-text'); // For temporary feedback

    const audioSelectors = {
        bgMusic: '#bg-music-scene5',
        click: '#click-sound',
        meowCurious: '#meow-curious-sound',
        meowThinking: '#meow-thinking-sound',
        meowExcited: '#meow-excited-sound',
        fluffySupport: '#fluffy-dog-support-sound',
        starlingChirp: '#starling-chirp-sound',
        gearDrop: '#gear-drop-sound',
        correctAnswer: '#correct-answer-sound',
        wrongAnswer: '#wrong-answer-sound',
        success: '#success-sound'
    };

    const meowCuriousSound = $(audioSelectors.meowCurious)[0];
    const meowThinkingSound = $(audioSelectors.meowThinking)[0];
    const meowExcitedSound = $(audioSelectors.meowExcited)[0];
    const fluffySupportSound = $(audioSelectors.fluffySupport)[0];
    const starlingChirpSound = $(audioSelectors.starlingChirp)[0];
    const gearDropSound = $(audioSelectors.gearDrop)[0];
    const correctAnswerSound = $(audioSelectors.correctAnswer)[0];
    const wrongAnswerSound = $(audioSelectors.wrongAnswer)[0];
    const successSound = $(audioSelectors.success)[0];

    // Riddle Data
    const starlingRiddle = {
        question: "I can fly without wings, and I can cry without eyes. What am I?",
        options: [
            { text: "A Kite", correct: false },
            { text: "A Cloud", correct: true },
            { text: "A Ghost", correct: false },
            { text: "Smoke", correct: false }
        ],
        correctAnswerText: "A cloud!" // Kitten's exclamation
    };
    let canAnswerRiddle = false;
    let onRiddleSolvedCallback = null; // To continue dialogue after solving

    function showRiddleUI() {
        $riddleTextDisplay.text(starlingRiddle.question);
        $answerChoicesContainer.empty();

        starlingRiddle.options.forEach(option => {
            const $button = $('<button></button>').text(option.text).data('correct', option.correct);
            $button.on('click', handleAnswerClick);
            $answerChoicesContainer.append($button);
        });
        gsap.to($riddleContainer, { autoAlpha: 1, duration: 0.5, display: 'block', delay: 0.3 });
        // canAnswerRiddle will be set to true by the dialogue item that follows riddle presentation
    }

    function handleAnswerClick(event) {
        if (!canAnswerRiddle) return;
        canAnswerRiddle = false; // Prevent multiple clicks

        const $button = $(event.currentTarget);
        const isCorrect = $button.data('correct');
        if (typeof playGameSfx === 'function') { playGameSfx($(audioSelectors.click)[0]); }


        if (isCorrect) {
            if (typeof playGameSfx === 'function') { playGameSfx(correctAnswerSound); }
            $button.addClass('correct');
            $('#answer-choices-container button').addClass('disabled').prop('disabled', true);

            gsap.to($riddleContainer, { autoAlpha: 0, duration: 0.3, delay: 0.8, onComplete: () => {
                $riddleContainer.css('display', 'none');
                if (onRiddleSolvedCallback) {
                    onRiddleSolvedCallback(); // This will advance the main dialogue
                    onRiddleSolvedCallback = null;
                }
            }});
        } else { // Incorrect Answer
            if (typeof playGameSfx === 'function') { playGameSfx(wrongAnswerSound); }
            $button.addClass('incorrect disabled').prop('disabled', true); // Disable only this wrong button

            // Show feedback directly in dialogue box (optional, or use a game message system)
            const tempFeedbackText = "Starling: Chirp! That's not it. Think harder!";
            if ($dialogueText && $dialogueText.length) {
                const originalDialogue = $dialogueText.html(); // Save original to restore
                $dialogueText.html(tempFeedbackText); // No strong tag needed if character is in text
                if (starlingChirpSound && typeof playGameSfx === 'function') { playGameSfx(starlingChirpSound); }
                gsap.fromTo($dialogueText, {autoAlpha:0, y:10},{autoAlpha:1, y:0, duration:0.3});
                gsap.delayedCall(2, () => { // Restore original dialogue after 2s
                    $dialogueText.html(originalDialogue);
                     gsap.fromTo($dialogueText, {autoAlpha:0, y:10},{autoAlpha:1, y:0, duration:0.3});
                });
            }
            gsap.delayedCall(1.5, () => {
                canAnswerRiddle = true; // Allow trying other options for the same question
            });
        }
    }

    const sceneDialogues = [
        {
            text: "Looking up, they spotted a small nest on a high tree branch. A tiny starling was perched there, singing a cheerful tune.",
            character: "Narrator",
            action: function(cb) {
                gsap.timeline({ onComplete: cb })
                    .to([$kittenSprite, $fluffyDogSprite], { autoAlpha: 1, duration: 0.5, stagger: 0.2 })
                    .to($starlingSprite, { autoAlpha: 1, y: "-=10px", duration: 0.5, ease: "power2.out" }, "-=0.3")
                    .to($starlingSprite, { rotation: 5, yoyo: true, repeat: 3, duration: 0.3, ease: "sine.inOut" }, "-=0.5");
            }
        },
        {
            text: "Hello, Starling! We're looking for a gear. Have you seen it?",
            character: "Kitten",
            sfx: meowCuriousSound,
            action: function(cb) {
                gsap.timeline({ onComplete: cb })
                    .to($kittenSprite, { y: "-=10px", duration: 0.2, ease: "power2.out" })
                    .to($kittenSprite, { y: "+=10px", duration: 0.3, ease: "bounce.out" });
            }
        },
        {
            text: "I have it! But I'll only give it to someone who can solve my riddle!",
            character: "Starling",
            sfx: starlingChirpSound,
            action: function(cb) {
                gsap.timeline({ onComplete: cb })
                    .to($starlingSprite, { scale: 1.1, duration: 0.2, ease: "power2.out" })
                    .to($starlingSprite, { rotation: -10, duration: 0.2 })
                    .to($starlingSprite, { rotation: 0, scale: 1.0, duration: 0.3, ease: "bounce.out" });
            }
        },
        {
            text: "I'm not good at riddles… You do it!",
            character: "Fluffy Dog",
            sfx: fluffySupportSound,
            action: function(cb) {
                const kittenX = $kittenSprite.position().left;
                const dogOriginalX = $fluffyDogSprite.data('originalX') || $fluffyDogSprite.position().left;
                if (!$fluffyDogSprite.data('originalX')) $fluffyDogSprite.data('originalX', dogOriginalX);

                gsap.timeline({ onComplete: cb })
                    .to($fluffyDogSprite, { x: kittenX - dogOriginalX - $fluffyDogSprite.width()/2 + $kittenSprite.width()/2 , duration: 0.3, ease: "power1.inOut"})
                    .to($fluffyDogSprite, { y: "-=5px", yoyo: true, repeat: 1, duration: 0.2 })
                    .to($fluffyDogSprite, { x: 0, duration: 0.3, ease: "power1.inOut"}); // Relative x:0 to return to original spot in its flow
            }
        },
        { // Starling presents the riddle
            text: "I can fly without wings, and I can cry without eyes. What am I?",
            character: "Starling",
            sfx: starlingChirpSound,
            action: function(cb) {
                showRiddleUI();
                gsap.timeline({ onComplete: cb }) // Starling animation while presenting
                    .to($starlingSprite, { y: "-=15px", scaleY: 1.2, duration: 0.3, ease: "power2.out" })
                    .to($starlingSprite, { y: "0px", scaleY: 1.0, duration: 0.4, ease: "bounce.out" });
            }
        },
        { // Kitten thinks, enables answering
            text: "Hmm… let me think about that...",
            character: "Kitten",
            sfx: meowThinkingSound,
            action: function(cb) {
                onRiddleSolvedCallback = cb; // Store callback to be called when riddle is solved
                canAnswerRiddle = true;      // Allow clicking on answers
                // Kitten 'thinking' animation
                gsap.timeline() // Don't pass cb here, it's handled by onRiddleSolvedCallback
                    .to($kittenSprite, { rotation: -5, duration: 0.3 })
                    .to($kittenSprite, { rotation: 5, duration: 0.3 })
                    .to($kittenSprite, { rotation: 0, duration: 0.3 });
                // Dialogue pauses here until onRiddleSolvedCallback is called
            }
        },
        // This dialogue is now triggered AFTER the riddle is solved correctly
        {
            text: "A cloud!", // Kitten exclaims the correct answer (text can be dynamic if needed)
            character: "Kitten",
            sfx: meowExcitedSound,
            action: function(cb) {
                gsap.timeline({ onComplete: cb })
                    .to($kittenSprite, { y: "-=20px", scale: 1.1, duration: 0.3, ease: "back.out(1.7)" })
                    .to($kittenSprite, { y: "0px", scale: 1.0, duration: 0.2 });
            }
        },
        {
            text: "Correct! Here, take your gear!",
            character: "Starling",
            sfx: successSound,
            action: function(cb) {
                if (typeof playGameSfx === 'function') { playGameSfx(gearDropSound); }
                const starlingPos = $starlingSprite.position();
                const kittenPos = $kittenSprite.position();

                // Adjust for potential parent offset if sprites are not direct children of #animation-layer
                const animLayerOffset = $('#animation-layer').offset();
                const starlingOffset = $starlingSprite.offset();
                const kittenOffset = $kittenSprite.offset();

                const gearStartLeft = (starlingOffset.left - animLayerOffset.left) + ($starlingSprite.width() / 2) - ($gearSprite.width() / 2);
                const gearStartTop = (starlingOffset.top - animLayerOffset.top) + $starlingSprite.height();

                const gearEndLeft = (kittenOffset.left - animLayerOffset.left) + ($kittenSprite.width() / 2) - ($gearSprite.width() / 2);
                const gearEndTop = (kittenOffset.top - animLayerOffset.top) - $gearSprite.height() / 2;


                gsap.set($gearSprite, {
                    left: gearStartLeft,
                    top: gearStartTop,
                    autoAlpha: 1,
                    scale: 0.5
                });

                gsap.timeline({ onComplete: cb })
                    .to($starlingSprite, { rotation: 15, yoyo: true, repeat: 1, duration: 0.3, ease: "power1.inOut" })
                    .to($gearSprite, {
                        left: gearEndLeft,
                        top: gearEndTop,
                        scale: 1,
                        rotation: 360,
                        duration: 1.2,
                        ease: "power1.in"
                    }, "-=0.2")
                    .to($gearSprite, { scale: 1.2, duration: 0.1, ease: "power2.out" })
                    .to($gearSprite, { scale: 1.0, duration: 0.2 })
                    .to($kittenSprite, { y: "-=5px", yoyo: true, repeat: 1, duration: 0.2, ease: "power1.out" }, "-=0.3");
            }
        },
        {
            text: "You’re amazing! Just one more to go!",
            character: "Fluffy Dog",
            sfx: fluffySupportSound,
            action: function(cb) {
                gsap.timeline({ onComplete: cb })
                    .to($fluffyDogSprite, { y: "-=15px", duration: 0.2, ease: "power2.out" })
                    .to($fluffyDogSprite, { y: "0px", duration: 0.3, ease: "bounce.out" })
                    .to($fluffyDogSprite, { rotation: 5, yoyo: true, repeat: 3, duration: 0.15 });
            },
            endScene: true
        }
    ];

    const imagesForThisScene = [
        'images/Lv4_TheStarling’sNest.png',
        'images/Kitten.png',
        'images/FluffyDog.png',
        'images/Starling.png',
        'images/Gear.png'
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 05 Starling's Nest is ready!");
            gsap.set($('#scene-background'), { autoAlpha: 0 });
            gsap.set($nestSceneBackground, { autoAlpha: 1 });

            gsap.set([$kittenSprite, $fluffyDogSprite, $starlingSprite, $gearSprite, $riddleContainer], {
                autoAlpha: 0,
                display: 'block' // Set to block for GSAP to manage, riddle container display none initially
            });
            gsap.set($riddleContainer, {display: 'none'}); // Explicitly none
        }
    };

    initializeSceneFramework(sceneData);
});