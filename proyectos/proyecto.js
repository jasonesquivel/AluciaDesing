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


// Da un respiro a las vocales acentuadas y a la eñe para que el acento no se
// encime con la letra de al lado (independiente de la fuente/dispositivo).
(function () {
  const ACC = /[\u00E1\u00E9\u00ED\u00F3\u00FA\u00FC\u00F1\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1]/;
  const SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.nodeValue || !ACC.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      const p = n.parentNode;
      if (!p || SKIP[p.nodeName] || p.classList.contains('accent-space')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  nodes.forEach((n) => {
    const frag = document.createDocumentFragment();
    for (const ch of n.nodeValue) {
      if (ACC.test(ch)) {
        const s = document.createElement('span');
        s.className = 'accent-space';
        s.textContent = ch;
        frag.appendChild(s);
      } else {
        frag.appendChild(document.createTextNode(ch));
      }
    }
    n.parentNode.replaceChild(frag, n);
  });
})();
