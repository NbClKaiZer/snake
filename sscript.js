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

import { drawBoard, drawSnake } from "./canvasdraw.js";
import { spawnApple } from "./apple.js";
import { spawnMine, despawnMine } from "./mines.js";
import { spawnWall } from "./walls.js";
import { spawnEnemy, moveEnemy } from "./enemy.js";
import { moveSnake } from "./movesnake.js";
import { setupInput } from "./userinput.js";
import { setupControls } from "./controls.js";

const usedTiles = {
    apple: [],
    mine: [],
    enemy: [],
    wall: [],
};

class Snake {
    constructor(color, initSize) {
        this.color = color;
        this.initSize = initSize;
        this.lastMove = "left";
        this.direction = "left";
    };
};

const gameSetup = {
    difficulty: "diff2"
};

const player = new Snake("#2aa4cd", 4);
usedTiles.player = [];
/*const red = new Snake("#a1232b", 4);
usedTiles.red = [];
const yellow = new Snake("#ffff00", 4);
usedTiles.yellow = [];
const green = new Snake("#00ff00", 4);
usedTiles.green = [];*/

setupInput(gameSetup, startGame);
setupControls(player);
drawBoard();

function startGame() {
    //reset tile arrays, intervals, move direction and board
    Object.keys(usedTiles).forEach((tileCat) => {
        usedTiles[tileCat] = [];
    });
    Object.keys(gameSetup).forEach ((interval) => {
        clearInterval(gameSetup[interval]);
    });

    drawBoard();
    document.querySelector("#customconfirm").classList.remove('show');
    
    player.direction = "left";
    //initial snake figure generation
    for (let i=0; i<player.initSize; i++) {
        drawSnake(player, 321 + i * 20, 321);
        usedTiles.player.push({x: 321 + i * 20, y: 321});
    };
    /*for (let r=0; r<red.initSize; r++) {
        drawSnake(red, 121 + r * 20, 481);
        usedTiles.red.push({x: 121 + r * 20, y: 481});
    };
    for (let y=0; y<yellow.initSize; y++) {
        drawSnake(yellow, 561 + y * 20, 241);
        usedTiles.yellow.push({x: 561 + y * 20, y: 241});
    };
    for (let g=0; g<green.initSize; g++) {
        drawSnake(green, 81 + g * 20, 41);
        usedTiles.green.push({x: 81 + g * 20, y: 41});
    };*/
    
    //initialize game setup
    if (gameSetup.difficulty == "diff0") {
        gameSetup.snakeInt = setInterval(moveSnake, 250, usedTiles, gameSetup, player);
        gameSetup.appleInt = setInterval(spawnApple, 7500, usedTiles);
        gameSetup.maxMines = 0;
        gameSetup.wallAmount = 0;
    } else if (gameSetup.difficulty == "diff1") {
        gameSetup.snakeInt = setInterval(moveSnake, 200, usedTiles, gameSetup, player);
        gameSetup.appleInt = setInterval(spawnApple, 6000, usedTiles);
        gameSetup.mineInt = setInterval(spawnMine, 10000, usedTiles, gameSetup, player);
        gameSetup.demineInt = setInterval(despawnMine, 12000, usedTiles);
        gameSetup.maxMines = 10;
        gameSetup.wallAmount = 5;
    } else if  (gameSetup.difficulty == "diff2") {
        gameSetup.snakeInt = setInterval(moveSnake, 150, usedTiles, gameSetup, player);
        gameSetup.appleInt = setInterval(spawnApple, 4500, usedTiles);
        gameSetup.mineInt = setInterval(spawnMine, 6000, usedTiles, gameSetup, player);
        gameSetup.demineInt = setInterval(despawnMine, 12000, usedTiles);
        gameSetup.enemyInt = setInterval(moveEnemy, 500, usedTiles);
        gameSetup.maxMines = 20;
        gameSetup.wallAmount = 10;
        gameSetup.enemyAmount = 1;
    } else if  (gameSetup.difficulty == "diff3") {
        gameSetup.snakeInt = setInterval(moveSnake, 100, usedTiles, gameSetup, player);
        gameSetup.appleInt = setInterval(spawnApple, 3000, usedTiles);
        gameSetup.mineInt = setInterval(spawnMine, 4500, usedTiles, gameSetup, player);
        gameSetup.demineInt = setInterval(despawnMine, 12000, usedTiles);
        gameSetup.enemyInt = setInterval(moveEnemy, 300, usedTiles);
        gameSetup.maxMines = 30;
        gameSetup.wallAmount = 20;
        gameSetup.enemyAmount = 3;
    } else if  (gameSetup.difficulty == "diff4") {
        gameSetup.snakeInt = setInterval(moveSnake, 75, usedTiles, gameSetup, player);
        gameSetup.appleInt = setInterval(spawnApple, 3000, usedTiles);
        gameSetup.mineInt = setInterval(spawnMine, 3000, usedTiles, gameSetup, player);
        gameSetup.demineInt = setInterval(despawnMine, 15000, usedTiles);
        gameSetup.enemyInt = setInterval(moveEnemy, 100, usedTiles);
        gameSetup.maxMines = 50;
        gameSetup.wallAmount = 30;
        gameSetup.enemyAmount = 5;
    } else if (gameSetup.difficulty == "diffcustom") {
        document.querySelector("#customconfirm").classList.add('show');
        gameSetup.snakeInt = setInterval(moveSnake, document.querySelector("#snakeInt").value, usedTiles, gameSetup, player);
        gameSetup.appleInt = setInterval(spawnApple, document.querySelector("#appleInt").value, usedTiles);
        gameSetup.mineInt = setInterval(spawnMine, document.querySelector("#mineInt").value, usedTiles, gameSetup, player);
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