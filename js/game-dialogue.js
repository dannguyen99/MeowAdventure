// js/game-dialogue.js
let currentDialogueItems = [];
let currentDialogueIdx = 0;
let dialogueClickEnabled = false;
let $dialogueTxtElement, $dialogueBoxEl, $navButtonElement; // Set by scene

function initializeDialogueSystem(dialoguesArray, textSelector, boxSelector, navButtonSelector) {
    currentDialogueItems = dialoguesArray;
    currentDialogueIdx = 0;
    dialogueClickEnabled = false; // Start disabled until first dialogue is shown
    $dialogueTxtElement = $(textSelector);
    $dialogueBoxEl = $(boxSelector);
    $navButtonElement = $(navButtonSelector); // e.g., #next-scene-button

    // Initial setup for dialogue box (e.g., start hidden)
    gsap.set($dialogueBoxEl, { autoAlpha: 0 });
}

function showNextDialogue() {
    dialogueClickEnabled = false;
    if (currentDialogueIdx < currentDialogueItems.length) {
        const currentItem = currentDialogueItems[currentDialogueIdx];
        animateDialogueTextAndProceed(currentItem);
        if (!currentItem.endPart && !currentItem.endScene) { // Adjusted condition
             $dialogueBoxEl.css('cursor', 'pointer');
        } else {
             $dialogueBoxEl.css('cursor', 'default');
        }
    }
}

function animateDialogueTextAndProceed(dialogueItem) {
    let fullText = (dialogueItem.character ? `<strong>${dialogueItem.character}:</strong> ` : "") + dialogueItem.text;
    $dialogueTxtElement.html(fullText);

    let boxFadeDur = ($dialogueBoxEl.css('opacity') === '0') ? 0.3 : 0.1;
    gsap.to($dialogueBoxEl, { autoAlpha: 1, duration: boxFadeDur, onComplete: () => {
        gsap.fromTo($dialogueTxtElement, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, onComplete: () => {
            if (dialogueItem.sfx && typeof playGameSfx === 'function') playGameSfx(dialogueItem.sfx); // Use global SFX player

            if (dialogueItem.action) {
                dialogueItem.action(() => {
                    dialogueClickEnabled = true;
                    if (dialogueItem.endPart || dialogueItem.endScene) showGameNavigationButton();
                });
            } else {
                dialogueClickEnabled = true;
                if (dialogueItem.endPart || dialogueItem.endScene) showGameNavigationButton();
            }
        }});
    }});
}

function showGameNavigationButton() {
    $dialogueBoxEl.css('cursor', 'default');
    if ($navButtonElement && $navButtonElement.length) {
        gsap.to($navButtonElement, { autoAlpha: 1, duration: 0.3, delay: 0.05, onStart: () => $navButtonElement.show() });
    }
}

function advanceDialogue() { // Called by scene's click handler
    if (dialogueClickEnabled && $navButtonElement && !$navButtonElement.is(':visible')) {
        if (currentDialogueIdx < currentDialogueItems.length - 1) {
            if (typeof playGameSfx === 'function') { // Check if click sound function exists
                 const clickSfx = sceneAudioElements.find(audio => audio && audio.id === 'click-sound');
                 if (clickSfx) playGameSfx(clickSfx);
            }
            currentDialogueIdx++;
            showNextDialogue();
        }
    }
}