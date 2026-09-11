let dinero = JSON.parse(localStorage.getItem("dinero")) || 67;

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

async function irA(url) {
    try {
        const response = await fetch(url, {
            method: 'POST'
        });

        if (!response.ok) throw new Error('Error en la petición');

        const html = await response.text();

        document.getElementById("content").innerHTML = html;
        economia();

    } catch (error) {
        console.error('Hubo un error:', error);
    }
}

document.addEventListener('click', function (e) {
    console.log('clickeaste:', e.target.tagName, e.target.id, e.target.className); //IMPORTANTE, CUANDO EL JUEGO ESTE TERMINADO ESTA LINEA BORRARLA PARA QUE NO OCUPE MUCHA CACHE

    switch (e.target.id) {
        case 'cusi_a': {
            const deam = document.getElementById("damn");
            const cusi = document.getElementById("cusi_a");

            if (deam) {
                deam.currentTime = 0;
                deam.play().catch(error => console.log('no funciona', error));
            }

            if (cusi) {
                cusi.src = "/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Cusi_enojado.png";

                setTimeout(() => {
                    cusi.src = "/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Cusi.png";
                }, 700);
            }
            break;
        }

        case 'diego': {
            const dialog1 = document.getElementById("d1");
            const diego = document.getElementById("diego");

            if (dialog1) {
                dialog1.currentTime = 0;
                dialog1.play().catch(error => console.log('no funciona', error));
            }

            if (diego) {
                diego.src = "/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Diego_2.png";

                setTimeout(() => {
                    diego.src = "/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Diego.png";
                    gastar(10);
                    guardarDinero();
                }, 1117);
            }
            break;
        }

        case 'leo': {
            const dialogL = document.getElementById("dL");
            const poldo = document.getElementById("leo");

            if (dialogL) {
                dialogL.addEventListener('ended', () => {
                    const cartel = document.getElementById("cartel");

                    if (cartel) {
                        cartel.innerHTML = `
                            <div class="cartel-pregunta">
                                <p>¿Querés jugar?</p>
                                <a href="https://www.bandomovil.com/elespinar/534994">
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

            if (poldo) {
                poldo.src = "/CUSI-1.0/frontEnd/Cusi_style/bat_scr/leo_2.png";

                setTimeout(() => {
                    poldo.src = "/CUSI-1.0/frontEnd/Cusi_style/bat_scr/leo.png";
                }, 2117);
            }
            break;
        }

        case 'btn_no': {
            const cartel = document.getElementById("cartel");
            const poldos = document.getElementById("leo");
            const dialogL2 = document.getElementById("dL2");
            if (cartel) {
                cartel.innerHTML = "";
            }
            if (dialogL2) {
                dialogL2.currentTime = 0;
                dialogL2.play().catch(error => console.log('no funciona', error));
            }
            poldos.src = "/CUSI-1.0/frontEnd/Cusi_style/bat_scr/leo_3.png";
            break;
        }

        case 'kanep': {
            const dialog2 = document.getElementById("d2");
            const kanep = document.getElementById("kanep");

            if (dialog2) {
                dialog2.currentTime = 0;
                dialog2.play().catch(error => console.log('no funciona', error));
            }

            if (kanep) {
                kanep.src = "/CUSI-1.0/frontEnd/Cusi_style/garden-scr/kangif.gif";

                setTimeout(() => {
                    kanep.src = "/CUSI-1.0/frontEnd/Cusi_style/garden-scr/kanep_a.png";
                }, 3780);
            }
            break;
        }

        case 'huerta': {
            const huerta = document.getElementById("huerta");

            if (huerta) {
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
            }
            break;
        }

        case 'opt_6': {
            const cancel = document.getElementById("opt_6");
            const cartel = document.getElementById("cartela");
            if (cancel && cartel) {
                cartel.innerHTML = "";
            }
            break;
        }
        case 'minijuegos': {
            const mini = document.getElementById("minijuegos");

            if (mini) {
                const cartel = document.getElementById("cartelbi");
                if (cartel) {
                    cartel.innerHTML = `
                            <div class="cartelera">
                               <p>Seleccioná un minijuego:</p>
                        <div class="opciones">
                        <a href="\Cusi-1.0\minijuegos\buscaminas\buscam.html">
                                <button id=""></button>
                                </a>
                            <button id=""></button>
                            <button id=""></button>
                            <button id=""></button>
                            <button id=""></button>
                            <button id=""></button>
                            <button id=""></button>
                        </div>
                            </div>
                        `;
                }
            }
            break;
        }

    }
});
