  
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
function renderizarComentarios() {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    contenedor.innerHTML = ""; 

    listadetextos.forEach(texto => {
        let tweetCard = document.createElement("div");
        tweetCard.className = "tweetcard";

        tweetCard.innerHTML = `
            <div class="tweetheader">
                <img src="${userSession.img}" class="avatar" alt="Avatar">
                <div>
                    <span class="name">${userSession.nombre}</span>
                    <span class="gmail">${userSession.correo}</span>
                </div>
            </div>
            <div class="textito">${texto}</div>
        `;

        contenedor.appendChild(tweetCard);
    });
}


renderizarComentarios();

function cambiartexto() {
    let input = document.getElementById("newtext");
    if (!input) return;

    let x = input.value.trim();

    if (x !== "") {
        listadetextos.push(x); 
        localStorage.setItem("text", JSON.stringify(listadetextos));
        
        renderizarComentarios(); 
        input.value = ""; 
    }
}
