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

//consider reducing number of global variables by grouping some into arrays
const board = document.querySelector("#board");
const grid = board.getContext("2d");
const snake = board.getContext("2d");
const apple = board.getContext("2d");
const mine = board.getContext("2d");
const enemy = board.getContext("2d");
const wall = board.getContext("2d");
let snakeTiles = [];
let appleTiles = [];
let mineTiles = [];
let enemyTiles = [];
let wallTiles = [];
let direction = "left";
let lastMove = "left";
let snakeInt;
let appleInt;
let mineInt;
let demineInt;
let enemyInt;
let difficulty = 2;
const sounds = [new Audio("./bleep.mp3"), new Audio("./boom.mp3"), new Audio("./hurt.mp3"), new Audio("./shoot.mp3")];
const brickImg = new Image();
brickImg.src = "./bricks.png";
const mineImg = new Image();
mineImg.src = "./landmine.png";
const appleImg = new Image();
appleImg.src = "./apple.png";
const spiderImg = new Image();
spiderImg.src = "./spider.png";
let maxMines;
let enemyAmount;
let wallAmount;

//Debug-Grid generator
/*for (let i=1; i<=641; i+=20) {
    grid.moveTo(i, 0);
    grid.lineTo(i, 641);
    grid.moveTo(0, i);
    grid.lineTo(641, i);
    grid.stroke();
}*/

//board outer border
grid.rect(0, 0, 642, 642);
grid.strokeStyle = "#bbbbbb";
grid.stroke();
grid.fillStyle= "#3c3c3c"
grid.fillRect(1, 1, 640, 640);

function startGame() {
    //reset tile arrays, move direction, intervals and board
    snakeTiles = [];
    appleTiles = [];
    mineTiles = [];
    enemyTiles = [];
    wallTiles = [];
    snakeDirection = "left";
    lastMove = "left";
    clearInterval(snakeInt);
    clearInterval(appleInt);
    clearInterval(mineInt);
    clearInterval(demineInt);
    clearInterval(enemyInt);
    grid.fillStyle= "#3c3c3c"
    grid.fillRect(1, 1, 640, 640);
    document.querySelector("#customconfirm").classList.remove('show');
    
    //initial snake figure generation
    snake.fillStyle = "#2aa4cd";
    for (let j=0; j<=3; j++) {
        let snakeX = 321 + j * 20;
        let snakeY = 321;
        snake.fillRect(snakeX, snakeY, 20, 20);
        snakeTiles.push({x: snakeX, y: snakeY});
    }
    
    //initialize movement and item spawns
    if (difficulty == 0) {
        snakeInt = setInterval(moveSnake, 250);
        appleInt = setInterval(spawnApple, 7500);
        maxMines = 0;
    } else if (difficulty == 1) {
        snakeInt = setInterval(moveSnake, 200);
        appleInt = setInterval(spawnApple, 6000);
        mineInt = setInterval(spawnMine, 10000);
        demineInt = setInterval(despawnMine, 12000);
        maxMines = 10;
        wallAmount = 2;
    } else if  (difficulty == 2) {
        snakeInt = setInterval(moveSnake, 150);
        appleInt = setInterval(spawnApple, 4500);
        mineInt = setInterval(spawnMine, 6000);
        demineInt = setInterval(despawnMine, 12000);
        enemyInt = setInterval(moveEnemy, 500);
        maxMines = 20;
        wallAmount = 5;
        enemyAmount = 1;
    } else if  (difficulty == 3) {
        snakeInt = setInterval(moveSnake, 100);
        appleInt = setInterval(spawnApple, 3000);
        mineInt = setInterval(spawnMine, 4500);
        demineInt = setInterval(despawnMine, 12000);
        enemyInt = setInterval(moveEnemy, 300);
        maxMines = 30;
        wallAmount = 10;
        enemyAmount = 3;
    } else if  (difficulty == 4) {
        snakeInt = setInterval(moveSnake, 75);
        appleInt = setInterval(spawnApple, 3000);
        mineInt = setInterval(spawnMine, 3000);
        demineInt = setInterval(despawnMine, 15000);
        enemyInt = setInterval(moveEnemy, 100);
        maxMines = 50;
        wallAmount = 15;
        enemyAmount = 5;
    } else if (difficulty == 'custom') {
        document.querySelector("#customconfirm").classList.add('show');
        snakeInt = setInterval(moveSnake, document.querySelector("#snakeInt").value);
        appleInt = setInterval(spawnApple, document.querySelector("#appleInt").value);
        mineInt = setInterval(spawnMine, document.querySelector("#mineInt").value);
        demineInt = setInterval(despawnMine, document.querySelector("#demineInt").value);
        enemyInt = setInterval(moveEnemy, document.querySelector("#enemyInt").value);
        maxMines = document.querySelector("#maxMines").value;
        wallAmount = document.querySelector("#wallAmount").value;
        enemyAmount = document.querySelector("#enemyAmount").value;
    }

    //spawn initial nonplayer-objects
    spawnApple();
    for (let i=0; i<enemyAmount; i++) {
        spawnEnemy();
    }
    for (let j=0; j<wallAmount; j++) {
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
    let snakeX = snakeTiles[0].x;
    let snakeY = snakeTiles[0].y;

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
        let snakeA = snakeTiles[snakeTiles.length - 1].x;
        let snakeB = snakeTiles[snakeTiles.length - 1].y;
        snake.fillStyle = "#3c3c3c";
        snake.fillRect(snakeA, snakeB, 20, 20);
        snakeTiles.pop();
    } else {
        appleTiles.splice(checkCollision(snakeX,snakeY)[1], 1);
        sounds[0].play();
    }

    //add new snake tile ahead
    snake.fillStyle = "#2aa4cd";
    snake.fillRect(snakeX, snakeY, 20, 20);
    snakeTiles.unshift({x: snakeX, y: snakeY});
}

function spawnApple() {
    let appleX,appleY;

    //select random tiles until a vacant tile is found
    do {
        appleX = Math.floor(Math.random()*32)*20+1;
        appleY = Math.floor(Math.random()*32)*20+1;
    } while (checkCollision(appleX,appleY) != "moveOn");

    apple.drawImage(appleImg, appleX, appleY, 20, 20);
    appleTiles.push({x: appleX, y: appleY});
}

function checkCollision(collX, collY) {
    let event = "moveOn";

    snakeTiles.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "snakeCollision";
        };
    });

    //additionally returns index of found apple, so it can be easily removed from appleTiles from within moveSnake()
    appleTiles.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = ["appleCollision", appleTiles.indexOf(tile)];
        };
    });

    mineTiles.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "mineCollision";
        };
    });

    enemyTiles.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "enemyCollision";
        }
    });

    wallTiles.forEach((tile) => {
        if (tile.x == collX && tile.y == collY) {
            event = "wallCollision";
        }
    })

    //returns the appropriate collision, if any was found, or "moveOn" if not
    return event;
}

function spawnMine() {
    let mineX,mineY;

    if (mineTiles.length < maxMines) {
        //select random tiles, until free tile is found
        do {
            mineX = Math.floor(Math.random()*32)*20+1;
            mineY = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(mineX,mineY) != "moveOn");
        
        //prevent Mines from spawning less than 5 tiles ahead from snake head in recent moving direction
            //consider doing this within the do-while-loop to prevent skipping mine spawn
        if((direction == "left" && mineY == snakeTiles[0].y && mineX > (snakeTiles[0].x - 100) && mineX < snakeTiles[0].x) ||
        (direction == "right" && mineY == snakeTiles[0].y && mineX < (snakeTiles[0].x + 100) && mineX > snakeTiles[0].x) ||
        (direction == "up" && mineX == snakeTiles[0].x && mineY > (snakeTiles[0].y - 100) && mineY < snakeTiles[0].y) ||
        (direction == "down" && mineX == snakeTiles[0].x && mineY < (snakeTiles[0].y + 100) && mineY > snakeTiles[0].y)) {
            return;
        };

        mine.drawImage(mineImg, mineX, mineY, 20, 20);
        mineTiles.push({x: mineX, y: mineY});
    }
}

function despawnMine() {
    let demineX = mineTiles[0].x;
    let demineY = mineTiles[0].y;
    mine.fillStyle = "#3c3c3c";
    mine.fillRect(demineX, demineY, 20, 20);
    mineTiles.shift();
}

function spawnEnemy() {
    let enemyX, enemyY;

    //select random tiles, until free tile is found, exclude tiles in starting line of player snake
    do {
        enemyX = Math.floor(Math.random()*32)*20+1;
        enemyY = Math.floor(Math.random()*32)*20+1;
    } while (checkCollision(enemyX,enemyY) != "moveOn" || enemyY == 321);
    
    enemy.drawImage(spiderImg, enemyX, enemyY, 20, 20);
    enemyTiles.push({x: enemyX, y: enemyY});
}

function moveEnemy() {
    enemyTiles.forEach((tango) => {
        let enemyX = tango.x;
        let enemyY = tango.y;

        let enemyDirection = Math.floor(Math.random()*8);
        let enemyMoved = false;

        //50% chance to move, on move have equal chance to move in any of the 4 directions, only move if no collision, not allowed to warp to opposite side
        if (enemyDirection==0 && checkCollision(enemyX-20,enemyY) == "moveOn" && enemyX>1) {
            enemy.drawImage(spiderImg, enemyX-20, enemyY, 20, 20);
            tango.x = enemyX-20;
            enemyMoved = true;
        } else if (enemyDirection==1 && checkCollision(enemyX+20,enemyY) == "moveOn" && enemyX<621) {
            enemy.drawImage(spiderImg, enemyX+20, enemyY, 20, 20);
            tango.x = enemyX+20;
            enemyMoved = true;
        } else if (enemyDirection==2 && checkCollision(enemyX,enemyY-20) == "moveOn" && enemyY>1) {
            enemy.drawImage(spiderImg, enemyX, enemyY-20, 20, 20);
            tango.y = enemyY-20;
            enemyMoved = true;
        } else if (enemyDirection==3 && checkCollision(enemyX,enemyY+20) == "moveOn" && enemyY<621) {
            enemy.drawImage(spiderImg, enemyX, enemyY+20, 20, 20);
            tango.y = enemyY+20;
            enemyMoved = true;
        };

        if (enemyMoved == true) {
        enemy.fillStyle = "#3c3c3c";
        enemy.fillRect(enemyX, enemyY, 20, 20);
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

        wall.drawImage(brickImg, wallX, wallY, 20, 20);
        wall.drawImage(brickImg, wallX, wallY+20, 20, 20);
        wall.drawImage(brickImg, wallX, wallY+40, 20, 20);

        wallTiles.push({x: wallX, y: wallY});
        wallTiles.push({x: wallX, y: wallY+20});
        wallTiles.push({x: wallX, y: wallY+40});
    } else if (wallDirection == 1) {
        do {
            wallX = Math.floor(Math.random()*32)*20+1;
            wallY = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(wallX,wallY) != "moveOn" || wallY == 321 || wallX >= 581);

        wall.drawImage(brickImg, wallX, wallY, 20, 20);
        wall.drawImage(brickImg, wallX+20, wallY, 20, 20);
        wall.drawImage(brickImg, wallX+40, wallY, 20, 20);

        wallTiles.push({x: wallX, y: wallY});
        wallTiles.push({x: wallX+20, y: wallY});
        wallTiles.push({x: wallX+40, y: wallY});
    }
}

function gameOver() {
    clearInterval(snakeInt);
    clearInterval(appleInt);
    clearInterval(mineInt);
    clearInterval(demineInt);
    clearInterval(enemyInt);
    grid.fillStyle = "#eeeeee";
    grid.font = "40px Arial";
    grid.textAlign = "center";
    grid.fillText("Game Over!", 320, 320);
}

//functions to process user input

function setDifficulty(d) {
    difficulty = d;
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