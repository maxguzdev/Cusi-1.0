<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>sing up</title>
    <link rel="stylesheet" href="../css/style.css">
     <link rel="icon" href="../img/favicon_cusix.png" type="image/png">
</head>

<body>
    <div class="card">
        <h2>Crear Cuenta</h2>

        <form action="/registro" method="POST">
            <div>
                <label for="name">Nombre completo:</label><br>
                <input type="text" id="name" name="name" required placeholder="Pablo Frisela">
            </div>
            <br>

            <div>
                <label for="email">Correo electrónico:</label><br>
                <input type="email" id="email" name="email" required placeholder="ejemplo@correo.com">
            </div>
            <br>

            <div>
                <label for="password">Contraseña:</label><br>
                <input type="password" id="password" name="password" required minlength="6">
            </div>
            <br>
            <button type="submit">Registrarse</button>
        </form>
        <p>¿Ya tienes cuenta? <a href="SignIn.php">Ingresar</a></p>
    </div>


</body>

</html>