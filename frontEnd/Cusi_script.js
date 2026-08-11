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


const cusi = document.getElementById("cusi_a")
const deam = document.getElementById("damn")
function cusiQ() {
    cusi.addEventListener('click', function(){
        deam.currentTime = 0;
        deam.play().catch(error=>{
            console.log("no funciona");
        })
    })
}