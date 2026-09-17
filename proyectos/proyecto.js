// Lightbox: al hacer clic en cualquier imagen de la galería se abre a pantalla
// completa. Se cierra con clic en el fondo, el botón × o la tecla Escape.
(function () {
  const gallery = document.querySelector('.project-gallery');
  if (!gallery) return;

  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<button class="lightbox-close" aria-label="Cerrar">&times;</button><img alt="">';
  document.body.appendChild(box);

  const big = box.querySelector('img');

  const open = (src, alt) => {
    big.src = src;
    big.alt = alt || '';
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    box.classList.remove('open');
    document.body.style.overflow = '';
  };

  gallery.querySelectorAll('img').forEach((img) => {
    img.addEventListener('click', () => open(img.currentSrc || img.src, img.alt));
  });

  box.addEventListener('click', (e) => {
    if (e.target !== big) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();
