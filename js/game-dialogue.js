// js/game-dialogue.js

// Make these jQuery objects accessible if needed by other functions within this file,
// but the core logic will be in the gameDialogueSystem object.
let $dialogueTextElement, $dialogueBoxElement, $navButtonElement;

window.gameDialogueSystem = {
    items: [],          // Array to hold all dialogue items for the current scene
    currentIndex: 0,    // Index of the current dialogue item to be shown
    clickEnabled: false, // Whether clicking the game container advances dialogue

    // Call this from your scene-specific JS (via initializeSceneFramework in game-main.js)
    init: function (dialoguesArray, textSelector, boxSelector, navButtonSelector) {
        this.items = dialoguesArray ? [...dialoguesArray] : []; // Use a copy
        this.currentIndex = 0;
        this.clickEnabled = false; // Start with clicks disabled

        $dialogueTextElement = $(textSelector);
        $dialogueBoxElement = $(boxSelector);
        $navButtonElement = $(navButtonSelector);

        if (!$dialogueTextElement.length || !$dialogueBoxElement.length) {
            console.error("Dialogue system: Required text or box elements not found.");
            return;
        }

        // Initial setup for dialogue box (e.g., start hidden)
        gsap.set($dialogueBoxElement, { autoAlpha: 0 });
        if ($navButtonElement.length) {
            gsap.set($navButtonElement, { autoAlpha: 0, display: 'none' });
        }
        console.log("Game Dialogue System Initialized with", this.items.length, "items.");
    },

    // Call this to show the first dialogue or the next one after an advance
    showNext: function () {
        this.clickEnabled = false; // Disable clicks while new dialogue is appearing
        if (this.currentIndex < this.items.length) {
            const currentItem = this.items[this.currentIndex];
            this._animateTextAndProceed(currentItem); // Use a private helper

            if (!currentItem.endPart && !currentItem.endScene) {
                $dialogueBoxElement.css('cursor', 'pointer');
            } else {
                $dialogueBoxElement.css('cursor', 'default');
            }
        } else {
            console.log("No more dialogue items to show.");
            this.clickEnabled = false; // No more items, no more clicks
        }
    },

    _animateTextAndProceed: function (dialogueItem) {
        if (dialogueItem.isActionOnly) {
            this.clickEnabled = false; // Disable clicks during action
            if (dialogueItem.action) {
                dialogueItem.action(() => { // Action's callback
                    this.advance(); // Automatically advance to the next actual dialogue item
                });
            } else {
                this.advance(); // No action, just advance
            }
            return; // Skip text animation for action-only items
        }
        let fullText = (dialogueItem.character ? `<strong>${dialogueItem.character}:</strong> ` : "") + dialogueItem.text;
        $dialogueTextElement.html(fullText);

        let boxFadeDur = ($dialogueBoxElement.css('opacity') === '0' || this.currentIndex === 0) ? 0.3 : 0.1;

        gsap.to($dialogueBoxElement, {
            autoAlpha: 1, duration: boxFadeDur, onComplete: () => {
                gsap.fromTo($dialogueTextElement, { autoAlpha: 0, y: 10 }, {
                    autoAlpha: 1, y: 0, duration: 0.4, onComplete: () => {
                        // Use global playGameSfx if available
                        if (dialogueItem.sfx && typeof playGameSfx === 'function') { // MODIFIED HERE
                            playGameSfx(dialogueItem.sfx);                         // MODIFIED HERE
                        }

                        if (dialogueItem.action) {
                            dialogueItem.action(() => { // Action's callback
                                this.clickEnabled = true;
                                if (dialogueItem.endPart || dialogueItem.endScene) this.showNavButton();
                            });
                        } else {
                            this.clickEnabled = true;
                            if (dialogueItem.endPart || dialogueItem.endScene) this.showNavButton();
                        }
                    }
                });
            }
        });
    },

    showNavButton: function () {
        $dialogueBoxElement.css('cursor', 'default');
        if ($navButtonElement && $navButtonElement.length) {
            gsap.to($navButtonElement, { autoAlpha: 1, duration: 0.3, delay: 0.05, onStart: () => $navButtonElement.show() });
        }
    },

    // Call this when the game container is clicked
    advance: function () {
        if (this.clickEnabled && $navButtonElement && !$navButtonElement.is(':visible')) {
            if (this.currentIndex < this.items.length - 1) { // If there's a NEXT item
                // Play click sound using global function
                if (typeof playGameSfx === 'function') {
                    playGameSfx('click-sound');
                }
                this.currentIndex++;
                this.showNext();
            } else if (this.items[this.currentIndex] && (this.items[this.currentIndex].endPart || this.items[this.currentIndex].endScene)) {
                // It's the last item that should show a button, do nothing on click here, button handles it
            }
        }
    },

    // Method for other scripts to add dialogues (e.g., riddle success)
    addDialogueItems: function (newItemsArray) {
        if (Array.isArray(newItemsArray)) {
            this.items.push(...newItemsArray);
            console.log("Added new dialogue items. Total items:", this.items.length);
        }
    },

    // Optional: if you need to jump to a specific dialogue (less common for linear stories)
    setCurrentIndexAndShow: function (idx) {
        this.currentIndex = Math.max(0, Math.min(idx, this.items.length - 1));
        this.showNext();
    }
};