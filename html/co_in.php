<?php
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
    // Tomamos los datos eliminando espacios vacíos accidentales
    $correo = isset($_POST['correo']) ? trim($_POST['correo']) : '';
    $contrasena = isset($_POST['contrasena']) ? trim($_POST['contrasena']) : '';

    if (!empty($correo) && !empty($contrasena)) {
        // Consulta SQL limpia apuntando a los campos reales de la base de datos
        $stmt = mysqli_prepare($enlace, "SELECT id_usuario, nombre_perfil, correo, contrasena, url_img, fecha_creacion FROM usuario WHERE correo = ?");
        mysqli_stmt_bind_param($stmt, "s", $correo);        
        mysqli_stmt_execute($stmt);
        $resultado = mysqli_stmt_get_result($stmt);
        
        if ($fila = mysqli_fetch_assoc($resultado)) {    
            // Validamos la contraseña usando la función segura de PHP
            if (password_verify($contrasena, $fila['contrasena'])) {            
                
                $_SESSION['id_usuario'] = $fila['id_usuario'];
                $_SESSION['nombre_perfil'] = $fila['nombre_perfil'];
                $_SESSION['img'] = $fila['url_img']; // Sincronizado con 'url_img' de tu base de datos
                                    
                header("Location: index.php");
                exit();
            } else {
                $mensaje = "<p style='color: red;'>Contraseña incorrecta.</p>";
            }
        } else {
            $mensaje = "<p style='color: red;'>El correo no está registrado.</p>";
        }
        mysqli_stmt_close($stmt);
    } else {
        $mensaje = "<p style='color: red;'>Por favor, completa todos los campos.</p>";
    }
}
?>

