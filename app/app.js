(function () {
  "use strict";
  const C = window.COURSE, D = window.DATA;
  const META = C.meta || { id: "stakeholder", title: "Stakeholder Academy", subtitle: "Stakeholder Management for Indirect Procurement" };
  C.site = Object.assign({ brand: "Procurement Academy", courseTitle: META.title, courseSub: META.subtitle, heroTitle: "From reactive buyer to trusted business partner", heroLead: "Four live online sessions. Between them, you build and agree a real Procurement plan with one of your own internal clients.", announcement: "" }, C.site || {});
  const SESS = C.sessions.slice().sort((a, b) => a.num - b.num);
  const DECKS = window.DECKS || {};
  SESS.forEach(s => { const d = DECKS[s.id]; if (d) { s.slides = d.slides; if (d.polls) s.polls = s.polls.concat(d.polls.filter(p => !s.polls.some(x => x.id === p.id))); } });
  const COLORS = ["var(--s1)", "var(--s2)", "var(--s3)", "var(--s4)"];
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const view = $("#view");

  // ---------- state ----------
  const S = {
    db: null, user: null, room: null, dl: null,
    me: { id: null, isOwner: false }, role: "loading", // teacher | student | pending | guest | preview
    asStudent: false,
    settings: { cohort: "", sessions: {} },
    live: { on: false, session: "s1", slide: 0, poll: null, pollOpen: false, showResults: false },
    roster: {}, requests: {}, answers: {}, qa: {}, peers: [], liveDecks: {},
    names: {},
    ex: {}, prog: { done: {}, quiz: {}, lessons: {} },
    route: "home", tab: {}, deckIdx: {}, follow: true, liveSlideLocal: 0, liveTab: "poll",
    teacherTab: "students", subEx: "s1-ex1", others: {}
  };
  const isTeacher = () => S.role === "teacher" && !S.asStudent;
  const enrolled = () => S.role === "teacher" || S.role === "student" || S.role === "preview";

  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }
  const LS = {
    get(k, d) { try { const v = localStorage.getItem("sa:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("sa:" + k, JSON.stringify(v)); } catch (e) {} }
  };

  // ---------- names ----------
  async function resolveNames(ids) {
    const need = ids.filter(id => id && !(id in S.names));
    if (!need.length || !S.user || !S.user.profiles) return;
    try { const ps = await S.user.profiles(need); need.forEach(id => { S.names[id] = (ps[id] && ps[id].name) || "Participant"; }); } catch (e) {}
  }
  const nameOf = id => S.names[id] || "Participant";
  function avatar(id) {
    const n = nameOf(id); const hue = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return `<span class="avatar" style="background:hsl(${hue} 45% 42%)">${esc(n.trim().charAt(0).toUpperCase() || "?")}</span>`;
  }

  // ---------- persistence ----------
  const timers = {};
  function saveEx(exId) {
    const status = document.querySelector(`[data-save="${exId}"]`);
    if (status) status.textContent = "Saving…";
    clearTimeout(timers[exId]);
    timers[exId] = setTimeout(async () => {
      const body = { values: S.ex[exId] || {}, updatedAt: Date.now() };
      try {
        if (S.db && S.me.id && S.role !== "preview") await S.db.doc(`subs/${S.me.id}/ex/${exId}`).set(body);
        else LS.set("ex:" + exId, body.values);
        const st = document.querySelector(`[data-save="${exId}"]`); if (st) st.textContent = "Saved";
      } catch (e) {
        const st = document.querySelector(`[data-save="${exId}"]`); if (st) st.textContent = "Not saved: " + (e.code === "invalid_argument" ? "you do not have write access" : "try again");
      }
    }, 900);
  }
  function saveProg() {
    clearTimeout(timers.__prog);
    timers.__prog = setTimeout(async () => {
      const body = { done: S.prog.done, quiz: S.prog.quiz, lessons: S.prog.lessons || {}, updatedAt: Date.now() };
      try {
        if (S.db && S.me.id && S.role !== "preview") await S.db.doc(`subs/${S.me.id}`).set(body);
        else LS.set("prog", body);
      } catch (e) { toast("Progress not saved. Check your access."); }
    }, 600);
  }

  // ---------- helpers for content ----------
  function tableHTML(head, rows, numCols) {
    numCols = numCols || [];
    return `<div class="scroll"><table class="tbl"><thead><tr>${head.map((h, i) => `<th${numCols.includes(i) ? ' class="num"' : ""}>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${numCols.includes(i) ? ' class="num"' : ""}>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function fill(html) {
    const n = D.nordvia, g = D.group;
    return String(html)
      .replace("{{nordviaClients}}", tableHTML(["Internal client", "Head (fictional)", "Spend €M", "Suppliers", "Procurement involvement today"], n.clients.map(c => [c.area, c.head, c.spend.toFixed(0), c.suppliers, c.today]), [2, 3]))
      .split("{{nordviaIT}}").join(tableHTML(["Supplier", "Service", "Spend €M", "Contract", "Expiry", "Observation"], n.itSuppliers.map(s => [s.supplier, s.service, s.spend.toFixed(1), s.contract, s.expiry, s.note]), [2]))
      .replace("{{nordviaMarketing}}", tableHTML(["Service", "Spend €M", "Suppliers", "What we know"], n.marketing.map(m => [m.service, m.spend.toFixed(1), m.suppliers, m.fact]), [1]))
      .replace("{{sizeBands}}", tableHTML(["Supplier size (annual)", "% of supplier records", "% of spend"], g.sizeBands.map(b => [b.band, b.recordsPct + "%", b.spendPct + "%"]), [1, 2]))
      .replace("{{subcats}}", tableHTML(["Sub-category", "Spend €M (approx.)", "Entities buying", "Suppliers", "Negotiated by"], g.subcats.map(s => [s.name, "≈ " + s.spend, s.entities + " of 10", "≈ " + s.suppliers, s.type]), [1, 2, 3]));
  }
  function allExercises() {
    const out = [];
    SESS.forEach(s => {
      s.modules.forEach(m => m.exercise && out.push({ s, ex: m.exercise, where: "Module " + m.id }));
      if (s.case.exercise) out.push({ s, ex: s.case.exercise, where: "Case" });
      if (s.fieldwork.exercise) out.push({ s, ex: s.fieldwork.exercise, where: "Fieldwork" });
    });
    return out;
  }
  let EXS = allExercises();
  const exById = id => (EXS.find(e => e.ex.id === id) || {}).ex;
  function filled(v) {
    if (v == null) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (typeof v === "number") return true;
    if (Array.isArray(v)) return v.some(filled);
    if (typeof v === "object") return Object.values(v).some(filled);
    return !!v;
  }
  function sessionProgress(s, ex, prog) {
    ex = ex || S.ex; prog = prog || S.prog;
    const exs = EXS.filter(e => e.s.id === s.id);
    const items = [...exs.map(e => filled(ex[e.ex.id] && (ex[e.ex.id].values || ex[e.ex.id]))),
      ...s.fieldwork.items.map(i => !!(prog.done || {})[i.id]),
      !!((prog.quiz || {})[s.id]),
      ...((window.LESSONS || {})[s.id] || []).map(L => !!((prog.lessons || {})[L.id] || {}).done)];
    return { done: items.filter(Boolean).length, total: items.length };
  }

  // ---------- exercise forms ----------
  function scoreCalc(r) {
    const n = k => Math.max(0, Math.min(5, parseFloat(r[k]) || 0));
    const value = 0.3 * n("spend") + 0.25 * n("opp") + 0.2 * n("demand") + 0.25 * n("crit");
    const rel = (n("access") + n("timing")) / 2;
    if (!value && !rel) return null;
    const hiV = value >= 3, hiR = rel >= 3;
    const seg = hiV && !hiR ? "Develop" : hiV && hiR ? "Partner" : !hiV && hiR ? "Maintain" : "Serve";
    const label = { Develop: "Develop", Partner: "Strategic partner", Maintain: "Maintain", Serve: "Serve efficiently" }[seg];
    return { value: value.toFixed(1), rel: rel.toFixed(1), seg, label };
  }
  function calcText(f, v) {
    if (f.calc === "involvement") {
      const rows = (v || []).filter(r => r && r.stage);
      if (!rows.length) return "Choose a stage for each request to see your rates.";
      const early = rows.filter(r => ["Idea", "Budget", "Requirement"].includes(r.stage)).length;
      const chosen = rows.filter(r => r.chosen === "Yes").length;
      return `Early involvement rate: <b>${Math.round(early / rows.length * 100)}%</b> · Pre-decided rate: <b>${Math.round(chosen / rows.length * 100)}%</b> · based on ${rows.length} requests`;
    }
    if (f.calc && f.calc.startsWith("sum:")) {
      const k = f.calc.slice(4); const t = (v || []).reduce((a, r) => a + (parseFloat(r && r[k]) || 0), 0);
      return `Total explained: <b>€${t.toFixed(1)}M</b>`;
    }
    if (f.type === "split") {
      if (f.max) return "";
      const t = f.parts.reduce((a, p) => a + (parseFloat((v || {})[p]) || 0), 0);
      return `Total: <b>${t}%</b>${t && t !== 100 ? " (should be 100%)" : ""}`;
    }
    return "";
  }
  function fieldHTML(exId, f, v, ro) {
    const RO = ro ? " readonly" : "", DIS = ro ? " disabled" : "";
    const id = `${exId}__${f.key}`;
    const attrs = (extra) => `data-ex="${exId}" data-f="${f.key}"${extra || ""}`;
    switch (f.type) {
      case "text": return `<div class="field"><label for="${id}">${esc(f.label)}</label><input type="text" id="${id}" ${attrs()} value="${esc(v || "")}"${RO}></div>`;
      case "number": return `<div class="field"><label for="${id}">${esc(f.label)}</label><input type="number" id="${id}" ${attrs()} value="${esc(v || "")}"${RO}></div>`;
      case "textarea": return `<div class="field"><label for="${id}">${esc(f.label)}</label><textarea id="${id}" ${attrs()}${RO}>${esc(v || "")}</textarea></div>`;
      case "select": return `<div class="field"><label for="${id}">${esc(f.label)}</label><select id="${id}" ${attrs()}${DIS}><option value="">Choose…</option>${f.options.map(o => `<option${o === v ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></div>`;
      case "check": {
        const val = v == null ? "" : v; let fb = "";
        if (val !== "") { const ok = Math.abs(parseFloat(val) - f.answer) <= (f.tol || 0); fb = ok ? `<span class="check-ok">Correct</span>` : `<span class="check-no">Not quite${f.hint ? ". Hint: " + esc(f.hint) : ""}</span>`; }
        return `<div class="field"><label for="${id}">${esc(f.label)}</label><div class="row"><input type="number" step="any" style="max-width:160px" id="${id}" ${attrs()} value="${esc(val)}"${RO}><span id="fb-${id}">${fb}</span></div></div>`;
      }
      case "split": case "range": {
        const max = f.max || (f.type === "split" ? 100 : "");
        return `<div class="field"><span class="lbl">${esc(f.label)}</span><div class="parts">${f.parts.map((p, i) => `<label>${esc(p)}<input type="number" min="0"${max ? ` max="${max}"` : ""} id="${id}_${i}" ${attrs(` data-p="${esc(p)}"`)} value="${esc((v || {})[p] || "")}"${RO}></label>`).join("")}</div>${f.type === "split" ? `<div class="calc" id="calc-${id}">${calcText(f, v)}</div>` : ""}</div>`;
      }
      case "pairs": return `<div class="field"><span class="lbl">${esc(f.label)}</span><div class="pairs">${f.items.map((it, i) => `<label for="${id}_${i}" class="small">${esc(it)}</label><input type="text" id="${id}_${i}" ${attrs(` data-p="${esc(it)}"`)} value="${esc((v || {})[it] || "")}"${RO}>`).join("")}</div></div>`;
      case "checks": return `<div class="field"><span class="lbl">${esc(f.label)}</span><div class="todo">${f.items.map((it, i) => `<label><input type="checkbox" id="${id}_${i}" ${attrs(` data-p="${esc(it)}"`)}${(v || {})[it] ? " checked" : ""}${DIS}><span>${esc(it)}</span></label>`).join("")}</div></div>`;
      case "canvas": return `<div class="field"><span class="lbl">${esc(f.label)}</span><div class="canvas">${f.items.map((it, i) => { const c = (v || {})[it] || {}; return `<div class="cell"><b>${esc(it)}</b><textarea id="${id}_${i}" ${attrs(` data-p="${esc(it)}" data-sub="text"`)} style="min-height:60px"${RO}>${esc(c.text || "")}</textarea><label class="small muted"><input type="checkbox" id="${id}_${i}a" ${attrs(` data-p="${esc(it)}" data-sub="assumed"`)}${c.assumed ? " checked" : ""}${DIS}> Assumed, to check</label></div>`; }).join("")}</div></div>`;
      case "rows": case "score": {
        const cols = f.type === "score" ? [
          { key: "name", label: "Stakeholder", type: "text" },
          { key: "spend", label: "Spend 30%", type: "n5" }, { key: "opp", label: "Opportunity 25%", type: "n5" },
          { key: "demand", label: "Demand 20%", type: "n5" }, { key: "crit", label: "Criticality 25%", type: "n5" },
          { key: "access", label: "Access 50%", type: "n5" }, { key: "timing", label: "Timing 50%", type: "n5" }] : f.columns;
        const rows = Array.isArray(v) ? v.slice() : [];
        const n = Math.max(f.minRows || 1, rows.length, (f.preset || []).length);
        let body = "";
        for (let r = 0; r < n; r++) {
          const row = rows[r] || {};
          body += `<tr>${cols.map((c, ci) => {
            let val = row[c.key]; if ((val == null || val === "") && ci === 0 && f.preset && f.preset[r]) val = f.preset[r];
            const a = `data-ex="${exId}" data-f="${f.key}" data-r="${r}" data-c="${c.key}" id="${id}_${r}_${c.key}" aria-label="${esc(c.label)} row ${r + 1}"`;
            if (c.type === "select") return `<td><select ${a}${DIS}><option value=""></option>${c.options.map(o => `<option${o === val ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></td>`;
            if (c.type === "n5") return `<td style="width:74px"><select ${a}${DIS}><option value=""></option>${[1, 2, 3, 4, 5].map(o => `<option${String(o) === String(val) ? " selected" : ""}>${o}</option>`).join("")}</select></td>`;
            if (c.type === "number") return `<td style="width:110px"><input type="number" step="any" ${a} value="${esc(val || "")}"${RO}></td>`;
            return `<td><input type="text" ${a} value="${esc(val || "")}"${RO}></td>`;
          }).join("")}${f.type === "score" ? `<td id="seg-${id}-${r}">${segCell(row)}</td>` : ""}</tr>`;
        }
        return `<div class="field"><span class="lbl">${esc(f.label)}</span><div class="scroll"><table class="rows"><thead><tr>${cols.map(c => `<th>${esc(c.label)}</th>`).join("")}${f.type === "score" ? "<th>Segment</th>" : ""}</tr></thead><tbody>${body}</tbody></table></div>${ro ? "" : `<div><button class="btn sm ghost" data-addrow="${exId}|${f.key}|${n}">Add a row</button></div>`}${f.calc ? `<div class="calc" id="calc-${id}">${calcText(f, v)}</div>` : ""}</div>`;
      }
    }
    return "";
  }
  function segCell(row) { const s = scoreCalc(row || {}); return s ? `<span class="seg ${s.seg}" title="Value ${s.value} · Relationship ${s.rel}">${s.label}</span>` : `<span class="muted small">–</span>`; }
  function exVals(id) { const e = S.ex[id]; return e && e.values ? e.values : (e || {}); }
  function exerciseHTML(ex, opts) {
    opts = opts || {};
    const vals = opts.values || exVals(ex.id), ro = !!opts.readonly;
    return `<section class="ex" id="ex-${ex.id}">
      <div class="ex-head"><span class="pill">Practice</span><h4>${esc(ex.title)}</h4>${ex.minutes ? `<span class="muted small">${ex.minutes} min</span>` : ""}<span class="spacer"></span>${ro ? "" : `<span class="save" data-save="${ex.id}">${filled(vals) ? "Saved" : ""}</span>`}</div>
      ${ex.brief ? `<p class="muted" style="margin:0">${esc(ex.brief)}</p>` : ""}
      ${ex.fields.map(f => fieldHTML(ex.id, f, vals[f.key], ro)).join("")}
    </section>`;
  }
  function setPath(exId, el) {
    const ex = exById(exId); if (!ex) return;
    const f = ex.fields.find(x => x.key === el.dataset.f); if (!f) return;
    const cur = Object.assign({}, exVals(exId));
    const val = el.type === "checkbox" ? el.checked : el.value;
    if (el.dataset.r != null) {
      const rows = Array.isArray(cur[f.key]) ? cur[f.key].slice() : [];
      const r = +el.dataset.r; while (rows.length <= r) rows.push({});
      // keep preset labels when a row is first edited
      if (f.preset && f.preset[r] && f.columns && !rows[r][f.columns[0].key]) rows[r] = Object.assign({ [f.columns[0].key]: f.preset[r] }, rows[r]);
      rows[r] = Object.assign({}, rows[r], { [el.dataset.c]: val });
      cur[f.key] = rows;
    } else if (el.dataset.p != null) {
      const o = Object.assign({}, cur[f.key] || {});
      if (el.dataset.sub) o[el.dataset.p] = Object.assign({}, o[el.dataset.p] || {}, { [el.dataset.sub]: val });
      else o[el.dataset.p] = val;
      cur[f.key] = o;
    } else cur[f.key] = val;
    S.ex[exId] = { values: cur };
    // live calc updates without re-rendering inputs
    const id = `${exId}__${f.key}`;
    const calc = document.getElementById("calc-" + id); if (calc) calc.innerHTML = calcText(f, cur[f.key]);
    if (f.type === "score" && el.dataset.r != null) { const c = document.getElementById(`seg-${id}-${el.dataset.r}`); if (c) c.innerHTML = segCell(cur[f.key][+el.dataset.r]); }
    if (f.type === "check") { const fb = document.getElementById("fb-" + id); if (fb && val !== "") { const ok = Math.abs(parseFloat(val) - f.answer) <= (f.tol || 0); fb.innerHTML = ok ? `<span class="check-ok">Correct</span>` : `<span class="check-no">Not quite${f.hint ? ". Hint: " + esc(f.hint) : ""}</span>`; } }
    saveEx(exId);
  }

  // ---------- slides ----------
  function pollCounts(pollId) {
    const counts = {}; let total = 0;
    Object.values(S.answers).forEach(a => { if (a && a[pollId] != null) { counts[a[pollId]] = (counts[a[pollId]] || 0) + 1; total++; } });
    return { counts, total };
  }
  function sections(sess) {
    const out = [];
    sess.slides.forEach((sl, i) => { if ((sl.k || sl.kind) === "section" || i === 0) out.push({ i, label: i === 0 ? "Opening" : (sl.n ? sl.n + " " : "") + sl.h }); });
    return out;
  }
  function sectionOf(sess, i) { let cur = null; sess.slides.forEach((sl, k) => { if (k <= i && (sl.k || sl.kind) === "section") cur = sl; }); return cur; }
  const li = arr => `<ul>${(arr || []).map(b => `<li>${esc(b)}</li>`).join("")}</ul>`;
  // Draws one slide. opts.slide/total/section let the live class draw a slide sent by the teacher without the deck;
  // opts.edit marks every text with its data path so the admin's visual editor can edit it in place.
  function findPoll(id) {
    return SESS.flatMap(s => s.polls).find(x => x.id === id) || Object.values(S.liveDecks || {}).flatMap(d => (d && d.polls) || []).find(x => x.id === id) || (S.live.pollDef && S.live.pollDef.id === id ? S.live.pollDef : null);
  }
  function slideHTML(sess, i, opts) {
    opts = opts || {};
    const sl = opts.slide || sess.slides[i]; if (!sl) return "";
    const ed = !!opts.edit;
    const T = (path, v, tag, cls) => `<${tag}${cls ? ` class="${cls}"` : ""}${ed ? ` data-ep='${JSON.stringify(path)}'` : ""}>${esc(v == null ? "" : v)}</${tag}>`;
    const L = (arr, path) => `<ul>${(arr || []).map((b, j) => T(path.concat(j), b, "li")).join("")}</ul>`;
    const k = sl.k || sl.kind || (sl.table || sl.t ? "table" : sl.stats || sl.s && !sl.k ? "stats" : "bullets");
    const total = opts.total || sess.slides.length;
    const n = `<span class="pageno">${sess.num}.${i + 1} / ${total}</span>`;
    const sec = opts.section !== undefined ? opts.section : sectionOf(sess, i);
    const kick = `<div class="kicker">${sec ? "Module " + esc(sec.n || "") + " · " + esc(sec.h) : (opts.live ? "Live class" : "Session " + sess.num) + " · " + esc(sess.title)}</div>`;
    const note = sl.foot ? T(["foot"], sl.foot, "div", "note") : "";
    const H = sl.h != null ? T(["h"], sl.h, "h2") : "";
    let body = "", cls = "";
    switch (k) {
      case "title": return `<div class="slide title"><div class="kicker">${esc(C.site.courseTitle)} · ${opts.live ? "Live class · " : ""}Session ${sess.num}</div>${T(["h"], sl.h, "h2")}${T(["sub"], sl.sub || "", "div", "sub")}${n}</div>`;
      case "section": return `<div class="slide section">${T(["n"], sl.n || "", "div", "secno")}${T(["h"], sl.h, "h2")}${T(["sub"], sl.sub || "", "div", "sub")}${n}</div>`;
      case "statement": return `<div class="slide statement">${kick}${T(["h"], sl.h, "h2")}${sl.p || ed ? T(["p"], sl.p || "", "p", "sp") : ""}${note}${n}</div>`;
      case "quote": return `<div class="slide statement">${kick}${T(["q"], sl.q, "blockquote")}${sl.by || ed ? T(["by"], sl.by || "", "div", "by") : ""}${note}${n}</div>`;
      case "discuss": return `<div class="slide discuss">${kick}<div class="dtag"><span>Let's discuss</span>${sl.format || ed ? T(["format"], sl.format || "", "em") : ""}${sl.min ? `<em>${esc(sl.min)} min</em>` : ""}</div>${H}${T(["q"], sl.q || "", "blockquote", /["\u201C]/.test(sl.q || "") ? "noq" : "")}${(sl.b && sl.b.length) || ed ? `<div class="dbox">${L(sl.b, ["b"])}</div>` : ""}${note}${n}</div>`;
      case "bullets": body = L(sl.b || sl.bullets, [sl.b ? "b" : "bullets"]); break;
      case "stats": { const key = sl.s ? "s" : "stats"; body = `<div class="stats">${(sl.s || sl.stats).map((s, j) => `<div>${T([key, j, 0], s[0], "b")}${T([key, j, 1], s[1], "span")}</div>`).join("")}</div>`; break; }
      case "big": body = `<div class="big">${sl.big.map((s, j) => `<div>${T(["big", j, 0], s[0], "b")}${T(["big", j, 1], s[1], "span")}</div>`).join("")}</div>`; break;
      case "table": { const key = sl.t ? "t" : "table", t = sl[key]; body = `<table class="${t[0].length > 3 ? "dense" : ""}"><thead><tr>${t[0].map((c, j) => T([key, 0, j], c, "th")).join("")}</tr></thead><tbody>${t.slice(1).map((r, ri) => `<tr>${r.map((c, j) => T([key, ri + 1, j], c, "td")).join("")}</tr>`).join("")}</tbody></table>`; break; }
      case "two": body = `<div class="cols2"><div>${T(["l", "t"], sl.l.t, "h3")}${L(sl.l.b, ["l", "b"])}</div><div class="${sl.hi === "r" ? "hi" : ""}">${T(["r", "t"], sl.r.t, "h3")}${L(sl.r.b, ["r", "b"])}</div></div>`; break;
      case "steps": body = `<ol class="steps">${sl.s.map((s, j) => `<li>${T(["s", j, 0], s[0], "b")}${s[1] || ed ? T(["s", j, 1], s[1] || "", "span") : ""}</li>`).join("")}</ol>`; cls = sl.s.length > 4 ? " many" : ""; break;
      case "flow": body = `<div class="flow${sl.loop ? " loop" : ""}">${sl.s.map((s, j) => T(["s", j], s, "div")).join("<i>→</i>")}</div>${sl.p || ed ? T(["p"], sl.p || "", "p", "sp small") : ""}`; break;
      case "cards": body = `<div class="cardsg c${Math.min(sl.c.length, 4)}">${sl.c.map((c, j) => `<div>${T(["c", j, 0], c[0], "b")}${T(["c", j, 1], c[1], "span")}</div>`).join("")}</div>`; break;
      case "example": body = `<div class="exbox">${T(["tag"], sl.tag || "Example", "div", "tag")}${sl.p || ed ? T(["p"], sl.p || "", "p") : ""}${sl.b ? L(sl.b, ["b"]) : ""}</div>`; break;
      case "exercise": body = `<div class="exbox ex"><div class="tag">Practice · ${T(["min"], sl.min || "", "span")} min${sl.where || ed ? " · " + T(["where"], sl.where || "", "span") : ""}</div>${L(sl.b, ["b"])}</div>`; break;
      case "takeaways": body = `<div class="exbox take"><div class="tag">Key takeaways</div>${L(sl.b, ["b"])}</div>`; break;
      case "debrief": body = `<div class="exbox"><div class="tag">Debrief questions</div>${L(sl.b, ["b"])}</div>`; break;
      case "bars": { const mx = Math.max(...sl.d.map(d => +d[1] || 0)) || 1; body = `<div class="hbars">${sl.d.map((d, j) => `<div>${T(["d", j, 0], d[0], "span")}<i style="width:${((+d[1] || 0) / mx * 100).toFixed(1)}%"></i>${T(["d", j, 2], d[2] != null ? d[2] : d[1], "em")}</div>`).join("")}</div>`; break; }
      case "quad": { const q = sl.q || [["Develop", "High value, weak relationship: the priority"], ["Strategic partner", "High value, strong relationship"], ["Serve efficiently", "Lower value, weak relationship"], ["Maintain", "Lower value, strong relationship"]]; const hi = sl.hi == null ? 0 : sl.hi; body = `<div class="squad">${q.map((c, j) => `<div class="${j === hi ? "hi" : ""}">${sl.q ? T(["q", j, 0], c[0], "b") + T(["q", j, 1], c[1], "span") : `<b>${esc(c[0])}</b>${esc(c[1])}`}</div>`).join("")}</div><div class="note">${esc(sl.axes || "Vertical: value potential · Horizontal: relationship strength today")}</div>`; break; }
      case "quad2": body = `<div class="squad"><div><b>Bottleneck</b>Low spend, hard to replace</div><div class="hi"><b>Strategic</b>High spend, critical, few alternatives</div><div><b>Routine</b>Low spend, easy to replace</div><div><b>Leverage</b>High spend, many alternatives</div></div><div class="note">Vertical: supply risk · Horizontal: financial impact</div>`; break;
      case "poll": {
        const p = opts.pollDef || findPoll(sl.poll);
        const showRes = opts.results; const { counts, total: tot } = pollCounts(sl.poll);
        return `<div class="slide">${kick}<div class="dtag"><span>Poll</span></div><h2 style="font-size:3.6cqw">${esc(p ? p.q : "Choose a poll")}</h2><div class="pollopts">${(p ? p.options : []).map((o, j) => { const pct = tot ? Math.round((counts[j] || 0) / tot * 100) : 0; return `<div>${showRes ? `<i style="width:${pct}%"></i>` : ""}<span>${esc(o)}</span>${showRes ? `<em>${pct}%</em>` : ""}</div>`; }).join("")}</div><div class="note">${showRes ? tot + " answers" : "Answer in the poll panel"}</div>${n}</div>`;
      }
    }
    return `<div class="slide${cls}">${kick}${H}${body}${note}${n}</div>`;
  }
  function deckHTML(sess, idx, opts) {
    opts = opts || {};
    const secs = sections(sess);
    const cur = secs.filter(s => s.i <= idx).pop();
    return `<div class="stage">${slideHTML(sess, idx, opts)}</div>
    <div class="deck-nav"><button class="btn sm" data-deck="${sess.id}|${idx - 1}"${idx <= 0 ? " disabled" : ""}>Previous</button><button class="btn sm" data-deck="${sess.id}|${idx + 1}"${idx >= sess.slides.length - 1 ? " disabled" : ""}>Next</button><span class="muted small">Slide ${idx + 1} of ${sess.slides.length}</span><span class="spacer"></span>
    <label class="small" for="jump-${sess.id}">Go to</label><select id="jump-${sess.id}" data-jump="${sess.id}" style="width:auto;max-width:60%">${secs.map(s => `<option value="${s.i}"${cur && cur.i === s.i ? " selected" : ""}>${esc(s.label)}</option>`).join("")}</select></div>
    <div class="thumbs">${sess.slides.map((s, k) => cur && (k >= cur.i && (secs.find(x => x.i > cur.i) || { i: 1e9 }).i > k) ? `<button data-deck="${sess.id}|${k}" class="${k === idx ? "on" : ""}" aria-label="Slide ${k + 1}">${k + 1}. ${esc(s.h || s.q || (s.k === "poll" ? "Poll" : ""))}</button>` : "").join("")}</div>`;
  }

  // ---------- navigation ----------
  function nav() {
    const items = [`<a href="#home" class="${S.route === "home" ? "on" : ""}"><span class="ico">⌂</span>Course overview</a>`];
    if (enrolled()) {
      items.push(`<div class="nav-label">Sessions</div>`);
      SESS.forEach((s, i) => items.push(`<a href="#${s.id}" class="${S.route === s.id ? "on" : ""}"><span class="tab" style="background:${COLORS[i]}">${s.num}</span>${esc(s.title)}</a>`));
      items.push(`<a href="#capstone" class="${S.route === "capstone" ? "on" : ""}"><span class="ico">★</span>Capstone</a>`);
      items.push(`<div class="nav-label">Classroom</div>`);
      items.push(`<a href="#live" class="${S.route === "live" ? "on" : ""}"><span class="ico">▶</span>Live class${S.live.on ? '<span class="livedot" aria-label="live now"></span>' : ""}</a>`);
      items.push(`<a href="#toolkit" class="${S.route === "toolkit" ? "on" : ""}"><span class="ico">⚒</span>My workbook</a>`);
      items.push(`<a href="#library" class="${S.route === "library" ? "on" : ""}"><span class="ico">⇩</span>Templates and downloads</a>`);
    }
    if (S.role === "teacher") { items.push(`<div class="nav-label">Teacher</div>`); if (S.db) items.push(`<a href="#teacher" class="${S.route === "teacher" ? "on" : ""}"><span class="ico">⚙</span>Course admin</a>`); items.push(`<a href="#admin" class="${S.route === "admin" ? "on" : ""}"><span class="ico">⚿</span>Admin panel</a>`); }
    [["#brandName", C.site.brand], ["#courseTitle", C.site.courseTitle], ["#courseSub", C.site.courseSub], ["#crumb", C.site.courseTitle]].forEach(([q, t]) => { const el = $(q); if (el && el.textContent !== t) el.textContent = t; });
    document.title = C.site.courseTitle + " · " + C.site.brand;
    const tu = $("#topUser"); if (tu) tu.innerHTML = S.me.id ? `${avatar(S.me.id)}<b class="uname">${esc(nameOf(S.me.id))}</b>` : "";
    $("#nav").innerHTML = items.join("");
    const roleLabel = { teacher: S.asStudent ? "Teacher · student view" : "Teacher", student: "Student", pending: "Waiting for access", guest: window.SERVER ? "No course access" : "Not enrolled", preview: window.STATIC ? "Student" : "Preview", loading: "" }[S.role];
    $("#who").innerHTML = `${S.me.id ? `<b>${esc(nameOf(S.me.id))}</b>` : ""}<span class="role">${esc(roleLabel)}</span>${S.role === "teacher" ? `<div style="margin-top:8px"><button class="btn sm ghost" id="asStudent">${S.asStudent ? "Back to teacher view" : "View as student"}</button></div>` : ""}${window.SERVER && S.me.id ? `<div class="row" style="margin-top:8px;gap:6px"><button class="btn sm ghost" id="srvPw">Change password</button><button class="btn sm ghost" id="srvOut">Sign out</button></div>` : ""}`;
    document.body.classList.toggle("is-teacher", isTeacher());
  }

  // ---------- views ----------
  function nextSession() {
    const ss = S.settings.sessions || {};
    return SESS.find(s => { const d = ss[s.id] && ss[s.id].date; return d && new Date(d + "T23:59") >= new Date(); }) || null;
  }
  function vHome() {
    if (!enrolled()) return vWelcome();
    const nx = nextSession(), ss = S.settings.sessions || {};
    const banner = S.role === "preview" ? (window.STATIC ? `<div class="banner">Your answers and progress are saved in this browser, on this device. Use the same browser each time, and download your workbook from "My workbook" to keep a copy.</div>` : `<div class="banner">Preview mode: your answers are kept in this browser only. Open the course from the link your teacher shared, signed in, to save your work and join live classes.</div>`) : "";
    const live = S.live.on ? `<a class="card row" href="#live" style="border-color:var(--live);text-decoration:none;color:var(--ink)"><span class="badge-live"><i></i>Live now</span><b>Session ${SESS.find(s => s.id === S.live.session).num}: ${esc(SESS.find(s => s.id === S.live.session).title)}</b><span class="spacer"></span><span class="btn live sm">Join the class</span></a>` : "";
    return `${banner}
    <div class="hero course-hero"><div class="eyebrow">${esc(C.site.courseTitle)} · ${esc(S.settings.cohort || "Indirect Procurement")} · 100% online</div><h1>${esc(C.site.heroTitle)}</h1>
    <p class="lead muted" style="max-width:62ch">${esc(C.site.heroLead)}</p></div>
    ${C.site.announcement ? `<div class="card announce"><div class="eyebrow">Announcement</div><p style="margin-top:6px;white-space:pre-line">${esc(C.site.announcement)}</p></div>` : ""}
    ${live}
    ${window.LIB && window.LIB.bookCard ? window.LIB.bookCard() : ""}
    ${nx ? `<div class="card"><div class="eyebrow">Next live class</div><div class="row" style="margin-top:6px"><h3>Session ${nx.num}: ${esc(nx.title)}</h3><span class="spacer"></span><span class="pill">${esc(ss[nx.id].date)}${ss[nx.id].time ? " · " + esc(ss[nx.id].time) : ""}</span></div><p class="muted" style="margin-top:6px">Complete the pre-work before the class (${nx.prework.minutes} min).</p><div class="row"><a class="btn primary" href="#${nx.id}">Open pre-work</a>${ss[nx.id].link ? `<a class="btn" href="${esc(ss[nx.id].link)}" target="_blank" rel="noopener">Video call link</a>` : ""}</div></div>` : ""}
    <div class="grid2">${SESS.map((s, i) => { const p = sessionProgress(s); const d = ss[s.id] || {}; return `<a class="card sess-card" href="#${s.id}" style="--c:${COLORS[i]}"><span class="num">SESSION ${s.num}${d.date ? " · " + esc(d.date) : ""}</span><h3>${esc(s.title)}</h3><span class="muted small">${esc(s.theme)}</span><span class="small"><b>You leave with:</b> ${esc(s.output)}</span><div class="bar" title="${p.done} of ${p.total} done"><i style="width:${p.total ? p.done / p.total * 100 : 0}%"></i></div><span class="muted small">${p.done} of ${p.total} activities done</span></a>`; }).join("")}</div>
    <div class="card"><h3>How the course works</h3><div class="grid4" style="margin-top:12px">
      <div><div class="eyebrow">Before</div><p>${esc(C.site.preworkLine || "Pre-work: a short reading and a quiz, 40–45 minutes.")}</p></div>
      <div><div class="eyebrow">Live</div><p>Online class with your teacher: slides, polls, Q&A and breakout rooms.</p></div>
      <div><div class="eyebrow">Practice</div><p>Every module has a practice block. Your answers are saved here and build your workbook.</p></div>
      <div><div class="eyebrow">Fieldwork</div><p>${esc(C.site.fieldworkLine || "A real conversation with your priority stakeholder between sessions.")}</p></div></div></div>`;
  }
  function vWelcome() {
    const pending = S.role === "pending";
    let action = "";
    if (S.role === "guest" && S.db && S.me.id) action = `<button class="btn primary" id="requestAccess">Request access to the course</button>`;
    else if (pending) action = `<div class="banner">Your request has been sent. Your teacher will add you to the course; this page updates by itself.</div>`;
    else action = `<div class="banner warn">Sign in and open the course from the link your teacher shared with you to request access.</div>`;
    return `<div class="hero course-hero"><div class="eyebrow">${esc(C.site.courseSub)}</div><h1>${esc(C.site.heroTitle)}</h1><p class="lead muted" style="max-width:62ch">${esc(C.site.heroLead)}</p><div class="row">${action}</div></div>
    <div class="grid2">${SESS.map((s, i) => `<div class="card sess-card" style="--c:${COLORS[i]}"><span class="num">SESSION ${s.num}</span><h3>${esc(s.title)}</h3><span class="muted small">${esc(s.question)}</span></div>`).join("")}</div>`;
  }

  function vSession(s) {
    const i = s.num - 1, c = COLORS[i];
    const tabs = [["overview", "Overview"], ["lessons", "Video lessons"], ["prework", "Pre-work"], ["modules", "Modules"], ["case", "Case"], ["fieldwork", "Fieldwork"], ["slides", "Slides"], ["templates", "Templates"]];
    if (isTeacher()) tabs.push(["notes", "Teacher notes"]);
    const t = S.tab[s.id] || "overview";
    const ss = (S.settings.sessions || {})[s.id] || {};
    let body = "";
    if (t === "overview") body = `
      <div class="grid2"><div class="card"><h3>By the end you will be able to</h3><ul>${s.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul></div>
      <div class="card"><h3>Live class plan</h3><p class="muted small">${ss.date ? esc(ss.date) + (ss.time ? " · " + esc(ss.time) : "") : "Date to be confirmed by your teacher"}</p>${tableHTML(["Time", "Block", "Format"], s.agenda)}</div></div>
      <div class="card"><div class="eyebrow">Output of this session</div><p class="lead" style="margin-top:6px">${esc(s.output)}</p></div>`;
    if (t === "lessons") body = window.PLAYER ? window.PLAYER.listHTML(s) : "";
    if (t === "prework") body = preworkHTML(s);
    if (t === "templates") body = window.LIB ? window.LIB.sessionHTML(s) : "";
    if (t === "modules") body = s.modules.map(m => `<section class="module card"><div class="mod-head"><span class="id">${esc(m.id)}</span><h3>${esc(m.title)}</h3><span class="muted small">${m.minutes} min</span></div><div>${fill(m.lesson)}</div>${m.exercise ? exerciseHTML(m.exercise) : ""}</section>`).join("");
    if (t === "case") body = `<div class="card"><h3>${esc(s.case.title)}</h3><div style="margin-top:10px">${fill(s.case.body)}</div></div>${s.case.exercise ? exerciseHTML(s.case.exercise) : ""}`;
    if (t === "fieldwork") body = `<div class="card"><h3>${esc(s.fieldwork.title)}</h3><div class="todo" style="margin-top:12px">${s.fieldwork.items.map(it => `<label><input type="checkbox" data-done="${it.id}"${S.prog.done[it.id] ? " checked" : ""}><span>${esc(it.text)}</span></label>`).join("")}</div><div style="margin-top:12px">${s.fieldwork.guide || ""}</div></div>${s.fieldwork.exercise ? exerciseHTML(s.fieldwork.exercise) : ""}`;
    if (t === "slides") { const k = S.deckIdx[s.id] || 0; body = `<div class="card">${deckHTML(s, k)}${isTeacher() && s.slides[k].note ? `<div class="notes" style="margin-top:10px">${esc(s.slides[k].note)}</div>` : ""}</div>`; }
    if (t === "notes") body = `<div class="card"><h3>Facilitator notes</h3><div style="margin-top:8px">${s.facilitator}</div><h4>Polls for this session</h4><ul>${s.polls.map(p => `<li>${esc(p.q)}</li>`).join("")}</ul></div>`;
    return `<div style="--c:${c};display:contents">
      <div class="sess-head"><div class="eyebrow">Session ${s.num} · ${esc(s.theme)}</div><h1>${esc(s.title)}</h1><p class="q-big">${esc(s.question)}</p>
      <div class="row">${ss.link ? `<a class="btn" href="${esc(ss.link)}" target="_blank" rel="noopener">Video call link</a>` : ""}<a class="btn" href="#live">Live classroom</a></div></div>
      <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-selected="${k === t}" class="${k === t ? "on" : ""}" data-stab="${s.id}|${k}">${l}</button>`).join("")}</div>
      ${body}</div>`;
  }
  function preworkHTML(s) {
    const q = (S.prog.quiz || {})[s.id];
    const reads = s.prework.items.map(it => `<div class="card"><div class="row"><h3>${esc(it.title)}</h3><span class="muted small">${it.minutes} min</span><span class="spacer"></span><label class="small"><input type="checkbox" data-done="${it.id}"${S.prog.done[it.id] ? " checked" : ""}> Done</label></div><div style="margin-top:10px">${it.body}</div></div>`).join("");
    const quiz = `<div class="card"><div class="row"><h3>Quick check</h3>${q ? `<span class="pill done">Score ${q.score} / ${s.prework.quiz.length}</span>` : ""}</div>
      <form id="quiz-${s.id}">${s.prework.quiz.map((qq, k) => { const ans = q && q.answers ? q.answers[k] : null; return `<div class="quiz-q"><b>${k + 1}. ${esc(qq.q)}</b>${qq.options.map((o, j) => `<label><input type="radio" name="q${k}" value="${j}"${ans === j ? " checked" : ""}> <span>${esc(o)}</span></label>`).join("")}${q ? `<div class="why"><b class="${ans === qq.answer ? "check-ok" : "check-no"}">${ans === qq.answer ? "Correct." : "Answer: " + esc(qq.options[qq.answer]) + "."}</b> ${esc(qq.why)}</div>` : ""}</div>`; }).join("")}
      <div class="row" style="margin-top:12px"><button class="btn primary" type="submit">${q ? "Check again" : "Check my answers"}</button></div></form></div>`;
    return `<p class="muted">About ${s.prework.minutes} minutes before the live class.</p>${reads}${quiz}`;
  }

  // ---------- live classroom ----------
  // The teacher presents from their own live-class deck (or the course deck). Students never get the deck:
  // the current slide travels in live/state without its teacher note.
  function liveDeckOf(sid, deck) {
    const s = SESS.find(x => x.id === sid) || SESS[0];
    if (deck === "course") return { sess: s, slides: s.slides, polls: s.polls };
    const d = S.liveDecks[sid] || {};
    return { sess: s, slides: d.slides || [], polls: (d.polls || []).concat(s.polls) };
  }
  function livePatch(sid, deck, idx) {
    const D0 = liveDeckOf(sid, deck), slides = D0.slides;
    idx = Math.max(0, Math.min(slides.length - 1, idx));
    const sl = slides[idx];
    const tmp = { num: D0.sess.num, title: D0.sess.title, slides };
    const sec = sl ? sectionOf(tmp, idx) : null;
    const data = sl ? JSON.parse(JSON.stringify(sl)) : null; if (data) delete data.note;
    const patch = { session: sid, deck, slide: idx, total: slides.length, slideData: data, section: sec ? { n: sec.n || "", h: sec.h } : null };
    if (sl && (sl.k || sl.kind) === "poll" && sl.poll !== S.live.poll) { const p = D0.polls.find(x => x.id === sl.poll) || findPoll(sl.poll); Object.assign(patch, { poll: sl.poll, pollDef: p ? { id: p.id, q: p.q, options: p.options } : null, pollOpen: true, showResults: false }); }
    return patch;
  }
  function vLive() {
    const L = S.live, sess = SESS.find(s => s.id === L.session) || SESS[0];
    const ss = (S.settings.sessions || {})[sess.id] || {};
    const teacher = isTeacher();
    const deck = L.deck || "live";
    const D0 = teacher ? liveDeckOf(sess.id, deck) : null;
    const idx = L.slide || 0;
    const tslide = teacher ? D0.slides[idx] || {} : null;
    const slideData = teacher ? tslide : L.slideData;
    const activePoll = L.poll ? (L.pollDef && L.pollDef.id === L.poll ? L.pollDef : findPoll(L.poll)) : null;
    const showRes = teacher || L.showResults;
    const onSlidePoll = slideData && (slideData.k || slideData.kind) === "poll" && slideData.poll === L.poll;
    const call = window.CALL ? window.CALL.state() : null;
    const head = `<div class="live-head"><div><div class="eyebrow">${esc(C.site.courseTitle)} · Live classroom</div><h1 style="margin-top:4px">Session ${sess.num}: ${esc(sess.title)}</h1></div><span class="spacer"></span>
      ${L.on ? `<span class="badge-live"><i></i>Live</span>` : `<span class="pill">Not live</span>`}
      ${call ? (call.joined ? `<button class="btn" data-call="leave">Leave the call</button>` : `<button class="btn ${L.on ? "live" : "primary"}" data-call="join">Join with camera and microphone</button>`) : ""}
      ${ss.link ? `<a class="btn ghost" href="${esc(ss.link)}" target="_blank" rel="noopener">${call ? "Backup meeting link" : "Join the video call"}</a>` : ""}</div>
      ${call && call.removed ? `<div class="banner warn">The teacher removed you from the call. You can still follow the slides, polls and questions here.</div>` : ""}`;
    let stage, controls = "";
    if (teacher) {
      const tmp = { id: sess.id, num: sess.num, title: sess.title, polls: D0.polls, slides: D0.slides };
      const secs = sections(tmp);
      controls = `<div class="card presenter"><div class="row">
        <select id="liveSess" style="width:auto" aria-label="Session">${SESS.map(s => `<option value="${s.id}"${s.id === sess.id ? " selected" : ""}>Session ${s.num}</option>`).join("")}</select>
        <select id="liveDeck" style="width:auto" aria-label="Slides to present"><option value="live"${deck === "live" ? " selected" : ""}>Live class slides (teacher)</option><option value="course"${deck === "course" ? " selected" : ""}>Course slides (seen in the videos)</option></select>
        <select id="liveJump" style="width:auto;max-width:240px" aria-label="Jump to module">${secs.map(x => `<option value="${x.i}"${(secs.filter(y => y.i <= idx).pop() || {}).i === x.i ? " selected" : ""}>${esc(x.label)}</option>`).join("")}</select>
        <span class="spacer"></span>${L.on ? `<button class="btn sm" data-live="stop">End class</button>` : `<button class="btn sm live" data-live="start">Start live class</button>`}</div>
        <div class="row" style="margin-top:10px"><button class="btn" data-live="prev"${idx <= 0 ? " disabled" : ""}>‹ Previous</button><span class="muted small">Slide ${idx + 1} of ${D0.slides.length}</span><button class="btn primary" data-live="next"${idx >= D0.slides.length - 1 ? " disabled" : ""}>Next ›</button><span class="spacer"></span><span class="muted small">Arrow keys also work. Students see the slide you are on.</span></div></div>`;
      stage = D0.slides.length ? `<div class="stage">${slideHTML(tmp, idx, { results: onSlidePoll && showRes, live: deck === "live" })}</div>${tslide.note ? `<div class="notes"><b>Teacher notes</b><br>${esc(tslide.note)}</div>` : ""}
        <div class="thumbs">${D0.slides.map((s, k) => `<button data-livego="${k}" class="${k === idx ? "on" : ""}" aria-label="Slide ${k + 1}">${k + 1}. ${esc(s.h || (s.k === "poll" ? "Poll" : s.q) || s.k)}</button>`).join("")}</div>` : `<div class="empty">This deck has no slides yet. Add them in Admin panel › Presentations.</div>`;
    } else {
      stage = L.on && slideData ? `<div class="stage">${slideHTML(sess, idx, { slide: slideData, total: L.total, section: L.section || null, live: deck === "live", pollDef: L.pollDef, results: onSlidePoll && showRes })}</div>`
        : `<div class="stage"><div class="slide statement"><div class="kicker">${esc(C.site.courseTitle)}</div><h2>${L.on ? "The class is about to start" : "No live class right now"}</h2><p class="sp">${ss.date ? `Session ${sess.num} is planned for ${esc(ss.date)}${ss.time ? " at " + esc(ss.time) : ""}.` : "Your teacher will start the class here. The slides appear on this screen."}</p></div></div>`;
    }
    const tabs = [["poll", "Poll"], ["qa", "Questions"], ["people", "Participants"]];
    let panel = "";
    if (S.liveTab === "poll") {
      if (teacher) {
        panel = `<div class="panel"><label class="small" for="pollPick">Launch a poll</label><select id="pollPick">${D0.polls.map(p => `<option value="${p.id}"${p.id === L.poll ? " selected" : ""}>${esc(p.q)}</option>`).join("")}</select>
        <div class="row"><button class="btn sm primary" data-live="poll">Open poll</button>${L.poll ? `<button class="btn sm" data-live="${L.pollOpen ? "closepoll" : "reopen"}">${L.pollOpen ? "Close voting" : "Reopen"}</button><button class="btn sm" data-live="results">${L.showResults ? "Hide results" : "Show results to class"}</button>` : ""}</div>
        ${activePoll ? pollPanel(activePoll, true) : `<div class="empty">No poll open.</div>`}</div>`;
      } else panel = activePoll ? pollPanel(activePoll, showRes) : `<div class="empty">No poll right now. When your teacher opens one, it appears here.</div>`;
    }
    if (S.liveTab === "qa") {
      const all = [];
      Object.entries(S.qa).forEach(([uid, d]) => (d.items || []).forEach(it => all.push(Object.assign({ uid }, it))));
      all.sort((a, b) => (a.answered - b.answered) || (a.at - b.at));
      panel = `<div class="panel">${S.role !== "preview" ? `<form id="askForm" class="field"><label for="askText">Ask a question</label><textarea id="askText" style="min-height:60px" maxlength="400" placeholder="Your question for the teacher"></textarea><div><button class="btn sm primary" type="submit">Send</button></div></form>` : ""}
        <div>${all.length ? all.map(q => `<div class="qa-item${q.answered ? " done" : ""}">${avatar(q.uid)}<div style="flex:1"><div class="small muted">${esc(nameOf(q.uid))}</div>${esc(q.text)}</div>${teacher && !q.answered ? `<button class="btn sm ghost" data-answered="${q.uid}|${q.id}">Answered</button>` : ""}</div>`).join("") : `<div class="empty">No questions yet.</div>`}</div></div>`;
    }
    if (S.liveTab === "people") {
      const uniq = {}; S.peers.filter(p => p.kind === "viewer").forEach(p => { const k = p.by || p.peer; uniq[k] = uniq[k] || p; });
      const inCall = {}; (call ? call.members : []).forEach(m => inCall[m.id] = m);
      Object.keys(inCall).forEach(id => { if (!uniq[id]) uniq[id] = { by: id, peer: id, isMe: id === S.me.id, presence: {} }; });
      const list = Object.values(uniq);
      const removed = call && call.removedList ? call.removedList : [];
      panel = `<div class="panel"><div class="row">${S.me.id ? `<button class="btn sm" id="handBtn">${myHand() ? "Lower hand" : "Raise hand"}</button>` : ""}${teacher && call && call.members.length > 1 ? `<button class="btn sm" data-callx="muteAll">Mute everyone</button>` : ""}<span class="spacer"></span><span class="muted small">${list.length} online</span></div>
        <div class="people">${list.map(p => { const id = p.by, m = inCall[id]; return `<div>${id ? avatar(id) : '<span class="avatar" style="background:var(--muted)">?</span>'}<span class="pname">${esc(id ? nameOf(id) : "Guest")}${p.isMe ? " (you)" : ""}</span>${p.presence && p.presence.hand || (m && m.hand) ? '<span class="pill live">Hand up</span>' : ""}${m ? `<span class="pill" title="In the call">${m.mic ? "Mic on" : "Muted"}${m.cam ? " · Cam" : ""}</span>` : ""}${teacher && m && !p.isMe ? `<span class="pact">${m.mic ? `<button class="btn sm ghost" data-callx="mute" data-id="${esc(id)}">Mute</button>` : ""}<button class="btn sm ghost" data-callx="kick" data-id="${esc(id)}">Remove</button></span>` : ""}</div>`; }).join("") || `<div class="empty">Nobody else is here yet.</div>`}</div>
        ${teacher && removed.length ? `<div class="small"><b>Removed from the call</b>${removed.map(id => `<div class="row" style="margin-top:6px">${avatar(id)}<span>${esc(nameOf(id))}</span><span class="spacer"></span><button class="btn sm" data-callx="allow" data-id="${esc(id)}">Let back in</button></div>`).join("")}</div>` : ""}</div>`;
    }
    return `${head}${controls}<div class="live-grid"><div style="display:flex;flex-direction:column;gap:10px;min-width:0">${stage}</div>
      <div class="card side"><div class="tabs">${tabs.map(([k, l]) => `<button class="${S.liveTab === k ? "on" : ""}" data-ltab="${k}">${l}</button>`).join("")}</div><div style="margin-top:12px">${panel}</div></div></div>`;
  }
  let handUp = false; const myHand = () => handUp;
  function pollPanel(p, showRes) {
    const mine = S.me.id && S.answers[S.me.id] ? S.answers[S.me.id][p.id] : undefined;
    const { counts, total } = pollCounts(p.id);
    const canVote = S.live.pollOpen && S.me.id && S.role !== "preview" && !isTeacher();
    return `<div class="panel"><b>${esc(p.q)}</b>${p.options.map((o, k) => { const pct = total ? Math.round((counts[k] || 0) / total * 100) : 0; return `<button class="poll-opt${mine === k ? " on" : ""}" data-vote="${p.id}|${k}"${canVote ? "" : " disabled"}>${showRes ? `<i style="width:${pct}%"></i>` : ""}<span>${esc(o)}</span>${showRes ? `<em>${counts[k] || 0}</em>` : ""}</button>`; }).join("")}
      <span class="muted small">${S.live.pollOpen ? "Voting open" : "Voting closed"} · ${total} answer${total === 1 ? "" : "s"}</span></div>`;
  }
  async function setLive(patch) {
    if (!S.db) { if (isTeacher()) { S.live = Object.assign({}, S.live, patch); render(); } return; } // static site: local presenter mode
    const next = Object.assign({}, S.live, patch, { updatedAt: Date.now() });
    S.live = next; render();
    try { await S.db.doc("live/state").set(next); } catch (e) { toast("Could not update the live class."); }
  }

  // ---------- workbook ----------
  function workbookText(exMap, title) {
    let out = `# ${title}\n\n`;
    SESS.forEach(s => {
      out += `## Session ${s.num}: ${s.title}\n\n`;
      EXS.filter(e => e.s.id === s.id).forEach(({ ex }) => {
        const v = (exMap[ex.id] && (exMap[ex.id].values || exMap[ex.id])) || {};
        if (!filled(v)) return;
        out += `### ${ex.title}\n\n`;
        ex.fields.forEach(f => {
          const val = v[f.key]; if (!filled(val)) return;
          out += `**${f.label}**\n\n`;
          if (Array.isArray(val)) val.filter(filled).forEach(r => out += "- " + Object.entries(r).filter(([, x]) => filled(x)).map(([k, x]) => `${k}: ${x}`).join(" · ") + "\n");
          else if (typeof val === "object") Object.entries(val).forEach(([k, x]) => { if (filled(x)) out += `- ${k}: ${typeof x === "object" ? (x.text || "") + (x.assumed ? " (assumed)" : "") : x}\n`; });
          else out += `${val}\n`;
          out += "\n";
        });
      });
    });
    return out;
  }
  function vToolkit() {
    const rows = SESS.map(s => { const p = sessionProgress(s); return [`Session ${s.num}: ${s.title}`, `${p.done} of ${p.total}`]; });
    return `<div class="hero"><div class="eyebrow">Everything you have built</div><h1>My workbook</h1><p class="lead muted">Your practice answers become your ${esc(C.site.workbookName || "Procurement Business Plan")} for the capstone.</p>
    <div class="row">${S.dl ? `<button class="btn primary" id="exportMine">Download my plan (Markdown)</button>` : `<span class="muted small">Downloading is not available in this view.</span>`}</div></div>
    <div class="card"><h3>Progress</h3>${tableHTML(["Session", "Activities done"], rows)}</div>
    <div class="card"><h3>Your tools</h3>${tableHTML(["Tool", "Where"], EXS.map(e => [e.ex.title.replace(/^Practice [\d.]+: /, ""), `Session ${e.s.num} · ${e.where}`]))}</div>`;
  }
  function vCapstone() { return `<div class="hero"><div class="eyebrow">About four weeks after Session 4</div><h1>${esc(C.capstone.title)}</h1></div><div class="card">${C.capstone.body}</div>`; }

  // ---------- teacher ----------
  function vTeacher(embedded, only) {
    if (S.role !== "teacher") return `<div class="empty">This page is for the course teacher.</div>`;
    const t = only || S.teacherTab;
    const tabs = [["students", "Students and access"], ["schedule", "Schedule and links"], ["progress", "Progress"], ["subs", "Submissions"]];
    let body = "";
    const ids = Object.keys(S.roster);
    if (t === "students" && window.SERVER && window.ACCOUNTS) body = window.ACCOUNTS.html();
    else if (t === "students") {
      const req = Object.keys(S.requests);
      body = `<div class="card"><h3>How students get access</h3><ol><li>Share this page with each student from the <b>Share</b> menu. Colleagues in your organisation need at least <b>Contributor</b>; people invited by email from outside it need <b>Editor</b> so they can save their work.</li><li>Add them to the course below, or approve their request when they open the page.</li></ol></div>
      <div class="card"><h3>Pending requests</h3>${req.length ? req.map(id => `<div class="row" style="padding:6px 0;border-bottom:1px solid var(--line)">${avatar(id)}<b>${esc(nameOf(id))}</b><span class="spacer"></span><button class="btn sm primary" data-approve="${id}">Add to course</button><button class="btn sm" data-decline="${id}">Decline</button></div>`).join("") : `<div class="empty">No pending requests.</div>`}</div>
      <div class="card"><h3>Add a student</h3><div class="field"><label for="peopleSearch">Search people who can open this page</label><input type="text" id="peopleSearch" placeholder="Type a name"></div><div id="searchResults" class="people" style="margin-top:8px"></div></div>
      <div class="card"><h3>Enrolled students (${ids.length})</h3>${ids.length ? `<div class="scroll"><table class="tbl"><thead><tr><th>Student</th><th>Added</th><th></th></tr></thead><tbody>${ids.map(id => `<tr><td><span class="row">${avatar(id)}${esc(nameOf(id))}</span></td><td class="muted small">${S.roster[id].addedAt ? new Date(S.roster[id].addedAt).toLocaleDateString() : ""}</td><td style="text-align:right"><button class="btn sm ghost" data-remove="${id}">Remove</button></td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">No students yet. Approve a request or search above to add the first one.</div>`}</div>`;
    }
    if (t === "schedule") {
      const ss = S.settings.sessions || {};
      body = `<form class="card" id="schedForm" style="display:flex;flex-direction:column;gap:14px"><div class="field"><label for="cohort">Cohort name</label><input type="text" id="cohort" value="${esc(S.settings.cohort || "")}" placeholder="e.g. Indirect Procurement · Cohort 1"></div>
      ${SESS.map(s => { const d = ss[s.id] || {}; return `<div class="grid4" style="align-items:end"><div class="field"><span class="lbl">Session ${s.num}: ${esc(s.title)}</span><input type="date" id="d-${s.id}" value="${esc(d.date || "")}" aria-label="Date of session ${s.num}"></div><div class="field"><label for="t-${s.id}">Time</label><input type="text" id="t-${s.id}" value="${esc(d.time || "")}" placeholder="09:00–13:00 CET"></div><div class="field" style="grid-column:span 2"><label for="l-${s.id}">Video call link (Teams, Zoom…)</label><input type="text" id="l-${s.id}" value="${esc(d.link || "")}" placeholder="https://…"></div></div>`; }).join("")}
      <div><button class="btn primary" type="submit">Save schedule</button></div></form>`;
    }
    if (t === "progress") {
      body = ids.length ? `<div class="card"><p class="muted small">Activities done per session (video lessons, exercises, fieldwork items and the pre-work quiz).</p><div class="scroll"><table class="tbl"><thead><tr><th>Student</th>${SESS.map(s => `<th class="num">S${s.num}</th>`).join("")}<th class="num">Quiz avg.</th><th class="num">Video lessons</th><th class="num">Lesson questions right first time</th></tr></thead><tbody>${ids.map(id => { const o = S.others[id]; if (!o) return `<tr><td>${esc(nameOf(id))}</td><td colspan="7" class="muted small">Loading…</td></tr>`; const qs = Object.values(o.prog.quiz || {}); const qa = qs.length ? (qs.reduce((a, q) => a + q.score, 0) / qs.length).toFixed(1) : "–"; return `<tr><td><span class="row">${avatar(id)}${esc(nameOf(id))}</span></td>${SESS.map(s => { const p = sessionProgress(s, o.ex, o.prog); return `<td class="num">${p.done}/${p.total}</td>`; }).join("")}<td class="num">${qa}</td>${lessonCells(o.prog)}</tr>`; }).join("")}</tbody></table></div><button class="btn sm" id="reloadOthers">Refresh</button></div>` : `<div class="empty">No students enrolled yet.</div>`;
    }
    if (t === "subs") {
      const ex = exById(S.subEx);
      body = `<div class="card row"><label for="subPick" class="small">Exercise</label><select id="subPick" style="width:auto;max-width:100%">${EXS.map(e => `<option value="${e.ex.id}"${e.ex.id === S.subEx ? " selected" : ""}>S${e.s.num} · ${esc(e.ex.title)}</option>`).join("")}</select><span class="spacer"></span><button class="btn sm" id="reloadOthers">Refresh</button>${S.dl ? `<button class="btn sm" id="exportSubs">Download all answers (CSV)</button>` : ""}</div>
      ${ids.length ? ids.map(id => { const o = S.others[id]; const v = o && o.ex[S.subEx] ? (o.ex[S.subEx].values || {}) : null; return `<div class="card"><div class="row">${avatar(id)}<b>${esc(nameOf(id))}</b>${v && filled(v) ? `<span class="pill done">Submitted</span>` : `<span class="pill">Not started</span>`}</div>${v && filled(v) ? `<div style="margin-top:10px">${exerciseHTML(ex, { values: v, readonly: true })}</div>` : ""}</div>`; }).join("") : `<div class="empty">No students enrolled yet.</div>`}`;
    }
    const tabBar = `<div class="tabs">${tabs.map(([k, l]) => `<button class="${t === k ? "on" : ""}" data-ttab="${k}">${l}</button>`).join("")}</div>`;
    return only ? body : embedded ? tabBar + body : `<div class="hero"><div class="eyebrow">Teacher</div><h1>Course admin</h1></div>${tabBar}${body}`;
  }
  function lessonCells(prog) {
    const all = [].concat(...Object.values(window.LESSONS || {})); const rec = (prog && prog.lessons) || {};
    let done = 0, ok = 0, n = 0;
    all.forEach(L => { const r = rec[L.id]; if (!r) return; if (r.done) done++; Object.values(r.first || {}).forEach(v => { n++; if (v) ok++; }); });
    return `<td class="num">${done}/${all.length}</td><td class="num">${n ? Math.round(ok / n * 100) + "%" : "–"}</td>`;
  }
  async function loadOthers() {
    if (!S.db) return;
    const ids = Object.keys(S.roster);
    await Promise.all(ids.map(async id => {
      try {
        const [p, exs] = await Promise.all([S.db.doc(`subs/${id}`).get(), S.db.collection(`subs/${id}/ex`).get()]);
        const ex = {}; exs.docs.forEach(d => ex[d.id] = d.data());
        S.others[id] = { prog: p.exists ? p.data() : { done: {}, quiz: {} }, ex };
      } catch (e) { S.others[id] = { prog: { done: {}, quiz: {} }, ex: {} }; }
    }));
    render();
  }

  // ---------- render ----------
  function render() {
    nav();
    const r = S.route;
    let html;
    if (S.role === "loading") html = `<div class="empty">Loading the course…</div>`;
    else if (!enrolled() && r !== "home" && r !== "admin") html = vWelcome();
    else if (r === "home") html = vHome();
    else if (/^s[1-4]$/.test(r)) html = vSession(SESS.find(s => s.id === r));
    else if (r === "live") html = vLive();
    else if (r === "toolkit") html = vToolkit();
    else if (r === "capstone") html = vCapstone();
    else if (r === "teacher") html = vTeacher();
    else if (r === "library") html = window.LIB ? window.LIB.libraryHTML() : "";
    else if (r === "admin") html = window.ADMIN ? window.ADMIN.html() : "";
    else html = vHome();
    // keep focus and caret while live updates re-render
    const a = document.activeElement, aid = a && a.id, sel = a && "selectionStart" in a ? [a.selectionStart, a.selectionEnd] : null;
    view.innerHTML = html;
    if (aid) { const el = document.getElementById(aid); if (el && el !== document.body) { el.focus({ preventScroll: true }); if (sel && el.setSelectionRange) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) {} } }
  }
  function softRender() {
    // re-render only when the user is not typing in a form field
    const a = document.activeElement;
    if (a && ((/INPUT|TEXTAREA|SELECT/.test(a.tagName) && (a.dataset.ex || a.closest(".adm, .srv-acc"))) || a.isContentEditable)) { nav(); return; }
    render();
  }
  function route() {
    const h = (location.hash || "#home").slice(1);
    S.route = ["home", "s1", "s2", "s3", "s4", "live", "toolkit", "capstone", "teacher", "library", "admin"].includes(h) ? h : "home";
    $("#rail").classList.remove("open");
    render(); window.scrollTo(0, 0);
    if (S.route === "teacher" && S.role === "teacher" && (S.teacherTab === "progress" || S.teacherTab === "subs")) loadOthers();
  }

  // ---------- events ----------
  view.addEventListener("input", e => {
    const el = e.target;
    if (el.dataset.ex && el.type !== "checkbox" && el.tagName !== "SELECT") setPath(el.dataset.ex, el);
  });
  view.addEventListener("change", async e => {
    const el = e.target;
    if (el.dataset.ex && (el.type === "checkbox" || el.tagName === "SELECT")) setPath(el.dataset.ex, el);
    if (el.dataset.done) { S.prog.done[el.dataset.done] = el.checked; saveProg(); nav(); }
    if (el.id === "liveSess") setLive(Object.assign({ poll: null, pollDef: null, pollOpen: false, showResults: false }, livePatch(el.value, S.live.deck || "live", 0)));
    if (el.id === "liveDeck") setLive(livePatch(S.live.session, el.value, 0));
    if (el.id === "subPick") { S.subEx = el.value; render(); }
    if (el.dataset.jump) { S.deckIdx[el.dataset.jump] = +el.value; render(); }
    if (el.id === "liveJump") setLive(livePatch(S.live.session, S.live.deck || "live", +el.value));
  });
  view.addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target;
    if (f.id && f.id.startsWith("quiz-")) {
      const sid = f.id.slice(5), s = SESS.find(x => x.id === sid);
      const answers = s.prework.quiz.map((q, k) => { const r = f.querySelector(`input[name="q${k}"]:checked`); return r ? +r.value : null; });
      if (answers.some(a => a == null)) { toast("Answer every question first."); return; }
      const score = answers.filter((a, k) => a === s.prework.quiz[k].answer).length;
      S.prog.quiz[sid] = { answers, score, at: Date.now() }; saveProg(); render(); toast(`Score: ${score} of ${answers.length}`);
    }
    if (f.id === "askForm") {
      const t = $("#askText").value.trim(); if (!t || !S.db || !S.me.id) return;
      const mine = (S.qa[S.me.id] && S.qa[S.me.id].items) || [];
      const items = mine.concat([{ id: Math.random().toString(36).slice(2, 9), text: t.slice(0, 400), at: Date.now(), answered: false }]).slice(-30);
      try { await S.db.doc(`qa/${S.me.id}`).set({ items }); $("#askText").value = ""; toast("Question sent"); } catch (err) { toast("Could not send. You may not have write access."); }
    }
    if (f.id === "schedForm") {
      const sessions = {}; SESS.forEach(s => sessions[s.id] = { date: $("#d-" + s.id).value, time: $("#t-" + s.id).value.trim(), link: $("#l-" + s.id).value.trim() });
      const bad = SESS.find(s => sessions[s.id].link && !/^https:\/\//i.test(sessions[s.id].link));
      if (bad) { toast(`Session ${bad.num}: the link must start with https://`); return; }
      const settings = { cohort: $("#cohort").value.trim(), sessions };
      if (!S.db) { if (window.ADMIN) window.ADMIN.saveLocal("settings", { data: settings, at: Date.now() }); return; }
      try { await S.db.doc("course/settings").set(settings); toast("Schedule saved"); } catch (err) { toast("Could not save the schedule."); }
    }
  });
  view.addEventListener("click", async e => {
    const b = e.target.closest("button,[data-stab]"); if (!b || b.closest(".adm-edstage")) return;
    const d = b.dataset;
    if (d.stab) { const [sid, k] = d.stab.split("|"); S.tab[sid] = k; render(); return; }
    if (d.deck) { const [sid, k] = d.deck.split("|"); const s = SESS.find(x => x.id === sid); S.deckIdx[sid] = Math.max(0, Math.min(s.slides.length - 1, +k)); render(); return; }
    if (d.addrow) { const [exId, key, n] = d.addrow.split("|"); const cur = Object.assign({}, exVals(exId)); const rows = Array.isArray(cur[key]) ? cur[key].slice() : []; while (rows.length < +n + 1) rows.push({}); cur[key] = rows; S.ex[exId] = { values: cur }; render(); return; }
    if (d.ltab) { S.liveTab = d.ltab; render(); return; }
    if (d.livego) { setLive(livePatch(S.live.session, S.live.deck || "live", +d.livego)); return; }
    if (d.ttab) { S.teacherTab = d.ttab; render(); if (d.ttab === "progress" || d.ttab === "subs") loadOthers(); return; }
    if (d.live) {
      const L = S.live;
      if (d.live === "next" || d.live === "prev") setLive(livePatch(L.session, L.deck || "live", (L.slide || 0) + (d.live === "next" ? 1 : -1)));
      if (d.live === "start") setLive(Object.assign({ on: true }, livePatch(L.session, L.deck || "live", L.slide || 0)));
      if (d.live === "stop") setLive({ on: false, pollOpen: false });
      if (d.live === "poll") { const id = $("#pollPick").value, p = liveDeckOf(L.session, L.deck || "live").polls.find(x => x.id === id) || findPoll(id); if (p) setLive({ poll: p.id, pollDef: { id: p.id, q: p.q, options: p.options }, pollOpen: true, showResults: false }); }
      if (d.live === "closepoll") setLive({ pollOpen: false });
      if (d.live === "reopen") setLive({ pollOpen: true });
      if (d.live === "results") setLive({ showResults: !L.showResults });
      return;
    }
    if (d.vote) {
      const [pid, k] = d.vote.split("|"); if (!S.db || !S.me.id) return;
      const mine = Object.assign({}, S.answers[S.me.id] || {}, { [pid]: +k });
      S.answers[S.me.id] = mine; render();
      try { await S.db.doc(`answers/${S.me.id}`).set(mine); } catch (err) { toast("Your vote was not saved."); }
      return;
    }
    if (d.answered) { const [uid, qid] = d.answered.split("|"); const items = ((S.qa[uid] && S.qa[uid].items) || []).map(q => q.id === qid ? Object.assign({}, q, { answered: true }) : q); try { await S.db.doc(`qa/${uid}`).set({ items }); } catch (err) { toast("Could not update."); } return; }
    if (d.approve) { try { await S.db.doc(`roster/${d.approve}`).set({ addedAt: Date.now() }); await S.db.doc(`requests/${d.approve}`).delete(); toast(nameOf(d.approve) + " added"); } catch (err) { toast("Could not add the student."); } return; }
    if (d.decline) { try { await S.db.doc(`requests/${d.decline}`).delete(); } catch (err) {} return; }
    if (d.remove) { if (b.dataset.confirm !== "1") { b.dataset.confirm = "1"; b.textContent = "Click again to remove"; return; } try { await S.db.doc(`roster/${d.remove}`).delete(); toast("Student removed"); } catch (err) { toast("Could not remove."); } return; }
    if (d.add) { try { await S.db.doc(`roster/${d.add}`).set({ addedAt: Date.now() }); toast(nameOf(d.add) + " added"); $("#peopleSearch").value = ""; $("#searchResults").innerHTML = ""; } catch (err) { toast("Could not add."); } return; }
    if (b.id === "requestAccess") { try { await S.db.doc(`requests/${S.me.id}`).set({ at: Date.now() }); S.role = "pending"; render(); } catch (err) { toast("Could not send the request. Ask your teacher to give you Contributor access first."); } return; }
    if (b.id === "handBtn") { handUp = !handUp; try { S.room && await S.room.presence({ hand: handUp }); } catch (err) {} render(); return; }
    if (b.id === "reloadOthers") { loadOthers(); return; }
    if (b.id === "exportMine") { try { await S.dl.save({ filename: "my-" + (C.site.workbookName || "Procurement Business Plan").toLowerCase().replace(/[^a-z]+/g, "-") + ".md", data: workbookText(S.ex, "My " + (C.site.workbookName || "Procurement Business Plan")) }); } catch (err) { if (err && err.code !== "declined") toast("Download not available."); } return; }
    if (b.id === "exportSubs") {
      const ex = exById(S.subEx); const q = v => `"${String(v == null ? "" : typeof v === "object" ? JSON.stringify(v) : v).replace(/"/g, '""')}"`;
      let csv = ["Student", ...ex.fields.map(f => f.label)].map(q).join(",") + "\n";
      Object.keys(S.roster).forEach(id => { const o = S.others[id]; const v = o && o.ex[S.subEx] ? o.ex[S.subEx].values || {} : {}; csv += [nameOf(id), ...ex.fields.map(f => v[f.key])].map(q).join(",") + "\n"; });
      try { await S.dl.save({ filename: `${S.subEx}-answers.csv`, data: csv }); } catch (err) { if (err && err.code !== "declined") toast("Download not available."); }
      return;
    }
  });
  let searchT;
  view.addEventListener("input", e => {
    if (e.target.id !== "peopleSearch" || !S.user || !S.user.search) return;
    clearTimeout(searchT);
    searchT = setTimeout(async () => {
      let hits = [];
      try { hits = await S.user.search(e.target.value.trim()); } catch (err) {}
      hits.forEach(h => S.names[h.id] = h.name || "Participant");
      const box = $("#searchResults"); if (!box) return;
      box.innerHTML = hits.filter(h => !h.isMe).slice(0, 8).map(h => `<div>${avatar(h.id)}<span>${esc(h.name || "Participant")}${h.guest ? ' <span class="pill">guest</span>' : ""}</span><span class="spacer"></span>${S.roster[h.id] ? '<span class="pill done">Enrolled</span>' : `<button class="btn sm" data-add="${h.id}">Add</button>`}</div>`).join("") || `<div class="muted small">Nobody found. People appear here once the page is shared with them.</div>`;
    }, 250);
  });
  document.addEventListener("click", e => {
    if (e.target.id === "menuBtn") $("#rail").classList.toggle("open");
    if (e.target.id === "asStudent") { S.asStudent = !S.asStudent; render(); }
  });
  document.addEventListener("keydown", e => {
    if (S.route !== "live" || !isTeacher() || /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || "")) return;
    if (e.key === "ArrowRight") $('[data-live="next"]') && $('[data-live="next"]').click();
    if (e.key === "ArrowLeft") $('[data-live="prev"]') && $('[data-live="prev"]').click();
  });
  window.addEventListener("hashchange", route);

  // ---------- boot ----------
  function bootPreview() {
    S.role = "preview";
    SESS.forEach(s => EXS.filter(e => e.s.id === s.id).forEach(({ ex }) => { const v = LS.get("ex:" + ex.id, null); if (v) S.ex[ex.id] = { values: v }; }));
    S.prog = LS.get("prog", { done: {}, quiz: {} }); S.prog.done = S.prog.done || {}; S.prog.quiz = S.prog.quiz || {}; S.prog.lessons = S.prog.lessons || {};
    route();
  }
  route();
  async function boot() {
    if (!window.claude || !window.claude.use) { bootPreview(); return; }
    const [db, user, room, dl] = await Promise.all(["db", "user", "room", "downloads"].map(n => window.claude.use(n).catch(() => null)));
    S.db = db; S.user = user; S.room = room; S.dl = dl;
    if (!db || !user) { bootPreview(); return; }
    let id = null, owner = false;
    try { id = await user.id(); owner = !!(await user.isOwner()); } catch (e) {}
    S.me = { id, isOwner: owner };
    if (!id) { bootPreview(); return; }
    await resolveNames([id]);
    // shared settings and live state
    db.doc("course/settings").onSnapshot(s => { S.settings = s.exists ? Object.assign({ sessions: {} }, s.data()) : { cohort: "", sessions: {} }; softRender(); }, () => {});
    db.doc("live/state").onSnapshot(s => {
      const prev = S.live.slide;
      S.live = s.exists ? Object.assign({ on: false, session: "s1", slide: 0 }, s.data()) : S.live;
      if (S.route === "live" || prev !== S.live.slide) softRender(); else nav();
    }, () => {});
    db.collection("cms").onSnapshot(q => { const docs = {}; q.docs.forEach(d => docs[d.id] = d.data()); S.cms = docs; if (window.ADMIN) window.ADMIN.apply(docs); }, () => {});
    db.collection("answers").onSnapshot(q => { S.answers = {}; q.docs.forEach(d => S.answers[d.id] = d.data()); if (S.route === "live") softRender(); }, () => {});
    db.collection("qa").onSnapshot(async q => { S.qa = {}; q.docs.forEach(d => S.qa[d.id] = d.data()); await resolveNames(Object.keys(S.qa)); if (S.route === "live") softRender(); }, () => {});
    // my own work
    try {
      const [p, exs] = await Promise.all([db.doc(`subs/${id}`).get(), db.collection(`subs/${id}/ex`).get()]);
      if (p.exists) { const v = p.data(); S.prog = { done: v.done || {}, quiz: v.quiz || {}, lessons: v.lessons || {} }; }
      exs.docs.forEach(d => S.ex[d.id] = d.data());
    } catch (e) {}
    if (owner) {
      S.role = "teacher";
      SESS.forEach(s => db.doc("teacher/deck-" + s.id).onSnapshot(d => { S.liveDecks[s.id] = d.exists ? d.data() : { slides: [], polls: [] }; if (S.route === "live" || S.route === "admin") softRender(); }, () => {}));
      db.collection("roster").onSnapshot(async q => { S.roster = {}; q.docs.forEach(d => S.roster[d.id] = d.data()); await resolveNames(Object.keys(S.roster)); softRender(); }, () => {});
      db.collection("requests").onSnapshot(async q => { S.requests = {}; q.docs.forEach(d => S.requests[d.id] = d.data()); await resolveNames(Object.keys(S.requests)); softRender(); }, () => {});
      route();
    } else {
      db.doc(`roster/${id}`).onSnapshot(async s => {
        if (s.exists) S.role = "student";
        else { let pending = false; try { pending = (await db.doc(`requests/${id}`).get()).exists; } catch (e) {} S.role = pending ? "pending" : "guest"; }
        render();
      }, () => { S.role = "guest"; render(); });
    }
    if (room) {
      try {
        room.onPeers(async ch => { S.peers = ch.peers.slice(); await resolveNames(S.peers.map(p => p.by).filter(Boolean)); if (S.route === "live") softRender(); });
        room.presence({ hand: false });
      } catch (e) {}
    }
  }
  window.SA = { S, SESS, C, D, esc, slideHTML, saveProg, toast, render: () => render(), softRender: () => softRender(), isTeacher: () => isTeacher(),
    teacherHTML: only => vTeacher(true, only), livePatch, liveDeckOf, findPoll, setLive: p => setLive(p), loadOthers: () => loadOthers(), refreshExercises: () => { EXS = allExercises(); } };
  // shrink dense slides so nothing spills off the 16:9 stage
  function fitSlides() {
    document.querySelectorAll(".stage .slide").forEach(el => {
      const kids = Array.from(el.children).filter(c => !c.classList.contains("pageno"));
      kids.forEach(c => c.style.zoom = "");
      const limit = () => el.getBoundingClientRect().bottom - parseFloat(getComputedStyle(el).paddingBottom) * 0.6;
      const over = () => el.scrollHeight > el.clientHeight + 1 || kids.some(c => c.getBoundingClientRect().bottom > limit() + 1);
      let z = 1;
      while (over() && z > 0.5) { z -= 0.05; kids.forEach(c => c.style.zoom = z.toFixed(2)); }
    });
  }
  let fitQueued = false;
  new MutationObserver(() => { if (fitQueued) return; fitQueued = true; requestAnimationFrame(() => { fitQueued = false; fitSlides(); }); }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("resize", () => requestAnimationFrame(fitSlides));
  boot();
})();
