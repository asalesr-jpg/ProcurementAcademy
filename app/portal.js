// Academy home: my courses, the catalogue, and (for the admin) accounts, enrolment and catalogue texts.
(function () {
  "use strict";
  const A = window.ACADEMY, $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const S = { me: null, enrolled: {}, tab: "home", edit: null, regOpen: false };
  function toast(t) { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 2600); }
  window.SA = window.SA || { toast, softRender: () => {}, S: { names: {} } };
  const rosterPath = (c, id) => (c.ns ? `c/${c.ns}/roster/` : "roster/") + id;
  const open = () => A.courses.filter(c => c.status === "open");
  const avatar = n => { const hue = [...String(n)].reduce((a, c) => a + c.charCodeAt(0), 0) % 360; return `<span class="avatar" style="background:hsl(${hue} 45% 42%)">${esc(String(n).trim().charAt(0).toUpperCase() || "?")}</span>`; };

  function courseCard(c) {
    const enr = S.me && (S.me.admin || S.enrolled[c.id]);
    const isOpen = c.status === "open";
    const tag = isOpen ? (S.me && S.me.admin ? `<span class="status open">Open</span>` : enr ? `<span class="status enrolled">Enrolled</span>` : `<span class="status open">Open</span>`) : `<span class="status soon">Coming soon</span>`;
    const action = isOpen ? (enr ? `<span class="btn primary sm">${S.me.admin ? "Open the course" : "Continue"}</span>` : S.regOpen ? `<button class="btn primary sm" data-penrol="${esc(c.id)}">Enrol in this course</button>` : `<span class="muted small">Ask your Academy admin to enrol you.</span>`) : "";
    const inner = `<div class="band" style="--cc:${esc(c.color)}"><span class="code">${esc(c.code)}</span><b>${esc(c.title)}</b></div>
      <div class="body"><div class="row">${tag}<span class="muted small">${esc(c.subtitle)}</span></div><p class="small" style="margin:0">${esc(c.desc)}</p>
      ${c.facts && c.facts.length ? `<div class="meta">${c.facts.map(f => `<span class="pill">${esc(f)}</span>`).join("")}</div>` : ""}<div class="foot">${action}</div></div>`;
    return isOpen && enr ? `<a class="course" href="${esc(c.path)}">${inner}</a>` : `<div class="course${isOpen ? "" : " soon"}">${inner}</div>`;
  }
  function vHome() {
    const mine = open().filter(c => S.me.admin || S.enrolled[c.id]);
    return `<section class="portal-hero"><div class="in"><div><div class="eyebrow">${esc(A.heroEyebrow)}</div><h1 style="margin:10px 0 14px">${esc(A.heroTitle)}</h1><p>${esc(A.heroLead)}</p>
      ${mine.length ? `<div class="row" style="margin-top:18px"><a class="btn primary" href="${esc(mine[0].path)}">${S.me.admin ? "Open " + esc(mine[0].title) : "Continue " + esc(mine[0].title)}</a></div>` : ""}</div>
      <div class="hero-stats"><div><b>${open().length}</b><span>course${open().length === 1 ? "" : "s"} open</span></div><div><b>${A.courses.length - open().length}</b><span>in preparation</span></div><div><b>100%</b><span>online, live with your teacher</span></div><div><b>Practice</b><span>in every module, saved to your workbook</span></div></div></div></section>
      <div class="portal">
      ${S.me.admin ? `<div class="card row presenter"><b>Academy admin</b><span class="muted small">Create accounts, enrol people in courses and edit this page.</span><span class="spacer"></span><button class="btn sm${S.tab === "home" ? " primary" : ""}" data-ptab="home">Home</button><button class="btn sm${S.tab === "people" ? " primary" : ""}" data-ptab="people">People and enrolment</button><button class="btn sm${S.tab === "cat" ? " primary" : ""}" data-ptab="cat">Edit the catalogue</button></div>` : ""}
      ${S.me.admin || !mine.length ? "" : `<div class="sec-title"><h2>My courses</h2></div><div class="courses">${mine.map(courseCard).join("")}</div>`}
      <div class="sec-title"><h2>Course catalogue</h2><span class="muted small">New programmes are added as they are ready.</span></div>
      <div class="courses">${A.courses.map(courseCard).join("")}</div>
      <div class="card"><h3>How every Academy course works</h3><div class="pillars" style="margin-top:14px">
        <div><b>Before each class</b><p class="small muted">Narrated video lessons with questions, a short reading and a quiz.</p></div>
        <div><b>Live online classes</b><p class="small muted">Your teacher, slides, polls, questions and discussion, with camera and microphone in the browser.</p></div>
        <div><b>Practice</b><p class="small muted">Every module ends with an exercise on a realistic insurance case, saved to your workbook.</p></div>
        <div><b>Real work</b><p class="small muted">Fieldwork with your own internal clients and suppliers between sessions.</p></div></div></div></div>`;
  }
  // ----- admin: people and enrolment -----
  const P = { users: null, roster: {} };
  async function loadPeople() {
    try {
      P.users = (await window.SRV.call("listUsers")).users.filter(u => !u.admin).sort((a, b) => a.name.localeCompare(b.name));
      P.roster = {};
      for (const c of open()) { const r = await window.SRV.call("list", { path: c.ns ? `c/${c.ns}/roster` : "roster" }); P.roster[c.id] = new Set(r.docs.map(d => d.id)); }
    } catch (e) { toast(e.message); }
    render();
  }
  function vPeople() {
    const when = t => t ? new Date(t * 1000).toLocaleDateString([], { dateStyle: "medium" }) : "";
    return `<div class="portal">${adminBar()}<div class="card row" style="align-items:center"><div style="flex:1;min-width:240px"><h3 style="margin:0 0 4px">Registration on the home page</h3><p class="muted small" style="margin:0">${S.regOpen ? "Open: anyone with the address can create an account and enrol in the open courses." : "Closed: only the accounts you create can sign in."} ${P.users ? P.users.filter(u => u.self).length + " people registered themselves." : ""}</p></div>
      <button class="btn ${S.regOpen ? "" : "primary"}" data-preg="${S.regOpen ? "0" : "1"}">${S.regOpen ? "Close registration" : "Open registration"}</button></div>
      <div class="card"><h3>Enrolment</h3><p class="muted small">Tick a box to enrol a person in a course; untick to remove them (their saved work is kept).</p>
      ${P.users == null ? `<div class="empty">Loading…</div>` : P.users.length ? `<div class="scroll"><table class="tbl"><thead><tr><th>Person</th><th>E-mail or username</th><th>Company / country</th><th>Joined</th>${open().map(c => `<th>${esc(c.title)}</th>`).join("")}</tr></thead><tbody>${P.users.map(u => `<tr><td><span class="row">${avatar(u.name)}${esc(u.name)}${u.disabled ? `<span class="status soon">Paused</span>` : ""}</span></td><td><code>${esc(u.username)}</code></td><td class="small">${esc([u.team, u.country].filter(Boolean).join(" · "))}</td><td class="small muted">${esc(when(u.created))}<br>${u.self ? "Registered" : "Created by admin"}</td>${open().map(c => `<td><input type="checkbox" data-enrol="${esc(c.id)}|${esc(u.id)}"${P.roster[c.id] && P.roster[c.id].has(u.id) ? " checked" : ""} aria-label="${esc(u.name)} in ${esc(c.title)}"></td>`).join("")}</tr>`).join("")}</tbody></table></div>` : `<div class="empty">No accounts yet. Create them below.</div>`}</div>
      <div class="card"><h3>Accounts</h3><p class="muted small">New accounts are enrolled in the courses ticked here.</p><div class="row" style="margin:8px 0 14px">${open().map(c => `<label class="row small"><input type="checkbox" data-newcourse="${esc(c.ns)}" checked> ${esc(c.title)}</label>`).join("")}</div>${window.ACCOUNTS.html()}</div></div>`;
  }
  function adminBar() { return `<div class="card row presenter"><b>Academy admin</b><span class="spacer"></span><button class="btn sm${S.tab === "home" ? " primary" : ""}" data-ptab="home">Home</button><button class="btn sm${S.tab === "people" ? " primary" : ""}" data-ptab="people">People and enrolment</button><button class="btn sm${S.tab === "cat" ? " primary" : ""}" data-ptab="cat">Edit the catalogue</button></div>`; }
  // ----- admin: catalogue texts -----
  function vCat() {
    const f = (id, label, v, area) => `<div class="field"><label for="${id}">${label}</label>${area ? `<textarea id="${id}" rows="3">${esc(v)}</textarea>` : `<input type="text" id="${id}" value="${esc(v)}">`}</div>`;
    return `<div class="portal">${adminBar()}<form class="card" id="catForm" style="display:flex;flex-direction:column;gap:14px"><h3>Home page</h3>
      ${f("c_name", "Academy name", A.name)}${f("c_eye", "Small title above the headline", A.heroEyebrow)}${f("c_title", "Headline", A.heroTitle)}${f("c_lead", "Introduction", A.heroLead, true)}
      <h3 style="margin-top:10px">Courses</h3>${A.courses.map((c, i) => `<div class="card" style="box-shadow:none"><div class="row"><b>${esc(c.code)}</b>${c.path ? `<span class="pill">Folder ${esc(c.path)}</span>` : ""}</div>
        <div class="grid2" style="margin-top:8px">${f("t" + i, "Title", c.title)}${f("s" + i, "Subtitle", c.subtitle)}</div>${f("d" + i, "Description", c.desc, true)}${f("f" + i, "Facts (separate with ;)", (c.facts || []).join("; "))}
        ${c.path ? `<label class="row small"><input type="checkbox" id="o${i}"${c.status === "open" ? " checked" : ""}> Open to enrolled people</label>` : `<span class="muted small">Shown as coming soon until the course is built.</span>`}</div>`).join("")}
      <div class="row"><button class="btn primary" type="submit">Save the catalogue</button><button class="btn" type="button" data-catreset="1">Restore the original texts</button></div></form></div>`;
  }
  function render() {
    const tu = $("#topUser");
    tu.innerHTML = S.me ? `${avatar(S.me.name)}<b class="uname">${esc(S.me.name)}</b><button class="btn sm" id="srvPw">Password</button><button class="btn sm" id="srvOut">Sign out</button>` : "";
    $("#brandName").textContent = A.name; document.title = A.name;
    const a = document.activeElement; if (a && a.closest && a.closest(".srv-acc") && /INPUT|TEXTAREA/.test(a.tagName)) return;
    $("#pview").innerHTML = S.tab === "people" ? vPeople() : S.tab === "cat" ? vCat() : vHome();
  }
  const applyCat = o => window.ACADEMY_APPLY(o);
  document.addEventListener("click", async e => {
    const b = e.target.closest("[data-ptab],[data-catreset],[data-penrol],[data-preg]"); if (!b) return;
    if (b.dataset.penrol) { e.preventDefault(); const c = A.courses.find(x => x.id === b.dataset.penrol); b.disabled = true; try { await window.SRV.call("enrolSelf", { course: c.ns || "" }); location.href = c.path; } catch (err) { b.disabled = false; toast(err.message); } return; }
    if (b.dataset.preg) { try { S.regOpen = (await window.SRV.call("setRegistration", { open: b.dataset.preg === "1" })).open; toast(S.regOpen ? "Registration is open" : "Registration is closed"); render(); } catch (err) { toast(err.message); } return; }
    if (b.dataset.ptab) { S.tab = b.dataset.ptab; render(); if (S.tab === "people") loadPeople(); window.scrollTo(0, 0); }
    if (b.dataset.catreset) { try { await window.SRV.call("delete", { path: "academy/catalogue" }); applyCat(null); toast("Original texts restored"); render(); } catch (err) { toast(err.message); } }
  });
  document.addEventListener("change", async e => {
    const el = e.target;
    if (el.dataset.enrol) {
      const [cid, uid] = el.dataset.enrol.split("|"), c = A.courses.find(x => x.id === cid);
      try { if (el.checked) await window.SRV.call("set", { path: rosterPath(c, uid), data: { addedAt: Date.now() } }); else await window.SRV.call("delete", { path: rosterPath(c, uid) }); (P.roster[cid] = P.roster[cid] || new Set())[el.checked ? "add" : "delete"](uid); toast(el.checked ? "Enrolled" : "Removed from the course"); }
      catch (err) { el.checked = !el.checked; toast(err.message); }
    }
  });
  document.addEventListener("submit", async e => {
    if (e.target.id !== "catForm") return;
    e.preventDefault();
    const v = id => document.getElementById(id) ? document.getElementById(id).value.trim() : "";
    const o = { name: v("c_name"), heroEyebrow: v("c_eye"), heroTitle: v("c_title"), heroLead: v("c_lead"),
      courses: A.courses.map((c, i) => ({ id: c.id, title: v("t" + i), subtitle: v("s" + i), desc: v("d" + i), facts: v("f" + i).split(";").map(x => x.trim()).filter(Boolean), status: c.path ? (document.getElementById("o" + i).checked ? "open" : "soon") : "soon" })) };
    try { await window.SRV.call("set", { path: "academy/catalogue", data: o }); applyCat(o); toast("Catalogue saved"); render(); } catch (err) { toast(err.message); }
  });
  // new accounts: enrol in the ticked courses
  window.ACADEMY_ENROL = () => [...document.querySelectorAll("[data-newcourse]")].filter(x => x.checked).map(x => x.dataset.newcourse);
  window.ACCOUNTS_CHANGED = () => { if (S.tab === "people") loadPeople(); };
  (async () => {
    const db = await window.claude.use("db"); const user = await window.claude.use("user");
    const id = await user.id(); const me = await user.me(); S.me = { id, name: me.name, admin: await user.isOwner() };
    try { const c = await window.SRV.call("get", { path: "academy/catalogue" }); if (c.exists) applyCat(c.data); } catch (e) {}
    try { S.regOpen = (await window.SRV.call("regStatus")).open; } catch (e) {}
    if (!S.me.admin) for (const c of open()) { try { S.enrolled[c.id] = (await window.SRV.call("get", { path: rosterPath(c, id) })).exists; } catch (e) {} }
    render();
  })();
})();
