/* THE BRASS LINE: one brass pipe runs down the homepage, drawn by scroll.
   Native SVG, no libraries. Water flows through it, each section's eyebrow sits at a valve-wheel station
   (the active one turns and glows glacier), and it ends in the tap above the quote form.
   Reduced motion: the pipe is shown fully drawn and static. Without JS it simply is not there. */
(() => {
  'use strict';
  const main = document.getElementById('main');
  const tapwrap = document.getElementById('tapwrap');
  const hero = document.getElementById('top');
  if (!main || !tapwrap || !hero) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (n, a = {}, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  let svg, pipe, hl, water, ghost, beads = [], stns = [], len = 0, y0 = 0, yEnd = 0, mainTop = 0, vr = 0;

  const rel = el => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY - mainTop, bottom: r.bottom + scrollY - mainTop, left: r.left, width: r.width, h: r.height }; };

  function build() {
    if (svg) svg.remove();
    mainTop = main.getBoundingClientRect().top + scrollY;
    const H = main.offsetHeight, W = main.offsetWidth;
    const wrapEl = document.querySelector('.sec .wrap'), pad = parseFloat(getComputedStyle(wrapEl).paddingLeft) || 38;
    const x = Math.round(wrapEl.getBoundingClientRect().left + pad * .4);
    vr = innerWidth < 700 ? 7 : 9;
    const tap = rel(tapwrap), hb = rel(hero).bottom;
    y0 = hb; const tapTop = tap.top + 4, yh = tapTop - 34, cx = Math.round(tap.left + tap.width / 2), r = 26;
    yEnd = yh;
    svg = mk('svg', { class: 'bl', viewBox: `0 0 ${W} ${H}`, width: W, height: H, 'aria-hidden': 'true', focusable: 'false' });
    svg.style.top = '0';
    const defs = mk('defs', {}, svg);
    const grad = mk('linearGradient', { id: 'blgrad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: H }, defs);
    const secs = [...main.querySelectorAll(':scope > section')];
    secs.forEach(s => {
      const b = rel(s), light = /t-(porcelain|mist)/.test(s.className), c = light ? '#7E5F24' : '#C9A35C';
      mk('stop', { offset: Math.max(0, b.top / H), 'stop-color': c }, grad); mk('stop', { offset: Math.min(1, b.bottom / H), 'stop-color': c }, grad);
    });
    const d = `M${x} ${y0}V${yh - r}Q${x} ${yh} ${x + r} ${yh}H${cx - r}Q${cx} ${yh} ${cx} ${yh + r}V${tapTop}`;
    ghost = mk('path', { class: 'ghost', d }, svg);
    pipe = mk('path', { class: 'pipe', d, pathLength: 1 }, svg);
    hl = mk('path', { class: 'hl', d, transform: 'translate(-1.2 0)' }, svg);
    water = mk('path', { class: 'water', d }, svg);
    len = ghost.getTotalLength();
    [pipe, hl, water].forEach(p => { p.setAttribute('pathLength', len); p.style.strokeDasharray = len; });
    // compression joints at each section break (except the hero)
    secs.slice(1).forEach(s => {
      const b = rel(s); if (b.top < y0 + 20 || b.top > yh - 20) return;
      const light = /t-(porcelain|mist)/.test(s.className);
      const g = mk('g', { class: 'joint' + (light ? ' on-light' : '') }, svg);
      mk('rect', { x: x - 7, y: b.top - 5, width: 14, height: 10, rx: 2 }, g);
    });
    // stations: a valve wheel beside each eyebrow
    stns = [...main.querySelectorAll('[data-station]')].map(eb => {
      const b = rel(eb), light = !!eb.closest('.t-porcelain,.t-mist'), cy = Math.round(b.top + b.h / 2);
      if (cy < y0 || cy > yh) return null;
      const g = mk('g', { class: 'stn' + (light ? ' on-light' : ''), transform: `translate(${x} ${cy})` }, svg);
      mk('circle', { class: 'rim', r: vr }, g);
      mk('path', { class: 'spokes', d: `M${-vr + 3} 0H${vr - 3}M0 ${-vr + 3}V${vr - 3}` }, g);
      return { g, y: cy };
    }).filter(Boolean);
    beads = reduce ? [] : [0, 1, 2].map(() => mk('circle', { class: 'bead', r: 3 }, svg));
    main.prepend(svg);
    update();
  }

  let ticking = false, drawn = 0;
  function update() {
    ticking = false;
    const vy = scrollY + innerHeight * .62 - mainTop;
    const p = reduce ? 1 : Math.max(0, Math.min(1, (vy - y0) / (yEnd - y0 + 160)));
    drawn = len * p;
    [pipe, hl, water].forEach(el => { el.style.strokeDashoffset = len - drawn; });
    let act = null; stns.forEach(s => { if (s.y <= vy) act = s; });
    stns.forEach(s => s.g.classList.toggle('is-active', !reduce && s === act));
    if (reduce) stns.forEach(s => s.g.classList.remove('is-active'));
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });

  // luminous water beads travel along the drawn part of the pipe
  if (!reduce) {
    let t0 = performance.now();
    const loop = now => {
      if (!document.hidden && svg && drawn > 30) {
        beads.forEach((b, i) => {
          const t = (((now - t0) / 9000) + i / beads.length) % 1, pt = ghost.getPointAtLength(t * drawn);
          b.setAttribute('cx', pt.x); b.setAttribute('cy', pt.y); b.style.opacity = Math.sin(t * Math.PI).toFixed(2);
        });
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  let rt; const rebuild = () => { clearTimeout(rt); rt = setTimeout(build, 150); };
  addEventListener('resize', rebuild);
  if ('ResizeObserver' in window) { let last = main.offsetHeight; new ResizeObserver(() => { if (Math.abs(main.offsetHeight - last) > 4) { last = main.offsetHeight; rebuild(); } }).observe(main); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild);
  addEventListener('load', build);
  build();
})();
