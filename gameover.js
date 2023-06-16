import { gameCanvas } from "./sscript.js";

export function gameOver(gameSetup) {
    Object.keys(gameSetup).forEach ((interval) => {
        clearInterval(gameSetup[interval]);
    });
    gameCanvas.fillStyle = "#eeeeee";
    gameCanvas.font = "40px Arial";
    gameCanvas.textAlign = "center";
    gameCanvas.fillText("Game Over!", 320, 320);
};