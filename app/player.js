// Narrated video lessons: slides + voice, no skipping ahead, compulsory questions.
(function () {
  "use strict";
  const ALL = window.LESSONS || {};
  const fmt = t => { t = Math.max(0, Math.floor(t)); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); };
  const SA = () => window.SA;
  const esc = s => SA().esc(s);
  const store = () => { const S = SA().S; S.prog.lessons = S.prog.lessons || {}; return S.prog.lessons; };
  const rec = id => store()[id] || {};
  const canSkip = () => SA().isTeacher();

  function lessonsOf(sid) { return ALL[sid] || []; }
  function status(sid, i) {
    const L = lessonsOf(sid)[i], r = rec(L.id);
    if (r.done) return "done";
    if (i > 0 && !rec(lessonsOf(sid)[i - 1].id).done && !canSkip()) return "locked";
    return r.max > 1 ? "progress" : "new";
  }
  function scoreOf(L, r) { const n = L.questions.length; const ok = Object.values(r.first || {}).filter(Boolean).length; return n ? Math.round(ok / n * 100) : 100; }

  function listHTML(s) {
    const ls = lessonsOf(s.id);
    if (!ls.length) return `<div class="empty">The video lessons for this session are being prepared.</div>`;
    const done = ls.filter(L => rec(L.id).done).length;
    const total = Math.round(ls.reduce((a, L) => a + L.duration, 0) / 60);
    return `<div class="card lessons-intro"><div><div class="eyebrow">Self-paced video course</div><h3 style="margin-top:6px">${ls.length} narrated lessons · about ${total} minutes</h3>
      <p class="muted small" style="margin-top:6px">Watch them in order before the live class. The video stops every few minutes for a question: answer it to continue. You cannot skip ahead, but you can always go back.</p></div>
      <div class="lessons-meter"><b>${done}/${ls.length}</b><span class="muted small">completed</span></div></div>
      <div class="lessons">${ls.map((L, i) => {
        const st = status(s.id, i), r = rec(L.id);
        const pct = st === "done" ? 100 : Math.min(99, Math.round((r.max || 0) / L.duration * 100));
        const pill = st === "done" ? `<span class="pill done">Completed · ${scoreOf(L, r)}% first try</span>` : st === "locked" ? `<span class="pill">Locked: finish lesson ${i} first</span>` : st === "progress" ? `<span class="pill live">${pct}% watched</span>` : `<span class="pill">Not started</span>`;
        const btn = st === "locked" ? `<button class="btn" disabled>Locked</button>` : `<button class="btn${st === "done" ? "" : " primary"}" data-lesson="${L.id}">${st === "done" ? "Watch again" : st === "progress" ? "Resume" : "Start"}</button>`;
        return `<div class="lesson card${st === "locked" ? " locked" : ""}"><div class="lesson-no">${s.num}.${i + 1}</div>
          <div class="lesson-main"><h3>${esc(L.title)}</h3><p class="muted small">${esc(L.summary)}</p>
          <div class="row small muted" style="margin-top:8px"><span>${Math.round(L.duration / 60)} min</span><span>·</span><span>${L.questions.length} questions</span><span>·</span><span>Slides ${L.from + 1}–${L.to + 1}</span></div>
          <div class="lesson-bar"><i style="width:${pct}%"></i></div>${window.LIB ? window.LIB.forLesson(L.id) : ""}</div>
          <div class="lesson-side">${pill}${btn}</div></div>`;
      }).join("")}</div>`;
  }

  // ---------- player ----------
  let P = null; // current player state
  const root = () => document.getElementById("lessonPlayer");

  // sentence cues measured on the audio; older manifests fall back to an estimate
  function cueAt(L, t) {
    const c = L.cues; if (!c || !c.length) return null;
    let lo = 0, hi = c.length - 1, k = -1;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (c[m][0] <= t + 0.05) { k = m; lo = m + 1; } else hi = m - 1; }
    return k >= 0 && t <= c[k][1] + 0.6 ? c[k] : null;
  }
  function captionAt(L, t) {
    if (L.cues && L.cues.length) { const c = cueAt(L, t); return c ? c[2] : ""; }
    const seg = L.segs.find(g => t >= g[1] && t <= g[2] + 0.4);
    if (!seg) return "";
    const sents = seg[3].match(/[^.!?]+[.!?]+["']?|\S[^.!?]*$/g) || [seg[3]];
    const total = seg[3].length, frac = (t - seg[1]) / Math.max(0.1, seg[2] - seg[1]);
    let acc = 0;
    for (const s of sents) { acc += s.length; if (acc / total >= frac) return s.trim(); }
    return sents[sents.length - 1].trim();
  }
  // a new slide appears a moment before the voice starts talking about it, so the eye is there first
  const LEAD = 0.7;
  function slideAt(L, t) { let sl = L.from, prev = null; for (const g of L.segs) { const at = prev !== null && g[0] !== prev ? g[1] - LEAD : g[1]; if (at <= t + 0.05) sl = g[0]; else break; prev = g[0]; } return sl; }
  // highlight the item on the slide that the current sentence is about
  const ITEMS = "li, .cardsg>div, tbody tr, .stats>div, .big>div, .flow>div, .hbars>div, .squad>div, .cols2>div, .pollopts>div";
  const STOP = new Set("this that with from they them their there what when where which while your have will would about into than then these those also only more most very just like each every first second third next look here".split(" "));
  const words = s => String(s).toLowerCase().replace(/[^a-z0-9€%]+/g, " ").split(" ").filter(w => w.length > 3 && !STOP.has(w));
  function highlight(text) {
    const st = root().querySelector("#lpStage"); if (!st) return;
    const items = Array.from(st.querySelectorAll(ITEMS)).filter(el => !el.querySelector(ITEMS));
    if (items.length < 2) return;
    const w = new Set(words(text)); let best = null, bs = 0;
    items.forEach(el => { const iw = words(el.textContent); if (!iw.length) return; const hit = iw.filter(x => w.has(x)).length; const sc = hit / Math.sqrt(iw.length); if ((hit >= 2 || (hit === 1 && iw.length <= 3)) && sc > bs) { bs = sc; best = el; } });
    if (!best || best.classList.contains("lp-hl")) return;
    items.forEach(el => el.classList.remove("lp-hl"));
    best.classList.add("lp-hl");
  }

  function open(id) {
    const sid = id.split("-")[0];
    const sess = SA().SESS.find(x => x.id === sid);
    const L = lessonsOf(sid).find(x => x.id === id);
    if (!L || !sess) return;
    const r = Object.assign({ max: 0, pos: 0, answered: {}, first: {} }, rec(id));
    r.answered = Object.assign({}, r.answered); r.first = Object.assign({}, r.first);
    if (r.done) r.pos = 0;
    let el = root();
    if (!el) { el = document.createElement("div"); el.id = "lessonPlayer"; document.body.appendChild(el); }
    el.hidden = false; document.body.classList.add("lp-open");
    el.innerHTML = `<div class="lp" role="dialog" aria-modal="true" aria-label="${esc(L.title)}">
      <div class="lp-top"><div><div class="eyebrow lp-eye">Session ${sess.num} · Lesson ${L.id.split("-l")[1]}</div><b class="lp-title">${esc(L.title)}</b></div><span class="spacer"></span>
      <button class="btn sm lp-ghost" data-lp="cc" aria-pressed="true">Subtitles</button><button class="btn sm lp-ghost" data-lp="close">Close</button></div>
      <div class="lp-stagewrap"><div class="stage lp-stage" id="lpStage"></div>
        <div class="lp-cover" id="lpCover"></div>
        <div class="lp-cc" id="lpCC"></div></div>
      <div class="lp-bar"><button class="lp-play" data-lp="play" aria-label="Play">▶</button><button class="btn sm lp-ghost" data-lp="back" aria-label="Back 10 seconds">−10 s</button>
        <div class="lp-track" id="lpTrack" role="slider" aria-label="Lesson position" tabindex="0"><div class="lp-max" id="lpMax"></div><div class="lp-cur" id="lpCur"></div>${L.questions.map(q => `<span class="lp-q" style="left:${q.t / L.duration * 100}%"></span>`).join("")}</div>
        <span class="lp-time" id="lpTime">0:00 / ${fmt(L.duration)}</span>
        <select id="lpRate" aria-label="Speed"><option value="0.9">0.9×</option><option value="1" selected>1×</option><option value="1.1">1.1×</option><option value="1.25">1.25×</option></select></div>
      <audio id="lpAudio" preload="auto"></audio></div>`;
    const a = el.querySelector("#lpAudio");
    P = { L, sess, r, a, slide: -1, cc: true, q: null, raf: 0, saveT: 0, url: "" };
    // load the whole file into memory so seeking works whatever the host supports
    const me = P;
    fetch(L.audio).then(res => { if (!res.ok) throw new Error(res.status); return res.blob(); })
      .then(b => { if (P !== me) return; me.url = URL.createObjectURL(b); a.src = me.url; })
      .catch(() => { if (P === me) a.src = L.audio; });
    a.addEventListener("canplay", () => { const sb = el.querySelector('[data-lp="start"]'); if (sb && sb.disabled) { sb.disabled = false; sb.textContent = sb.dataset.label; } });
    a.addEventListener("loadedmetadata", () => { if (r.pos > 0 && r.pos < L.duration - 2) a.currentTime = r.pos; draw(true); });
    a.addEventListener("play", () => { setPlayBtn(); loop(); });
    a.addEventListener("pause", () => { setPlayBtn(); persist(); });
    a.addEventListener("ended", finish);
    a.addEventListener("error", () => cover(`<h3>The audio could not be loaded</h3><p>Check your connection and try again.</p><button class="btn primary" data-lp="close">Close</button>`));
    a.addEventListener("seeking", () => { const lim = limit(); if (a.currentTime > lim + 0.3) a.currentTime = lim; });
    showSlide(L.from, true);
    cover(`<div class="eyebrow">${L.questions.length} questions · ${Math.round(L.duration / 60)} minutes</div><h3>${esc(L.title)}</h3><p>${esc(L.summary)}</p>
      <p class="muted small">The lesson pauses for a question every few minutes. If you leave this tab, it pauses too.</p>
      <button class="btn primary" data-lp="start" disabled data-label="${r.pos > 5 && !r.done ? "Resume at " + fmt(r.pos) : "Start the lesson"}">Loading the lesson…</button>`);
  }
  // furthest point the learner may reach: watched max, but never past an unanswered question
  function limit() {
    if (canSkip()) return P.L.duration;
    const nextQ = P.L.questions.findIndex((q, i) => !P.r.answered[i]);
    const qT = nextQ >= 0 ? P.L.questions[nextQ].t : P.L.duration;
    return Math.min(Math.max(P.r.max, P.a.currentTime), qT);
  }
  function setPlayBtn() { const b = root().querySelector('[data-lp="play"]'); if (b) { b.textContent = P.a.paused ? "▶" : "❚❚"; b.setAttribute("aria-label", P.a.paused ? "Play" : "Pause"); } }
  function cover(html) { const c = root().querySelector("#lpCover"); c.innerHTML = html ? `<div class="lp-card">${html}</div>` : ""; c.classList.toggle("on", !!html); }
  function showSlide(i, force) {
    if (i === P.slide && !force) return;
    P.slide = i; P.cue = null;
    const st = root().querySelector("#lpStage");
    st.innerHTML = SA().slideHTML(P.sess, i);
    const sl = st.querySelector(".slide"); if (sl) sl.classList.add("lp-in");
  }
  function draw(force) {
    const t = P.a.currentTime, L = P.L;
    if (t > P.r.max) P.r.max = t;
    showSlide(slideAt(L, t), force);
    root().querySelector("#lpCur").style.width = (t / L.duration * 100) + "%";
    root().querySelector("#lpMax").style.width = (Math.min(1, Math.max(P.r.max, t) / L.duration) * 100) + "%";
    root().querySelector("#lpTime").textContent = `${fmt(t)} / ${fmt(L.duration)}`;
    root().querySelector("#lpCC").textContent = P.cc ? captionAt(L, t) : "";
    root().querySelector("#lpCC").hidden = !P.cc || !captionAt(L, t);
    const cue = cueAt(L, t);
    if (cue && cue !== P.cue) { P.cue = cue; highlight(cue[2]); }
  }
  function loop() {
    cancelAnimationFrame(P.raf);
    const tick = () => {
      if (!P || P.a.paused) return;
      const t = P.a.currentTime;
      const qi = P.L.questions.findIndex((q, i) => !P.r.answered[i] && t >= q.t - 0.05);
      if (qi >= 0 && !canSkip()) { P.a.pause(); P.a.currentTime = P.L.questions[qi].t; ask(qi); draw(); return; }
      if (qi >= 0 && canSkip()) P.r.answered[qi] = true;
      draw();
      if (Date.now() - P.saveT > 15000) persist();
      P.raf = requestAnimationFrame(tick);
    };
    P.raf = requestAnimationFrame(tick);
  }
  function ask(qi) {
    const q = P.L.questions[qi]; P.q = { qi, tries: 0 };
    cover(`<div class="eyebrow">Question ${qi + 1} of ${P.L.questions.length}</div><h3>${esc(q.q)}</h3>
      <div class="lp-opts">${q.options.map((o, k) => `<button class="lp-opt" data-lpopt="${k}">${esc(o)}</button>`).join("")}</div><div id="lpFb" aria-live="polite"></div>`);
  }
  function answer(k) {
    const { qi } = P.q, q = P.L.questions[qi], ok = k === q.answer;
    P.q.tries++;
    if (!(qi in P.r.first)) P.r.first[qi] = ok;
    const btns = root().querySelectorAll(".lp-opt");
    btns.forEach((b, j) => { b.disabled = ok || j === k || b.disabled; if (j === k) b.classList.add(ok ? "ok" : "bad"); });
    const fb = root().querySelector("#lpFb");
    if (ok) {
      P.r.answered[qi] = true; persist();
      fb.innerHTML = `<div class="lp-fb ok"><b>${P.q.tries === 1 ? "Correct." : "That's it."}</b> ${esc(q.explain)}</div><button class="btn primary" data-lp="continue">Continue the lesson</button>`;
    } else {
      fb.innerHTML = `<div class="lp-fb bad"><b>Not quite.</b> Think again about what the lesson just explained, then pick another answer. <button class="linkish" data-lp="rewatch">Re-watch this part</button></div>`;
    }
  }
  function persist() {
    if (!P) return;
    P.saveT = Date.now();
    const r = P.r; r.pos = Math.round(P.a.currentTime * 10) / 10; r.max = Math.round(r.max * 10) / 10; r.at = Date.now();
    store()[P.L.id] = JSON.parse(JSON.stringify(r));
    SA().saveProg();
  }
  function finish() {
    const r = P.r; r.done = true; r.max = P.L.duration; persist();
    const sid = P.sess.id, ls = lessonsOf(sid), i = ls.findIndex(x => x.id === P.L.id), nx = ls[i + 1];
    cover(`<div class="eyebrow">Lesson complete</div><h3>Well done.</h3><p>You answered ${Object.values(r.first).filter(Boolean).length} of ${P.L.questions.length} questions right on the first try (${scoreOf(P.L, r)}%).</p>${window.LIB ? window.LIB.forLesson(P.L.id) : ""}
      <div class="row">${nx ? `<button class="btn primary" data-lesson="${nx.id}">Next lesson: ${esc(nx.title)}</button>` : `<button class="btn primary" data-lp="close">Back to the session</button>`}<button class="btn" data-lp="close">Close</button></div>`);
  }
  function release() { P.a.pause(); if (P.url) { P.a.removeAttribute("src"); URL.revokeObjectURL(P.url); P.url = ""; } }
  function close() {
    if (!P) return;
    persist(); release(); cancelAnimationFrame(P.raf); P = null;
    const el = root(); el.hidden = true; el.innerHTML = ""; document.body.classList.remove("lp-open");
    SA().render();
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-lesson],[data-lp],[data-lpopt]"); if (!b) return;
    if (b.dataset.lesson) { if (P) { persist(); release(); cancelAnimationFrame(P.raf); } open(b.dataset.lesson); return; }
    if (!P) return;
    if (b.dataset.lpopt) { answer(+b.dataset.lpopt); return; }
    const k = b.dataset.lp;
    if (k === "close") close();
    if (k === "start") { cover(""); P.a.play().catch(() => {}); }
    if (k === "play") { if (P.q && root().querySelector("#lpCover.on")) return; if (P.a.paused) { cover(""); P.a.play().catch(() => {}); } else P.a.pause(); }
    if (k === "back") { P.a.currentTime = Math.max(0, P.a.currentTime - 10); draw(); }
    if (k === "continue") { P.q = null; cover(""); P.a.currentTime += 0.1; P.a.play().catch(() => {}); }
    if (k === "rewatch") { const qi = P.q.qi; const prevT = qi > 0 ? P.L.questions[qi - 1].t + 0.1 : 0; P.q = null; cover(""); P.a.currentTime = Math.max(prevT, P.a.currentTime - 60); P.a.play().catch(() => {}); }
    if (k === "cc") { P.cc = !P.cc; b.setAttribute("aria-pressed", P.cc); draw(); }
  });
  document.addEventListener("pointerdown", e => {
    if (!P || !e.target.closest("#lpTrack") || root().querySelector("#lpCover.on")) return;
    const tr = root().querySelector("#lpTrack").getBoundingClientRect();
    const want = (e.clientX - tr.left) / tr.width * P.L.duration;
    const lim = limit();
    P.a.currentTime = Math.max(0, Math.min(want, lim));
    if (want > lim + 1) SA().toast("You can only move back, or up to the point you have reached.");
    draw();
  });
  document.addEventListener("change", e => { if (P && e.target.id === "lpRate") P.a.playbackRate = +e.target.value; });
  document.addEventListener("keydown", e => {
    if (!P) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key === " " && !/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName)) { e.preventDefault(); root().querySelector('[data-lp="play"]').click(); }
  });
  document.addEventListener("visibilitychange", () => {
    if (P && document.hidden && !P.a.paused) {
      P.a.pause();
      cover(`<h3>Paused</h3><p>The lesson pauses when you leave it, so you don't miss anything.</p><button class="btn primary" data-lp="start">Continue</button>`);
    }
  });

  window.PLAYER = { listHTML, open, lessonsOf, status };
})();
if (window.SA) window.SA.render();
