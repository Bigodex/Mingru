const carrossel = document.getElementById("carrossel");
const cards = carrossel.querySelectorAll(".card-venda");
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");

let currentIndex = 0;
const visibleCards = 4;
const totalGroups = Math.ceil(cards.length / visibleCards);

// Função para rolar até o grupo de cards (4 por vez)
function scrollToGroup(index) {
  const cardWidth = cards[0].offsetWidth;
  const gap = parseInt(getComputedStyle(carrossel).gap) || 0;
  const scrollLeft = index * (cardWidth + gap) * visibleCards;

  carrossel.scrollTo({
    left: scrollLeft,
    behavior: "smooth",
  });
}

// Navegação manual com botões
btnNext.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= totalGroups) {
    currentIndex = 0; // Volta ao início
  }
  scrollToGroup(currentIndex);
});

btnPrev.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + totalGroups) % totalGroups;
  scrollToGroup(currentIndex);
});

// Drag to scroll (mouse)
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

// Impede que todas as imagens sejam arrastadas
carrossel.querySelectorAll(".card-img-wrapper img").forEach((img) => {
  img.setAttribute("draggable", "false");
});

// Função para abrir imagem em um modal
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

// Seleciona todas as imagens E overlays e adiciona evento de clique
carrossel.querySelectorAll(".card-img-wrapper").forEach((wrapper) => {
  const img = wrapper.querySelector("img");
  const overlay = wrapper.querySelector(".overlay");

  // Clicar na imagem abre o modal
  img.addEventListener("click", () => {
    openImageModal(img.src);
  });

  // Clicar no overlay também abre o modal
  overlay.addEventListener("click", () => {
    openImageModal(img.src);
  });
});

