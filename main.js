const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, canvas.width, canvas.height);
const grid = [];

function createGrid() {
    //draw lines down
    ctx.beginPath();
    for (var x = 0; x < canvas.width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    //draw lines across
    for (var y = 0; y < canvas.height; y += 30) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y)
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(128, 128, 128)"
    ctx.stroke();

}
createGrid();
let blocks = {};
// Creates 4 arrays of positions for each block and places it in blocks Object.
function blockObjMaker(blockName, ...ind) {
    let positions = [];
    for (var i = 0; i < 16; i++) {
        if (ind.indexOf(i) === -1) {
            positions[i] = 0;
        } else {
            positions[i] = 1;
        }
    }
    positions = [positions.slice(0, 4), positions.slice(4, 8), positions.slice(8, 12), positions.slice(12, 16)];
    blocks[blockName] = {
    positions: positions,
  }
}
blockObjMaker("I", 0, 4, 8, 12);
blockObjMaker("L", 0, 4, 8, 9);
blockObjMaker("J", 2, 6, 9, 10);
blockObjMaker("O", 0, 1, 4, 5);
blockObjMaker("Z", 0, 1, 5, 6);
blockObjMaker("S", 1, 2, 4, 5);
blockObjMaker("T", 1, 4, 5, 6);

function checkAround(blockName, dir, ...pos) {
  let underPositions = [];
  blocks[blockName].check = {};
  for (var i = 0; i < pos.length; i++) {
    underPositions.push(pos[i]);
    blocks[blockName].check[dir] = underPositions;
  }
}
// checkAround("I", "down",  currentPosition[4]);
checkAround("L", "down", [3,0], [3,1]);
checkAround("J", "down", [3,1], [3,2]);
checkAround("O", "down", [2,0], [2,1]);
checkAround("Z", "down", [1,0], [2,1], [2,2]);
checkAround("S", "down", [2, 0], [2,1], [1,2]);
checkAround("T", "down", [2, 0], [2,1], [2,2]);
function gridPositions() {
    for (var i = 0; i < 20; i++) {
        grid.push(new Array(10).fill(0));
    }
}
gridPositions();

function pickBlock() {
    const blockNames = ["I", "L", "J", "O", "Z", "S", "T"];
    return blockNames[Math.floor(blockNames.length * Math.random())];
}
let currentBlock;
let currentBlockName = null;
let currentPosition = []
function addBlock(vertiocalDrop) {
    currentBlockName = pickBlock();
    currentBlock = blocks[currentBlockName]['positions'];
    for (var i = 0; i < currentBlock.length; i++) {
        for (var j = 0; j < 4; j++) {
            if (currentBlock[i][j] === 1) {
              currentPosition.push([i, j +3]);
                grid[i + vertiocalDrop][j + 3] += 1;
            }
        }
    }
}
// function checkDownCollision() {
//   for (var i = 3; i > 0; i--) {
//
//   }
// }
function drop() {
  console.log(blocks[currentBlockName].check.down);
}
function drawBlock() {
    grid.forEach(function(row, y) {
        row.forEach(function(val, x) {
            if (val) {
                ctx.fillStyle = "red";
                ctx.fillRect(x * 30, y * 30, 30, 30);
            }
        })
    })
}
