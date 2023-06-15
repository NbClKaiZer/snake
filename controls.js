import { lastMove } from "./movesnake.js";
import { startGame } from "./sscript.js";
export let snakeDirection = "left";

document.querySelector("#startbutton").addEventListener('click', () => {
    startGame(snakeDirection);
});

//basic controls w,a,s,d and arrow keys, checks for and blocks 180° turns
document.onkeydown = (e) => {
    switch (e.key) {
        case "ArrowLeft":
        case "a":
            if(lastMove != "right") {
                snakeDirection = "left";
            };
            break;
        case "ArrowRight":
        case "d":
            if(lastMove != "left") {
                snakeDirection = "right";
            };
            break;
        case "ArrowUp":
        case "w":
            if(lastMove != "down") {
                snakeDirection = "up";
            };
            break;
        case "ArrowDown":
        case "s":
            if(lastMove != "up") {
                snakeDirection = "down";
            };
            break;
    };
};