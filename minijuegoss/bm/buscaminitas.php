<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cusi - Buscaminas</title>
    <link rel="stylesheet" href="buscaminitas.css">
    <link rel="icon" href="/Cusi-1.0/frontEnd/Cusi_style/favicon_cusi.png" type="image/png">
</head>

<body>
    


    <div class="main"> 
        <div class="seccion-dificultad">
                <p class="titulo-dificultad">DIFICULTAD:</p>
                <div class="cusis-columna">
                    <img src="/Cusi-1.0/frontEnd/Cusi_style/CUSI_skins/kanep.png" width="200px" class="btn-dificultad" data-tamano="8" data-bombas="10">
                    <img src="/Cusi-1.0/frontEnd/Cusi_style/CUSI_skins/arev.png" width="200px" class="btn-dificultad" data-tamano="10" data-bombas="20">
                    <img src="/Cusi-1.0/frontEnd/Cusi_style/CUSI_skins/ares.png" width="200px" class="btn-dificultad" data-tamano="12" data-bombas="35">
                </div>
            </div>
        <div class="contenedor-juego">
            <div class="header">
            <h1>BUSCAMINAS</h1>
        </div> 
        <h2>Banderas colocadas: <span id="num-banderas"></span> (faltan <span id="banderas-restantes"></span>)</h2>
            <div class="juego"></div>
            <div class="resultado-juego"></div>
        </div>
    </div>
    <script src="buscaminitas.js"></script>
</body>

</html>
           