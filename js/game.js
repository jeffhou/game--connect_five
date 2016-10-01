/**
 * Adds Event Listeners for keyboard events (pressing down and pressing up) and
 * these listeners save the events into the dictionary keysDown for use later.
 */
var keysDown = {};
addEventListener("keydown", function (e) { keysDown[e.keyCode] = true }, false);	//eventlisteners! so that the game knows to watch out for keypresses! woah!
addEventListener("keyup", function (e) { delete keysDown[e.keyCode] }, false);

var canvas = document.createElement("canvas"); //this creates the canvas! all the stuff we see exists on the canvas! woah!
var context = canvas.getContext("2d");	//canvas specifications

canvas.width = 672; canvas.height = 672;	//canvas specifications (size)
document.body.appendChild(canvas);			//place canvas in the main html code? woah?

function Game () {		//sets initial game parameters? woah?
	this.numPlayers = 2;
	this.currentPlayer = 0;
} Game.prototype.endTurn = function () {
    this.currentPlayer = (this.currentPlayer + 1) % 2;
}; var game = new Game();

/**
 * Constants singleton, collection of a lot of magic numbers
 */
var CONSTANTS = new function () {
	this.hashedDirections = [-1000, -1, 1, 1000];
	this.tileWidth = 32;
	this.mapWidth = 21;
	this.mapHeight = 21;
};

var IMAGES = new function () {
	this.empty = new ImageObject ("images/empty.png");
	this.black = new ImageObject ("images/black.png");
	this.white = new ImageObject ("images/white.png");
};

/**
 * Class that contains the cursor used in the game. Self-explanatory for the
 * most part.
 */

function Cursor() {
	this.imageObject = new ImageObject ("images/cursor.png");
	this.x = 10;
	this.y = 10;
} Cursor.prototype.coor = function () {
	return new Coor(this.x, this.y);
}; Cursor.prototype.draw = function () {
	this.imageObject.drawOnGrid(this.x, this.y);
}; Cursor.prototype.coorOnScreen = function () {
    return this.coor().screenify();
}; Cursor.prototype.up = function () {
    if(cursor.y != 0) {   //if the cursor isn't in the top row
        cursor.y -= 1;  //when you're going up, you're always decreasing the y value
    }
}; Cursor.prototype.down = function () {
    if(cursor.y != 21 - 1) {
        cursor.y += 1;
    }
}; Cursor.prototype.left = function () {
    if(cursor.x != 0) {
        cursor.x -= 1;
    }
}; Cursor.prototype.right = function () {
    if(cursor.x != 21 - 1) {
        cursor.x += 1;
    }
}; Cursor.prototype.jumpTo = function (coor) {
    this.x = coor.x;
    this.y = coor.y;
}; cursor = new Cursor();


/**
 * Class that encapsulates coordinates. Screenify and unscreenify change
 * the displacements from the top left of the screen to the top left of the
 * entire map.
 */
function Coor (x, y) {
	this.x = x;
	this.y = y;
} Coor.prototype.equals = function (coor) {
	if (coor instanceof Coor) return this.x == coor.x && this.y == coor.y;
	return false;
}; Coor.prototype.unscreenify = function () {
	return new Coor(this.x + grid.xDisplace, this.y + grid.yDisplace);
}; Coor.prototype.screenify = function () {
	return new Coor(this.x - grid.xDisplace, this.y - grid.yDisplace);
};
/**
 * We hash coordinates to integers so that we can store them in arrays and
 * use array methods without programming our own. As long as x and y are both
 * between 0 and 999 inclusive, the coordinates and the hash are 1-to-1
 */
function hashCoor (coor) {
	return coor.x * 1000 + coor.y;
}
function unhashCoor (hashedCoor) {
	return new Coor(parseInt(hashedCoor / 1000), hashedCoor % 1000);
}

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
    if (38 in keysDown) { // Player holding the up button
        cursor.up();
    }
    if (40 in keysDown) { // Player holding down
        cursor.down();
    }
    if (37 in keysDown) { // Player holding left
        cursor.left();
    }
    if (39 in keysDown) { // Player holding right
        cursor.right();
    }
    if (90 in keysDown) { // pressed "z" which is actually "a" for our emulator
        if (grid[cursor.x][cursor.y] == -1) {
            grid[cursor.x][cursor.y] = game.currentPlayer;
            game.endTurn();
        }
    }
    keysDown = {};
}
function drawAll () {
    for (i = 0; i < 21; i++) {
        for (j = 0; j < 21; j++) {
            if (grid[i][j] == -1) {
                IMAGES.empty.draw(i * 32, j * 32);
            } else if (grid[i][j] == 0) {
                IMAGES.black.draw(i * 32, j * 32);
            } else if (grid[i][j] == 1) {
                IMAGES.white.draw(i * 32, j * 32);
            }
        }
    }
	cursor.draw(); // draws the cursor
};
var main = function () {
	processInputs();
	drawAll();
    requestAnimationFrame(main);
}; main();
