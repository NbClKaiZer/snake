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

for (let i=0; i<=640; i+=20) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 640);
    ctx.moveTo(0, i);
    ctx.lineTo(640, i);
}

ctx.stroke();