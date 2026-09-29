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

try {
    
    $conexion = new PDO("mysql:host=$servidor;dbname=$basededatos;charset=utf8", $usuario, $clave);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

if (!isset($_SESSION['id_usuario'])) { 
    header("Location: SignIn.php");
    exit();
}

$user_id = $_SESSION['id_usuario'];
$mensaje = "";
$error = "";

try {
    $stmt = $conexion->prepare("SELECT nombre_perfil, correo FROM usuario WHERE id_usuario = ?");
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