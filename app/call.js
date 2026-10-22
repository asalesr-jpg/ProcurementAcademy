// Class call: camera and microphone for everyone in the live class, peer to peer in the browser (WebRTC).
// The PHP server only passes the connection messages between participants (op "rtc"); audio and video never go through it.
// The teacher can mute or remove participants (op "rtcAdmin"). The call window floats over the page and survives page changes.
(function () {
  "use strict";
  if (!window.SERVER || !window.RTCPeerConnection) return;
  const ROOM = window.COURSE_NS || "main";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const C = { joined: false, joining: false, members: [], removed: false, removedList: [], mic: true, cam: true, big: false, min: false };
  let local = null, ice = [{ urls: "stun:stun.l.google.com:19302" }], timer = null, inflight = false, first = false, outbox = [], lastChange = 0, sig = "";
  const peers = new Map(); // id -> { pc, stream, offered, at }
  const myId = () => (window.SRV.me() || {}).id;
  const toast = t => window.SA && window.SA.toast(t);
  const refresh = () => { if (window.SA && window.SA.S && window.SA.S.route === "live") window.SA.softRender(); };

  // ---------- dock ----------
  const dock = document.createElement("div"); dock.id = "callDock"; dock.className = "call-dock"; dock.hidden = true;
  dock.setAttribute("role", "region"); dock.setAttribute("aria-label", "Class call");
  document.body.appendChild(dock);
  const st = document.createElement("style");
  st.textContent = `.call-dock{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:max(16px,env(safe-area-inset-bottom,0px));z-index:45;width:min(440px,calc(100vw - 32px));background:#0E1A2B;color:#fff;border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden}
  .call-dock.big{width:min(980px,calc(100vw - 32px))}
  .call-dock .cbar{display:flex;align-items:center;gap:6px;padding:8px 10px;background:#12233A;flex-wrap:wrap}
  .call-dock .cbar b{font-size:13.5px;flex:1;min-width:0}
  .call-dock .cbtn{border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;border-radius:6px;padding:5px 9px;font-size:12.5px;cursor:pointer}
  .call-dock .cbtn.off{background:#B3122A;border-color:#B3122A}
  .call-dock .cbtn.leave{background:#B3122A;border-color:#B3122A}
  .call-dock .tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px;padding:8px;max-height:46vh;overflow:auto}
  .call-dock.big .tiles{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));max-height:70vh}
  .call-dock.min .tiles{display:none}
  .call-dock .tile{position:relative;aspect-ratio:16/9;background:#1C2A3D;border-radius:6px;overflow:hidden;display:grid;place-items:center}
  .call-dock .tile video{width:100%;height:100%;object-fit:cover;background:#000}
  .call-dock .tile .ini{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font:600 18px var(--f-body,sans-serif);color:#fff;position:absolute}
  .call-dock .tile .lbl{position:absolute;left:6px;bottom:5px;right:6px;font-size:11.5px;display:flex;gap:6px;align-items:center;text-shadow:0 1px 2px #000}
  .call-dock .tile .lbl span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .call-dock .tile .mut{background:#B3122A;border-radius:3px;padding:0 4px;font-size:10px;flex:none}
  .call-dock .tile.teacher{outline:2px solid #47BCC5}
  .call-dock .tile.speaking{outline:2px solid #F5C451}
  .call-dock .wait{font-size:11px;color:#A9B6C8;position:absolute;top:6px;left:6px}`;
  document.head.appendChild(st);
  const hue = s => [...String(s)].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  function tileFor(id) {
    let t = dock.querySelector(`.tile[data-id="${CSS.escape(id)}"]`);
    if (!t) {
      t = document.createElement("div"); t.className = "tile"; t.dataset.id = id;
      t.innerHTML = `<video playsinline autoplay${id === myId() ? " muted" : ""}></video><span class="ini"></span><span class="wait"></span><div class="lbl"><span class="nm"></span></div>`;
      dock.querySelector(".tiles").appendChild(t);
    }
    return t;
  }
  function drawBar() {
    const n = C.members.length;
    dock.querySelector(".cbar").innerHTML = `<b>Class call · ${n} ${n === 1 ? "person" : "people"}</b>
      <button class="cbtn${C.mic ? "" : " off"}" data-cc="mic" aria-pressed="${!C.mic}">${C.mic ? "Mute" : "Unmute"}</button>
      <button class="cbtn${C.cam ? "" : " off"}" data-cc="cam" aria-pressed="${!C.cam}">${C.cam ? "Stop video" : "Start video"}</button>
      <button class="cbtn" data-cc="size" aria-label="${C.big ? "Smaller" : "Larger"}">${C.big ? "Smaller" : "Larger"}</button>
      <button class="cbtn" data-cc="min" aria-label="${C.min ? "Show videos" : "Hide videos"}">${C.min ? "Show" : "Hide"}</button>
      <button class="cbtn leave" data-cc="leave">Leave</button>`;
    dock.classList.toggle("big", C.big); dock.classList.toggle("min", C.min);
  }
  function drawTiles() {
    const me = myId(), ids = new Set(C.members.map(m => m.id));
    dock.querySelectorAll(".tile").forEach(t => { if (!ids.has(t.dataset.id)) t.remove(); });
    C.members.slice().sort((a, b) => (b.admin - a.admin) || (a.id === me ? -1 : b.id === me ? 1 : a.name.localeCompare(b.name))).forEach(m => {
      const t = tileFor(m.id), v = t.querySelector("video");
      t.classList.toggle("teacher", !!m.admin);
      const camOn = m.id === me ? !!(C.cam && local && local.getVideoTracks().length) : m.cam;
      v.style.visibility = camOn ? "visible" : "hidden";
      const ini = t.querySelector(".ini"); ini.textContent = (m.name || "?").trim().charAt(0).toUpperCase(); ini.style.background = `hsl(${hue(m.id)} 45% 42%)`; ini.style.display = camOn ? "none" : "grid";
      t.querySelector(".nm").textContent = (m.name || "Participant") + (m.id === me ? " (you)" : "") + (m.admin ? " · Teacher" : "");
      let mu = t.querySelector(".mut"); const mic = m.id === me ? C.mic : m.mic;
      if (!mic && !mu) { mu = document.createElement("span"); mu.className = "mut"; mu.textContent = "Muted"; t.querySelector(".lbl").appendChild(mu); }
      if (mic && mu) mu.remove();
      const p = peers.get(m.id); t.querySelector(".wait").textContent = m.id !== me && (!p || p.pc.connectionState !== "connected") ? "Connecting…" : "";
      if (m.id === me && local && v.srcObject !== local) v.srcObject = local;
      if (p && v.srcObject !== p.stream) { v.srcObject = p.stream; v.play().catch(() => {}); }
    });
  }
  function draw() { if (!C.joined) { dock.hidden = true; return; } if (!dock.querySelector(".cbar")) dock.innerHTML = `<div class="cbar"></div><div class="tiles"></div>`; dock.hidden = false; drawBar(); drawTiles(); }

  // ---------- media ----------
  async function getMedia() {
    const audio = { echoCancellation: true, noiseSuppression: true, autoGainControl: true };
    const video = { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { max: 15 } };
    try { return await navigator.mediaDevices.getUserMedia({ audio, video }); } catch (e) {}
    try { C.cam = false; toast("Camera not available: you join with your microphone."); return await navigator.mediaDevices.getUserMedia({ audio }); } catch (e) {}
    C.mic = false; toast("Microphone and camera are blocked: you can listen and watch. Allow them in the browser to talk.");
    return new MediaStream();
  }
  const track = kind => local ? (kind === "audio" ? local.getAudioTracks()[0] : local.getVideoTracks()[0]) || null : null;
  function feed(pc) {
    pc.getTransceivers().forEach(t => {
      const kind = t.receiver.track && t.receiver.track.kind; if (!kind) return;
      t.direction = "sendrecv";
      t.sender.replaceTrack(kind === "video" && !C.cam ? null : track(kind)).catch(() => {});
    });
  }
  function bitrate(pc) {
    const max = C.members.length > 6 ? 200000 : C.members.length > 3 ? 350000 : 600000;
    pc.getSenders().forEach(s => { if (!s.track || s.track.kind !== "video") return; const p = s.getParameters(); if (!p.encodings || !p.encodings.length) p.encodings = [{}]; p.encodings[0].maxBitrate = max; s.setParameters(p).catch(() => {}); });
  }

  // ---------- connections ----------
  function mkPeer(id) {
    close(id);
    const pc = new RTCPeerConnection({ iceServers: ice });
    const p = { pc, stream: new MediaStream(), at: Date.now(), done: false };
    pc.ontrack = e => { p.stream.addTrack(e.track); drawTiles(); };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") { p.done = true; bitrate(pc); }
      if (pc.connectionState === "failed") { close(id); lastChange = Date.now(); }
      drawTiles();
    };
    peers.set(id, p); lastChange = Date.now();
    return p;
  }
  function close(id) { const p = peers.get(id); if (p) { try { p.pc.close(); } catch (e) {} peers.delete(id); } }
  const gathered = pc => new Promise(res => { if (pc.iceGatheringState === "complete") return res(); const t = setTimeout(res, 2500); pc.addEventListener("icegatheringstatechange", () => { if (pc.iceGatheringState === "complete") { clearTimeout(t); res(); } }); });
  async function offer(id) {
    const p = mkPeer(id), pc = p.pc;
    pc.addTransceiver("audio", { direction: "sendrecv" }); pc.addTransceiver("video", { direction: "sendrecv" });
    pc.getTransceivers().forEach(t => { const kind = t.receiver.track.kind; t.sender.replaceTrack(kind === "video" && !C.cam ? null : track(kind)).catch(() => {}); });
    await pc.setLocalDescription(await pc.createOffer()); await gathered(pc);
    if (peers.get(id) !== p) return;
    outbox.push({ to: id, data: { type: "offer", sdp: pc.localDescription.sdp } }); kick(50);
  }
  async function onOffer(from, sdp) {
    const p = mkPeer(from), pc = p.pc;
    await pc.setRemoteDescription({ type: "offer", sdp }); feed(pc);
    await pc.setLocalDescription(await pc.createAnswer()); await gathered(pc);
    if (peers.get(from) !== p) return;
    outbox.push({ to: from, data: { type: "answer", sdp: pc.localDescription.sdp } }); kick(50);
  }
  async function onMsg(m) {
    const d = m.data || {};
    try {
      if (d.type === "offer") await onOffer(m.from, d.sdp);
      else if (d.type === "answer") { const p = peers.get(m.from); if (p && p.pc.signalingState === "have-local-offer") await p.pc.setRemoteDescription({ type: "answer", sdp: d.sdp }); }
      else if (d.type === "mute") { if (C.mic) { C.mic = false; applyMic(); toast("The teacher muted your microphone. Unmute when you want to speak."); } }
      else if (d.type === "kicked") { removed(); }
    } catch (e) { console.warn("call", e); }
  }
  function reconcile() {
    const me = myId(), ids = new Set(C.members.map(m => m.id));
    [...peers.keys()].forEach(id => { if (!ids.has(id)) close(id); });
    C.members.forEach(m => {
      if (m.id === me) return;
      const p = peers.get(m.id);
      // the participant with the smaller id starts each connection; retry if nothing happened for 15 seconds
      if (me < m.id && (!p || (!p.done && Date.now() - p.at > 15000))) offer(m.id);
      if (me > m.id && p && !p.done && Date.now() - p.at > 25000) close(m.id);
    });
  }

  // ---------- signalling loop ----------
  const kick = ms => { clearTimeout(timer); timer = setTimeout(poll, ms == null ? 0 : ms); };
  async function poll() {
    if (!C.joined) return;
    if (inflight) { kick(200); return; }
    inflight = true;
    const send = outbox.splice(0);
    let j = null;
    try { j = await window.SRV.call("rtc", { room: ROOM, join: !first, mic: C.mic, cam: C.cam, send }); first = true; }
    catch (e) { outbox.unshift(...send); }
    inflight = false;
    if (!C.joined) return;
    if (j) {
      if (j.ice && j.ice.length) ice = j.ice;
      if (j.kicked) { removed(); return; }
      C.removedList = j.removed || [];
      const nsig = JSON.stringify(j.members) + C.removedList.join();
      C.members = j.members;
      if (!C.members.some(m => m.id === myId())) C.members.push({ id: myId(), name: (window.SRV.me() || {}).name || "", admin: !!(window.SRV.me() || {}).admin, mic: C.mic, cam: C.cam });
      for (const m of j.msgs || []) await onMsg(m);
      reconcile(); draw();
      if (nsig !== sig) { sig = nsig; refresh(); }
    }
    const busy = Date.now() - lastChange < 12000 || [...peers.values()].some(p => !p.done) || outbox.length;
    kick(document.hidden ? 4000 : busy ? 700 : 2000);
  }

  // ---------- actions ----------
  function applyMic() { const a = track("audio"); if (a) a.enabled = C.mic; draw(); kick(0); }
  async function setCam(on) {
    if (on) {
      try { const s = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { max: 15 } } }); const v = s.getVideoTracks()[0]; local.getVideoTracks().forEach(t => { t.stop(); local.removeTrack(t); }); local.addTrack(v); }
      catch (e) { toast("The camera could not be started. Check the browser permission."); return; }
    } else local.getVideoTracks().forEach(t => { t.stop(); local.removeTrack(t); });
    C.cam = on;
    peers.forEach(p => p.pc.getTransceivers().forEach(t => { if (t.receiver.track && t.receiver.track.kind === "video") t.sender.replaceTrack(on ? track("video") : null).catch(() => {}); }));
    const v = dock.querySelector(`.tile[data-id="${CSS.escape(myId())}"] video`); if (v) { v.srcObject = null; v.srcObject = local; }
    draw(); kick(0);
  }
  async function join() {
    if (C.joined || C.joining) return;
    C.joining = true; C.mic = true; C.cam = true; C.removed = false;
    local = await getMedia();
    C.joining = false; C.joined = true; first = false; sig = "";
    C.members = [{ id: myId(), name: (window.SRV.me() || {}).name || "", admin: !!(window.SRV.me() || {}).admin, mic: C.mic, cam: C.cam }];
    draw(); kick(0); refresh();
  }
  function stopAll() {
    peers.forEach((p, id) => close(id));
    if (local) local.getTracks().forEach(t => t.stop()); local = null;
    C.joined = false; C.members = []; outbox = []; clearTimeout(timer); dock.innerHTML = ""; dock.hidden = true;
  }
  async function leave() { stopAll(); try { await window.SRV.call("rtc", { room: ROOM, leave: true }); } catch (e) {} refresh(); }
  function removed() { stopAll(); C.removed = true; toast("The teacher removed you from the call."); refresh(); }
  async function admin(action, id) {
    try { await window.SRV.call("rtcAdmin", { room: ROOM, action, id }); toast({ mute: "Microphone muted", muteAll: "Everyone muted", kick: "Removed from the call", allow: "They can join again" }[action] || "Done"); if (action === "allow") C.removedList = C.removedList.filter(x => x !== id); kick(0); refresh(); }
    catch (e) { toast(e.message); }
  }
  dock.addEventListener("click", e => {
    const b = e.target.closest("[data-cc]"); if (!b) return;
    const a = b.dataset.cc;
    if (a === "mic") { if (!track("audio")) { toast("No microphone available. Allow it in the browser and join again."); return; } C.mic = !C.mic; applyMic(); }
    if (a === "cam") setCam(!C.cam);
    if (a === "size") { C.big = !C.big; draw(); }
    if (a === "min") { C.min = !C.min; draw(); }
    if (a === "leave") leave();
  });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-call],[data-callx]"); if (!b) return;
    if (b.dataset.call === "join") join();
    if (b.dataset.call === "leave") leave();
    if (b.dataset.callx) admin(b.dataset.callx, b.dataset.id || "");
  });
  window.addEventListener("pagehide", () => {
    if (!C.joined) return;
    try { fetch((window.API_BASE || "") + "api.php", { method: "POST", keepalive: true, credentials: "same-origin", headers: { "Content-Type": "application/json", "X-Requested-With": "stakeholder-academy" }, body: JSON.stringify({ op: "rtc", room: ROOM, leave: true }) }); } catch (e) {}
  });
  // the teacher sees who was removed even before joining the call
  async function adminPeek() {
    const me = window.SRV.me(); if (!me || !me.admin || C.joined) return;
    try { const j = await window.SRV.call("rtc", { room: ROOM }); const nsig = JSON.stringify(j.members) + (j.removed || []).join(); C.removedList = j.removed || []; C.members = j.members; if (nsig !== sig) { sig = nsig; refresh(); } } catch (e) {}
  }
  setInterval(() => { if (window.SA && window.SA.S && window.SA.S.route === "live") adminPeek(); }, 5000);
  window.CALL = { state: () => ({ joined: C.joined, members: C.members, removed: C.removed, removedList: C.removedList, mic: C.mic, peers: [...peers].map(([id, p]) => [id, p.pc.connectionState]) }), join, leave, admin };
})();
