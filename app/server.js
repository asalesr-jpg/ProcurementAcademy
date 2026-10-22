// Server version: connects the course to api.php (accounts, progress, live class and course edits kept on the server as files).
// It provides the same db / user / room / downloads functions the page uses, behind a sign-in screen.
(function () {
  "use strict";
  window.SERVER = true;
  const API = (window.API_BASE || "") + "api.php";
  // every course after the first keeps its data under c/<course>/ so courses never mix
  const NS = window.COURSE_NS ? "c/" + window.COURSE_NS + "/" : "";
  const P = path => NS + path;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  async function call(op, body) {
    let r;
    try {
      r = await fetch(API, { method: "POST", credentials: "same-origin", cache: "no-store",
        headers: { "Content-Type": "application/json", "X-Requested-With": "stakeholder-academy" }, body: JSON.stringify(Object.assign({ op }, body || {})) });
    } catch (e) { const err = new Error("The server cannot be reached."); err.code = "network"; throw err; }
    let j = null; try { j = await r.json(); } catch (e) {}
    if (!r.ok || !j || j.error) {
      const err = new Error((j && j.error && j.error.message) || ("Server error " + r.status)); err.code = (j && j.error && j.error.code) || "server";
      if (err.code === "unauthenticated") signedOut();
      throw err;
    }
    return j;
  }

  // ---------- sign-in ----------
  let ME = null, resolveReady;
  const ready = new Promise(r => resolveReady = r);
  const css = `.srv-ov{position:fixed;inset:0;z-index:100;background:var(--bg);display:grid;place-items:center;padding:16px;overflow:auto}
  .srv-box{width:100%;max-width:400px;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:26px;display:flex;flex-direction:column;gap:14px}
  .srv-box h1{font:700 22px/1.2 var(--f-display);margin:0}.srv-box .msg{color:var(--live);font-size:14px;min-height:1em;margin:0}
  .srv-brand{display:flex;align-items:center;gap:10px}.srv-brand .mark{width:34px;height:34px;border-radius:8px;background:var(--accent);color:var(--accent-ink);display:grid;place-items:center;font:750 16px var(--f-display)}
  .srv-cred{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;background:var(--sunk);border-radius:8px;padding:10px 12px;white-space:pre-wrap;word-break:break-all;margin:0}
  .srv-acc textarea{min-height:110px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px}
  .srv-acc .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}@media(max-width:700px){.srv-acc .grid3{grid-template-columns:1fr}}
  .srv-acc td .btn{margin-left:4px}.srv-brand .srv-x{margin-left:auto}.srv-reg{max-width:520px}.srv-reg .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:560px){.srv-reg .grid2{grid-template-columns:1fr}}
  .srv-courses{border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin:0;display:flex;flex-direction:column;gap:8px}.srv-courses legend{font-weight:600;font-size:14px;padding:0 4px}.srv-courses label{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
  .srv-ov.pub{background:rgba(9,15,24,.62);backdrop-filter:blur(3px)}.srv-ov.pub .srv-box{box-shadow:0 20px 60px rgba(0,0,0,.35)}
  .srv-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function overlay(inner) {
    let ov = document.getElementById("srvOv");
    if (!ov) { ov = document.createElement("div"); ov.id = "srvOv"; ov.className = "srv-ov" + (window.PUBLIC_HOME && !ME ? " pub" : ""); document.body.appendChild(ov); }
    ov.innerHTML = inner; return ov;
  }
  const closeOverlay = () => { const ov = document.getElementById("srvOv"); if (ov) ov.remove(); };
  const brand = () => { const b = document.querySelector(".brand b"); return (b && b.textContent) || "Stakeholder Academy"; };

  const HOME = window.PUBLIC_HOME ? "" : (window.API_BASE || "");
  const closeBtn = () => window.PUBLIC_HOME ? `<button class="btn sm ghost srv-x" type="button" data-srv="close" aria-label="Close">✕</button>` : "";
  function loginScreen(msg) {
    const ov = overlay(`<form class="srv-box" id="srvLogin" autocomplete="on"><div class="srv-brand"><span class="mark">PA</span><b>${esc(brand())}</b>${closeBtn()}</div>
      <h1>Sign in</h1>
      <div class="field"><label for="srvUser">E-mail or username</label><input type="text" id="srvUser" autocomplete="username" autocapitalize="off" spellcheck="false" required></div>
      <div class="field"><label for="srvPass">Password</label><input type="password" id="srvPass" autocomplete="current-password" required></div>
      <p class="msg" id="srvMsg" role="alert">${esc(msg || "")}</p>
      <button class="btn primary" type="submit">Sign in</button>
      <p class="muted small" style="margin:0">New here? ${window.PUBLIC_HOME ? `<a href="#register" data-srv="register">Create an account</a>` : `<a href="${esc(HOME)}#register">Create an account</a>`}. Lost your password? Ask your Academy admin for a new one.</p>
      ${window.PUBLIC_HOME ? "" : `<p class="muted small" style="margin:0"><a href="${esc(HOME) || "./"}">← Back to the Academy home page</a></p>`}</form>`);
    const u = ov.querySelector("#srvUser"); try { u.value = localStorage.getItem("sa:lastUser") || ""; } catch (e) {}
    (u.value ? ov.querySelector("#srvPass") : u).focus();
  }
  function registerScreen(pick) {
    const courses = ((window.ACADEMY && window.ACADEMY.courses) || []).filter(c => c.status === "open" && c.path);
    const ov = overlay(`<form class="srv-box srv-reg" id="srvReg" autocomplete="on"><div class="srv-brand"><span class="mark">PA</span><b>${esc(brand())}</b>${closeBtn()}</div>
      <h1>Create your account</h1><p class="muted small" style="margin:-6px 0 0">Two minutes, and you are in. You can start the video lessons straight away.</p>
      <div class="field"><label for="regName">Full name</label><input type="text" id="regName" autocomplete="name" maxlength="80" required></div>
      <div class="field"><label for="regEmail">Work e-mail</label><input type="email" id="regEmail" autocomplete="email" maxlength="64" required><span class="muted small">You sign in with it.</span></div>
      <div class="field"><label for="regPass">Password (at least 8 characters)</label><input type="password" id="regPass" autocomplete="new-password" minlength="8" required></div>
      <div class="grid2"><div class="field"><label for="regTeam">Company or team <span class="muted">(optional)</span></label><input type="text" id="regTeam" autocomplete="organization" maxlength="80"></div>
      <div class="field"><label for="regCountry">Country <span class="muted">(optional)</span></label><input type="text" id="regCountry" autocomplete="country-name" maxlength="60"></div></div>
      ${courses.length ? `<fieldset class="srv-courses"><legend>Courses</legend>${courses.map(c => `<label><input type="checkbox" data-regcourse="${esc(c.ns || "")}"${!pick || pick === c.id ? " checked" : ""}> <b>${esc(c.title)}</b> <span class="muted small">${esc(c.subtitle || "")}</span></label>`).join("")}</fieldset>` : ""}
      <div class="srv-hp" aria-hidden="true"><label for="regWeb">Website</label><input type="text" id="regWeb" tabindex="-1" autocomplete="off"></div>
      <label class="row small" style="flex-wrap:nowrap;align-items:flex-start;gap:8px"><input type="checkbox" id="regOk" required style="margin-top:3px"> <span>I agree that my name, e-mail and course progress are stored on this website so I can take the courses. Nothing is shared outside the Academy.</span></label>
      <p class="msg" id="regMsg" role="alert"></p>
      <button class="btn primary" type="submit">Create my account</button>
      <p class="muted small" style="margin:0">Already registered? ${window.PUBLIC_HOME ? `<a href="#signin" data-srv="login">Sign in</a>` : `<a href="${esc(HOME) || "./"}">Sign in</a>`}</p></form>`);
    ov.querySelector("#regName").focus();
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-srv]"); if (!b) return;
    e.preventDefault();
    if (b.dataset.srv === "close") { closeOverlay(); if (/^#(signin|register)/.test(location.hash)) history.replaceState(null, "", location.pathname); }
    if (b.dataset.srv === "login") loginScreen();
    if (b.dataset.srv === "register") registerScreen(b.dataset.course);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && window.PUBLIC_HOME && !ME && document.getElementById("srvOv")) closeOverlay(); });
  document.addEventListener("submit", async e => {
    if (e.target.id !== "srvReg") return;
    e.preventDefault();
    const f = e.target, btn = f.querySelector("button[type=submit]"), msg = f.querySelector("#regMsg"), v = id => f.querySelector("#" + id).value;
    const body = { name: v("regName").trim(), email: v("regEmail").trim(), password: v("regPass"), team: v("regTeam").trim(), country: v("regCountry").trim(), website: v("regWeb"), consent: f.querySelector("#regOk").checked,
      courses: [...f.querySelectorAll("[data-regcourse]")].filter(x => x.checked).map(x => x.dataset.regcourse) };
    if (f.querySelector("[data-regcourse]") && !body.courses.length) { msg.textContent = "Choose at least one course."; return; }
    btn.disabled = true; msg.textContent = "";
    try { const j = await call("register", body); try { localStorage.setItem("sa:lastUser", body.email.toLowerCase()); } catch (err) {} history.replaceState(null, "", location.pathname); signedIn(j.me); if (window.SA && window.SA.toast) window.SA.toast("Welcome, " + j.me.name.split(" ")[0] + ". Your account is ready."); }
    catch (err) { msg.textContent = err.message; }
    btn.disabled = false;
  });
  document.addEventListener("submit", async e => {
    if (e.target.id === "srvLogin") {
      e.preventDefault();
      const f = e.target, btn = f.querySelector("button[type=submit]"), msg = f.querySelector("#srvMsg");
      const username = f.querySelector("#srvUser").value.trim(), password = f.querySelector("#srvPass").value;
      btn.disabled = true; msg.textContent = "";
      try {
        const j = await call("login", { username, password });
        try { localStorage.setItem("sa:lastUser", username); } catch (err) {}
        signedIn(j.me);
      } catch (err) { msg.textContent = err.message; f.querySelector("#srvPass").select(); }
      btn.disabled = false;
    }
    if (e.target.id === "srvPwForm") {
      e.preventDefault();
      const f = e.target, msg = f.querySelector(".msg");
      const old = f.querySelector("#srvPwOld").value, n = f.querySelector("#srvPwNew").value, n2 = f.querySelector("#srvPwNew2").value;
      if (n.length < 8) { msg.textContent = "Use at least 8 characters."; return; }
      if (n !== n2) { msg.textContent = "The new passwords do not match."; return; }
      try { await call("changePassword", { old, new: n }); if (f.closest(".srv-ov")) closeOverlay(); else f.reset(); toast("Password changed."); msg.textContent = ""; }
      catch (err) { msg.textContent = err.message; }
    }
  });
  function signedIn(me) {
    const first = !ME; ME = me; closeOverlay();
    if (first && window.PUBLIC_HOME_END) window.PUBLIC_HOME_END();
    if (first) resolveReady(); else location.reload();
  }
  let outShown = false;
  function signedOut() { if (outShown) return; outShown = true; stopPolling(); loginScreen("Your session has ended. Please sign in again."); document.addEventListener("submit", () => { outShown = false; }, { once: true }); }
  function toast(t) { if (window.SA) window.SA.toast(t); }
  function pwDialog() {
    overlay(`<form class="srv-box" id="srvPwForm"><h1>Change your password</h1>
      <div class="field"><label for="srvPwOld">Current password</label><input type="password" id="srvPwOld" autocomplete="current-password" required></div>
      <div class="field"><label for="srvPwNew">New password (at least 8 characters)</label><input type="password" id="srvPwNew" autocomplete="new-password" required></div>
      <div class="field"><label for="srvPwNew2">Repeat the new password</label><input type="password" id="srvPwNew2" autocomplete="new-password" required></div>
      <p class="msg" role="alert"></p><div class="row"><button class="btn primary" type="submit">Change password</button><button class="btn" type="button" id="srvPwCancel">Cancel</button></div></form>`);
    document.getElementById("srvPwOld").focus();
  }
  document.addEventListener("click", async e => {
    const b = e.target.closest("#srvOut,#srvPw,#srvPwCancel"); if (!b) return;
    if (b.id === "srvPwCancel") { closeOverlay(); return; }
    if (b.id === "srvPw") { pwDialog(); return; }
    if (b.id === "srvOut") { try { await call("logout"); } catch (err) {} location.hash = ""; location.reload(); }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && document.getElementById("srvPwForm")) closeOverlay(); });

  call("me").then(j => {
    if (j.me) return signedIn(j.me);
    if (window.PUBLIC_HOME) { window.PUBLIC_HOME(); if (location.hash === "#register") registerScreen(); else if (location.hash === "#signin") loginScreen(); }
    else loginScreen();
  })
    .catch(err => loginScreen(err.code === "network" ? "The server cannot be reached. Check your connection and reload the page." : "This website needs PHP on the server (" + err.message + ")."));

  // ---------- live data: polling with change hashes ----------
  const subs = new Map(); // key -> { kind, path, h, v, fns:Set, has }
  let pres = null, presDirty = false, timer = null, inflight = false, again = false, stopped = false;
  let peerFns = [], lastPeers = [];
  const keyOf = (kind, path) => kind + ":" + path;
  function snapDoc(path, v) { const id = path.split("/").pop(); return { id, ref: path, exists: v != null, data: () => v == null ? undefined : JSON.parse(JSON.stringify(v)), metadata: {} }; }
  function snapColl(list) {
    const docs = (list || []).map(d => ({ id: d.id, exists: true, data: () => JSON.parse(JSON.stringify(d.data)), metadata: {} }));
    return { docs, size: docs.length, empty: !docs.length, docChanges: () => [], forEach: fn => docs.forEach(fn) };
  }
  const deliver = s => s.fns.forEach(f => { try { f.next(s.kind === "doc" ? snapDoc(s.path, s.v) : snapColl(s.v)); } catch (e) { console.error(e); } });
  const interval = () => document.hidden ? 15000 : (location.hash === "#live" ? 2000 : 5000);
  function schedule(ms) { if (stopped) return; clearTimeout(timer); timer = setTimeout(poll, ms == null ? interval() : ms); }
  function stopPolling() { stopped = true; clearTimeout(timer); }
  async function poll() {
    if (stopped) return;
    if (inflight) { again = true; return; }
    inflight = true;
    const items = [...subs.entries()].map(([k, s]) => ({ k, kind: s.kind, path: P(s.path), h: s.h || "" }));
    const body = { items }; if (presDirty) { body.presence = pres || {}; presDirty = false; }
    try {
      const j = await call("watch", body);
      Object.entries(j.changes || {}).forEach(([k, c]) => {
        const s = subs.get(k); if (!s) return;
        if (c.error) { s.fns.forEach(f => f.error && f.error({ code: c.error })); return; }
        s.h = c.h; s.v = c.v; s.has = true; deliver(s);
      });
      lastPeers = j.peers || []; peerFns.forEach(fn => { try { fn({ peers: lastPeers.slice() }); } catch (e) {} });
    } catch (e) { if (body.presence) presDirty = true; }
    inflight = false;
    if (again) { again = false; schedule(50); } else schedule();
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) schedule(50); });
  window.addEventListener("hashchange", () => schedule(200));
  const kick = () => schedule(80);

  function subscribe(kind, path, next, error) {
    const k = keyOf(kind, path); let s = subs.get(k);
    if (!s) { s = { kind, path, h: "", v: null, fns: new Set(), has: false }; subs.set(k, s); }
    const f = { next, error }; s.fns.add(f);
    if (s.has) setTimeout(() => next(kind === "doc" ? snapDoc(path, s.v) : snapColl(s.v)), 0); else kick();
    return () => { s.fns.delete(f); if (!s.fns.size) subs.delete(k); };
  }
  function doc(path) {
    return {
      id: path.split("/").pop(), path,
      get: async () => snapDoc(path, (await call("get", { path: P(path) })).data),
      set: async data => { await call("set", { path: P(path), data }); kick(); },
      update: async data => { await call("update", { path: P(path), data }); kick(); },
      delete: async () => { await call("delete", { path: P(path) }); kick(); },
      onSnapshot: (next, error) => subscribe("doc", path, next, error),
      collection: c => coll(path + "/" + c)
    };
  }
  function coll(path) {
    return { path, doc: id => doc(path + "/" + id), get: async () => snapColl((await call("list", { path: P(path) })).docs), onSnapshot: (next, error) => subscribe("coll", path, next, error) };
  }
  const nameCache = {};
  const caps = {
    db: { doc, collection: coll },
    user: {
      id: async () => ME && ME.id, isOwner: async () => !!(ME && ME.admin), canEdit: async () => !!(ME && ME.admin), can: async () => true,
      me: async () => ({ id: ME.id, name: ME.name }),
      profiles: async ids => {
        ids = [].concat(ids); const need = ids.filter(i => !(i in nameCache));
        if (need.length) { try { const j = await call("profiles", { ids: need }); Object.entries(j.profiles || {}).forEach(([i, p]) => nameCache[i] = p); } catch (e) {} }
        return Object.fromEntries(ids.map(i => [i, nameCache[i] || { id: i, name: "" }]));
      },
      search: async q => { try { return (await call("search", { q })).hits; } catch (e) { return []; } }
    },
    room: {
      presence: async patch => { pres = Object.assign({}, pres || {}, patch || {}); presDirty = true; kick(); },
      onPeers: fn => { peerFns.push(fn); if (lastPeers.length) setTimeout(() => fn({ peers: lastPeers.slice() }), 0); return () => { peerFns = peerFns.filter(f => f !== fn); }; },
      emit: () => {}, on: () => () => {}
    },
    downloads: {
      save: async ({ filename, data }) => {
        const blob = data instanceof Blob ? data : new Blob([data]);
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); return { status: "saved" };
      }
    }
  };
  window.claude = { use: async name => { await ready; if (name === "room" || name === "db") schedule(0); return caps[name] || null; } };

  // ---------- student accounts (admin) ----------
  const AC = { users: null, loading: false, made: null, err: "" };
  function genPassword() {
    const abc = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789", a = new Uint32Array(10); crypto.getRandomValues(a);
    return Array.from(a, x => abc[x % abc.length]).join("").replace(/^(.{5})/, "$1-");
  }
  function slug(name) {
    const base = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "").slice(0, 40);
    return base.length >= 2 ? base : "student";
  }
  const when = t => t ? new Date(t * 1000).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Never";
  async function loadUsers() {
    if (AC.loading) return; AC.loading = true;
    try { AC.users = (await call("listUsers")).users; AC.err = ""; } catch (e) { AC.err = e.message; }
    AC.loading = false; paint(); if (window.ACCOUNTS_CHANGED) window.ACCOUNTS_CHANGED();
  }
  function paint() { const box = document.getElementById("srvAcc"); if (box) box.innerHTML = inner(); }
  function credText(list) { return list.map(u => `${u.name}\nUsername: ${u.username}\nPassword: ${u.password}`).join("\n\n"); }
  function inner() {
    const users = (AC.users || []).filter(u => !u.admin).sort((a, b) => a.name.localeCompare(b.name));
    const made = AC.made ? `<div class="card" style="border-color:var(--accent)"><h3>${AC.made.length === 1 ? "Account ready" : AC.made.length + " accounts ready"}</h3>
      <p class="muted small">Copy these details now and send them to each student. Passwords are not shown again; you can always set a new one.</p>
      <pre class="srv-cred" id="srvCred">${esc(credText(AC.made))}\n\nCourse address: ${esc(location.href.split("#")[0])}</pre>
      <div class="row" style="margin-top:10px"><button class="btn sm primary" data-acc="copy">Copy</button><button class="btn sm" data-acc="csv">Download as CSV</button><button class="btn sm ghost" data-acc="hide">Done</button></div></div>` : "";
    return `${made}<div class="grid2"><form class="card" id="srvNewOne" style="display:flex;flex-direction:column;gap:12px"><h3>Create a student account</h3>
      <div class="field"><label for="accName">Full name</label><input type="text" id="accName" required maxlength="80" placeholder="e.g. Marta López"></div>
      <div class="field"><label for="accUser">Username</label><input type="text" id="accUser" required autocapitalize="off" spellcheck="false" placeholder="e.g. marta.lopez"></div>
      <div class="field"><label for="accPass">Password</label><div class="row" style="flex-wrap:nowrap"><input type="text" id="accPass" required minlength="8" value="${esc(genPassword())}" spellcheck="false" style="flex:1"><button class="btn sm" type="button" data-acc="gen">New</button></div></div>
      <div><button class="btn primary" type="submit">Create account</button></div></form>
      <form class="card" id="srvNewMany" style="display:flex;flex-direction:column;gap:12px"><h3>Create several at once</h3>
      <p class="muted small" style="margin:0">One student per line: <b>Full name</b>, or <b>Full name; username</b>, or <b>Full name; username; password</b>. Missing usernames and passwords are generated.</p>
      <div class="field"><label for="accMany">Students</label><textarea id="accMany" placeholder="Marta López&#10;Jan Kowalski; jan.kowalski&#10;Anna Weber; anna.w; Spring-2027!"></textarea></div>
      <div><button class="btn primary" type="submit">Create accounts</button></div></form></div>
      <div class="card"><div class="row"><h3 style="margin:0">Student accounts (${users.length})</h3><span class="spacer"></span><button class="btn sm" data-acc="reload">Refresh</button></div>
      ${AC.err ? `<p class="small" style="color:var(--live)">${esc(AC.err)}</p>` : ""}
      ${AC.users == null ? `<div class="empty">Loading…</div>` : users.length ? `<div class="scroll" style="margin-top:10px"><table class="tbl"><thead><tr><th>Name</th><th>Username</th><th>Last sign-in</th><th></th></tr></thead><tbody>${users.map(u => `<tr><td>${esc(u.name)}${u.self ? ` <span class="pill">registered</span>` : ""}${u.disabled ? ` <span class="status soon">Paused</span>` : ""}</td><td><code>${esc(u.username)}</code></td><td class="muted small">${esc(when(u.lastLogin))}</td><td style="text-align:right;white-space:nowrap"><button class="btn sm" data-acc="${u.disabled ? "resume" : "pause"}" data-id="${esc(u.id)}">${u.disabled ? "Resume" : "Pause"}</button><button class="btn sm" data-acc="reset" data-id="${esc(u.id)}">New password</button><button class="btn sm" data-acc="rename" data-id="${esc(u.id)}">Rename</button><button class="btn sm ghost" data-acc="del" data-id="${esc(u.id)}">Delete</button></td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">No student accounts yet. Create the first one above.</div>`}
      <p class="muted small">Each account is enrolled in the course as soon as it is created. Pause stops a person signing in and keeps their work; Delete removes the account and its enrolments.</p></div>`;
  }
  function accountsHTML() { if (AC.users == null || Date.now() - (AC.at || 0) > 30000) { AC.at = Date.now(); setTimeout(loadUsers, 0); } return `<div class="srv-acc" id="srvAcc">${inner()}</div>`; }
  async function create(list) {
    try { const j = await call("createUsers", { users: list, courses: window.ACADEMY_ENROL ? window.ACADEMY_ENROL() : [window.COURSE_NS || ""] }); AC.made = j.users.map((u, i) => Object.assign({}, u, { password: list[i].password })); toast(list.length === 1 ? "Account created" : list.length + " accounts created"); await loadUsers(); return true; }
    catch (e) { toast(e.message); return false; }
  }
  document.addEventListener("input", e => {
    if (e.target.id === "accName") { const u = document.getElementById("accUser"); if (u && !u.dataset.touched) u.value = slug(e.target.value); }
    if (e.target.id === "accUser") e.target.dataset.touched = "1";
  });
  document.addEventListener("submit", async e => {
    if (e.target.id === "srvNewOne") {
      e.preventDefault();
      const name = document.getElementById("accName").value.trim(), username = document.getElementById("accUser").value.trim().toLowerCase(), password = document.getElementById("accPass").value;
      await create([{ name, username, password }]);
    }
    if (e.target.id === "srvNewMany") {
      e.preventDefault();
      const taken = new Set((AC.users || []).map(u => u.username));
      const list = document.getElementById("accMany").value.split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => {
        const [name, user, pw] = l.split(/[;\t]/).map(x => (x || "").trim());
        let username = (user || slug(name)).toLowerCase(), base = username, n = 2;
        if (!user) while (taken.has(username)) username = base + n++; // only generated usernames get a number added
        taken.add(username); return { name, username, password: pw || genPassword() };
      });
      if (!list.length) { toast("Add at least one name."); return; }
      if (await create(list)) document.getElementById("accMany") && (document.getElementById("accMany").value = "");
    }
  });
  document.addEventListener("click", async e => {
    const b = e.target.closest("[data-acc]"); if (!b) return;
    const act = b.dataset.acc, id = b.dataset.id, u = (AC.users || []).find(x => x.id === id);
    if (act === "gen") { document.getElementById("accPass").value = genPassword(); return; }
    if (act === "reload") { loadUsers(); return; }
    if (act === "hide") { AC.made = null; paint(); return; }
    if (act === "copy") { try { await navigator.clipboard.writeText(document.getElementById("srvCred").textContent); toast("Copied"); } catch (err) { toast("Select the text and copy it."); } return; }
    if (act === "csv") {
      const q = v => `"${String(v).replace(/"/g, '""')}"`;
      const csv = "﻿Name,Username,Password,Course address\n" + AC.made.map(m => [m.name, m.username, m.password, location.href.split("#")[0]].map(q).join(",")).join("\n");
      caps.downloads.save({ filename: "student-logins.csv", data: new Blob([csv], { type: "text/csv" }) }); return;
    }
    if (!u) return;
    if (act === "reset") {
      if (b.dataset.confirm !== "1") { b.dataset.confirm = "1"; b.textContent = "Click again to confirm"; return; }
      const password = genPassword();
      try { await call("updateUser", { id, password }); AC.made = [Object.assign({}, u, { password })]; toast("New password set"); paint(); window.scrollTo(0, 0); } catch (err) { toast(err.message); }
      return;
    }
    if (act === "pause" || act === "resume") {
      try { await call("updateUser", { id, disabled: act === "pause" }); toast(act === "pause" ? u.name + " can no longer sign in" : u.name + " can sign in again"); loadUsers(); if (act === "pause") kick(); } catch (err) { toast(err.message); }
      return;
    }
    if (act === "rename") {
      const tr = b.closest("tr");
      tr.innerHTML = `<td><input type="text" value="${esc(u.name)}" data-f="name" aria-label="Full name"></td><td><input type="text" value="${esc(u.username)}" data-f="username" aria-label="Username"></td><td></td><td style="text-align:right;white-space:nowrap"><button class="btn sm primary" data-acc="saveRename" data-id="${esc(id)}">Save</button><button class="btn sm ghost" data-acc="reload">Cancel</button></td>`;
      return;
    }
    if (act === "saveRename") {
      const tr = b.closest("tr"), name = tr.querySelector('[data-f="name"]').value, username = tr.querySelector('[data-f="username"]').value;
      try { await call("updateUser", { id, name, username }); delete nameCache[id]; if (window.SA) delete window.SA.S.names[id]; toast("Saved"); loadUsers(); } catch (err) { toast(err.message); }
      return;
    }
    if (act === "del") {
      if (b.dataset.confirm !== "1") { b.dataset.confirm = "1"; b.textContent = "Click again to delete"; return; }
      try { await call("deleteUser", { id }); toast(u.name + " deleted"); loadUsers(); kick(); } catch (err) { toast(err.message); }
    }
  });
  window.ACCOUNTS = { html: accountsHTML };
  window.SRV = { call, ns: window.COURSE_NS || "", me: () => ME, showLogin: () => loginScreen(), showRegister: pick => registerScreen(pick) };
})();
