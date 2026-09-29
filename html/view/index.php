 <?php
session_start();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cusix</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../css/css.css">
    <link rel="icon" href="../img/favicon_cusix.png" type="image/png">
  
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="botones">
        <button id="boton" class="postito" onclick="cambiartexto()">POSTEAR</button>
        <input type="text" id="newtext" class="newtext" placeholder="¿Como anda la muchachada?">
    </div>

    <div id="contenedor" class="contenedor-tweets"></div>
    

    <nav class="sidebar">
        <div class="perfil">
            <?php if (isset($_SESSION['img'])): ?>
                <img src="<?= $_SESSION['img'] ?>" class="img-perfil" alt="Perfil">
            <?php else: ?>
                <img src="../img/perfildefault.png" class="img-perfil" alt="Default">
            <?php endif; ?>

            <div class="minombre">
                <?php
                echo isset($_SESSION['nombre_perfil']) 
                    ? "<strong>" . $_SESSION['nombre_perfil'] . "</strong><br>" 
                    : "";
                ?>
                <?php
                echo isset($_SESSION['nombre_perfil'])
                    ? '<a href="../logout.php">Cerrar sesión</a>'
                    : '<a href="SignUp.php"><button id="signup">SIGN UP</button></a> <a href="SignIn.php"><button id="signin">SIGN IN</button></a>';
                ?>
            </div>
        </div>
        <ul>
            <li><a href="#inicio" class="active">Inicio</a></li>
            <li><a href="configuracion.php">Configuración</a></li>
        </ul>
    </nav>

    <a href="../incluides/Epic_goy.php" class="contenedor-epic-logo">
        <img src="../img/epicgoylog.png" class="epic" alt="Epic Logo">
    </a>

    <div class="social-footer">
        <p style="color: var(--text-secondary); margin-bottom: 0;">Seguinos en nuestras redes:</p>
        <div class="social-links">
            <a href="https://www.instagram.com/epic.goy/?hl=es" class="instagram" target="_blank" title="Instagram">
                <i class="fab fa-instagram"></i>
            </a>
            <a href="https://x.com/EPICGOYx?lang=es" class="twitter" target="_blank" title="Twitter / X">
                <i class="fab fa-x-twitter"></i>
            </a>
            <a href="https://www.youtube.com/channel/UCqSgcuopIPHZb3LUp_5lTxw" class="youtube" target="_blank" title="YouTube">
                <i class="fab fa-youtube"></i>
            </a>
        </div>
    </div>

    <div id="carouselExampleSlidesOnly" class="carousel slide carrusel-derecha" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2klcMLTPhyti7l3P4p4CAYYiCUGJ13Nzc_sYOz5H3dAvKFJ44D-2uxpKm&s=10" class="d-block w-100" >
    </div>
    <div class="carousel-item">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_09qsLmFFuEsuv_QClvadmO99S1I4yDkGwV2hUO3bhMZuTtJGGl_xFbGS&s=10" class="d-block w-100" >
    </div>
    <div class="carousel-item">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSihTMN1t_Jg6pqZnrXYIZXbotUHbDyJ6SP67Slpmsc0TkrMVaKDIZ6KIg&s=10" class="d-block w-100">
    </div>
  </div>
</div>
    <script>
        const userSession = {
            img: "<?= isset($_SESSION['img']) ? $_SESSION['img'] : '../img/perfildefault.png' ?>",
            nombre: "<?= isset($_SESSION['nombre_perfil']) ? $_SESSION['nombre_perfil'] : 'Usuario' ?>",
            correo: "<?= isset($_SESSION['correo']) ? $_SESSION['correo'] : '' ?>"
        };

    </script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/scrips.js"></script>
    
</body>
</html>
