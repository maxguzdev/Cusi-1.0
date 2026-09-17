document.addEventListener('DOMContentLoaded', () => {

   // Selectores
const contenedorJuego = document.querySelector('.contenedor-juego');
const juego = document.querySelector('.juego');
const resultado = document.querySelector('.resultado-juego');
const contadorBanderas = document.getElementById('num-banderas');
const contadorBanderasRestantes = document.getElementById('banderas-restantes');
const placeholder = document.getElementById('placeholder');
const btnRestart = document.getElementById('btn-restart');
const btnInfo = document.getElementById('btn-info');
const modalOverlay = document.getElementById('modal-overlay');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');

// Muestra el dinero guardado apenas carga la página (Cusi_script.js ya lo trae de localStorage)
if (typeof economia === 'function') economia();

// Variables GLOBALES con valores por defecto
let width = 10;             // => Tamaño de la grilla (10x10)
let numBombas = 20;         // => Cantidad de bombas
let numBanderas = 0;
let casillas = [];
let finPartida = false;
let primerClick = true;     // => true hasta que se hace el primer clic de la partida
let juegoIniciado = false;  // => true cuando se selecciona dificultad

function obtenerVecinos(i) {
    const estaBordeIzq = (i % width === 0);
    const estaBordeDech = (i % width === width - 1);
    const vecinos = [];

    if (i > 0 && !estaBordeIzq) vecinos.push(i - 1);
    if (i < (width * width - 1) && !estaBordeDech) vecinos.push(i + 1);
    if (i >= width) vecinos.push(i - width);
    if (i >= width && !estaBordeIzq) vecinos.push(i - width - 1);
    if (i >= width && !estaBordeDech) vecinos.push(i - width + 1);
    if (i < width * (width - 1)) vecinos.push(i + width);
    if (i < width * (width - 1) && !estaBordeIzq) vecinos.push(i + width - 1);
    if (i < width * (width - 1) && !estaBordeDech) vecinos.push(i + width + 1);

    return vecinos;
}

function colocarBombas(indiceClickeado) {
    // La celda clickeada y sus vecinas quedan afuera del sorteo de minas,
    // así el primer clic siempre cae en zona segura y con espacio para despejar.
    const excluidos = new Set([indiceClickeado, ...obtenerVecinos(indiceClickeado)]);
    let disponibles = [];

    for (let i = 0; i < casillas.length; i++) {
        if (!excluidos.has(i)) disponibles.push(i);
    }

    // Por si algún día una dificultad tuviera más bombas que celdas disponibles
    // fuera de la zona segura, se cae de nuevo a excluir solo la celda clickeada.
    if (disponibles.length < numBombas) {
        disponibles = [];
        for (let i = 0; i < casillas.length; i++) {
            if (i !== indiceClickeado) disponibles.push(i);
        }
    }

    // Barajamos y tomamos las primeras numBombas celdas disponibles
    for (let i = disponibles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [disponibles[i], disponibles[j]] = [disponibles[j], disponibles[i]];
    }

    disponibles.slice(0, numBombas).forEach((i) => {
        casillas[i].classList.remove('vacio');
        casillas[i].classList.add('bomba');
    });

    añadeNumeros();
}

function añadeNumeros() {
    for (let i = 0; i < casillas.length; i++) {
        let total = 0;
        const estaBordeIzq = (i % width === 0);
        const estaBordeDech = (i % width === width - 1);

        if (casillas[i].classList.contains('vacio')) {
            if (i > 0 && !estaBordeIzq && casillas[i - 1].classList.contains('bomba')) total++;
            if (i < (width * width - 1) && !estaBordeDech && casillas[i + 1].classList.contains('bomba')) total++;
            if (i > width && casillas[i - width].classList.contains('bomba')) total++;
            if (i > (width - 1) && !estaBordeDech && casillas[i + 1 - width].classList.contains('bomba')) total++;
            if (i > width && !estaBordeIzq && casillas[i - 1 - width].classList.contains('bomba')) total++;
            if (i < (width * (width - 1)) && casillas[i + width].classList.contains('bomba')) total++;
            if (i < (width * (width - 1)) && !estaBordeDech && casillas[i + 1 + width].classList.contains('bomba')) total++;
            if (i < (width * (width - 1)) && !estaBordeIzq && casillas[i - 1 + width].classList.contains('bomba')) total++;

            casillas[i].setAttribute('data-bombas', total);  // ✅ BUG 1 CORREGIDO
        }
    }
}

function revelarCasillas(casilla) {
    const idCasilla = parseInt(casilla.id);
    const estaBordeIzq = (idCasilla % width === 0);
    const estaBordeDech = (idCasilla % width === width - 1);

    setTimeout(() => {
        // Izquierda
        if (idCasilla > 0 && !estaBordeIzq) click(casillas[idCasilla - 1]);
        // Derecha
        if (idCasilla < (width * width - 1) && !estaBordeDech) click(casillas[idCasilla + 1]);
        // Arriba
        if (idCasilla >= width) click(casillas[idCasilla - width]);
        // Arriba-izquierda
        if (idCasilla >= width && !estaBordeIzq) click(casillas[idCasilla - 1 - width]);
        // Arriba-derecha
        if (idCasilla >= width && !estaBordeDech) click(casillas[idCasilla + 1 - width]);
        // Abajo
        if (idCasilla < (width * (width - 1))) click(casillas[idCasilla + width]);
        // Abajo-izquierda
        if (idCasilla < (width * (width - 1)) && !estaBordeIzq) click(casillas[idCasilla - 1 + width]);
        // Abajo-derecha
        if (idCasilla < (width * (width - 1)) && !estaBordeDech) click(casillas[idCasilla + 1 + width]);
    }, 10);
}  // ✅ BUG 2 CORREGIDO

function bomba(casillaClickeada) {
    finPartida = true;
    casillaClickeada.classList.add('back-red');

    casillas.forEach((casilla) => {
        if (casilla.classList.contains('bomba')) {
            casilla.innerHTML = '💣';
            casilla.classList.remove('bomba');
            casilla.classList.add('marcada');
        }
    });

    resultado.textContent = 'Lo siento, PERDISTE!!!';
    resultado.classList.add('back-red');
}

function añadirBandera(casilla) {
    if (finPartida || casilla.classList.contains('marcada')) return;

    if (casilla.classList.contains('bandera')) {
        // Sacar la bandera siempre está permitido, sin importar el límite
        casilla.classList.remove('bandera');
        casilla.innerHTML = '';
        numBanderas--;
        actualizaNumBanderas();
    } else if (numBanderas < numBombas) {
        // Solo poner una bandera nueva si no se llegó al límite
        casilla.classList.add('bandera');
        casilla.innerHTML = '🚩';
        numBanderas++;
        actualizaNumBanderas();
        compruebaPartida();
    }
}

function compruebaPartida() {
    let aciertos = 0;

    for (let i = 0; i < casillas.length; i++) {
        if (casillas[i].classList.contains('bandera') && casillas[i].classList.contains('bomba')) aciertos++;
    }

    // Ganas apenas todas las bombas están marcadas con bandera.
    // Como el límite de banderas es numBombas, si aciertos === numBombas
    // significa que las 20 banderas están exactamente sobre las 20 bombas
    // (no puede haber ninguna bandera "de más" en una casilla segura).
    if (aciertos === numBombas) {
        finPartida = true;

        // Revela el resto del tablero para que se vea completo
        casillas.forEach((casilla) => {
            if (!casilla.classList.contains('bomba') && !casilla.classList.contains('marcada')) {
                casilla.classList.add('marcada');
                const total = casilla.getAttribute('data-bombas');
                if (total != 0) casilla.innerHTML = total;
            }
        });

        // Recompensa: tantas monedas como bombas tenía la dificultad elegida
        // (fácil=20, medio=30, difícil=50), así premia más el riesgo mayor.
        const recompensa = numBombas;
        if (typeof ganarDinero === 'function') {
            ganarDinero(recompensa);
        }

        resultado.innerHTML = `Muy bien GANASTE!!! +${recompensa} <img src="/Cusi-1.0/frontEnd/Cusi_style/cusimios.png" class="icono-moneda-resultado">`;
        resultado.classList.add('back-green');
    }
}  // ✅ BUG 3 CORREGIDO

function actualizaNumBanderas() {
    contadorBanderas.textContent = numBanderas;
    contadorBanderasRestantes.textContent = (numBombas - numBanderas);
}

function click(casilla) {
    if (casilla.classList.contains('marcada') || casilla.classList.contains('bandera') || finPartida) return;

    if (primerClick) {
        colocarBombas(parseInt(casilla.id));
        primerClick = false;
    }

    if (casilla.classList.contains('bomba')) {
        bomba(casilla);
    } else {
        let total = casilla.getAttribute('data-bombas');  // ✅ BUG 1 CORREGIDO
        if (total != 0) {
            casilla.classList.add('marcada');
            casilla.innerHTML = total;
            compruebaPartida();
            return;
        }
        casilla.classList.add('marcada');
        revelarCasillas(casilla);
        compruebaPartida();
    }
}

function dobleClick(casilla) {
    if (!casilla.classList.contains('marcada') || finPartida) return;
    revelarCasillas(casilla);
}

function crearJuego() {
    juego.innerHTML = "";
    resultado.innerHTML = "";
    resultado.className = "resultado-juego";
    casillas = [];
    finPartida = false;
    numBanderas = 0;
    primerClick = true;
    juegoIniciado = true;

    // Ocultar placeholder cuando se inicia el juego
    placeholder.classList.add('hidden');

    juego.style.width = (width * 4) + 'rem';
    resultado.style.width = (width * 4) + 'rem';

    // Todavía no hay minas: el tablero arranca 100% vacío.
    // Las minas se reparten en colocarBombas() cuando ocurre el primer clic.
    for (let i = 0; i < width * width; i++) {
        const casilla = document.createElement('div');
        casilla.setAttribute('id', i);
        casilla.classList.add('vacio');
        juego.appendChild(casilla);
        casillas.push(casilla);

        casilla.addEventListener('click', (event) => click(event.target));
        casilla.oncontextmenu = function (event) {
            event.preventDefault();
            añadirBandera(casilla);
        };
        casilla.addEventListener('dblclick', (event) => dobleClick(event.target));
    }

    actualizaNumBanderas();
}

// Función para abrir el modal de info
function abrirModal() {
    modalOverlay.classList.add('activo');
}

// Función para cerrar el modal de info
function cerrarModal() {
    modalOverlay.classList.remove('activo');
}

// Event listeners para los botones del header
btnInfo.addEventListener('click', abrirModal);
btnCerrarModal.addEventListener('click', cerrarModal);

// Cerrar modal si se hace click afuera
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        cerrarModal();
    }
});

// Botón de restart: reinicia el juego con la dificultad actual
btnRestart.addEventListener('click', () => {
    if (juegoIniciado) {
        crearJuego();
    }
});

// Event listener para los botones de dificultad
document.addEventListener('click', function (e) {
    switch (e.target.id) {
        case 'fac': 
            width = 10; 
            numBombas = 20;
            break;
        case 'med': 
            width = 12; 
            numBombas = 30;
            break;
        case 'dif': 
            width = 14; 
            numBombas = 50;
            break;
        default:
            return;
    }
    crearJuego();
});
});