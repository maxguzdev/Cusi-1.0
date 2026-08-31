  async function irA(url) {
        //alert(url);
            
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
        }  //php a pelo
