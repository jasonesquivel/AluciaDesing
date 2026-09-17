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

// Atrapa una estrella con el cursor y llévala hasta la otra: al juntarlas se
// funden en UNA sola (solo una visible). Con clic, la estrella se divide en
// dos direcciones: una hacia la mascota y otra hacia "Disponible para
// proyectos". En pantallas táctiles, tocar la mascota o la pastilla ejecuta
// la secuencia completa automáticamente.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const touchDevice = window.matchMedia('(hover: none)').matches;

const starA = document.querySelector('.hero-star');
const starB = document.querySelector('.cta-star');
const avatar = document.querySelector('.hero-avatar');
const pill = document.querySelector('.cta-pill');

if (starA && starB && avatar && pill) {
  const followers = new Set();
  let mergedOne = false;
  let done = false;

  const pin = (star) => {
    const r = star.getBoundingClientRect();
    star.style.left = (r.left + r.width / 2) + 'px';
    star.style.top = (r.top + r.height / 2) + 'px';
    star.classList.add('following');
  };

  [starA, starB].forEach((star) => {
    star.addEventListener('mouseenter', () => {
      if (done || reducedMotion || followers.has(star)) return;
      pin(star);
      followers.add(star);
      // al atrapar la segunda, se funden en una sola
      if (followers.size === 2 && !mergedOne) {
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
    if (done) return;
    followers.forEach((star) => {
      star.style.left = e.clientX + 'px';
      star.style.top = e.clientY + 'px';
    });
  });

  const finish = () => {
    starA.remove();
    starB.remove();
    avatar.classList.add('merged');
    pill.classList.add('merged');
  };

  const split = (fromX, fromY) => {
    done = true;
    const a = avatar.querySelector('img').getBoundingClientRect();
    const p = pill.getBoundingClientRect();
    [starA, starB].forEach((star) => {
      star.classList.remove('star-pulse');
      star.classList.add('following');
      star.style.visibility = 'visible';
      star.style.left = fromX + 'px';
      star.style.top = fromY + 'px';
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      [starA, starB].forEach((star) => star.classList.add('star-split'));
      starA.style.left = (a.left + a.width * 0.82) + 'px';
      starA.style.top = (a.top + a.height * 0.12) + 'px';
      starB.style.left = (p.left + 4) + 'px';
      starB.style.top = p.top + 'px';
    }));
    setTimeout(finish, 820);
  };

  // secuencia automática (móvil o clic directo en mascota/pastilla):
  // las dos vuelan al centro, se funden y se separan
  const autoSequence = () => {
    done = true;
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
      done = false;
      [starA, starB].forEach((s) => s.classList.remove('star-meet'));
      split(cx, cy);
    }, 1050);
  };

  const onClick = (e) => {
    if (done) return;
    if (reducedMotion) { done = true; finish(); return; }
    if (mergedOne) {
      const r = starA.getBoundingClientRect();
      split(r.left + r.width / 2, r.top + r.height / 2);
    } else if (touchDevice || e.currentTarget === avatar || e.currentTarget === pill) {
      // en táctil no hay cursor con qué atrapar: cualquier toque ejecuta
      // la secuencia completa (encuentro, fusión y separación)
      autoSequence();
    }
  };

  [starA, starB, avatar, pill].forEach((el) => {
    el.addEventListener('click', onClick);
    el.classList.add('star-partner');
  });
}
