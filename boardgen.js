/*1st iteration:
set up board
2nd iteration:
set up game figures
3rd iteration:
add basic controls to snake
4th iteration:
add apple spawning
5th iteration:
add collision detection
6th iteration:
add snake growth
7th iteration:
reset condition*/

/*
//select canvas-element and save it as a variable
const c = document.querySelector("#board");
//define a drawing method
let ctx = c.getContext("2d");
//move brush to coordinates (x, y)
ctx.moveTo(0, 0);
//adds a path from brush location to coordinates (x, y)
ctx.lineTo(200, 100);
//draw all paths
ctx.stroke();
//adds a path for a rectangle with a diagonal going from (x, y, [...]) with length ([...], x, y)
ctx.rect(10, 10, 150, 100);
ctx.stroke();*/

const board = document.querySelector("#board");
let grid = board.getContext("2d");
let snake = board.getContext("2d");
let apple = board.getContext("2d");
let snakeTiles = [];
let appleTiles = [];
let x;
let y;
let direction = "left";

/*for (let i=1; i<=641; i+=20) {
    grid.moveTo(i, 0);
    grid.lineTo(i, 641);
    grid.moveTo(0, i);
    grid.lineTo(641, i);
}*/

grid.rect(0, 0, 642, 642);
grid.stroke();

snake.fillStyle = "black";

for (let j=0; j<=3; j++) {
    x = 321 + j * 20;
    y = 321;
    snake.fillRect(x, y, 20, 20);
    snakeTiles.push({x: x, y: y});
}

document.onkeydown = (e) => {
    switch (e.key) {
        case "ArrowLeft":
            if(direction != "right") {
                direction = "left";
            }
            break;
        case "ArrowRight":
            if(direction != "left") {
                direction = "right";
            }
            break;
        case "ArrowUp":
            if(direction != "down") {
                direction = "up";
            }
            break;
        case "ArrowDown":
            if(direction != "up") {
                direction = "down";
            }
            break;
    }
    console.log(e, direction);
}

function moveSnake() {
    x = snakeTiles[snakeTiles.length - 1].x;
    y = snakeTiles[snakeTiles.length - 1].y;
    snake.clearRect(x, y, 20, 20);
    snakeTiles.pop();

    x = snakeTiles[0].x;
    y = snakeTiles[0].y;

    if (direction == "left") {
        x = x-20;
        if (x == -19) {
            x = 621;
        }
    } else if (direction == "right") {
        x = x+20;
        if (x == 641) {
            x = 1;
        }
    } else if (direction == "up") {
        y = y-20;
        if (y == -19) {
            y = 621;
        }
    } else if (direction == "down") {
        y = y+20;
        if (y == 641) {
            y = 1;
        }
    }

    snake.fillStyle = "black";
    snake.fillRect(x, y, 20, 20);
    snakeTiles.unshift({x: x, y: y});
}

setInterval(moveSnake, 200);

function spawnApple() {
    x = Math.floor(Math.random()*32)*20+1;
    y = Math.floor(Math.random()*32)*20+1;
    
    apple.fillStyle = "green";
    apple.fillRect(x, y, 20, 20);
    appleTiles.push({x: x, y: y});
}

spawnApple();
setInterval(spawnApple, 7000);