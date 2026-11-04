/* JH Plumbing & Heating: no dependencies. Motion is transform/opacity only and skipped for prefers-reduced-motion.
   Everything here is an enhancement: with JavaScript off the site still reads, links and calls. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const store = { get: k => { try { return localStorage.getItem(k); } catch (_) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} } };
  const track = (name, props) => { try { if (window.plausible) window.plausible(name, props ? { props } : undefined); } catch (_) {} };
  /* Site base, worked out from this script's own URL, so links work from a domain root or a subfolder */
  const BASE = (() => { try { return new URL('../', document.currentScript.src).pathname; } catch (_) { return '/'; } })();
  const body = document.body;
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* Click tracking for calls, WhatsApp and emergency */
  document.addEventListener('click', e => { const a = e.target.closest('[data-track]'); if (a) track(a.dataset.track); });

  /* Scroll reveals: fade + 24px rise, staggered, once */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    reveals.forEach(el => io.observe(el));
    const mio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); mio.unobserve(e.target); } }), { threshold: .5 });
    $$('.medal').forEach(m => mio.observe(m));
  } else { reveals.forEach(el => el.classList.add('is-in')); $$('.medal').forEach(m => m.classList.add('is-in')); }

  /* Animated counters. Final values are already in the HTML. */
  if ('IntersectionObserver' in window && !reduce) {
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; co.unobserve(e.target);
      const el = e.target, to = parseFloat(el.dataset.to), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || '', t0 = performance.now();
      const tick = now => { const p = Math.min((now - t0) / 1800, 1), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-GB')) + (p === 1 ? suf : ''); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: .6 });
    $$('.count').forEach(el => co.observe(el));
  }

  /* Header: solid after scroll, mobile drawer */
  const hdr = $('#hdr');
  const onScroll = () => hdr && hdr.classList.toggle('is-solid', scrollY > 40);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  const drawer = $('#drawer'), menu = $('#menu'), menuX = $('#menu-x');
  if (drawer && menu) {
    const set = open => { drawer.hidden = !open; menu.setAttribute('aria-expanded', String(open)); document.documentElement.style.overflow = open ? 'hidden' : ''; if (open) menuX.focus(); else menu.focus(); };
    menu.addEventListener('click', () => set(true)); menuX.addEventListener('click', () => set(false));
    addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) set(false); });
  }

  /* Sticky mobile bar: appears after the hero CTAs scroll away, hides while the form button is in view */
  const bar = $('#bar'), ctaRow = $('.cta-row'), submit = $('#quote-form button[type=submit]');
  if (bar && 'IntersectionObserver' in window) {
    let heroGone = !ctaRow, formVisible = false;
    const upd = () => bar.classList.toggle('is-on', heroGone && !formVisible);
    if (ctaRow) new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting; upd(); }).observe(ctaRow);
    if (submit) new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; upd(); }, { rootMargin: '0px 0px 80px 0px' }).observe(submit);
    if (!ctaRow) { const on = () => { heroGone = scrollY > 360; upd(); }; on(); addEventListener('scroll', on, { passive: true }); } else upd();
  } else if (bar) bar.classList.add('is-on');

  /* Section menu highlights the section in view (header links and mobile chips) */
  const navs = [$('#nav'), $('#chips')].filter(Boolean);
  if (navs.length && 'IntersectionObserver' in window) {
    const sections = new Map();
    navs.forEach(n => $$('a[href^="#"]', n).forEach(a => { const id = a.getAttribute('href').slice(1), s = document.getElementById(id); if (s) sections.set(s, id); }));
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      navs.forEach(n => $$('a', n).forEach(a => { const on = a.getAttribute('href') === '#' + sections.get(e.target); a.toggleAttribute('aria-current', on); if (on) a.setAttribute('aria-current', 'true'); if (on && n.id === 'chips' && n.scrollWidth > n.clientWidth) n.scrollTo({ left: a.offsetLeft - 24, behavior: reduce ? 'auto' : 'smooth' }); }));
    }), { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((_, s) => spy.observe(s));
  }

  /* "Open now" in the business's time zone (Europe/London) */
  const open = +body.dataset.open || 7, close = +body.dataset.close || 24;
  const londonNow = () => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', hour12: false, timeZone: 'Europe/London' }).formatToParts(new Date()).map(x => [x.type, x.value])); return (+p.hour % 24) + (+p.minute) / 60; };
  const openEl = $('#open-now'), slotEl = $('#slot');
  const clock = () => {
    try {
      const h = londonNow(), isOpen = h >= open && h < close;
      if (openEl) { openEl.classList.toggle('is-closed', !isOpen); $('span', openEl).textContent = isOpen ? 'Open now · until midnight' : `Closed now · back at ${open}am. Emergency? Call anyway.`; }
      if (slotEl) slotEl.textContent = isOpen ? 'Open now. Call for the next free slot' : `Opening at ${open}am. WhatsApp us and we will reply first thing`;
    } catch (_) { /* keep static text */ }
  };
  clock(); setInterval(clock, 60000);

  /* Hero video: poster first. Starts after load; skipped for reduced motion, Data Saver and 2G. Pauses off-screen. */
  const vid = $('#hero-video'), pauseBtn = $('#hero-pause'), hero = $('#top');
  if (vid && !reduce) {
    const c = navigator.connection || {}, slow = c.saveData || /(^|-)2g$/.test(c.effectiveType || '');
    const small = matchMedia('(max-width:767px)').matches;
    const mp4 = (small && vid.dataset.mp4Mobile) || vid.dataset.mp4;
    const webm = !small && vid.dataset.webm && vid.canPlayType('video/webm; codecs="vp9"') ? vid.dataset.webm : '';
    if (!slow && (mp4 || webm)) {
      let userPaused = false, inView = true;
      const label = () => { const p = vid.paused; pauseBtn.setAttribute('aria-pressed', String(p)); $('span', pauseBtn).textContent = p ? 'Play video' : 'Pause video'; $('use', pauseBtn).setAttribute('href', p ? '#i-play' : '#i-pause'); };
      const start = () => {
        [webm, mp4].filter(Boolean).forEach(src => { const s = document.createElement('source'); s.src = src; s.type = src.endsWith('.webm') ? 'video/webm' : 'video/mp4'; vid.appendChild(s); });
        vid.addEventListener('playing', () => { vid.classList.add('is-playing'); pauseBtn.hidden = false; label(); }, { once: true });
        vid.addEventListener('error', () => vid.remove(), { capture: true, once: true });
        vid.load(); vid.play().catch(() => {});
      };
      pauseBtn.addEventListener('click', () => { userPaused = !vid.paused; userPaused ? vid.pause() : vid.play().catch(() => {}); label(); });
      const sync = () => { if (userPaused || !vid.classList.contains('is-playing')) return; (inView && !document.hidden) ? vid.play().catch(() => {}) : vid.pause(); };
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }).observe(hero);
      document.addEventListener('visibilitychange', sync);
      const go = () => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 600));
      document.readyState === 'complete' ? go() : addEventListener('load', go, { once: true });
    }
  }

  /* Tap ripple */
  if (!reduce) document.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-ripple]'); if (!b) return;
    const r = b.getBoundingClientRect(), d = document.createElement('span'); d.className = 'ripple'; d.style.left = e.clientX - r.left + 'px'; d.style.top = e.clientY - r.top + 'px';
    b.appendChild(d); d.addEventListener('animationend', () => d.remove());
  }, { passive: true });

  /* Desktop only: magnetic primary buttons and a faint cursor light on dark sections */
  if (fine && !reduce) {
    $$('.btn--lg.btn--brass,.btn--xl').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px,${(e.clientY - r.top - r.height / 2) * .18}px)`; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
    const glow = $('#glow');
    if (glow) {
      addEventListener('pointermove', e => { const t = document.elementFromPoint(e.clientX, e.clientY), dark = t && t.closest('.dark,.hero,.phero'); glow.classList.toggle('is-on', !!dark); glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
    }
  }

  /* First-visit intro: a 600ms droplet onto the logo mark. Skippable by scrolling, never blocks content. */
  if (!reduce && !store.get('jh_intro') && $('.logo')) {
    store.set('jh_intro', '1');
    const d = document.createElement('i'); d.className = 'intro-drop'; d.setAttribute('aria-hidden', 'true'); body.appendChild(d);
    d.addEventListener('animationend', () => d.remove()); setTimeout(() => d.remove(), 1200);
  }

  /* Quote form pre-select: from a ?service= link or a data-service button */
  const svc = $('#f-service');
  const bySlug = slug => svc && $$('option', svc).find(o => o.dataset.slug === slug);
  const q = new URLSearchParams(location.search).get('service');
  if (svc && q) { const o = bySlug(q); if (o) svc.value = o.value; }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-service]'); if (!a || !svc) return;
    const m = /service=([^&]+)/.exec(a.getAttribute('href') || ''); const o = m && bySlug(m[1]);
    if (o) { svc.value = o.value; if ($('#quote')) { e.preventDefault(); $('#quote').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); } }
  });

  /* Quote form: honeypot, time-trap, accessible errors, WhatsApp fallback, tap animation on success */
  const form = $('#quote-form');
  if (form) {
    const t0 = Date.now(); $('#f-t').value = String(t0);
    const msg = $('#form-msg'), tapwrap = $('#tapwrap');
    const say = (t, err) => { msg.textContent = t; msg.hidden = false; msg.classList.toggle('is-err', !!err); };
    const rules = { name: v => v.trim().length > 1 || 'Please tell us your name.', phone: v => v.replace(/[^\d+]/g, '').length >= 10 || 'Please enter a phone number we can reach you on.', service: v => !!v || 'Please choose a service.', postcode: v => /^[a-z]{1,2}\d[a-z\d]?\s*\d?[a-z]{0,2}$/i.test(v.trim()) || 'Please enter your postcode.', issue: v => v.trim().length > 4 || 'Please tell us a little about the problem.' };
    const check = f => { const el = form.elements[f], r = rules[f](el.value), err = $('#e-' + f); el.setAttribute('aria-invalid', r === true ? 'false' : 'true'); err.textContent = r === true ? '' : r; return r === true; };
    Object.keys(rules).forEach(f => form.elements[f].addEventListener('blur', () => check(f)));
    const done = () => {
      track('form_submit'); form.hidden = true; const ok = $('#ok'); ok.classList.add('is-on');
      if (tapwrap) { tapwrap.classList.add('is-run'); tapwrap.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); }
    };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const bad = Object.keys(rules).filter(f => !check(f));
      if (bad.length) { form.elements[bad[0]].focus(); say('Please check the highlighted fields.', true); return; }
      const data = new FormData(form);
      if (data.get('_gotcha')) return;
      if (Date.now() - t0 < 2500) { done(); return; } /* time-trap: too fast to be a person */
      const btn = $('button[type=submit]', form), label = btn.textContent; btn.disabled = true; btn.textContent = 'Sending…';
      const whatsapp = () => {
        const text = `Hi Jim, quote request from ${data.get('name')} (${data.get('phone')}), ${String(data.get('postcode')).toUpperCase()}. Service: ${data.get('service')}. ${data.get('issue')}`;
        window.open(`https://wa.me/${document.body.dataset.wa}?text=${encodeURIComponent(text)}`, '_blank', 'noopener'); done();
      };
      try {
        if (form.action.includes('YOUR_FORM_ID')) { whatsapp(); return; }
        const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        form.reset(); done(); setTimeout(() => { if (location.pathname.includes('/quote/')) location.href = BASE + 'thank-you/'; }, 3500);
      } catch (_) { say('Sorry, that did not send. Opening WhatsApp instead so your details are not lost.', true); setTimeout(whatsapp, 900); }
      finally { btn.disabled = false; btn.textContent = label; }
    });
  }

  /* Problem Finder: rooms on the plan select problems; the plain list and links work without JS */
  const fdata = $('#finder-data');
  if (fdata) {
    const probs = JSON.parse(fdata.textContent), chips = $$('#finder-chips a'), card = $('#finder-card'), rooms = $$('.house a[data-room]');
    const show = i => {
      const p = probs[i]; $('#fc-title').textContent = p.label; $('#fc-likely').textContent = p.likely; $('#fc-check').textContent = p.check; $('#fc-speed').textContent = p.speed;
      $('#fc-cta').href = BASE + 'quote/?service=' + p.service; card.hidden = false;
      chips.forEach((c, j) => c.toggleAttribute('aria-current', j === i)); chips[i].setAttribute('aria-current', 'true'); track('finder_select', { problem: p.label });
    };
    const room = r => { rooms.forEach(a => $('.room', a).classList.toggle('is-on', a.dataset.room === r)); chips.forEach((c, i) => { c.parentElement.hidden = !!r && probs[i].room !== r; }); };
    chips.forEach((c, i) => c.addEventListener('click', e => { e.preventDefault(); show(i); }));
    rooms.forEach(a => a.addEventListener('click', e => { e.preventDefault(); const r = a.dataset.room, i = probs.findIndex(p => p.room === r); room(r); show(i); card.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }));
  }

  /* Work filter */
  const wf = $('#work-filter');
  if (wf) wf.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; $$('button', wf).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    $$('#exhibits .frame').forEach(f => { f.hidden = b.dataset.f !== 'All' && f.dataset.job !== b.dataset.f; f.classList.add('is-in'); });
  });

  /* Postcode checker */
  const pc = $('#pc-form');
  if (pc) pc.addEventListener('submit', e => {
    e.preventDefault(); const v = $('#pc').value.trim().toUpperCase().replace(/\s+/g, ''), out = $('#pc-out');
    const m = v.match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})?$/), outward = m ? m[1] : v, near = ['RM1', 'RM2', 'RM3', 'RM5', 'RM11', 'RM12'].includes(outward);
    if (!/^[A-Z]{1,2}\d/.test(v)) out.textContent = 'Please enter a full or partial postcode, for example RM3 9LA.';
    else if (/^RM/.test(v)) out.textContent = near ? 'Yes. Usually within the hour for urgent jobs, depending on the day.' : 'Yes. Usually same day for urgent jobs. Call for a realistic time.';
    else if (/^CM1[345]/.test(v)) out.textContent = 'Yes, we cover Brentwood for planned work and servicing. Call for urgent jobs.';
    else out.textContent = 'Not sure. Call 07980 309332 and Jim will tell you straight whether he can help.';
    track('postcode_check');
  });

  /* Repair or replace quiz */
  const quiz = $('#quiz-form');
  if (quiz) quiz.addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(quiz); let n = 0, a = 0;
    for (let i = 1; i <= 5; i++) { const v = f.get('q' + i); if (v !== null) { n += +v; a++; } }
    const out = $('#quiz-res'); out.hidden = false;
    if (a < 5) { out.textContent = 'Please answer all five questions.'; return; }
    const [t, p] = n <= 3 ? ['Repair looks sensible.', 'A fault on a fairly young, well-supported boiler is usually worth repairing.'] : n <= 6 ? ['It could go either way.', 'Jim can look at it and tell you honestly whether repairing or replacing makes more sense.'] : ['Replacing is worth a serious look.', 'Age, faults and running costs point towards a replacement. Jim will quote for both so you can compare.'];
    out.innerHTML = `<b style="font:400 1.4rem var(--f-display)">${t}</b><p class="muted">${p}</p><a class="btn btn--brass" href="' + BASE + 'quote/?service=boiler-repairs" data-ripple>Get a free quote</a>`; track('quiz_complete');
  });

  /* One gentle desktop exit-intent offer, shown once */
  if (fine && !store.get('jh_exit') && !location.pathname.includes('/quote/') && !location.pathname.includes('/emergency/')) {
    let armed = false; setTimeout(() => { armed = true; }, 15000);
    document.addEventListener('mouseout', e => {
      if (!armed || e.clientY > 0 || e.relatedTarget || store.get('jh_exit')) return; store.set('jh_exit', '1');
      const d = document.createElement('div'); d.className = 'exit'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'exit-h');
      d.innerHTML = '<div class="exit__box"><h2 id="exit-h">Before you go: a free quote?</h2><p>No obligation. Tell us what’s wrong and we’ll reply within 30 minutes during opening hours.</p><p><a class="btn btn--brass" href="' + BASE + 'quote/" data-ripple>Get a free quote</a></p><button class="btn btn--ghost" type="button" style="color:var(--porcelain)">No thanks</button></div>';
      body.appendChild(d); const x = $('button', d); x.focus(); const close = () => d.remove(); x.addEventListener('click', close); d.addEventListener('click', ev => { if (ev.target === d) close(); }); addEventListener('keydown', ev => { if (ev.key === 'Escape') close(); }, { once: true });
    });
  }
})();
