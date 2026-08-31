<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css/css.css">
</head>

<body>
    <div class="botones">
        <button id="boton" class="postito" onclick="cambiartexto()">POSTEAR</button>
        <input type="text" id="newtext" class="newtext" placeholder="¿Como anda la muchachada?">
    </div>
    <div id="contenedor" class="textito"></div>
<nav class="sidebar">
  <div class="perfil">
        <img src="https://static.wikia.nocookie.net/youjo-senki-saga-of-tanya-the-evil/images/0/04/Tanya_Manga.jpg/revision/latest/scale-to-width/360?cb=20220408140333&path-prefix=es"
            class="img-perfil">
        <a href="SignUp.php">
            <button id="signup">SIGN UP</button></a>
        <a href="SignIn.php">
            <button id="signin">SIGN IN</button></a>
    </div>
  <ul>
    <li><a href="#inicio" class="active">Inicio</a></li>
    <li><a href="configuracion.php">Configuración</a></li>
  </ul>
</nav>
    <script src="js/scrips.js"></script>
    <link rel="stylesheet" href="">
</body>

</html>