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
    console.log('clickeaste:', e.target.tagName, e.target.id, e.target.className);

    switch (e.target.id) {
        case 'cusi_a':
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

        case 'diego':                                          
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
                }, 1117);
            }
            break;
            
        case 'leo':                                          
            const dialogL = document.getElementById("dL");
            const poldo = document.getElementById("leo");

            if (dialogL) {
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
});