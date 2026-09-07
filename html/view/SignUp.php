<?php
$servidor = "localhost";
$usuario = "root";
$clave = "";
$basededatos = "cusix_bd";

$enlace = mysqli_connect($servidor, $usuario, $clave, $basededatos);

if (!$enlace) {
    die("Error en la conexión: " . mysqli_connect_error());
}

$mensaje = "";

if (isset($_POST['registro'])) {
    $nombre_perfil = $_POST['nombre_perfil'];
    $correo = $_POST['correo'];
    $contraseña = $_POST['contraseña'];

    $insertardatos = "INSERT INTO usuario (nombre_perfil, correo, contraseña) VALUES ('$nombre_perfil', '$correo', '$contraseña')";

    $ejecutarInsertar = mysqli_query($enlace, $insertardatos);

    if ($ejecutarInsertar) {
        $mensaje = "<p style='color: green;'>¡Usuario registrado con éxito!</p>";
    } else {
        $mensaje = "<p style='color: red;'>Error al registrar: " . mysqli_error($enlace) . "</p>";
    }
}
?>
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