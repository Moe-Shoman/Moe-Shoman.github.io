const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, canvas.width, canvas.height);
const grid = [];
let game;
let blocks = {};
let currentBlock;
let currentBlockName;
let currentPosition = []
let dropCount = 0;
let horizontalstart = 3;
let start;
let score = 0;
const scoreBoard = document.getElementById('score');
const highScoreBoard = document.getElementById('highScore');
const startButton = document.getElementById("startButton");
const gameOverImg = document.createElement("img");
gameOverImg.src = "images/gameOver.png";
gameOverImg.style.margin = "0px 500px";
gameOverImg.style.width = "300px";
let highScore = localStorage.getItem("HighScore") || 0;
scoreBoard.innerText = `SCORE ${score}`
highScoreBoard.innerText = `HIGHSCORE ${highScore}`;
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
        check: {}
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
    blocks[blockName].check[dir] = underPositions;
    for (var i = 0; i < pos.length; i++) {
        underPositions.push(pos[i]);
    }
}
checkAround("I", "down", [4, 0]);
checkAround("L", "down", [3, 0], [3, 1]);
checkAround("J", "down", [3, 1], [3, 2]);
checkAround("O", "down", [2, 0], [2, 1]);
checkAround("Z", "down", [1, 0], [2, 1], [2, 2]);
checkAround("S", "down", [2, 0], [2, 1], [1, 2]);
checkAround("T", "down", [2, 0], [2, 1], [2, 2]);
checkAround("I", "right", [0, 1], [1, 1], [2, 1], [3, 1]);
checkAround("L", "right", [0, 1], [1, 1], [2, 2]);
checkAround("J", "right", [0, 3], [1, 3], [2, 3]);
checkAround("O", "right", [0, 2], [1, 2]);
checkAround("Z", "right", [0, 2], [1, 3]);
checkAround("S", "right", [0, 3], [1, 2]);
checkAround("T", "right", [0, 2], [1, 3]);
checkAround("I", "left", [0, -1], [1, -1], [2, -1], [3, -1]);
checkAround("L", "left", [0, -1], [1, -1], [2, -1]);
checkAround("J", "left", [0, 1], [1, 1], [2, 0]);
checkAround("O", "left", [0, -1], [1, -1]);
checkAround("Z", "left", [0, -1], [1, 0]);
checkAround("S", "left", [0, 0], [1, -1]);
checkAround("T", "left", [0, 0], [1, -1]);

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

function addBlock(block, verticalDrop, horizontalOffset) {
    verticalDrop = verticalDrop || 0;
    horizontalOffset = horizontalstart;
    currentBlockName = currentBlockName || pickBlock();
    currentBlock = blocks[currentBlockName]['positions'];
    for (var i = 0; i < currentBlock.length; i++) {
        for (var j = 0; j < 4; j++) {
            if (currentBlock[i][j] === 1) {
                currentPosition.push([i + verticalDrop, j + horizontalOffset]);
                grid[i + verticalDrop][j + horizontalOffset] = 1;
            }
        }
    }
}

function checkDown() {
    let unders = blocks[currentBlockName].check.down;
    for (var i = 0; i < unders.length; i++) {
        if (((unders[i][0] + dropCount === 20) || grid[unders[i][0] + dropCount][(unders[i][1]) + horizontalstart])) {
            return false;
        }
    }
    return true;
}

function checkRight() {
    let rights = blocks[currentBlockName].check.right;
    for (var i = 0; i < rights.length; i++) {
        if (rights[i][1] + horizontalstart === 10 || grid[rights[i][0] + dropCount][(rights[i][1]) + horizontalstart]) {
            return false;
        }
    }
    return true;
}

function checkLeft() {
    let lefts = blocks[currentBlockName].check.right;
    for (var i = 0; i < lefts.length; i++) {
        if (lefts[i][1] + horizontalstart === 1 || grid[lefts[i][0] + dropCount][(lefts[i][1] + horizontalstart)]) {
            return false;
        }
    }
    return true;
}

function clearBlock() {
    for (var i = 0; i < currentPosition.length; i++) {
        let row = currentPosition[i][0];
        let cell = currentPosition[i][1];
        grid[row][cell] = 0;
    }
}

function drop() {
    if (checkDown()) {
        clearBlock();
        dropCount++;
        addBlock(currentBlockName, dropCount);
        score += 1;
    } else {
        currentPosition = [];
        dropCount = 0;
        horizontalstart = 3;
        currentBlockName = pickBlock()
        addBlock();
    }
}

function right() {
    if (checkRight()) {
        clearBlock();
        horizontalstart++;
        currentPosition = [];
        addBlock(currentBlockName, dropCount, horizontalstart);
    }
}

function left() {
    if (checkLeft()) {
        clearBlock();
        horizontalstart--;
        currentPosition = [];
        addBlock(currentBlockName, dropCount, horizontalstart);
    }
}

function drawBlock() {
    grid.forEach(function(row, y) {
        row.forEach(function(val, x) {
            if (val) {
                ctx.fillStyle = "red";
                ctx.fillRect(x * 30, y * 30, 30, 30);
                ctx.lineWidth = 1;
                ctx.strokeStyle = "rgb(128, 128, 128)"
                ctx.stroke();
            } else {
                ctx.fillStyle = "black";
                ctx.fillRect(x * 30, y * 30, 30, 30);
            }
        })
    })
}

document.addEventListener("keydown", event => {
    if (event.keyCode === 39) {
        right();
        drawBlock()
    } else if (event.keyCode === 37) {
        left();
        drawBlock();
    } else if (event.keyCode === 40) {
        drop();
        drawBlock();
    }
})

function checkLineClear() {
    grid.forEach(function(line, index) {
        if (line.every(c => c === 1)) {
            let cleared = line.fill(0);
            score += 100;
            grid.splice(index, 1);
            grid.unshift(cleared);
        }
    })
}

function emptyLine() {
    checkLineClear();
    drawBlock();
}

function clearLines() {
    if (!checkDown()) {
        emptyLine();
    }
}

function updateScore() {
    scoreBoard.innerHTML = `SCORE ${score}`;
    highScoreBoard.innerHTML = `HIGHSCORE ${highScore}`;
}
function updateHighScore() {
  if(score > highScore){
    localStorage.setItem("HighScore", score);
  }
}
function gameOver() {
    if (dropCount === 0 && !checkDown()) {
        canvas.style.visibility = 'hidden';
        document.body.insertBefore(gameOverImg, document.body.firstChild);
        clearInterval(game);
        updateHighScore();
    }
}
startButton.addEventListener("click", event => {
    event.target.style.visibility = "hidden";
    addBlock();
    drawBlock();
    game = setInterval(function() {
        drop();
        clearLines();
        updateScore();
        drawBlock();
        gameOver();
    }, 700)
})
