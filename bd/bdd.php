<?php
$SERVER = "localhost";
$user = "root";
$pass = "";
$db = "test";

$conexion = new mysqli.($SERVER, $user, $pass, $db);
if($conexion->connect_error){
    die("Conexion fallida".$conexion->connect_error);
    }else {
        echo "conectado";
    }
    ?>