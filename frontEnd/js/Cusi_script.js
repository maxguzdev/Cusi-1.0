let dinero = 67;
function economia() {
    const quantity = document.getElementById("value");

    if (quantity) {
        quantity.textContent = dinero;
    }
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
        case 'cusi_a':{
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
            break;}

        case 'diego':{
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
                    dinero--;
                    economia();
                }, 1117);
            }
            break;}

        case 'leo':{
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
            break;}

        case 'btn_no':{
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
            break;}

        case 'kanep':{
            const kanepImg = document.getElementById("kanep");

            if (kanepImg) {
                const ancho = kanepImg.clientWidth || 200;
                const alto = kanepImg.clientHeight || "auto";

                kanepImg.style.display = "none";

                const kanVideo = document.createElement("video");
                kanVideo.src = "/CUSI-1.0/frontEnd/Cusi_style/garden-scr/video_prueba.mp4";
                kanVideo.style.width = typeof ancho == 'number' ? `${ancho}px` : ancho;
                if (alto !== "auto") kanVideo.style.height = `${alto}px`;
                kanVideo.style.position = "absolute";
                kanVideo.style.top = "160px";
                kanVideo.style.left = "150px";


                kanepImg.parentNode.insertBefore(kanVideo, kanepImg);

                kanVideo.play().catch(error => console.log('Error al reproducir video:', error));

                kanVideo.addEventListener('ended', () => {
                    kanVideo.remove();
                    kanepImg.style.display = "inline";
                });
            }
            break;}

        case 'huerta':{
            const huerta = document.getElementById("huerta");

            if (huerta) {
                const cartel = document.getElementById("cartela");
                if (cartel) {
                    cartel.innerHTML = `
                            <div class="cartel-huerta">
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
            break;}

        case 'opt_6': {
            const cancel = document.getElementById("opt_6");
            const cartel = document.getElementById("cartela");
            if (cancel && cartel) {
                cartel.innerHTML = "";
            }
            break;
        }
        

    }
});
