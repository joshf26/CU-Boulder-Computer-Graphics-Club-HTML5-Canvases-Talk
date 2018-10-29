const NUM_TILES_X = 20;
const NUM_TILES_Y = 20;
const TILE_SIZE = 25;
const STEP_INTERVAL = 100;
const NUM_TILES = NUM_TILES_X * NUM_TILES_Y;

const startButton = document.getElementById('start-button');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let posX = Math.floor(NUM_TILES_X/2);
let posY = Math.floor(NUM_TILES_Y/2);
let direction = 'N';
let oldDirection = 'N';
let buffer = [];
let ateFood = false;
let foodX, foodY;
let score = 0;

function drawSnakePiece(x, y) {
    context.fillStyle = "#000000";
    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawDigestedFood(x, y) {
    context.fillStyle = '#FF0000';

    context.beginPath();
    context.arc((x+0.5) * TILE_SIZE, (y+0.5) * TILE_SIZE, TILE_SIZE/4, 0, 2*Math.PI, false);
    context.closePath();

    context.fill();
}

function clearTile(x, y) {
    context.fillStyle = "#FFFFFF";
    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function tileHasSnakePiece(x, y) {
    for (const bufferElement of buffer)
        if (bufferElement.toString() === [x, y].toString())
            return true;
    return false;
}

function addFood() {
    // We have to make sure to not place a piece of food in an occupied tile.
    do {
        foodX = Math.floor(Math.random() * NUM_TILES_X);
        foodY = Math.floor(Math.random() * NUM_TILES_Y);
    }
    while (tileHasSnakePiece(foodX, foodY));

    context.fillStyle = "#FF0000";
    context.fillRect(foodX * TILE_SIZE, foodY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function die(win) {
    if (win) alert('You win! Score: ' + score);
    else alert('You lose! Score: ' + score);

    window.location.reload();

    throw new Error();
}

function step() {
    oldDirection = direction;

    if (!ateFood) {
        const tailPos = buffer.shift();
        if (tailPos) clearTile(tailPos[0], tailPos[1]);
    }
    else ateFood = false;

    if (direction === 'N') posY--;
    else if (direction === 'E') posX++;
    else if (direction === 'S') posY++;
    else if (direction === 'W') posX--;

    // Check if self is hit.
    if (tileHasSnakePiece(posX, posY))
        die(false);

    // Check if side is hit.
    if (posX >= NUM_TILES_X || posX < 0 || posY >= NUM_TILES_Y || posY < 0)
        die(false);

    // Check if food is hit.
    if (posX === foodX && posY === foodY) {
        score++;
        ateFood = true;
    }

    drawSnakePiece(posX, posY);
    buffer.push([posX, posY]);

    if (ateFood) {
        // If we have filled up the whole board, we win!
        if (buffer.length === NUM_TILES)
            die(true);

        drawDigestedFood(posX, posY);
        addFood();
    }
}

startButton.addEventListener('click', function () {
    startButton.style.display = 'none';

    setInterval(step, STEP_INTERVAL);

    document.addEventListener('keydown', function(event) {
             if (event.keyCode === 37 && oldDirection !== 'E') direction = 'W';
        else if (event.keyCode === 38 && oldDirection !== 'S') direction = 'N';
        else if (event.keyCode === 39 && oldDirection !== 'W') direction = 'E';
        else if (event.keyCode === 40 && oldDirection !== 'N') direction = 'S';
    });
});

step();
addFood();
