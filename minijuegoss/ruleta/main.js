/********** ESTADO **********/
const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const colorOf = n => n === 0 ? "green" : RED.has(n) ? "red" : "black";
const START_BANK = 1000;
let bank = START_BANK;
let currentChip = 0;
let bets = { numbers: {}, color: {}, evenodd: {} };
let highScores = [];
try { highScores = JSON.parse(localStorage.getItem("rouletteHighScores")) || []; } catch { highScores = []; }

const $ = id => document.getElementById(id);
const bankDisplay = $("bankDisplay"), betDisplay = $("betDisplay");
const playerNameInput = $("playerNameInput"), resultDisplay = $("resultDisplay"), spinButton = $("spinButton");

const sumBets = c => Object.values(bets[c]).reduce((s, v) => s + v, 0);
const totalBet = () => sumBets("numbers") + sumBets("color") + sumBets("evenodd");
function updateDisplays() {
  bankDisplay.textContent = "Banco: $" + bank;
  betDisplay.textContent = "Apostado: $" + totalBet();
}

/********** APUESTAS **********/
const LABELS = { red: "Rojo", black: "Negro", odd: "Impar", even: "Par" };
function paint(el, category, key) {
  const label = category === "numbers" ? key : LABELS[key];
  const amt = bets[category][key];
  el.innerHTML = `<span>${label}</span>` + (amt ? `<span class="amt">$${amt}</span>` : "");
}

function attachBetting(elements, category, keyOf) {
  elements.forEach(el => el.addEventListener("click", () => {
    if (spinning) return;
    if (currentChip <= 0) { resultDisplay.textContent = "Primero elige una ficha."; return; }
    if (totalBet() + currentChip > bank) { resultDisplay.textContent = "No te alcanza el banco para esa apuesta."; return; }
    const key = keyOf(el);
    bets[category][key] = (bets[category][key] || 0) + currentChip;
    paint(el, category, key);
    updateDisplays();
  }));
}

function renderBettingBoard() {
  const board = $("bettingBoard");
  const order = [0];
  for (let row = 3; row >= 1; row--) for (let col = 0; col < 12; col++) order.push(col * 3 + row); // disposición de mesa real
  const cells = order.map(n => {
    const cell = document.createElement("div");
    cell.className = `betCell ${colorOf(n)}${n === 0 ? " zero" : ""}`;
    cell.dataset.number = n;
    cell.innerHTML = `<span>${n}</span>`;
    board.appendChild(cell);
    return cell;
  });
  attachBetting(cells, "numbers", el => el.dataset.number);
}
renderBettingBoard();
attachBetting(document.querySelectorAll("#colorBetArea .betOption"), "color", el => el.dataset.value);
attachBetting(document.querySelectorAll("#evenoddBetArea .betOption"), "evenodd", el => el.dataset.value);

const chipButtons = document.querySelectorAll(".chip");
chipButtons.forEach(chip => chip.addEventListener("click", () => {
  chipButtons.forEach(c => c.classList.remove("selected"));
  chip.classList.add("selected");
  currentChip = parseInt(chip.dataset.value);
}));

function resetBets() {
  bets = { numbers: {}, color: {}, evenodd: {} };
  document.querySelectorAll(".betCell").forEach(c => c.innerHTML = `<span>${c.dataset.number}</span>`);
  document.querySelectorAll(".betOption").forEach(o => o.innerHTML = `<span>${LABELS[o.dataset.value]}</span>`);
  updateDisplays();
}

/********** RULETA **********/
const canvas = $("wheelCanvas"), ctx = canvas.getContext("2d");
const R = canvas.width / 2;
const order = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const SEG = (2 * Math.PI) / order.length;
const FILL = { red: "#b3122b", black: "#141414", green: "#0a7a3f" };
let rotationAngle = 0, spinVelocity = 0, spinning = false;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // aro de madera y oro
  ctx.beginPath(); ctx.arc(R, R, R - 2, 0, 7); ctx.fillStyle = "#4a2410"; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = "#d8b45a"; ctx.stroke();
  const rim = 16, r = R - rim;
  order.forEach((n, i) => {
    const a0 = rotationAngle + i * SEG, a1 = a0 + SEG;
    ctx.beginPath(); ctx.moveTo(R, R); ctx.arc(R, R, r, a0, a1); ctx.closePath();
    ctx.fillStyle = FILL[colorOf(n)]; ctx.fill();
    ctx.strokeStyle = "#d8b45a88"; ctx.lineWidth = 1; ctx.stroke();
    const t = a0 + SEG / 2;
    ctx.save();
    ctx.translate(R + r * 0.84 * Math.cos(t), R + r * 0.84 * Math.sin(t));
    ctx.rotate(t + Math.PI / 2);
    ctx.fillStyle = "#f6edd2"; ctx.font = "bold 13px Lato, Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(n, 0, 0);
    ctx.restore();
  });
  // centro
  const g = ctx.createRadialGradient(R, R, 5, R, R, r * 0.55);
  g.addColorStop(0, "#f0d58a"); g.addColorStop(1, "#7a5d1a");
  ctx.beginPath(); ctx.arc(R, R, r * 0.55, 0, 7); ctx.fillStyle = "#16060c"; ctx.fill();
  ctx.beginPath(); ctx.arc(R, R, r * 0.18, 0, 7); ctx.fillStyle = g; ctx.fill();
  // bola fija en el puntero (borde derecho)
  ctx.beginPath(); ctx.arc(R + r - 14, R, 7, 0, 7);
  ctx.fillStyle = "#fff"; ctx.shadowColor = "#000"; ctx.shadowBlur = 6; ctx.fill(); ctx.shadowBlur = 0;
}

function animateWheel() {
  rotationAngle += spinVelocity;
  spinVelocity *= 0.985;
  drawWheel();
  if (spinVelocity < 0.002) { spinning = false; finishSpin(); return; }
  requestAnimationFrame(animateWheel);
}

function finishSpin() {
  const finalAngle = (2 * Math.PI - (rotationAngle % (2 * Math.PI))) % (2 * Math.PI);
  const n = order[Math.floor(finalAngle / SEG) % order.length];
  evaluateBets(n);
}

/********** PAGOS **********/
function evaluateBets(n) {
  const color = colorOf(n);
  let payout = 0; // incluye la apuesta devuelta
  const wins = [];
  if (bets.numbers[n]) { payout += bets.numbers[n] * 36; wins.push(document.querySelector(`.betCell[data-number="${n}"]`)); }
  if (n !== 0) {
    if (bets.color[color]) { payout += bets.color[color] * 2; wins.push(document.querySelector(`#colorBetArea [data-value="${color}"]`)); }
    const parity = n % 2 === 0 ? "even" : "odd";
    if (bets.evenodd[parity]) { payout += bets.evenodd[parity] * 2; wins.push(document.querySelector(`#evenoddBetArea [data-value="${parity}"]`)); }
  }
  const staked = totalBet(), net = payout - staked;
  bank += payout; // la apuesta ya se descontó al girar
  const names = { red: "ROJO", black: "NEGRO", green: "VERDE" };
  resultDisplay.textContent = `Salió ${n} (${names[color]}). ` +
    (net > 0 ? `Ganaste $${net}.` : net === 0 ? "Recuperas tu apuesta." : `Pierdes $${-net}.`);
  const cellsToFlash = document.querySelector(`.betCell[data-number="${n}"]`);
  cellsToFlash.classList.add("win"); wins.forEach(w => w && w.classList.add("win"));
  setTimeout(() => { document.querySelectorAll(".win").forEach(e => e.classList.remove("win")); }, 2500);
  bets = { numbers: {}, color: {}, evenodd: {} };
  document.querySelectorAll(".betCell").forEach(c => c.querySelector(".amt")?.remove());
  document.querySelectorAll(".betOption").forEach(o => o.querySelector(".amt")?.remove());
  spinButton.disabled = false;
  updateDisplays();
  updateHighScore();
  if (bank <= 0) resultDisplay.textContent += " Te quedaste sin fondos: pulsa «Nueva partida».";
}

/********** PUNTUACIONES **********/
function updateHighScore() {
  const name = (playerNameInput.value.trim() || "Invitado").slice(0, 16);
  const prev = highScores.find(s => s.name === name);
  if (prev) prev.bank = Math.max(prev.bank, bank); else highScores.push({ name, bank });
  highScores = highScores.sort((a, b) => b.bank - a.bank).slice(0, 5);
  try { localStorage.setItem("rouletteHighScores", JSON.stringify(highScores)); } catch {}
  renderHighScores();
}

function renderHighScores() {
  const body = $("scoreboardBody");
  body.replaceChildren(...highScores.map(({ name, bank }) => {
    const tr = document.createElement("tr");
    [name, "$" + bank].forEach(t => { const td = document.createElement("td"); td.textContent = t; tr.appendChild(td); });
    return tr;
  }));
}

/********** CONTROLES **********/
spinButton.addEventListener("click", () => {
  if (spinning) return;
  const stake = totalBet();
  if (!stake) { resultDisplay.textContent = "Haz tus apuestas antes de girar."; return; }
  if (stake > bank) { resultDisplay.textContent = "Tus apuestas superan tu banco."; return; }
  bank -= stake; // se descuenta al girar
  updateDisplays();
  resultDisplay.textContent = "No va más…";
  spinButton.disabled = true;
  spinVelocity = 0.3 + Math.random() * 0.25;
  spinning = true;
  animateWheel();
});

$("clearButton").addEventListener("click", () => { if (!spinning) resetBets(); });

$("newGameButton").addEventListener("click", () => {
  if (spinning) return;
  bank = START_BANK; resetBets();
  resultDisplay.textContent = "Nueva partida. ¡Suerte!";
  updateDisplays();
});

drawWheel();
updateDisplays();
renderHighScores();