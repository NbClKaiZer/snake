import { checkCollision } from "./collision.js";
import { drawItem } from "./canvasdraw.js";
import { gameCanvas } from "./sscript.js";

export function spawnApple(usedTiles) {
    let appleX,appleY;

    if (usedTiles.apple.length >= 10) {
        gameCanvas.fillStyle = "#3c3c3c";
        gameCanvas.fillRect(usedTiles.apple[0].x, usedTiles.apple[0].y, 20, 20);
        usedTiles.apple.shift();
    }
    //select random tiles until a vacant tile is found
    do {
        appleX = Math.floor(Math.random()*32)*20+1;
        appleY = Math.floor(Math.random()*32)*20+1;
    } while (checkCollision(appleX,appleY,usedTiles) != "moveOn");

    drawItem(gameCanvas, appleX, appleY, "apple");
    usedTiles.apple.push({x: appleX, y: appleY});
};