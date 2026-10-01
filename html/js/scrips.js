
  async function irA(url) {
            
            try {
                const response = await fetch(url, {
                    method: 'POST' 
                });

                if (!response.ok) throw new Error('Error en la petición');

                const html = await response.text();
                
                document.getElementById("content").innerHTML = html;

            } catch (error) {
                console.error('Hubo un error:', error);
            }    
        } 
let listadetextos = JSON.parse(localStorage.getItem("text")) || [];

function limpiar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function renderizarComentarios() {
    const contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";

    listadetextos.forEach(texto => {
        contenedor.innerHTML += `
            <div class="tweetcard">
                <div class="tweetheader">
                    <img src="${limpiar(userSession.img)}" class="avatar" alt="Avatar">
                    <div>
                        <span class="name">${limpiar(userSession.nombre)}</span>
                        <span class="gmail">${limpiar(userSession.correo)}</span>
                    </div>
                </div>
                <div class="textito">${limpiar(texto)}</div>
            </div>`;
    });
}

function cambiartexto() {
    const input = document.getElementById("newtext");
    const texto = input.value.trim();

    if (texto === "") return;

    listadetextos.push(texto);
    localStorage.setItem("text", JSON.stringify(listadetextos));
    renderizarComentarios();
    input.value = "";
}

renderizarComentarios();

let estados = JSON.parse(localStorage.getItem("estados")) || [];
 
function guardarEstados() {
    localStorage.setItem("estados", JSON.stringify(estados));
}
 
function sincronizarEstados() {
    while (estados.length < listadetextos.length) {
        estados.push({ like: false, guardado: false });
    }
    estados.length = listadetextos.length;
}
 
function agregarAcciones() {
    sincronizarEstados();
 
    document.querySelectorAll("#contenedor .tweetcard").forEach((card, i) => {
        const e = estados[i];
 
        card.insertAdjacentHTML("beforeend", `
            <div class="acciones">
                <button class="btn-accion btn-like ${e.like ? "activo" : ""}" data-accion="like" title="Me gusta">
                    <i class="${e.like ? "fa-solid" : "fa-regular"} fa-heart"></i>
                </button>
                <button class="btn-accion btn-guardado ${e.guardado ? "activo" : ""}" data-accion="guardado" title="Guardados">
                    <i class="${e.guardado ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
                    <span>Guardados</span>
                </button>
                <button class="btn-accion btn-borrar" data-accion="borrar" title="Borrar">
                    <i class="fa-solid fa-trash"></i>
                    <span>Borrar</span>
                </button>
            </div>`);
    });
}
 
const renderOriginal = renderizarComentarios;
renderizarComentarios = function () {
    renderOriginal();
    agregarAcciones();
};
 
document.getElementById("contenedor").addEventListener("click", e => {
    const boton = e.target.closest("button[data-accion]");
    if (!boton) return;
 
    const cards = Array.from(document.querySelectorAll("#contenedor .tweetcard"));
    const i = cards.indexOf(boton.closest(".tweetcard"));
    const accion = boton.dataset.accion;
 
    if (accion === "borrar") {
        listadetextos.splice(i, 1);   
        estados.splice(i, 1);        
        localStorage.setItem("text", JSON.stringify(listadetextos));
    } else {
        estados[i][accion] = !estados[i][accion];
    }
 
    guardarEstados();
    renderizarComentarios();
});

