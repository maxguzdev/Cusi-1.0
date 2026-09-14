document.addEventListener('DOMContentLoaded', () => {

    // Selectores
    const contenedorJuego = document.querySelector('.contenedor-juego');
    const juego = document.querySelector('.juego');
    const resultado = document.querySelector('.resultado-juego');
    const contadorBanderas = document.getElementById('num-banderas');
    const contadorBanderasRestantes = document.getElementById('banderas-restantes');

    // Variables GLOBALES con valores por defecto
    let width = 10;             // => Tamaño de la grilla (10x10)
    let numBombas = 20;         // => Cantidad de bombas
    let numBanderas = 0;
    let casillas = [];
    let finPartida = false;

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

                casillas[i].setAttribute('data', total);
            }
        }
    }

    function revelarCasillas(casilla) {
        const idCasilla = parseInt(casilla.id);
        const estaBordeIzq = (idCasilla % width === 0);
        const estaBordeDech = (idCasilla % width === width - 1);

        setTimeout(() => {
            if (idCasilla > 0 && !estaBordeIzq) click(casillas[idCasilla - 1]);
            if (idCasilla < (width * width - 2) && !estaBordeDech) click(casillas[idCasilla + 1]);
            if (idCasilla >= width) click(casillas[idCasilla - width]);
            if (idCasilla > (width - 1) && !estaBordeDech) click(casillas[idCasilla + 1 - width]);
            if (idCasilla > (width + 1) && !estaBordeIzq) click(casillas[idCasilla - 1 - width]);
            if (idCasilla < (width * (width - 1))) click(casillas[idCasilla + width]);
            if (idCasilla < (width * width - width - 2) && !estaBordeDech) click(casillas[idCasilla + 1 + width]);
            if (idCasilla < (width * width - width) && !estaBordeIzq) click(casillas[idCasilla - 1 + width]);
        }, 10);
    }

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
        if (finPartida) return;

        if (!casilla.classList.contains('marcada') && numBanderas < numBombas) {
            if (!casilla.classList.contains('bandera')) {
                casilla.classList.add('bandera');
                casilla.innerHTML = '🚩';
                numBanderas++;
                actualizaNumBanderas();
                compruebaPartida();
            } else {
                casilla.classList.remove('bandera');
                casilla.innerHTML = '';
                numBanderas--;
                actualizaNumBanderas();
            }
        }
    }

    function compruebaPartida() {
        let aciertos = 0;

        for (let i = 0; i < casillas.length; i++) {
            if (casillas[i].classList.contains('bandera') && casillas[i].classList.contains('bomba'))
                aciertos++;
        }

        if (aciertos === numBombas) {
            finPartida = true;
            resultado.textContent = 'Muy bien GANASTE!!!';
            resultado.classList.add('back-green');
        }
    }

    function actualizaNumBanderas() {
        contadorBanderas.textContent = numBanderas;
        contadorBanderasRestantes.textContent = (numBombas - numBanderas);
    }

    function click(casilla) {
        if (casilla.classList.contains('marcada') || casilla.classList.contains('bandera') || finPartida) return;

        if (casilla.classList.contains('bomba')) {
            bomba(casilla);
        } else {
            let total = casilla.getAttribute('data');
            if (total != 0) {
                casilla.classList.add('marcada');
                casilla.innerHTML = total;
                return;
            }
            casilla.classList.add('marcada');
            revelarCasillas(casilla);
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

        juego.style.width = (width * 4) + 'rem';
        resultado.style.width = (width * 4) + 'rem';

        const arrayBombas = Array(numBombas).fill('bomba');
        const arrayVacios = Array(width * width - numBombas).fill('vacio');
        const arrayCompleto = arrayVacios.concat(arrayBombas);
        arrayCompleto.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const casilla = document.createElement('div');
            casilla.setAttribute('id', i);
            casilla.classList.add(arrayCompleto[i]);
            juego.appendChild(casilla);
            casillas.push(casilla);

            casilla.addEventListener('click', (event) => click(event.target));
            casilla.oncontextmenu = function (event) {
                event.preventDefault();
                añadirBandera(casilla);
            };
            casilla.addEventListener('dblclick', (event) => dobleClick(event.target));
        }

        añadeNumeros();
        actualizaNumBanderas();
    }

    // Inicia el juego automáticamente al cargar la página
    crearJuego();
});