
// 20x20

const xWidth = 10, yWidth = 10;

populateGrid(xWidth, yWidth);


function populateGrid(xWidth, yWidth) {

    for(let y=0; y<yWidth; y++) {

        const row = document.createElement("tr");
        row.setAttribute("id", "row"+y);

        for(let x=0; x<xWidth; x++) {
            const block = document.createElement("td");
            block.setAttribute("id", x+"/"+y);
            row.appendChild(block);
        }
        
        board = document.getElementById("board");
        console.log(board);
        board.appendChild(row);

    }   
}
