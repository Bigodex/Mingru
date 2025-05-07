// Carrossel de Banners com Autoplay
  const sliderSection = document.querySelector('.slider'); // Referência a esta seção específica
  const radios = sliderSection.querySelectorAll('input[name="btn-radio"]'); // Só os radios desse carrossel
  let count = 0;

  setInterval(() => {
    radios[count].checked = true;
    count++;

    if (count >= radios.length) {
      count = 0;
    }
  }, 5000); // Troca a cada 5 segundos