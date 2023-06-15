import { sounds } from "./assets.js";

export const gameSetup = {
    difficulty: "diff2"
};

//functions to process user input
const diffBtns = document.querySelectorAll(".diffbutton")
diffBtns.forEach ((btn) => {
    btn.addEventListener('click', () => {
        gameSetup.difficulty = btn.id;
    });
});

document.querySelector("#customtoggle").addEventListener('click', () => {
    document.querySelector("#customwrapper").classList.toggle('show');
});

document.querySelector("#soundtoggle").addEventListener('click', () => {
    Object.keys(sounds).forEach((sound) => {
        if (sounds[sound].muted == true) {
            sounds[sound].muted = false;
        } else {
            sounds[sound].muted = true;
        };
    });
});