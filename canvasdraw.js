import { images } from "./assets.js";

function drawBoard(canvas) {
    canvas.rect(0, 0, 642, 642);
    canvas.strokeStyle = "#bbbbbb";
    canvas.stroke();
    canvas.fillStyle = "#3c3c3c"
    canvas.fillRect(1, 1, 640, 640);
};

function drawItem(canvas, itemX, itemY, type) {
    canvas.drawImage(images[type], itemX, itemY, 20, 20);
};

function drawSnake(canvas, snakeX, snakeY) {
    canvas.fillStyle = "#2aa4cd";
    canvas.fillRect(snakeX, snakeY, 20, 20);
};

export {drawBoard, drawItem, drawSnake};