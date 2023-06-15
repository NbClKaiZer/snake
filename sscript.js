/*Roadmap for v2.0
- add 1-tile enemies DONE
- allow enemies to randomly move to free tiles, if available DONE
- game over on enemy collision DONE
- add solid, impassable walls (entire tiles for now, maybe 2px borders later) DONE
- game over on wall collision DONE
- add graphics for walls, apples, mines and 1-tile enemies DONE
- add enemy 4-tile snakes
- make enemy snakes look for free tiles in movement direction
- have enemy snakes die when no free tile is available for their next move
- have enemy snakes grow on apple collision
- game over on collision with enemy snake
- add adventure mode
- add the first 5 pre-made levels and challenges
*/

const board = document.querySelector("#board");
export const gameCanvas = board.getContext("2d");

import { images, sounds } from "./assets.js";
import { checkCollision } from "./collision.js";
import { drawBoard, drawItem, drawSnake } from "./canvasdraw.js";
import { spawnApple } from "./apple.js";
import { spawnMine, despawnMine } from "./mines.js";
import { spawnWall } from "./walls.js";
import { spawnEnemy, moveEnemy } from "./enemy.js";

export const gameSetup = {
    difficulty: "diff2"
};

const usedTiles = {
    snake: [],
    apple: [],
    mine: [],
    enemy: [],
    wall: []
};

let lastMove = "left";
export let snakeDirection = "left";

drawBoard(gameCanvas);

document.querySelector("#startbutton").addEventListener('click', () => {
    startGame();
});

function startGame() {
    //reset tile arrays, intervals, move direction and board
    Object.keys(usedTiles).forEach((tileCat) => {
        usedTiles[tileCat] = [];
    });
    Object.keys(gameSetup).forEach ((interval) => {
        clearInterval(gameSetup[interval]);
    });
    snakeDirection = "left";
    lastMove = "left";
    drawBoard(gameCanvas);
    document.querySelector("#customconfirm").classList.remove('show');
    
    //initial snake figure generation
    for (let i=0; i<=3; i++) {
        drawSnake(gameCanvas, 321 + i * 20, 321);
        usedTiles.snake.push({x: 321 + i * 20, y: 321});
    };
    
    //initialize game setup
    if (gameSetup.difficulty == "diff0") {
        gameSetup.snakeInt = setInterval(moveSnake, 250);
        gameSetup.appleInt = setInterval(spawnApple, 7500, usedTiles);
        gameSetup.maxMines = 0;
        gameSetup.wallAmount = 0;
    } else if (gameSetup.difficulty == "diff1") {
        gameSetup.snakeInt = setInterval(moveSnake, 200);
        gameSetup.appleInt = setInterval(spawnApple, 6000, usedTiles);
        gameSetup.mineInt = setInterval(spawnMine, 10000, usedTiles);
        gameSetup.demineInt = setInterval(despawnMine, 12000, usedTiles);
        gameSetup.maxMines = 10;
        gameSetup.wallAmount = 5;
    } else if  (gameSetup.difficulty == "diff2") {
        gameSetup.snakeInt = setInterval(moveSnake, 150);
        gameSetup.appleInt = setInterval(spawnApple, 4500, usedTiles);
        gameSetup.mineInt = setInterval(spawnMine, 6000, usedTiles);
        gameSetup.demineInt = setInterval(despawnMine, 12000, usedTiles);
        gameSetup.enemyInt = setInterval(moveEnemy, 500, usedTiles);
        gameSetup.maxMines = 20;
        gameSetup.wallAmount = 10;
        gameSetup.enemyAmount = 1;
    } else if  (gameSetup.difficulty == "diff3") {
        gameSetup.snakeInt = setInterval(moveSnake, 100);
        gameSetup.appleInt = setInterval(spawnApple, 3000, usedTiles);
        gameSetup.mineInt = setInterval(spawnMine, 4500, usedTiles);
        gameSetup.demineInt = setInterval(despawnMine, 12000, usedTiles);
        gameSetup.enemyInt = setInterval(moveEnemy, 300, usedTiles);
        gameSetup.maxMines = 30;
        gameSetup.wallAmount = 20;
        gameSetup.enemyAmount = 3;
    } else if  (gameSetup.difficulty == "diff4") {
        gameSetup.snakeInt = setInterval(moveSnake, 75);
        gameSetup.appleInt = setInterval(spawnApple, 3000, usedTiles);
        gameSetup.mineInt = setInterval(spawnMine, 3000, usedTiles);
        gameSetup.demineInt = setInterval(despawnMine, 15000, usedTiles);
        gameSetup.enemyInt = setInterval(moveEnemy, 100, usedTiles);
        gameSetup.maxMines = 50;
        gameSetup.wallAmount = 30;
        gameSetup.enemyAmount = 5;
    } else if (gameSetup.difficulty == "diffcustom") {
        document.querySelector("#customconfirm").classList.add('show');
        gameSetup.snakeInt = setInterval(moveSnake, document.querySelector("#snakeInt").value);
        gameSetup.appleInt = setInterval(spawnApple, document.querySelector("#appleInt").value, usedTiles);
        gameSetup.mineInt = setInterval(spawnMine, document.querySelector("#mineInt").value, usedTiles);
        gameSetup.demineInt = setInterval(despawnMine, document.querySelector("#demineInt").value, usedTiles);
        gameSetup.enemyInt = setInterval(moveEnemy, document.querySelector("#enemyInt").value, usedTiles);
        gameSetup.maxMines = document.querySelector("#maxMines").value;
        gameSetup.wallAmount = document.querySelector("#wallAmount").value;
        gameSetup.enemyAmount = document.querySelector("#enemyAmount").value;
    };

    //spawn initial nonplayer-objects
    for (let j=0; j<gameSetup.wallAmount; j++) {
        spawnWall(usedTiles);
    };
    spawnApple(usedTiles);
    for (let k=0; k<gameSetup.enemyAmount; k++) {
        spawnEnemy(usedTiles);
    };
};

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

function moveSnake() {
    let snakeX = usedTiles.snake[0].x;
    let snakeY = usedTiles.snake[0].y;

    //determin location of next tile, save movement direction for 180° check
    if (snakeDirection == "left") {
        lastMove = "left";
        snakeX = snakeX-20;
        if (snakeX == -19) {
            snakeX = 621;
        };
    } else if (snakeDirection == "right") {
        lastMove = "right";
        snakeX = snakeX+20;
        if (snakeX == 641) {
            snakeX = 1;
        };
    } else if (snakeDirection == "up") {
        lastMove = "up";
        snakeY = snakeY-20;
        if (snakeY == -19) {
            snakeY = 621;
        };
    } else if (snakeDirection == "down") {
        lastMove = "down";
        snakeY = snakeY+20;
        if (snakeY == 641) {
            snakeY = 1;
        };
    };

    //if tile targeted by current move is inhibited by an enemy, mine or snake - game over
    if (checkCollision(snakeX,snakeY,usedTiles) == "snakeCollision" || checkCollision(snakeX,snakeY,usedTiles) == "wallCollision") {
        sounds.hurt.play();
        gameOver();
        return;
    } else if (checkCollision(snakeX,snakeY,usedTiles) == "mineCollision") {
        sounds.boom.play();
        gameOver();
        return;
    } else if (checkCollision(snakeX,snakeY,usedTiles) == "enemyCollision") {
        sounds.shoot.play();
        gameOver();
        return;
    };

    //remove oldest snake tile if no apple is eaten this turn
    if (checkCollision(snakeX,snakeY,usedTiles)[0] != "appleCollision") {
        let snakeA = usedTiles.snake[usedTiles.snake.length - 1].x;
        let snakeB = usedTiles.snake[usedTiles.snake.length - 1].y;
        gameCanvas.fillStyle = "#3c3c3c";
        gameCanvas.fillRect(snakeA, snakeB, 20, 20);
        usedTiles.snake.pop();
    } else {
        usedTiles.apple.splice(checkCollision(snakeX,snakeY,usedTiles)[1], 1);
        sounds.bleep.play();
    };

    //add new snake tile ahead
    drawSnake(gameCanvas, snakeX, snakeY);
    usedTiles.snake.unshift({x: snakeX, y: snakeY});
};

function gameOver() {
    Object.keys(gameSetup).forEach ((interval) => {
        clearInterval(gameSetup[interval]);
    });
    gameCanvas.fillStyle = "#eeeeee";
    gameCanvas.font = "40px Arial";
    gameCanvas.textAlign = "center";
    gameCanvas.fillText("Game Over!", 320, 320);
};

//functions to process user input
const diffBtns = document.querySelectorAll(".diffbutton")
diffBtns.forEach ((btn) => {
    btn.addEventListener('click', () => {
        gameSetup.difficulty = btn.id;
    });
});

document.querySelector("#customtoggle").addEventListener('click', () => {
    document.querySelector("#customwrapper").classList.toggle('show');
});

document.querySelector("#soundtoggle").addEventListener('click', () => {
    Object.keys(sounds).forEach((sound) => {
        if (sounds[sound].muted == true) {
            sounds[sound].muted = false;
        } else {
            sounds[sound].muted = true;
        };
    });
});