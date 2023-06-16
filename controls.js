//basic controls w,a,s,d and arrow keys, checks for and blocks 180° turns
export function setupControls(movement) {
    document.addEventListener("keydown", (pressed) => {
        switch (pressed.key) {
            case "ArrowLeft":
            case "a":
                if(movement.lastMove != "right") {
                    movement.snakeDirection = "left";
                };
                break;
            case "ArrowRight":
            case "d":
                if(movement.lastMove != "left") {
                    movement.snakeDirection = "right";
                };
                break;
            case "ArrowUp":
            case "w":
                if(movement.lastMove != "down") {
                    movement.snakeDirection = "up";
                };
                break;
            case "ArrowDown":
            case "s":
                if(movement.lastMove != "up") {
                    movement.snakeDirection = "down";
                };
                break;
        };
    });
};