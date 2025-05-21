// js/scene03_riddle.js
$(document).ready(function() {
    const $kittenSprite = $('#kitten-sprite');
    const $frogSprite = $('#frog-sprite');
    const $riddleContainer = $('#riddle-container');
    const $riddleTextDisplay = $('#riddle-text-display');
    const $answerChoicesContainer = $('#answer-choices-container');
    const $dialogueText = $('#dialogue-text'); // Add this line

    const audioSelectors = {
        bgMusic: '#bg-music-scene3',
        click: '#click-sound',
        meowThinking: '#meow-thinking-sound',
        frogCroak: '#frog-croak-sound',
        correctAnswer: '#correct-answer-sound',
        wrongAnswer: '#wrong-answer-sound'
    };
    // Get actual audio elements
    const meowThinkingSound = $(audioSelectors.meowThinking)[0];
    const frogCroakSound = $(audioSelectors.frogCroak)[0];
    const correctAnswerSound = $(audioSelectors.correctAnswer)[0];
    const wrongAnswerSound = $(audioSelectors.wrongAnswer)[0];

     const riddles = [
        {
            question: "Question 1: I am shaped like a ball and can fly in the air. What am I?",
            options: [
                { text: "Hot air balloon", correct: true },
                { text: "Airplane", correct: false },
                { text: "Ball", correct: false },
                { text: "Sun", correct: false }
            ]
        },
        {
            question: "Question 2: What always goes up and never goes down?",
            options: [
                { text: "Human", correct: false },
                { text: "Age", correct: true },
                { text: "Slide", correct: false },
                { text: "River", correct: false }
            ]
        },
        {
            question: "Question 3: I have many eyes but cannot see. What am I?",
            options: [
                { text: "Pineapple", correct: true },
                { text: "Apple", correct: false },
                { text: "Banana", correct: false },
                { text: "Orange", correct: false }
            ]
        }
    ];
    let currentRiddleIndex = 0; // Index for the riddles array
    let canAnswerRiddle = false;

    const sceneDialogues = [
        {
            text: "Good! Now, listen carefully!", character: "Frog", sfx: frogCroakSound,
            action: function(callback) {
                gsap.to([$kittenSprite, $frogSprite], { autoAlpha: 1, duration: 0.5, display: 'block' });
                callback();
            }
        },
        {
            text: "Here’s your first riddle:", // Updated to reflect first riddle
            character: "Frog", sfx: frogCroakSound,
            action: function(callback) {
                showRiddleUI(); // This will now show riddles[currentRiddleIndex]
                callback();
            }
        },
        {
            text: "Hmm… What could it be?", character: "Kitten", sfx: meowThinkingSound,
            action: function(callback){
                canAnswerRiddle = true;
                // No automatic callback, player clicks answer
            }
        }
    ];

    function showRiddleUI() {
        if (currentRiddleIndex >= riddles.length) { // Should not happen if logic is correct
            console.error("Tried to show riddle beyond available count.");
            return;
        }
        const currentRiddleData = riddles[currentRiddleIndex];
        $riddleTextDisplay.text(currentRiddleData.question);
        $answerChoicesContainer.empty();

        currentRiddleData.options.forEach(option => {
            const $button = $('<button></button>').text(option.text).data('correct', option.correct);
            $button.on('click', handleAnswerClick);
            $answerChoicesContainer.append($button);
        });
        gsap.to($riddleContainer, { autoAlpha: 1, duration: 0.5, display: 'block', delay:0.3 });
        canAnswerRiddle = false; // Disable answering until kitten "thinks" or explicitly enabled
                                 // The "Hmm... What could it be?" dialogue sets this to true
    }

    function handleAnswerClick(event) {
        if (!canAnswerRiddle) return;
        canAnswerRiddle = false;

        const $button = $(event.currentTarget);
        const isCorrect = $button.data('correct');
        playGameSfx($(audioSelectors.click)[0]);

        if (isCorrect) {
            playGameSfx(correctAnswerSound);
            $button.css('background-color', '#a5d6a7');
            $('#answer-choices-container button').addClass('disabled').prop('disabled', true); // Disable all for this question

            currentRiddleIndex++; // Move to next question

            if (currentRiddleIndex < riddles.length) {
                // There's another question
                gsap.to($riddleContainer, {autoAlpha:0, duration:0.3, delay: 0.8, onComplete: () => {
                    $riddleContainer.css('display', 'none'); // Hide old riddle before showing new one
                    gsap.delayedCall(0.5, () => {
                        showRiddleUI(); // Show the next riddle
                        // The "Hmm… What could it be?" dialogue action in sceneDialogues should set canAnswerRiddle = true
                        // For now, let's re-enable it after a slight delay if the above doesn't cover it.
                        // It's better if the dialogue system itself handles enabling interaction for the next step.
                        // The current setup for "Hmm... what could it be?" sets canAnswerRiddle = true.
                        // When showRiddleUI is called, it populates new buttons.
                        // The dialogue "Hmm... what could it be?" is still the current one in gameDialogueSystem.
                        // We need to ensure canAnswerRiddle is true for the *new* riddle.
                        // The original "Hmm... what could it be?" action sets canAnswerRiddle = true.
                        // showRiddleUI itself sets canAnswerRiddle = false initially, then the dialogue action sets it true.
                        // This might be a bit convoluted.
                        // For now, explicitly setting it true for the next riddle after it's shown.
                        gsap.delayedCall(0.8, () => { canAnswerRiddle = true; });
                    });
                }});
            } else {
                // All riddles answered correctly!
                gsap.to($riddleContainer, {autoAlpha:0, duration:0.3, delay: 0.8, onComplete: () => {
                    $riddleContainer.css('display', 'none');
                    // Use the global dialogue system to add and play success dialogues
                    if (window.gameDialogueSystem && typeof window.gameDialogueSystem.addDialogueItems === 'function') {
                        const successDialogues = [
                            { text: "Hooray! You’re really smart! You got them all right!", character: "Frog", sfx: frogCroakSound },
                            { text: "So you’ll help me cross now?", character: "Kitten", sfx: meowThinkingSound },
                            { text: "Of course! Follow me, but step carefully!", character: "Frog", sfx: frogCroakSound, endScene: true }
                        ];
                        window.gameDialogueSystem.addDialogueItems(successDialogues);

                        // Set the dialogue system's current index to the first of the newly added dialogues.
                        // The new items are at the end of the gameDialogueSystem.items array.
                        window.gameDialogueSystem.currentIndex = window.gameDialogueSystem.items.length - successDialogues.length;

                        // Now, tell the dialogue system to show this "next" (newly current) dialogue.
                        if (typeof window.gameDialogueSystem.showNext === 'function') {
                            window.gameDialogueSystem.showNext();
                        } else { console.error("gameDialogueSystem.showNext() not found."); }

                    } else { console.error("gameDialogueSystem not properly set up for adding dialogues."); }
                }});
            }
        } else { // Incorrect Answer
            playGameSfx(wrongAnswerSound);
            $button.addClass('disabled').prop('disabled', true); // Disable only this wrong button

            // Show feedback directly in dialogue box
            const tempFeedbackText = "Hmm, not quite! That's not it, try again!";
            if ($dialogueText && $dialogueText.length) { // Ensure $dialogueText is valid
                $dialogueText.html(`<strong>Frog:</strong> ${tempFeedbackText}`);
                gsap.fromTo($dialogueText, {autoAlpha:0, y:10},{autoAlpha:1, y:0, duration:0.3});
                if (frogCroakSound) playGameSfx(frogCroakSound);
            } else { console.error("$dialogueText not found for incorrect feedback."); }


            gsap.delayedCall(1.5, () => {
                canAnswerRiddle = true; // Allow trying other options for the *same* question
                // Re-display the "Kitten thinking" or current riddle prompt if needed
                // This could be done by calling gameDialogueSystem.showCurrent() or similar if it exists.
                // For now, the riddle UI remains, and only the wrong button is disabled.
            });
        }
    }

    const imagesForThisScene = [
        'images/Lv2.png', 'images/Kitten.png', 'images/Frog.png'
    ].filter(Boolean);

    const sceneData = {
        dialogues: sceneDialogues,
        imagesToPreload: imagesForThisScene,
        audioSelectors: audioSelectors,
        onSceneReady: function() {
            console.log("Scene 03 Riddle is ready!");
            gsap.set([$kittenSprite, $frogSprite], { autoAlpha: 1, display: 'block' });
        }
    };

    initializeSceneFramework(sceneData);
});