// Public home page: what visitors see before they sign in. Course catalogue, a preview of each course
// (programme, sample slides and the first minutes of the first video lesson) and the invitation to register.
(function () {
  "use strict";
  const A = window.ACADEMY, PV = window.PREVIEW || {}, $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const G = { regOpen: true, active: false, preview: null, slide: {} };
  const open = () => A.courses.filter(c => c.status === "open" && c.path && PV[c.id]);
  const sum = k => open().reduce((a, c) => a + ((PV[c.id] || {}).counts || {})[k] || 0, 0);
  const fmtHours = m => (Math.round(m / 6) / 10).toLocaleString("en", { maximumFractionDigits: 0 });

  function topbar() {
    $("#topUser").innerHTML = `<nav class="hp-links" aria-label="Home page"><a href="#courses">Courses</a><a href="#how">How it works</a><a href="#faq">Questions</a></nav>
      <button class="btn sm" data-srv="login">Sign in</button>${G.regOpen ? `<button class="btn sm hp-cta" data-srv="register">Create account</button>` : ""}`;
  }
  const join = (label, course, cls) => G.regOpen
    ? `<button class="btn ${cls || "primary"}" data-srv="register"${course ? ` data-course="${esc(course)}"` : ""}>${label}</button>`
    : `<button class="btn ${cls || "primary"}" data-srv="login">Sign in</button>`;

  function hero() {
    const imgs = open().map(c => PV[c.id].gallery).flat();
    const pick = [imgs.find(x => /source-to-contract-5/.test(x)) || imgs[1], imgs.find(x => /stakeholder-2/.test(x)) || imgs[2], imgs.find(x => /source-to-contract-7/.test(x)) || imgs[3]].filter(Boolean);
    const s2 = PV["source-to-contract"] || PV[(open()[0] || {}).id] || {};
    const cue = s2.sample ? s2.sample.cues.find(c => /decision chain, not a document chain/.test(c[2])) || s2.sample.cues[3] : null;
    return `<section class="hp-hero"><div class="hp-in">
      <div class="hp-copy"><div class="eyebrow">${esc(A.heroEyebrow)}</div>
        <h1>${esc(A.heroTitle)}</h1><p class="hp-lead">${esc(A.heroLead)}</p>
        <div class="row hp-actions">${join(G.regOpen ? "Create your account" : "Sign in", "", "primary lg")}<a class="btn lg hp-ghost" href="#courses">Preview the courses</a></div>
        <ul class="hp-ticks"><li>Live online classes with your teacher</li><li>Narrated video lessons you can start today</li><li>Excel and PowerPoint templates for real work</li></ul></div>
      <div class="hp-visual" aria-hidden="true">
        ${pick[0] ? `<figure class="hp-shot s1"><img src="${esc(pick[0])}" alt=""></figure>` : ""}
        ${pick[1] ? `<figure class="hp-shot s2"><img src="${esc(pick[1])}" alt=""></figure>` : ""}
        <div class="hp-float hp-live"><span class="dot"></span><b>Live class</b><span>Polls, questions and discussion</span></div>
        ${cue ? `<div class="hp-float hp-sub"><span class="play">▶</span><div><b>Video lesson · ${esc(s2.sample.title)}</b><span>“${esc(cue[2])}”</span></div></div>` : ""}
      </div></div></section>`;
  }
  function numbers() {
    const n = [[open().length, open().length === 1 ? "course open" : "courses open"], [sum("lessons"), "narrated video lessons"], [fmtHours(sum("minutes")) + " h", "of guided lessons"],
      [sum("slides").toLocaleString("en"), "slides, with notes"], [sum("templates"), "Excel and PowerPoint templates"], [sum("questions"), "questions inside the lessons"]];
    return `<section class="hp-numbers"><div class="hp-wrap">${n.map(([b, s]) => `<div><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join("")}</div></section>`;
  }
  function shift() {
    return `<section class="hp-sec"><div class="hp-wrap"><div class="hp-head"><div class="eyebrow">Why this Academy</div><h2>From processing requests to shaping decisions</h2>
      <p>Most value in indirect spend is decided before Procurement is called. These programmes give your team the methods, the language and the tools to get there first, on real insurance cases.</p></div>
      <div class="hp-shift"><div class="hp-col was"><h3>Without a method</h3><ul><li>Called once the supplier is chosen</li><li>Three quotes for everything, whatever the market</li><li>Spend data nobody asked for</li><li>Contracts that renew by surprise</li></ul></div>
      <div class="hp-arrow" aria-hidden="true">→</div>
      <div class="hp-col now"><h3>After the Academy</h3><ul><li>Invited early by the business owners who matter</li><li>The right route to market for each category</li><li>Insight that turns into an agreed plan</li><li>Contracts, renewals and exits managed ahead of time</li></ul></div></div></div></section>`;
  }
  function courseCard(c) {
    const P = PV[c.id], isOpen = c.status === "open" && c.path && P;
    if (!isOpen) return `<div class="hp-course soon" style="--cc:${esc(c.color)}"><div class="hp-band"><span>${esc(c.code)}</span><b>${esc(c.title)}</b></div><div class="hp-body"><p class="muted small">${esc(c.subtitle)}</p><p class="small">${esc(c.desc)}</p><span class="status soon">Coming soon</span></div></div>`;
    const k = P.counts;
    return `<article class="hp-course" style="--cc:${esc(c.color)}">
      <button class="hp-cover" data-hp="preview" data-id="${esc(c.id)}" aria-label="Preview ${esc(c.title)}"><img src="${esc(P.gallery[1] || P.gallery[0] || "")}" alt="" loading="lazy"><span class="hp-play">Preview the course</span></button>
      <div class="hp-body"><div class="hp-code">${esc(c.code)}</div><h3>${esc(c.title)}</h3><p class="hp-sub">${esc(c.subtitle)}</p><p>${esc(c.desc)}</p>
        <ul class="hp-facts"><li><b>${k.sessions}</b> live sessions</li><li><b>${k.lessons}</b> video lessons · ${fmtHours(k.minutes)} h</li><li><b>${k.templates}</b> templates</li>${P.book ? `<li><b>${P.book.pages}</b>-page book</li>` : ""}</ul>
        <ol class="hp-sess">${P.sessions.map(s => `<li><span>${s.num}</span>${esc(s.title)}</li>`).join("")}</ol>
        <div class="row">${join("Enrol in this course", c.id, "primary")}<button class="btn" data-hp="preview" data-id="${esc(c.id)}">See inside</button></div></div></article>`;
  }
  function courses() {
    return `<section class="hp-sec alt" id="courses"><div class="hp-wrap"><div class="hp-head"><div class="eyebrow">The programmes</div><h2>Choose your course</h2>
      <p>Each course runs over four live online sessions of about four hours, with video lessons before each class and practice on your own projects between them.</p></div>
      <div class="hp-courses">${A.courses.filter(c => c.status === "open" && c.path && PV[c.id]).map(courseCard).join("")}</div>
      ${A.courses.some(c => !(c.status === "open" && c.path && PV[c.id])) ? `<h3 class="hp-mini">In preparation</h3><div class="hp-soon">${A.courses.filter(c => !(c.status === "open" && c.path && PV[c.id])).map(courseCard).join("")}</div>` : ""}</div></section>`;
  }
  function how() {
    const steps = [["Before each class", "Watch the narrated video lessons, with slides and questions that make you apply the ideas. Read a short pre-work and take the quiz."],
      ["Live online class", "About four hours with your teacher: discussion, polls, questions and group work, with camera and microphone in the browser."],
      ["Practice", "Every module ends with an exercise on a realistic insurance case. Your answers are saved in your own workbook."],
      ["Real work", "Fieldwork with your internal clients and suppliers between sessions, and a capstone where you present your own plan."]];
    return `<section class="hp-sec" id="how"><div class="hp-wrap"><div class="hp-head"><div class="eyebrow">How it works</div><h2>Learn it, discuss it, use it on Monday</h2></div>
      <ol class="hp-steps">${steps.map(([t, d], i) => `<li><span class="n">${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol>
      <div class="hp-features">${[["▶", "Video lessons that wait for you", "Slides change with the narration, subtitles are on, and the lesson pauses for your answer."],
        ["●", "A real live classroom", "Your teacher's slides, polls, a question box and raised hands, all in one page."],
        ["✎", "Your workbook", "Every exercise and quiz is saved on the server: continue from any computer."],
        ["⇩", "Templates you keep", "One Excel workbook and one PowerPoint per practice, with a worked example."],
        ["▣", "The book", "A pre-course book for each programme with the key models and worked examples."],
        ["✓", "Progress you can see", "Lessons, exercises and fieldwork tracked session by session."]].map(([i, t, d]) => `<div><span class="ic">${i}</span><b>${t}</b><p>${d}</p></div>`).join("")}</div></div></section>`;
  }
  function faq() {
    const q = [["Who are the courses for?", "Buyers, category managers and Procurement leads in indirect spend (Marketing, IT, Facilities, Professional Services and the rest), and anyone who works with them."],
      ["How long does a course take?", "Four live sessions of about four hours, usually a few weeks apart, plus about 2.5 hours of video lessons and a short pre-work before each session. The capstone comes about four weeks after the last session."],
      ["Do I need to install anything?", "No. Everything runs in your browser. For the live classes a camera and a microphone are welcome but not required."],
      ["Can I take more than one course?", "Yes. One account gives access to every course you enrol in. You can add a course later from your home page."],
      ["When are the live classes?", "Your teacher sets the dates. They appear on the course page and the class opens there at the time of the session."],
      ["What happens with my data?", "Your name, e-mail and course work are stored on this website so you can take the courses and your teacher can follow your progress. Nothing is shared outside the Academy."],
      ["What language are the courses in?", "English."]];
    return `<section class="hp-sec alt" id="faq"><div class="hp-wrap hp-narrow"><div class="hp-head"><div class="eyebrow">Questions</div><h2>Good to know</h2></div>
      <div class="hp-faq">${q.map(([t, d]) => `<details><summary>${t}</summary><p>${d}</p></details>`).join("")}</div></div></section>`;
  }
  function final() {
    return `<section class="hp-final"><div class="hp-wrap"><h2>${G.regOpen ? "Your first video lesson is two minutes away" : "Already have an account?"}</h2>
      <p>${G.regOpen ? "Create your account, choose your courses and start straight away. No waiting for a confirmation e-mail." : "Registration is by invitation at the moment. Sign in with the details your Academy admin sent you."}</p>
      <div class="row" style="justify-content:center">${join(G.regOpen ? "Create your account" : "Sign in", "", "primary lg")}${G.regOpen ? `<button class="btn lg hp-ghost" data-srv="login">I already have an account</button>` : ""}</div></div></section>
      <footer class="hp-foot"><div class="hp-wrap"><span class="mark">PA</span><b>${esc(A.name)}</b><span class="muted small">Training for indirect Procurement. Case companies and figures in the courses are fictional or anonymised.</span></div></footer>`;
  }
  function page() { return hero() + numbers() + shift() + courses() + how() + faq() + final(); }

  // ----- course preview -----
  function vPreview(c) {
    const P = PV[c.id], k = P.counts, sm = P.sample;
    return `<div class="hp-pv" role="dialog" aria-modal="true" aria-label="${esc(c.title)} preview" style="--cc:${esc(c.color)}">
      <div class="hp-pv-top"><button class="btn sm" data-hp="close">← All courses</button><b>${esc(c.title)}</b><span class="spacer"></span>${join("Enrol in this course", c.id, "primary sm")}</div>
      <div class="hp-pv-body">
        <header class="hp-pv-head"><div class="hp-code">${esc(c.code)} · Preview</div><h1>${esc(c.title)}</h1><p class="hp-sub">${esc(c.subtitle)}</p><p>${esc(c.desc)}</p>
          <ul class="hp-facts big"><li><b>${k.sessions}</b> live sessions</li><li><b>${k.modules}</b> modules with practice</li><li><b>${k.lessons}</b> video lessons · ${fmtHours(k.minutes)} h</li><li><b>${k.slides}</b> slides</li><li><b>${k.templates}</b> templates</li></ul></header>
        ${sm ? `<section class="hp-pv-sec"><h2>Listen to the first lesson</h2><p class="muted">${esc(sm.title)}. The full lesson is ${sm.full} minutes, with questions along the way; the preview plays the first three.</p>
          <div class="hp-lesson" data-id="${esc(c.id)}"><div class="hp-ls-stage"><img id="hpLsImg" src="${esc(sm.slides[0][1])}" alt="Lesson slide"><div class="hp-ls-cc" id="hpLsCc"></div>
            <div class="hp-ls-end" id="hpLsEnd" hidden><b>That was the first three minutes.</b><span>Create your account to watch the whole lesson and the rest of the course.</span>${join("Continue the lesson", c.id, "primary")}</div></div>
            <div class="hp-ls-bar"><button class="btn primary sm" data-hp="play" id="hpLsPlay">▶ Play</button><div class="hp-ls-prog"><i id="hpLsProg"></i></div><span class="muted small" id="hpLsTime">0:00 / ${Math.floor(sm.end / 60)}:${String(Math.round(sm.end % 60)).padStart(2, "0")}</span></div>
            <audio id="hpLsAudio" preload="none" src="${esc(sm.audio)}"></audio></div></section>` : ""}
        ${P.gallery.length ? `<section class="hp-pv-sec"><h2>A look at the slides</h2><div class="hp-gal"><img id="hpGalImg" src="${esc(P.gallery[G.slide[c.id] || 0])}" alt="Sample slide ${(G.slide[c.id] || 0) + 1} of ${P.gallery.length}">
          <div class="hp-gal-nav"><button class="btn sm" data-hp="gal" data-d="-1" aria-label="Previous slide">‹</button><span class="muted small" id="hpGalN">${(G.slide[c.id] || 0) + 1} / ${P.gallery.length}</span><button class="btn sm" data-hp="gal" data-d="1" aria-label="Next slide">›</button></div></div></section>` : ""}
        <section class="hp-pv-sec"><h2>The programme</h2><div class="hp-prog">${P.sessions.map((s, i) => `<details${i === 0 ? " open" : ""}><summary><span class="n">${s.num}</span><span><b>${esc(s.title)}</b><small>${esc(s.theme)}</small></span></summary>
          <div class="hp-prog-in"><p><b>The question:</b> ${esc(s.question)}</p><p><b>You leave with:</b> ${esc(s.output)}</p>
          <div class="grid2"><div><h4>Modules and practice</h4><ul>${s.modules.map(m => `<li><b>${esc(m.id)} ${esc(m.title)}</b>${m.practice ? `<br><span class="muted small">${esc(m.practice)}</span>` : ""}</li>`).join("")}${s.case ? `<li><b>${esc(s.case)}</b></li>` : ""}</ul></div>
          <div><h4>Video lessons</h4><ul>${s.lessons.map(l => `<li>${esc(l.title)} <span class="muted small">${l.min} min</span></li>`).join("")}</ul>${s.fieldwork ? `<h4>Between sessions</h4><p class="small">${esc(s.fieldwork)}</p>` : ""}</div></div></div></details>`).join("")}
          ${P.capstone ? `<div class="hp-cap"><b>${esc(P.capstone)}</b><span class="muted small">About four weeks after the last session.</span></div>` : ""}</div></section>
        ${P.book ? `<section class="hp-pv-sec hp-book"><div class="cover"><span>${esc(c.title)}</span><b>${esc(P.book.title)}</b></div><div><h2>Read before the course</h2><p><b>${esc(P.book.title)}</b></p><p class="muted">${esc(P.book.subtitle || "")} ${P.book.pages} pages, included with the course.</p></div></section>` : ""}
        <section class="hp-pv-cta"><h2>Ready to start ${esc(c.title)}?</h2><p>Create your account and the first video lesson is ready for you.</p>${join("Enrol in this course", c.id, "primary lg")}</section>
      </div></div>`;
  }
  function showPreview(id) {
    const c = A.courses.find(x => x.id === id); if (!c || !PV[id]) return;
    closePreview(true); G.preview = id;
    const box = document.createElement("div"); box.id = "hpPv"; box.innerHTML = vPreview(c); document.body.appendChild(box);
    document.body.classList.add("hp-noscroll"); box.querySelector(".hp-pv-top .btn").focus();
    if (location.hash !== "#preview/" + id) history.pushState(null, "", "#preview/" + id);
  }
  function closePreview(silent) {
    const a = $("#hpLsAudio"); if (a) a.pause();
    const b = $("#hpPv"); if (b) b.remove(); document.body.classList.remove("hp-noscroll"); G.preview = null;
    if (!silent && /^#preview\//.test(location.hash)) history.pushState(null, "", location.pathname + "#courses");
  }
  const fmt = t => Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0");
  function lessonTick() {
    const a = $("#hpLsAudio"), sm = G.preview && PV[G.preview].sample; if (!a || !sm) return;
    const t = a.currentTime;
    if (t >= sm.end) { a.pause(); $("#hpLsEnd").hidden = false; $("#hpLsPlay").textContent = "↺ Again"; }
    const cue = sm.cues.find(c => t >= c[0] && t < c[1]); $("#hpLsCc").textContent = cue ? cue[2] : "";
    let img = sm.slides[0][1]; sm.slides.forEach(s => { if (t >= s[0]) img = s[1]; });
    const el = $("#hpLsImg"); if (el.getAttribute("src") !== img) el.setAttribute("src", img);
    $("#hpLsProg").style.width = Math.min(100, t / sm.end * 100) + "%"; $("#hpLsTime").textContent = fmt(t) + " / " + fmt(sm.end);
  }

  document.addEventListener("click", e => {
    if (!G.active) return;
    const b = e.target.closest("[data-hp]"); if (!b) return;
    const act = b.dataset.hp;
    if (act === "preview") showPreview(b.dataset.id);
    if (act === "close") closePreview();
    if (act === "gal") {
      const P = PV[G.preview], n = P.gallery.length, i = ((G.slide[G.preview] || 0) + +b.dataset.d + n) % n; G.slide[G.preview] = i;
      const img = $("#hpGalImg"); img.src = P.gallery[i]; img.alt = `Sample slide ${i + 1} of ${n}`; $("#hpGalN").textContent = `${i + 1} / ${n}`;
    }
    if (act === "play") {
      const a = $("#hpLsAudio"), sm = PV[G.preview].sample;
      if (a.paused) { if (a.currentTime >= sm.end) { a.currentTime = 0; $("#hpLsEnd").hidden = true; } a.play().catch(() => {}); b.textContent = "❚❚ Pause"; }
      else { a.pause(); b.textContent = "▶ Play"; }
    }
  });
  document.addEventListener("timeupdate", e => { if (e.target.id === "hpLsAudio") lessonTick(); }, true);
  document.addEventListener("keydown", e => {
    if (!G.preview) return;
    if (e.key === "Escape" && !document.getElementById("srvOv")) closePreview();
    if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { const b = document.querySelector(`[data-hp="gal"][data-d="${e.key === "ArrowRight" ? 1 : -1}"]`); if (b) b.click(); }
  });
  window.addEventListener("popstate", () => { if (!G.active) return; const m = location.hash.match(/^#preview\/(.+)$/); if (m) showPreview(m[1]); else if (G.preview) closePreview(true); });

  // shown by server.js when nobody is signed in
  window.PUBLIC_HOME = async function () {
    G.active = true;
    try {
      const r = await fetch("api.php", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", "X-Requested-With": "stakeholder-academy" }, body: JSON.stringify({ op: "regStatus" }) });
      const j = await r.json(); G.regOpen = j.open !== false; if (j.catalogue) window.ACADEMY_APPLY(j.catalogue);
      if (Array.isArray(j.courses)) A.courses.forEach(c => { if (c.path && c.status === "open" && !j.courses.includes(c.ns || "")) c.status = "soon"; });
    } catch (e) {}
    document.body.classList.add("hp-guest");
    $("#brandName").textContent = A.name; document.title = A.name + " · Training for indirect Procurement";
    topbar(); $("#pview").innerHTML = page();
    const m = location.hash.match(/^#preview\/(.+)$/); if (m) showPreview(m[1]);
    else if (/^#(courses|how|faq)$/.test(location.hash)) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  };
  // after signing in or registering, the portal takes over the page
  window.PUBLIC_HOME_END = function () { G.active = false; closePreview(true); document.body.classList.remove("hp-guest"); };
})();
