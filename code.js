
// 20x20

const xWidth = 10, yWidth = 10;

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
            row.appendChild(block);
        }
        
        allRows.appendChild(row);
        
    }   

    board = document.getElementById("board");
    console.log(board);
    board.appendChild(allRows);

}
