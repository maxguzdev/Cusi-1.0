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
    $contraseña_plana = $_POST['contraseña'];

    $contraseña_encriptada = password_hash($contraseña_plana, PASSWORD_BCRYPT);

   
    $insertardatos = "INSERT INTO usuario (nombre_perfil, correo, contraseña) VALUES (?, ?, ?)";
 
    $stmt = mysqli_prepare($enlace, $insertardatos);

    if ($stmt) {
       
        mysqli_stmt_bind_param($stmt, "sss", $nombre_perfil, $correo, $contraseña_encriptada);
        
        $ejecutarInsertar = mysqli_stmt_execute($stmt);

        if ($ejecutarInsertar) {
            $mensaje = "<p style='color: green;'>¡Usuario registrado con éxito!</p>";
        } else {
            $mensaje = "<p style='color: red;'>Error al registrar: " . mysqli_stmt_error($stmt) . "</p>";
        }

        mysqli_stmt_close($stmt);
    } else {
        $mensaje = "<p style='color: red;'>Error al preparar la consulta: " . mysqli_error($enlace) . "</p>";
    }
}
?>
