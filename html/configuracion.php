<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuracion</title>
    <link rel="stylesheet" href="css/confi.css">
</head>
<body>
    <a href="index.php">
  <button id="volver" class="botonvolver" >volver</button> 
  </a>
  <div class="fotoper">
  <img id="mi-imagen" width="225px" src="https://static.wikia.nocookie.net/youjo-senki-saga-of-tanya-the-evil/images/0/04/Tanya_Manga.jpg/revision/latest/scale-to-width/360?cb=20220408140333&path-prefix=es" alt="Imagen actual">
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

</body>
<script src="js/conf.js">
</script>
</html>