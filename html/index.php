<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css/css.css">
</head>

<body>
    <div class="perfil">
        <img src="https://static.wikia.nocookie.net/youjo-senki-saga-of-tanya-the-evil/images/0/04/Tanya_Manga.jpg/revision/latest/scale-to-width/360?cb=20220408140333&path-prefix=es"
            class="img-perfil">
            
            <label for="subir-foto">Cambiar foto</label>
        <input type="file" id="subir-foto" accept="image/png, image/jpeg, image/webp">
        <a href="SignUp.php">
            <button id="signup">SIGN UP</button></a>
        <a href="SignIn.php">
            <button id="signin">SIGN IN</button></a>
    </div>
    <div class="botones">
        <button id="boton" onclick="cambiartexto()">Enter</button>
        <input type="text" id="newtext" placeholder="escribe tu nuevo texto">
    </div>
    <div id="contenedor" class="textito"></div>

    <script >

        let listadetextos = JSON.parse(localStorage.getItem("text")) || [];
        document.getElementById("contenedor").textContent = listadetextos.join(", ");

        function cambiartexto() {
            let input = document.getElementById("newtext");

            let x = input.value;

            listadetextos.push(x);

            localStorage.setItem("text", JSON.stringify(listadetextos));

            let newtext = JSON.parse(localStorage.getItem("text"));

            document.getElementById("contenedor").textContent = newtext.join(", ");

            input.value = "";
        }
    </script>
    <link rel="stylesheet" href="">
</body>

</html>