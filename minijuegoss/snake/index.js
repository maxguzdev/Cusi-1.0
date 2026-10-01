let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) { this.x = x; this.y = y; }
}

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount; 
let headX = 10, headY = 10;
let snakeParts = [];
let tailLength = 2;
let appleX = 5, appleY = 5;
let inputsXVelocity = 0, inputsYVelocity = 0;
let xVelocity = 0, yVelocity = 0;
let facingX = 1, facingY = 0; 
let score = 0;
let tick = 0;
let gameIsOver = false;
let gulpSound = new Audio("gulp.mp3");

let headImg = new Image();
headImg.src = "img/Cusi.png"; // Reemplazá esta ruta por la de tu imagen de la cabeza

function drawHead(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(Math.atan2(facingY, facingX) + Math.PI / 2); // Ajustá la rotación según cómo mire tu imagen

  // Dibuja la imagen centrada en la casilla (asumiendo tamaño de tileSize = 20px)
  let imgSize = tileSize * 1.2; // Tamaño de la cabeza respecto a la celda
  ctx.drawImage(headImg, -imgSize / 2, -imgSize / 2, imgSize, imgSize);

  ctx.restore();
}
function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;
  if (xVelocity !== 0 || yVelocity !== 0) {
    facingX = xVelocity;
    facingY = yVelocity;
  }

  changeSnakePosition();
  if (isGameOver()) {
    gameIsOver = true;
    drawGameOver();
    return;
  }

  tick++;
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

  return (
    headX < 0 || headX === tileCount ||
    headY < 0 || headY === tileCount ||
    snakeParts.some((p) => p.x === headX && p.y === headY)
  );
}

function drawGameOver() {
  ctx.fillStyle = "rgba(36, 0, 70, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.fillStyle = "#E0AAFF";
  ctx.font = "bold 44px Trebuchet MS, Verdana, sans-serif";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);

  ctx.font = "20px Trebuchet MS, Verdana, sans-serif";
  ctx.fillStyle = "#FFD166";
  ctx.fillText("Puntaje: " + score, canvas.width / 2, canvas.height / 2 + 26);

  ctx.font = "14px Trebuchet MS, Verdana, sans-serif";
  ctx.fillStyle = "#C77DFF";
  ctx.fillText("Apretá una flecha para jugar de nuevo", canvas.width / 2, canvas.height / 2 + 56);
  ctx.textAlign = "start";
}

function drawScore() {
  const w = 86, h = 24, x = 8, y = 8;
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.fill();

  drawAppleAt(x + 14, y + 13, 0.6);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px Trebuchet MS, Verdana, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(score, x + 30, y + 13);
  ctx.textBaseline = "alphabetic";
}

// Fondo de tablero adaptado a tonos oscuros/morados sutiles
function clearScreen() {
  for (let y = 0; y < tileCount; y++) {
    for (let x = 0; x < tileCount; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "#2D004F" : "#3C096C";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function center(p) {
  return { x: p.x * tileSize + tileSize / 2, y: p.y * tileSize + tileSize / 2 };
}

function drawSnake() {
  const pts = [...snakeParts, new SnakePart(headX, headY)].map(center);

  // Sombra de la serpiente
  ctx.save();
  ctx.translate(2, 3);
  strokePath(pts, 16, "rgba(0, 0, 0, 0.3)");
  ctx.restore();

  // Cuerpo morado (Contorno oscuro -> Cuerpo principal -> Brillo central)
  strokePath(pts, 17, "#240046"); // Contorno morado muy oscuro
  strokePath(pts, 14, "#7B2CBF"); // Cuerpo morado principal
  strokePath(pts, 5, "#C77DFF");  // Brillo central lila

  // Detalles / escamas en el lomo con tono morado profundo
  ctx.fillStyle = "#3C096C";
  for (let i = pts.length - 2; i >= 0; i -= 2) {
    ctx.beginPath();
    ctx.arc(pts[i].x, pts[i].y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawHead(pts[pts.length - 1]);

  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLength) snakeParts.shift();
}

function strokePath(pts, width, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  if (pts.length === 1) ctx.lineTo(pts[0].x + 0.01, pts[0].y);
  ctx.stroke();
}

// Función original de la cabeza (Podés reemplazarla por la de la imagen que te pasé arriba si querés usar una foto)
function drawHead(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(Math.atan2(facingY, facingX));

  // Lengua bífida
  if (tick % 4 < 2) {
    ctx.strokeStyle = "#FF5964";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(16, 0);
    ctx.moveTo(16, 0);
    ctx.lineTo(19, -3);
    ctx.moveTo(16, 0);
    ctx.lineTo(19, 3);
    ctx.stroke();
  }

  // Cabeza morada combinada
  ctx.fillStyle = "#5A189A";
  ctx.strokeStyle = "#240046";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(2, 0, 11, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ojos
  for (const side of [-1, 1]) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(5, side * 4.8, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(6, side * 4.8, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;
}

function drawApple() {
  drawAppleAt(appleX * tileSize + tileSize / 2, appleY * tileSize + tileSize / 2 + 1, 1);
}

function drawAppleAt(cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(1, 8, 7, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  const g = ctx.createRadialGradient(-3, -3, 1, 0, 0, 10);
  g.addColorStop(0, "#ff6f60");
  g.addColorStop(0.6, "#e53935");
  g.addColorStop(1, "#b71c1c");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(-3, 0, 6.5, 0, Math.PI * 2);
  ctx.arc(3, 0, 6.5, 0, Math.PI * 2);
  ctx.arc(0, 2, 6.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    placeApple();
    tailLength++;
    score++;
    gulpSound.currentTime = 0;
    gulpSound.play().catch(() => {});
  }
}

function placeApple() {
  let x, y;
  do {
    x = Math.floor(Math.random() * tileCount);
    y = Math.floor(Math.random() * tileCount);
  } while (
    (x === headX && y === headY) ||
    snakeParts.some((p) => p.x === x && p.y === y)
  );
  appleX = x;
  appleY = y;
}

function resetGame() {
  speed = 7;
  headX = 10; headY = 10;
  snakeParts = [];
  tailLength = 2;
  inputsXVelocity = 0; inputsYVelocity = 0;
  xVelocity = 0; yVelocity = 0;
  facingX = 1; facingY = 0;
  score = 0;
  tick = 0;
  gameIsOver = false;
  placeApple();
}

const TECLAS = {
  38: [0, -1], 87: [0, -1],
  40: [0, 1], 83: [0, 1],
  37: [-1, 0], 65: [-1, 0],
  39: [1, 0], 68: [1, 0],
};

document.body.addEventListener("keydown", (event) => {
  const dir = TECLAS[event.keyCode];
  if (!dir) return;
  event.preventDefault();
  const [dx, dy] = dir;

  if (gameIsOver) {
    resetGame();
    inputsXVelocity = dx;
    inputsYVelocity = dy;
    drawGame();
    return;
  }

  if (dx !== 0 && inputsXVelocity === -dx) return;
  if (dy !== 0 && inputsYVelocity === -dy) return;

  inputsXVelocity = dx;
  inputsYVelocity = dy;
});

drawGame();