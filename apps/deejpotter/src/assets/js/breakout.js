/*--------------------------------------------------
    #Index

    #Variables
    #Events
    #Functions
        #Draw
        #Movement
        #Draw ball
        #Draw paddle
        #Draw bricks
        #Draw score
        #Draw lives
        #Game over
        #Event function
        #Collision
--------------------------------------------------*/

/*--------------------------------------------------
    #Variables
--------------------------------------------------*/

// Canvas variables
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
canvas.width = innerWidth - 50;
canvas.height = innerHeight - 50;

// Game variables
let score = 0;
let lives = 3;

// Ball variables
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;
let ballRadius = canvas.height / 40;

// Paddle variables
let paddleHeight = canvas.height / 20;
let paddleWidth = canvas.width / 4;
let paddleX = (canvas.width - paddleWidth) / 2;

// Input variables
let rightPressed = false;
let leftPressed = false;

// Brick variables
let brickRowCount = 3;
let brickColumnCount = 5;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let brickWidth = canvas.width / brickColumnCount - brickOffsetLeft;
let brickHeight = canvas.height / 2 / brickRowCount - brickOffsetTop;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

/*--------------------------------------------------
    #Events
--------------------------------------------------*/

// Set functions for event listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

/*--------------------------------------------------
    #Functions
--------------------------------------------------*/

/*
    #Draw
*/

// Draw to the canvas
function draw() {
  // Clear the whole screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();

  // Reverse the velocity of the ball when it hits the edge of the canvas
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      gameOver();
    }
  }

  // Move the paddle based on the rightPressed and leftPressed variables
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
      console.log('rightPressed');
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX - paddleWidth < 0) {
      paddleX = 0;
    }
  }
  requestAnimationFrame(draw);
}

/*
    #Movement
*/

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

/*
    #Draw ball
*/

// Draw the ball
function drawBall() {
  x += dx;
  y += dy;

  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

/*
    #Draw paddle
*/

// Draw the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

/*
    #Draw bricks
*/

// Draw the bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

/*
    #Draw score
*/

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + score, 8, 20);
}

/*
    #Draw lives
*/

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

/*
    #Game over
*/

// Game over
function gameOver() {
  lives--;
  if (lives < 1) {
    alert('Game Over');
    lives = 3;
    document.location.reload();
  } else {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 4;
    dy = -4;
    paddleX = (canvas.width - paddleWidth) / 2;
  }
}

/*
    #Event functions
*/

// Switch the right/left pressed variable
function keyDownHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = true;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = false;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = false;
  }
}

/*
    #Collision
*/

// Check if the ball is touching a block
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

draw();
