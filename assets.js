const images = {
    "bricks": new Image(),
    "landmine": new Image(),
    "apple": new Image(),
    "spider": new Image()
};
images.bricks.src = "./bricks.png";
images.landmine.src = "./landmine.png";
images.apple.src = "./apple.png";
images.spider.src = "./spider.png";

const sounds = {
    bleep: new Audio("./bleep.mp3"),
    boom: new Audio("./boom.mp3"),
    hurt: new Audio("./hurt.mp3"),
    shoot: new Audio("./shoot.mp3")
};
sounds.bleep.volume = 0.5;

export {images, sounds};