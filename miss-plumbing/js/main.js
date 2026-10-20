/* Miss Plumbing: no dependencies. Animations are transform/opacity only and skipped for prefers-reduced-motion. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Scroll reveals */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* Animated counters (final value is already in the HTML for no-JS / reduced motion) */
  const fmt = (n, dec) => dec ? n.toFixed(dec) : Math.round(n).toLocaleString('en-GB');
  const counters = $$('.count');
  if ('IntersectionObserver' in window && !reduce) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        const el = e.target, to = parseFloat(el.dataset.to), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || '';
        const t0 = performance.now(), dur = 1900;
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(to * eased, dec) + (p === 1 ? suf : '');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => co.observe(el));
  }

  /* Header background + sticky action bar */
  const hdr = $('#hdr'), bar = $('#bar'), hero = $('#top');
  const ctaRow = $('.cta-row');
  const onScroll = () => hdr && hdr.classList.toggle('is-solid', scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  if (bar && ctaRow && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle('is-on', !e.isIntersecting)).observe(ctaRow);
  } else if (bar) {
    bar.classList.add('is-on');
  }

  /* "Open now" (Europe/London, 8am to 8pm daily) */
  const openEl = $('#open-now');
  if (openEl) {
    try {
      const h = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(new Date()) % 24;
      openEl.textContent = h >= 8 && h < 20 ? 'Open now until 8pm.' : 'Closed now. Message us and we\'ll reply first thing.';
    } catch (_) { /* keep static text */ }
  }

  /* Before / after sliders (transform-driven) */
  $$('[data-ba]').forEach(ba => {
    const input = $('input', ba);
    const set = () => ba.style.setProperty('--p', input.value + '%');
    input.addEventListener('input', set);
    set();
  });

  /* Tap ripple on primary buttons */
  if (!reduce) {
    document.addEventListener('pointerdown', e => {
      const btn = e.target.closest('[data-ripple]');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const dot = document.createElement('span');
      dot.className = 'ripple';
      dot.style.left = e.clientX - r.left + 'px';
      dot.style.top = e.clientY - r.top + 'px';
      btn.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove());
    }, { passive: true });
  }

  /* Quote form. Posts to Formspree; until an ID is set it opens a pre-filled WhatsApp message instead. */
  const form = $('#quote-form'), msg = $('#form-msg');
  if (form) {
    const say = (text, err) => { msg.textContent = text; msg.hidden = false; msg.classList.toggle('is-err', !!err); };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = new FormData(form);
      if (data.get('_gotcha')) return;
      const btn = $('button[type=submit]', form);
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        if (form.action.includes('YOUR_FORM_ID')) {
          const text = `Hi Claire, quote request from ${data.get('name')} (${data.get('phone')}), ${String(data.get('postcode')).toUpperCase()}: ${data.get('issue')}`;
          window.open('https://wa.me/447921138879?text=' + encodeURIComponent(text), '_blank', 'noopener');
          say('Thanks! WhatsApp is opening with your details. Just press send.');
        } else {
          const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(res.status);
          form.reset();
          say('Thank you! We\'ll be in touch very shortly.');
        }
      } catch (_) {
        say('Sorry, that didn\'t send. Please call 07921 138879 or message us on WhatsApp.', true);
      } finally {
        btn.disabled = false; btn.textContent = label;
      }
    });
  }
})();
