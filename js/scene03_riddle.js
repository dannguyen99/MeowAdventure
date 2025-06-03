
$(document).ready(function() {
    const $kittenSprite = $('#kitten-sprite');
    const $frogSprite = $('#frog-sprite');
    const $riddleContainer = $('#riddle-container');
    const $riddleTextDisplay = $('#riddle-text-display');
    const $answerChoicesContainer = $('#answer-choices-container');
    const $dialogueText = $('#dialogue-text'); 

    const audioSelectors = {
        bgMusic: '#bg-music-scene3',
        click: '#click-sound',
        meowThinking: '#meow-thinking-sound',
        frogCroak: '#frog-croak-sound',
        correctAnswer: '#correct-answer-sound',
        wrongAnswer: '#wrong-answer-sound'
    };
    
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
    let currentRiddleIndex = 0; 
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
            
            text: "Here’s your first riddle:", 
            character: "Frog", sfx: frogCroakSound,
            action: function(callback) {
                showRiddleUI(); 
                callback();
            }
        },
        {
            text: "Hmm… What could it be?", character: "Kitten", sfx: meowThinkingSound,
            action: function(callback){
                canAnswerRiddle = true;
                
            }
        }
    ];

    function showRiddleUI() {
        if (currentRiddleIndex >= riddles.length) { 
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
        canAnswerRiddle = false; 
                                 
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
            $('#answer-choices-container button').addClass('disabled').prop('disabled', true); 

            currentRiddleIndex++; 

            if (currentRiddleIndex < riddles.length) {
                
                gsap.to($riddleContainer, {autoAlpha:0, duration:0.3, delay: 0.8, onComplete: () => {
                    $riddleContainer.css('display', 'none'); 
                    gsap.delayedCall(0.5, () => {
                        showRiddleUI(); 
                        
                        
                        
                        
                        
                        if (window.gameDialogueSystem && typeof window.gameDialogueSystem.showNext === 'function') {
                            window.gameDialogueSystem.showNext(); 
                        } else {
                            console.error("gameDialogueSystem.showNext() not found for refreshing dialogue.");
                            
                            
                            canAnswerRiddle = true; 
                        }
                    });
                }});
            } else {
                
                gsap.to($riddleContainer, {autoAlpha:0, duration:0.3, delay: 0.8, onComplete: () => {
                    $riddleContainer.css('display', 'none');
                    
                    if (window.gameDialogueSystem && typeof window.gameDialogueSystem.addDialogueItems === 'function') {
                        const successDialogues = [
                            { text: "Hooray! You’re really smart! You got them all right!", character: "Frog", sfx: frogCroakSound },
                            { text: "So you’ll help me cross now?", character: "Kitten", sfx: meowThinkingSound },
                            { text: "Of course! Follow me, but step carefully!", character: "Frog", sfx: frogCroakSound, endScene: true }
                        ];
                        window.gameDialogueSystem.addDialogueItems(successDialogues);

                        
                        
                        window.gameDialogueSystem.currentIndex = window.gameDialogueSystem.items.length - successDialogues.length;

                        
                        if (typeof window.gameDialogueSystem.showNext === 'function') {
                            window.gameDialogueSystem.showNext();
                        } else { console.error("gameDialogueSystem.showNext() not found."); }

                    } else { console.error("gameDialogueSystem not properly set up for adding dialogues."); }
                }});
            }
        } else { 
            playGameSfx(wrongAnswerSound); 
            $button.addClass('disabled').prop('disabled', true); 

            
            const tempFeedbackText = "Hmm, not quite! That's not it, try again!";
            if ($dialogueText && $dialogueText.length) { 
                $dialogueText.html(`<strong>Frog:</strong> ${tempFeedbackText}`);
                gsap.fromTo($dialogueText, {autoAlpha:0, y:10},{autoAlpha:1, y:0, duration:0.3});
                if (frogCroakSound) playGameSfx(frogCroakSound); 
            } else { console.error("$dialogueText not found for incorrect feedback."); }


            gsap.delayedCall(1.5, () => {
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