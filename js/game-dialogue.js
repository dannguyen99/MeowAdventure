



let $dialogueTextElement, $dialogueBoxElement, $navButtonElement;

window.gameDialogueSystem = {
    items: [],          
    currentIndex: 0,    
    clickEnabled: false, 

    
    init: function (dialoguesArray, textSelector, boxSelector, navButtonSelector) {
        this.items = dialoguesArray ? [...dialoguesArray] : []; 
        this.currentIndex = 0;
        this.clickEnabled = false; 

        $dialogueTextElement = $(textSelector);
        $dialogueBoxElement = $(boxSelector);
        $navButtonElement = $(navButtonSelector);

        if (!$dialogueTextElement.length || !$dialogueBoxElement.length) {
            console.error("Dialogue system: Required text or box elements not found.");
            return;
        }

        
        gsap.set($dialogueBoxElement, { autoAlpha: 0 });
        if ($navButtonElement.length) {
            gsap.set($navButtonElement, { autoAlpha: 0, display: 'none' });
        }
        console.log("Game Dialogue System Initialized with", this.items.length, "items.");
    },

    
    showNext: function () {
        this.clickEnabled = false; 
        if (this.currentIndex < this.items.length) {
            const currentItem = this.items[this.currentIndex];
            this._animateTextAndProceed(currentItem); 

            if (!currentItem.endPart && !currentItem.endScene) {
                $dialogueBoxElement.css('cursor', 'pointer');
            } else {
                $dialogueBoxElement.css('cursor', 'default');
            }
        } else {
            console.log("No more dialogue items to show.");
            this.clickEnabled = false; 
        }
    },

    _animateTextAndProceed: function (dialogueItem) {
        if (dialogueItem.isActionOnly) {
            this.clickEnabled = false; 
            if (dialogueItem.action) {
                dialogueItem.action(() => { 
                    this.advance(); 
                });
            } else {
                this.advance(); 
            }
            return; 
        }
        let fullText = (dialogueItem.character ? `<strong>${dialogueItem.character}:</strong> ` : "") + dialogueItem.text;
        $dialogueTextElement.html(fullText);

        let boxFadeDur = ($dialogueBoxElement.css('opacity') === '0' || this.currentIndex === 0) ? 0.3 : 0.1;

        gsap.to($dialogueBoxElement, {
            autoAlpha: 1, duration: boxFadeDur, onComplete: () => {
                gsap.fromTo($dialogueTextElement, { autoAlpha: 0, y: 10 }, {
                    autoAlpha: 1, y: 0, duration: 0.4, onComplete: () => {
                        
                        if (dialogueItem.sfx && typeof playGameSfx === 'function') { 
                            playGameSfx(dialogueItem.sfx);                         
                        }

                        if (dialogueItem.action) {
                            dialogueItem.action(() => { 
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

    
    advance: function () {
        if (this.clickEnabled && $navButtonElement && !$navButtonElement.is(':visible')) {
            if (this.currentIndex < this.items.length - 1) { 
                
                if (typeof playGameSfx === 'function') {
                    playGameSfx('click-sound');
                }
                this.currentIndex++;
                this.showNext();
            } else if (this.items[this.currentIndex] && (this.items[this.currentIndex].endPart || this.items[this.currentIndex].endScene)) {
                
            }
        }
    },

    
    addDialogueItems: function (newItemsArray) {
        if (Array.isArray(newItemsArray)) {
            this.items.push(...newItemsArray);
            console.log("Added new dialogue items. Total items:", this.items.length);
        }
    },

    
    setCurrentIndexAndShow: function (idx) {
        this.currentIndex = Math.max(0, Math.min(idx, this.items.length - 1));
        this.showNext();
    }
};