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
