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

const c = document.querySelector("#board");
let ctx = c.getContext("2d");
const boardWidth = c.width;
const boardHeight = c.height;
const plotSize = 20;
const columns = boardWidth / plotSize;
const rows = boardHeight / plotSize;

for (let i=0; i<=columns; i++) {
    let x=i*plotSize;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, boardHeight);
    ctx.closePath();
    ctx.stroke();
}

for (let j=0; j<=rows; j++) {
    let y=j*plotSize;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(boardWidth, y);
    ctx.closePath();
    ctx.stroke();
}
