<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$servidor = "localhost";
$usuario = "root";
$clave = "";
$basededatos = "cusix_bd";

$enlace = mysqli_connect($servidor, $usuario, $clave, $basededatos);

if (!$enlace) {
    die("Error de conexión: " . mysqli_connect_error());
}

$mensaje = "";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $correo = $_POST['correo'] ?? '';
    $contraseña = $_POST['contraseña'];

    if (!empty($correo) && !empty($contraseña)) {
        $stmt = mysqli_prepare($enlace, "SELECT id_usuario, nombre_perfil, contraseña FROM usuario WHERE correo = ?");
        mysqli_stmt_bind_param($stmt, "s", $correo);        
        mysqli_stmt_execute($stmt);
        $resultado = mysqli_stmt_get_result($stmt);
        if ($fila = mysqli_fetch_assoc($resultado)) {            

            if (password_verify($contraseña, $fila['contraseña'])) {            
                $_SESSION['id_usuario'] = $fila['id_usuario'];
                $_SESSION['nombre_perfil'] = $fila['nombre_perfil'];
                               
                header("Location: index.php");
                exit();
            } else {
                $mensaje = "<p style='color: red;'>Contraseña incorrecta.</p>";
            }
        } else {
            $mensaje = "<p style='color: red;'>El correo no está registrado.</p>";
        }
    } else {
        $mensaje = "<p style='color: red;'>Por favor, completa todos los campos.</p>";
    }
}
?>