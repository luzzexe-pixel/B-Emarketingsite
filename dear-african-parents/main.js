(() => {
  const Q = [
    ["Personality","Which part of your personality is most like the person who raised you?"],
    ["Personality","What is a compliment you never quite knew how to accept?"],
    ["Personality","When were you told you were “too much”, and were they right?"],
    ["Personality","What do you do when you are proud but don’t want to show it?"],
    ["Personality","Which of your habits would make your elders nod in approval?"],
    ["Personality","What did you want to be at ten, and who talked you out of it?"],
    ["Personality","What is the bravest thing you’ve done that nobody in your family knows about?"],
    ["Culture","Which dish instantly takes you home?"],
    ["Culture","What proverb did you hear so often it became part of you?"],
    ["Culture","Which word in your language has no honest translation?"],
    ["Culture","What tradition would you fight to keep alive?"],
    ["Culture","What song makes everyone in your family get up and dance?"],
    ["Culture","How do you greet someone you respect?"],
    ["Culture","What does “being well brought up” mean where you come from?"],
    ["Childhood","Which meal meant you were in trouble?"],
    ["Childhood","What did “we’ll see” really mean?"],
    ["Childhood","What chore did you do that your friends never had to?"],
    ["Childhood","What was the one house rule that was never explained?"],
    ["Childhood","Who was your favourite ‘auntie’ who wasn’t actually your auntie?"],
    ["Childhood","What did you hide from your parents, and do they know now?"],
    ["Childhood","What was the sound that told you it was time to come home?"],
    ["Childhood","What did you promise yourself you would never say to your own children?"],
    ["Family","Who in your family could silence a room with a look?"],
    ["Family","What is the one story your family tells at every gathering?"],
    ["Family","What sacrifice did someone make for you that you only understood later?"],
    ["Family","What would you say to your parents if you knew they would simply listen?"],
    ["Family","Which relative do you quietly hope you grow up to be like?"],
    ["Family","What have you said ‘thank you’ for in your heart but never out loud?"],
    ["Family","What do you most want to ask your grandparents?"],
    ["Family","Who is the glue of your family, and have you told them?"]
  ];
  const $ = s => document.querySelector(s);
  const html = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // nav background
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", onScroll, {passive:true}); onScroll();

  // scroll reveal
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.15, rootMargin:"0px 0px -40px 0px"});
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add("in"));

  // card game
  const card = $("#card"), text = $("#cardText"), catEl = $("#cardCat"), live = $("#live"), count = $("#count");
  let cat = "all", deck = [], seen = 0, current = null, flipped = false;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rebuild = () => { deck = shuffle(Q.filter(q => cat === "all" || q[0] === cat)); seen = 0; };
  const total = () => Q.filter(q => cat === "all" || q[0] === cat).length;
  rebuild();

  function draw() {
    if (!deck.length) rebuild();
    current = deck.pop(); seen++;
    const show = () => {
      catEl.textContent = current[0]; text.textContent = current[1];
      live.textContent = current[0] + ": " + current[1];
      count.textContent = "CARD " + seen + " OF " + total();
      card.classList.add("flipped"); flipped = true;
    };
    if (flipped && !reduce) { card.classList.remove("flipped"); flipped = false; setTimeout(show, 420); }
    else show();
    card.setAttribute("aria-label", "Draw next card");
  }
  card.addEventListener("click", draw);
  $("#next").addEventListener("click", draw);

  document.querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b));
    cat = b.dataset.cat; rebuild(); count.textContent = ""; draw();
  }));

  $("#share").addEventListener("click", async e => {
    if (!current) { draw(); return; }
    const msg = "“" + current[1] + "” — Dear African Parents";
    const btn = e.currentTarget, old = btn.textContent;
    try {
      if (navigator.share) await navigator.share({text: msg, url: location.href});
      else { await navigator.clipboard.writeText(msg + " " + location.href); btn.textContent = "Copied"; setTimeout(() => btn.textContent = old, 1600); }
    } catch (_) {}
  });

  // waitlist form (front-end only: connect to your email provider)
  const form = $("#form"), msg = $("#msg");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#email").value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { msg.textContent = "Please enter a valid email address."; $("#email").focus(); return; }
    // TODO: POST to your email provider / form endpoint here.
    msg.textContent = "Thank you. We’ll be in touch.";
    form.reset();
  });

  $("#yr").textContent = new Date().getFullYear();
})();
