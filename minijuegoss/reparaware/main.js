/* ================= TECH REPAIR SIM (versión simple) =================
   Usa los mismos ids/clases del HTML y CSS que ya tenés.
   Imágenes: assets/CARPETA/NOMBRE.png  (si falta una, se ve un recuadro con su nombre)
   ui/{bg_counter,bg_bench,player,bubble,btn_aceptar,btn_listo,menu,pc_open,monitor}
   fx/{dust,smoke}  tools/{screw,paste,air}  parts/{cpu,ram,gpu,hdd,psu}_{1,2}
   clients/{gamer,estudiante,programador,abuela,disenadora,minero,oficinista,hacker,streamer,misterioso} */

const $ = s => document.querySelector(s);

/* 1) IMÁGENES: devuelve el <img> de assets/<ruta>.png.
      Si el archivo no existe, onerror lo cambia por un recuadro con el texto (o nada si no hay texto). */
function img(ruta, nombre = '', clase = '') {
  return `<img class="a ${clase}" src="assets/${ruta}.png" alt="${nombre}" draggable="false"
    onerror="this.outerHTML = this.alt ? '<span class=miss>' + this.alt + '</span>' : ''">`;
}

/* 2) DATOS FIJOS */
const TYPES = { cpu: 'CPU', ram: 'RAM', gpu: 'GPU', hdd: 'Disco', psu: 'Fuente' };
const TIERS = ['', 'Básico', 'Premium'];                       // tier 1 = básico, 2 = premium
const TOOLS = [['screw', 'Destornillador'], ['paste', 'Pasta térmica'], ['air', 'Aire comprimido']];
// Dónde va cada ranura sobre la imagen del gabinete: [izquierda, arriba, ancho, alto] en %
const SLOT_POS = { psu: [3, 3, 26, 24], cpu: [38, 30, 18, 22], ram: [70, 20, 12, 34], hdd: [6, 60, 26, 20], gpu: [40, 62, 40, 20] };

/* 3) CLIENTES: para agregar uno, copiá un bloque.
   "vars" = variaciones; en cada visita se elige una al azar y modifica la PC (p).
   Daños de hardware:  p.slots.gpu.st = 'burnt' (quemada) | 'loose' (floja)
   Otros daños (true/false): dusty, dryPaste, fsBad, virus, bootBad, needData, all2 (pide todo premium) */
const CLIENTS = [
  { name: 'Gamer furioso', id: 'gamer', reward: 100, text: 'Los juegos me van a 10 FPS.',
    vars: [p => p.slots.gpu.st = 'burnt', p => { p.dusty = true; p.dryPaste = true }] },
  { name: 'Estudiante asustado', id: 'estudiante', reward: 100, text: 'Mi PC no arranca, pantalla negra.',
    vars: [p => p.slots.ram.st = 'loose', p => p.slots.psu.st = 'burnt'] },
  { name: 'Programador descuidado', id: 'programador', reward: 120, text: 'El sistema de archivos de mi server Linux colapsó tras un corte de luz.',
    vars: [p => p.fsBad = true, p => { p.fsBad = true; p.slots.ram.st = 'loose' }] },
  { name: 'Abuela paranoica', id: 'abuela', reward: 90, text: 'La flechita se mueve sola y me salen anuncios rusos.',
    vars: [p => p.virus = true, p => { p.virus = true; p.dusty = true }] },
  { name: 'Diseñadora', id: 'disenadora', reward: 150, text: 'El disco duro hace un ruido de clac-clac-clac.',
    vars: [p => { p.slots.hdd.st = 'burnt'; p.needData = true }] },
  { name: 'Minero de cripto', id: 'minero', reward: 130, text: 'Se apaga a los 5 minutos de encender.',
    vars: [p => { p.slots.psu.st = 'burnt'; p.dryPaste = true }, p => { p.slots.psu.st = 'burnt'; p.dryPaste = true; p.dusty = true }] },
  { name: 'Oficinista', id: 'oficinista', reward: 110, text: 'Derramé café pero se secó. Ahora no da video.',
    vars: [p => { p.dusty = true; p.slots.gpu.st = 'burnt' }, p => { p.dusty = true; p.slots.ram.st = 'burnt' }] },
  { name: 'Hacker wannabe', id: 'hacker', reward: 140, text: 'Borré el bootloader sin querer.',
    vars: [p => p.bootBad = true, p => { p.bootBad = true; p.dusty = true }] },
  { name: 'Streamer', id: 'streamer', reward: 120, text: 'El micrófono y la capturadora hacen corto.',
    vars: [p => { p.slots.psu.st = 'burnt'; p.dusty = true }] },
  { name: 'Cliente misterioso', id: 'misterioso', reward: 500, text: 'Haz que vuele.',
    vars: [p => p.all2 = true] }
];

/* 4) COMANDOS DE LA TERMINAL: para agregar uno, sumá una línea.
   Cada comando recibe (argumentos, pc) y devuelve el texto que se imprime. */
const CMDS = {
  help: () => 'Comandos: ' + Object.keys(CMDS).join(', '),
  clear: () => { $('#tout').textContent = ''; return '' },
  fsck: (a, p) => {
    if (a[0] !== '/dev/sda') return 'uso: fsck /dev/sda';
    if (!p.fsBad) return 'fsck: /dev/sda limpio.';
    p.fsBad = false; p.needReboot = true;          // reparado, pero hay que reiniciar
    return 'Sistema reparado. Ejecuta reboot.';
  },
  reboot: (a, p) => {
    if (p.bootBad) return 'error: no such partition. grub rescue>';
    p.needReboot = false; return 'Reiniciando... listo.';
  },
  killall: (a, p) => {
    if (a[0] !== 'virus') return 'uso: killall virus';
    if (!p.virus) return 'virus: proceso no encontrado';
    p.virus = false; return 'Virus eliminado.';
  },
  'grub-install': (a, p) => { p.grubInst = true; return 'GRUB instalado.' },
  'update-grub': (a, p) => {
    if (p.bootBad && !p.grubInst) return 'error: ejecuta primero grub-install';
    p.bootBad = false; return 'grub.cfg generado.';
  },
  cp: (a, p) => {
    if (a.length < 2) return 'uso: cp <origen> <destino>';
    if (!p.needData) return 'cp: no hay nada que recuperar';
    p.dataDone = true; return 'Datos copiados al disco nuevo.';
  },
  'apt-get': () => 'Listas de paquetes actualizadas.'
};

/* 5) ESTADO DEL JUEGO (variables globales: todo lo que cambia mientras jugás) */
let money, rep, n;        // dinero, reputación, número de cliente
let queue;                // cola con los clientes que faltan
let cust;                 // cliente actual: { base: datos del cliente, pc: estado de su PC }
let inv;                  // repuestos disponibles en el menú
let tool = null;          // herramienta elegida ('air', 'paste', 'screw' o null)
let dragId = null;        // id de la pieza que se está arrastrando
let uid = 0;              // contador para dar un id único a cada pieza

function newPart(type, tier = 1) { return { id: 'p' + uid++, type, tier, st: 'ok' } }   // st: ok | burnt | loose

function newPC() {        // una PC sana, con una pieza básica en cada ranura
  const slots = {};
  for (const t in TYPES) slots[t] = newPart(t);
  return { slots, dusty: false, dryPaste: false, fsBad: false, virus: false, bootBad: false,
           grubInst: false, needReboot: false, needData: false, dataDone: false, all2: false };
}

function say(texto) { $('#msg').textContent = texto }

function startGame() {
  money = 0; rep = 100; n = 0;
  queue = CLIENTS.map((_, i) => i).sort(() => Math.random() - 0.5);   // orden aleatorio
  nextCustomer();
}

function nextCustomer() {
  const base = CLIENTS[queue.shift()];
  const variation = base.vars[Math.floor(Math.random() * base.vars.length)];   // una variación al azar
  const pc = newPC();
  variation(pc);                                                               // la aplica a la PC
  cust = { base, pc }; n++; tool = null; dragId = null;
  inv = [];
  for (const t in TYPES) inv.push(newPart(t, 1), newPart(t, 2));              // repuestos nuevos
  $('#tout').textContent = ''; say('');
  showScene('c'); render();
  const c = $('#client'); c.classList.remove('enter'); setTimeout(() => c.classList.add('enter'), 10);
}

function showScene(s) {   // 'c' = mostrador, 'b' = mesa de trabajo
  $('#sc').hidden = s !== 'c'; $('#sb').hidden = s !== 'b'; $('#hint').hidden = s !== 'b';
}

/* 6) REGLAS: ¿qué le falta arreglar a la PC? (lista vacía = todo bien) */
function hwOk() { return Object.values(cust.pc.slots).every(s => s && s.st === 'ok') }

function problems() {
  const p = cust.pc, lista = [];
  for (const t in p.slots) {
    const s = p.slots[t];
    if (!s || s.st !== 'ok') lista.push(t);              // falta o está dañada
    else if (p.all2 && s.tier < 2) lista.push(t);        // el misterioso quiere premium
  }
  if (p.dusty) lista.push('polvo');
  if (p.dryPaste) lista.push('pasta');
  if (p.fsBad || p.virus || p.bootBad || p.needReboot) lista.push('software');
  if (p.needData && !p.dataDone) lista.push('datos');
  return lista;
}

/* 7) PIEZAS: poner y sacar del gabinete */
function putIn(id, slot) {
  const i = inv.findIndex(x => x.id === id);
  if (i < 0) return;                                       // no viene del menú
  const pieza = inv[i], pc = cust.pc;
  if (pieza.type !== slot) return say('Esa pieza no va en esa ranura.');
  if (pc.slots[slot]) return say('La ranura está ocupada: retira la pieza primero.');
  pc.slots[slot] = pieza; inv.splice(i, 1);
  say(TYPES[slot] + ' instalada.'); render();
}

function takeOut(id) {
  const pc = cust.pc;
  const slot = Object.keys(pc.slots).find(k => pc.slots[k] && pc.slots[k].id === id);
  if (!slot) return;                                       // no estaba en el gabinete
  const pieza = pc.slots[slot]; pc.slots[slot] = null;
  if (pieza.st === 'burnt') say('Pieza quemada: a la basura.');
  else { pieza.st = 'ok'; inv.push(pieza); say('Pieza retirada, lista para reinsertar.') }
  render();
}

/* 8) CLIC EN EL GABINETE: usar la herramienta elegida (o inspeccionar si no hay ninguna) */
function clickPC(e) {
  const pc = cust.pc;
  const slotDiv = e.target.closest('.slot');
  const t = slotDiv && slotDiv.dataset.t;                  // ranura clicada (o undefined)
  const pieza = t && pc.slots[t];

  if (tool === 'air') {
    if (pc.dusty) { pc.dusty = false; say('¡Todo limpio!') } else say('Ya no hay polvo.');
  } else if (tool === 'paste') {
    if (!pc.slots.cpu) say('No hay CPU.');
    else if (pc.dryPaste) { pc.dryPaste = false; say('Pasta térmica nueva aplicada.') }
    else say('La pasta ya está bien.');
  } else if (tool === 'screw') {
    if (pieza && pieza.st === 'loose') { pieza.st = 'ok'; say('Pieza ajustada.') }
    else say('No hay nada que ajustar ahí.');
  } else {                                                 // sin herramienta: inspeccionar
    if (!t) say(pc.dusty ? 'Hay mucho polvo.' : 'El interior se ve limpio.');
    else if (!pieza) say('Ranura vacía.');
    else if (pieza.st === 'burnt') say('Huele a quemado.');
    else if (pieza.st === 'loose') say('Está mal asentada.');
    else if (t === 'cpu' && pc.dryPaste) say('La pasta térmica está reseca.');
    else say('Se ve bien.');
  }
  render();
}

/* 9) ENTREGAR Y RESULTADOS */
function showCard(titulo, texto, boton, alClick) {         // ventana con título, texto y un botón
  $('#et').textContent = titulo; $('#ep').textContent = texto;
  $('#restart').textContent = boton;
  $('#restart').onclick = () => { $('#end').hidden = true; alClick() };
  $('#end').hidden = false;
}

function listo() {
  const c = cust.base, ok = problems().length === 0;
  if (ok) { money += c.reward; rep = Math.min(100, rep + 5) } else rep -= 20;
  const ultimo = rep <= 0 || queue.length === 0;
  showCard(
    ok ? 'Reparación exitosa' : 'Reparación fallida',
    ok ? c.name + ' pagó $' + c.reward + '.' : c.name + ' se queja: "¡Sigue fallando!" (-20 reputación).',
    ultimo ? 'Ver resultado' : 'Siguiente cliente',
    () => ultimo ? endGame() : nextCustomer());
}

function endGame() {
  showCard(rep > 0 ? '¡Turno terminado!' : 'Taller cerrado',
    'Dinero: $' + money + ' · Reputación: ' + Math.max(0, rep), 'Jugar de nuevo', startGame);
}

function hint() {
  const primero = problems()[0];
  const textos = {
    polvo: 'Hay polvo: elige el aire comprimido y haz clic en el gabinete.',
    pasta: 'La CPU necesita pasta térmica nueva.',
    software: 'Problema de software: haz clic en el monitor y usa la terminal (escribe help).',
    datos: 'Hay que recuperar los datos con cp en la terminal.'
  };
  if (!primero) say('Todo parece estar bien: pulsa Listo.');
  else if (textos[primero]) say(textos[primero]);
  else say('Revisa la pieza ' + TYPES[primero] + ': si está quemada, cámbiala; si está floja, usa el destornillador.'
           + (cust.pc.all2 ? ' Este cliente pide piezas Premium.' : ''));
}

/* 10) TERMINAL */
function print(texto) { $('#tout').textContent += texto + '\n'; $('#tout').scrollTop = 1e9 }

function runCommand(linea) {
  print('root@pc:~# ' + linea);
  const args = linea.trim().replace(/^sudo\s+/, '').split(/\s+/);
  const nombre = args.shift();                             // primera palabra = comando
  if (!nombre) return;
  const cmd = CMDS[nombre];
  const salida = cmd ? cmd(args, cust.pc) : nombre + ': comando no encontrado';
  if (salida) print(salida);
}

function openTerminal() {
  $('#modal').hidden = false;
  if (!hwOk()) {                                           // hardware roto = sin señal
    $('#tout').textContent = 'SIN SEÑAL\n(el hardware tiene fallas: revisa la mesa de trabajo)';
    $('#tin').disabled = true; return;
  }
  $('#tin').disabled = false;
  if (!$('#tout').textContent) print('Tech-OS tty1\n' + (cust.pc.bootBad ? 'GRUB: bootloader dañado. grub rescue>' : 'Escribe "help" para ver comandos.'));
  $('#tin').focus();
}

/* 11) DIBUJAR LA PANTALLA (se llama cada vez que algo cambia) */
function partHTML(x, enRanura) {
  const nombre = TYPES[x.type] + ' ' + TIERS[x.tier] + (x.st === 'burnt' ? ' (quemada)' : x.st === 'loose' ? ' (floja)' : '');
  return `<div class="part ${x.st}" draggable="true" data-id="${x.id}">
    ${img('parts/' + x.type + '_' + x.tier, nombre)}
    ${x.st === 'burnt' ? img('fx/smoke', '', 'fx') : ''}
    ${enRanura ? '' : '<small>' + TIERS[x.tier] + '</small>'}</div>`;
}

function render() {
  const c = cust.base, pc = cust.pc;
  $('#hs').textContent = 'Dinero $' + money + '   Reputación ' + Math.max(0, rep) + '   Cliente ' + n + '/10';
  $('#client').innerHTML = img('clients/' + c.id, c.name);
  $('#btxt').textContent = $('#nprob').textContent = c.name + ': “' + c.text + '”';
  $('#dust').innerHTML = pc.dusty ? img('fx/dust', 'Polvo') : '';

  // ranuras del gabinete, ubicadas con SLOT_POS
  $('#slots').innerHTML = Object.keys(TYPES).map(t => {
    const [izq, arr, ancho, alto] = SLOT_POS[t];
    return `<div class="slot" data-t="${t}" style="left:${izq}%;top:${arr}%;width:${ancho}%;height:${alto}%">
      <i>${TYPES[t]}</i>${pc.slots[t] ? partHTML(pc.slots[t], true) : ''}</div>`;
  }).join('');

  // menú: herramientas + repuestos
  $('#items').innerHTML =
    TOOLS.map(([k, nombre]) => `<div class="tool ${tool === k ? 'on' : ''}" data-k="${k}">${img('tools/' + k, nombre)}<small>${nombre}</small></div>`).join('')
    + inv.map(x => partHTML(x, false)).join('');
}

/* 12) EVENTOS: conectar botones, arrastrar y soltar */
document.addEventListener('click', e => {
  const t = e.target.closest('.tool');
  if (t) { tool = tool === t.dataset.k ? null : t.dataset.k; say(''); render(); return }   // elegir/soltar herramienta
  if (e.target.closest('#pc')) clickPC(e);
});

document.addEventListener('dragstart', e => {
  const el = e.target.closest('.part');
  if (el) { dragId = el.dataset.id; e.dataTransfer.setData('text/plain', dragId) }
});
document.addEventListener('dragover', e => {                                       // permitir soltar sobre ranuras y menú
  const z = e.target.closest('.slot,#menu');
  if (z) { e.preventDefault(); z.classList.add('over') }
});
document.addEventListener('dragleave', e => {
  const z = e.target.closest('.slot,#menu');
  if (z) z.classList.remove('over');
});
document.addEventListener('drop', e => {
  const z = e.target.closest('.slot,#menu');
  if (!z || !dragId) return;
  e.preventDefault(); z.classList.remove('over');
  if (z.id === 'menu') takeOut(dragId); else putIn(dragId, z.dataset.t);          // al menú = sacar; a ranura = poner
  dragId = null;
});

$('#tin').addEventListener('keydown', e => {
  if (e.key === 'Enter') { runCommand($('#tin').value); $('#tin').value = '' }
});
$('#acc').onclick = () => showScene('b');
$('#listo').onclick = listo;
$('#hint').onclick = hint;
$('#mon').onclick = openTerminal;
$('#tx').onclick = () => { $('#modal').hidden = true; render() };
$('#hb').onclick = () => $('#help').hidden = false;
$('#hx').onclick = () => $('#help').hidden = true;

/* 13) ARRANQUE: imágenes fijas + primer cliente */
$('#bgc').innerHTML = img('ui/bg_counter');
$('#bgb').innerHTML = img('ui/bg_bench');
$('#bubimg').innerHTML = img('ui/bubble');
$('#menubg').innerHTML = img('ui/menu');
$('#player').innerHTML = img('ui/player', 'Jugador');
$('#pcimg').innerHTML = img('ui/pc_open', 'Gabinete abierto');
$('#acc').innerHTML = img('ui/btn_aceptar', 'ACEPTAR');
$('#listo').innerHTML = img('ui/btn_listo', 'LISTO');
$('#mon').innerHTML = img('ui/monitor', 'Monitor (terminal)');
startGame();
$('#help').hidden = false;