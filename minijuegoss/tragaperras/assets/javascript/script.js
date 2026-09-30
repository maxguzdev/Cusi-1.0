/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/

let money = (typeof dinero !== 'undefined') ? dinero : 50;
let monedaInsertada = false; // Hay que pagar 1 moneda antes de poder tirar

function DisplayMoney() {
    // Sincroniza el dinero con el estado global si existe
    if (typeof dinero !== 'undefined') {
        dinero = money;
        if (typeof guardarDinero === 'function') guardarDinero();
    }
    
    // Actualiza el HUD del tragaperras
    let cuentaCreditos = document.getElementById("cuentaCreditos");
    if (cuentaCreditos) {
        cuentaCreditos.innerHTML = money;
    }

    // Compatibilidad en caso de usar affichage_argent
    if (typeof affichage_argent !== 'undefined' && affichage_argent) {
        affichage_argent.innerHTML = money + "X";
    }
}

// Mostrar los créditos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    DisplayMoney();
});

function insertarMonedas() {
  if (money <= 0) {
    document.getElementById("mensaje").innerHTML = "No tenés monedas para insertar.";
    return;
  }

  money--; // La moneda se descuenta del saldo
  monedaInsertada = true;
  DisplayMoney();
  document.getElementById("cuentaCreditos").innerHTML = money + "<span style='color: red; font-size: smaller;'> -1 </span>";
  document.getElementById("mensaje").innerHTML = "Let's Go Gambling";
}

function rand(n) {
  return Math.floor(Math.random() * n);
}

// Definición de audios
const sonidoGanar = new Audio('./assets/song/win2.mp3');
const sonidoPerder = new Audio('./assets/song/lose2.mp3');
const sonidoFondo = new Audio('./assets/song/fondosong.mp3');
const sonidoInicio = new Audio('./assets/song/maquinitainicio.mp3');
const sonidocoin = new Audio('./assets/song/moneda.mp3');

sonidoFondo.loop = true; 
let musicaReproduciendose = false;

function iniciarMusicaFondo() {
  if (!musicaReproduciendose) {
    sonidoFondo.play().then(() => {
      musicaReproduciendose = true;
    }).catch(error => {
      console.log("Esperando interacción del usuario para reproducir audio:", error);
    });
  }
}

function tirar() {
  if (!monedaInsertada) {
    document.getElementById("mensaje").innerHTML = "Oh no perdiste tu casa, ¡inténtalo de nuevo!";
    return;
  }

  // Reproducir sonido de inicio de tirada asegurando el reseteo del tiempo
  sonidoInicio.currentTime = 0; 
  sonidoInicio.play().catch(error => {
    console.log("Error al reproducir sonidoInicio:", error);
  });

  setTimeout(() => {
    sonidoInicio.pause();
    sonidoInicio.currentTime = 0;
  }, 4000);

  monedaInsertada = false; // La moneda se consume en esta tirada

  let cambia_imagen = [
    "./assets/img/fresa.png",
    "./assets/img/naranja.png",
    "./assets/img/uvas.png"
  ];

  let tiempo = 0;
  let interval1 = setInterval(() => {
    let slot1 = rand(3);
    document.getElementById("slot1").innerHTML = '<img src="' + cambia_imagen[slot1] + '">';
    tiempo++;
    if (tiempo === 50) {
      clearInterval(interval1);
      let interval2 = setInterval(() => {
        let slot2 = rand(3);
        document.getElementById("slot2").innerHTML = '<img src="' + cambia_imagen[slot2] + '">';
        tiempo++;
        if (tiempo === 100) {
          clearInterval(interval2);
          let interval3 = setInterval(() => {
            let slot3 = rand(3);
            document.getElementById("slot3").innerHTML = '<img src="' + cambia_imagen[slot3] + '">';
            tiempo++;
            if (tiempo === 150) {
              clearInterval(interval3);
              verificarResultados(slot1, slot2, slot3);
            }
          }, 25);
        }
      }, 25);
    }
  }, 25);
}

// Premios según el símbolo que coincide en los 3 rodillos
const premiosPorSimbolo = [10, 20, 30]; // fresa=10, naranja=20, uvas=30

function verificarResultados(slot1, slot2, slot3) {
  let mensajeElemento = document.getElementById("mensaje");

  if (slot1 === slot2 && slot2 === slot3) {
    sonidoGanar.currentTime = 0;
    sonidoGanar.play().catch(error => console.log("Error al reproducir audio de ganar:", error));

    setTimeout(() => {
      sonidoGanar.pause();
      sonidoGanar.currentTime = 0;
    }, 3000);

    mensajeElemento.innerHTML = "Carajo, Ganaste Vuelve a apostar Seguro lo multiplicas!!!";
    const premio = premiosPorSimbolo[slot1]; 
    money += premio;
  } else {
    sonidoPerder.currentTime = 0;
    sonidoPerder.play().catch(error => console.log("Error al reproducir audio de perder:", error));

    setTimeout(() => {
      sonidoPerder.pause();
      sonidoPerder.currentTime = 0;
    }, 3000);

    mensajeElemento.innerHTML = "Oh no Perdiste, Siempre hay una Monedita de mas.";
  }
  
  DisplayMoney();
}

// Evento para insertar moneda
const btnInsertar = document.getElementById('insertarMoneda');
if (btnInsertar) {
  btnInsertar.addEventListener('click', () => {
    iniciarMusicaFondo(); 
    insertarMonedas();

    sonidocoin.currentTime = 0; 
    sonidocoin.play().catch(error => {
      console.log("Error al reproducir sonido de moneda:", error);
    });

    setTimeout(() => {
      sonidocoin.pause();
      sonidocoin.currentTime = 0;
    }, 1000);
  });
}

// Evento para el botón de tirar (si usas addEventListener en lugar de onclick en el HTML)
const btnTirar = document.getElementById('botonTirar');
if (btnTirar) {
  btnTirar.addEventListener('click', () => {
    // La función tirar() ya maneja la validación de la moneda y el sonido de inicio
    tirar();
  });
}


const modalOverlayTp = document.getElementById("modal-overlay-tp");
const btnInfoTp = document.getElementById("btn-info-tp");
const btnCerrarModalTp = document.getElementById("btn-cerrar-modal-tp");

if (btnInfoTp && modalOverlayTp) {
    btnInfoTp.addEventListener("click", () => {
        modalOverlayTp.classList.add("activo");
    });

    if (btnCerrarModalTp) {
        btnCerrarModalTp.addEventListener("click", () => {
            modalOverlayTp.classList.remove("activo");
        });
    }

    modalOverlayTp.addEventListener("click", (e) => {
        if (e.target === modalOverlayTp) {
            modalOverlayTp.classList.remove("activo");
        }
    });
}

/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/