<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EPIC GOY - CUSI</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
     <link rel="stylesheet" href="../css/epic.css">
    
    <style>
        :root {
            --bg-color: #A47DAB;
            --card-bg: antiquewhite;
            --text-main: #040200;
            --text-secondary: #000000;
            --accent-color: #000000;
            --accent-hover: #A47DAB;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
            margin: 0;
            padding: 2rem 1rem;
            min-height: 100vh;
            overflow-y: scroll;
        }

        .container {
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            position: relative;
        }

        .header-title {
            text-align: center;
            position: relative;
            margin-bottom: 2rem;
        }

        h1 {
            color: var(--accent-color);
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0;
            font-weight: 800;
        }

        #imagen {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            width: 60px;
            height: auto;
        }

        @media (max-width: 600px) {
            #imagen {
                position: static;
                transform: none;
                display: block;
                margin: 0 auto 1rem auto;
            }
        }

        .card {
            background-color: var(--card-bg);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card h1 {
            font-size: 1.5rem;
            margin-top: 0;
            margin-bottom: 1.5rem;
            color: var(--text-main);
            text-align: left;
        }

        .card h3 {
            margin-top: 0;
            color: var(--text-main);
        }

        .card h4 {
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-main);
        }

        .integrante p {
            background-color: rgba(255, 255, 255, 0.03);
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid var(--accent-color);
            margin-bottom: 1rem;
            transition: transform 0.2s ease;
        }

        .integrante p:hover {
            transform: translateX(5px);
            background-color: rgba(255, 255, 255, 0.05);
        }

        .anexo {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .link-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .link-group span {
            color: var(--text-secondary);
            font-weight: 600;
        }

        .link-group a {
            color: var(--accent-color);
            text-decoration: none;
            word-break: break-all;
            padding: 0.8rem 1rem;
            background-color: rgba(99, 102, 241, 0.1);
            border-radius: 6px;
            transition: all 0.2s ease;
        }

        .link-group a:hover {
            background-color: var(--accent-color);
            color: white;
        }

        .video-container {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            max-width: 100%;
            border-radius: 8px;
            margin-top: 1rem;
        }

        .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }

        .social-footer {
            text-align: center;
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
        }

        .social-links a {
            color: var(--text-secondary);
            font-size: 2rem;
            transition: all 0.3s ease;
            text-decoration: none;
        }

        .social-links a.instagram:hover { color: #E1306C; transform: translateY(-5px); }
        .social-links a.twitter:hover { color: #1DA1F2; transform: translateY(-5px); }
        .social-links a.youtube:hover { color: #FF0000; transform: translateY(-5px); }
    .botonvolver{
    background-color: #ffff;
  color: #A47DAB;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 15px;
  font-weight: 700;
  padding: 10px 24px;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
}   
   </style>
</head>

<body>
    <a href="../view/index.php">
  <button id="volver" class="botonvolver" >volver a CusiX</button> 
  </a>
  <a href="../../frontEnd/index.html">
  <button id="volver" class="botonvolver" >volver a Cusi</button> 
  </a>
    <div class="container">
        <div class="header-title">
            <img src="../img/epicgoylog.png" id="imagen" >
            <h1>EPIC GOY</h1>
        </div>

        <div id="nosotros" class="somos card">
            <p>
                EPIC GOY es un equipo de desarrolladores de la escuela confederación suiza N° 26. 
                Somos un grupo de 5 personas especializadas en diseño, front end y back end, 
                implementamos todos nuestros conocimientos para la creación de nuestro proyecto: “CUSI”
            </p>
        </div>

        <div class="somos card">
      <div class="contenedor-integrante">
    <button class="boton-activador" onclick="toggleIntegrante(this)">León Raya Roles: Scrum Master, Front End y Diseñador</button>
    <div class="barra-desplegable">
        <div class="contenido-barra">
            <p><strong>Biografia:</strong>Hola soy León Raya, el CEO y co-fundador de EPIC GOY. Mi trabajo en la compañía es controlar que todos hagan su trabajo (SCRUM master), frontendear y la parte artistica de cusi y cusiX.<a href="https://www.instagram.com/davito8284/?hl=es" target="_blank">Mas sobre mi</a></p>
        </div>
        
    </div>
</div>


<div class="contenedor-integrante">
    <button class="boton-activador" onclick="toggleIntegrante(this)">Maximo Guzman Roles: Diseñador y Administrador de base de datos</button>
    <div class="barra-desplegable">
        <div class="contenido-barra">
            <p><strong>Biografia:</strong>Hola me llamo Maximo, pero mis amigos me dicen gordo pelotudo, soy el co-owner y co-funder de epic goy y trabajo en el area de diseñador, investigacion(creo que no tuve que decir eso) y el administrador de base de datos.<a href="https://www.instagram.com/elmaximopeligro/?hl=es" target="_blank">Tocamela</a></p>
        </div>
    </div>
</div>


<div class="contenedor-integrante">
    <button class="boton-activador" onclick="toggleIntegrante(this)">Yoel Mamani Roles: Front End</button>
    <div class="barra-desplegable">
        <div class="contenido-barra">
            <p><strong>Biografia:</strong>Ho-ho-hola so-so-soy yo , o el ?  ,soy el encargado de que maxi hace su trabajo y que no se desvie del camino correcto.<a href="https://www.instagram.com/y0_el21/?hl=es" target="_blank">Si quieres ir al lado bueno, Clickea</a></p>
        </div>
    </div>
</div>


<div class="contenedor-integrante">
    <button class="boton-activador" onclick="toggleIntegrante(this)">Samuel Guzman Roles: Tester y Back End</button>
    <div class="barra-desplegable">
        <div class="contenido-barra">
            <p><strong>Biografia:</strong>Hola soy samuel y trabajo en el backend en cusi con mi amiguito mati.<a href="https://ar.china-embassy.gov.cn/esp/" target="_blank">Mas sobre mi</a></p>
        </div>
    </div>
</div>


<div class="contenedor-integrante">
    <button class="boton-activador" onclick="toggleIntegrante(this)">Matias Vilchez Roles: Back End y tester</button>
    <div class="barra-desplegable">
        <div class="contenido-barra">
            <p><strong>Biografia:</strong>hello me llamo matias y juego steal a brainrot, SAE, FREE FIRE, TBC, Y MUCHAS COSASM JAJAJAJ.<a href="https://www.instagram.com/paty1.221/?hl=es" target="_blank">Mas sobre mi</a></p>
        </div>
    </div>
</div>
</div>
        <div id="anexos" class="anexo card">
            <h1>Anexos</h1>
            
            <div class="link-group">
                <span>Link del Trello:</span>
                <a href="https://trello.com/invite/b/6a4cfde2b245f8fcee6ed653/ATTI62d2c627eeed77f1057b2de8ccc85a728E76600D/epic-goy" target="_blank">
                    https://trello.com/invite/b/6a4cfde2b245f8fcee6ed653/ATTI62d2c627eeed77f1057b2de8ccc85a728E76600D/epic-goy
                </a>
            </div>

            <div class="link-group">
                <span>Link del Github:</span>
                <a href="https://github.com/maxguzdev/Cusi-1.0" target="_blank">
                    https://github.com/maxguzdev/Cusi-1.0
                </a>
            </div>
        </div>

        <div id="proyectos" class="somos card">
            <h1>PROYECTOS:</h1>
            <h3>CUSI:</h3>
            <p>
                CUSI, es un juego indie y gratuito para todo público con microtransacciones “legales” para comprar objetos fabulosos a CUSI.
                Queremos buscar la atención del público joven con juegos llamativos y muy divertidos también encontramos la forma de integrar todo lo bueno de los juegos de cuidado de mascota virtual (según la comunidad).
                Actualmente Cusi no esta a la venta al publico y aun no se sabe la fecha de lanzamiento.
            </p>
            <h4>AVANCES</h4>
            <div class="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/PHMRoEMio4Q?si=xrTPaYXLUKIR7fzV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>

            <h3>CUSIX:</h3>
            <p>
                CUSIX: es una pagina web para chatear con su comunidad muy "amigable", podes cambiar tu perfil a tu gusto. esta conectada con la pagina CUSI, prueba hacer mas amigos y generar una comunidad muy buena.
            </p>
            <h4>AVANCES</h4>
            <div class="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/-1rQp8jxTbQ?si=wBZWX-5R2WaO_Yjq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>

            <h3>Diego Market:</h3>
            <p>
                Diego Market: En Proceso
            </p>
            <h4>AVANCES</h4>
            <div class="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/zzK6z1LeKRI?si=_pE4DLafUwZE2XL9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        </div>
        
        <div class="social-footer">
            <p style="color: var(--text-secondary); margin-bottom: 0;">Seguinos en nuestras redes:</p>
            <div class="social-links">
                <a href="https://www.instagram.com/epic.goy/?hl=es" class="instagram" target="_blank" title="Instagram">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="https://x.com/EPICGOYx?lang=es" class="twitter" target="_blank" title="Twitter / X">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="https://www.youtube.com/channel/UCqSgcuopIPHZb3LUp_5lTxw" class="youtube" target="_blank" title="YouTube">
                    <i class="fab fa-youtube"></i>
                </a>
            </div>
        </div>
    </div>
</body>
<script src="../js/epic.js" ></script>
</html>