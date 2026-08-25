<!--para que cusi se bañe y haga mas cosas-->

<!DOCTYPE html>
<html lang="es">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Cusi</title>
   <link rel="stylesheet" href="/CUSI-1.0/frontEnd/Cusi_style/Cusi_style.css">
</head>

<body>
   <section class="baño">
      <div class="botones">
         <button onclick="irA('backEnd/cocina.php')" class="arrow_l"><img src="/CUSI-1.0/frontEnd/Cusi_style/left.png" width="70"></button>
         <button onclick="irA('backEnd/pieza.php')" class="arrow_r"><img src="/CUSI-1.0/frontEnd/Cusi_style/right.png" width="70"></button>
         <button onclick="irA('backEnd/config.php')" class="btn-secundario" id="src"> <img src="/CUSI-1.0/frontEnd/Cusi_style/eng.png"
               width="70"></button>
      </div>

      <img src="/CUSI-1.0/frontEnd/Cusi_style/CUSI_skins/Cusi.png" width="550" id="cusi_a">
      <img src="/CUSI-1.0/frontEnd/Cusi_style/bat_scr/ducha.png" width="200" id="ducha" class="im-btn" style="cursor: pointer;">
      <img src="/CUSI-1.0/frontEnd/Cusi_style/bat_scr/leo.png" width="229" class="im-btn" id="leo">

   </section>

   <script src="Cusi_script.js"></script>
</body>

</html>