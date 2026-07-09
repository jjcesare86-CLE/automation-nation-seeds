// ============================================================
// Summit Roofing Co. — interactive layer.
// - Sticky header solid-fill on scroll
// - Before/After drag slider (pointer + keyboard + touch)
// - Form graceful submit to brand.json.FORM_WEBHOOK_URL
// ============================================================

(() => {
  // ---------- Sticky header ----------
  const chrome = document.querySelector('.chrome');
  const onScroll = () => {
    if (window.scrollY > 40) chrome.classList.add('solid');
    else chrome.classList.remove('solid');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Before/After slider ----------
  const wrap = document.getElementById('baBefore');
  const handle = document.getElementById('baHandle');
  const frame = wrap?.parentElement;
  if (wrap && handle && frame) {
    let dragging = false;

    const set = (pct) => {
      pct = Math.max(0, Math.min(100, pct));
      wrap.style.width = pct + '%';
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    };

    const fromEvent = (e) => {
      const rect = frame.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      set((x / rect.width) * 100);
    };

    handle.addEventListener('pointerdown', (e) => {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
      handle.style.cursor = 'grabbing';
    });
    handle.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
    handle.addEventListener('pointerup', (e) => {
      dragging = false;
      handle.style.cursor = 'ew-resize';
    });
    handle.addEventListener('pointercancel', () => { dragging = false; });

    // Keyboard accessibility: ← / → adjust by 4%, home/end snap
    handle.addEventListener('keydown', (e) => {
      const current = parseFloat(handle.getAttribute('aria-valuenow') || '50');
      let next = current;
      if (e.key === 'ArrowLeft') next -= 4;
      else if (e.key === 'ArrowRight') next += 4;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = 100;
      else return;
      e.preventDefault();
      set(next);
    });

    // Also allow dragging by clicking anywhere on the frame
    frame.addEventListener('pointerdown', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      fromEvent(e);
    });

    set(50);
  }

  // ---------- Form ----------
  const form = document.getElementById('inspectForm');
  const status = document.getElementById('formStatus');
  if (form) {
    // Load webhook URL from brand.json — cached in memory for the session.
    let webhook = 'https://services.leadconnectorhq.com/hooks/example/summit';
    fetch('brand.json').then(r => r.ok ? r.json() : null).then(b => { if (b?.FORM_WEBHOOK_URL) webhook = b.FORM_WEBHOOK_URL; }).catch(() => {});

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.name || !data.phone || !data.address) {
        status.textContent = 'Name, phone, and address required — the estimator needs those before knocking.';
        return;
      }
      status.textContent = 'Sending…';
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, source: 'summit-roofing.web', at: new Date().toISOString() }),
          mode: 'no-cors'
        });
      } catch (_) { /* graceful */ }
      form.reset();
      status.textContent = 'Booked. You\'ll hear from Doug or Ashley within one business hour.';
    });
  }

  // ---------- Service card entrance stagger ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `svcRise .8s cubic-bezier(.2,.9,.2,1) ${i * .08}s both`;
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.service, .review').forEach(el => io.observe(el));

  // Inject keyframes once
  const style = document.createElement('style');
  style.textContent = '@keyframes svcRise{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}';
  document.head.appendChild(style);

  // Reduced motion — kill the entrance stagger
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.service, .review').forEach(el => el.style.animation = 'none');
  }
})();
