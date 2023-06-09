/*Roadmap for v2.0
- add 1-tile enemies
- allow enemies to randomly move to free tiles, if available
- game over on enemy collision
- add solid, impassable walls (entire tiles for now, maybe 2px borders later)
- game over on wall collision
- add enemy 4-tile snakes
- make enemy snakes look for free tiles in movement direction
- have enemy snakes die when no free tile is available for their next move
- have enemy snakes grow on apple collision
- game over on collision with enemy snake
- add adventure mode
- add the first 5 pre-made levels and challenges
*/

const board = document.querySelector("#board");
let grid = board.getContext("2d");
let snake = board.getContext("2d");
let apple = board.getContext("2d");
let mine = board.getContext("2d");
let snakeTiles = [];
let appleTiles = [];
let mineTiles = [];
let direction = "left";
let lastMove = "left";
let snakeInt;
let appleInt;
let mineInt;
let demineInt;
let difficulty = 2;
let bleep = new Audio("./bleep.mp3");
let boom = new Audio("./boom.mp3");
let hurt = new Audio("./hurt.mp3");
let maxMines;

//Debug-Grid generator
/*for (let i=1; i<=641; i+=20) {
    grid.moveTo(i, 0);
    grid.lineTo(i, 641);
    grid.moveTo(0, i);
    grid.lineTo(641, i);
    grid.stroke();
}*/

//board outer border
grid.rect(0, 0, 642, 642);
grid.strokeStyle = "#bbbbbb";
grid.stroke();
grid.fillStyle= "#3c3c3c"
grid.fillRect(1, 1, 640, 640);

function startGame() {
    //reset tile arrays, move direction, intervals and board
    snakeTiles = [];
    appleTiles = [];
    mineTiles = [];
    direction = "left";
    lastMove = "left";
    clearInterval(snakeInt);
    clearInterval(appleInt);
    clearInterval(mineInt);
    clearInterval(demineInt);
    grid.fillStyle= "#3c3c3c"
    grid.fillRect(1, 1, 640, 640);
    document.querySelector("#customconfirm").classList.remove('show');
    
    //initial snake figure generation
    snake.fillStyle = "#2aa4cd";
    for (let j=0; j<=3; j++) {
        let x = 321 + j * 20;
        let y = 321;
        snake.fillRect(x, y, 20, 20);
        snakeTiles.push({x: x, y: y});
    }
    
    //initialize movement and item spawns
    if (difficulty == 0) {
        snakeInt = setInterval(moveSnake, 250);
        appleInt = setInterval(spawnApple, 7500);
        maxMines = 0;
    } else if (difficulty == 1) {
        snakeInt = setInterval(moveSnake, 200);
        appleInt = setInterval(spawnApple, 6000);
        mineInt = setInterval(spawnMine, 10000);
        demineInt = setInterval(despawnMine, 12000);
        maxMines = 10;
    } else if  (difficulty == 2) {
        snakeInt = setInterval(moveSnake, 150);
        appleInt = setInterval(spawnApple, 4500);
        mineInt = setInterval(spawnMine, 6000);
        demineInt = setInterval(despawnMine, 12000);
        maxMines = 20;
    } else if  (difficulty == 3) {
        snakeInt = setInterval(moveSnake, 100);
        appleInt = setInterval(spawnApple, 3000);
        mineInt = setInterval(spawnMine, 4500);
        demineInt = setInterval(despawnMine, 12000);
        maxMines = 30;
    } else if  (difficulty == 4) {
        snakeInt = setInterval(moveSnake, 75);
        appleInt = setInterval(spawnApple, 3000);
        mineInt = setInterval(spawnMine, 3000);
        demineInt = setInterval(despawnMine, 15000);
        maxMines = 50;
    } else if (difficulty == 'custom') {
        document.querySelector("#customconfirm").classList.add('show');
        snakeInt = setInterval(moveSnake, document.querySelector("#snakeInt").value);
        appleInt = setInterval(spawnApple, document.querySelector("#appleInt").value);
        mineInt = setInterval(spawnMine, document.querySelector("#mineInt").value);
        demineInt = setInterval(despawnMine, document.querySelector("#demineInt").value);
        maxMines = document.querySelector("#maxMines").value;
    }
    spawnApple();
}

//basic controls w,a,s,d and arrow keys, checks for and blocks 180° turns
document.onkeydown = (e) => {
    switch (e.key) {
        case "ArrowLeft":
        case "a":
            if(lastMove != "right") {
                direction = "left";
            }
            break;
        case "ArrowRight":
        case "d":
            if(lastMove != "left") {
                direction = "right";
            }
            break;
        case "ArrowUp":
        case "w":
            if(lastMove != "down") {
                direction = "up";
            }
            break;
        case "ArrowDown":
        case "s":
            if(lastMove != "up") {
                direction = "down";
            }
            break;
    }
}

function moveSnake() {
    let x = snakeTiles[0].x;
    let y = snakeTiles[0].y;

    //determin location of next tile, save latest movement direction for 180° check on controls
    if (direction == "left") {
        lastMove = "left";
        x = x-20;
        if (x == -19) {
            x = 621;
        }
    } else if (direction == "right") {
        lastMove = "right";
        x = x+20;
        if (x == 641) {
            x = 1;
        }
    } else if (direction == "up") {
        lastMove = "up";
        y = y-20;
        if (y == -19) {
            y = 621;
        }
    } else if (direction == "down") {
        lastMove = "down";
        y = y+20;
        if (y == 641) {
            y = 1;
        }
    }

    //remove last snake tile if no apple is eaten this turn
    if (checkCollision(x,y)[0] != "appleCollision") {
        let a = snakeTiles[snakeTiles.length - 1].x;
        let b = snakeTiles[snakeTiles.length - 1].y;
        snake.fillStyle = "#3c3c3c";
        snake.fillRect(a, b, 20, 20);
        snakeTiles.pop();
    } else {
        appleTiles.splice(checkCollision(x,y)[1], 1);
        bleep.play();
    }

    //on mine or snake collision, game over
    if (checkCollision(x,y) == "snakeCollision") {
        hurt.play();
        gameOver();
    } else if (checkCollision(x,y) == "mineCollision") {
        boom.play();
        gameOver();
    }

    //add new snake tile ahead
    snake.fillStyle = "#2aa4cd";
    snake.fillRect(x, y, 20, 20);
    snakeTiles.unshift({x: x, y: y});
}

function spawnApple() {
    let x,y;

    //select random tiles until a vacant tile is found
    do {
        x = Math.floor(Math.random()*32)*20+1;
        y = Math.floor(Math.random()*32)*20+1;
    } while (checkCollision(x,y) != "moveOn");

    apple.fillStyle = "#a2c037";
    apple.fillRect(x, y, 20, 20);
    appleTiles.push({x: x, y: y});
}

function checkCollision(a, b) {
    let event = "moveOn";

    snakeTiles.forEach((tile) => {
        if (tile.x == a && tile.y == b) {
            event = "snakeCollision";
        };
    });

    //removing apples on collision check should be done in moveSnake() in the future
    appleTiles.forEach((tile) => {
        if (tile.x == a && tile.y == b) {
            event = ["appleCollision", appleTiles.indexOf(tile)];
        };
    });

    mineTiles.forEach((tile) => {
        if (tile.x == a && tile.y == b) {
            event = "mineCollision";
        };
    });
    //returns the appropriate collision, if any was found, or moveOn if not
    return event;
}

function spawnMine() {
    let x,y;

    if (mineTiles.length < maxMines) {
        //select random tiles, until free tile is found
        do {
            x = Math.floor(Math.random()*32)*20+1;
            y = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(x,y) != "moveOn");
        
        //prevent Mines from spawning less than 5 tiles ahead from snake head in recent moving direction
        if((direction == "left" && y == snakeTiles[0].y && x > (snakeTiles[0].x - 100) && x < snakeTiles.x) ||
        (direction == "right" && y == snakeTiles[0].y && x < (snakeTiles[0].x + 100) && x > snakeTiles.x) ||
        (direction == "up" && x == snakeTiles[0].x && y > (snakeTiles[0].y - 100) && y < snakeTiles.y) ||
        (direction == "down" && x == snakeTiles[0].x && y < (snakeTiles[0].y + 100) && y > snakeTiles.y)) {
            return;
        }

        mine.fillStyle = "red";
        mine.fillRect(x, y, 20, 20);
        mineTiles.push({x: x, y: y});
    }
}

function despawnMine() {
    let a = mineTiles[0].x;
    let b = mineTiles[0].y;
    mine.fillStyle = "#3c3c3c";
    mine.fillRect(a, b, 20, 20);
    mineTiles.shift();
}

function gameOver() {
    clearInterval(snakeInt);
    clearInterval(appleInt);
    clearInterval(mineInt);
    clearInterval(demineInt);
    grid.fillStyle = "#eeeeee";
    grid.font = "40px Arial";
    grid.textAlign = "center";
    grid.fillText("Game Over!", 320, 320);
}

function setDifficulty(d) {
    difficulty = d;
}

function toggleCustomSetup() {
    document.querySelector("#customwrapper").classList.toggle('show');
}

function toggleSounds() {
    if (bleep.muted == true) {
        bleep.muted = false;
        boom.muted = false;
        hurt.muted = false;
    } else {
        bleep.muted = true;
        boom.muted = true;
        hurt.muted = true;
    }
}