/*
Roadmap for v1.x:
- add Mine spawn and mine collision handler
- add starting screen / start button
- add reset on game over
- add game difficulty options (three presets)
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
let difficulty = 1;

//Debug-Grid generator
/*for (let i=1; i<=641; i+=20) {
    grid.moveTo(i, 0);
    grid.lineTo(i, 641);
    grid.moveTo(0, i);
    grid.lineTo(641, i);
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
        appleInt = setInterval(spawnApple, 7000);
    } else if (difficulty == 1) {
        snakeInt = setInterval(moveSnake, 150);
        appleInt = setInterval(spawnApple, 5000);
        mineInt = setInterval(spawnMine, 8000);
        demineInt = setInterval(despawnMine, 15000);
    } else if  (difficulty == 2) {
        snakeInt = setInterval(moveSnake, 75);
        appleInt = setInterval(spawnApple, 3000);
        mineInt = setInterval(spawnMine, 3000);
        demineInt = setInterval(despawnMine, 15000);
    }
    spawnApple();
}

//basic controls w,a,s,d and arrow keys, checks for and ignores 180° turns
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

    //determin location of next tile, save movement direction for 180° check on controls
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

    //only remove last snake tile if no apple is eaten this turn
    if (checkCollision(x,y) != "appleCollision") {
        let a = snakeTiles[snakeTiles.length - 1].x;
        let b = snakeTiles[snakeTiles.length - 1].y;
        snake.fillStyle = "#3c3c3c";
        snake.fillRect(a, b, 20, 20);
        snakeTiles.pop();
    }

    //on collision with another snake tile, game over
    if (checkCollision(x,y) == "snakeCollision") {
        clearInterval(snakeInt);
        clearInterval(appleInt);
        clearInterval(mineInt);
        clearInterval(demineInt);
        gameOver();
        return "Game Over";
    }

    //add new snake tile ahead
    snake.fillStyle = "#2aa4cd";
    snake.fillRect(x, y, 20, 20);
    snakeTiles.unshift({x: x, y: y});
}

function spawnApple() {
    let x,y;
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
    appleTiles.forEach((tile) => {
        if (tile.x == a && tile.y == b) {
            appleTiles.splice(appleTiles.indexOf(tile), 1);
            event = "appleCollision";
        };
    });
    mineTiles.forEach((tile) => {
        if (tile.x == a && tile.y == b) {
            clearInterval(snakeInt);
            clearInterval(appleInt);
            clearInterval(mineInt);
            clearInterval(demineInt);
            gameOver();
            return "Game Over";
        };
    });
    return event;
}

function spawnMine() {
    let x,y;
    if (mineTiles.length <= 15*difficulty) {
        do {
            x = Math.floor(Math.random()*32)*20+1;
            y = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(x,y) != "moveOn");
        
        //prevent Mines from spawning less than 5 tiles ahead in moving direction
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
    grid.fillStyle = "#eeeeee";
    grid.font = "40px Arial";
    grid.textAlign = "center";
    grid.fillText("Game Over!", 320, 320);
}

function setEasyMode() {
    difficulty = 0;
}

function setIntermediateMode() {
    difficulty = 1;
}

function setHardMode() {
    difficulty = 2;
}