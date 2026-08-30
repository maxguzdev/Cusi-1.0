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
        document.getElementById("contenedor").textContent = listadetextos.join(", ");

        function cambiartexto() {
            let input = document.getElementById("newtext");

            let x = input.value;

            listadetextos.push(x);

            localStorage.setItem("text", JSON.stringify(listadetextos));

            let newtext = JSON.parse(localStorage.getItem("text"));

            document.getElementById("contenedor").textContent = newtext.join(", ");

            input.value = "";
        }