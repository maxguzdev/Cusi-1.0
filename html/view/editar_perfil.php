<?php
session_start();
if (!isset($_SESSION['nombre_perfil'])) {
    header("Location: SignIn.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Perfil</title>
    <link rel="stylesheet" href="../css/confi.css"> 
</head>
<body>
    <div id="ford">
        <h2>Editar Perfil</h2>
        
        <form action="co_edit.php" method="POST">
            <div>
                <label for="nombre">Nombre:</label><br>
                <input type="text" id="nombre" name="nombre_perfil" value="<?= $_SESSION['nombre_perfil'] ?>" required>
            </div>
            <br>
            
            <div>
                <label for="bio">Biografía:</label><br>
                <textarea id="bio" name="bio" rows="4" cols="30"><?= isset($_SESSION['bio']) ? $_SESSION['bio'] : '' ?></textarea>
            </div>
            <br>
            
            <button type="submit" name="guardar_cambios">Guardar Cambios</button>
            <a href="configuracion.php">Cancelar</a>
        </form>
    </div>
</body>
</html>
