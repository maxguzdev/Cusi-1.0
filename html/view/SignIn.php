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

<<<<<<< HEAD
        <!-- Muestra el mensaje si las credenciales fallan -->
=======
        <!-- Muestra el mensaje si las credenciales fallan o faltan -->
>>>>>>> d799768f111c866a74a694d0cdf0b513dec7c907
        <?php if (!empty($mensaje)) echo $mensaje; ?>

        <form action="" method="POST">
            <div>
                <label for="email">Correo electrónico:</label><br>
<<<<<<< HEAD
                <input type="email" id="email" name="correo" required placeholder="ejemplo@correo.com" value="pablo@gmail.com">
=======
                <input type="email" id="email" name="correo" required placeholder="ejemplo@correo.com">
>>>>>>> d799768f111c866a74a694d0cdf0b513dec7c907
            </div>
            <br>

            <div>
                <label for="password">Contraseña:</label><br>
<<<<<<< HEAD
                <input type="password" id="password" name="contraseña" required  value="pablopablo">
=======
                <input type="password" id="password" name="contraseña" required>
>>>>>>> d799768f111c866a74a694d0cdf0b513dec7c907
            </div>
            <br>

            <button type="submit" name="ingresar">Ingresar</button>
        </form>

        <p>¿No tienes cuenta? <a href="SignUp.php">Regístrate</a></p>
    </div>
</body>
</html>
