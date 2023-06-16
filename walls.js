import { checkCollision } from "./collision.js";
import { drawItem } from "./canvasdraw.js";

export function spawnWall(usedTiles) {
    let wallDirection = Math.floor(Math.random()*2);
    let wallX, wallY;

    //walls have 3 tiles each and can run across or down, but will never spawn in the starting line
    if (wallDirection == 0) {
        do {
            wallX = Math.floor(Math.random()*32)*20+1;
            wallY = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(wallX,wallY,usedTiles) != "moveOn" || (wallY >= 281 && wallY <= 321) || wallY >= 581);

        drawItem(wallX, wallY, "bricks");
        drawItem(wallX, wallY+20, "bricks");
        drawItem(wallX, wallY+40, "bricks");

        usedTiles.wall.push({x: wallX, y: wallY});
        usedTiles.wall.push({x: wallX, y: wallY+20});
        usedTiles.wall.push({x: wallX, y: wallY+40});
    } else if (wallDirection == 1) {
        do {
            wallX = Math.floor(Math.random()*32)*20+1;
            wallY = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(wallX,wallY,usedTiles) != "moveOn" || wallY == 321 || wallX >= 581);

        drawItem(wallX, wallY, "bricks");
        drawItem(wallX+20, wallY, "bricks");
        drawItem(wallX+40, wallY, "bricks");

        usedTiles.wall.push({x: wallX, y: wallY});
        usedTiles.wall.push({x: wallX+20, y: wallY});
        usedTiles.wall.push({x: wallX+40, y: wallY});
    };
};