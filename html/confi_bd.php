<?php 
session_start();
require_once "../confi_bd.php"; 

if (!isset($_SESSION['id_usuario'])) { 
    header("Location: SignIn.php");
    exit();
}

$user_id = $_SESSION['id_usuario'];
$mensaje = "";
$error = "";

try {
    $stmt = $conexion->prepare("SELECT nombre_perfil, correo FROM usuarios WHERE id_usuario = ?");
    $stmt->execute([$user_id]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        exit("Usuario no encontrado.");
    }
} catch (Exception $e) {
    exit("Error de base de datos: " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $correo = trim($_POST['correo'] ?? '');

    if (!empty($nombre) && !empty($correo)) {
        $update = $conexion->prepare("UPDATE usuarios SET nombre_perfil = ?, correo = ? WHERE id_usuario = ?");
        if ($update->execute([$nombre, $correo, $user_id])) {
            $mensaje = "¡Perfil actualizado con éxito!";
            $usuario['nombre_perfil'] = $nombre;
            $usuario['correo'] = $correo;
        } else {
            $error = "Error al actualizar los datos.";
        }
    } else {
        $error = "El nombre y el correo no pueden estar vacíos.";
    }
}
?>