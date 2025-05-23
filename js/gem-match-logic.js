// js/gem-match-logic.js
// (This is a simplified conceptual outline. A full match-3 is complex.)

const GEM_TYPES = [
    "gem_red.png", "gem_blue_diamond.png", "gem_yellow_sun.png",
    "gem_green_oval.png", "gem_pink_starburst.png", "gem_blue_rect.png",
    "gem_blue_heart.png", "gem_teal_square.png", "gem_rainbow_star.png"
]; // Assumes these are in 'images/gems/' or similar subfolder
const GRID_SIZE = 3; // 3x3 grid
let gemGrid = []; // 2D array holding gem types or null
let $gridContainerElement;
let onMatchCallback; // Function to call when a match occurs
let onMoveMadeCallback; // Function to call after a move (match or no match)

let firstSelectedGem = null; // { row, col, element }
let isSwapping = false;

function initializeGemMatch(containerSelector, matchCallback, moveCallback) {
    $gridContainerElement = $(containerSelector);
    onMatchCallback = matchCallback;
    onMoveMadeCallback = moveCallback;
    createGrid();
    populateGrid();
}

function createGrid() {
    $gridContainerElement.empty();
    gemGrid = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        gemGrid[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            const $cell = $('<div class="gem-cell"></div>').data({ row: r, col: c });
            $gridContainerElement.append($cell);
            gemGrid[r][c] = null; // Initially empty
        }
    }
}

function populateGrid() {
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (gemGrid[r][c] === null) { // Only fill if empty
                let randomGemType;
                // Ensure no immediate matches on initial fill (more complex logic needed for robust fill)
                do {
                    randomGemType = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
                } while (createsInitialMatch(r, c, randomGemType));
                addGemToCell(r, c, randomGemType);
            }
        }
    }
    // After initial population, check for and resolve any accidental matches (rare in 3x3 but possible)
    // This part of a match-3 is complex; for now, we might get lucky or have to manually ensure no start matches.
    // let matches = findAllMatches();
    // if (matches.length > 0) {
    //     console.log("Initial matches found, repopulating problematic area - SIMPLIFIED");
    //     // For simplicity, could just repopulate the whole grid if initial matches.
    //     // A real game would target just the matched gems.
    //     // removeMatchedGems(matches);
    //     // refillGrid();
    //     // populateGrid(); // Recursive call - be careful with this
    // }
}

// Simplified check - a real game needs more robust initial placement
function createsInitialMatch(row, col, gemType) {
    // Check left
    if (col >= 2 && gemGrid[row][col-1] === gemType && gemGrid[row][col-2] === gemType) return true;
    // Check up
    if (row >= 2 && gemGrid[row-1][col] === gemType && gemGrid[row-2][col] === gemType) return true;
    return false;
}


function addGemToCell(row, col, gemType, isFalling = false) {
    const $cell = $gridContainerElement.find(`.gem-cell[data-row='${row}'][data-col='${col}']`);
    if (!$cell.length) {
        console.error(`Cell not found for ${row},${col}`);
        return;
    }
    $cell.empty(); // Clear any old gem img

    const $gem = $('<div class="gem-item"></div>')
        .css('background-image', `url('images/gems/${gemType}')`) // Adjust path as needed
        .data({ row: row, col: col, type: gemType });

    $gem.on('click', handleGemClick);
    // For drag-and-drop, you'd use mousedown, mousemove, mouseup with more complex logic

    gemGrid[row][col] = gemType;
    $cell.append($gem);

    if (isFalling) {
        // GSAP animation for falling gem
        gsap.from($gem, { y: -100, opacity: 0, duration: 0.4, ease: "bounce.out" });
    }
}

function handleGemClick(event) {
    if (isSwapping) return;
    const $clickedGem = $(event.currentTarget);
    const gemData = $clickedGem.data();

    if (!firstSelectedGem) {
        firstSelectedGem = { row: gemData.row, col: gemData.col, element: $clickedGem };
        $clickedGem.addClass('selected');
        // Play selection sound
    } else {
        // Second gem clicked
        if (firstSelectedGem.element[0] === $clickedGem[0]) { // Clicked same gem
            firstSelectedGem.element.removeClass('selected');
            firstSelectedGem = null;
            return;
        }

        if (areAdjacent(firstSelectedGem, gemData)) {
            isSwapping = true;
            firstSelectedGem.element.removeClass('selected');
            swapGems(firstSelectedGem, gemData);
        } else { // Not adjacent
            firstSelectedGem.element.removeClass('selected');
            // Select new gem
            firstSelectedGem = { row: gemData.row, col: gemData.col, element: $clickedGem };
            $clickedGem.addClass('selected');
        }
    }
}

function areAdjacent(gem1Data, gem2Data) {
    const rowDiff = Math.abs(gem1Data.row - gem2Data.row);
    const colDiff = Math.abs(gem1Data.col - gem2Data.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function swapGems(gem1, gem2) {
    // Visual swap animation (GSAP)
    const gem1Pos = { x: gem1.element.position().left, y: gem1.element.position().top };
    const gem2Pos = { x: gem2.element.position().left, y: gem2.element.position().top };

    gsap.to(gem1.element, { x: gem2Pos.x - gem1Pos.x, y: gem2Pos.y - gem1Pos.y, duration: 0.3 });
    gsap.to(gem2.element, { x: gem1Pos.x - gem2Pos.x, y: gem1Pos.y - gem2Pos.y, duration: 0.3, onComplete: () => {
        // Update logical grid
        const tempType = gemGrid[gem1.row][gem1.col];
        gemGrid[gem1.row][gem1.col] = gemGrid[gem2.row][gem2.col];
        gemGrid[gem2.row][gem2.col] = tempType;

        // Update DOM structure (actually move elements in cells) & data
        const $cell1 = $gridContainerElement.find(`.gem-cell[data-row='${gem1.row}'][data-col='${gem1.col}']`);
        const $cell2 = $gridContainerElement.find(`.gem-cell[data-row='${gem2.row}'][data-col='${gem2.col}']`);
        $cell1.empty().append(gem2.element.css({x:0, y:0}).data({row: gem1.row, col: gem1.col}));
        $cell2.empty().append(gem1.element.css({x:0, y:0}).data({row: gem2.row, col: gem2.col}));


        // Check for matches
        const matches = findAllMatches();
        if (matches.length > 0) {
            if (typeof playGameSfx === 'function') playGameSfxById('gem-match-sound');
            removeMatchedGems(matches);
            if (onMatchCallback) onMatchCallback(matches.length); // Notify scene
            gsap.delayedCall(0.75, () => { // Delay after gems fade
                refillGrid();
                // Check for cascading matches (complex, simplified for now)
                // let newMatches = findAllMatches();
                // while(newMatches.length > 0) { ... }
                isSwapping = false;
                firstSelectedGem = null;
                if (onMoveMadeCallback) onMoveMadeCallback(true);
            });
        } else { // No match, swap back
            if (typeof playGameSfx === 'function') playGameSfxById('gem-no-match-sound');
            // Visual swap back animation (GSAP)
            gsap.to(gem1.element, { x: gem2Pos.x - gem1Pos.x, y: gem2Pos.y - gem1Pos.y, duration: 0.3 });
            gsap.to(gem2.element, { x: gem1Pos.x - gem2Pos.x, y: gem1Pos.y - gem2Pos.y, duration: 0.3, onComplete: () => {
                // Update logical grid back
                const tempType2 = gemGrid[gem1.row][gem1.col];
                gemGrid[gem1.row][gem1.col] = gemGrid[gem2.row][gem2.col];
                gemGrid[gem2.row][gem2.col] = tempType2;
                // Update DOM structure back
                $cell1.empty().append(gem1.element.css({x:0, y:0}).data({row: gem1.row, col: gem1.col}));
                $cell2.empty().append(gem2.element.css({x:0, y:0}).data({row: gem2.row, col: gem2.col}));

                isSwapping = false;
                firstSelectedGem = null;
                if (onMoveMadeCallback) onMoveMadeCallback(false);
            }});
        }
    }});
    if (typeof playGameSfx === 'function') playGameSfxById('gem-swap-sound');
    firstSelectedGem = null; // Deselect after initiating swap
}


function findAllMatches() {
    let matches = [];
    // Check horizontal
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE - 2; c++) {
            if (gemGrid[r][c] && gemGrid[r][c] === gemGrid[r][c+1] && gemGrid[r][c] === gemGrid[r][c+2]) {
                matches.push({row:r, col:c}, {row:r, col:c+1}, {row:r, col:c+2});
            }
        }
    }
    // Check vertical
    for (let c = 0; c < GRID_SIZE; c++) {
        for (let r = 0; r < GRID_SIZE - 2; r++) {
            if (gemGrid[r][c] && gemGrid[r][c] === gemGrid[r+1][c] && gemGrid[r][c] === gemGrid[r+2][c]) {
                matches.push({row:r, col:c}, {row:r+1, col:c}, {row:r+2, col:c});
            }
        }
    }
    // Remove duplicates if a gem is part of both horizontal and vertical match
    return [...new Set(matches.map(m => JSON.stringify(m)))].map(s => JSON.parse(s));
}

function removeMatchedGems(matchedGems) {
    matchedGems.forEach(gemCoord => {
        const $cell = $gridContainerElement.find(`.gem-cell[data-row='${gemCoord.row}'][data-col='${gemCoord.col}']`);
        const $gemEl = $cell.find('.gem-item');
        if ($gemEl.length) {
            $gemEl.addClass('matched'); // Trigger CSS animation
            gsap.to($gemEl, {
                autoAlpha: 0, scale: 0.5, duration: 0.7, ease: "power1.in",
                onComplete: () => $gemEl.remove()
            });
        }
        gemGrid[gemCoord.row][gemCoord.col] = null; // Mark as empty in logical grid
    });
}

function refillGrid() {
    // Gems "fall down"
    for (let c = 0; c < GRID_SIZE; c++) {
        let emptySpacesInCol = 0;
        for (let r = GRID_SIZE - 1; r >= 0; r--) { // Start from bottom
            if (gemGrid[r][c] === null) {
                emptySpacesInCol++;
            } else if (emptySpacesInCol > 0) {
                // Move this gem down
                const gemToMoveType = gemGrid[r][c];
                gemGrid[r + emptySpacesInCol][c] = gemToMoveType; // Logical move
                gemGrid[r][c] = null;

                const $cellToMoveFrom = $gridContainerElement.find(`.gem-cell[data-row='${r}'][data-col='${c}']`);
                const $gemElement = $cellToMoveFrom.find('.gem-item');
                const $cellToMoveTo = $gridContainerElement.find(`.gem-cell[data-row='${r + emptySpacesInCol}'][data-col='${c}']`);

                if ($gemElement.length && $cellToMoveTo.length) {
                    $cellToMoveTo.append($gemElement.data({row: r + emptySpacesInCol, col: c})); // DOM move
                    // GSAP animation for falling
                    gsap.fromTo($gemElement,
                        { y: - (emptySpacesInCol * ($gemElement.height() + parseInt(getComputedStyle($gridContainerElement[0]).gap) || 5)) },
                        { y: 0, duration: 0.3 + emptySpacesInCol * 0.05, ease: "bounce.out" }
                    );
                }
            }
        }
        // Add new gems at the top for empty spaces
        for (let i = 0; i < emptySpacesInCol; i++) {
            const newGemType = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
            addGemToCell(i, c, newGemType, true); // true for isFalling animation
        }
    }
     if (typeof playGameSfx === 'function') playGameSfxById('gem-fall-sound');
    // Important: After refilling, check for new matches (cascades)
    // This is a recursive part that makes match-3 games complex.
    // For simplicity, we'll do one pass here. A full game needs a loop.
    const newMatches = findAllMatches();
    if (newMatches.length > 0) {
        console.log("Cascade match found!");
        if (typeof playGameSfx === 'function') playGameSfxById('gem-match-sound');
        removeMatchedGems(newMatches);
        if (onMatchCallback) onMatchCallback(newMatches.length);
        gsap.delayedCall(0.75, refillGrid); // Recursive call for cascades
    }
}