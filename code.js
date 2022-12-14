
// Globals

// Game settings

var mode = 1;

// Game stats

var timerInterval = 0;

// 20x20
var xWidth = 10, yWidth = 10;
var gameRunning = true;
var isFirstClick = true;

const bombFrequency = 6;

// Grid data
var bombCount = 0;
var unmarkedSpots = xWidth * yWidth;
var gridLayout; 

// Run setup function (For default setup)
createBoard(xWidth, yWidth);
setGameMode(1);

// Grid v2 uses flex box and divs
// This creates the actual elements
// Populate grid assumes no residue grid elements
function createBoard(xWidth, yWidth) {
        
    allRows = document.createElement("div");
    allRows.setAttribute("id", "allRows");

    for(var y=0; y<yWidth; y++) {

        const row = document.createElement("div");
        row.setAttribute("id", "row"+y);
        row.classList.add("row");

        for(var x=0; x<xWidth; x++) {

            const block = document.createElement("div");
            block.setAttribute("id", x + "/" + y);
            block.classList.add("block", "untouchedBlock")

            // regular click
            block.onclick = function() {tileClick("left", block);}

            // right click
            block.oncontextmenu = function() { tileClick("right", block); return false;}
            
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
    
    const layout = [];

    for(var i = 0; i<height; i++) {

        const row = [];

        for(var x = 0; x<width; x++) {

            isBomb = (Math.floor(Math.random()*bombFrequency) == 0);
            if (isBomb) {
                bombCount += 1;
            }
            row[x] = isBomb;

        }

        layout[i] = row;

    }

    gridLayout = layout;
  
}

function idToCoords(id) {
    split = id.split("/");
    return split;
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

function updateGame() {

    if(unmarkedSpots == 0) {
        gameOver();
    }

}

function firstClick(x, y) {
    isFirstClick = false;
    createBombGrid(xWidth, yWidth, bombFrequency);
    clearSurroundingBombs(x, y);
    revealBlock(x, y);
    startTimer();

    console.log("First click reveal");
}

// Void function
function tileClick(clickType, block) {
    updateGame();
    console.log(clickType + " click on " + block.id);
    console.log(gridLayout);

    // If game isn't running, just ignore click
    if(!gameRunning) {return;} 

    clickedBlock = block;
    
    coords = idToCoords(clickedBlock.id);
    x = parseInt(coords[0]);
    y = parseInt(coords[1]);
    console.log(coords);

    // Also ignore click if block is already revealed to be empty
    if (clickedBlock.classList.contains("emptyBlock")) {
        return;
    }

    // Remove flag (Should be done first)
    if (clickedBlock.classList.contains("flaggedBlock")) {
        
        clickedBlock.classList.remove("flaggedBlock");
        clickedBlock.classList.add("untouchedBlock");

        unmarkedSpots += 1;
        updateGame();

        console.log("Removed flag");
        return;
    } 

    // First click
    if ((clickType == "left") && (isFirstClick)) {

        firstClick(x, y);
        return;
    }

    // Bomb clicked
    if ((clickType == "left") && gridLayout[y][x]) {
        revealBlock(x, y);
        gameOver();

        console.log("Bomb hit");
        return;
    }

    // Block flagged
    if ((clickType == "right") && clickedBlock.classList.contains("untouchedBlock")) {

        clickedBlock.classList.remove("untouchedBlock");
        clickedBlock.classList.add("flaggedBlock");

        unmarkedSpots -= 1;

        updateGame();

        console.log("flag placed");
        return;
    }

    // Show normal block

    if ((clickType == "left") && !gridLayout[y][x]) {
        revealBlock(x, y);
        updateGame();

        console.log("normal click");
        return;
    }

}

// Clear just means in a memory sense. Does not touch element classes
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
    if (gridLayout[y][x]) {
        bombCount -=1;
        gridLayout[y][x] = false;
    }
}

// Show either an empty space or a bomb (Whether its flagged is irrelivant)
function revealBlock(x, y) {

    block = document.getElementById(x + "/" + y);

    // Prevents death loops when revealSurroundings is called and finds empty blocks
    // Only reveals surroundings if the block is completely untouched
    neverHit = block.classList.contains("untouchedBlock");

    block.classList.remove("untouchedBlock");
    
    if (neverHit) {
        unmarkedSpots -= 1;
    }

    // Reveal bomb
    if(gridLayout[y][x]) {

        block.classList.add("bombBlock");
        if (!gameOver) {
            updateGame()
        }
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
            if (neverHit) {
                revealSurroundings(x, y);
            }
        }

        if (!gameOver) {
            updateGame()
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

    console.log("Game over");
    gameRunning = false;
    revealBoard();
    stopTimer();

}

function revealBoard() {
    
    for(var y = 0; y < yWidth; y += 1) {
        for(var x = 0; x < xWidth; x += 1) {
            revealBlock(x, y);
        }
    }

}

// Control panel

function setGameMode(difficulty) {

    button = document.getElementById("mode" + difficulty);
    allButtons = document.getElementById("gameMode").childNodes;
    for(var i = 1; i<=3;i+=1) {
        b = document.getElementById("mode" + i);
        b.classList.remove("gameModeButtonSelected");
    }
    button.classList.add("gameModeButtonSelected");
    resetGame();
    mode = difficulty;
    destroyBoard();
    xWidth = yWidth = (difficulty*10);
    createBoard(xWidth, yWidth);

}

function destroyBoard() {

    block = document.getElementById("board");
    
    while (block.firstChild) {
        block.removeChild(block.firstChild);
    }

}

function resetGame() {
    for(var y = 0; y < yWidth; y += 1) {
        for(var x = 0; x < xWidth; x += 1) {

            block = document.getElementById(x + "/" + y);

            block.classList.remove("bombBlock");
            block.classList.remove("emptyBlock");
            block.classList.remove("flaggedBlock");
            block.innerHTML = "";

            const area = xWidth * yWidth;
            unmarkedSpots = area;
            stopTimer();
            resetTimer();

            isFirstClick = true;
            gameRunning = true;
            
            block.classList.add("untouchedBlock");
            
        }
    }
}

function startTimer() {
    var start = Date.now();
    timerInterval = setInterval(function() {
        var delta = Date.now() - start;
        timerElement = document.getElementById("timer");
        time = Math.floor(delta / 1000);
        min = Math.floor(time/60);
        sec = time%60;
        if (sec<10) {sec = "0" + sec;}
        timerElement.innerHTML = min + ":" + sec;
    }, 1000)
}

function stopTimer() {
    window.clearInterval(timerInterval);
}

function resetTimer() {
    timerElement = document.getElementById("timer");
    timerElement.innerHTML = "0:00";
}

