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

    <!-- HUD de monedas, fijo en la esquina superior izquierda de la pantalla -->
    <div class="cusimios-hud">
        <img src="/Cusi-1.0/frontEnd/Cusi_style/cusimios.png" class="icono-moneda-hud">
        <span id="value"></span>
    </div>

    <div class="main">

        <aside class="seccion-dificultad">
            <p class="titulo-dificultad">DIFICULTAD</p>
            <div class="cusis-columna">
                <div class="opcion-dificultad opcion-facil">
                    <span class="etiqueta">FÁCIL</span>
                    <img src="/Cusi-1.0/frontEnd/Cusi_style/CUSI_skins/kanep.png" width="200px" class="btn-dificultad" id="fac" data-tamano="8" data-bombas="10">
                </div>
                <div class="opcion-dificultad opcion-media">
                    <span class="etiqueta">MEDIO</span>
                    <img src="/Cusi-1.0/frontEnd/Cusi_style/CUSI_skins/arev.png" width="200px" class="btn-dificultad" id="med" data-tamano="10" data-bombas="20">
                </div>
                <div class="opcion-dificultad opcion-dificil">
                    <span class="etiqueta">DIFÍCIL</span>
                    <img src="/Cusi-1.0/frontEnd/Cusi_style/CUSI_skins/ares.png" width="200px" class="btn-dificultad" id="dif" data-tamano="12" data-bombas="35">
                </div>
            </div>
        </aside>

        <section class="contenedor-juego">
            <div class="header">
                <a href="../../frontEnd/index.html?volver=pieza" class="btn-header" id="btn-volver"><img src="/Cusi-1.0/frontEnd/Cusi_style/left.png" width="70"></a>
                <h1>BUSCAMINAS</h1>
                <div class="header-botones">
                    <button id="btn-restart" class="btn-header"><img src="img/restart.png"></button>
                    <button id="btn-info" class="btn-header"><img src="img/info.png"></button>
                </div>
            </div>

            <div class="contador-banderas">
                <span class="contador-icono">🚩</span>
                <span>Colocadas: <span id="num-banderas"></span></span>
                <span class="separador">·</span>
                <span>Faltan: <span id="banderas-restantes"></span></span>
            </div>

            <div class="placeholder-inicial" id="placeholder">
                <p>📋 Selecciona dificultad para jugar</p>
            </div>

            <div class="juego"></div>
            <div class="resultado-juego"></div>
        </section>
    </div>

    <!-- Modal de Info (Cómo Jugar) -->
    <div class="modal-overlay" id="modal-overlay">
        <div class="modal-contenido">
            <button class="modal-cerrar" id="btn-cerrar-modal">✕</button>
            <h2>Cómo Jugar al Buscaminas</h2>
            <div class="modal-body">
                <div class="instruccion">
                    <h3>🎯 Objetivo</h3>
                    <p>Abre todas las casillas que NO contienen bombas sin pisar ninguna.</p>
                </div>
                <div class="instruccion">
                    <h3>🖱️ Controles</h3>
                    <ul>
                        <li><strong>Click izquierdo:</strong> Abre una casilla</li>
                        <li><strong>Click derecho (o tap largo):</strong> Coloca/quita una bandera 🚩</li>
                        <li><strong>Doble click:</strong> Si ya abriste una casilla con número, abre alrededor automáticamente</li>
                    </ul>
                </div>
                <div class="instruccion">
                    <h3>🔢 Los Números</h3>
                    <p>Cada número indica cuántas bombas hay en las 8 casillas alrededor.</p>
                </div>
                <div class="instruccion">
                    <h3>🚩 Las Banderas</h3>
                    <p>Usa banderas para marcar dónde crees que están las bombas. ¡Pero no te equivoques!</p>
                </div>
                <div class="instruccion">
                    <h3>⚡ Primer Click</h3>
                    <p>El primer click SIEMPRE cae en zona segura, así no pierdes en el primer intento.</p>
                </div>
                <div class="instruccion">
                    <h3>🎖️ Victoria</h3>
                    <p>Ganas cuando abres todas las casillas sin bomba Y marcas correctamente todas las bombas.</p>
                </div>
            </div>
        </div>
    </div>

    <script src="../../frontEnd/js/Cusi_script.js"></script>
    <script src="buscaminitas.js"></script>
</body>

</html>