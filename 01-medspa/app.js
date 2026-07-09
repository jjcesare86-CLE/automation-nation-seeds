// ============================================================
// Lumen Aesthetics — interactive layer
// - Hero parallax (subtle 4% translate on scroll)
// - Menu row accordion with underline draw-in
// - Chrome header solid-fill after hero
// - Form submits to brand.json.FORM_WEBHOOK_URL
// ============================================================

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Header behaviour ----------
  const chrome = document.querySelector('.chrome');
  const hero = document.querySelector('.hero');
  const onScroll = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    chrome.classList.toggle('solid', heroBottom < 80);
    // Over hero (light image side), keep default; else default
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Hero parallax ----------
  const heroImg = document.querySelector('.hero-img');
  if (!reducedMotion && heroImg) {
    const paraLoop = () => {
      const rect = hero.getBoundingClientRect();
      // Only run while hero intersects viewport
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        const shift = progress * 4; // 4% translate over the hero
        heroImg.style.transform = `translateY(${shift}%) scale(1.08)`;
      }
      requestAnimationFrame(paraLoop);
    };
    requestAnimationFrame(paraLoop);
  }

  // ---------- Menu accordion ----------
  const toggles = document.querySelectorAll('.menu-toggle');
  toggles.forEach(t => {
    t.addEventListener('click', () => {
      const open = t.getAttribute('aria-expanded') === 'true';
      toggles.forEach(other => {
        if (other !== t) other.setAttribute('aria-expanded', 'false');
      });
      t.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.animation = `revealUp 1s cubic-bezier(.2,.9,.2,1) ${i * .05}s both`;
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.phil-cols > div, .j-card, .menu-row').forEach(el => io.observe(el));

  const style = document.createElement('style');
  style.textContent = '@keyframes revealUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}';
  document.head.appendChild(style);

  if (reducedMotion) {
    document.querySelectorAll('.phil-cols > div, .j-card, .menu-row').forEach(el => el.style.animation = 'none');
  }

  // ---------- Form ----------
  const form = document.getElementById('bookForm');
  const status = document.getElementById('formStatus');
  if (form) {
    let webhook = 'https://services.leadconnectorhq.com/hooks/example/lumen';
    fetch('brand.json').then(r => r.ok ? r.json() : null).then(b => { if (b?.FORM_WEBHOOK_URL) webhook = b.FORM_WEBHOOK_URL; }).catch(() => {});

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.name || !data.email || !data.note) {
        status.textContent = 'Name, email, and a short note — the practice reads all three before replying.';
        return;
      }
      status.textContent = 'Sending…';
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, source: 'lumen-aesthetics.web', at: new Date().toISOString() }),
          mode: 'no-cors'
        });
      } catch (_) { /* graceful */ }
      form.reset();
      status.textContent = 'Received. Dr. Ravel replies personally within one business day.';
    });
  }
})();
