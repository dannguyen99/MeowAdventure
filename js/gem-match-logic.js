

const GEM_TYPES = [
    "Gem1.png", "Gem2.png", "Gem3.png",
    "Gem4.png", "Gem5.png", "Gem6.png"
];
const GRID_SIZE = 5;
let gemGrid = [];
let $gridContainerElement;
let onMatchCallback;
let onMoveMadeCallback;

let firstSelectedGem = null;
let isProcessing = false;
let isGameActive = true;

function initializeGemMatch(containerSelector, matchCallback, moveCallback) {
    $gridContainerElement = $(containerSelector);
    onMatchCallback = matchCallback;
    onMoveMadeCallback = moveCallback;
    isGameActive = true;
    isProcessing = false;
    firstSelectedGem = null;
    createGrid();
    populateGrid();
}

function createGrid() {
    $gridContainerElement.empty();
    gemGrid = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        gemGrid[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            const $cell = $('<div class="gem-cell"></div>')
                            .attr('data-row', r)
                            .attr('data-col', c);
            $gridContainerElement.append($cell);
            gemGrid[r][c] = null;
        }
    }
}

function populateGrid() {
    console.log("Populating grid...");
    isProcessing = true;

    
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            gemGrid[r][c] = null;
            const $cell = $gridContainerElement.find(`.gem-cell[data-row='${r}'][data-col='${c}']`);
            $cell.empty();
        }
    }

    
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            let randomGemType;
            let attempts = 0;
            do {
                randomGemType = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
                attempts++;
                if (attempts > 50) break;
            } while (createsInitialMatch(r, c, randomGemType));
            addGemToCell(r, c, randomGemType);
        }
    }
    
    
    isProcessing = false;
    firstSelectedGem = null;
    
    if (!checkForValidMoves()) {
        console.log("No valid moves, will shuffle");
        gsap.delayedCall(1.0, shuffleGrid);
    } else {
        console.log("Grid ready for play");
    }
}

function createsInitialMatch(row, col, gemType) {
    
    let hCount = 1;
    for (let c = col - 1; c >= 0 && gemGrid[row][c] === gemType; c--) hCount++;
    for (let c = col + 1; c < GRID_SIZE && gemGrid[row][c] === gemType; c++) hCount++;
    if (hCount >= 3) return true;

    
    let vCount = 1;
    for (let r = row - 1; r >= 0 && gemGrid[r][col] === gemType; r--) vCount++;
    for (let r = row + 1; r < GRID_SIZE && gemGrid[r][col] === gemType; r++) vCount++;
    if (vCount >= 3) return true;

    return false;
}

function addGemToCell(row, col, gemType, isFalling = false) {
    const $cell = $gridContainerElement.find(`.gem-cell[data-row='${row}'][data-col='${col}']`);
    if (!$cell.length) {
        console.warn("Cell not found for", row, col);
        return;
    }
    
    $cell.empty();
    const $gem = $('<div class="gem-item"></div>')
        .css('background-image', `url('images/Gems/${gemType}')`)
        .data({ row: row, col: col, type: gemType });

    
    attachGemClickHandler($gem);
    
    gemGrid[row][col] = gemType;
    $cell.append($gem);

    gsap.set($gem, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1 });

    if (isFalling) {
        gsap.from($gem, { y: -100, opacity: 0, duration: 0.4, ease: "bounce.out" });
    }
    
    console.log("Added gem to", row, col, "type:", gemType);
}


function attachGemClickHandler($gem) {
    $gem.off('click.gemMatch'); 
    $gem.on('click.gemMatch', handleGemClick); 
    $gem.attr('data-clickable', 'true'); 
}

function handleGemClick(event) {
    console.log(`Gem click - isGameActive: ${isGameActive}, isProcessing: ${isProcessing}, firstSelectedGem: ${firstSelectedGem ? 'exists' : 'null'}`);
    
    if (!isGameActive || isProcessing) {
        console.log("Click blocked - isGameActive:", isGameActive, "isProcessing:", isProcessing);
        return;
    }
    
    const $clickedGem = $(event.currentTarget);
    const $cell = $clickedGem.parent();
    
    const gemData = {
        row: parseInt($cell.attr('data-row')),
        col: parseInt($cell.attr('data-col')),
        type: $clickedGem.data('type'),
        element: $clickedGem
    };

    console.log("Clicked gem data:", gemData.row, gemData.col, gemData.type);

    if (!gemData.type) {
        console.warn("Invalid gem clicked - no type found");
        return;
    }

    if (!firstSelectedGem) {
        
        firstSelectedGem = gemData;
        firstSelectedGem.element.addClass('selected');
        if (typeof playGameSfx === 'function') playGameSfx('#gem-select-sound');
        console.log("First gem selected:", gemData.row, gemData.col);
    } else {
        if (firstSelectedGem.element[0] === $clickedGem[0]) {
            
            firstSelectedGem.element.removeClass('selected');
            firstSelectedGem = null;
            if (typeof playGameSfx === 'function') playGameSfx('#gem-deselect-sound');
            console.log("Gem deselected");
            return;
        }

        if (areAdjacent(firstSelectedGem, gemData)) {
            
            console.log("Valid swap attempt");
            isProcessing = true;
            firstSelectedGem.element.removeClass('selected');
            swapGems(firstSelectedGem, gemData);
        } else {
            
            console.log("Selecting new gem instead");
            firstSelectedGem.element.removeClass('selected');
            firstSelectedGem = gemData;
            firstSelectedGem.element.addClass('selected');
            if (typeof playGameSfx === 'function') playGameSfx('#gem-select-sound');
            console.log("New gem selected:", gemData.row, gemData.col);
        }
    }
}

function areAdjacent(gem1, gem2) {
    const rowDiff = Math.abs(gem1.row - gem2.row);
    const colDiff = Math.abs(gem1.col - gem2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function swapGems(gem1, gem2) {
    console.log("Swapping gems:", gem1.row, gem1.col, "with", gem2.row, gem2.col);
    
    if (typeof playGameSfx === 'function') playGameSfx('#gem-swap-sound');

    
    const gem1Pos = gem1.element.position();
    const gem2Pos = gem2.element.position();

    gsap.to(gem1.element, {
        x: gem2Pos.left - gem1Pos.left,
        y: gem2Pos.top - gem1Pos.top,
        duration: 0.3, ease: "power2.inOut"
    });
    
    gsap.to(gem2.element, {
        x: gem1Pos.left - gem2Pos.left,
        y: gem1Pos.top - gem2Pos.top,
        duration: 0.3, ease: "power2.inOut",
        onComplete: () => completeSwap(gem1, gem2)
    });
}

function completeSwap(gem1, gem2) {
    console.log("Completing swap");
    
    
    const tempType = gemGrid[gem1.row][gem1.col];
    gemGrid[gem1.row][gem1.col] = gemGrid[gem2.row][gem2.col];
    gemGrid[gem2.row][gem2.col] = tempType;

    
    const $cell1 = $gridContainerElement.find(`.gem-cell[data-row='${gem1.row}'][data-col='${gem1.col}']`);
    const $cell2 = $gridContainerElement.find(`.gem-cell[data-row='${gem2.row}'][data-col='${gem2.col}']`);
    
    gsap.set([gem1.element, gem2.element], { x: 0, y: 0 });
    $cell1.empty().append(gem2.element);
    $cell2.empty().append(gem1.element);

    
    gem1.element.data({ row: gem2.row, col: gem2.col, type: gem2.type });
    gem2.element.data({ row: gem1.row, col: gem1.col, type: gem1.type });
    
    
    attachGemClickHandler(gem1.element);
    attachGemClickHandler(gem2.element);

    
    const matches = findAllMatches();
    if (matches.length > 0) {
        console.log("Match found, processing");
        processMatches(matches, true);
    } else {
        console.log("No match, reverting swap");
        revertSwap(gem1, gem2);
    }
}

function revertSwap(gem1, gem2) {
    if (typeof playGameSfx === 'function') playGameSfx('#gem-no-match-sound');
    
    
    const tempType = gemGrid[gem1.row][gem1.col];
    gemGrid[gem1.row][gem1.col] = gemGrid[gem2.row][gem2.col];
    gemGrid[gem2.row][gem2.col] = tempType;

    
    const gem1Pos = gem1.element.position();
    const gem2Pos = gem2.element.position();

    gsap.to(gem1.element, {
        x: gem2Pos.left - gem1Pos.left,
        y: gem2Pos.top - gem1Pos.top,
        duration: 0.3, ease: "power2.inOut"
    });
    
    gsap.to(gem2.element, {
        x: gem1Pos.left - gem2Pos.left,
        y: gem1Pos.top - gem2Pos.top,
        duration: 0.3, ease: "power2.inOut",
        onComplete: () => {
            
            const $cell1 = $gridContainerElement.find(`.gem-cell[data-row='${gem1.row}'][data-col='${gem1.col}']`);
            const $cell2 = $gridContainerElement.find(`.gem-cell[data-row='${gem2.row}'][data-col='${gem2.col}']`);
            
            gsap.set([gem1.element, gem2.element], { x: 0, y: 0 });
            $cell1.empty().append(gem1.element);
            $cell2.empty().append(gem2.element);

            
            gem1.element.data({ row: gem1.row, col: gem1.col, type: gem1.type });
            gem2.element.data({ row: gem2.row, col: gem2.col, type: gem2.type });
            
            
            attachGemClickHandler(gem1.element);
            attachGemClickHandler(gem2.element);
            
            
            console.log("Revert complete, resetting state");
            resetGameState();
            
            
            if (onMoveMadeCallback) onMoveMadeCallback(false);
        }
    });
}

function processMatches(matches, isFirstMatch = false) {
    console.log("Processing", matches.length, "matches");
    
    if (typeof playGameSfx === 'function') playGameSfx('#gem-match-sound');
    
    
    matches.forEach(gem => {
        const $cell = $gridContainerElement.find(`.gem-cell[data-row='${gem.row}'][data-col='${gem.col}']`);
        const $gemEl = $cell.find('.gem-item');
        if ($gemEl.length) {
            $gemEl.off('click.gemMatch'); 
            $gemEl.removeAttr('data-clickable'); 
            gsap.to($gemEl, {
                autoAlpha: 0, scale: 0.3, rotation: 180, 
                duration: 0.5, ease: "power2.in",
                onComplete: () => $gemEl.remove()
            });
        }
        gemGrid[gem.row][gem.col] = null;
    });

    if (onMatchCallback) onMatchCallback(Math.floor(matches.length / 3));
    
    
    gsap.delayedCall(0.6, () => {
        refillGrid();
        if (isFirstMatch && onMoveMadeCallback) onMoveMadeCallback(true);
    });
}

function refillGrid() {
    console.log("Refilling grid");
    
    
    for (let c = 0; c < GRID_SIZE; c++) {
        const gems = [];
        
        
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
            if (gemGrid[r][c] !== null) {
                const $cell = $gridContainerElement.find(`.gem-cell[data-row='${r}'][data-col='${c}']`);
                const $gem = $cell.find('.gem-item');
                if ($gem.length) {
                    gems.unshift({
                        type: gemGrid[r][c],
                        element: $gem,
                        originalRow: r
                    });
                }
                gemGrid[r][c] = null;
                $cell.empty();
            }
        }

        
        let targetRow = GRID_SIZE - 1;
        gems.forEach(gemData => {
            const $targetCell = $gridContainerElement.find(`.gem-cell[data-row='${targetRow}'][data-col='${c}']`);
            gemGrid[targetRow][c] = gemData.type;
            
            
            gemData.element.data({ row: targetRow, col: c, type: gemData.type });
            attachGemClickHandler(gemData.element); 
            
            $targetCell.append(gemData.element);

            
            const dropDistance = targetRow - gemData.originalRow;
            if (dropDistance > 0) {
                gsap.fromTo(gemData.element,
                    { y: -(dropDistance * 65) },
                    { y: 0, duration: 0.3 + dropDistance * 0.05, ease: "bounce.out" }
                );
            }
            targetRow--;
        });

        
        for (let r = targetRow; r >= 0; r--) {
            const randomGemType = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
            addGemToCell(r, c, randomGemType, true);
        }
    }

    if (typeof playGameSfx === 'function') playGameSfx('#gem-fall-sound');
    
    
    gsap.delayedCall(0.8, () => {
        const newMatches = findAllMatches();
        if (newMatches.length > 0) {
            processMatches(newMatches);
        } else {
            
            console.log("All cascades complete, resetting state");
            resetGameState();
            
            
            const unclickableGems = $gridContainerElement.find('.gem-item:not([data-clickable="true"])');
            if (unclickableGems.length > 0) {
                console.warn(`Fixed ${unclickableGems.length} gems without click handlers`);
                unclickableGems.each(function() {
                    attachGemClickHandler($(this));
                });
            }
            
            if (!checkForValidMoves()) {
                console.log("No valid moves remaining, will shuffle");
                gsap.delayedCall(1.0, shuffleGrid);
            } else {
                console.log("Ready for next move");
            }
        }
    });
}


function resetGameState() {
    isProcessing = false;
    firstSelectedGem = null;
}

function findAllMatches() {
    let matches = [];
    const visited = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    
    
    for (let r = 0; r < GRID_SIZE; r++) {
        let count = 1;
        let currentType = gemGrid[r][0];
        
        for (let c = 1; c < GRID_SIZE; c++) {
            if (gemGrid[r][c] === currentType && currentType !== null) {
                count++;
            } else {
                if (count >= 3 && currentType !== null) {
                    for (let i = c - count; i < c; i++) {
                        if (!visited[r][i]) {
                            matches.push({row: r, col: i});
                            visited[r][i] = true;
                        }
                    }
                }
                currentType = gemGrid[r][c];
                count = 1;
            }
        }
        if (count >= 3 && currentType !== null) {
            for (let i = GRID_SIZE - count; i < GRID_SIZE; i++) {
                if (!visited[r][i]) {
                    matches.push({row: r, col: i});
                    visited[r][i] = true;
                }
            }
        }
    }
    
    
    for (let c = 0; c < GRID_SIZE; c++) {
        let count = 1;
        let currentType = gemGrid[0][c];
        
        for (let r = 1; r < GRID_SIZE; r++) {
            if (gemGrid[r][c] === currentType && currentType !== null) {
                count++;
            } else {
                if (count >= 3 && currentType !== null) {
                    for (let i = r - count; i < r; i++) {
                        if (!visited[i][c]) {
                            matches.push({row: i, col: c});
                            visited[i][c] = true;
                        }
                    }
                }
                currentType = gemGrid[r][c];
                count = 1;
            }
        }
        if (count >= 3 && currentType !== null) {
            for (let i = GRID_SIZE - count; i < GRID_SIZE; i++) {
                if (!visited[i][c]) {
                    matches.push({row: i, col: c});
                    visited[i][c] = true;
                }
            }
        }
    }
    
    return matches;
}

function checkForValidMoves() {
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (!gemGrid[r][c]) continue;

            
            if (c < GRID_SIZE - 1 && gemGrid[r][c+1]) {
                if (checkPotentialSwap(r, c, r, c + 1)) return true;
            }
            
            if (r < GRID_SIZE - 1 && gemGrid[r+1][c]) {
                if (checkPotentialSwap(r, c, r + 1, c)) return true;
            }
        }
    }
    return false;
}

function checkPotentialSwap(r1, c1, r2, c2) {
    const type1 = gemGrid[r1][c1];
    const type2 = gemGrid[r2][c2];

    gemGrid[r1][c1] = type2;
    gemGrid[r2][c2] = type1;

    const createsMatch = checkMatchAt(r1, c1) || checkMatchAt(r2, c2);
    
    gemGrid[r1][c1] = type1;
    gemGrid[r2][c2] = type2;

    return createsMatch;
}

function checkMatchAt(r, c) {
    const type = gemGrid[r][c];
    if (!type) return false;

    
    let hCount = 1;
    for (let col = c - 1; col >= 0 && gemGrid[r][col] === type; col--) hCount++;
    for (let col = c + 1; col < GRID_SIZE && gemGrid[r][col] === type; col++) hCount++;
    if (hCount >= 3) return true;

    
    let vCount = 1;
    for (let row = r - 1; row >= 0 && gemGrid[row][c] === type; row--) vCount++;
    for (let row = r + 1; row < GRID_SIZE && gemGrid[row][c] === type; row++) vCount++;
    if (vCount >= 3) return true;

    return false;
}

function shuffleGrid() {
    console.log("Shuffling grid");
    isProcessing = true;
    firstSelectedGem = null;
    $('.gem-item.selected').removeClass('selected');

    if (typeof window.showTemporaryDialogue === 'function') {
        window.showTemporaryDialogue("No more moves! Shuffling...", null);
    }
    if (typeof playGameSfx === 'function') playGameSfx('#shuffle-sound');

    const allGemElements = $gridContainerElement.find('.gem-item');
    allGemElements.off('click.gemMatch'); 
    allGemElements.removeAttr('data-clickable'); 
    
    gsap.to(allGemElements, {
        autoAlpha: 0, scale: 0.3, rotation: 360, duration: 0.4, stagger: 0.02,
        onComplete: () => {
            allGemElements.remove();
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    gemGrid[r][c] = null;
                }
            }
            populateGrid();
        }
    });
}

function disableGemMatchGame() {
    console.log("Disabling gem match game");
    isGameActive = false;
    isProcessing = true;
    firstSelectedGem = null;
    if ($gridContainerElement) {
        $gridContainerElement.find('.gem-item').off('click.gemMatch');
        $gridContainerElement.find('.gem-item.selected').removeClass('selected');
        $gridContainerElement.find('.gem-item').removeAttr('data-clickable');
    }
}

window.disableGemMatchGame = disableGemMatchGame;