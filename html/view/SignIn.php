<?php require_once "../co_in.php"; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Sign In</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" href="../img/favicon_cusix.png" type="image/png">
</head>
<body>
    <div class="card">
        <h2>Iniciar Sesión</h2>

        <!-- Muestra el mensaje si las credenciales fallan o faltan -->
        <?php if (!empty($mensaje)) echo $mensaje; ?>

        <form action="" method="POST">
            <div>
                <label for="email">Correo electrónico:</label><br>
                <input type="email" id="email" name="correo" required placeholder="ejemplo@correo.com">
            </div>
            <br>

            <div>
                <label for="password">Contraseña:</label><br>
                <input type="password" id="password" name="contrasena" required>
            </div>
            <br>

            <button type="submit" name="ingresar">Ingresar</button>
        </form>

        <p>¿No tienes cuenta? <a href="SignUp.php">Regístrate</a></p>
    </div>
</body>
</html>
