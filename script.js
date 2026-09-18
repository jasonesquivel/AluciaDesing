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

// Estrellas interactivas:
//  - Atrapa UNA estrella con el cursor y haz clic: vuela sola a su propio
//    destino (la estrella del héroe -> mascota; la del CTA -> pastilla).
//  - Atrapa las DOS (pasa el cursor por ambas): se funden en una sola; al
//    hacer clic se separan de nuevo hacia sus dos destinos.
//  - En pantallas táctiles, tocar cualquiera ejecuta la secuencia completa.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const touchDevice = window.matchMedia('(hover: none)').matches;

const starA = document.querySelector('.hero-star');
const starB = document.querySelector('.cta-star');
const avatar = document.querySelector('.hero-avatar');
const pill = document.querySelector('.cta-pill');

if (starA && starB && avatar && pill) {
  const homeOf = new Map([[starA, avatar], [starB, pill]]);
  const followers = new Set();
  const settled = new Set();
  let mergedOne = false;
  let allDone = false;

  const landingPoint = (partner) => {
    if (partner === avatar) {
      const a = avatar.querySelector('img').getBoundingClientRect();
      return { x: a.left + a.width * 0.82, y: a.top + a.height * 0.12 };
    }
    const p = pill.getBoundingClientRect();
    return { x: p.left + 4, y: p.top };
  };

  const pin = (star) => {
    const r = star.getBoundingClientRect();
    star.style.left = (r.left + r.width / 2) + 'px';
    star.style.top = (r.top + r.height / 2) + 'px';
    star.classList.add('following');
  };

  const flyTo = (star, partner) => {
    const t = landingPoint(partner);
    star.classList.remove('star-pulse');
    star.classList.add('following');
    star.style.visibility = 'visible';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      star.classList.add('star-split');
      star.style.left = t.x + 'px';
      star.style.top = t.y + 'px';
    }));
    setTimeout(() => {
      star.remove();
      partner.classList.add('merged');
    }, 820);
  };

  // una sola estrella vuela a su propio destino, sin afectar a la otra
  const sendHome = (star) => {
    followers.delete(star);
    settled.add(star);
    flyTo(star, homeOf.get(star));
  };

  [starA, starB].forEach((star) => {
    star.addEventListener('mouseenter', () => {
      if (reducedMotion || allDone || mergedOne) return;
      if (settled.has(star) || followers.has(star)) return;
      pin(star);
      followers.add(star);
      // al atrapar la segunda, se funden en una sola
      if (followers.size === 2) {
        mergedOne = true;
        setTimeout(() => {
          starB.style.visibility = 'hidden';
          followers.delete(starB);
          starA.classList.add('star-pulse');
        }, 220);
      }
    });
  });

  document.addEventListener('mousemove', (e) => {
    followers.forEach((star) => {
      star.style.left = e.clientX + 'px';
      star.style.top = e.clientY + 'px';
    });
  });

  // las dos fundidas se separan hacia ambos destinos
  const splitBoth = (fromX, fromY) => {
    allDone = true;
    followers.clear();
    [starA, starB].forEach((star) => {
      star.classList.remove('star-pulse');
      star.classList.add('following');
      star.style.visibility = 'visible';
      star.style.left = fromX + 'px';
      star.style.top = fromY + 'px';
    });
    flyTo(starA, avatar);
    flyTo(starB, pill);
  };

  // secuencia automática (táctil o clic en mascota/pastilla sin agarrar)
  const autoSequence = () => {
    if (mergedOne || allDone) return;
    mergedOne = true;
    followers.clear();
    [starA, starB].forEach((s) => { if (!s.classList.contains('following')) pin(s); });
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.42;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      [starA, starB].forEach((s) => {
        s.classList.add('star-meet');
        s.style.left = cx + 'px';
        s.style.top = cy + 'px';
      });
    }));
    setTimeout(() => {
      starB.style.visibility = 'hidden';
      starA.classList.add('star-pulse');
    }, 640);
    setTimeout(() => {
      [starA, starB].forEach((s) => s.classList.remove('star-meet'));
      splitBoth(cx, cy);
    }, 1050);
  };

  const onClick = (e) => {
    if (allDone) return;
    if (reducedMotion) {
      allDone = true;
      starA.remove(); starB.remove();
      avatar.classList.add('merged'); pill.classList.add('merged');
      return;
    }
    // dos estrellas fundidas -> separar a ambos destinos
    if (mergedOne) {
      const r = starA.getBoundingClientRect();
      splitBoth(r.left + r.width / 2, r.top + r.height / 2);
      return;
    }
    const target = e.currentTarget;
    // una sola estrella agarrada -> vuela sola a su propio destino
    if ((target === starA || target === starB) && followers.has(target)) {
      sendHome(target);
      return;
    }
    // táctil o clic directo en mascota/pastilla -> secuencia automática
    if (touchDevice || target === avatar || target === pill) {
      autoSequence();
    }
  };

  [starA, starB, avatar, pill].forEach((el) => {
    el.addEventListener('click', onClick);
    el.classList.add('star-partner');
  });
}
