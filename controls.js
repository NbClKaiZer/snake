//basic controls w,a,s,d and arrow keys, checks for and blocks 180° turns
export function setupControls(thisSnake) {
    document.addEventListener("keydown", (pressed) => {
        switch (pressed.key) {
            case "ArrowLeft":
            case "a":
                if(thisSnake.lastMove != "right") {
                    thisSnake.direction = "left";
                };
                break;
            case "ArrowRight":
            case "d":
                if(thisSnake.lastMove != "left") {
                    thisSnake.direction = "right";
                };
                break;
            case "ArrowUp":
            case "w":
                if(thisSnake.lastMove != "down") {
                    thisSnake.direction = "up";
                };
                break;
            case "ArrowDown":
            case "s":
                if(thisSnake.lastMove != "up") {
                    thisSnake.direction = "down";
                };
                break;
        };
    });
};