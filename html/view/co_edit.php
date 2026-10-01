<?php
session_start();
if (!isset($_SESSION['id_usuario'])) {
    header("Location: SignIn.php");
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
    
    // Por defecto, mantenemos la imagen actual que ya tiene en la sesión
    $ruta_foto_final = $_SESSION['img']; 

    // Verificamos si el usuario subió un archivo y no tiene errores
    if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
        
        $nombre_archivo = $_FILES['foto_perfil']['name'];
        $tipo_archivo = $_FILES['foto_perfil']['type'];
        $tamano_archivo = $_FILES['foto_perfil']['size'];
        $ruta_temporal = $_FILES['foto_perfil']['tmp_name'];

        // Extraemos la extensión del archivo (jpg, png, etc.)
        $extension = pathinfo($nombre_archivo, PATHINFO_EXTENSION);
        
        // Creamos un nombre único usando el ID del usuario para que no se repitan
        $nuevo_nombre_foto = "perfil_" . $id_usuario . "_" . time() . "." . $extension;
        
        // Definimos dónde se va a guardar físicamente el archivo
        // Como co_edit.php está en 'view', subimos un nivel para entrar a 'img'
        $carpeta_destino = "../img/" . $nuevo_nombre_foto;

        // Movemos el archivo desde la memoria temporal de XAMPP a nuestra carpeta real
        if (move_uploaded_file($ruta_temporal, $carpeta_destino)) {
            $ruta_foto_final = $carpeta_destino;
        }
    }

    // Actualizamos la base de datos sumando la columna 'img'
    $sql = "UPDATE usuario SET nombre_perfil = ?, bio = ?, img = ? WHERE id_usuario = ?";
    $stmt = mysqli_prepare($enlace, $sql);
    
    if ($stmt) {
        // Pasamos 3 textos ("sss") y 1 entero ("i") para el ID
        mysqli_stmt_bind_param($stmt, "sssi", $nombre_perfil, $bio, $ruta_foto_final, $id_usuario);
        
        if (mysqli_stmt_execute($stmt)) {
            // Actualizamos absolutamente todas las variables de sesión actuales
            $_SESSION['nombre_perfil'] = $nombre_perfil;
            $_SESSION['bio'] = $bio;
            $_SESSION['img'] = $ruta_foto_final; 
            
            header("Location: configuracion.php");
            exit();
        } else {
            echo "Error al actualizar los datos en la base de datos.";
        }
        mysqli_stmt_close($stmt);
    }
}
?>