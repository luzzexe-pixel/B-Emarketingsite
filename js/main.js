/* B&E Marketing: lightweight, dependency-free interactions.
   Every motion effect is skipped when the visitor prefers reduced motion. */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  let reduced = reduceMQ.matches;
  reduceMQ.addEventListener?.('change', e => { reduced = e.matches; });

  const safeStore = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  };

  /* ---------- Footer year ---------- */
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled state, mobile menu, active link, progress bar ---------- */
  const nav = $('.nav');
  const menu = $('#nav-menu');
  const toggle = $('.nav__toggle');
  const bar = $('.progress span');
  let ticking = false;

  const onScroll = () => {
    ticking = false;
    nav.classList.toggle('is-scrolled', scrollY > 24);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar && !reduced) bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  if ('IntersectionObserver' in window) {
    const links = $$('.nav__links a[href^="#"]:not(.btn)');
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(l => { const s = $(l.getAttribute('href')); if (s) spy.observe(s); });
    const contact = $('#contact'); if (contact) spy.observe(contact); // clears the active link
  }

  /* ---------- Headline: split into words for the reveal ---------- */
  $$('[data-words]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    const text = el.textContent.trim();
    el.innerHTML = `<span class="sr-only">${text}</span>` +
      words.map((w, i) => `<span class="w" aria-hidden="true" style="--i:${i}"><i>${w}</i></span>`).join(' ');
  });

  /* ---------- Stagger children, then reveal on scroll ---------- */
  $$('[data-stagger]').forEach(group => {
    $$('[data-reveal]', group).forEach((el, i) => { if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${Math.min(i, 5) * 90}ms`); });
  });

  // Counters
  const fmt = (n, dec) => n.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const runCounter = el => {
    const target = parseFloat(el.dataset.count);
    const dec = +(el.dataset.decimals || 0);
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduced) { el.textContent = pre + fmt(target, dec) + suf; return; }
    const dur = 1600, t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + fmt(target * eased, dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const revealables = $$('[data-reveal], [data-words], .step');
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        $$('[data-count]', en.target).forEach(runCounter);
        if (en.target.matches('[data-count]')) runCounter(en.target);
        obs.unobserve(en.target);
      });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('is-in'));
    counters.forEach(runCounter);
  }

  /* ---------- Hero video ---------- */
  const video = $('#hero-video');
  if (video) {
    const conn = navigator.connection || {};
    const lowData = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    if (reduced || lowData) {
      video.remove(); // poster image only
    } else {
      const mobile = matchMedia('(max-width: 767px)').matches;
      if (mobile && video.dataset.posterMobile) video.poster = video.dataset.posterMobile;
      // Not every browser honours <source media>, so keep only the sources for this screen size
      $$('source', video).forEach(s => { if (!!s.media !== mobile) s.remove(); });
      const start = () => {
        video.load();
        const p = video.play();
        if (p?.catch) p.catch(() => video.remove());
      };
      video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
      // If every source 404s (placeholder files not swapped yet) the poster stays visible.
      const last = $$('source', video).pop();
      last?.addEventListener('error', () => video.remove());
      // Wait for the page to settle so the video never competes with first paint
      if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });
      // Pause when off-screen or tab hidden to save battery
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([en]) => {
          if (!video.isConnected || !video.classList.contains('is-playing')) return;
          en.isIntersecting ? video.play().catch(() => {}) : video.pause();
        }, { threshold: .05 }).observe(video);
      }
      document.addEventListener('visibilitychange', () => {
        if (!video.isConnected || !video.classList.contains('is-playing')) return;
        document.hidden ? video.pause() : video.play().catch(() => {});
      });
    }
  }

  /* ---------- Section films: load only when near the screen, play only while visible ---------- */
  $$('.film__video').forEach(v => {
    const conn = navigator.connection || {};
    if (reduced || conn.saveData || !('IntersectionObserver' in window)) return; // poster only
    let loaded = false;
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        if (!loaded) { loaded = true; $$('source', v).forEach(s => { s.src = s.dataset.src; }); v.load(); }
        v.play().then(() => v.classList.add('is-playing')).catch(() => {});
      } else v.pause();
    }, { rootMargin: '200px 0px', threshold: 0 }).observe(v);
  });

  /* ---------- Magnetic buttons + card spotlight (mouse/trackpad only) ---------- */
  if (finePointer) {
    $$('[data-magnetic]').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        if (reduced) return;
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .25;
        const y = (e.clientY - r.top - r.height / 2) * .35;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
    $$('[data-spotlight]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Package buttons pre-select the form ---------- */
  $$('[data-package]').forEach(a => a.addEventListener('click', () => {
    const sel = $('#service');
    if (sel) sel.value = a.dataset.package;
  }));

  /* ---------- Contact form ---------- */
  const form = $('#contact-form');
  if (form) {
    const status = $('.form__status', form);
    const say = (msg, cls) => { status.textContent = msg; status.className = 'form__status field--full ' + (cls || ''); };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (form.action.includes('YOUR_FORM_ID')) {
        say('Form not connected yet. Add your Formspree ID (see README) or email us directly.', 'is-err');
        return;
      }
      const btn = $('button[type="submit"]', form);
      btn.disabled = true; say('Sending…');
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        say('Thanks, we’ve got your message and will reply within one working day.', 'is-ok');
      } catch {
        say('Sorry, something went wrong. Please try again or call us on 01708 000 000.', 'is-err');
      } finally { btn.disabled = false; }
    });
  }

  /* ---------- Cookie banner (UK PECR / UK GDPR) ----------
     Nothing non-essential runs until the visitor accepts. Wire up analytics inside loadAnalytics(). */
  const banner = $('#cookie-banner');
  const KEY = 'bem_consent';
  const loadAnalytics = () => {
    // Add your analytics here, e.g. Google Analytics 4 / Plausible. Runs only after consent.
  };
  const save = analytics => {
    safeStore.set(KEY, JSON.stringify({ analytics, at: Date.now() }));
    banner.hidden = true;
    if (analytics) loadAnalytics();
  };
  if (banner) {
    let saved = null;
    try { saved = JSON.parse(safeStore.get(KEY)); } catch { /* ignore */ }
    if (saved) { if (saved.analytics) loadAnalytics(); } else banner.hidden = false;

    const opts = $('.cookie__options', banner);
    banner.addEventListener('click', e => {
      const b = e.target.closest('[data-cookie]'); if (!b) return;
      const act = b.dataset.cookie;
      if (act === 'accept') save(true);
      else if (act === 'reject') save(false);
      else if (opts.hidden) { opts.hidden = false; b.textContent = 'Save choices'; }
      else save($('#cookie-analytics').checked);
    });
    $$('[data-cookie-settings]').forEach(btn => btn.addEventListener('click', () => {
      banner.hidden = false; opts.hidden = true;
      $('[data-cookie="customise"]', banner).textContent = 'Customise';
      $('[data-cookie="accept"]', banner).focus();
    }));
  }
})();
