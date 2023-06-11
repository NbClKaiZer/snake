/*Roadmap for v2.0
- add 1-tile enemies DONE
- allow enemies to randomly move to free tiles, if available DONE
- game over on enemy collision DONE
- add solid, impassable walls (entire tiles for now, maybe 2px borders later)
- game over on wall collision
- add enemy 4-tile snakes
- make enemy snakes look for free tiles in movement direction
- have enemy snakes die when no free tile is available for their next move
- have enemy snakes grow on apple collision
- game over on collision with enemy snake
- add adventure mode
- add the first 5 pre-made levels and challenges
- add graphics for apples, mines and 1-tile enemies
*/

//consider reducing number of global variables by grouping some into arrays
const board = document.querySelector("#board");
const grid = board.getContext("2d");
const snake = board.getContext("2d");
const apple = board.getContext("2d");
const mine = board.getContext("2d");
const enemy = board.getContext("2d");
let snakeTiles = [];
let appleTiles = [];
let mineTiles = [];
let enemyTiles = [];
let direction = "left";
let lastMove = "left";
let snakeInt;
let appleInt;
let mineInt;
let demineInt;
let enemyInt;
let difficulty = 2;
let sounds = [new Audio("./bleep.mp3"), new Audio("./boom.mp3"), new Audio("./hurt.mp3"), new Audio("./shoot.mp3")];
let maxMines;
let enemyAmount;

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
    direction = "left";
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
        let x = 321 + j * 20;
        let y = 321;
        snake.fillRect(x, y, 20, 20);
        snakeTiles.push({x: x, y: y});
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
    } else if  (difficulty == 2) {
        snakeInt = setInterval(moveSnake, 150);
        appleInt = setInterval(spawnApple, 4500);
        mineInt = setInterval(spawnMine, 6000);
        demineInt = setInterval(despawnMine, 12000);
        enemyInt = setInterval(moveEnemy, 500);
        maxMines = 20;
        enemyAmount = 1;
    } else if  (difficulty == 3) {
        snakeInt = setInterval(moveSnake, 100);
        appleInt = setInterval(spawnApple, 3000);
        mineInt = setInterval(spawnMine, 4500);
        demineInt = setInterval(despawnMine, 12000);
        enemyInt = setInterval(moveEnemy, 300);
        maxMines = 30;
        enemyAmount = 3;
    } else if  (difficulty == 4) {
        snakeInt = setInterval(moveSnake, 75);
        appleInt = setInterval(spawnApple, 3000);
        mineInt = setInterval(spawnMine, 3000);
        demineInt = setInterval(despawnMine, 15000);
        enemyInt = setInterval(moveEnemy, 100);
        maxMines = 50;
        enemyAmount = 5;
    } else if (difficulty == 'custom') {
        document.querySelector("#customconfirm").classList.add('show');
        snakeInt = setInterval(moveSnake, document.querySelector("#snakeInt").value);
        appleInt = setInterval(spawnApple, document.querySelector("#appleInt").value);
        mineInt = setInterval(spawnMine, document.querySelector("#mineInt").value);
        demineInt = setInterval(despawnMine, document.querySelector("#demineInt").value);
        enemyInt = setInterval(moveEnemy, document.querySelector("#enemyInt").value);
        maxMines = document.querySelector("#maxMines").value;
        enemyAmount = document.querySelector("#enemyAmount").value;
    }

    //spawn initial nonplayer-objects
    spawnApple();
    for (let i=0; i<enemyAmount; i++) {
        spawnEnemy();
    }
}

//basic controls w,a,s,d and arrow keys, checks for and blocks 180° turns
document.onkeydown = (e) => {
    switch (e.key) {
        case "ArrowLeft":
        case "a":
            if(lastMove != "right") {
                direction = "left";
            }
            break;
        case "ArrowRight":
        case "d":
            if(lastMove != "left") {
                direction = "right";
            }
            break;
        case "ArrowUp":
        case "w":
            if(lastMove != "down") {
                direction = "up";
            }
            break;
        case "ArrowDown":
        case "s":
            if(lastMove != "up") {
                direction = "down";
            }
            break;
    }
}

function moveSnake() {
    let x = snakeTiles[0].x;
    let y = snakeTiles[0].y;

    //determin location of next tile, save movement direction for 180° check
    if (direction == "left") {
        lastMove = "left";
        x = x-20;
        if (x == -19) {
            x = 621;
        }
    } else if (direction == "right") {
        lastMove = "right";
        x = x+20;
        if (x == 641) {
            x = 1;
        }
    } else if (direction == "up") {
        lastMove = "up";
        y = y-20;
        if (y == -19) {
            y = 621;
        }
    } else if (direction == "down") {
        lastMove = "down";
        y = y+20;
        if (y == 641) {
            y = 1;
        }
    }

    //remove oldest snake tile if no apple is eaten this turn
    if (checkCollision(x,y)[0] != "appleCollision") {
        let a = snakeTiles[snakeTiles.length - 1].x;
        let b = snakeTiles[snakeTiles.length - 1].y;
        snake.fillStyle = "#3c3c3c";
        snake.fillRect(a, b, 20, 20);
        snakeTiles.pop();
    } else {
        appleTiles.splice(checkCollision(x,y)[1], 1);
        sounds[0].play();
    }

    //if tile targeted by current move is inhibited by an enemy, mine or snake - game over
    if (checkCollision(x,y) == "snakeCollision") {
        sounds[2].play();
        gameOver();
        return;
    } else if (checkCollision(x,y) == "mineCollision") {
        sounds[1].play();
        gameOver();
        return;
    } else if (checkCollision(x,y) == "enemyCollision") {
        sounds[3].play();
        gameOver();
        return;
    }

    //add new snake tile ahead
    snake.fillStyle = "#2aa4cd";
    snake.fillRect(x, y, 20, 20);
    snakeTiles.unshift({x: x, y: y});
}

function spawnApple() {
    let x,y;

    //select random tiles until a vacant tile is found
    do {
        x = Math.floor(Math.random()*32)*20+1;
        y = Math.floor(Math.random()*32)*20+1;
    } while (checkCollision(x,y) != "moveOn");

    apple.fillStyle = "#a2c037";
    apple.fillRect(x, y, 20, 20);
    appleTiles.push({x: x, y: y});
}

function checkCollision(a, b) {
    let event = "moveOn";

    snakeTiles.forEach((tile) => {
        if (tile.x == a && tile.y == b) {
            event = "snakeCollision";
        };
    });

    //additionally returns index of found apple, so it can be easily removed from appleTiles from within moveSnake()
    appleTiles.forEach((tile) => {
        if (tile.x == a && tile.y == b) {
            event = ["appleCollision", appleTiles.indexOf(tile)];
        };
    });

    mineTiles.forEach((tile) => {
        if (tile.x == a && tile.y == b) {
            event = "mineCollision";
        };
    });

    enemyTiles.forEach((tile) => {
        if (tile.x == a && tile.y == b) {
            event = "enemyCollision";
        }
    });

    //returns the appropriate collision, if any was found, or "moveOn" if not
    return event;
}

function spawnMine() {
    let x,y;

    if (mineTiles.length < maxMines) {
        //select random tiles, until free tile is found
        do {
            x = Math.floor(Math.random()*32)*20+1;
            y = Math.floor(Math.random()*32)*20+1;
        } while (checkCollision(x,y) != "moveOn");
        
        //prevent Mines from spawning less than 5 tiles ahead from snake head in recent moving direction
            //consider doing this within the do-while-loop to prevent skipping mine spawn
        if((direction == "left" && y == snakeTiles[0].y && x > (snakeTiles[0].x - 100) && x < snakeTiles.x) ||
        (direction == "right" && y == snakeTiles[0].y && x < (snakeTiles[0].x + 100) && x > snakeTiles.x) ||
        (direction == "up" && x == snakeTiles[0].x && y > (snakeTiles[0].y - 100) && y < snakeTiles.y) ||
        (direction == "down" && x == snakeTiles[0].x && y < (snakeTiles[0].y + 100) && y > snakeTiles.y)) {
            return;
        };

        mine.fillStyle = "red";
        mine.fillRect(x, y, 20, 20);
        mineTiles.push({x: x, y: y});
    }
}

function despawnMine() {
    let a = mineTiles[0].x;
    let b = mineTiles[0].y;
    mine.fillStyle = "#3c3c3c";
    mine.fillRect(a, b, 20, 20);
    mineTiles.shift();
}

function spawnEnemy() {
    let x, y;

    //select random tiles, until free tile is found, exclude tiles in starting line of player snake
    do {
        x = Math.floor(Math.random()*32)*20+1;
        y = Math.floor(Math.random()*32)*20+1;
    } while (checkCollision(x,y) != "moveOn" || y == 321);

    enemy.fillStyle = "orange";
    enemy.fillRect(x, y, 20, 20);
    enemyTiles.push({x: x, y: y});
}

function moveEnemy() {
    enemyTiles.forEach((tango) => {
        let x = tango.x;
        let y = tango.y;

        let c = Math.floor(Math.random()*8);
        let enemyMoved = false;
        enemy.fillStyle = "orange";

        //50% chance to move, on move have equal chance to move in any of the 4 directions, only move if no collision, not allowed to warp to opposite side
        if (c==0 && checkCollision(x-20,y) == "moveOn" && x>1) {
            enemy.fillRect(x-20, y, 20, 20);
            tango.x = x-20;
            enemyMoved = true;
        } else if (c==1 && checkCollision(x+20,y) == "moveOn" && x<621) {
            enemy.fillRect(x+20, y, 20, 20);
            tango.x = x+20;
            enemyMoved = true;
        } else if (c==2 && checkCollision(x,y-20) == "moveOn" && y>1) {
            enemy.fillRect(x, y-20, 20, 20);
            tango.y = y-20;
            enemyMoved = true;
        } else if (c==3 && checkCollision(x,y+20) == "moveOn" && y<621) {
            enemy.fillRect(x, y+20, 20, 20);
            tango.y = y+20;
            enemyMoved = true;
        };

        if (enemyMoved == true) {
        enemy.fillStyle = "#3c3c3c";
        enemy.fillRect(x, y, 20, 20);
        };
    });
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