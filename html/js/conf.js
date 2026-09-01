const imagenes = [
  "../img/CUSI_skins/Ares.png",
  "../img/CUSI_skins/Arev.png",
  "../img/CUSI_skins/Cusi.png",
  "../img/CUSI_skins/Darwin.png",
  "../img/CUSI_skins/Diego.png",
  "../img/CUSI_skins/Franco.png",
  "../img/CUSI_skins/Kanep.png",
  "../img/CUSI_skins/Lisandro.png",
  "../img/CUSI_skins/Manuel.png",
  "../img/CUSI_skins/Ramsés.png"
];

let indiceActual = 0;

document.getElementById("cambiar").addEventListener("click", () => {
  indiceActual = (indiceActual + 1) % imagenes.length;
  document.getElementById("mi-imagen").src = imagenes[indiceActual];
});