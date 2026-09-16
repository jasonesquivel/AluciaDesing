// Testimonios expandibles: al hacer clic se muestra la información completa
// de la tarjeta; solo una abierta a la vez.
document.querySelectorAll('.testimonial-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const card = toggle.closest('.testimonial-card');
    const details = document.getElementById(toggle.getAttribute('aria-controls'));
    const isOpen = card.classList.contains('open');

    document.querySelectorAll('.testimonial-card.open').forEach((open) => {
      open.classList.remove('open');
      open.querySelector('.testimonial-toggle').setAttribute('aria-expanded', 'false');
      const openDetails = open.querySelector('.testimonial-details');
      openDetails.addEventListener('transitionend', () => {
        if (!open.classList.contains('open')) openDetails.hidden = true;
      }, { once: true });
    });

    if (!isOpen) {
      details.hidden = false;
      requestAnimationFrame(() => {
        card.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      });
    }
  });
});
