<?php
$enlace = mysqli_connect("localhost", "root", "", "cusix_bd");

if (!$enlace) {
    die("Error en la conexión: " . mysqli_connect_error());
}

$mensaje = "";

if (isset($_POST['registro'])) {
    $nombre_perfil = trim($_POST['nombre_perfil']);
    $correo = strtolower(trim($_POST['correo']));   
    $contraseña_plana = $_POST['contraseña'];

    $check = mysqli_prepare($enlace, "SELECT 1 FROM usuario WHERE correo = ?");
    mysqli_stmt_bind_param($check, "s", $correo);
    mysqli_stmt_execute($check);
    mysqli_stmt_store_result($check);
    $existe = mysqli_stmt_num_rows($check) > 0;
    mysqli_stmt_close($check);

    if ($existe) {
        $mensaje = "<p style='color: red;'>Ese correo ya está registrado.</p>";
    } else {
        $contrasena_encriptada = password_hash($contraseña_plana, PASSWORD_BCRYPT);

        $stmt = mysqli_prepare($enlace, "INSERT INTO usuario (nombre_perfil, correo, contraseña) VALUES (?, ?, ?)");

        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "sss", $nombre_perfil, $correo, $contrasena_encriptada);

            if (mysqli_stmt_execute($stmt)) {
                mysqli_stmt_close($stmt);
                header("Location: SignIn.php");
                exit;
            } elseif (mysqli_stmt_errno($stmt) == 1062) {
                $mensaje = "<p style='color: red;'>Ese correo ya está registrado.</p>";
            } else {
                $mensaje = "<p style='color: red;'>Error al registrar. Intentá de nuevo.</p>";
            }
            mysqli_stmt_close($stmt);
        } else {
            $mensaje = "<p style='color: red;'>Error al preparar la consulta.</p>";
        }
    }
}
?>
