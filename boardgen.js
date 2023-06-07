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
let snakeTiles = [];
let appleTiles = [];
let direction = "left";
let lastMove = "left";

//Debug-Grid generator
/*for (let i=1; i<=641; i+=20) {
    grid.moveTo(i, 0);
    grid.lineTo(i, 641);
    grid.moveTo(0, i);
    grid.lineTo(641, i);
}*/

//board outer border
grid.rect(0, 0, 642, 642);
grid.stroke();


//initial snake figure generation
snake.fillStyle = "black";

for (let j=0; j<=3; j++) {
    let x = 321 + j * 20;
    let y = 321;
    snake.fillRect(x, y, 20, 20);
    snakeTiles.push({x: x, y: y});
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
        snake.clearRect(a, b, 20, 20);
        snakeTiles.pop();
    }

    //on collision with another snake tile, game over
    if (checkCollision(x,y) == "snakeCollision") {
        clearInterval(snakeInt);
        clearInterval(appleInt);
        return "Game Over";
    }

    //add new snake tile ahead
    snake.fillStyle = "black";
    snake.fillRect(x, y, 20, 20);
    snakeTiles.unshift({x: x, y: y});
}

let snakeInt = setInterval(moveSnake, 150);

function spawnApple() {
    let x,y;
    do {
        x = Math.floor(Math.random()*32)*20+1;
        y = Math.floor(Math.random()*32)*20+1;
    } while (checkCollision(x,y) != "moveOn");

    apple.fillStyle = "green";
    apple.fillRect(x, y, 20, 20);
    appleTiles.push({x: x, y: y});
}

spawnApple();

let appleInt = setInterval(spawnApple, 5000);

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
    return event;
}