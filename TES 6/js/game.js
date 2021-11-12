const HEIGHT_WINDOW = window.innerHeight;
const WIDTH_WINDOW = window.innerWidth;
const SIZE_MATRIX = 6;
const SIZE_CIRCLES = WIDTH_WINDOW / 20;
const PADDING =  WIDTH_WINDOW / 15;
const START_Y = WIDTH_WINDOW / 10;
const START_X = WIDTH_WINDOW / 2;
const WIDTH_LINE = 10;
const COLOR_TEXT = '#E7B720';
let background;
let circles = [];
let lines = [];
let index = 0;
let indexArrX = [];
let indexArrY = [];
let isClicking = false;
let score = 0;
let scoreText;
let color = ['green', 'blue', 'red', 'purple', 'yellow']
class Point {
    constructor(sprite, x, y, color, destroy) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.color = color;
        this.destroyBool = destroy;

    }
    Move(){
         if (this.sprite.y < this.y) {
            this.sprite.y += 5;
            this.bool = true;
        }
    }
    destroy(){
        index = 0;
        this.sprite.visible = false;
        this.y = START_Y;
        this.sprite.y = 0;
        this.sprite.visible = true;
        this.color = color[Math.floor(Math.random() * 4)];
        this.sprite.loadTexture(this.color);
        this.destroyBool = false;
        this.Move();
    }
}
let game = new Phaser.Game(WIDTH_WINDOW, HEIGHT_WINDOW, Phaser.AUTO,'', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    game.load.image('green', 'assets/green.png');
    game.load.image('blue', 'assets/blue.png');
    game.load.image('red', 'assets/red.png');
    game.load.image('purple', 'assets/purple.png');
    game.load.image('yellow', 'assets/yellow.png');
    game.load.image('background', 'assets/background.jpg');
}

function create() {
    function initWorld() {
        background = game.add.sprite(0, 0, "background");
        background.width = WIDTH_WINDOW;
        background.height = HEIGHT_WINDOW;
        scoreText = game.add.text(WIDTH_WINDOW - START_X + SIZE_CIRCLES * (WIDTH_LINE - SIZE_MATRIX), 5, "Points: 0", {font: SIZE_CIRCLES+'px Arial', fill: COLOR_TEXT});
    }
   function initCircle() {
        game.debug.lineWidth = WIDTH_LINE;
        let counter = -PADDING;
        for (let i = 0; i < SIZE_MATRIX; i++) {
            circles[i] = [];
        }
        for (let i = 0; i < SIZE_MATRIX; i++) {
            counter += PADDING;
            for (let j = 0; j < SIZE_MATRIX; j++) {
                circles[i][j] = new Point();
                circles[i][j].destroyBool = false;
                circles[i][j].y = START_Y + counter;
                circles[i][j].color = color[Math.floor(Math.random() * color.length)];
                circles[i][j].sprite = game.add.sprite(START_X + j * PADDING, 0, circles[i][j].color);
                circles[i][j].sprite.anchor.set(0.5);
                circles[i][j].sprite.inputEnabled = true;
                circles[i][j].sprite.events.onInputOut.add(check, this)
                circles[i][j].sprite.events.onInputDown.add(click, this)
                circles[i][j].sprite.width = SIZE_CIRCLES;
                circles[i][j].sprite.height = SIZE_CIRCLES;
            }
        }
    }
    initWorld();
    initCircle();
}
function check() {
    if (isClicking) {
        for (let i = 0; i < SIZE_MATRIX; i++)
            for (let j = 0; j < SIZE_MATRIX; j++) {
                let counter = 0;
                if (game.input.x > circles[i][j].sprite.x - SIZE_CIRCLES &&
                    game.input.x < circles[i][j].sprite.x + SIZE_CIRCLES &&
                    game.input.y > circles[i][j].sprite.y - SIZE_CIRCLES &&
                    game.input.y < circles[i][j].sprite.y + SIZE_CIRCLES
                ) {
                    if (circles[i][j].color === circles[indexArrX[0]][indexArrY[0]].color) {
                        if (lines[0])
                            for (let jj = 0; jj < indexArrX.length; jj++) {
                                if ((indexArrX[jj] === i && indexArrY[jj] !== j) ||
                                    (indexArrX[jj] !== i && indexArrY[jj] === j) ||
                                    (indexArrX[jj] !== i && indexArrY[jj] !== j)) {

                                    counter++;
                                }
                            }
                        if (counter === indexArrX.length) {
                            if (((indexArrX[indexArrX.length - 1] === i + 1) && (indexArrY[indexArrX.length - 1] === j)) ||
                                (indexArrX[indexArrX.length - 1] === i - 1) && (indexArrY[indexArrX.length - 1] === j) ||
                                (indexArrY[indexArrX.length - 1] === j + 1) && (indexArrX[indexArrX.length - 1] === i) ||
                                (indexArrY[indexArrX.length - 1] === j - 1) && (indexArrX[indexArrX.length - 1] === i)) {
                                circles[i][j].destroyBool = true;
                                index++
                                indexArrX[index] = i;
                                indexArrY[index] = j;
                                lines[index] = new Phaser.Line(circles[i][j].sprite.x, circles[i][j].sprite.y, circles[0][0].sprite.x, circles[0][0].sprite.y);
                            }
                        } else {
                            if (((indexArrX[indexArrX.length - 1] === i + 1) && (indexArrY[indexArrX.length - 1] === j)) ||
                                (indexArrX[indexArrX.length - 1] === i - 1) && (indexArrY[indexArrX.length - 1] === j) ||
                                (indexArrY[indexArrX.length - 1] === j + 1) && (indexArrX[indexArrX.length - 1] === i) ||
                                (indexArrY[indexArrX.length - 1] === j - 1) && (indexArrX[indexArrX.length - 1] === i)) {

                                circles[indexArrX[indexArrX.length - 1]][indexArrY[indexArrY.length - 1]].destroyBool = false;
                                indexArrX[index] = i;
                                indexArrY[index] = j
                                index--;
                                indexArrX.length--;
                                indexArrY.length--;
                                lines.length--;
                            }

                        }
                    }

                }
            }
    }
}
function click() {
    for (let i = 0; i < SIZE_MATRIX; i++)
        for (let j = 0; j < SIZE_MATRIX; j++) {
        if (game.input.x > circles[i][j].sprite.x - SIZE_CIRCLES &&
            game.input.x < circles[i][j].sprite.x + SIZE_CIRCLES &&
            game.input.y > circles[i][j].sprite.y - SIZE_CIRCLES &&
            game.input.y < circles[i][j].sprite.y + SIZE_CIRCLES
        ) {
            indexArrX[0] = i;
            indexArrY[0] = j;
            circles[i][j].destroyBool = true;
            lines[0] = new Phaser.Line(circles[i][j].sprite.x, circles[i][j].sprite.y, circles[0][0].sprite.x, circles[0][0].sprite.y);        }
        }
}

function update() {
     if(!this.input.activePointer.isDown && isClicking === true) {
         isClicking = false;

     } else if(this.input.activePointer.isDown && isClicking === false) {
         isClicking = true;
     }
    function start() {
        for (let i = 0; i < SIZE_MATRIX; i++)
            for (let j = 0; j < SIZE_MATRIX; j++) {
                circles[i][j].Move();
        }
    }
     if (!isClicking) {
         let reserve;
         for (let i = 0; i < SIZE_MATRIX; i++)
             for (let j = 0; j < SIZE_MATRIX; j++) {
                 if (indexArrX.length > 1)
                     if (circles[i][j].destroyBool) {
                         reserve = circles[i][j];
                         for (let jj = i; jj > 0; jj--) {
                             circles[jj][j] = circles[jj - 1][j];
                             circles[jj][j].y += PADDING;
                             circles[jj][j].Move();
                         }
                         circles[0][j] = reserve;
                         circles[0][j].destroy();
                         score++;
                         scoreText.setText("Points: " + score)
                     }
             }
         lines.length = 0;
         lines[0] = new Phaser.Line(WIDTH_WINDOW + 100, HEIGHT_WINDOW + 100, WIDTH_WINDOW + 50, HEIGHT_WINDOW + 50);
         lines[0].fromSprite(circles[0][0].sprite, circles[0][0].sprite, false);
         game.debug.geom(lines[0], circles[0][0].color);
         lines.length = 0;
         indexArrX.length = 0;
         indexArrY.length = 0;
         start();
     }
    if (lines[0] && isClicking) {
        for (let i = 1 ; i < indexArrX.length; i++) {
            lines[i].fromSprite(circles[indexArrX[i-1]][indexArrY[i-1]].sprite, circles[indexArrX[i]][indexArrY[i]].sprite, false);
            game.debug.geom(lines[i], circles[indexArrX[0]][indexArrY[0]].color);
        }
        lines[0].fromSprite( circles[indexArrX[indexArrX.length-1]][indexArrY[indexArrY.length-1]].sprite, game.input, false);
        game.debug.geom(lines[0], circles[indexArrX[indexArrX.length-1]][indexArrY[indexArrY.length-1]].color);

    }

}
