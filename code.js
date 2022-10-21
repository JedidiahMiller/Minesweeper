
// Globals

// 20x20
const xWidth = 20, yWidth = 20;
let gameRunning = true;
let firstClick = true;

// Bad variable name (Each block's chance to be a bomb is 1 in bombFrequency)
const bombFrequency = 6;

// Grid data (Not fully tested/implemented)
let bombCount = 0;
let flaggedSpots = 0;
let uncoveredSpots = 0;

// Run setup function (For default setup)
populateGrid(xWidth, yWidth);

// Grid v2 uses flex box and divs
// This creates the actual elements
// Populate grid assumes no residue grid elements
function populateGrid(xWidth, yWidth) {
        
    allRows = document.createElement("div");
    allRows.setAttribute("id", "allRows");

    for(let y=0; y<yWidth; y++) {

        const row = document.createElement("div");
        row.setAttribute("id", "row"+y);
        row.classList.add("row");

        for(let x=0; x<xWidth; x++) {

            const block = document.createElement("div");
            block.setAttribute("id", x + "/" + y);
            block.classList.add("block", "untouchedBlock")

            // regular click
            block.onclick = function() { tileClick("left", x, y);}

            // right click
            block.oncontextmenu = function() { tileClick("right", x, y); return false;}
            
            row.appendChild(block);

        }
        
        allRows.appendChild(row);
        
    }   

    board = document.getElementById("board");
    board.appendChild(allRows);

}

// Game mechanics

// Populate grid data
function createBombGrid(width, height, bombRatio) {
    
    const gridLayout = [];

    for(let i = 0; i<height; i++) {

        const row = [];

        for(let x = 0; x<width; x++) {

            isBomb = (Math.floor(Math.random()*bombFrequency) == 0);
            if (isBomb) {
                bombCount += 1;
            }
            row[x] = isBomb;

        }

        gridLayout[i] = row;

    }

    return gridLayout;

}

// Count bombs
function ajacentBombCount(x, y) {

    count = 0

    // sides
    if((y != 0)&&(gridLayout[y-1][x])) {
        count += 1;
    }
    if((x != (xWidth-1))&&(gridLayout[y][x+1])) {
        count += 1;
    }
    if((y != (yWidth-1))&&(gridLayout[y+1][x])) {
        count += 1;
    }
    if((x != 0)&&(gridLayout[y][x-1])) {
        count += 1;
    }

    // corners
    if((y != 0)&&(x != (xWidth-1))&&(gridLayout[y-1][x+1])) {
        count += 1;
    }
    if((x != (xWidth-1))&&(y != (yWidth-1))&&(gridLayout[y+1][x+1])) {
        count += 1;
    }
    if((y != (yWidth-1))&&(x != 0)&&(gridLayout[y+1][x-1])) {
        count += 1;
    }
    if((x != 0)&&(y != 0)&&(gridLayout[y-1][x-1])) {
        count += 1;
    }
    
    return count;

}

// Gameplay

// Void function
function tileClick(clickType, x, y) {

    console.log(clickType + " click on " + x + "/" + y);

    // If game isn't running, just ignore click
    if(!gameRunning) {return;} 

    clickedBlock = document.getElementById(x + "/" + y);

    // Also ignore click if block is already revealed to be empty
    if (clickedBlock.classList.contains("emptyBlock")) {
        return;
    }

    // Remove flag (Should be done first)
    if (clickedBlock.classList.contains("flaggedBlock")) {
        
        clickedBlock.classList.remove("flaggedBlock");
        clickedBlock.classList.add("untouchedBlock");

        flaggedSpots -= 1;

        console.log("Removed flag");
        return;
    }

    // First click
    if ((clickType == "left") && (firstClick)) {
        firstClick = false;
        gridLayout = createBombGrid(xWidth, yWidth, bombFrequency);
        clearSurroundingBombs(x, y);
        revealBlock(x, y);

        console.log("First click reveal");
        return;
    }

    // Bomb clicked
    if ((clickType == "left") && gridLayout[y][x]) {
        revealBlock(x, y);
        gameOver()

        console.log("Bomb hit");
        return;
    }

    // Block flagged
    if ((clickType == "right") && clickedBlock.classList.contains("untouchedBlock")) {

        clickedBlock.classList.remove("untouchedBlock");
        clickedBlock.classList.add("flaggedBlock");

        flaggedSpots += 1;

        console.log("flag placed");
        return;
    }

    // Show normal block

    if ((clickType == "left") && !gridLayout[y][x]) {
        revealBlock(x, y);

        console.log("normal click");
        return;
    }

}

function clearSurroundingBombs(x, y) {

    // Middle
    clearBlock(x, y);

    // Sides
    if(y != 0) {
        clearBlock(x, y-1);
    }
    if(x != (xWidth-1)) {
        clearBlock(x+1, y);
    }
    if(y != (yWidth-1)) {
        clearBlock(x, y+1);
    }
    if(x != 0) {
        clearBlock(x-1, y);
    }

    // Farther sides
    if(!(y <= 1)) {
        clearBlock(x, y-2);
    }
    if(!(x >= (xWidth-3))) {
        clearBlock(x+2, y);
    }
    if(!(y >= (yWidth-3))) {
        clearBlock(x, y+2);
    }
    if(!(x <= 1)) {
        clearBlock(x-2, y);
    }

    // corners
    if((y != 0)&&(x != (xWidth-1))) {
        clearBlock(x+1, y-1);
    }
    if((x != (xWidth-1))&&(y != (yWidth-1))) {
        clearBlock(x+1, y+1);
    }
    if((y != (yWidth-1))&&(x != 0)) {
        clearBlock(x-1, y+1);
    }
    if((x != 0)&&(y != 0)) {
        clearBlock(x-1, y-1);
    }

}

function clearBlock(x, y) {
    // Only triggers if it actually is a bomb
    if (gridLayout) {
        bombCount -=1;
        gridLayout[y][x] = false;
    }
}

function revealBlock(x, y) {

    block = document.getElementById(x + "/" + y);

    // Prevents death loops when revealSurroundings is called and finds empty blocks
    runSurroundings = block.classList.contains("untouchedBlock");

    block.classList.remove("untouchedBlock");

    // Reveal bomb
    if(gridLayout[y][x]) {

        block.classList.add("bombBlock");
        return "bomb";

    // Reveal empty block
    } else {

        block.classList.add("emptyBlock");

        // Bomb count
        ajacentBombs = ajacentBombCount(x, y);

        // Show count
        if(ajacentBombs>0) {

            block.innerHTML = ajacentBombs;

        // Dont show count, and reveal surrounding area (If it hasnt been done yet)
        } else {
            if (runSurroundings) {
                revealSurroundings(x, y);
                uncoveredSpots += 1;
            }
        }

        return "none"
        
    }
}

function revealSurroundings(x, y) {

    // Often creates recursive loop with revealBlock().
    // revealBlock() has code to prevent death loop

    // sides
    if(y != 0) {
        revealBlock(x, y-1);
    }
    if(x != (xWidth-1)) {
        revealBlock(x+1, y);
    }
    if(y != (yWidth-1)) {
        revealBlock(x, y+1);
    }
    if(x != 0) {
        revealBlock(x-1, y);
    }

    // corners
    if((y != 0)&&(x != (xWidth-1))) {
        revealBlock(x+1, y-1);
    }
    if((x != (xWidth-1))&&(y != (yWidth-1))) {
        revealBlock(x+1, y+1);
    }
    if((y != (yWidth-1))&&(x != 0)) {
        revealBlock(x-1, y+1);
    }
    if((x != 0)&&(y != 0)) {
        revealBlock(x-1, y-1);
    }
}

// Game over

function gameOver() {

    revealBoard()

}

function revealBoard() {
    
    for(let y = 0; y < yWidth; y += 1) {
        for(let x = 0; x < xWidth; x += 1) {
            revealBlock(x, y);
        }
    }

}

// Control panel

function resetGame() {
    for(let y = 0; y < yWidth; y += 1) {
        for(let x = 0; x < xWidth; x += 1) {

            block = document.getElementById(x + "/" + y);

            block.classList.remove("bombBlock");
            block.classList.remove("emptyBlock");
            block.classList.remove("flaggedBlock");
            block.innerHTML = "";

            bombCount = 0;
            flaggedSpots = 0;
            uncoveredSpots = 0;

            firstClick = true;
            
            block.classList.add("untouchedBlock");
            
        }
    }
}