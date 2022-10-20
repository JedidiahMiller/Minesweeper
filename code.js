

// 20x20
const xWidth = 20, yWidth = 20;

// Bad variable name
const bombFrequency = 5;

// Run setup function
populateGrid(xWidth, yWidth);

// Grid v2 uses flex box and divs

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

            block.onclick = function clickAction() {console.log(x + "/" + y); tileClick(x, y);}

            row.appendChild(block);

        }
        
        allRows.appendChild(row);
        
    }   

    board = document.getElementById("board");
    console.log(board);
    board.appendChild(allRows);

}

// Game mechanics

const area = xWidth*yWidth;
const bombCount = Math.floor(area/10);

gridLayout = createBombGrid(xWidth, yWidth, bombCount);

// Populate grid data
function createBombGrid(width, height, bombRatio) {

    const gridLayout = [];

    for(let i = 0; i<height; i++) {

        const row = [];

        for(let x = 0; x<width; x++) {

            row[x] = (Math.floor(Math.random()*bombFrequency) == 0);

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

function tileClick(x, y) {

    clickedBlock = document.getElementById(x + "/" + y);
    clickedBlock.classList.remove("untouchedBlock");

    if(gridLayout[y][x]) {
        clickedBlock.classList.add("bombBlock");
    } else {
        clickedBlock.classList.add("emptyBlock");
    }

    
    
}