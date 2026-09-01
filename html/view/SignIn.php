<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>sign in</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>

    <div class="card">
        <h2>Iniciar Sesión</h2>

        <form action="/login" method="POST">
            <div>
                <label for="email">Correo electrónico:</label><br>
                <input type="email" id="email" name="email" required placeholder="ejemplo@correo.com">
            </div>
            <br>

            <div>
                <label for="password">Contraseña:</label><br>
                <input type="password" id="password" name="password" required>
            </div>
            <br>

            <button type="submit">Ingresar</button>
        </form>

        <p>¿No tienes cuenta? <a href="SignUp.php">Regístrate</a></p>
    </div>

</body>
</html>