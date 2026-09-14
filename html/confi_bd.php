
<?php
session_start();

echo "Imagen: " . $_SESSION['img'] . "<br>";
echo "Nombre de perfil: " . $_SESSION['nombre_perfil'] . "<br>";
echo "Biografía: " . $_SESSION['bio'] . ".";
?>
