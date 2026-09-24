// Cusi's Band — motor del juego de ritmo (estilo FNF).
//
// Conecta la lista de canciones con el reproductor y con las flechas que caen.
// Todo sigue delegado en `document`, porque bajo.html / bateria.html /
// guitarra.html se inyectan con irA() (fetch + innerHTML) dentro de
// cband.html y no existen cuando corre el DOMContentLoaded.
//
// Los beatmaps viven en js/beatmaps.js (const BEATMAPS), indexados por el
// nombre del mp3. Formato de nota: [segundo, carril] o, si es larga,
// [segundo, carril, duracion].

// ====== Carriles y controles ======
// Cada carril acepta la tecla de WASD y la flecha equivalente, como en FNF.
const CARRILES = [
    { nombre: 'izquierda', teclas: ['a', 'arrowleft'],  flecha: '←' },
    { nombre: 'abajo',     teclas: ['s', 'arrowdown'],  flecha: '↓' },
    { nombre: 'arriba',    teclas: ['w', 'arrowup'],    flecha: '↑' },
    { nombre: 'derecha',   teclas: ['d', 'arrowright'], flecha: '→' }
];
const N_CARRILES = CARRILES.length;

// ====== Sprites de los personajes ======
// Acá se enchufan los dibujos. Cada pose es la imagen que se muestra cuando
// apretás ese carril; `idle` son los frames de descanso (si ponés dos, el
// personaje hace el bop al ritmo como en FNF).
//
// Las rutas son relativas a cband.html. Las que todavía no existan se
// ignoran solas (se precargan al empezar la canción), así podés ir dibujando
// de a una sin romper nada.
const PERSONAJES = {
    cusi: {
        carpeta: 'style/img/',
        idle: ['cusi_bass.png', 'cusi2.png'],
        poses: {
            izquierda: 'cusi_izq.png',
            abajo:     'cusi_abajo.png',
            arriba:    'cusi_arriba.png',
            derecha:   'cusi_der.png'
        },
        volverIdle: 220   // ms que dura la pose antes de volver al idle
    },
    kanep: {
        carpeta: 'style/img/',
        idle: ['kangif2.gif'],
        poses: {
            izquierda: 'kanep_izq.png',
            abajo:     'kanep_abajo.png',
            arriba:    'kanep_arriba.png',
            derecha:   'kanep_der.png'
        },
        volverIdle: 220
    },
    lisandro: {
        carpeta: 'style/img/',
        idle: ['lisandro_bate2.png', 'lisandro_bate.png'],
        poses: {
            izquierda: 'lisandro_izq.png',
            abajo:     'lisandro_abajo.png',
            arriba:    'lisandro_arriba.png',
            derecha:   'lisandro_der.png'
        },
        volverIdle: 200
    }
};

// Cómo se decide qué personaje es el de la pantalla: primero
// data-personaje="cusi" en el contenedor .personaje-grande (si querés ser
// explícito), y si no está, se adivina por el nombre de la imagen.
const PISTAS_PERSONAJE = [
    [/cusi/i, 'cusi'],
    [/kanep|kangif|kan/i, 'kanep'],
    [/lisandro|bate|chi/i, 'lisandro']
];

// ====== Configuración del juego ======
const TRAVEL = 1.35;                   // segundos que tarda una flecha en bajar
// Ventanas de acierto, en segundos (bastante anchas, tipo FNF).
const VENTANA = { perfecto: 0.075, bien: 0.125, ok: 0.175 };
const PUNTOS = { perfecto: 100, bien: 60, ok: 25 };
const PUNTOS_HOLD = 10;                // por cada tick de nota larga
const TICK_HOLD = 0.12;                // cada cuánto puntúa una nota larga
const BONUS_HOLD = 50;                 // por completar una nota larga
const GRACIA_HOLD = 0.10;              // podés soltar esto antes del final
const MULTI_MAX = 4;                   // el combo multiplica hasta x4
const CLAVE_OFFSET = 'cband_offset';   // calibración guardada por jugador

// ====== Estado ======
let notas = [];
let proxima = 0;           // primera nota sin spawnear (el array va ordenado)
let generacion = 0;        // apaga el loop viejo si cambiás de canción
let stats = null;
let offset = Number(localStorage.getItem(CLAVE_OFFSET) || 0); // seg (+ = notas más tarde)
let pistaEls = null;
let personaje = null;      // { img, cfg, poses, idle... }
let bpmActual = 120;
let teclaAbajo = new Array(N_CARRILES).fill(false);
let sosteniendo = new Array(N_CARRILES).fill(null); // nota larga activa por carril

// ====== Reloj ======
// audio.currentTime se actualiza a saltos (cada ~50-250ms según el navegador),
// así que entre actualización y actualización interpolamos con performance.now().
// Sin esto las flechas se mueven a tirones aunque el beatmap esté perfecto.
function crearReloj(audio) {
    let ultimoCT = -1;
    let ultimoReal = 0;

    return function ahora() {
        const ct = audio.currentTime;
        const real = performance.now() / 1000;

        if (ct !== ultimoCT) {
            ultimoCT = ct;
            ultimoReal = real;
            return ct - offset;
        }
        if (audio.paused) return ct - offset;

        // nunca extrapolamos más de 0.25s: si el audio se trabó, preferimos
        // que las flechas se frenen antes que desincronizarse.
        return ct + Math.min(real - ultimoReal, 0.25) - offset;
    };
}

// ====== Beatmap ======
function nombreCancion(src) {
    return src.split('/').pop().replace(/\.[^.]+$/, '');
}

// El instrumento sale de la carpeta del mp3, así la misma canción puede
// tener un chart distinto para el bajo y para la guitarra.
const CARPETAS_INSTRUMENTO = [
    [/bass_songs/i, 'bass'],
    [/guitar_songs/i, 'guitar'],
    [/drum_songs/i, 'drum']
];

function instrumentoDe(src) {
    for (const [re, nombre] of CARPETAS_INSTRUMENTO) {
        if (re.test(src)) return nombre;
    }
    return null;
}

function cargarNotas(src, duracion) {
    const clave = nombreCancion(src);
    const inst = instrumentoDe(src);
    let mapa = null;

    if (typeof BEATMAPS !== 'undefined') {
        if (inst && BEATMAPS[inst]) mapa = BEATMAPS[inst][clave] || null;
        if (!mapa) {
            // sin chart propio: prestamos el de otro instrumento antes de
            // caer en la grilla genérica
            for (const k of Object.keys(BEATMAPS)) {
                if (BEATMAPS[k] && BEATMAPS[k][clave]) {
                    mapa = BEATMAPS[k][clave];
                    console.warn(`"${clave}" no tiene chart de ${inst || '?'}, uso el de ${k}.`);
                    break;
                }
            }
        }
    }

    if (mapa && mapa.notas && mapa.notas.length) {
        return {
            bpm: mapa.bpm || 120,
            notas: mapa.notas.map(([t, carril, dur]) => nuevaNota(t, carril, dur))
        };
    }

    // Plan B: negras a 120 BPM repartidas por carril, para que la canción sea
    // jugable aunque todavía no tenga beatmap propio.
    console.warn(`Sin beatmap para "${clave}", uso una grilla genérica.`);
    const fin = (duracion && isFinite(duracion)) ? duracion - 1 : 60;
    const salida = [];
    for (let i = 0, t = 1; t < fin; i++, t += 0.5) {
        salida.push(nuevaNota(+t.toFixed(3), i % N_CARRILES, 0));
    }
    return { bpm: 120, notas: salida };
}

function nuevaNota(t, carril, dur) {
    return {
        tiempo: t,
        carril: carril,
        dur: dur || 0,
        larga: !!dur,
        el: null, cola: null,
        resuelta: false,     // la cabeza ya se acertó o se perdió
        golpeada: false,     // se acertó (no se perdió)
        soltada: false,      // nota larga soltada antes de tiempo
        proxTick: 0
    };
}

// ====== Personaje ======
function detectarPersonaje() {
    const cont = document.querySelector('.personaje-grande');
    const img = cont ? cont.querySelector('img') : null;
    if (!img) return null;

    let clave = cont.dataset.personaje;
    if (!clave) {
        const src = img.getAttribute('src') || '';
        for (const [re, nombre] of PISTAS_PERSONAJE) {
            if (re.test(src)) { clave = nombre; break; }
        }
    }

    const cfg = PERSONAJES[clave];
    if (!cfg) return null;

    const p = {
        img, cfg,
        idle: [],            // solo los frames que existen de verdad
        poses: {},           // solo las poses que existen de verdad
        idleActual: 0,
        pose: null,
        poseHasta: 0,
        ultimoBeat: -1
    };

    // Precarga: si el archivo no existe todavía, esa pose simplemente no se usa.
    const probar = (archivo, guardar) => {
        if (!archivo) return;
        const test = new Image();
        test.onload = () => guardar(cfg.carpeta + archivo);
        test.src = cfg.carpeta + archivo;
    };
    cfg.idle.forEach((a, i) => probar(a, (ruta) => { p.idle[i] = ruta; }));
    Object.keys(cfg.poses).forEach((dir) => probar(cfg.poses[dir], (ruta) => { p.poses[dir] = ruta; }));

    return p;
}

// La pose se pide en el mismo instante en que acertás (desde el keydown) y
// se apaga desde el loop, comparando contra el reloj. Antes salía con
// setTimeout y el bop del idle la pisaba a mitad de camino: por eso los
// sprites parecían ir por su cuenta.
function posePersonaje(carril, bpm) {
    if (!personaje) return;
    const dir = CARRILES[carril].nombre;
    const ruta = personaje.poses[dir];

    // el rebote del sprite se hace igual aunque falte el dibujo de esa pose
    personaje.img.classList.remove('golpe');
    void personaje.img.offsetWidth;
    personaje.img.classList.add('golpe');

    if (!ruta) return;                       // todavía no dibujaste esa pose

    const beat = 60 / (bpm || 120);
    personaje.pose = dir;
    personaje.poseHasta = performance.now() + Math.min(personaje.cfg.volverIdle, beat * 900);
    personaje.img.className = personaje.img.className.replace(/\bpose-\S+/g, '').trim();
    personaje.img.classList.add('pose-' + dir);
    personaje.img.src = ruta;
}

function idlePersonaje() {
    if (!personaje) return;
    const frames = personaje.idle.filter(Boolean);
    personaje.pose = null;
    personaje.img.className = personaje.img.className.replace(/\bpose-\S+/g, '').trim();
    if (!frames.length) return;
    personaje.img.src = frames[personaje.idleActual % frames.length];
}

// Se llama una vez por frame: saca la pose cuando se le cumplió el tiempo y
// hace el bop del idle en cada tiempo del compás (si hay dos frames de idle).
function actualizarPersonaje(t, bpm) {
    if (!personaje) return;
    const holdeando = sosteniendo.some(Boolean);

    if (personaje.pose) {
        // mientras sostenés una nota larga la pose se queda clavada
        if (holdeando || performance.now() < personaje.poseHasta) return;
        idlePersonaje();
    }

    if (personaje.idle.filter(Boolean).length < 2) return;
    const beat = Math.floor(t / (60 / (bpm || 120)));
    if (beat === personaje.ultimoBeat) return;
    personaje.ultimoBeat = beat;
    if (holdeando) return;
    personaje.idleActual++;
    idlePersonaje();
}

// ====== Flechas ======
// Flecha estilo FNF dibujada en SVG: cuerpo con punta, borde oscuro y un
// brillo arriba. Apunta hacia arriba y cada carril la rota con CSS, así hay
// un solo dibujo para los cuatro. Si después querés usar tus propios
// sprites, reemplazá esta función por un <img> y listo.
function svgFlecha() {
    return `
    <svg class="flecha" viewBox="0 0 100 100" aria-hidden="true">
        <path class="cuerpo" d="M50 6 L94 46 A6 6 0 0 1 90 57 L74 57 L74 88
            A6 6 0 0 1 68 94 L32 94 A6 6 0 0 1 26 88 L26 57 L10 57
            A6 6 0 0 1 6 46 Z"/>
        <path class="brillo" d="M50 18 L80 46 L64 46 L64 60 L36 60 L36 46 L20 46 Z"/>
    </svg>`;
}

// ====== Pista ======
function construirPista() {
    const pista = document.getElementById('pista');
    if (!pista) return null;

    pista.innerHTML = '';
    pista.classList.add('pista-juego');

    const carriles = [], receptores = [];
    for (let i = 0; i < N_CARRILES; i++) {
        const carril = document.createElement('div');
        carril.className = 'carril';

        const receptor = document.createElement('div');
        receptor.className = 'receptor rec-' + CARRILES[i].nombre;
        receptor.innerHTML = svgFlecha();
        carril.appendChild(receptor);

        pista.appendChild(carril);
        carriles.push(carril);
        receptores.push(receptor);
    }

    const juicio = document.createElement('div');
    juicio.className = 'juicio';
    pista.appendChild(juicio);

    const combo = document.createElement('div');
    combo.className = 'combo';
    pista.appendChild(combo);

    return { pista, carriles, receptores, juicio, combo };
}

function geometria() {
    const alto = pistaEls ? pistaEls.pista.clientHeight : 420;
    const zonaY = alto - 58;                 // centro del receptor
    return { alto, zonaY, vel: zonaY / TRAVEL };  // px por segundo
}

function mostrarJuicio(texto, tipo) {
    if (!pistaEls) return;
    const el = pistaEls.juicio;
    el.textContent = texto;
    el.className = 'juicio visible ' + tipo;
    void el.offsetWidth;                     // reinicia la animación
    el.classList.add('anim');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('visible', 'anim'), 420);
}

function mostrarCombo() {
    if (!pistaEls) return;
    const el = pistaEls.combo;
    if (stats.combo >= 5) {
        el.textContent = stats.combo + ' seguidas';
        el.classList.add('visible');
    } else {
        el.classList.remove('visible');
    }
}

function actualizarScore() {
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = stats.score;
}

// ====== Partida ======
function iniciarJuego(audio) {
    pistaEls = construirPista();
    if (!pistaEls) return; // esta pantalla no tiene panel de juego

    const datos = cargarNotas(audio.getAttribute('src') || audio.src, audio.duration);
    bpmActual = datos.bpm || 120;
    notas = datos.notas.sort((a, b) => a.tiempo - b.tiempo);
    proxima = 0;

    personaje = detectarPersonaje();
    teclaAbajo = new Array(N_CARRILES).fill(false);
    sosteniendo = new Array(N_CARRILES).fill(null);

    stats = {
        score: 0, combo: 0, mejorCombo: 0,
        perfecto: 0, bien: 0, ok: 0, fallos: 0,
        largas: 0, largasOk: 0,
        total: notas.length
    };
    actualizarScore();
    mostrarCombo();
    notas.forEach((n) => { if (n.larga) stats.largas++; });

    const reloj = crearReloj(audio);
    const mia = ++generacion;
    audio._reloj = reloj;

    function loop() {
        if (mia !== generacion) return;      // arrancó otra canción

        const t = reloj();
        const { zonaY, vel } = geometria();
        actualizarPersonaje(t, datos.bpm);

        // Spawn: el array está ordenado, así que solo miramos desde `proxima`.
        while (proxima < notas.length && notas[proxima].tiempo - t <= TRAVEL) {
            const n = notas[proxima++];
            if (n.tiempo - t < -VENTANA.ok) { n.resuelta = true; continue; }
            crearElemento(n, vel);
        }

        for (let i = 0; i < notas.length; i++) {
            const n = notas[i];
            if (!n.el) continue;
            const restante = n.tiempo - t;


            if (!n.resuelta && restante < -VENTANA.ok) { fallar(n); continue; }

            if (n.golpeada && n.larga && !n.soltada) {
 
                const queda = Math.max(0, n.tiempo + n.dur - t);
                n.el.style.transform = 'translate3d(0,' + zonaY + 'px,0)';
                if (n.cola) n.cola.style.height = (queda * vel) + 'px';
                tickHold(n, t);
                continue;
            }

            if (n.resuelta) continue;

            n.el.style.transform = 'translate3d(0,' + (zonaY * (1 - restante / TRAVEL)) + 'px,0)';
        }

        if (!audio.ended) requestAnimationFrame(loop);
        else terminar();
    }

 
    audio.addEventListener('ended', () => { if (mia === generacion) terminar(); }, { once: true });

    requestAnimationFrame(loop);
}

function crearElemento(n, vel) {
    const el = document.createElement('div');
    el.className = 'nota nota-' + CARRILES[n.carril].nombre + (n.larga ? ' larga' : '');

    if (n.larga) {
        const cola = document.createElement('div');
        cola.className = 'cola';
        cola.style.height = (n.dur * vel) + 'px';
        el.appendChild(cola);
        n.cola = cola;
    }

    const punta = document.createElement('div');
    punta.className = 'punta';
    punta.innerHTML = svgFlecha();
    el.appendChild(punta);

    pistaEls.carriles[n.carril].appendChild(el);
    n.el = el;
}

function limpiar(n, demora) {
    if (!n.el) return;
    const el = n.el;
    n.el = null; n.cola = null;
    if (demora) { el.classList.add('saliendo'); setTimeout(() => el.remove(), demora); }
    else el.remove();
}

function fallar(n) {
    n.resuelta = true;
    limpiar(n, 0);
    stats.fallos++;
    stats.combo = 0;
    mostrarJuicio('perdida', 'malo');
    mostrarCombo();
}

function acertar(n, dist) {
    let tipo, texto;
    if (dist <= VENTANA.perfecto) { tipo = 'perfecto'; texto = 'perfecto'; }
    else if (dist <= VENTANA.bien) { tipo = 'bien'; texto = 'bien'; }
    else { tipo = 'ok'; texto = 'casi'; }

    stats[tipo]++;
    stats.combo++;
    stats.mejorCombo = Math.max(stats.mejorCombo, stats.combo);
    stats.score += PUNTOS[tipo] * Math.min(MULTI_MAX, 1 + Math.floor(stats.combo / 10));

    n.resuelta = true;
    n.golpeada = true;
    posePersonaje(n.carril, bpmActual);

    if (n.larga) {
        n.proxTick = n.tiempo + TICK_HOLD;
        sosteniendo[n.carril] = n;
        if (n.el) n.el.classList.add('sosteniendo');
        pistaEls.receptores[n.carril].classList.add('sostenido');
    } else {
        limpiar(n, 140);
    }

    actualizarScore();
    mostrarJuicio(texto, tipo);
    mostrarCombo();
}

function tickHold(n, t) {
    const fin = n.tiempo + n.dur;

    if (t >= fin - GRACIA_HOLD) { completarHold(n); return; }

    if (!teclaAbajo[n.carril]) { soltarHold(n, true); return; }

    while (t >= n.proxTick && n.proxTick < fin) {
        stats.score += PUNTOS_HOLD;
        n.proxTick += TICK_HOLD;
        actualizarScore();
    }
}

function completarHold(n) {
    n.soltada = true;
    stats.largasOk++;
    stats.score += BONUS_HOLD;
    actualizarScore();
    sosteniendo[n.carril] = null;
    pistaEls.receptores[n.carril].classList.remove('sostenido');
    limpiar(n, 140);
}

function soltarHold(n, romperCombo) {
    n.soltada = true;
    sosteniendo[n.carril] = null;
    pistaEls.receptores[n.carril].classList.remove('sostenido');
    limpiar(n, 0);
    if (romperCombo) {
        stats.combo = 0;
        mostrarJuicio('soltaste', 'malo');
        mostrarCombo();
    }
}

function terminar() {
    if (!pistaEls || !stats || stats.terminado) return;
    stats.terminado = true;

    const acertadas = stats.perfecto + stats.bien + stats.ok;
    const precision = stats.total ? Math.round((acertadas / stats.total) * 100) : 0;
    const monedas = Math.floor(stats.score / 200);

    if (monedas > 0 && typeof ganarDinero === 'function') ganarDinero(monedas);

    const panel = document.createElement('div');
    panel.className = 'resultado';
    panel.innerHTML = `
        <h3>Fin de la canción</h3>
        <p class="resultado-score">${stats.score} puntos</p>
        <ul>
            <li>Perfectas: ${stats.perfecto}</li>
            <li>Bien: ${stats.bien}</li>
            <li>Casi: ${stats.ok}</li>
            <li>Perdidas: ${stats.fallos}</li>
            <li>Largas completas: ${stats.largasOk} de ${stats.largas}</li>
            <li>Mejor racha: ${stats.mejorCombo}</li>
            <li>Precisión: ${precision}%</li>
        </ul>
        <p class="resultado-premio">${monedas > 0 ? '+' + monedas + ' monedas' : 'Sin monedas esta vez'}</p>
        <p class="resultado-ayuda">Elegí una canción para volver a jugar.</p>
    `;
    pistaEls.pista.appendChild(panel);
}

document.addEventListener('click', (e) => {
    const li = e.target.closest('.lista-canciones li');
    if (!li) return;

    const lista = li.closest('.lista-canciones');
    lista.querySelectorAll('li').forEach((el) => el.classList.remove('activa'));
    li.classList.add('activa');

    const audio = document.getElementById('reproductor');
    const src = li.dataset.src;
    if (!src || !audio) return;

    generacion++;          // corta la partida anterior antes de tocar el audio
    audio.pause();
    audio.src = src;
    audio.currentTime = 0;

    audio.play()
        .then(() => iniciarJuego(audio))
        .catch((error) => console.log('No se pudo reproducir la canción:', error));
});

function carrilDe(tecla) {
    for (let i = 0; i < N_CARRILES; i++) {
        if (CARRILES[i].teclas.includes(tecla)) return i;
    }
    return -1;
}

document.addEventListener('keydown', (e) => {
    const tecla = e.key.toLowerCase();

   
    if (tecla === '[' || tecla === ']') {
        offset = Math.round((offset + (tecla === '[' ? -0.01 : 0.01)) * 1000) / 1000;
        localStorage.setItem(CLAVE_OFFSET, String(offset));
        mostrarJuicio((offset > 0 ? '+' : '') + Math.round(offset * 1000) + ' ms', 'ok');
        return;
    }

    const carril = carrilDe(tecla);
    if (carril === -1) return;
    if (tecla.startsWith('arrow')) e.preventDefault();   // que no scrollee la página
    if (e.repeat) return;

    teclaAbajo[carril] = true;
    if (!pistaEls) return;

    const receptor = pistaEls.receptores[carril];
    receptor.classList.add('activo');

    const audio = document.getElementById('reproductor');
    if (!audio || !notas.length) return;

    const t = audio._reloj ? audio._reloj() : audio.currentTime - offset;

    let mejor = null, mejorDist = Infinity;
    for (const n of notas) {
        if (n.carril !== carril || n.resuelta) continue;
        const dist = Math.abs(n.tiempo - t);
        if (dist > VENTANA.ok + 0.25) continue;
        if (dist < mejorDist) { mejor = n; mejorDist = dist; }
    }

    if (mejor && mejorDist <= VENTANA.ok) acertar(mejor, mejorDist);
});

document.addEventListener('keyup', (e) => {
    const tecla = e.key.toLowerCase();
    const carril = carrilDe(tecla);
    if (carril === -1) return;

    teclaAbajo[carril] = false;
    if (!pistaEls) return;

    pistaEls.receptores[carril].classList.remove('activo');

    const n = sosteniendo[carril];
    if (n) soltarHold(n, true);
});

window.addEventListener('blur', () => {
    for (let i = 0; i < N_CARRILES; i++) {
        teclaAbajo[i] = false;
        if (pistaEls) pistaEls.receptores[i].classList.remove('activo');
        if (sosteniendo[i]) soltarHold(sosteniendo[i], true);
    }
});

// ====== Estilos de la pista ======
// Van inyectados desde acá para no tener que tocar el HTML ni banda.css.
// Si preferís tenerlos en el CSS, copiá este bloque a style/banda.css y
// borrá esta función. Para usar sprites de flechas en vez de los caracteres
// ← ↓ ↑ →, poné background-image en .punta / .receptor y dejá el texto vacío.
(function estilosPista() {
    if (document.getElementById('estilos-pista')) return;
    const st = document.createElement('style');
    st.id = 'estilos-pista';
    st.textContent = `
    #pista.pista-juego {
        position: relative;
        display: flex;
        gap: 6px;
        height: 460px;
        padding: 0;
        overflow: hidden;
        border-radius: 10px;
        background: #12102a;
        box-shadow: inset 0 0 0 2px #2c2760;
    }
    #pista.pista-juego .carril {
        position: relative;
        flex: 1;
        background: linear-gradient(180deg, #171436 0%, #1d1944 100%);
        border-left: 1px solid #262158;
        border-right: 1px solid #262158;
    }
    /* ---- flechas: un solo SVG rotado por carril ---- */
    #pista.pista-juego .flecha { width: 100%; height: 100%; display: block; overflow: visible; }
    #pista.pista-juego .flecha .cuerpo {
        fill: var(--color);
        stroke: #0d0b20;
        stroke-width: 7;
        stroke-linejoin: round;
        paint-order: stroke;
    }
    #pista.pista-juego .flecha .brillo { fill: #fff; opacity: .22; }
    #pista.pista-juego .carril:nth-child(1) { --color: #ff4d6d; }
    #pista.pista-juego .carril:nth-child(2) { --color: #3fa9f5; }
    #pista.pista-juego .carril:nth-child(3) { --color: #3ec46d; }
    #pista.pista-juego .carril:nth-child(4) { --color: #ffb020; }
    #pista.pista-juego .rec-izquierda .flecha, #pista.pista-juego .nota-izquierda .flecha { transform: rotate(-90deg); }
    #pista.pista-juego .rec-abajo .flecha,     #pista.pista-juego .nota-abajo .flecha     { transform: rotate(180deg); }
    #pista.pista-juego .rec-derecha .flecha,   #pista.pista-juego .nota-derecha .flecha   { transform: rotate(90deg); }

    #pista.pista-juego .receptor {
        position: absolute;
        left: 50%;
        bottom: 22px;
        width: 76px;
        height: 76px;
        margin-left: -38px;
        transition: transform .07s ease, filter .07s ease;
    }
    /* en reposo la flecha del receptor va apagada y sin relleno */
    #pista.pista-juego .receptor .cuerpo { fill: rgba(255,255,255,.06); stroke: #6d64b8; stroke-width: 6; }
    #pista.pista-juego .receptor .brillo { opacity: 0; }
    #pista.pista-juego .receptor.activo { transform: scale(1.1); }
    #pista.pista-juego .receptor.activo .cuerpo { fill: var(--color); stroke: #fff; }
    #pista.pista-juego .receptor.sostenido {
        transform: scale(1.06);
        filter: drop-shadow(0 0 12px var(--color));
    }
    #pista.pista-juego .receptor.sostenido .cuerpo { fill: var(--color); stroke: #ffe066; }

    #pista.pista-juego .nota {
        position: absolute;
        top: -38px;
        left: 50%;
        width: 76px;
        margin-left: -38px;
        transform: translate3d(0,0,0);
        will-change: transform;
    }
    #pista.pista-juego .nota .punta {
        position: absolute;
        top: 0; left: 0;
        width: 76px;
        height: 76px;
        filter: drop-shadow(0 3px 0 rgba(0,0,0,.35));
    }
    #pista.pista-juego .nota .cola {
        position: absolute;
        left: 50%;
        bottom: -38px;           /* nace en el centro de la punta y sube */
        width: 30px;
        margin-left: -15px;
        border-radius: 4px;
        background: var(--color);
        border: 4px solid #0d0b20;
        box-sizing: border-box;
        opacity: .9;
    }
    #pista.pista-juego .nota.sosteniendo .punta { filter: drop-shadow(0 0 12px var(--color)); }
    #pista.pista-juego .nota.saliendo {
        transition: opacity .14s linear, transform .14s linear;
        opacity: 0;
    }
    #pista.pista-juego .juicio {
        position: absolute;
        left: 0; right: 0;
        bottom: 110px;
        text-align: center;
        font: 700 26px/1 system-ui, sans-serif;
        opacity: 0;
        pointer-events: none;
    }
    #pista.pista-juego .juicio.visible { opacity: 1; }
    #pista.pista-juego .juicio.anim { animation: juicio-pop .42s ease-out; }
    #pista.pista-juego .juicio.perfecto { color: #ffe066; }
    #pista.pista-juego .juicio.bien { color: #63e6be; }
    #pista.pista-juego .juicio.ok { color: #9db2ff; }
    #pista.pista-juego .juicio.malo { color: #ff6b6b; }
    @keyframes juicio-pop {
        from { transform: translateY(8px) scale(.9); }
        to { transform: translateY(-6px) scale(1); }
    }
    #pista.pista-juego .combo {
        position: absolute;
        top: 12px; left: 0; right: 0;
        text-align: center;
        color: #cfc8ff;
        font: 600 16px/1 system-ui, sans-serif;
        opacity: 0;
        transition: opacity .15s ease;
    }
    #pista.pista-juego .combo.visible { opacity: 1; }
    #pista.pista-juego .resultado {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        background: rgba(10,8,30,.92);
        color: #efecff;
        font-family: system-ui, sans-serif;
        text-align: center;
    }
    #pista.pista-juego .resultado h3 { margin: 0; font-size: 20px; font-weight: 600; }
    #pista.pista-juego .resultado-score { margin: 2px 0 6px; font-size: 34px; font-weight: 700; }
    #pista.pista-juego .resultado ul { list-style: none; margin: 0; padding: 0; line-height: 1.6; }
    #pista.pista-juego .resultado-premio { margin: 10px 0 0; color: #ffe066; font-weight: 600; }
    #pista.pista-juego .resultado-ayuda { margin: 6px 0 0; color: #9d97c9; font-size: 13px; }

    /* Personaje: el rebote y las poses. Si dibujás sprites con otro tamaño,
       ajustá acá el alto máximo. */
    .personaje-grande img {
        max-height: 420px;
        transition: transform .08s ease;
    }
    .personaje-grande img[class*="pose-"] { transform: scale(1.04); }
    .personaje-grande img.golpe { animation: golpe-personaje .18s ease-out; }
    @keyframes golpe-personaje {
        from { transform: scale(1.07); }
        to { transform: scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
        #pista.pista-juego .juicio.anim { animation: none; }
        .personaje-grande img { transition: none; }
    }
    `;
    document.head.appendChild(st);
})();