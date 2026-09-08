
<?php require_once "../co_up.php"; ?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Sign Up</title>
     
    <link rel="stylesheet" href="../css/style.css">
     <link rel="icon" href="../img/favicon_cusix.png" type="image/png">
</head>

<body>
    <div class="card">
        <h2>Crear Cuenta</h2>

        <?php if (!empty($mensaje)) echo $mensaje; ?>

        <form action="" method="POST">
            <div>
                <label for="name">Nombre completo:</label><br>
                <input type="text" id="name" name="nombre_perfil" required placeholder="Pablo Frisela">
            </div>
            <br>

            <div>
                <label for="email">Correo electrónico:</label><br>
                <input type="email" id="email" name="correo" required placeholder="ejemplo@correo.com">
            </div>
            <br>

            <div>
                <label for="password">Contraseña:</label><br>
                <input type="password" id="password" name="contraseña" required minlength="6">
            </div>
            <br>
            <input type="submit" name="registro" value="Registrar">
        </form>
        <p>¿Ya tienes cuenta? <a href="SignIn.php">Ingresar</a></p>
    </div>

</body>

</html>
