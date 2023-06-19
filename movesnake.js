import { gameOver } from "./gameover.js";
import { checkCollision } from "./collision.js";
import { sounds } from "./assets.js";
import { gameCanvas } from "./sscript.js";

export function moveSnake(usedTiles, gameSetup, thisSnake) {
    let snakeX = usedTiles.player[0].x;
    let snakeY = usedTiles.player[0].y;

    //determin location of next tile, save movement direction for 180° check
    if (thisSnake.direction == "left") {
        thisSnake.lastMove = "left";
        snakeX = snakeX-20;
        if (snakeX == -19) {
            snakeX = 621;
        };
    } else if (thisSnake.direction == "right") {
        thisSnake.lastMove = "right";
        snakeX = snakeX+20;
        if (snakeX == 641) {
            snakeX = 1;
        };
    } else if (thisSnake.direction == "up") {
        thisSnake.lastMove = "up";
        snakeY = snakeY-20;
        if (snakeY == -19) {
            snakeY = 621;
        };
    } else if (thisSnake.direction == "down") {
        thisSnake.lastMove = "down";
        snakeY = snakeY+20;
        if (snakeY == 641) {
            snakeY = 1;
        };
    };

    //if tile targeted by current move is inhibited by an enemy, mine or snake - game over
    if (checkCollision(snakeX,snakeY,usedTiles) == "snakeCollision" || checkCollision(snakeX,snakeY,usedTiles) == "wallCollision") {
        sounds.hurt.play();
        gameOver(gameSetup);
        return;
    } else if (checkCollision(snakeX,snakeY,usedTiles) == "mineCollision") {
        sounds.boom.play();
        gameOver(gameSetup);
        return;
    } else if (checkCollision(snakeX,snakeY,usedTiles) == "enemyCollision") {
        sounds.shoot.play();
        gameOver(gameSetup);
        return;
    };

    //remove oldest snake tile if no apple is eaten this turn
    if (checkCollision(snakeX,snakeY,usedTiles)[0] != "appleCollision") {
        let snakeA = usedTiles.player[usedTiles.player.length - 1].x;
        let snakeB = usedTiles.player[usedTiles.player.length - 1].y;
        gameCanvas.fillStyle = "#3c3c3c";
        gameCanvas.fillRect(snakeA, snakeB, 20, 20);
        usedTiles.player.pop();
    } else {
        usedTiles.apple.splice(checkCollision(snakeX,snakeY,usedTiles)[1], 1);
        sounds.bleep.play();
    };

    //add new snake tile ahead
    gameCanvas.fillStyle = "#2aa4cd";
    gameCanvas.fillRect(snakeX, snakeY, 20, 20);
    usedTiles.player.unshift({x: snakeX, y: snakeY});
};