async function irA(url) {
    try {
        const response = await fetch(url, {
            method: 'POST'
        });

        if (!response.ok) throw new Error('Error en la petición');

        const html = await response.text();

        document.getElementById("content").innerHTML = html;

    } catch (error) {
        console.error('Hubo un error:', error);
    }
}

document.addEventListener('click', function (e) {
  console.log('clickeaste:', e.target.tagName, e.target.id, e.target.className);

  if (e.target.id === 'cusi_a') {
    const deam = document.getElementById("damn");
    deam.currentTime = 0;
    deam.play().catch(error => console.log('no funciona', error));
  }
});