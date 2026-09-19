/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/

let money = (typeof dinero !== 'undefined') ? dinero : 50;

function DisplayMoney() {
    // Sincroniza el dinero con el estado global (Cusi_script.js)
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

// --- MOSTRAR LOS CRÉDITOS AL CARGAR LA PÁGINA ---
document.addEventListener("DOMContentLoaded", () => {
  DisplayMoney();
});

function insertarMonedas() {
  money++;
  DisplayMoney();
  document.getElementById("cuentaCreditos").innerHTML = money + "<span style='color: red; font-size: smaller;'> +1 </span>";
  document.getElementById("mensaje").innerHTML = "Let's Go Gambling";
}

function rand(n) {
  return Math.floor(Math.random() * n);
}

function tirar() {
  if (money === 0) {
    document.getElementById("mensaje").innerHTML = "Oh no perdiste tu casa, ¡inténtalo de nuevo!";
    return;
  }

  let cambia_imagen = [
    "./assets/img/fresa.png",
    "./assets/img/naranja.png",
    "./assets/img/uvas.png"
  ];

  let tiempo = 0;
  let interval1 = setInterval(() => {
    let slot1 = rand(3);
    document.getElementById("slot1").innerHTML =
      '<img src="' + cambia_imagen[slot1] + '">';
    tiempo++;
    if (tiempo === 50) {
      clearInterval(interval1);
      let interval2 = setInterval(() => {
        let slot2 = rand(3);
        document.getElementById("slot2").innerHTML =
          '<img src="' + cambia_imagen[slot2] + '">';
        tiempo++;
        if (tiempo === 100) {
          clearInterval(interval2);
          let interval3 = setInterval(() => {
            let slot3 = rand(3);
            document.getElementById("slot3").innerHTML =
              '<img src="' + cambia_imagen[slot3] + '">';
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

const sonidoGanar = new Audio('./assets/song/win2.mp3');
const sonidoPerder = new Audio('./assets/song/lose2.mp3');

function verificarResultados(slot1, slot2, slot3) {
  let mensajeElemento = document.getElementById("mensaje");

  if (slot1 === slot2 && slot2 === slot3) {
    sonidoGanar.currentTime = 0;
    sonidoGanar.play().catch(error => console.log("Error al reproducir audio de ganar:", error));

    setTimeout(() => {
      sonidoGanar.pause();
      sonidoGanar.currentTime = 0;
    }, 3000);

    mensajeElemento.innerHTML =
      "Carajo, Ganaste Vuelve a apostar Seguro lo multiplicas!!!";
    money += 10;
  } else {
    sonidoPerder.currentTime = 0;
    sonidoPerder.play().catch(error => console.log("Error al reproducir audio de perder:", error));

    setTimeout(() => {
      sonidoPerder.pause();
      sonidoPerder.currentTime = 0;
    }, 3000);

    mensajeElemento.innerHTML =
      "Oh no Perdiste, Siempre hay una Monedita de mas.";
    if (money > 0) {
      money--;
    }
  }
  
  DisplayMoney();
}

const sonidoFondo = new Audio('./assets/song/fondosong.mp3');
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

const sonidoInicio = new Audio('./assets/song/maquinitainicio.mp3');

document.getElementById('botonTirar').addEventListener('click', () => {
  iniciarMusicaFondo();

  if (money > 0) {
    sonidoInicio.currentTime = 0; 
    sonidoInicio.play().catch(error => {
      console.log("No Funciono:", error);
    });

    setTimeout(() => {
      sonidoInicio.pause();
      sonidoInicio.currentTime = 0;
    }, 4000);
  }
});

const sonidocoin = new Audio('./assets/song/moneda.mp3');

document.getElementById('insertarMoneda').addEventListener('click', () => {
  iniciarMusicaFondo(); 

  sonidocoin.currentTime = 0; 
  sonidocoin.play().catch(error => {
    console.log("No Funciono:", error);
  });

  setTimeout(() => {
    sonidocoin.pause();
    sonidocoin.currentTime = 0;
  }, 1000);
});

/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/