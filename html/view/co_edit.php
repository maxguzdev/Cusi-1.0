<?php
session_start();
if (!isset($_SESSION['id_usuario'])) {
    header("Location: view/SignIn.php");
    exit();
}

$servidor = "localhost";
$usuario = "root";
$clave = "";
$basededatos = "cusix_bd";

$enlace = mysqli_connect($servidor, $usuario, $clave, $basededatos);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['guardar_cambios'])) {
    $id_usuario = $_SESSION['id_usuario'];
    $nombre_perfil = trim($_POST['nombre_perfil']);
    $bio = trim($_POST['bio']);

    $sql = "UPDATE usuario SET nombre_perfil = ?, bio = ? WHERE id_usuario = ?";
    $stmt = mysqli_prepare($enlace, $sql);
    
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "ssi", $nombre_perfil, $bio, $id_usuario);
        
        if (mysqli_stmt_execute($stmt)) {
            $_SESSION['nombre_perfil'] = $nombre_perfil;
            $_SESSION['bio'] = $bio;
            
            header("Location: configuracion.php");
            exit();
        } else {
            echo "Error al actualizar los datos en la base de datos.";
        }
        mysqli_stmt_close($stmt);
    }
}
?>