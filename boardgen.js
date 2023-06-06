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

for (let i=0; i<=640; i+=20) {
    grid.moveTo(i, 0);
    grid.lineTo(i, 640);
    grid.moveTo(0, i);
    grid.lineTo(640, i);
}

grid.stroke();

snake.fillStyle = "black";

for (let j=0; j<=3; j++) {
    x = 320 + j * 20;
    y = 320;
    snake.fillRect(x, y, 20, 20);
    snakeTiles.push({x: x, y: y});
}

x = Math.floor(Math.random()*32)*20;
y = Math.floor(Math.random()*32)*20;

apple.fillStyle = "green";
apple.fillRect(x, y, 20, 20);
appleTiles.push({x: x, y: y});

console.log(snakeTiles, appleTiles);