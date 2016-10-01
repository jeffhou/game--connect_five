/**
 * Adds Event Listeners for keyboard events (pressing down and pressing up) and
 * these listeners save the events into the dictionary keysDown for use later.
 */
var keysDown = {};
addEventListener("keydown", function (e) { keysDown[e.keyCode] = true }, false);	//eventlisteners! so that the game knows to watch out for keypresses! woah!
addEventListener("keyup", function (e) { delete keysDown[e.keyCode] }, false);

var canvas = document.createElement("canvas"); //this creates the canvas! all the stuff we see exists on the canvas! woah!
var context = canvas.getContext("2d");	//canvas specifications

canvas.width = 400; canvas.height = 250;	//canvas specifications (size)
document.body.appendChild(canvas);			//place canvas in the main html code? woah?

function Game () {		//sets initial game parameters? woah?
	this.newGame();
} Game.prototype.newGame = function () {
    this.cards = [];
    for (i = 0; i < 4; i++) {
        this.cards.push(Math.floor(Math.random() * 13) + 1);
    }
}; var game = new Game();


var IMAGES = new function () {
	this.card = new ImageObject ("images/card.png");
};

/**
 * ImageObject encapsulates the necessary functions to load and print an
 * image. Only after an image loads does it actually display on the screen.
 * If an image does not load, you can assume either image is missing or name
 * is misspelled. (when you set the src for an image, it begins loading)
 */
function ImageObject (imagePath) {
	this.image = new Image();
	this.image.ready = false;
	this.image.onload = function () {
		this.ready = true;
	}
	this.image.src = imagePath;
} ImageObject.prototype.draw = function (x, y) {
	if (this.image.ready) {
		context.drawImage(this.image, x, y);
	}
}; ImageObject.prototype.drawOnGrid = function (x, y) {
	if (this.image.ready) {
		context.drawImage(this.image, x * 32, y * 32);
	}
};
grid = [];
for (i = 0; i < 21; i++) {
    grid.push([]);
    for (j = 0; j < 21; j++) {
        grid[i].push(-1);
    }
}

function processInputs () {
    if (90 in keysDown) { // pressed "z" which is actually "a" for our emulator
        game.newGame();
    }
    keysDown = {};
}
function drawAll () {
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 2; j++) {
            IMAGES.card.draw(i * 200, j * 125);
            context.font = "28px Arial Bold";
            context.fillStyle = "#ff00ff";
            context.fillText(game.cards[i * 2 + j], i * 200 + 95, j * 125 + 70);
        }
    }
};
var main = function () {
	processInputs();
	drawAll();
    requestAnimationFrame(main);
}; main();
