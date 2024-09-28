document.addEventListener("DOMContentLoaded", function() {
  const toggleButton = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('#navbar');
  const body = document.querySelector('body');

  toggleButton.addEventListener('click', function() {
    navbar.classList.toggle('active');
    body.classList.toggle('active'); // Para evitar scroll quando o menu estiver aberto
  });
});
