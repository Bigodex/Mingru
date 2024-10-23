// Get all modal triggers (images wrapped in links)
const images = document.querySelectorAll('[data-modal]');

// Loop through each image and add an event listener
images.forEach(image => {
  image.addEventListener('click', function () {
    const modalId = this.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    const modalImg = modal.querySelector('.modal-content');
    const captionText = modal.querySelector('#caption');
    
    modal.style.display = 'block'; // Show the modal
    modalImg.src = this.querySelector('img').src; // Set modal image to clicked image
    captionText.innerHTML = this.querySelector('h3').innerHTML; // Set caption to image title
  });
});

// Get all close buttons
const closeBtns = document.querySelectorAll('.close');

// Add close functionality to each close button
closeBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    const modal = this.closest('.modal');
    modal.style.display = 'none'; // Hide the modal
  });
});

// Close modal when clicking outside of the image
window.onclick = function (event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
};

