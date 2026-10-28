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
    $$('.count').forEach(el => co.observe(el));
  }

  /* Header shadow + sticky mobile action bar */
  const hdr = $('#hdr'), bar = $('#bar'), ctaRow = $('.cta-row');
  const onScroll = () => hdr && hdr.classList.toggle('is-solid', scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  if (bar && ctaRow && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle('is-on', !e.isIntersecting)).observe(ctaRow);
  } else if (bar) {
    bar.classList.add('is-on');
  }

  /* Sticky section menu: highlight the section in view */
  const nav = $('#nav');
  if (nav && 'IntersectionObserver' in window) {
    const links = $$('a[href^="#"]', nav);
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const link = map.get(e.target.id);
        if (!link || !e.isIntersecting) return;
        links.forEach(a => a.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'true');
        if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: link.offsetLeft - 24, behavior: reduce ? 'auto' : 'smooth' });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, id) => { const sec = document.getElementById(id); if (sec) spy.observe(sec); });
  }

  /* "Open now" (Europe/London, 8am to 8pm daily) */
  const openEl = $('#open-now');
  if (openEl) {
    try {
      const h = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(new Date()) % 24;
      openEl.textContent = h >= 8 && h < 20 ? 'Open now until 8pm.' : 'Closed now. Message us and we\'ll reply first thing.';
    } catch (_) { /* keep static text */ }
  }

  /* Hero background video. Starts after page load; skipped for reduced motion, Data Saver and slow connections.
     Clips are set in the data-* attributes on #hero-video (see README). Until then the poster image shows. */
  const vid = $('#hero-video'), pauseBtn = $('#hero-pause'), heroEl = $('#top');
  if (vid && !reduce) {
    const conn = navigator.connection || {};
    const slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    const small = matchMedia('(max-width: 767px)').matches;
    const mp4 = (small && vid.dataset.mp4Mobile) || vid.dataset.mp4;
    const webm = !small && vid.dataset.webm && vid.canPlayType('video/webm; codecs="vp9"') ? vid.dataset.webm : '';
    if (!slow && (mp4 || webm)) {
      let userPaused = false, inView = true;
      const setLabel = () => {
        const paused = vid.paused;
        pauseBtn.setAttribute('aria-pressed', String(paused));
        $('span', pauseBtn).textContent = paused ? 'Play video' : 'Pause video';
        $('use', pauseBtn).setAttribute('href', paused ? '#i-play' : '#i-pause');
      };
      const start = () => {
        [webm, mp4].filter(Boolean).forEach(src => {
          const s = document.createElement('source');
          s.src = src; s.type = src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
          vid.appendChild(s);
        });
        vid.addEventListener('playing', () => { vid.classList.add('is-playing'); pauseBtn.hidden = false; setLabel(); }, { once: true });
        vid.addEventListener('error', () => vid.remove(), { capture: true, once: true });
        vid.load();
        vid.play().catch(() => { /* autoplay refused: poster stays */ });
      };
      pauseBtn.addEventListener('click', () => {
        userPaused = !vid.paused;
        if (userPaused) vid.pause(); else vid.play().catch(() => {});
        setLabel();
      });
      const sync = () => { if (userPaused || !vid.classList.contains('is-playing')) return; (inView && !document.hidden) ? vid.play().catch(() => {}) : vid.pause(); };
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }).observe(heroEl);
      document.addEventListener('visibilitychange', sync);
      const go = () => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 600));
      document.readyState === 'complete' ? go() : addEventListener('load', go, { once: true });
    }
  }

  /* Before / after sliders (transform-driven) */
  $$('[data-ba]').forEach(ba => {
    const input = $('input', ba);
    const set = () => ba.style.setProperty('--p', input.value + '%');
    input.addEventListener('input', set);
    set();
  });

  /* "Request a quote" buttons pre-select the service in the form, then the link scrolls to it */
  const svc = $('#f-service');
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-service]');
    if (a && svc) svc.value = a.dataset.service;
  });

  /* Tap ripple on buttons */
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
          const text = `Hi Claire, quote request from ${data.get('name')} (${data.get('phone')}), ${String(data.get('postcode')).toUpperCase()}. Service: ${data.get('service')}. ${data.get('issue')}`;
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
