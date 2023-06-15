export function gameOver(gameSetup, canvas) {
    Object.keys(gameSetup).forEach ((interval) => {
        clearInterval(gameSetup[interval]);
    });
    canvas.fillStyle = "#eeeeee";
    canvas.font = "40px Arial";
    canvas.textAlign = "center";
    canvas.fillText("Game Over!", 320, 320);
};