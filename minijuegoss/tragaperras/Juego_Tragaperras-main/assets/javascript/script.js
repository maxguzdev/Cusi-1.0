/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/

let creditos = 67;

function insertarMonedas() {
  creditos++;
  document.getElementById("cuentaCreditos").innerHTML = creditos + "<span style='color: red; font-size: smaller;'> +1 </span>";
  document.getElementById("mensaje").innerHTML = "Let's Go Gambling";
}

function rand(n) {
  return Math.floor(Math.random() * n);
}

function tirar() {
  if (creditos === 0) {
    document.getElementById("mensaje").innerHTML = "Oh no perdiste tu casa, Roba dinero y Vuelve.";
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

const sonidoGanar = new Audio('./assets/song/win.mp3');
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
      "Carajo, Ganaste Vuelve a apostar Seguro lo multiplicas!!! Tienes: " + creditos + " monedas";
    creditos = creditos + 10;
  } else {
    sonidoPerder.currentTime = 0;
    sonidoPerder.play().catch(error => console.log("Error al reproducir audio de perder:", error));

    setTimeout(() => {
      sonidoPerder.pause();
      sonidoPerder.currentTime = 0;
    }, 3000);

    mensajeElemento.innerHTML =
      "Oh no Perdiste, Siempre hay una Monedita de mas. Tienes: " + creditos + " monedas";
    if (creditos > 0) {
      creditos--;
    }
  }
  document.getElementById("cuentaCreditos").innerHTML = creditos;
}

const sonidoInicio = new Audio('./assets/song/maquinitainicio.mp3');

document.getElementById('botonTirar').addEventListener('click', () => {
  sonidoInicio.currentTime = 0; 
  sonidoInicio.play().catch(error => {
    console.log("No Funciono:", error);
  });

  setTimeout(() => {
    sonidoInicio.pause();
    sonidoInicio.currentTime = 0;
  }, 4000);
});

const sonidocoin = new Audio('./assets/song/moneda.mp3');

document.getElementById('insertarMoneda').addEventListener('click', () => {
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