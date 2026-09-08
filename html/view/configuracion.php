<?php require_once "../confi_bd.php"; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuracion</title>
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../css/confi.css">
     <link rel="icon" href="../img/favicon_cusix.png" type="image/png">
</head>
<body>
    <a href="index.php">
  <button id="volver" class="botonvolver" >volver</button> 
  </a>
  <div class="fotoper">
  <img id="mi-imagen" width="225px" src="../img/perfildefault.png" >
  <button id="cambiar">cambiar imagen</button>
</div>
<div class="info">
<h1>Nombre:</h1><input type="text">
<h1>Biografia:</h1><input type="text">
</div>
<label for="genero">elije tu genero:</label>

<select id="genero" class="gener" name="elije tu genero">
  <option value="hombre">hombre</option>
  <option value="boliviano">boliviano</option>
  <option value="sixsevenbaby">sixsevenbaby</option>
  <option value="mujer">mujer</option>
  <option value="helicoptero apache">helicoptero apache</option>
  <option value="chino">chino</option>
</select>
<div class="social-footer">
            <p style="color: var(--text-secondary); margin-bottom: 0;">Seguinos en nuestras redes:</p>
            <div class="social-links">
                <a href="https://www.instagram.com/epic.goy/?hl=es" class="instagram" target="_blank" title="Instagram">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="https://x.com/EPICGOYx?lang=es" class="twitter" target="_blank" title="Twitter / X">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="https://www.youtube.com/channel/UCqSgcuopIPHZb3LUp_5lTxw" class="youtube" target="_blank" title="YouTube">
                    <i class="fab fa-youtube"></i>
                </a>
            </div>
        </div>
</body>
<script src="../js/conf.js">
</script>
</html>