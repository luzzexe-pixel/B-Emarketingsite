(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---- Intro (plays on every visit, deliberately not skippable) ----
  const intro = $("#intro"), root = document.documentElement;
  const lock = on => $$("header, main, footer").forEach(el => { el.inert = on; });
  const endIntro = () => {
    if (!root.classList.contains("intro-on")) return;
    root.classList.add("intro-out"); root.classList.remove("intro-on"); lock(false);
    setTimeout(() => { root.classList.remove("intro-out", "intro-go", "intro-vid"); intro && intro.remove(); }, 900);
  };
  if (intro && root.classList.contains("intro-on")) {
    lock(true);
    const img = intro.querySelector("img");
    const ready = img && img.decode ? Promise.race([img.decode().catch(() => {}), new Promise(r => setTimeout(r, 1200))]) : Promise.resolve();
    const vid = $("#introVideo"), saver = navigator.connection && navigator.connection.saveData;
    const tryVideo = () => new Promise(res => {
      if (!vid || reduce || saver || !vid.dataset.src) return res(false);
      let done = false; const fin = ok => { if (!done) { done = true; res(ok); } };
      vid.addEventListener("canplaythrough", () => fin(true), { once: true });
      vid.addEventListener("error", () => fin(false), { once: true });
      setTimeout(() => fin(false), 3000);
      vid.src = vid.dataset.src; vid.load();
    });
    Promise.all([ready, tryVideo()]).then(([, ok]) => {
      if (ok) {
        root.classList.add("intro-vid", "intro-go");
        vid.play().catch(() => {});
        setTimeout(endIntro, 6900);
      } else {
        if (vid) { vid.removeAttribute("src"); vid.load(); }
        root.classList.add("intro-go"); setTimeout(endIntro, reduce ? 1600 : 4300);
      }
    });
  } else { lock(false); if (intro) intro.remove(); }

  // ---- Sample cards (edit freely) ----
  const CARDS = [
    ["Kitchen", "Who told you to open the fridge?"],
    ["Rules", "What did “we will see” actually mean?"],
    ["Guilt", "“Do you think money grows on trees?” Name the exact moment you heard it."],
    ["Manners", "Which elder did you have to greet first, even mid-game of football?"],
    ["Food", "Which dish was “just a little something” and was actually forty portions?"],
    ["Church", "How long was the longest service you survived, and what did you eat after?"],
    ["School", "Who in the family compared your report card with a cousin’s?"],
    ["The Look", "Which look from your parent could end an argument across the room?"]
  ];
  const grid = $("#cardGrid");
  if (grid) {
    grid.innerHTML = CARDS.map((c, i) => `
      <li class="flip reveal" style="--d:${(i % 4) * 0.07}s">
        <button type="button" aria-pressed="false" aria-label="Card ${i + 1}, ${c[0]}. Tap to flip.">
          <span class="face front"><span class="k">${c[0]}</span><span class="big">${String(i + 1).padStart(2, "0")}</span><span class="tap">Tap to flip</span></span>
          <span class="face back"><small>${c[0]}</small><p>${c[1]}</p></span>
        </button>
      </li>`).join("");
    grid.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const on = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", !on);
      b.setAttribute("aria-label", b.getAttribute("aria-label").replace(/Tap to flip\.?|Tap to flip back\.?/, on ? "Tap to flip." : "Tap to flip back."));
    });
  }

  // ---- Nav ----
  const nav = $("#nav"), burger = $("#burger"), menu = $("#menu");
  const onScroll = () => nav.classList.toggle("solid", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", () => {
    const o = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", o); menu.classList.toggle("open", o);
  });
  $$("#menu a").forEach(a => a.addEventListener("click", () => { burger.setAttribute("aria-expanded", "false"); menu.classList.remove("open"); }));
  addEventListener("keydown", e => { if (e.key === "Escape") { burger.setAttribute("aria-expanded", "false"); menu.classList.remove("open"); } });

  // ---- Active link ----
  if ("IntersectionObserver" in window) {
    const links = $$("#menu a[href^='#']:not(.btn)");
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(s => so.observe(s));
  }

  // ---- Reveals ----
  const rev = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    rev.forEach(el => io.observe(el));
  } else rev.forEach(el => el.classList.add("in"));

  // ---- Counters ----
  const fmt = n => n.toLocaleString("en-GB");
  const counters = $$(".count");
  const run = el => {
    const to = +el.dataset.to, suf = el.dataset.suffix || "";
    if (reduce) { el.textContent = fmt(to) + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = t => { const p = Math.min((t - t0) / dur, 1), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.textContent = fmt(v) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } }), { threshold: .6 });
    counters.forEach(c => co.observe(c));
  } else counters.forEach(run);

  // ---- Magnetic buttons ----
  if (finePointer && !reduce) {
    $$("[data-magnetic]").forEach(b => {
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      b.addEventListener("pointerleave", () => b.style.transform = "");
    });
  }

  // ---- Hero video (set data-src on #heroVideo; see README) ----
  const v = $("#heroVideo");
  const saver = navigator.connection && navigator.connection.saveData;
  if (v && v.dataset.src && !reduce && !saver) {
    v.src = v.dataset.src;
    v.addEventListener("canplay", () => { v.classList.add("on"); v.play().catch(() => {}); }, { once: true });
  }

  // ---- Edition buttons preselect the form ----
  $$("[data-pick]").forEach(a => a.addEventListener("click", () => { const s = $("#edition"); if (s) s.value = a.dataset.pick; }));

  // ---- Form ----
  const form = $("#form"), msg = $("#msg");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    msg.className = "msg";
    const name = form.name.value.trim(), email = form.email.value.trim();
    if (!name) { msg.textContent = "Please add your name."; msg.classList.add("err"); form.name.focus(); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = "Please enter a valid email address."; msg.classList.add("err"); form.email.focus(); return; }
    if (form["bot-field"].value) return;
    const btn = form.querySelector("button[type=submit]"); btn.disabled = true; msg.textContent = "Sending...";
    const placeholder = form.action.includes("YOUR_FORM_ID");
    try {
      if (placeholder) { await new Promise(r => setTimeout(r, 600)); }
      else {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error();
      }
      msg.textContent = placeholder ? "Demo mode: form endpoint not connected yet (see README). Thank you!" : "Thank you! We will be in touch soon.";
      form.reset();
    } catch (_) { msg.textContent = "Something went wrong. Please email us instead."; msg.classList.add("err"); }
    btn.disabled = false;
  });

  // ---- Cookie banner (UK: reject as easy as accept, no non-essential before consent) ----
  const ck = $("#cookie"), KEY = "dap_cookie_consent";
  const get = () => { try { return localStorage.getItem(KEY); } catch (_) { return null; } };
  const set = v => { try { localStorage.setItem(KEY, v); } catch (_) {} ck.hidden = true;
    if (v === "all") window.dispatchEvent(new CustomEvent("dap:consent", { detail: "all" })); };
  if (!get()) ck.hidden = false;
  $("#ckAccept").addEventListener("click", () => set("all"));
  $("#ckReject").addEventListener("click", () => set("essential"));
  $("#cookieSettings").addEventListener("click", e => { e.preventDefault(); ck.hidden = false; $("#ckReject").focus(); });
  // Load analytics here only after: window.addEventListener("dap:consent", ...) or get()==="all"

  $("#yr").textContent = new Date().getFullYear();
})();
