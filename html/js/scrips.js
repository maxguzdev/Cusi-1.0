  
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

// Convierte texto en HTML seguro (evita XSS)
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