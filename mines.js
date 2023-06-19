import { checkCollision } from "./collision.js";
import { gameCanvas } from "./sscript.js";
import { drawItem } from "./canvasdraw.js";

export function spawnMine(usedTiles, gameSetup, thisSnake) {
    let mineX,mineY;

    if (usedTiles.mine.length < gameSetup.maxMines) {
        //select random tiles, until free tile is found
        do {
            mineX = Math.floor(Math.random()*32)*20+1;
            mineY = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(mineX,mineY,usedTiles) != "moveOn");
        
        //prevent Mines from spawning less than 5 tiles ahead from snake head in recent moving direction
            //consider doing this within the do-while-loop to prevent skipping mine spawn
        if((thisSnake.direction == "left" && mineY == usedTiles.player[0].y && mineX > (usedTiles.player[0].x - 100) && mineX < usedTiles.player[0].x) ||
        (thisSnake.direction == "right" && mineY == usedTiles.player[0].y && mineX < (usedTiles.player[0].x + 100) && mineX > usedTiles.player[0].x) ||
        (thisSnake.direction == "up" && mineX == usedTiles.player[0].x && mineY > (usedTiles.player[0].y - 100) && mineY < usedTiles.player[0].y) ||
        (thisSnake.direction == "down" && mineX == usedTiles.player[0].x && mineY < (usedTiles.player[0].y + 100) && mineY > usedTiles.player[0].y)) {
            return;
        };

        drawItem(mineX, mineY, "landmine");
        usedTiles.mine.push({x: mineX, y: mineY});
    };
};

export function despawnMine(usedTiles) {
    if (usedTiles.mine.length > 0) {
        let demineX = usedTiles.mine[0].x;
        let demineY = usedTiles.mine[0].y;
        gameCanvas.fillStyle = "#3c3c3c";
        gameCanvas.fillRect(demineX, demineY, 20, 20);
        usedTiles.mine.shift();
    };
};