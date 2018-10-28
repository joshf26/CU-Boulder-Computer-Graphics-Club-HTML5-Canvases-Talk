const WIDTH = 500;
const HEIGHT = 500;
const TILE_SIZE = 25;
const NUM_TILES_X = WIDTH/TILE_SIZE;
const NUM_TILES_Y = HEIGHT/TILE_SIZE;
const NUM_TILES = NUM_TILES_X * NUM_TILES_Y;
const STEP_INTERVAL = 100;

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let posX = Math.floor(NUM_TILES_X/2);
let posY = Math.floor(NUM_TILES_Y/2);
let direction = 'N';
let oldDirection = 'N';
let buffer = [];
let nextStepIncrease = false;

let foodX = 0;
let foodY = 0;

let score = 0;

function drawSnakePiece(x, y) {
    context.fillStyle = "#000000";
    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function clearTile(x, y) {
    context.fillStyle = "#FFFFFF";
    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function step() {
    console.log("test!");

    oldDirection = direction;

    if (!nextStepIncrease) {
        let tailPos = buffer.shift();
        if (tailPos) clearTile(tailPos[0], tailPos[1]);
    }
    else nextStepIncrease = false;

    if (direction === 'N') posY--;
    else if (direction === 'E') posX++;
    else if (direction === 'S') posY++;
    else if (direction === 'W') posX--;

    // Check if self is hit.
    for (let bufferElement of buffer)
        if (bufferElement.toString() === [posX, posY].toString())
            die(false);

    // Check if side is hit.
    if (posX >= NUM_TILES_X || posX < 0 || posY >= NUM_TILES_Y || posY < 0)
        die(false);

    // Check if food is hit.
    if (posX === foodX && posY === foodY) {
        score++;
        nextStepIncrease = true;
    }

    drawSnakePiece(posX, posY);
    buffer.push([posX, posY]);

    if (nextStepIncrease) {
        // If we have filled up the whole board, we win!
        if (buffer.length === NUM_TILES) {
            die(true);
            return;
        }
        addFood();
    }
}

function addFood() {
    // We have to make sure to not place a piece of food in an occupied tile.
    let good = false;
    while (!good) {
        foodX = Math.floor(Math.random() * NUM_TILES_X);
        foodY = Math.floor(Math.random() * NUM_TILES_Y);

        good = true;
        for (let bufferElement of buffer)
            if (bufferElement.toString() === [foodX, foodY].toString())
                good = false;
    }

    context.fillStyle = "#FF0000";
    context.fillRect(foodX * TILE_SIZE, foodY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function die(win) {
    if (win) alert('You win! Score: ' + score);
    else alert('You lose! Score: ' + score);
    window.location.reload();
}

document.addEventListener('keydown', function(event) {
         if (event.keyCode === 37 && oldDirection !== 'E') direction = 'W';
    else if (event.keyCode === 38 && oldDirection !== 'S') direction = 'N';
    else if (event.keyCode === 39 && oldDirection !== 'W') direction = 'E';
    else if (event.keyCode === 40 && oldDirection !== 'N') direction = 'S';
});

setInterval(step, STEP_INTERVAL);
step();
addFood();
