// js/scene03_riddle.js
$(document).ready(function() {
    const $kittenSprite = $('#kitten-sprite');
    const $frogSprite = $('#frog-sprite');
    const $riddleContainer = $('#riddle-container');
    const $riddleTextDisplay = $('#riddle-text-display');
    const $answerChoicesContainer = $('#answer-choices-container');
    const $dialogueText = $('#dialogue-text'); // Add this line
    // Dialogue box elements are handled by game-dialogue.js

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

    const riddle = "It can fly without wings and cry without eyes. What is it?";
    const answerOptions = [
        { text: "Smoke", correct: false },
        { text: "A Cloud", correct: true }, // Correct Answer
        { text: "Wind", correct: false },
        { text: "A Ghost", correct: false }
    ];
    let canAnswerRiddle = false;

    const sceneDialogues = [
        {
            text: "Good! Now, listen carefully!", character: "Frog", sfx: frogCroakSound,
            action: function(callback) {
                // Position and show Kitten and Frog if not already visible
                gsap.to([$kittenSprite, $frogSprite], { autoAlpha: 1, duration: 0.5, display: 'block' });
                callback();
            }
        },
        {
            text: "Here’s your riddle: ‘It can fly without wings and cry without eyes. What is it?’",
            character: "Frog", sfx: frogCroakSound,
            action: function(callback) {
                showRiddleUI();
                callback(); // Riddle UI appears, then dialogue system can enable clicks for next
            }
        },
        { // This dialogue is for the kitten thinking (optional visual cue)
            text: "Hmm… What could it be?", character: "Kitten", sfx: meowThinkingSound,
            action: function(callback){
                canAnswerRiddle = true; // Player can now click answers
            }
        }
        // Success/failure dialogues will be added dynamically or handled differently
    ];

    function showRiddleUI() {
        $riddleTextDisplay.text(riddle);
        $answerChoicesContainer.empty(); // Clear previous choices if any

        // Shuffle answer options for variety (optional)
        // const shuffledOptions = [...answerOptions].sort(() => Math.random() - 0.5);

        answerOptions.forEach(option => {
            const $button = $('<button></button>').text(option.text).data('correct', option.correct);
            $button.on('click', handleAnswerClick);
            $answerChoicesContainer.append($button);
        });
        gsap.to($riddleContainer, { autoAlpha: 1, duration: 0.5, display: 'block', delay:0.3 });
    }

    function handleAnswerClick(event) {
        if (!canAnswerRiddle) return;
        canAnswerRiddle = false; // Prevent multiple clicks while processing

        const $button = $(event.currentTarget);
        const isCorrect = $button.data('correct');
        playGameSfx($(audioSelectors.click)[0]); // General click sound

        if (isCorrect) {
            playGameSfx(correctAnswerSound);
            $button.css('background-color', '#a5d6a7'); // Green for correct
            // Disable all buttons
            $('#answer-choices-container button').addClass('disabled').prop('disabled', true);

            // Add success dialogues
            currentDialogueItems.push( // Assumes currentDialogueItems is accessible from game-dialogue.js
                { text: "Hooray! You’re really smart! You got it right!", character: "Frog", sfx: frogCroakSound },
                { text: "So you’ll help me cross now?", character: "Kitten", sfx: meowThinkingSound /* or a happy meow */ },
                { text: "Of course! Follow me, but step carefully!", character: "Frog", sfx: frogCroakSound, endScene: true } // endScene to show next button
            );
            // Adjust index and advance (from game-dialogue.js)
            // currentDialogueIdx was the thinking kitten. Next is the success dialogue.
            gsap.to($riddleContainer, {autoAlpha:0, duration:0.3, delay: 0.8, onComplete: () => {
                $riddleContainer.css('display', 'none');
                if(typeof proceedToNextDialogueItem === 'function') { // MODIFIED HERE
                    proceedToNextDialogueItem();
                } else {
                    console.error("proceedToNextDialogueItem function not found.");
                }
            }});

        } else {
            playGameSfx(wrongAnswerSound);
            $button.addClass('disabled').prop('disabled', true); // Disable only this wrong button
            // Add "try again" dialogue
            const tempDialogueItem = { text: "Hmm, not quite! That's not it, try again!", character: "Frog", sfx: frogCroakSound };
            $dialogueText.html(`<strong>Frog:</strong> ${tempDialogueItem.text}`); // Directly update for now
            gsap.fromTo($dialogueText, {opacity:0},{opacity:1, duration:0.3}); // Quick fade for feedback
            if(tempDialogueItem.sfx) playGameSfx(tempDialogueItem.sfx);

            gsap.delayedCall(1.5, () => { // Allow trying again after a brief pause
                canAnswerRiddle = true;
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