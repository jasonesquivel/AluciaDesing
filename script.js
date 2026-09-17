// Testimonios expandibles: al hacer clic se muestra la información completa
// de la tarjeta; solo una abierta a la vez. El colapso lo maneja CSS
// (grid-template-rows 0fr/1fr sobre .open).
document.querySelectorAll('.testimonial-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const card = toggle.closest('.testimonial-card');
    const isOpen = card.classList.contains('open');

    document.querySelectorAll('.testimonial-card.open').forEach((open) => {
      open.classList.remove('open');
      open.querySelector('.testimonial-toggle').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      card.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
});
