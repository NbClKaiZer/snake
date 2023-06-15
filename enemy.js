import { gameCanvas } from "./sscript.js";
import { checkCollision } from "./collision.js";
import { drawItem } from "./canvasdraw.js";

export function spawnEnemy(usedTiles) {
    let enemyX, enemyY;

    //select random tiles, until free tile is found, exclude tiles in starting line of player snake
    do {
        enemyX = Math.floor(Math.random()*32)*20+1;
        enemyY = Math.floor(Math.random()*32)*20+1;
    } while (checkCollision(enemyX,enemyY,usedTiles) != "moveOn" || enemyY == 321);
    
    drawItem(gameCanvas, enemyX, enemyY, "spider");
    usedTiles.enemy.push({x: enemyX, y: enemyY});
};

export function moveEnemy(usedTiles) {
    usedTiles.enemy.forEach((tango) => {
        let enemyX = tango.x;
        let enemyY = tango.y;

        let enemyDirection = Math.floor(Math.random()*8);
        let enemyMoved = false;

        //50% chance to move, on move have equal chance to move in any of the 4 directions, only move if no collision, not allowed to warp to opposite side
        if (enemyDirection==0 && checkCollision(enemyX-20,enemyY,usedTiles) == "moveOn" && enemyX>1) {
            drawItem(gameCanvas, enemyX-20, enemyY, "spider");
            tango.x = enemyX-20;
            enemyMoved = true;
        } else if (enemyDirection==1 && checkCollision(enemyX+20,enemyY,usedTiles) == "moveOn" && enemyX<621) {
            drawItem(gameCanvas, enemyX+20, enemyY, "spider");
            tango.x = enemyX+20;
            enemyMoved = true;
        } else if (enemyDirection==2 && checkCollision(enemyX,enemyY-20,usedTiles) == "moveOn" && enemyY>1) {
            drawItem(gameCanvas, enemyX, enemyY-20, "spider");
            tango.y = enemyY-20;
            enemyMoved = true;
        } else if (enemyDirection==3 && checkCollision(enemyX,enemyY+20,usedTiles) == "moveOn" && enemyY<621) {
            drawItem(gameCanvas, enemyX, enemyY+20, "spider");
            tango.y = enemyY+20;
            enemyMoved = true;
        };

        if (enemyMoved == true) {
            gameCanvas.fillStyle = "#3c3c3c";
            gameCanvas.fillRect(enemyX, enemyY, 20, 20);
        };
    });
};