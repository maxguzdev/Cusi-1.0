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


document.addEventListener('click', function (e) {
    if (e.target.id == 'cusi_a') {
        const deam = document.getElementById("damn");
        const cusi = document.getElementById("cusi_a");

        deam.currentTime = 0;
        deam.play().catch(error => console.log('no funciona', error));

        cusi.src = "/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Cusi_enojado.png";

        // Vuelve a los 1000ms (1 segundo)
        setTimeout(() => {
            cusi.src = "/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Cusi.png";
        }, 700);
    }
});