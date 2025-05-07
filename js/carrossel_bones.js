document.querySelectorAll(".container-scroll-prod").forEach((container, index) => {
  const carrossel = container.querySelector(".faixa-cards-prod");
  const cards = carrossel.querySelectorAll(".bloco-produto");
  const btnPrev = container.querySelector(".btn-prev-prod");
  const btnNext = container.querySelector(".carrossel-btn.next");

  let currentIndex = 0;
  const visibleCards = 4;
  const totalGroups = Math.ceil(cards.length / visibleCards);

  function scrollToGroup(index) {
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(getComputedStyle(carrossel).gap) || 0;
    const scrollLeft = index * (cardWidth + gap) * visibleCards;

    carrossel.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }

  // Botões
  btnNext.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex >= totalGroups) {
      currentIndex = 0;
    }
    scrollToGroup(currentIndex);
  });

  btnPrev.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalGroups) % totalGroups;
    scrollToGroup(currentIndex);
  });

  // Drag to scroll
  let isDown = false;
  let startX;
  let scrollLeft;

  carrossel.addEventListener("mousedown", (e) => {
    isDown = true;
    carrossel.classList.add("dragging");
    startX = e.pageX - carrossel.offsetLeft;
    scrollLeft = carrossel.scrollLeft;
  });

  carrossel.addEventListener("mouseleave", () => {
    isDown = false;
    carrossel.classList.remove("dragging");
  });

  carrossel.addEventListener("mouseup", () => {
    isDown = false;
    carrossel.classList.remove("dragging");
  });

  carrossel.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carrossel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carrossel.scrollLeft = scrollLeft - walk;
  });

  // Impede arrastar imagens
  carrossel.querySelectorAll("img").forEach((img) => {
    img.setAttribute("draggable", "false");
  });

  // Modal de imagem
  function openImageModal(src) {
    const modal = document.createElement("div");
    modal.classList.add("image-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <img src="${src}" alt="Imagem ampliada">
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Evento de clique nas imagens
  carrossel.querySelectorAll(".img-wrapper-prod").forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    const overlay = wrapper.querySelector(".destaque-hover");

    if (img) {
      img.addEventListener("click", () => openImageModal(img.src));
    }

    if (overlay) {
      overlay.addEventListener("click", () => openImageModal(img.src));
    }
  });
});
