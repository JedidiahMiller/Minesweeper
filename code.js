

// 20x20
const xWidth = 20, yWidth = 20;

// Bad variable name
const oneIn = 10;

// Run setup function
populateGrid(xWidth, yWidth);

// Grid v2 uses flex box and divs

function populateGrid(xWidth, yWidth) {
        
    allRows = document.createElement("div");
    allRows.setAttribute("id", "allRows");

    for(let y=0; y<yWidth; y++) {

        const row = document.createElement("div");
        row.setAttribute("id", "row"+y);
        row.setAttribute("class", "row");

        for(let x=0; x<xWidth; x++) {

            const block = document.createElement("div");
            block.setAttribute("id", x + "/" + y);
            block.setAttribute("class", "blockItem");

            block.onclick = // On block click function

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
const bombCount = MATH.floor(area/10);

createBombGrid(xWidth, yWidth, bombCount)

function createBombGrid(width, height, bombRatio) {

    const gridLayout = [];

    for(let i = 0; i<height; i++) {

        const row = [];

        for(let x = 0; x<width; x++) {

            row[x] = ((Math.floor(Math.random() * bombRatio)) == 1);

        }

        gridLayout[i] = row;

    }
}

