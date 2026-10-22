// Admin panel: password-locked editor for every piece of course content, plus students and teaching shortcuts.
// Edits are stored as override documents in the shared database (collection "cms"); only the page owner can write them.
(function () {
  "use strict";
  const SA = () => window.SA;
  const esc = s => SA().esc(s);
  const clone = o => o === undefined ? undefined : JSON.parse(JSON.stringify(o));
  // SHA-256 of "sa-admin:" + password. The password is a screen lock; saving still requires the owner's own account.
  const DEFAULT_HASH = "69acc210bdeb8a2d31a8c6c5a657c6ecbf12e72362ecbd243a3266aa5e929347";
  const SS = {
    get(k) { try { return sessionStorage.getItem("sa:" + k); } catch (e) { return null; } },
    set(k, v) { try { if (v == null) sessionStorage.removeItem("sa:" + k); else sessionStorage.setItem("sa:" + k, v); } catch (e) {} }
  };
  const A = {
    cms: {}, lockHash: null, unlocked: false,
    sec: "home", sid: "s1", slide: 0, lesson: "", json: {}, open: {},
    drafts: {} // key -> { data, dirty }
  };
  let ORIG = null;
  const STATIC = !!window.STATIC, SERVER = !!window.SERVER;

  // ---------- storage: shared database online; this browser + content.json on a static site ----------
  A.base = {};
  const LSK = "sa:cms-local";
  function localGet() { try { return JSON.parse(localStorage.getItem(LSK) || "{}") || {}; } catch (e) { return {}; } }
  function localPut(o) { try { localStorage.setItem(LSK, JSON.stringify(o)); return true; } catch (e) { SA().toast("This browser could not keep the change."); return false; } }
  function effective() { const l = localGet(), out = Object.assign({}, A.base); Object.keys(l).forEach(k => { if (l[k] === null) delete out[k]; else out[k] = l[k]; }); return out; }
  const localDirty = () => Object.keys(localGet()).length > 0;
  async function put(name, data) {
    const db = SA().S.db;
    if (db) return db.doc("cms/" + name).set(data);
    const l = localGet(); l[name] = data; localPut(l); apply(effective());
  }
  async function del(name) {
    const db = SA().S.db;
    if (db) return db.doc("cms/" + name).delete();
    const l = localGet(); if (name in A.base) l[name] = null; else delete l[name]; localPut(l); apply(effective());
  }
  const PUBLISH_NOTE = "Saved in this browser. To publish it for everyone, download content.json (Password and backup) and upload it to your site.";
  function saveLocal(name, data) { put(name, data).then(() => SA().toast(PUBLISH_NOTE)); }
  function syncRole() { if (!STATIC) return; const S = SA().S; const r = A.unlocked ? "teacher" : "preview"; if (S.role !== r && S.role !== "loading") { S.role = r; if (r === "preview") S.asStudent = false; } }

  async function sha(text) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    throw new Error("no crypto");
  }
  const currentHash = () => A.lockHash || DEFAULT_HASH;
  A.unlocked = SS.get("adm") === DEFAULT_HASH; // re-checked against a changed password once the db answers

  // ---------- applying stored edits ----------
  const allLessons = () => [].concat(...Object.values(window.LESSONS || {}));
  const tplItems = () => (window.TEMPLATES || { items: [] }).items;
  function capture() {
    const { SESS, C, D } = SA();
    ORIG = {
      sessions: Object.fromEntries(SESS.map(s => [s.id, clone(s)])),
      lessons: Object.fromEntries(allLessons().map(L => [L.id, clone({ title: L.title, summary: L.summary, questions: L.questions })])),
      templates: Object.fromEntries(tplItems().map(it => [it.id, { title: it.title, purpose: it.purpose, hidden: !!it.hidden }])),
      group: clone(D.group), capstone: clone(C.capstone), site: clone(C.site)
    };
  }
  function replaceInPlace(target, src) {
    Object.keys(target).forEach(k => { if (!(k in src)) delete target[k]; });
    Object.assign(target, clone(src));
  }
  function questionTimes(L, qs) {
    return qs.map(q => {
      const ends = (L.segs || []).filter(sg => sg[0] === +q.after).map(sg => sg[2]);
      return Object.assign({}, q, { after: +q.after, answer: +q.answer, t: ends.length ? ends[ends.length - 1] : (L.segs && L.segs.length ? L.segs[L.segs.length - 1][2] : 0) });
    });
  }
  function apply(docs) {
    if (!SA()) return;
    if (!ORIG) capture();
    A.cms = docs || {};
    const { SESS, C, D } = SA();
    SESS.forEach(s => {
      replaceInPlace(s, ORIG.sessions[s.id]);
      const o = A.cms["session-" + s.id]; if (o && o.data) { const d = clone(o.data); delete d.slides; delete d.id; delete d.num; Object.assign(s, d); }
      const dk = A.cms["deck-" + s.id]; if (dk && Array.isArray(dk.slides) && dk.slides.length) s.slides = clone(dk.slides);
    });
    allLessons().forEach(L => {
      const o0 = ORIG.lessons[L.id]; if (!o0) return;
      const o = A.cms["lesson-" + L.id] || {};
      L.title = o.title || o0.title; L.summary = o.summary != null ? o.summary : o0.summary;
      L.questions = Array.isArray(o.questions) ? questionTimes(L, o.questions) : clone(o0.questions);
    });
    const tp = (A.cms.templates && A.cms.templates.items) || {};
    tplItems().forEach(it => { const o0 = ORIG.templates[it.id]; if (!o0) return; Object.assign(it, o0, tp[it.id] || {}); });
    replaceInPlace(C.capstone, (A.cms.site && A.cms.site.capstone) || ORIG.capstone);
    replaceInPlace(C.site, Object.assign({}, ORIG.site, (A.cms.site && A.cms.site.site) || {}));
    A.lockHash = (A.cms.lock && A.cms.lock.hash) || null;
    A.unlocked = SS.get("adm") === currentHash();
    if (!SA().S.db && A.cms.settings && A.cms.settings.data) SA().S.settings = Object.assign({ cohort: "", sessions: {} }, clone(A.cms.settings.data));
    syncRole();
    SA().refreshExercises();
    SA().softRender();
  }

  // ---------- drafts ----------
  function sessById(id) { return SA().SESS.find(s => s.id === id); }
  function makeDraft(key) {
    const { C, D } = SA();
    const [kind, id] = key.split(":");
    if (kind === "session") { const d = clone(sessById(id)); delete d.slides; return d; }
    if (kind === "deck") return clone(sessById(id).slides);
    if (kind === "lesson") { const L = allLessons().find(x => x.id === id); return { title: L.title, summary: L.summary, questions: L.questions.map(q => { const c = clone(q); delete c.t; return c; }) }; }
    if (kind === "templates") return tplItems().map(it => ({ id: it.id, code: it.code, title: it.title, purpose: it.purpose, visible: !it.hidden }));
    if (kind === "live") { const ld = clone(SA().S.liveDecks[id] || { slides: [], polls: [] }); return { slides: ld.slides || [], polls: ld.polls || [] }; }
    if (kind === "site") return { site: clone(C.site), capstone: clone(C.capstone) };
  }
  function draft(key) { if (!A.drafts[key]) A.drafts[key] = { data: makeDraft(key), dirty: false }; return A.drafts[key]; }
  const docName = key => { const [kind, id] = key.split(":"); return id ? kind + "-" + id : kind; };
  const edited = key => { if (key.startsWith("live:")) { const ld = SA().S.liveDecks[key.split(":")[1]]; return !!(ld && !ld.seed && ld.slides && ld.slides.length); } return !!A.cms[docName(key)]; };

  // ---------- generic form editor ----------
  const LABELS = { h: "Title", sub: "Subtitle", p: "Text", b: "Bullet points", k: "Slide type", c: "Cards (title, text)", s: "Items", t: "Table (first row = header)", q: "Question", by: "Author", foot: "Footnote on the slide", note: "Teacher note", min: "Minutes", tag: "Label", d: "Bars (label, value, value shown)", big: "Big numbers (value, label)", l: "Left column", r: "Right column", hi: "Highlighted item (0 = first)", axes: "Axes note", n: "Number", poll: "Poll id", where: "Where", loop: "Draw as a loop", options: "Answer options", answer: "Correct option (0 = first)", explain: "Explanation shown after answering", after: "Ask after deck slide (index, 0 = first)", summary: "Summary", title: "Title", purpose: "Purpose" };
  const label = k => typeof k === "number" ? "#" + (k + 1) : (LABELS[k] || String(k).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, c => c.toUpperCase()));
  const pid = path => "ae_" + path.join("_").replace(/[^\w-]/g, "_");
  const isPrimRow = r => Array.isArray(r) && r.every(x => x == null || typeof x !== "object");
  function blankLike(x) {
    if (Array.isArray(x)) return x.length ? (isPrimRow(x) ? x.map(v => typeof v === "number" ? 0 : "") : [blankLike(x[0])]) : [];
    if (x && typeof x === "object") return Object.fromEntries(Object.keys(x).map(k => [k, blankLike(x[k])]));
    return typeof x === "number" ? 0 : typeof x === "boolean" ? false : "";
  }
  function getAt(o, path) { return path.reduce((a, k) => a == null ? a : a[k], o); }
  function setAt(o, path, v) { const last = path[path.length - 1]; const p = getAt(o, path.slice(0, -1)); if (p != null) p[last] = v; }
  function textInput(v, path, id, small) {
    const s = v == null ? "" : String(v); const ap = esc(JSON.stringify(path));
    const long = s.length > (small ? 48 : 72) || s.includes("\n") || /<[a-z]/i.test(s);
    return long ? `<textarea id="${id}" data-ap="${ap}" rows="${Math.min(14, Math.max(2, Math.ceil(s.length / (small ? 40 : 90)) + (s.match(/\n/g) || []).length))}">${esc(s)}</textarea>` : `<input type="text" id="${id}" data-ap="${ap}" value="${esc(s)}">`;
  }
  function ops(path, i, n) {
    const ap = esc(JSON.stringify(path));
    return `<span class="adm-ops"><button type="button" class="btn sm ghost" data-aop="up" data-ap="${ap}" data-ai="${i}" ${i === 0 ? "disabled" : ""} aria-label="Move up">↑</button><button type="button" class="btn sm ghost" data-aop="down" data-ap="${ap}" data-ai="${i}" ${i === n - 1 ? "disabled" : ""} aria-label="Move down">↓</button><button type="button" class="btn sm ghost" data-aop="del" data-ap="${ap}" data-ai="${i}" aria-label="Delete">✕</button></span>`;
  }
  function isOpen(path, depth, openDepth) { const k = JSON.stringify(path); return k in A.open ? A.open[k] : depth < openDepth; }
  function ed(v, path, key, o) {
    const id = pid(path), depth = path.length - o.base;
    const lab = key == null ? "" : `<label for="${id}" class="adm-lbl">${esc(label(key))}</label>`;
    if (o.ro && o.ro.includes(key)) return `<div class="adm-f">${lab}<div class="adm-ro">${esc(typeof v === "object" ? JSON.stringify(v) : v)}</div></div>`;
    if (typeof v === "boolean") return `<div class="adm-f adm-chk"><input type="checkbox" id="${id}" data-ap="${esc(JSON.stringify(path))}" data-at="bool"${v ? " checked" : ""}>${lab}</div>`;
    if (typeof v === "number") return `<div class="adm-f">${lab}<input type="number" step="any" id="${id}" data-ap="${esc(JSON.stringify(path))}" data-at="num" value="${v}"></div>`;
    if (v == null || typeof v !== "object") return `<div class="adm-f">${lab}${textInput(v, path, id)}</div>`;
    const ap = esc(JSON.stringify(path)), open = isOpen(path, depth, o.openDepth);
    const sum = `<summary>${esc(key == null ? "Content" : label(key))}${Array.isArray(v) ? ` <span class="muted small">(${v.length})</span>` : ""}</summary>`;
    if (Array.isArray(v)) {
      let inner;
      if (v.length && v.every(isPrimRow)) {
        inner = `<div class="adm-grid"><table>${v.map((r, i) => `<tr>${r.map((c, j) => `<td>${typeof c === "number" ? `<input type="number" step="any" id="${pid(path.concat(i, j))}" data-ap="${esc(JSON.stringify(path.concat(i, j)))}" data-at="num" value="${c}">` : textInput(c, path.concat(i, j), pid(path.concat(i, j)), true)}</td>`).join("")}<td class="adm-rowops">${ops(path, i, v.length)}</td></tr>`).join("")}</table></div>`;
      } else if (v.every(x => x == null || typeof x !== "object")) {
        inner = v.map((x, i) => `<div class="adm-line">${typeof x === "number" ? `<input type="number" step="any" id="${pid(path.concat(i))}" data-ap="${esc(JSON.stringify(path.concat(i)))}" data-at="num" value="${x}">` : textInput(x, path.concat(i), pid(path.concat(i)))}${ops(path, i, v.length)}</div>`).join("");
      } else {
        inner = v.map((x, i) => `<div class="adm-item"><div class="adm-ih"><b>${esc(itemTitle(x, i))}</b>${ops(path, i, v.length)}</div>${ed(x, path.concat(i), null, o)}</div>`).join("");
      }
      return `<details class="adm-arr" data-apath="${ap}"${open ? " open" : ""}>${sum}${inner}<button type="button" class="btn sm" data-aop="add" data-ap="${ap}">+ Add ${v.length && v.every(isPrimRow) ? "row" : "item"}</button></details>`;
    }
    const keys = Object.keys(v);
    const body = keys.map(k => ed(v[k], path.concat(k), k, o)).join("");
    if (key == null) return `<div class="adm-obj">${body}</div>`;
    return `<details class="adm-sub" data-apath="${ap}"${open ? " open" : ""}>${sum}<div class="adm-obj">${body}</div></details>`;
  }
  function itemTitle(x, i) {
    const t = x && (x.title || x.h || x.q || x.label || x.name || x.id || x.key || x.what || x.entity || x.family || x.source || x.area);
    return `#${i + 1}${t ? " · " + String(t).replace(/<[^>]+>/g, "").slice(0, 70) : ""}`;
  }
  function editorHTML(key, o) {
    const dr = draft(key);
    o = Object.assign({ openDepth: 1, base: 0, ro: [] }, o || {});
    const jsonMode = A.json[key];
    const body = jsonMode
      ? `<textarea class="adm-json" id="ajson_${key.replace(/\W/g, "_")}" data-ajson="${esc(key)}" rows="24" spellcheck="false">${esc(JSON.stringify(dr.data, null, 2))}</textarea><p class="muted small">Advanced: edit the raw data. It is checked when you press Apply.</p><div class="row"><button type="button" class="btn sm primary" data-aact="jsonapply" data-akey="${esc(key)}">Apply</button></div>`
      : ed(dr.data, [], null, o);
    return `<div class="adm-editor" data-akey="${esc(key)}">${body}</div>`;
  }
  function saveBar(key, extra) {
    const dr = draft(key);
    return `<div class="adm-save"><span class="${dr.dirty ? "adm-dirty" : "muted"} small">${dr.dirty ? "Unsaved changes" : edited(key) ? "Edited · saved" : "Original content"}</span><span class="spacer"></span>${extra || ""}
      <button type="button" class="btn sm ghost" data-aact="json" data-akey="${esc(key)}">${A.json[key] ? "Form view" : "Raw data"}</button>
      <button type="button" class="btn sm" data-aact="discard" data-akey="${esc(key)}"${dr.dirty ? "" : " hidden"}>Discard</button>
      ${edited(key) ? `<button type="button" class="btn sm" data-aact="revert" data-akey="${esc(key)}">Restore original</button>` : ""}
      <button type="button" class="btn sm primary" data-aact="save" data-akey="${esc(key)}"${dr.dirty ? "" : " disabled"}>Save and publish</button></div>`;
  }

  // ---------- sections ----------
  const SECS = [["home", "Overview"], ["students", "Students"], ["teach", "Teach"], ["sessions", "Sessions"], ["slides", "Presentations"], ["lessons", "Video lessons"], ["templates", "Templates"], ["site", "Home and capstone"], ["security", "Password and backup"]];
  function sessPicker(cur, id) {
    return `<select id="${id}" style="width:auto">${SA().SESS.map(s => `<option value="${s.id}"${s.id === cur ? " selected" : ""}>Session ${s.num} · ${esc(s.title)}</option>`).join("")}</select>`;
  }
  function vHomeAdm() {
    const S = SA().S;
    const ids = Object.keys(S.roster), req = Object.keys(S.requests);
    const ed = Object.keys(A.cms).filter(k => k !== "lock" && k !== "settings");
    const nice = k => k.replace(/^session-s(\d)/, "Session $1 content").replace(/^deck-s(\d)/, "Session $1 slides").replace(/^lesson-s(\d)-l(\d)/, "Video lesson $1.$2").replace("templates", "Templates").replace("site", "Home and capstone");
    if (STATIC) return `<div class="grid2"><div class="card"><h3>What you can do here</h3><ul class="adm-list">
        <li><b>Teach:</b> open a session in presenter mode to share in your video call, or see the course as a student.</li>
        <li><b>Content:</b> edit sessions, slides, video-lesson questions, templates, the Spend X-ray, the home page and the capstone.</li>
        <li><b>Publish:</b> changes are kept in this browser until you download content.json and upload it to the site folder.</li></ul></div>
      <div class="card"><h3>Edited content</h3>${ed.length ? `<ul class="adm-list">${ed.map(k => `<li>${esc(nice(k))}</li>`).join("")}</ul>` : `<p class="muted">Nothing edited yet: everything is the original content.</p>`}</div></div>`;
    return `<div class="grid4 adm-stats">
      <div class="card"><div class="eyebrow">Students</div><b class="adm-big">${ids.length}</b><a href="#admin" data-asec="students" class="small">Manage</a></div>
      ${SERVER ? `<div class="card"><div class="eyebrow">Online now</div><b class="adm-big">${S.peers.filter(p => !p.isMe).length}</b><span class="muted small">students on the site</span></div>` : `<div class="card"><div class="eyebrow">Access requests</div><b class="adm-big">${req.length}</b><a href="#admin" data-asec="students" class="small">Review</a></div>`}
      <div class="card"><div class="eyebrow">Live class</div><b class="adm-big">${S.live.on ? "On" : "Off"}</b><a href="#admin" data-asec="teach" class="small">Teach</a></div>
      <div class="card"><div class="eyebrow">Edited items</div><b class="adm-big">${ed.length}</b><span class="muted small">of the original content</span></div></div>
      <div class="grid2"><div class="card"><h3>What you can do here</h3><ul class="adm-list">
        <li><b>Students:</b> ${SERVER ? "create each student's username and password, reset passwords," : "add or remove students, approve requests,"} set dates and video links, follow progress and read submissions.</li>
        <li><b>Teach:</b> start a live class as the teacher, present a session or see the course as a student.</li>
        <li><b>Content:</b> edit sessions, the ~460 slides, the questions of the 24 video lessons, the template library, the Spend X-ray, the home page and the capstone. Saved changes reach every student at once.</li></ul></div>
      <div class="card"><h3>Edited content</h3>${ed.length ? `<ul class="adm-list">${ed.map(k => `<li>${esc(nice(k))}${A.cms[k].at ? ` <span class="muted small">· ${new Date(A.cms[k].at).toLocaleString()}</span>` : ""}</li>`).join("")}</ul>` : `<p class="muted">Nothing edited yet: everything is the original content.</p>`}</div></div>`;
  }
  function vStudentsStatic() {
    return `<div class="card"><h3>Students on this version of the site</h3><ul class="adm-list"><li>This copy of the course runs on a normal web server without a database, so there are no student accounts: anyone with the address can open it.</li><li>Each student's answers, quiz results and video-lesson progress are saved in their own browser. They can download their workbook from "My workbook" and send it to you.</li><li>To protect access, put the folder behind your server's password protection or your intranet.</li></ul></div>
      <div class="card"><h3>Schedule and video call links</h3><p class="muted small">Shown on the home page and in the live class.</p>${SA().teacherHTML("schedule")}</div>`;
  }
  function vTeach() {
    const S = SA().S, ss = S.settings.sessions || {};
    return `<div class="card"><h3>Teach a live class</h3><p class="muted small">Starting a class turns on the "Live now" banner for every student and opens the classroom with your teacher controls: slides, polls, questions and participants. Audio and video run in your Teams or Zoom call.</p>
      <div class="adm-teach">${SA().SESS.map(s => { const on = S.live.on && S.live.session === s.id; return `<div class="card"><div class="eyebrow">Session ${s.num}${ss[s.id] && ss[s.id].date ? " · " + esc(ss[s.id].date) : ""}</div><h3>${esc(s.title)}</h3>
        <div class="row">${on ? `<a class="btn live sm" href="#live">Go to the live class</a><button class="btn sm" data-aact="liveoff">End the class</button>` : `<button class="btn primary sm" data-aact="live" data-asid="${s.id}">Start live class</button>`}<button class="btn sm" data-aact="present" data-asid="${s.id}">Slides and notes</button>${ss[s.id] && ss[s.id].link ? `<a class="btn sm" href="${esc(ss[s.id].link)}" target="_blank" rel="noopener">Video call</a>` : ""}</div></div>`; }).join("")}</div></div>
      <div class="grid2"><div class="card"><h3>See the course as a student</h3><p class="muted small">Hides teacher notes and controls until you switch back with the button under your name.</p><button class="btn" data-aact="asstudent">${S.asStudent ? "Back to teacher view" : "View as student"}</button></div>
      <div class="card"><h3>Teacher shortcuts</h3><p class="muted small">As the teacher you can skip ahead in any video lesson to review it, and you see the teacher notes on every slide and case.</p><div class="row"><a class="btn sm" href="#teacher">Course admin</a><a class="btn sm" href="#library">Templates</a></div></div></div>`;
  }
  function vSessions() {
    const key = "session:" + A.sid;
    return `<div class="card row">${sessPicker(A.sid, "admSess")}<span class="muted small">Overview texts, objectives, agenda, pre-work and quiz, modules and practices, case, fieldwork, polls and facilitator notes. Text fields marked with HTML tags keep their formatting tags.</span></div>
      ${saveBar(key)}<div class="card">${editorHTML(key, { ro: ["id", "num", "key"], openDepth: 1 })}</div>${saveBar(key)}`;
  }
  const KINDS = {
    bullets: { k: "bullets", h: "New slide title", b: ["First point", "Second point"] },
    statement: { k: "statement", h: "One strong message", p: "Supporting sentence" },
    cards: { k: "cards", h: "New slide title", c: [["Card title", "Card text"], ["Card title", "Card text"], ["Card title", "Card text"]] },
    steps: { k: "steps", h: "New slide title", s: [["Step one", "What happens"], ["Step two", "What happens"], ["Step three", "What happens"]] },
    two: { k: "two", h: "New slide title", l: { t: "Left", b: ["Point"] }, r: { t: "Right", b: ["Point"] }, hi: "r" },
    table: { k: "table", h: "New slide title", t: [["Column 1", "Column 2", "Column 3"], ["", "", ""]] },
    stats: { k: "stats", h: "New slide title", s: [["42%", "What the number means"], ["€3M", "What the number means"]] },
    big: { k: "big", h: "New slide title", big: [["3×", "What it means"]] },
    flow: { k: "flow", h: "New slide title", s: ["Step", "Step", "Step"], p: "" },
    bars: { k: "bars", h: "New slide title", d: [["Item A", 40, "40%"], ["Item B", 25, "25%"]] },
    example: { k: "example", h: "New slide title", tag: "Nordvia example", p: "What happened", b: ["Detail"] },
    exercise: { k: "exercise", h: "Practice", min: 20, where: "Breakout rooms", b: ["Instruction"] },
    takeaways: { k: "takeaways", h: "Key takeaways", b: ["Takeaway"] },
    debrief: { k: "debrief", h: "Debrief", b: ["Question"] },
    quote: { k: "quote", q: "Quote text", by: "Who said it" },
    section: { k: "section", n: "1.x", h: "Section title", sub: "" },
    title: { k: "title", h: "Title", sub: "Subtitle" }
  };  // ---------- presentations: visual slide editor ----------
  // Click any text on the big slide to type over it; Enter adds a bullet, Backspace on an empty bullet removes it.
  // Thumbnails can be dragged to reorder. Course decks feed the video lessons; live-class decks are the teacher's own.
  KINDS.discuss = { k: "discuss", h: "Let's discuss", q: "A provocative question for the group", b: ["Angle to explore", "Second angle"], min: 10, format: "Open floor" };
  KINDS.poll = { k: "poll", poll: "" };
  const KIND_NAMES = { title: "Title", section: "Section divider", statement: "Big statement", discuss: "Discussion", poll: "Poll", bullets: "Bullet points", cards: "Cards", steps: "Steps", two: "Two columns", table: "Table", stats: "Key figures", big: "Big numbers", flow: "Process flow", bars: "Bar chart", example: "Example", exercise: "Exercise", takeaways: "Key takeaways", debrief: "Debrief questions", quote: "Quote" };
  const deckKey = () => (A.deckKind || "live") + ":" + A.sid;
  const slidesOf = key => key.startsWith("live:") ? draft(key).data.slides : draft(key).data;
  const pollsOf = key => key.startsWith("live:") ? draft(key).data.polls : sessById(key.split(":")[1]).polls;
  function previewHTML(slides, i, opts) {
    const s = sessById(A.sid);
    const key = deckKey();
    const tmp = { id: s.id, num: s.num, title: s.title, polls: s.polls, slides };
    const sl = slides[i] || {};
    const pd = (sl.k === "poll") ? (pollsOf(key) || []).find(p => p.id === sl.poll) : null;
    try { return SA().slideHTML(tmp, i, Object.assign({ live: key.startsWith("live:"), pollDef: pd }, opts || {})); } catch (e) { return `<div class="slide"><h2>This slide cannot be drawn yet</h2><p class="sp">${esc(e.message)}</p></div>`; }
  }
  function editStage(slides, i) {
    return previewHTML(slides, i, { edit: true }).replace(/ data-ep='/g, ` contenteditable="true" spellcheck="true" data-ep='`);
  }
  function arraysOf(sl) {
    const out = [];
    const add = (path, label, blank) => out.push({ path, label, blank });
    const k = sl.k || "bullets";
    if (Array.isArray(sl.b)) add(["b"], k === "discuss" ? "Prompts" : "Bullets", "New point");
    if (k === "cards") add(["c"], "Cards", ["Title", "Text"]);
    if (k === "steps") add(["s"], "Steps", ["Step", "What happens"]);
    if (k === "flow") add(["s"], "Boxes", "Step");
    if (k === "stats") add(["s"], "Figures", ["0%", "What it means"]);
    if (k === "big") add(["big"], "Numbers", ["0", "What it means"]);
    if (k === "bars") add(["d"], "Bars", ["Item", 10, "10"]);
    if (k === "two") { add(["l", "b"], "Left column", "Point"); add(["r", "b"], "Right column", "Point"); }
    if (k === "quad" && Array.isArray(sl.q)) add(["q"], "Boxes", ["Title", "Text"]);
    return out;
  }
  function inspector(key, sl, i) {
    const k = sl.k || "bullets";
    const polls = pollsOf(key) || [];
    const arr = arraysOf(sl).map(a => { const n = (getAt(sl, a.path) || []).length; return `<div class="row adm-arrrow"><span class="small">${esc(a.label)} <span class="muted">(${n})</span></span><span class="spacer"></span><button type="button" class="btn sm" data-ve="add" data-vp='${esc(JSON.stringify(a.path))}'>+ Add</button><button type="button" class="btn sm ghost" data-ve="pop" data-vp='${esc(JSON.stringify(a.path))}'${n <= 1 ? " disabled" : ""}>− Last</button></div>`; }).join("");
    const t = sl.t || sl.table;
    const table = k === "table" && t ? `<div class="row adm-arrrow"><span class="small">Table <span class="muted">(${t.length - 1} rows × ${t[0].length} columns)</span></span></div><div class="row"><button type="button" class="btn sm" data-ve="row+">+ Row</button><button type="button" class="btn sm ghost" data-ve="row-"${t.length <= 2 ? " disabled" : ""}>− Row</button><button type="button" class="btn sm" data-ve="col+">+ Column</button><button type="button" class="btn sm ghost" data-ve="col-"${t[0].length <= 1 ? " disabled" : ""}>− Column</button></div>` : "";
    let extra = "";
    if (k === "poll") {
      const p = polls.find(x => x.id === sl.poll);
      extra = `<div class="adm-f"><label class="adm-lbl" for="vePoll">Poll shown on this slide</label><select id="vePoll"><option value="">Choose…</option>${polls.map(x => `<option value="${esc(x.id)}"${x.id === sl.poll ? " selected" : ""}>${esc(x.q)}</option>`).join("")}</select></div>
        ${key.startsWith("live:") ? `${p ? `<div class="adm-f"><label class="adm-lbl" for="vePollQ">Question</label><input type="text" id="vePollQ" value="${esc(p.q)}"></div><div class="adm-f"><label class="adm-lbl" for="vePollO">Options, one per line</label><textarea id="vePollO" rows="5">${esc(p.options.join("\n"))}</textarea></div>` : ""}<button type="button" class="btn sm" data-ve="newpoll">+ New poll</button>` : `<p class="muted small">Course-deck polls are edited in Sessions.</p>`}`;
    }
    if (k === "discuss") extra = `<div class="grid2" style="gap:8px"><div class="adm-f"><label class="adm-lbl" for="veMin">Minutes</label><input type="number" id="veMin" min="0" value="${esc(sl.min || "")}"></div></div>`;
    if (k === "exercise") extra = `<div class="adm-f"><label class="adm-lbl" for="veMin">Minutes</label><input type="number" id="veMin" min="0" value="${esc(sl.min || "")}"></div>`;
    if (k === "two") extra = `<label class="adm-f adm-chk"><input type="checkbox" id="veHi"${sl.hi === "r" ? " checked" : ""}> Highlight the right column</label>`;
    return `<div class="card adm-insp"><h3>Slide ${i + 1}</h3>
      <div class="adm-f"><label class="adm-lbl" for="veKind">Layout</label><select id="veKind">${Object.keys(KIND_NAMES).map(x => `<option value="${x}"${x === k ? " selected" : ""}>${KIND_NAMES[x]}</option>`).join("")}${KIND_NAMES[k] ? "" : `<option selected>${esc(k)}</option>`}</select></div>
      ${arr}${table}${extra}
      <div class="adm-f"><label class="adm-lbl" for="veNote">Teacher notes${key.startsWith("live:") ? " (only you see them)" : ""}</label><textarea id="veNote" rows="7" placeholder="What to say, what to ask the group, timing">${esc(sl.note || "")}</textarea></div>
      <div class="adm-f"><label class="adm-lbl" for="veFoot">Small print at the bottom of the slide</label><input type="text" id="veFoot" value="${esc(sl.foot || "")}"></div>
      <p class="muted small">Tip: click any text on the slide to change it. Enter adds a bullet; Backspace on an empty one removes it.</p></div>`;
  }
  function vSlides() {
    const key = deckKey(), live = key.startsWith("live:");
    const SS0 = SA().S;
    if (live && !SS0.liveDecks[A.sid]) return `<div class="card">${deckPicker()}</div><div class="empty">Loading the live-class slides…</div>`;
    const sl = slidesOf(key);
    if (!sl.length) sl.push(clone(KINDS.title));
    A.slide = Math.max(0, Math.min(sl.length - 1, A.slide));
    const cur = sl[A.slide];
    const thumbs = sl.map((x, i) => `<button type="button" class="adm-th${i === A.slide ? " on" : ""}" data-aslide="${i}" draggable="true" aria-label="Slide ${i + 1}"><span class="adm-thn">${i + 1}</span><span class="stage">${previewHTML(sl, i)}</span></button>`).join("");
    return `<div class="card adm-deckbar">${deckPicker()}<span class="muted small">${sl.length} slides · ${live ? "only you see these slides and notes; students see the slide you present" : "these slides are also used by the video lessons of this session"}</span></div>
      ${saveBar(key)}
      <div class="adm-ve" data-akey="${esc(key)}">
        <div class="adm-thumbs" aria-label="Slides">${thumbs}</div>
        <div class="adm-vmain"><div class="adm-edstage"><div class="stage">${editStage(sl, A.slide)}</div></div>
          <div class="row adm-tools"><button type="button" class="btn sm" data-aslide="${Math.max(0, A.slide - 1)}"${A.slide === 0 ? " disabled" : ""}>‹ Previous</button><button type="button" class="btn sm" data-aslide="${Math.min(sl.length - 1, A.slide + 1)}"${A.slide >= sl.length - 1 ? " disabled" : ""}>Next ›</button><span class="spacer"></span>
            <button type="button" class="btn sm" data-ve="up"${A.slide === 0 ? " disabled" : ""}>Move up</button><button type="button" class="btn sm" data-ve="down"${A.slide >= sl.length - 1 ? " disabled" : ""}>Move down</button><button type="button" class="btn sm" data-ve="dup">Duplicate</button><button type="button" class="btn sm" data-ve="del"${sl.length <= 1 ? " disabled" : ""}>Delete</button><button type="button" class="btn sm primary" data-ve="gallery">+ New slide</button></div>
          ${A.gallery ? `<div class="card adm-gallery"><div class="row"><b>Choose a layout</b><span class="spacer"></span><button type="button" class="btn sm ghost" data-ve="gallery">Close</button></div><div class="adm-gal">${Object.keys(KIND_NAMES).filter(x => x !== "poll" || live).map(x => `<button type="button" data-ve="add-slide" data-kind="${x}"><span class="stage">${previewHTML([clone(KINDS[x])], 0)}</span><span class="small">${KIND_NAMES[x]}</span></button>`).join("")}</div></div>` : ""}
          ${!live ? `<p class="muted small">Editing text is always safe. Adding, moving or deleting slides changes the slide numbers the video lessons point to: check the lessons of this session afterwards.</p>` : ""}
        </div>
        ${inspector(key, cur, A.slide)}
      </div>`;
  }
  function deckPicker() {
    const opts = [];
    SA().SESS.forEach(s => opts.push([`live:${s.id}`, `Session ${s.num} · Live class slides (teacher)`]));
    SA().SESS.forEach(s => opts.push([`deck:${s.id}`, `Session ${s.num} · Course slides (video lessons)`]));
    return `<label class="adm-lbl" for="admDeck">Presentation</label><select id="admDeck" style="width:auto;max-width:100%">${opts.map(([v, l]) => `<option value="${v}"${v === deckKey() ? " selected" : ""}>${esc(l)}${A.drafts[v] && A.drafts[v].dirty ? " •" : ""}</option>`).join("")}</select>`;
  }
  function changeKind(sl, k) {
    const base = clone(KINDS[k]); const out = { k };
    Object.keys(base).forEach(x => { if (x !== "k") out[x] = base[x]; });
    if (sl.h && "h" in base) out.h = sl.h;
    const bl = Array.isArray(sl.b) ? sl.b : null;
    if (bl && "b" in base) out.b = bl.slice();
    if (sl.note) out.note = sl.note; if (sl.foot) out.foot = sl.foot;
    return out;
  }
  function veRerender(focusPath) {
    rerender();
    if (!focusPath) return;
    const el = document.querySelector(`.adm-edstage [data-ep='${focusPath}']`);
    if (el) { el.focus(); const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
  }
  function veInput(e) {
    const el = e.target; if (!el.closest || !el.closest(".adm-ve")) return;
    const key = deckKey(), sl = slidesOf(key)[A.slide];
    if (el.dataset && el.dataset.ep) {
      const path = JSON.parse(el.dataset.ep);
      const old = getAt(sl, path);
      let v = el.innerText.replace(/\n+$/, "");
      if (typeof old === "number") { const n = parseFloat(v); if (isNaN(n)) return; v = n; }
      setAt(sl, path, v); markDirty(key); thumbLater(); return;
    }
    if (el.id === "veNote") { if (el.value.trim()) sl.note = el.value; else delete sl.note; markDirty(key); return; }
    if (el.id === "veFoot") { if (el.value.trim()) sl.foot = el.value; else delete sl.foot; markDirty(key); thumbLater(true); return; }
    if (el.id === "veMin") { sl.min = el.value === "" ? "" : +el.value; markDirty(key); thumbLater(true); return; }
    if (el.id === "vePollQ" || el.id === "vePollO") {
      const p = pollsOf(key).find(x => x.id === sl.poll); if (!p) return;
      if (el.id === "vePollQ") p.q = el.value; else p.options = el.value.split("\n").map(x => x.trim()).filter(Boolean);
      markDirty(key); thumbLater(true);
    }
  }
  function thumbLater(stageToo) {
    clearTimeout(thumbLater.t);
    thumbLater.t = setTimeout(() => {
      const key = deckKey(), sl = slidesOf(key);
      const th = document.querySelector(`.adm-th[data-aslide="${A.slide}"] .stage`); if (th) th.innerHTML = previewHTML(sl, A.slide);
      if (stageToo) { const st = document.querySelector(".adm-edstage .stage"); if (st) st.innerHTML = editStage(sl, A.slide); }
    }, 350);
  }
  document.addEventListener("input", veInput);
  document.addEventListener("paste", e => {
    const el = e.target.closest && e.target.closest(".adm-edstage [data-ep]"); if (!el) return;
    e.preventDefault(); const t = (e.clipboardData || window.clipboardData).getData("text/plain").replace(/\s*\n\s*/g, " ");
    document.execCommand("insertText", false, t);
  });
  document.addEventListener("keydown", e => {
    const el = e.target.closest && e.target.closest(".adm-edstage [data-ep]"); if (!el) return;
    const key = deckKey(), sl = slidesOf(key)[A.slide], path = JSON.parse(el.dataset.ep);
    const last = path[path.length - 1], parentPath = path.slice(0, -1), parent = getAt(sl, parentPath);
    const inList = typeof last === "number" && Array.isArray(parent) && parent.every(x => typeof x === "string");
    if (e.key === "Enter") {
      e.preventDefault();
      if (inList) { parent.splice(last + 1, 0, ""); markDirty(key); veRerender(JSON.stringify(parentPath.concat(last + 1))); }
      else el.blur();
    }
    if (e.key === "Backspace" && inList && el.innerText.trim() === "" && parent.length > 1) {
      e.preventDefault(); parent.splice(last, 1); markDirty(key); veRerender(JSON.stringify(parentPath.concat(Math.max(0, last - 1))));
    }
    if (e.key === "Escape") el.blur();
  });
  document.addEventListener("focusout", e => { if (e.target.closest && e.target.closest(".adm-edstage [data-ep]")) { const st = document.querySelector(".adm-edstage .stage"); setTimeout(() => { if (!document.activeElement || !document.activeElement.closest(".adm-edstage")) thumbLater(true); }, 0); } });
  document.addEventListener("change", e => {
    const el = e.target; if (!el.closest || !el.closest(".adm")) return;
    if (el.id === "admDeck") { const [k, sid] = el.value.split(":"); A.deckKind = k; A.sid = sid; A.slide = 0; A.gallery = false; rerender(); return; }
    if (!el.closest(".adm-ve")) return;
    const key = deckKey(), list = slidesOf(key), sl = list[A.slide];
    if (el.id === "veKind") { list[A.slide] = changeKind(sl, el.value); markDirty(key); rerender(); }
    if (el.id === "veHi") { if (el.checked) sl.hi = "r"; else delete sl.hi; markDirty(key); rerender(); }
    if (el.id === "vePoll") { sl.poll = el.value; markDirty(key); rerender(); }
  });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-ve]"); if (!b || !b.closest(".adm")) return;
    const key = deckKey(), list = slidesOf(key), i = A.slide, sl = list[i], a = b.dataset.ve;
    if (a === "gallery") { A.gallery = !A.gallery; rerender(); return; }
    if (a === "add-slide") { const n = clone(KINDS[b.dataset.kind]); if (n.k === "poll" && pollsOf(key).length) n.poll = pollsOf(key)[0].id; list.splice(i + 1, 0, n); A.slide = i + 1; A.gallery = false; markDirty(key); rerender(); return; }
    if (a === "up" && i > 0) { list.splice(i - 1, 0, list.splice(i, 1)[0]); A.slide--; }
    else if (a === "down" && i < list.length - 1) { list.splice(i + 1, 0, list.splice(i, 1)[0]); A.slide++; }
    else if (a === "dup") { list.splice(i + 1, 0, clone(sl)); A.slide++; }
    else if (a === "del") { if (b.dataset.confirm !== "1") { b.dataset.confirm = "1"; b.textContent = "Click again to delete"; return; } list.splice(i, 1); A.slide = Math.max(0, i - 1); }
    else if (a === "add" || a === "pop") {
      const path = JSON.parse(b.dataset.vp), arr = getAt(sl, path); const def = arraysOf(sl).find(x => JSON.stringify(x.path) === JSON.stringify(path));
      if (a === "add") arr.push(clone(def.blank)); else if (arr.length > 1) arr.pop();
    }
    else if (a === "row+" || a === "row-" || a === "col+" || a === "col-") {
      const t = sl.t || sl.table;
      if (a === "row+") t.push(t[0].map(() => "")); if (a === "row-" && t.length > 2) t.pop();
      if (a === "col+") t.forEach((r, j) => r.push(j === 0 ? "Column" : "")); if (a === "col-" && t[0].length > 1) t.forEach(r => r.pop());
    }
    else if (a === "newpoll") { const ps = pollsOf(key); const id = A.sid + "-l" + (Date.now() % 100000); ps.push({ id, q: "New question?", options: ["Option A", "Option B", "Option C"] }); sl.poll = id; }
    else return;
    markDirty(key); rerender();
  });
  // drag thumbnails to reorder
  let dragFrom = null;
  document.addEventListener("dragstart", e => { const t = e.target.closest && e.target.closest(".adm-th"); if (!t) return; dragFrom = +t.dataset.aslide; e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", String(dragFrom)); } catch (err) {} });
  document.addEventListener("dragover", e => { const t = e.target.closest && e.target.closest(".adm-th"); if (t && dragFrom != null) { e.preventDefault(); document.querySelectorAll(".adm-th.drop").forEach(x => x.classList.remove("drop")); t.classList.add("drop"); } });
  document.addEventListener("drop", e => {
    const t = e.target.closest && e.target.closest(".adm-th"); if (!t || dragFrom == null) return;
    e.preventDefault(); const to = +t.dataset.aslide, key = deckKey(), list = slidesOf(key);
    if (to !== dragFrom) { list.splice(to, 0, list.splice(dragFrom, 1)[0]); A.slide = to; markDirty(key); }
    dragFrom = null; rerender();
  });
  document.addEventListener("dragend", () => { dragFrom = null; document.querySelectorAll(".adm-th.drop").forEach(x => x.classList.remove("drop")); });

  function vLessons() {
    const all = allLessons();
    if (!all.length) return `<div class="empty">The video lessons are not loaded.</div>`;
    if (!A.lesson || !all.some(L => L.id === A.lesson)) A.lesson = all[0].id;
    const key = "lesson:" + A.lesson, L = all.find(x => x.id === A.lesson);
    return `<div class="card row"><select id="admLesson" style="width:auto;max-width:100%">${all.map(x => `<option value="${x.id}"${x.id === A.lesson ? " selected" : ""}>${esc(x.id.replace(/s(\d)-l(\d)/, "$1.$2"))} · ${esc(x.title)}${A.cms["lesson-" + x.id] ? " (edited)" : ""}</option>`).join("")}</select>
      <span class="muted small">${Math.round(L.duration / 60)} min · slides ${L.from + 1}–${L.to + 1} of the deck · ${L.questions.length} questions</span></div>
      <div class="card"><p class="small" style="margin:0">You can change the title, the summary and every question: wording, options, correct answer, explanation and the slide after which it appears (deck index, 0 = first slide; this lesson covers ${L.from}–${L.to}). The narration audio stays as recorded: to change what the voice says, ask Claude to regenerate that lesson.</p></div>
      ${saveBar(key)}<div class="card">${editorHTML(key, { openDepth: 2 })}</div>${saveBar(key)}`;
  }
  function vTemplates() {
    const key = "templates", dr = draft(key);
    if (A.json[key]) return `${saveBar(key)}<div class="card">${editorHTML(key)}</div>`;
    return `<div class="card"><p class="small" style="margin:0">Rename templates, rewrite their description or hide them from the library and the lessons. The Excel and PowerPoint files themselves are fixed: to change a file, ask Claude to regenerate it.</p></div>${saveBar(key)}
      <div class="card adm-editor" data-akey="templates"><div class="scroll"><table class="tbl adm-tpl"><thead><tr><th>Shown</th><th>Template</th><th>Title</th><th>Description</th></tr></thead><tbody>${dr.data.map((it, i) => `<tr><td><input type="checkbox" id="${pid([i, "visible"])}" data-ap="${esc(JSON.stringify([i, "visible"]))}" data-at="bool"${it.visible ? " checked" : ""} aria-label="Show ${esc(it.code)}"></td><td class="small">${esc(it.code)}<br><span class="muted">S${esc(it.id.charAt(1))}</span></td><td>${textInput(it.title, [i, "title"], pid([i, "title"]), true)}</td><td>${textInput(it.purpose, [i, "purpose"], pid([i, "purpose"]), true)}</td></tr>`).join("")}</tbody></table></div></div>${saveBar(key)}`;
  }

  function vSite() {
    const key = "site";
    return `<div class="card"><p class="small" style="margin:0">Brand name and subtitle in the menu, the home page title and introduction, an announcement shown on top of everyone's home page (leave it empty to hide it), and the capstone page. The capstone body uses HTML tags such as &lt;p&gt;, &lt;ul&gt; and &lt;li&gt;.</p></div>${saveBar(key)}<div class="card">${editorHTML(key, { openDepth: 2 })}</div>${saveBar(key)}`;
  }
  function vSecurity() {
    const S = SA().S;
    if (SERVER) return `<div class="grid2"><form class="card" id="srvPwForm" style="display:flex;flex-direction:column;gap:12px"><h3>Change the admin password</h3>
      <div class="field"><label for="srvPwOld">Current password</label><input type="password" id="srvPwOld" autocomplete="current-password"></div>
      <div class="field"><label for="srvPwNew">New password (at least 8 characters)</label><input type="password" id="srvPwNew" autocomplete="new-password"></div>
      <div class="field"><label for="srvPwNew2">Repeat the new password</label><input type="password" id="srvPwNew2" autocomplete="new-password"></div>
      <p class="msg small" role="alert" style="color:var(--live);margin:0"></p><div><button class="btn primary" type="submit">Change password</button></div></form>
      <div class="card"><h3>How the site is protected</h3><ul class="adm-list"><li>Everyone signs in with the username and password you give them. Passwords are stored on the server only as one-way hashes.</li><li>Only the admin account can change course content, create accounts or see other students' work. Students can only save their own answers and progress.</li><li>All data is kept in the <b>data</b> folder on your server, which the web server never shows to visitors. Download that folder by FTP from time to time as a backup.</li><li>After five wrong passwords, that username is blocked for five minutes.</li></ul></div></div>
      <div class="card"><h3>Backup and restore of course content</h3><p class="muted small">Download every content edit as one file, restore a backup, or go back to the original content. Student accounts and progress are not in this file: they are in the data folder.</p>
      <div class="row"><button class="btn" data-aact="export">Download backup (JSON)</button><label class="btn" for="admImport" style="cursor:pointer">Restore a backup…</label><input type="file" id="admImport" accept=".json,application/json" hidden><span class="spacer"></span><button class="btn" data-aact="resetall">Restore all original content</button></div></div>`;
    return `<div class="grid2"><form class="card" id="admPwForm" style="display:flex;flex-direction:column;gap:12px"><h3>Change the admin password</h3>
      <div class="field"><label for="admPwOld">Current password</label><input type="password" id="admPwOld" autocomplete="current-password"></div>
      <div class="field"><label for="admPwNew">New password (at least 8 characters)</label><input type="password" id="admPwNew" autocomplete="new-password"></div>
      <div class="field"><label for="admPwNew2">Repeat the new password</label><input type="password" id="admPwNew2" autocomplete="new-password"></div>
      <div><button class="btn primary" type="submit">Change password</button></div></form>
      <div class="card"><h3>How this panel is protected</h3><ul class="adm-list"><li>The password locks this screen. It is stored only as a fingerprint, never as text.</li>${STATIC ? `<li>On this version of the site, edits stay in your browser until you upload content.json to the server, so nobody else can change the site from their browser.</li><li>To restrict who can open the course, use your web server's password protection or intranet.</li>` : `<li>Saving changes also needs your own account: only the owner of this page can write course content, so a student who guessed the password still could not change anything.</li><li>Who can open the course is decided in the page's Share menu.</li>`}</ul><button class="btn" data-aact="lock">Lock the panel now</button></div></div>
      <div class="card"><h3>Backup and restore</h3><p class="muted small">Download every edit you made as one file, restore a backup, or go back to the original content.</p>
      <div class="row">${S.dl || STATIC ? `<button class="btn" data-aact="export">${STATIC ? "Download content.json" : "Download backup (JSON)"}</button>` : ""}<label class="btn" for="admImport" style="cursor:pointer">Restore a backup…</label><input type="file" id="admImport" accept=".json,application/json" hidden><span class="spacer"></span><button class="btn" data-aact="resetall">Restore all original content</button></div></div>`;
  }
  function locked() {
    return `<div class="hero"><div class="eyebrow">Admin</div><h1>Admin panel</h1></div>
      <form class="card adm-lock" id="admLockForm"><h3>Enter the admin password</h3><div class="field"><label for="admPw">Password</label><input type="password" id="admPw" autocomplete="current-password" autofocus></div><div><button class="btn primary" type="submit">Open the panel</button></div><p class="muted small" id="admLockMsg"></p></form>`;
  }
  function html() {
    const S = SA().S;
    if (S.role === "loading") return `<div class="empty">Loading…</div>`;
    if (S.role !== "teacher" && !STATIC) return `<div class="hero"><div class="eyebrow">Admin</div><h1>Admin panel</h1></div><div class="card"><p>${SERVER ? "The admin panel is only available to the admin account. Sign out and sign in as admin to open it." : "The admin panel is only available to the owner of the course page, signed in with their own account."}</p></div>`;
    if (SERVER) A.unlocked = true; // the admin already signed in with the server password
    if (!A.unlocked) return locked();
    const views = { home: vHomeAdm, students: STATIC ? vStudentsStatic : () => SA().teacherHTML(), teach: vTeach, sessions: vSessions, slides: vSlides, lessons: vLessons, templates: vTemplates, site: vSite, security: vSecurity };
    const dirtyN = Object.values(A.drafts).filter(d => d.dirty).length;
    return `<div class="adm"><div class="hero"><div class="eyebrow">Admin</div><h1>Admin panel</h1></div>
      <nav class="adm-nav" aria-label="Admin sections">${SECS.map(([k, l]) => `<button type="button" class="${A.sec === k ? "on" : ""}" data-asec="${k}">${l}${Object.keys(A.drafts).some(d => A.drafts[d].dirty && secOf(d) === k) ? " •" : ""}</button>`).join("")}<span class="spacer"></span>${dirtyN ? `<span class="pill">${dirtyN} unsaved</span>` : ""}${SERVER ? "" : `<button type="button" class="btn sm ghost adm-lockbtn" data-aact="lock">Lock</button>`}</nav>
      ${STATIC && localDirty() ? `<div class="card adm-warn row"><span class="small"><b>Changes saved in this browser only.</b> Download content.json and upload it to your site folder, replacing the old one, so everyone sees them.</span><span class="spacer"></span><button type="button" class="btn sm primary" data-aact="export">Download content.json</button></div>` : ""}
      <div class="adm-body">${views[A.sec]()}</div></div>`;
  }
  const secOf = key => ({ session: "sessions", deck: "slides", live: "slides", lesson: "lessons", templates: "templates", site: "site" })[key.split(":")[0]];

  // ---------- saving ----------
  function payload(key) {
    const d = clone(draft(key).data), [kind] = key.split(":"), at = Date.now();
    if (kind === "session") { delete d.id; delete d.num; delete d.slides; return { data: d, at }; }
    if (kind === "deck") return { slides: d, at };
    if (kind === "lesson") return { title: d.title, summary: d.summary, questions: d.questions.map(q => Object.assign({}, q, { after: +q.after, answer: +q.answer })), at };
    if (kind === "templates") return { items: Object.fromEntries(d.map(it => [it.id, { title: it.title, purpose: it.purpose, hidden: !it.visible }])), at };
    if (kind === "live") return { slides: d.slides, polls: d.polls, at };
    if (kind === "site") return { site: d.site, capstone: d.capstone, at };
  }
  function check(key) {
    const d = draft(key).data, [kind, id] = key.split(":");
    if (kind === "lesson") {
      const L = allLessons().find(x => x.id === id);
      for (const [i, q] of d.questions.entries()) {
        if (!q.q || !Array.isArray(q.options) || q.options.length < 2) return `Question ${i + 1} needs a text and at least two options.`;
        if (!(+q.answer >= 0 && +q.answer < q.options.length)) return `Question ${i + 1}: the correct option must be between 0 and ${q.options.length - 1}.`;
        if (!(+q.after >= L.from && +q.after <= L.to)) return `Question ${i + 1}: the slide must be between ${L.from} and ${L.to}.`;
      }
    }
    if (kind === "deck" && !d.length) return "A deck needs at least one slide.";
    if (kind === "live" && !d.slides.length) return "A deck needs at least one slide.";
    const size = JSON.stringify(payload(key)).length;
    if (size > 250000) return "This item is too large to save in one piece.";
    return "";
  }
  async function save(key) {
    const S = SA().S; if (!S.db && !STATIC) { SA().toast("Saving is not available in this view."); return; }
    const err = check(key); if (err) { SA().toast(err); return; }
    try {
      if (key.startsWith("live:")) await S.db.doc("teacher/deck-" + key.split(":")[1]).set(payload(key));
      else await put(docName(key), payload(key));
      draft(key).dirty = false; SA().toast(S.db ? "Saved. Students see the change now." : PUBLISH_NOTE);
      SA().render();
    } catch (e) { SA().toast(e && e.code === "permission_denied" ? (SERVER ? "Only the admin account can save content." : "Only the owner of the page can save content.") : "Could not save. Try again."); }
  }
  async function revert(key, btn) {
    if (btn.dataset.confirm !== "1") { btn.dataset.confirm = "1"; btn.textContent = "Click again to restore"; return; }
    try { if (key.startsWith("live:")) await SA().S.db.doc("teacher/deck-" + key.split(":")[1]).delete(); else await del(docName(key)); delete A.drafts[key]; SA().toast("Original content restored."); SA().render(); }
    catch (e) { SA().toast("Could not restore."); }
  }
  async function liveSet(patch) {
    const S = SA().S; const next = Object.assign({}, S.live, patch);
    if (!S.db) { S.live = next; return true; }
    try { await S.db.doc("live/state").set(next); return true; } catch (e) { SA().toast("Could not update the live class."); return false; }
  }
  function rerender() { const y = window.scrollY; SA().render(); window.scrollTo(0, y); }
  function markDirty(key) { const d = draft(key); if (!d.dirty) { d.dirty = true; const bars = document.querySelectorAll(".adm-save"); bars.forEach(b => { const s = b.querySelector("span"); if (s) { s.className = "adm-dirty small"; s.textContent = "Unsaved changes"; } const sv = b.querySelector('[data-aact="save"]'); if (sv) sv.disabled = false; const dc = b.querySelector('[data-aact="discard"]'); if (dc) dc.hidden = false; }); } }

  // ---------- events ----------
  const view = () => document.getElementById("view");
  function keyFor(el) { const e = el.closest("[data-akey]"); return e && e.dataset.akey; }
  function onInput(e) {
    const el = e.target; if (!el.dataset || !el.dataset.ap || !el.closest(".adm")) return;
    const key = keyFor(el); if (!key) return;
    const path = JSON.parse(el.dataset.ap), d = draft(key);
    let v = el.dataset.at === "bool" ? el.checked : el.dataset.at === "num" ? (el.value === "" ? 0 : +el.value) : el.value;
    if (el.dataset.at === "num" && isNaN(v)) return;
    setAt(d.data, path, v); markDirty(key);
  }
  document.addEventListener("input", onInput);
  document.addEventListener("change", e => {
    const el = e.target;
    if (el.dataset && el.dataset.ap && el.type === "checkbox") onInput(e);
    if (el.id === "admSess") { A.sid = el.value; A.slide = 0; rerender(); }
    if (el.id === "admLesson") { A.lesson = el.value; rerender(); }
    if (el.id === "admImport" && el.files && el.files[0]) importFile(el.files[0], el);
  });
  document.addEventListener("toggle", e => { const d = e.target; if (d.dataset && d.dataset.apath) A.open[d.dataset.apath] = d.open; }, true);
  document.addEventListener("submit", async e => {
    if (e.target.id === "admLockForm") {
      e.preventDefault();
      const pw = document.getElementById("admPw").value; const msg = document.getElementById("admLockMsg");
      try {
        const h = await sha("sa-admin:" + pw);
        if (h === currentHash()) { A.unlocked = true; SS.set("adm", h); syncRole(); SA().render(); if (A.sec === "students") SA().loadOthers(); }
        else { msg.textContent = "That password is not right."; document.getElementById("admPw").select(); }
      } catch (err) { msg.textContent = "This browser cannot check the password."; }
    }
    if (e.target.id === "admPwForm") {
      e.preventDefault();
      const o = document.getElementById("admPwOld").value, n = document.getElementById("admPwNew").value, n2 = document.getElementById("admPwNew2").value;
      if ((await sha("sa-admin:" + o)) !== currentHash()) { SA().toast("The current password is not right."); return; }
      if (n.length < 8) { SA().toast("Use at least 8 characters."); return; }
      if (n !== n2) { SA().toast("The new passwords do not match."); return; }
      const h = await sha("sa-admin:" + n);
      try { SS.set("adm", h); await put("lock", { hash: h, at: Date.now() }); A.lockHash = h; SA().toast(STATIC ? "Password changed in this browser. Publish content.json to apply it on the site." : "Password changed."); e.target.reset(); }
      catch (err) { SA().toast("Could not change the password."); }
    }
  });
  document.addEventListener("click", async e => {
    const b = e.target.closest("[data-asec],[data-aop],[data-aact],[data-aslide]"); if (!b || !b.closest(".adm, .adm-stats")) return;
    if (b.dataset.asec) { e.preventDefault(); A.sec = b.dataset.asec; SA().render(); window.scrollTo(0, 0); if (A.sec === "students") { const t = SA().S.teacherTab; if (t === "progress" || t === "subs") SA().loadOthers(); } return; }
    if (b.dataset.aslide) { A.slide = +b.dataset.aslide; rerender(); return; }
    if (b.dataset.aop) {
      const key = keyFor(b); if (!key) return;
      const d = draft(key), path = JSON.parse(b.dataset.ap), arr = getAt(d.data, path), i = +b.dataset.ai;
      if (!Array.isArray(arr)) return;
      const op = b.dataset.aop;
      if (op === "add") arr.push(arr.length ? blankLike(arr[arr.length - 1]) : "");
      if (op === "del") arr.splice(i, 1);
      if (op === "up" && i > 0) arr.splice(i - 1, 0, arr.splice(i, 1)[0]);
      if (op === "down" && i < arr.length - 1) arr.splice(i + 1, 0, arr.splice(i, 1)[0]);
      A.open[JSON.stringify(path)] = true;
      d.dirty = true; rerender(); return;
    }
    const act = b.dataset.aact, key = b.dataset.akey;
    if (act === "save") return save(key);
    if (act === "discard") { delete A.drafts[key]; rerender(); return; }
    if (act === "revert") return revert(key, b);
    if (act === "json") { A.json[key] = !A.json[key]; rerender(); return; }
    if (act === "jsonapply") {
      const ta = document.querySelector(`[data-ajson="${CSS.escape(key)}"]`);
      try { const v = JSON.parse(ta.value); const d = draft(key); if (Array.isArray(d.data) !== Array.isArray(v)) throw new Error("shape"); d.data = v; d.dirty = true; A.json[key] = false; rerender(); SA().toast("Applied. Press Save and publish to keep it."); }
      catch (err) { SA().toast("The data is not valid JSON. Check commas and quotes."); }
      return;
    }
    if (act === "lock") { A.unlocked = false; SS.set("adm", null); syncRole(); SA().render(); return; }
    if (act === "live") { const sid = b.dataset.asid; if (await liveSet({ on: true, session: sid, slide: 0, poll: null, pollOpen: false, showResults: false })) { SA().S.asStudent = false; location.hash = "live"; } return; }
    if (act === "liveoff") { if (await liveSet({ on: false })) SA().toast("The live class has ended."); return; }
    if (act === "present") { const S = SA().S; S.asStudent = false; S.tab[b.dataset.asid] = "slides"; location.hash = b.dataset.asid; return; }
    if (act === "asstudent") { const S = SA().S; S.asStudent = !S.asStudent; if (S.asStudent) location.hash = "home"; else SA().render(); return; }
    // slides
    if (act === "export") {
      const data = { app: "stakeholder-academy", exportedAt: new Date().toISOString(), cms: A.cms };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const filename = STATIC ? "content.json" : "stakeholder-academy-content-backup.json";
      if (SA().S.dl) { try { await SA().S.dl.save({ filename, data: blob }); } catch (err) { if (!(err && err.code === "declined")) SA().toast("The download did not start."); } }
      else { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
      return;
    }
    if (act === "resetall") {
      if (b.dataset.confirm !== "1") { b.dataset.confirm = "1"; b.textContent = "Click again: this removes every edit"; return; }
      try { for (const k of Object.keys(A.cms).filter(k => k !== "lock")) await del(k); A.drafts = {}; SA().toast("All original content restored."); } catch (err) { SA().toast("Some items could not be restored."); }
      return;
    }
  });
  async function importFile(file, input) {
    try {
      const data = JSON.parse(await file.text());
      if (!data || data.app !== "stakeholder-academy" || typeof data.cms !== "object") throw new Error("format");
      const ok = /^(session-s[1-4]|deck-s[1-4]|lesson-s[1-4]-l\d|templates|site|settings)$/;
      const keys = Object.keys(data.cms).filter(k => ok.test(k));
      for (const k of keys) await put(k, data.cms[k]);
      A.drafts = {}; SA().toast(`Backup restored: ${keys.length} items.`);
    } catch (err) { SA().toast("This file is not a Stakeholder Academy backup."); }
    input.value = "";
  }

  window.ADMIN = { html, apply, saveLocal };
  if (STATIC) fetch("content.json", { cache: "no-store" }).then(r => r.ok ? r.json() : {}).catch(() => ({})).then(j => { A.base = (j && j.cms) || {}; apply(effective()); });
  // edits that arrived before this script loaded
  if (SA() && SA().S.cms) apply(SA().S.cms);
})();
if (window.SA) window.SA.render();
