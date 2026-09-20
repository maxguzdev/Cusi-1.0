document.addEventListener('mouseover', function (e) {

    switch (e.target.id) {
        case 'musico-kanep': {
            const kanep = document.getElementById("musico-kanep");

            if (kanep)
                kanep.src = "/CUSI-1.0/minijuegoss/cusis_band/style/img/kangif2.gif";
            document.addEventListener('mouseout', function () {
                if (kanep)
                    kanep.src = "/CUSI-1.0/minijuegoss/cusis_band/style/img/kanep_guitar.png"
            }, { once: true });
            break;
        }
        case 'musico-lisandro': {
            const chicha = document.getElementById("musico-lisandro");

            if (chicha){
                chicha.src = "/CUSI-1.0/minijuegoss/cusis_band/style/img/chif1.gif";
                setTimeout(() => {
                    chicha.src = "/CUSI-1.0/minijuegoss/cusis_band/style/img/lisandro_bate2.png";
                }, 200);}
            document.addEventListener('mouseout', function () {
                if (chicha){
                    chicha.src = "/CUSI-1.0/minijuegoss/cusis_band/style/img/chif2.gif";
                setTimeout(() => {
                    chicha.src = "/CUSI-1.0/minijuegoss/cusis_band/style/img/lisandro_bate.png";
                }, 200);}}
            , { once: true });
            break;
        }

        case 'musico-cusi': {
            const cusi = document.getElementById("musico-cusi");

            if (cusi){
                cusi.src = "/CUSI-1.0/minijuegoss/cusis_band/style/img/cusif1.gif";
                setTimeout(() => {
                    cusi.src = "/CUSI-1.0/minijuegoss/cusis_band/style/img/cusi2.png";
                }, 500);}
            document.addEventListener('mouseout', function () {
                if (cusi){
                    cusi.src = "/CUSI-1.0/minijuegoss/cusis_band/style/img/cusif2.gif";
                setTimeout(() => {
                    cusi.src = "/CUSI-1.0/minijuegoss/cusis_band/style/img/cusi_bass.png";
                }, 500);}}
            , { once: true });
            break;
        }
    }

});