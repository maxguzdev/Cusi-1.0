let dinero = JSON.parse(localStorage.getItem("dinero")) || 100;

// Catálogo de comida: un solo lugar con nombre/costo/imagen de cada plato,
// en vez de leerlo de data-* en el HTML. La key (empanada, choripan, etc.)
// es la que se usa para el id de los botones ("comida_" + key) y para
// guardar las cantidades.
const COMIDAS = {
    empanada: { nombre: "Empanada", costo: 8, img: "https://betos.com.ar/wp-content/uploads/2019/08/empanada-criollas.png" },
    choripan: { nombre: "Choripán", costo: 12, img: "https://i.ibb.co/84XsP9ct/Gemini-Generated-Image-56pd6056pd6056pd.png" }, //no te la puedo creer, no me di cuenta que estaba hecho con ia el chori de mierda, absolute gaga
    fideos: { nombre: "Fideos", costo: 10, img: "https://pastamiacr.com/wp-content/uploads/2024/07/spaghetti-with-bolognese-sauce-wooden-tablexa1.png" },
    milanesa: { nombre: "Milanesa", costo: 15, img: "https://elranchitosupermarket.com/wp-content/uploads/2025/01/MILANESA-DE-RES.png" },
    asado: { nombre: "Asado", costo: 50, img: "https://airescriollos.com.ar/wp-content/uploads/2020/09/Parrillada-icono.png" },
};

// Cuánta comida tenés guardada, por plato. Arranca todo en 0 y persiste
// en localStorage igual que la plata.
let inventarioComida = JSON.parse(localStorage.getItem("comida")) || {
    empanada: 0, choripan: 0, fideos: 0, milanesa: 0, asado: 0,
};

function guardarComida() {
    localStorage.setItem("comida", JSON.stringify(inventarioComida));
}

function economia() {
    const quantity = document.getElementById("value");

    if (quantity) {
        quantity.textContent = dinero;
    }
}

function guardarDinero() {
    localStorage.setItem("dinero", JSON.stringify(dinero));
    economia();
}

function gastar(costo) {
    if (costo > dinero) {
        console.log("No tenés suficiente dinero");
        return false;
    }
    dinero -= costo;
    guardarDinero();
    return true;
}

function ganarDinero(cantidad) {
    dinero += cantidad;
    guardarDinero();
    return dinero;
}

// Arma el contenido del menú de la heladera a partir de COMIDAS +
// inventarioComida. Se llama al abrir la heladera y de nuevo cada vez que
// se compra algo, para que la cantidad de cada plato se actualice sin
// tener que cerrar y volver a abrir el menú.
function renderHeladera() {
    const six = document.getElementById("food");
    if (!six) return;

    const botones = Object.entries(COMIDAS).map(([key, c]) => `
        <button id="comida_${key}" class="opcion-comida">
            <img src="${c.img}" alt="${c.nombre}">
            <span class="precio-comida">$${c.costo}</span>
            <span class="cantidad-comida">x${inventarioComida[key]}</span>
        </button>
    `).join("");

    six.innerHTML = `
        <div class="cartelera">
            <button id="salir_heladera" class="btn-secundario btn-cerrar-heladera">Salir</button>
            <p>Tenes hambre gordo?</p>
            <div class="opciones-grid">
                ${botones}
            </div>
        </div>
    `;
}

// Dibuja la bandeja de comida (estilo Pou) con lo que Cusi tiene guardado
// en la heladera para comer directo, sin pasar por el menú de compra.
// Solo muestra los platos de los que tenés al menos 1.
function renderBandejaComida() {
    const bandeja = document.getElementById("bandeja-comida");
    if (!bandeja) return; // esta página no tiene bandeja (no es cocina.php)

    const disponibles = Object.entries(COMIDAS).filter(([key]) => inventarioComida[key] > 0);

    if (disponibles.length === 0) {
        bandeja.innerHTML = `<p class="bandeja-vacia">No tenés comida guardada. Comprá en la heladera.</p>`;
        return;
    }

    bandeja.innerHTML = disponibles.map(([key, c]) => `
        <button id="tray_${key}" class="item-bandeja">
            <img src="${c.img}" alt="${c.nombre}">
            <span class="cantidad-comida">x${inventarioComida[key]}</span>
        </button>
    `).join("");
}

// Le da un plato a Cusi desde la bandeja: descuenta 1 del inventario y
// hace un pequeño bounce en el sprite de Cusi como feedback.
function comerComida(key) {
    if (!inventarioComida[key] || inventarioComida[key] <= 0) return;

    inventarioComida[key] -= 1;
    guardarComida();
    renderBandejaComida();

    const cusi = document.getElementById("cusi_a");
    if (cusi) {
        cusi.classList.remove("comiendo");
        void cusi.offsetWidth; // fuerza el reinicio de la animación si ya estaba corriendo
        cusi.classList.add("comiendo");
    }
}

// Si venimos de un minijuego con "?volver=NOMBRE" en la URL (por ejemplo
// index.html?volver=pieza), apenas carga la página se pide ese fragmento
// con irA() y se pone en #content, igual que hacen los botones del juego.
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const volverA = params.get('volver');

    if (volverA) {
        irA(`php/${volverA}.php`);

        // Sacamos el "?volver=..." de la URL para que quede como index.html
        // sola, igual que el resto del sitio (que nunca cambia la URL real,
        // solo el contenido de #content). Si no lo limpiamos, un F5 o un
        // "atrás" del navegador te devuelve siempre a pieza sin importar
        // dónde estabas navegando dentro del juego.
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

async function irA(url) {
    try {
        const response = await fetch(url, {
            method: 'POST'
        });

        if (!response.ok) throw new Error('Error en la petición');

        const html = await response.text();

        document.getElementById("content").innerHTML = html;
        economia();
        renderBandejaComida();

    } catch (error) {
        console.error('Hubo un error:', error);
    }
}

document.addEventListener('click', function (e) {
    console.log('clickeaste:', e.target.tagName, e.target.id, e.target.className); //IMPORTANTE, CUANDO EL JUEGO ESTE TERMINADO ESTA LINEA BORRARLA PARA QUE NO OCUPE MUCHA CACHE

    const id = e.target.id;

    // Comprar comida: la plata se descuenta con el mismo gastar() de
    // siempre, no hay una función de gastar aparte para la comida.
    if (id.startsWith('comida_')) {
        const key = id.replace('comida_', '');
        if (gastar(COMIDAS[key].costo)) {
            inventarioComida[key]++;
            guardarComida();
            renderHeladera();      // refresca la cantidad en el propio menú
            renderBandejaComida(); // y la bandeja de abajo, al instante
        }
        return;
    }

    // Comer desde la bandeja: no gasta plata, solo descuenta del inventario.
    if (id.startsWith('tray_')) {
        comerComida(id.replace('tray_', ''));
        return;
    }

    switch (id) {
        case 'cusi_a': {
            const deam = document.getElementById("damn");
            if (deam) {
                deam.currentTime = 0;
                deam.play().catch(error => console.log('no funciona', error));
            }

            e.target.src = "/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Cusi_enojado.png";
            setTimeout(() => {
                e.target.src = "/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Cusi.png";
            }, 700);
            break;
        }

        case 'diego': {
            const dialog1 = document.getElementById("d1");
            if (dialog1) {
                dialog1.currentTime = 0;
                dialog1.play().catch(error => console.log('no funciona', error));
            }

            e.target.src = "/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Diego_2.png";
            setTimeout(() => {
                e.target.src = "/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Diego.png";
            }, 1117);
            break;
        }

        case 'tienda': {
            // TODO: todavía sin contenido, es el mismo patrón que heladera
            // (abrir un .cartelera adentro de un contenedor) para cuando se
            // sume el catálogo de la tienda.
            const contenedor = document.getElementById("tenda");
            if (contenedor) contenedor.innerHTML = `<div class="cartelera"></div>`;
            break;
        }

        case 'heladera': {
            renderHeladera();
            break;
        }

        // Vive afuera del opciones-grid, por eso es un case aparte del "opt_6".
        case 'salir_heladera': {
            const contenedor = document.getElementById("food");
            if (contenedor) contenedor.innerHTML = "";
            break;
        }

        case 'leo': {
            const dialogL = document.getElementById("dL");
            if (dialogL) {
                dialogL.addEventListener('ended', () => {
                    const cartel = document.getElementById("cartel");
                    if (cartel) {
                        cartel.innerHTML = `
                            <div class="cartel-pregunta">
                                <p>¿Querés jugar?</p>
                                <a href="/Cusi-1.0/minijuegoss/dino/index.html">
                                <button id="btn_si">Sí</button>
                                </a>
                                <button id="btn_no">No</button>
                            </div>
                        `;
                    }
                }, { once: true });

                dialogL.currentTime = 0;
                dialogL.play().catch(error => console.log('no funciona', error));
            }

            e.target.src = "/CUSI-1.0/frontEnd/Cusi_style/bat_scr/leo_2.png";
            setTimeout(() => {
                e.target.src = "/CUSI-1.0/frontEnd/Cusi_style/bat_scr/leo.png";
            }, 2117);
            break;
        }

        case 'btn_no': {
            const cartel = document.getElementById("cartel");
            const poldos = document.getElementById("leo");
            const dialogL2 = document.getElementById("dL2");

            if (cartel) cartel.innerHTML = "";
            if (dialogL2) {
                dialogL2.currentTime = 0;
                dialogL2.play().catch(error => console.log('no funciona', error));
            }
            if (poldos) poldos.src = "/CUSI-1.0/frontEnd/Cusi_style/bat_scr/leo_3.png";
            break;
        }

        case 'pablo': {
            const dialog2 = document.getElementById("d2");
            if (dialog2) {
                dialog2.currentTime = 0;
                dialog2.play().catch(error => console.log('no funciona', error));
            }

            e.target.src = "/CUSI-1.0/frontEnd/Cusi_style/garden-scr/pablo.gif";
            setTimeout(() => {
                e.target.src = "/CUSI-1.0/frontEnd/Cusi_style/garden-scr/pablo_a.png";
            }, 3780);
            break;
        }

        case 'huerta': {
            const cartel = document.getElementById("cartela");
            if (cartel) {
                cartel.innerHTML = `
                    <div class="cartelera">
                       <p>Seleccioná una opción:</p>
                        <div class="opciones-grid">
                            <button id="opt_1">Opción 1</button>
                            <button id="opt_2">Opción 2</button>
                            <button id="opt_3">Opción 3</button>
                            <button id="opt_4">Opción 4</button>
                            <button id="opt_5">Opción 5</button>
                            <button id="opt_6">Cancelar</button>
                        </div>
                    </div>
                `;
            }
            break;
        }

        case 'opt_6': {
            const cartel = document.getElementById("cartela");
            if (cartel) cartel.innerHTML = "";
            break;
        }

        case 'minijuegos': {
            const cartel = document.getElementById("cartelbi");
            if (cartel) {
                cartel.innerHTML = `
                    <div id="cartelera">
                       <p>Seleccioná un minijuego:</p>
                        <div class="opciones">
                            <a href="/Cusi-1.0/minijuegoss/bm/buscaminitas.php">
                            <button class="opcion-buscaminas"><span class="etiqueta-juego">Buscaminas</span></button>
                              </a>
                            <a href="/Cusi-1.0/minijuegoss/blackjack/index.html">
                            <button class="opcion-blackjack"><span class="etiqueta-juego">Blackjack</span></button>
                              </a>
                            <a href="/Cusi-1.0/minijuegoss/ruleta/index.html">
                            <button class="opcion-ruleta"><span class="etiqueta-juego">Ruleta</span></button>
                              </a>
                              <a href="/Cusi-1.0/minijuegoss/tragaperras/index.html">
                            <button class="opcion-tragaperras"><span class="etiqueta-juego">Tragaperras</span></button>
                              </a>
                               <a href="/Cusi-1.0/minijuegoss/flappy pablo/index.html">
                            <button class="opcion-pablo"><span class="etiqueta-juego">Flappy Pablo</span></button>
                              </a>
                              <a href="/Cusi-1.0/minijuegoss/cusis_band/cband.html">
                            <button class="opcion-banda"><span class="etiqueta-juego">Cusi´s Band</span></button>
                              </a>
                               <a href="/Cusi-1.0/minijuegoss/snake/index.html">
                            <button class="opcion-snake"><span class="etiqueta-juego">Snake</span></button>
                              </a>
                            <a href="/Cusi-1.0/minijuegoss/reparaware/index.html">
                            <button class="opcion-pc"><span class="etiqueta-juego">Reparaware</span></button>
                              </a>
                        </div>
                    </div>
                `;
            }
            break;
        }
    }
});