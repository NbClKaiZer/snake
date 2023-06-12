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
const canvasDraw = board.getContext("2d");
const usedTiles = {};
let direction = "left";
let lastMove = "left";
const gameSetup = {};
gameSetup.difficulty = 2;
const sounds = [new Audio("./bleep.mp3"), new Audio("./boom.mp3"), new Audio("./hurt.mp3"), new Audio("./shoot.mp3")];
const images = [new Image(), new Image(), new Image(), new Image()];
images[0].src = "./bricks.png";
images[1].src = "./landmine.png";
images[2].src = "./apple.png";
images[3].src = "./spider.png";

//board outer border
canvasDraw.rect(0, 0, 642, 642);
canvasDraw.strokeStyle = "#bbbbbb";
canvasDraw.stroke();
canvasDraw.fillStyle= "#3c3c3c"
canvasDraw.fillRect(1, 1, 640, 640);

function startGame() {
    //reset tile arrays, move direction, intervals and board
    usedTiles.snake = [];
    usedTiles.apple = [];
    usedTiles.mine = [];
    usedTiles.enemy = [];
    usedTiles.wall = [];
    snakeDirection = "left";
    lastMove = "left";
    clearInterval(gameSetup.snakeInt);
    clearInterval(gameSetup.appleInt);
    clearInterval(gameSetup.mineInt);
    clearInterval(gameSetup.demineInt);
    clearInterval(gameSetup.enemyInt);
    canvasDraw.fillStyle= "#3c3c3c"
    canvasDraw.fillRect(1, 1, 640, 640);
    document.querySelector("#customconfirm").classList.remove('show');
    
    //initial snake figure generation
    canvasDraw.fillStyle = "#2aa4cd";
    for (let i=0; i<=3; i++) {
        let snakeX = 321 + i * 20;
        let snakeY = 321;
        canvasDraw.fillRect(snakeX, snakeY, 20, 20);
        usedTiles.snake.push({x: snakeX, y: snakeY});
    }
    
    //initialize movement and item spawns
    if (gameSetup.difficulty == 0) {
        gameSetup.snakeInt = setInterval(moveSnake, 250);
        gameSetup.appleInt = setInterval(spawnApple, 7500);
        gameSetup.maxMines = 0;
    } else if (gameSetup.difficulty == 1) {
        gameSetup.snakeInt = setInterval(moveSnake, 200);
        gameSetup.appleInt = setInterval(spawnApple, 6000);
        gameSetup.mineInt = setInterval(spawnMine, 10000);
        gameSetup.demineInt = setInterval(despawnMine, 12000);
        gameSetup.maxMines = 10;
        gameSetup.wallAmount = 2;
    } else if  (gameSetup.difficulty == 2) {
        gameSetup.snakeInt = setInterval(moveSnake, 150);
        gameSetup.appleInt = setInterval(spawnApple, 4500);
        gameSetup.mineInt = setInterval(spawnMine, 6000);
        gameSetup.demineInt = setInterval(despawnMine, 12000);
        gameSetup.enemyInt = setInterval(moveEnemy, 500);
        gameSetup.maxMines = 20;
        gameSetup.wallAmount = 5;
        gameSetup.enemyAmount = 1;
    } else if  (gameSetup.difficulty == 3) {
        gameSetup.snakeInt = setInterval(moveSnake, 100);
        gameSetup.appleInt = setInterval(spawnApple, 3000);
        gameSetup.mineInt = setInterval(spawnMine, 4500);
        gameSetup.demineInt = setInterval(despawnMine, 12000);
        gameSetup.enemyInt = setInterval(moveEnemy, 300);
        gameSetup.maxMines = 30;
        gameSetup.wallAmount = 10;
        gameSetup.enemyAmount = 3;
    } else if  (gameSetup.difficulty == 4) {
        gameSetup.snakeInt = setInterval(moveSnake, 75);
        gameSetup.appleInt = setInterval(spawnApple, 3000);
        gameSetup.mineInt = setInterval(spawnMine, 3000);
        gameSetup.demineInt = setInterval(despawnMine, 15000);
        gameSetup.enemyInt = setInterval(moveEnemy, 100);
        gameSetup.maxMines = 50;
        gameSetup.wallAmount = 15;
        gameSetup.enemyAmount = 5;
    } else if (gameSetup.difficulty == 'custom') {
        document.querySelector("#customconfirm").classList.add('show');
        gameSetup.snakeInt = setInterval(moveSnake, document.querySelector("#snakeInt").value);
        gameSetup.appleInt = setInterval(spawnApple, document.querySelector("#appleInt").value);
        gameSetup.mineInt = setInterval(spawnMine, document.querySelector("#mineInt").value);
        gameSetup.demineInt = setInterval(despawnMine, document.querySelector("#demineInt").value);
        gameSetup.enemyInt = setInterval(moveEnemy, document.querySelector("#enemyInt").value);
        gameSetup.maxMines = document.querySelector("#maxMines").value;
        gameSetup.wallAmount = document.querySelector("#wallAmount").value;
        gameSetup.enemyAmount = document.querySelector("#enemyAmount").value;
    }

    //spawn initial nonplayer-objects
    spawnApple();
    for (let j=0; j<gameSetup.enemyAmount; j++) {
        spawnEnemy();
    }
    for (let k=0; k<gameSetup.wallAmount; k++) {
        spawnWall();
    }
}

//basic controls w,a,s,d and arrow keys, checks for and blocks 180° turns
document.onkeydown = (e) => {
    switch (e.key) {
        case "ArrowLeft":
        case "a":
            if(lastMove != "right") {
                snakeDirection = "left";
            }
            break;
        case "ArrowRight":
        case "d":
            if(lastMove != "left") {
                snakeDirection = "right";
            }
            break;
        case "ArrowUp":
        case "w":
            if(lastMove != "down") {
                snakeDirection = "up";
            }
            break;
        case "ArrowDown":
        case "s":
            if(lastMove != "up") {
                snakeDirection = "down";
            }
            break;
    }
}

function moveSnake() {
    let snakeX = usedTiles.snake[0].x;
    let snakeY = usedTiles.snake[0].y;

    //determin location of next tile, save movement direction for 180° check
    if (snakeDirection == "left") {
        lastMove = "left";
        snakeX = snakeX-20;
        if (snakeX == -19) {
            snakeX = 621;
        }
    } else if (snakeDirection == "right") {
        lastMove = "right";
        snakeX = snakeX+20;
        if (snakeX == 641) {
            snakeX = 1;
        }
    } else if (snakeDirection == "up") {
        lastMove = "up";
        snakeY = snakeY-20;
        if (snakeY == -19) {
            snakeY = 621;
        }
    } else if (snakeDirection == "down") {
        lastMove = "down";
        snakeY = snakeY+20;
        if (snakeY == 641) {
            snakeY = 1;
        }
    }

    //if tile targeted by current move is inhibited by an enemy, mine or snake - game over
    if (checkCollision(snakeX,snakeY) == "snakeCollision" || checkCollision(snakeX,snakeY) == "wallCollision") {
        sounds[2].play();
        gameOver();
        return;
    } else if (checkCollision(snakeX,snakeY) == "mineCollision") {
        sounds[1].play();
        gameOver();
        return;
    } else if (checkCollision(snakeX,snakeY) == "enemyCollision") {
        sounds[3].play();
        gameOver();
        return;
    }

    //remove oldest snake tile if no apple is eaten this turn
    if (checkCollision(snakeX,snakeY)[0] != "appleCollision") {
        let snakeA = usedTiles.snake[usedTiles.snake.length - 1].x;
        let snakeB = usedTiles.snake[usedTiles.snake.length - 1].y;
        canvasDraw.fillStyle = "#3c3c3c";
        canvasDraw.fillRect(snakeA, snakeB, 20, 20);
        usedTiles.snake.pop();
    } else {
        usedTiles.apple.splice(checkCollision(snakeX,snakeY)[1], 1);
        sounds[0].play();
    }

    //add new snake tile ahead
    canvasDraw.fillStyle = "#2aa4cd";
    canvasDraw.fillRect(snakeX, snakeY, 20, 20);
    usedTiles.snake.unshift({x: snakeX, y: snakeY});
}

function spawnApple() {
    let appleX,appleY;

    //select random tiles until a vacant tile is found
    do {
        appleX = Math.floor(Math.random()*32)*20+1;
        appleY = Math.floor(Math.random()*32)*20+1;
    } while (checkCollision(appleX,appleY) != "moveOn");

    canvasDraw.drawImage(images[2], appleX, appleY, 20, 20);
    usedTiles.apple.push({x: appleX, y: appleY});
}

function checkCollision(collX, collY) {
    let event = "moveOn";

    usedTiles.snake.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "snakeCollision";
        };
    });

    //additionally returns index of found apple, so it can be easily removed from usedTiles.apple from within moveSnake()
    usedTiles.apple.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = ["appleCollision", usedTiles.apple.indexOf(tile)];
        };
    });

    usedTiles.mine.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "mineCollision";
        };
    });

    usedTiles.enemy.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "enemyCollision";
        }
    });

    usedTiles.wall.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "wallCollision";
        }
    })

    //returns the appropriate collision, if any was found, or "moveOn" if not
    return event;
}

function spawnMine() {
    let mineX,mineY;

    if (usedTiles.mine.length < gameSetup.maxMines) {
        //select random tiles, until free tile is found
        do {
            mineX = Math.floor(Math.random()*32)*20+1;
            mineY = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(mineX,mineY) != "moveOn");
        
        //prevent Mines from spawning less than 5 tiles ahead from snake head in recent moving direction
            //consider doing this within the do-while-loop to prevent skipping mine spawn
        if((direction == "left" && mineY == usedTiles.snake[0].y && mineX > (usedTiles.snake[0].x - 100) && mineX < usedTiles.snake[0].x) ||
        (direction == "right" && mineY == usedTiles.snake[0].y && mineX < (usedTiles.snake[0].x + 100) && mineX > usedTiles.snake[0].x) ||
        (direction == "up" && mineX == usedTiles.snake[0].x && mineY > (usedTiles.snake[0].y - 100) && mineY < usedTiles.snake[0].y) ||
        (direction == "down" && mineX == usedTiles.snake[0].x && mineY < (usedTiles.snake[0].y + 100) && mineY > usedTiles.snake[0].y)) {
            return;
        };

        canvasDraw.drawImage(images[1], mineX, mineY, 20, 20);
        usedTiles.mine.push({x: mineX, y: mineY});
    }
}

function despawnMine() {
    let demineX = usedTiles.mine[0].x;
    let demineY = usedTiles.mine[0].y;
    canvasDraw.fillStyle = "#3c3c3c";
    canvasDraw.fillRect(demineX, demineY, 20, 20);
    usedTiles.mine.shift();
}

function spawnEnemy() {
    let enemyX, enemyY;

    //select random tiles, until free tile is found, exclude tiles in starting line of player snake
    do {
        enemyX = Math.floor(Math.random()*32)*20+1;
        enemyY = Math.floor(Math.random()*32)*20+1;
    } while (checkCollision(enemyX,enemyY) != "moveOn" || enemyY == 321);
    
    canvasDraw.drawImage(images[3], enemyX, enemyY, 20, 20);
    usedTiles.enemy.push({x: enemyX, y: enemyY});
}

function moveEnemy() {
    usedTiles.enemy.forEach((tango) => {
        let enemyX = tango.x;
        let enemyY = tango.y;

        let enemyDirection = Math.floor(Math.random()*8);
        let enemyMoved = false;

        //50% chance to move, on move have equal chance to move in any of the 4 directions, only move if no collision, not allowed to warp to opposite side
        if (enemyDirection==0 && checkCollision(enemyX-20,enemyY) == "moveOn" && enemyX>1) {
            canvasDraw.drawImage(images[3], enemyX-20, enemyY, 20, 20);
            tango.x = enemyX-20;
            enemyMoved = true;
        } else if (enemyDirection==1 && checkCollision(enemyX+20,enemyY) == "moveOn" && enemyX<621) {
            canvasDraw.drawImage(images[3], enemyX+20, enemyY, 20, 20);
            tango.x = enemyX+20;
            enemyMoved = true;
        } else if (enemyDirection==2 && checkCollision(enemyX,enemyY-20) == "moveOn" && enemyY>1) {
            canvasDraw.drawImage(images[3], enemyX, enemyY-20, 20, 20);
            tango.y = enemyY-20;
            enemyMoved = true;
        } else if (enemyDirection==3 && checkCollision(enemyX,enemyY+20) == "moveOn" && enemyY<621) {
            canvasDraw.drawImage(images[3], enemyX, enemyY+20, 20, 20);
            tango.y = enemyY+20;
            enemyMoved = true;
        };

        if (enemyMoved == true) {
        canvasDraw.fillStyle = "#3c3c3c";
        canvasDraw.fillRect(enemyX, enemyY, 20, 20);
        };
    });
}

function spawnWall() {
    let wallDirection = Math.floor(Math.random()*2);
    let wallX, wallY;

    if (wallDirection == 0) {
        do {
            wallX = Math.floor(Math.random()*32)*20+1;
            wallY = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(wallX,wallY) != "moveOn" || (wallY >= 281 && wallY <= 321) || wallY >= 581);

        canvasDraw.drawImage(images[0], wallX, wallY, 20, 20);
        canvasDraw.drawImage(images[0], wallX, wallY+20, 20, 20);
        canvasDraw.drawImage(images[0], wallX, wallY+40, 20, 20);

        usedTiles.wall.push({x: wallX, y: wallY});
        usedTiles.wall.push({x: wallX, y: wallY+20});
        usedTiles.wall.push({x: wallX, y: wallY+40});
    } else if (wallDirection == 1) {
        do {
            wallX = Math.floor(Math.random()*32)*20+1;
            wallY = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(wallX,wallY) != "moveOn" || wallY == 321 || wallX >= 581);

        canvasDraw.drawImage(images[0], wallX, wallY, 20, 20);
        canvasDraw.drawImage(images[0], wallX+20, wallY, 20, 20);
        canvasDraw.drawImage(images[0], wallX+40, wallY, 20, 20);

        usedTiles.wall.push({x: wallX, y: wallY});
        usedTiles.wall.push({x: wallX+20, y: wallY});
        usedTiles.wall.push({x: wallX+40, y: wallY});
    }
}

function gameOver() {
    clearInterval(gameSetup.snakeInt);
    clearInterval(gameSetup.appleInt);
    clearInterval(gameSetup.mineInt);
    clearInterval(gameSetup.demineInt);
    clearInterval(gameSetup.enemyInt);
    canvasDraw.fillStyle = "#eeeeee";
    canvasDraw.font = "40px Arial";
    canvasDraw.textAlign = "center";
    canvasDraw.fillText("Game Over!", 320, 320);
}

//functions to process user input

function setDifficulty(d) {
    gameSetup.difficulty = d;
}

function toggleCustomSetup() {
    document.querySelector("#customwrapper").classList.toggle('show');
}

function toggleSounds() {
    sounds.forEach((sound) => {
        if (sound.muted == true) {
            sound.muted = false;
        } else {
            sound.muted = true;
        };
    });
}