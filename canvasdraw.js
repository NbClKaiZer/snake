import { images } from "./assets.js";
import { gameCanvas } from "./sscript.js";

function drawBoard() {
    gameCanvas.rect(0, 0, 642, 642);
    gameCanvas.strokeStyle = "#bbbbbb";
    gameCanvas.stroke();
    gameCanvas.fillStyle = "#3c3c3c"
    gameCanvas.fillRect(1, 1, 640, 640);
};

function drawItem(itemX, itemY, type) {
    gameCanvas.drawImage(images[type], itemX, itemY, 20, 20);
};

function drawSnake(snakeX, snakeY) {
    gameCanvas.fillStyle = "#2aa4cd";
    gameCanvas.fillRect(snakeX, snakeY, 20, 20);
};

export {drawBoard, drawItem, drawSnake};