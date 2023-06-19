export function checkCollision(collX, collY, checkTiles) {
    let event = "moveOn";

    checkTiles.player.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "snakeCollision";
        };
    });
    /*checkTiles.red.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "snakeCollision";
        };
    });
    checkTiles.yellow.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "snakeCollision";
        };
    });
    checkTiles.green.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "snakeCollision";
        };
    });*/

    //additionally returns index of found apple, so it can be easily removed from usedTiles.apple from within moveSnake()
    checkTiles.apple.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = ["appleCollision", checkTiles.apple.indexOf(tile)];
        };
    });

    checkTiles.mine.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "mineCollision";
        };
    });

    checkTiles.enemy.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "enemyCollision";
        };
    });

    checkTiles.wall.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "wallCollision";
        };
    });

    //returns the appropriate collision, if any was found, or "moveOn" if not
    return event;
};