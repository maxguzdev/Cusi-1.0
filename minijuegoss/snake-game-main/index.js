let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) { this.x = x; this.y = y; }
}

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10, headY = 10;
let snakeParts = [];
let tailLength = 2;
let appleX = 5, appleY = 5;
let inputsXVelocity = 0, inputsYVelocity = 0;
let xVelocity = 0, yVelocity = 0;
let score = 0;
let gulpSound = new Audio("gulp.mp3");

function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  if (isGameOver()) return;

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();

  if (score > 10) speed = 11;
  else if (score > 5) speed = 9;

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  if (xVelocity === 0 && yVelocity === 0) return false;

  const gameOver =
    headX < 0 || headX === tileCount ||
    headY < 0 || headY === tileCount ||
    snakeParts.some((p) => p.x === headX && p.y === headY);

  if (gameOver) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "magenta");
    gradient.addColorStop(0.5, "blue");
    gradient.addColorStop(1, "red");

    ctx.fillStyle = gradient;
    ctx.font = "50px Verdana";
    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
  }

  return gameOver;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, canvas.width - 50, 10);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (const part of snakeParts) {
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLength) snakeParts.shift();

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}

// [dx, dy] por tecla — arriba/W, abajo/S, izquierda/A, derecha/D
const TECLAS = {
  38: [0, -1], 87: [0, -1],
  40: [0, 1], 83: [0, 1],
  37: [-1, 0], 65: [-1, 0],
  39: [1, 0], 68: [1, 0],
};

document.body.addEventListener("keydown", (event) => {
  const dir = TECLAS[event.keyCode];
  if (!dir) return;
  const [dx, dy] = dir;

  // no permite invertir de golpe sobre el eje en el que ya se mueve
  if (dx !== 0 && inputsXVelocity === -dx) return;
  if (dy !== 0 && inputsYVelocity === -dy) return;

  inputsXVelocity = dx;
  inputsYVelocity = dy;
});

drawGame();