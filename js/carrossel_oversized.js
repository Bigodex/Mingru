document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("carrossel-produtos-2");
  if (!container) return;

  const carrossel = container.querySelector(".cards-venda");
  const cards = carrossel.querySelectorAll(".card-venda");
  const btnPrev = container.querySelector(".prev");
  const btnNext = container.querySelector(".next");

  if (!carrossel || cards.length === 0 || !btnPrev || !btnNext) return;

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

  btnNext.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex >= totalGroups) currentIndex = 0;
    scrollToGroup(currentIndex);
  });

  btnPrev.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalGroups) % totalGroups;
    scrollToGroup(currentIndex);
  });

  // Drag
  let isDown = false;
  let startX;
  let scrollLeft;

  carrossel.addEventListener("mousedown", (e) => {
    isDown = true;
    carrossel.classList.add("dragging");
    startX = e.pageX - carrossel.offsetLeft;
    scrollLeft = carrossel.scrollLeft;
  });

  document.addEventListener("mouseup", () => {
    isDown = false;
    carrossel.classList.remove("dragging");
  });

  carrossel.addEventListener("mouseleave", () => {
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

  // Evita arrastar imagens
  carrossel.querySelectorAll(".card-img-wrapper img").forEach((img) => {
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

    modal.querySelector(".close-modal").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  // Clique na imagem ou overlay
  carrossel.querySelectorAll(".card-img-wrapper").forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    const overlay = wrapper.querySelector(".overlay");

    if (img) img.addEventListener("click", () => openImageModal(img.src));
    if (overlay) overlay.addEventListener("click", () => openImageModal(img.src));
  });
});
