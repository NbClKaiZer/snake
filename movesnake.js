import { sounds } from "./assets.js";
import { gameOver } from "./gameover.js";
import { checkCollision } from "./collision.js";
import { drawSnake } from "./canvasdraw.js";
import { snakeDirection } from "./controls.js";

export let lastMove = "left";

export function moveSnake(usedTiles, gameSetup, canvas) {
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
        gameOver(gameSetup, canvas);
        return;
    } else if (checkCollision(snakeX,snakeY,usedTiles) == "mineCollision") {
        sounds.boom.play();
        gameOver(gameSetup, canvas);
        return;
    } else if (checkCollision(snakeX,snakeY,usedTiles) == "enemyCollision") {
        sounds.shoot.play();
        gameOver(gameSetup, canvas);
        return;
    };

    //remove oldest snake tile if no apple is eaten this turn
    if (checkCollision(snakeX,snakeY,usedTiles)[0] != "appleCollision") {
        let snakeA = usedTiles.snake[usedTiles.snake.length - 1].x;
        let snakeB = usedTiles.snake[usedTiles.snake.length - 1].y;
        canvas.fillStyle = "#3c3c3c";
        canvas.fillRect(snakeA, snakeB, 20, 20);
        usedTiles.snake.pop();
    } else {
        usedTiles.apple.splice(checkCollision(snakeX,snakeY,usedTiles)[1], 1);
        sounds.bleep.play();
    };

    //add new snake tile ahead
    drawSnake(canvas, snakeX, snakeY);
    usedTiles.snake.unshift({x: snakeX, y: snakeY});
};