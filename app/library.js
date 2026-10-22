// Templates & downloads: Excel workbooks, PowerPoint templates and the training decks.
(function () {
  "use strict";
  const T = window.TEMPLATES || { decks: [], items: [] };
  const shown = () => T.items.filter(it => !it.hidden);
  const SA = () => window.SA;
  const esc = s => SA().esc(s);
  const SIZE = b => b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";
  let filter = { session: "all", q: "" };

  function fileBtn(path, label, kind, size) {
    const name = path.split("/").pop();
    return `<button class="btn sm dl dl-${kind}" data-dl="${esc(path)}" title="${esc(name)}"><span class="dl-ico">${kind.toUpperCase()}</span>${esc(label)}${size ? `<span class="muted small">${SIZE(size)}</span>` : ""}</button>`;
  }
  function itemCard(it, compact) {
    return `<div class="tpl card${compact ? " compact" : ""}"><div class="tpl-head"><span class="pill">${esc(it.code)}</span>${compact ? "" : `<span class="muted small">Session ${it.session.slice(1)}</span>`}</div>
      <h3>${esc(it.title)}</h3><p class="muted small">${esc(it.purpose)}</p>
      <div class="row tpl-btns">${it.xlsx ? fileBtn(it.xlsx, "Excel workbook", "xlsx", it.xlsxSize) : ""}${it.pptx ? fileBtn(it.pptx, `PowerPoint · ${it.slides || ""} slides`, "pptx", it.pptxSize) : ""}</div></div>`;
  }
  function deckRow(dk) {
    return `<div class="tpl card"><div class="tpl-head"><span class="pill">Session ${dk.num}</span><span class="muted small">${dk.slides} slides · with speaker notes</span></div>
      <h3>${esc(dk.title)}</h3><p class="muted small">The full training presentation of this session, in the corporate template.</p>
      <div class="row tpl-btns">${fileBtn(dk.pptx, "PowerPoint", "pptx", dk.pptxSize)}${fileBtn(dk.pdf, "PDF", "pdf", dk.pdfSize)}</div></div>`;
  }

  function bookCard() {
    const b = T.book; if (!b) return "";
    return `<div class="card book-card"><div class="book-cover" aria-hidden="true"><span>${esc(SA().C.site.courseTitle || "Procurement Academy")}</span><b>${esc(b.title)}</b></div><div class="book-txt"><div class="eyebrow">Read before the course${b.pages ? " · " + b.pages + " pages" : ""}</div><h3>${esc(b.title)}</h3><p class="muted">${esc(b.subtitle || "Why early involvement, joint planning and a strategic approach make Procurement the partner people call first.")}</p><p class="small">The key tools drawn out, worked examples and real cases. Read it before Session 1.</p><div class="row">${fileBtn(b.pdf, "Download the book", "pdf", b.pdfSize)}</div></div></div>`;
  }
  function libraryHTML() {
    const sess = SA().SESS;
    const q = filter.q.trim().toLowerCase();
    const items = shown().filter(it => (filter.session === "all" || it.session === filter.session) && (!q || (it.title + " " + it.purpose + " " + it.code).toLowerCase().includes(q)));
    return `<div class="hero"><div class="eyebrow">Repository</div><h1>Templates and downloads</h1>
      <p class="lead">One Excel workbook to work and one PowerPoint template to present, for every practice of the programme. Use them to build local examples with your own data.</p></div>
      <div class="card lib-how"><div><b>How to use them</b><p class="muted small">Start with the Excel workbook: its first tab explains each step and the Example tab shows the fictional Nordvia case. Then move the result into the PowerPoint template: yellow notes on the slides tell you what goes where, and you delete them before presenting.</p></div>
      <div class="lib-count"><b>${shown().length * 2 + T.decks.length * 2 + (T.book ? 1 : 0)}</b><span class="muted small">files</span></div></div>
      ${T.book ? `<h2 class="lib-h">The book</h2>${bookCard()}` : ""}
      <h2 class="lib-h">Training presentations</h2>
      <div class="tpl-grid">${T.decks.map(deckRow).join("")}</div>
      <h2 class="lib-h">Practice templates</h2>
      <div class="card row lib-filter"><label for="libSess" class="small">Session</label><select id="libSess" style="width:auto"><option value="all">All sessions</option>${sess.map(s => `<option value="${s.id}"${filter.session === s.id ? " selected" : ""}>Session ${s.num} · ${esc(s.title)}</option>`).join("")}</select>
        <input id="libQ" type="text" placeholder="Search templates" value="${esc(filter.q)}" style="flex:1;min-width:160px" aria-label="Search templates"></div>
      ${sess.filter(s => filter.session === "all" || s.id === filter.session).map(s => { const its = items.filter(it => it.session === s.id); return its.length ? `<h3 class="lib-sess">Session ${s.num} · ${esc(s.title)}</h3><div class="tpl-grid">${its.map(it => itemCard(it)).join("")}</div>` : ""; }).join("") || `<div class="empty">No template matches your search.</div>`}`;
  }
  function sessionHTML(s) {
    const its = shown().filter(it => it.session === s.id), dk = T.decks.find(d => d.session === s.id);
    if (!its.length && !dk) return `<div class="empty">The templates for this session are being prepared.</div>`;
    return `${dk ? `<h3 class="lib-sess">Presentation of this session</h3><div class="tpl-grid">${deckRow(dk)}</div>` : ""}
      <h3 class="lib-sess">Templates for each practice</h3><div class="tpl-grid">${its.map(it => itemCard(it, true)).join("")}</div>
      <p class="muted small" style="margin-top:12px"><a href="#library">See the whole repository</a></p>`;
  }
  function forLesson(lessonId) {
    const its = shown().filter(it => (it.lessons || []).includes(lessonId));
    if (!its.length) return "";
    return `<div class="lesson-tpls"><span class="eyebrow">Templates</span>${its.map(it => `${fileBtn(it.xlsx, it.code + " Excel", "xlsx")}${fileBtn(it.pptx, it.code + " PowerPoint", "pptx")}`).join("")}</div>`;
  }

  const MIME = { xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation" };
  async function download(path) {
    const name = path.split("/").pop();
    const S = SA().S;
    try {
      // Office files are hosted base64-encoded as text next to the page (the host serves no .xlsx/.pptx)
      const office = !window.STATIC && !window.SERVER && MIME[name.split(".").pop()];
      const res = await fetch(office ? path + ".b64.txt" : path);
      if (!res.ok) throw new Error("http " + res.status);
      let blob;
      if (office) {
        const bin = atob((await res.text()).trim()), bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        blob = new Blob([bytes], { type: office });
      } else blob = await res.blob();
      if (S.dl) {
        await S.dl.save({ filename: name, data: blob });
      } else {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      }
    } catch (e) {
      if (e && e.code === "declined") return;
      SA().toast("The download did not start. Try again.");
    }
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-dl]"); if (!b) return; e.preventDefault(); download(b.dataset.dl); });
  document.addEventListener("change", e => { if (e.target.id === "libSess") { filter.session = e.target.value; SA().render(); } });
  let qT;
  document.addEventListener("input", e => { if (e.target.id !== "libQ") return; filter.q = e.target.value; clearTimeout(qT); qT = setTimeout(() => { SA().render(); const el = document.getElementById("libQ"); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, 250); });

  window.LIB = { libraryHTML, sessionHTML, forLesson, bookCard };
})();
if (window.SA) window.SA.render();
