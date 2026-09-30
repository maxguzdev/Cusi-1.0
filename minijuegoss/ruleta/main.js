/********** GLOBAL STATE **********/
const NUM_NUMBERS = 91; // 0 to 90
let bank = 1000;
let currentChip = 0; // Selected chip value
let bets = { numbers: {}, color: {}, evenodd: {} };
let highScores = JSON.parse(localStorage.getItem("rouletteHighScores")) || [];

const bankDisplay = document.getElementById("bankDisplay");
const playerNameInput = document.getElementById("playerNameInput");
const resultDisplay = document.getElementById("resultDisplay");

const updateBankDisplay = () => bankDisplay.textContent = "Bank: $" + bank;

/********** BETTING **********/
// One handler for the three betting areas (numbers, color, even/odd): each
// bumps its own bucket in `bets` by the selected chip and redraws its label.
// (This also makes all three require a selected chip before betting, fixing
// a small inconsistency the original had between the number grid and the
// color/even-odd buttons.)
function attachBetting(elements, category, keyOf) {
  elements.forEach(el => {
    el.addEventListener("click", () => {
      if (currentChip <= 0) return;
      const key = keyOf(el);
      bets[category][key] = (bets[category][key] || 0) + currentChip;
      el.innerHTML = `${key.toUpperCase()}<br><small>$${bets[category][key]}</small>`;
    });
  });
}

function renderBettingBoard() {
  const board = document.getElementById("bettingBoard");
  board.innerHTML = "";
  const cells = [];
  for (let i = 0; i < NUM_NUMBERS; i++) {
    const cell = document.createElement("div");
    cell.className = "betCell";
    cell.dataset.number = i;
    cell.textContent = i;
    board.appendChild(cell);
    cells.push(cell);
  }
  // Numbers keep just the digit as label (no .toUpperCase() needed, but
  // harmless since it's numeric text) via the same shared handler.
  attachBetting(cells, "numbers", el => el.dataset.number);
}

renderBettingBoard();
updateBankDisplay();

attachBetting(document.querySelectorAll("#colorBetArea .betOption"), "color", el => el.dataset.value);
attachBetting(document.querySelectorAll("#evenoddBetArea .betOption"), "evenodd", el => el.dataset.value);

/********** CHIP SELECTION **********/
const chipButtons = document.querySelectorAll(".chip");
chipButtons.forEach(chip => {
  chip.addEventListener("click", () => {
    chipButtons.forEach(c => c.classList.remove("selected"));
    chip.classList.add("selected");
    currentChip = parseInt(chip.dataset.value);
  });
});

/********** WHEEL DRAWING & ANIMATION **********/
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const wheelRadius = canvas.width / 2;
const numPockets = 37; // European roulette: 0 to 36
const segmentAngle = (2 * Math.PI) / numPockets;
let rotationAngle = 0;
let spinVelocity = 0;
let spinning = false;

// Official European roulette wheel order.
const rouletteOrder = [
  { number: 0, color: "green" }, { number: 32, color: "red" }, { number: 15, color: "black" },
  { number: 19, color: "red" }, { number: 4, color: "black" }, { number: 21, color: "red" },
  { number: 2, color: "black" }, { number: 25, color: "red" }, { number: 17, color: "black" },
  { number: 34, color: "red" }, { number: 6, color: "black" }, { number: 27, color: "red" },
  { number: 13, color: "black" }, { number: 36, color: "red" }, { number: 11, color: "black" },
  { number: 30, color: "red" }, { number: 8, color: "black" }, { number: 23, color: "red" },
  { number: 10, color: "black" }, { number: 5, color: "red" }, { number: 24, color: "black" },
  { number: 16, color: "red" }, { number: 33, color: "black" }, { number: 1, color: "red" },
  { number: 20, color: "black" }, { number: 14, color: "red" }, { number: 31, color: "black" },
  { number: 9, color: "red" }, { number: 22, color: "black" }, { number: 18, color: "red" },
  { number: 29, color: "black" }, { number: 7, color: "red" }, { number: 28, color: "black" },
  { number: 12, color: "red" }, { number: 35, color: "black" }, { number: 3, color: "red" },
  { number: 26, color: "black" }
];

const POCKET_FILL = { red: "#ff4444", black: "#222222", green: "#008800" };

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  rouletteOrder.forEach((pocket, i) => {
    const startAngle = rotationAngle + i * segmentAngle;
    const endAngle = startAngle + segmentAngle;

    ctx.beginPath();
    ctx.moveTo(wheelRadius, wheelRadius);
    ctx.arc(wheelRadius, wheelRadius, wheelRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = POCKET_FILL[pocket.color];
    ctx.fill();

    // Pocket number, rotated to sit upright along its segment.
    const textAngle = startAngle + segmentAngle / 2;
    const textRadius = wheelRadius * 0.7;
    ctx.save();
    ctx.translate(
      wheelRadius + textRadius * Math.cos(textAngle),
      wheelRadius + textRadius * Math.sin(textAngle)
    );
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(pocket.number, 0, 0);
    ctx.restore();
  });

  // Fixed pointer on the right edge.
  ctx.beginPath();
  ctx.moveTo(canvas.width - 20, wheelRadius - 10);
  ctx.lineTo(canvas.width - 20, wheelRadius + 10);
  ctx.lineTo(canvas.width - 5, wheelRadius);
  ctx.closePath();
  ctx.fillStyle = "#ffff00";
  ctx.fill();
}

function animateWheel() {
  if (!spinning) return;
  rotationAngle += spinVelocity;
  spinVelocity *= 0.98;
  if (spinVelocity < 0.001) {
    spinning = false;
    determineOutcome();
  }
  drawWheel();
  requestAnimationFrame(animateWheel);
}

// The pointer sits at angle 0 (right edge); find which segment lines up with it.
function determineOutcome() {
  const finalAngle = (2 * Math.PI - (rotationAngle % (2 * Math.PI))) % (2 * Math.PI);
  const winningPocket = rouletteOrder[Math.floor(finalAngle / segmentAngle) % numPockets];
  resultDisplay.textContent = `Result: ${winningPocket.number} (${winningPocket.color.toUpperCase()})`;
  evaluateBets(winningPocket);
}

/********** EVALUATE BETS & PAYOUT **********/
const sumBets = category => Object.values(bets[category]).reduce((sum, v) => sum + Number(v), 0);

function evaluateBets(winner) {
  const totalBet = sumBets("numbers") + sumBets("color") + sumBets("evenodd");
  let totalWin = 0;

  if (bets.numbers[winner.number]) totalWin += bets.numbers[winner.number] * 35; // straight-up: 35:1

  if (winner.number !== 0) {
    if (bets.color[winner.color]) totalWin += bets.color[winner.color]; // color: 1:1
    const parity = winner.number % 2 === 0 ? "even" : "odd";
    if (bets.evenodd[parity]) totalWin += bets.evenodd[parity]; // even/odd: 1:1
  }

  if (totalWin > 0) {
    bank += totalWin;
    resultDisplay.textContent += ` – You win $${totalWin}!`;
  } else {
    bank -= totalBet;
    resultDisplay.textContent += ` – You lose $${totalBet}.`;
  }

  updateBankDisplay();
  resetBets();
  updateHighScore();
}

function resetBets() {
  bets = { numbers: {}, color: {}, evenodd: {} };
  document.querySelectorAll(".betCell").forEach(cell => cell.innerHTML = cell.dataset.number);
  document.querySelectorAll("#colorBetArea .betOption, #evenoddBetArea .betOption")
    .forEach(opt => opt.innerHTML = opt.dataset.value.toUpperCase());
}

/********** HIGH SCORE BOARD **********/
function updateHighScore() {
  highScores.push({ name: playerNameInput.value, bank });
  highScores = highScores.sort((a, b) => b.bank - a.bank).slice(0, 5);
  localStorage.setItem("rouletteHighScores", JSON.stringify(highScores));
  renderHighScores();
}

function renderHighScores() {
  document.getElementById("scoreboardBody").innerHTML = highScores
    .map(({ name, bank }) => `<tr><td>${name}</td><td>$${bank}</td></tr>`)
    .join("");
}

/********** SPIN BUTTON **********/
document.getElementById("spinButton").addEventListener("click", () => {
  if (bank <= 0) {
    resultDisplay.textContent = "You are out of money!";
    return;
  }
  const hasBets = Object.keys(bets.numbers).length || Object.keys(bets.color).length || Object.keys(bets.evenodd).length;
  if (!hasBets) {
    resultDisplay.textContent = "Place your bets first!";
    return;
  }
  spinVelocity = 0.3 + Math.random() * 0.2;
  spinning = true;
  animateWheel();
});

/********** NEW GAME SETUP **********/
function newGameSetup() {
  bank = 1000;
  updateBankDisplay();
  resetBets();
  rotationAngle = 0;
  spinVelocity = 0;
  spinning = false;
  drawWheel();
}

/********** INITIALIZATION **********/
newGameSetup();
renderHighScores();