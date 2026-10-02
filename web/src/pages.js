const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const base = `
:root{--bg:#06131c;--panel:#0d2230;--line:#1d3c4f;--text:#e6f1f5;--sub:#8fa8b6;--accent:#2ec4b6;--ink:#04201e}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.55 "Segoe UI",system-ui,-apple-system,sans-serif}
a{color:var(--accent)}
button,.btn{font:inherit;font-weight:600;border:0;border-radius:10px;padding:12px 22px;background:var(--accent);color:var(--ink);cursor:pointer;text-decoration:none;display:inline-block}
button.ghost{background:transparent;color:var(--text);border:1px solid var(--line)}
button:focus-visible,.btn:focus-visible,textarea:focus-visible,input:focus-visible{outline:2px solid #fff;outline-offset:2px}
`;

export function page(rel) {
  const v = rel ? esc(rel.version) : "";
  const mb = rel ? Math.round(rel.size / 1048576) : "";
  const media = rel && rel.video
    ? `<video class="media" autoplay muted loop playsinline poster="/hero.jpg"><source src="${esc(rel.video)}" type="video/mp4"></video>`
    : `<img class="media" src="/hero.jpg" alt="A coral reef full of fish, shown running across three monitors">`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ultra Aquarium: one aquarium across all your screens</title>
<meta name="description" content="A free 3D aquarium for Windows. Screensaver and live wallpaper that treats two, three or four monitors as one tank.">
<meta property="og:title" content="Ultra Aquarium"><meta property="og:image" content="/logo.jpg">
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Michroma&display=swap" rel="stylesheet">
<style>
:root{--abyss:#050b18;--deep:#0a1830;--line:#16305a;--electric:#1fa3ff;--ice:#d9ecff;--mute:#8aa6c8;--koi:#ff8a2a}
*{box-sizing:border-box}
html{background:var(--abyss)}
body{margin:0;color:var(--ice);font:17px/1.6 Manrope,"Segoe UI",system-ui,sans-serif}
a{color:var(--electric)}
.wrap{max-width:1120px;margin:0 auto;padding:0 22px}
header.top{display:flex;align-items:center;gap:12px;padding:20px 0}
header.top img{width:40px;height:40px}
.name{font-family:Michroma,"Segoe UI",sans-serif;font-size:15px;letter-spacing:.06em}
.name small{display:block;font:600 12px Manrope,sans-serif;color:var(--mute);letter-spacing:0}
h1{font-family:Michroma,"Segoe UI",sans-serif;font-weight:400;font-size:clamp(26px,4.6vw,50px);line-height:1.16;margin:26px 0 16px;max-width:17em;text-wrap:balance}
.lead{font-size:clamp(17px,1.9vw,20px);color:#bcd3ee;max-width:38em;margin:0 0 26px}
.get{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px;margin-bottom:38px}
.btn{display:inline-block;background:var(--koi);color:#1c0c00;font-weight:700;font-size:18px;text-decoration:none;padding:15px 28px;border-radius:8px}
.btn:hover{background:#ffa04f}
.btn:focus-visible,a:focus-visible{outline:2px solid #fff;outline-offset:3px}
.meta{color:var(--mute);font-size:15px}
/* the wall: one picture running across three monitors, the way the app shows it */
.wall{position:relative;aspect-ratio:48/9;border-radius:10px;overflow:hidden;background:#000}
.wall .media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.wall i{position:absolute;top:0;bottom:0;width:1.1%;background:var(--abyss)}
.wall i:nth-of-type(1){left:32.78%}.wall i:nth-of-type(2){left:66.11%}
.wall b{position:absolute;inset:0;border:3px solid #0e1626;border-radius:10px;pointer-events:none}
.feet{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1%;margin:0 0 54px}
.feet span{justify-self:center;width:22%;height:14px;background:linear-gradient(#0e1626,#0a1220);border-radius:0 0 8px 8px}
.points{display:grid;grid-template-columns:repeat(4,1fr);gap:30px 36px;margin:0 0 56px}
@media (max-width:980px){.points{grid-template-columns:repeat(2,1fr)}}
@media (max-width:520px){.points{grid-template-columns:1fr}}
.points h2{font-size:18px;font-weight:700;margin:0 0 4px;color:#fff}
.points p{margin:0;color:#a9c2e0;font-size:16px}
.plain{border-top:1px solid var(--line);padding:30px 0 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:26px 44px;color:#a9c2e0;font-size:15.5px}
.plain h2{font-size:16px;color:#fff;margin:0 0 6px}
.plain p{margin:0}
footer{color:var(--mute);font-size:13.5px;padding:34px 0 40px}
@media (max-width:640px){.wall{aspect-ratio:16/9}.wall i{display:none}.feet{display:none}.wall{margin-bottom:40px}}
</style></head><body><div class="wrap">
<header class="top"><img src="/icon.png" alt=""><div class="name">Ultra Aquarium<small>by Technology 83</small></div></header>
<main>
<h1>One aquarium across all your screens.</h1>
<p class="lead">Ultra Aquarium is a free 3D aquarium for Windows. It runs as your screensaver or as live wallpaper, and it treats two, three or four monitors as a single tank, so a shark can cross from one screen to the next.</p>
<div class="get">${rel ? `<a class="btn" href="/download">Download for Windows</a><span class="meta">Free. Version ${v}, ${mb} MB. Windows 10 or 11, 64-bit.</span>` : `<span class="meta">The download will be here shortly.</span>`}</div>
<div class="wall">${media}<i></i><i></i><b></b></div>
<div class="feet"><span></span><span></span><span></span></div>
<div class="points">
<div><h2>Pick your screens</h2><p>Choose which monitors show the aquarium. The others keep your desktop, or go black while the screensaver runs.</p></div>
<div><h2>Mixed setups are fine</h2><p>Different sizes, resolutions and refresh rates work together. Enter your bezel width and the picture lines up across the gap.</p></div>
<div><h2>Feed the fish</h2><p>Press F and a pinch of food drops in from the surface. The nearest fish come over to eat.</p></div>
<div><h2>Runs on a laptop</h2><p>The lowest quality setting is built for integrated graphics. Turn it up when you have the hardware.</p></div>
</div>
<div class="plain">
<div><h2>Installing</h2><p>Run the installer and Ultra Aquarium opens when it finishes. If Windows asks for the .NET 8 Desktop Runtime, say yes: it is a free Microsoft component that many apps share. When a new version is out, the app asks before updating.</p></div>
</div>
</main>
<footer>© 2026 Technology 83 Systems Ltd.</footer>
</div></body></html>`;
}

export function adminPage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Ultra Aquarium developer area</title>
<style>${base}
main{max-width:1100px;margin:0 auto;padding:26px 16px 80px}
h1{font-size:24px;margin:0}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:22px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px;margin-bottom:20px}
h2{font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin:0 0 12px}
label{display:block;color:var(--sub);font-size:14px;margin-bottom:6px}
textarea,input{width:100%;font:inherit;color:var(--text);background:#081a25;border:1px solid var(--line);border-radius:10px;padding:12px}
textarea{min-height:130px;resize:vertical}
.row{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:12px}
.sub{color:var(--sub);font-size:14px}
.ok{color:var(--accent)}.err{color:#ffaa50}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.tile{background:#081a25;border:1px solid var(--line);border-radius:12px;padding:14px}
.tile b{display:block;font-size:28px;font-variant-numeric:tabular-nums;line-height:1.1}
.tile span{color:var(--sub);font-size:13px}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.scroll{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:14px}
th{text-align:left;color:var(--sub);font-weight:600;padding:6px 10px 6px 0;border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:6px 10px 6px 0;border-bottom:1px solid #132c3a;vertical-align:top}
td:first-child{white-space:nowrap}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}
.preview{background:#06131c;border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:10px;padding:12px 14px;white-space:pre-wrap;min-height:48px}
.login{max-width:420px;margin:12vh auto 0}
[hidden]{display:none!important}
</style></head><body><main>
<section id="login" class="card login" hidden>
  <h1 id="loginTitle">Developer area</h1>
  <p class="sub" id="loginHelp"></p>
  <form id="loginForm"><label for="pw">Password</label><input id="pw" type="password" autocomplete="current-password" required>
  <div class="row"><button type="submit" id="loginBtn">Sign in</button><span id="loginMsg" class="err" role="status"></span></div></form>
</section>
<div id="app" hidden>
  <div class="top"><h1>Ultra Aquarium developer area</h1><button class="ghost" id="out">Sign out</button></div>
  <section class="card">
    <h2>Note shown on the app's Home page</h2>
    <label for="note">Everyone sees this the next time their app checks in (at most a day later; straight away when they open Settings). Leave it empty to show nothing.</label>
    <textarea id="note" maxlength="600"></textarea>
    <div class="row"><button id="save">Publish note</button><span class="sub"><span id="count">0</span> / 600</span><span id="saveMsg" class="ok" role="status"></span></div>
    <p class="sub" style="margin:16px 0 6px">How it looks in the app</p>
    <div class="preview" id="preview"></div>
    <p class="sub" id="noteWhen"></p>
  </section>
  <section class="card"><h2>At a glance</h2><div class="tiles" id="tiles"></div><p class="sub" id="relInfo" style="margin-bottom:0"></p></section>
  <div class="cols">
    <section class="card"><h2>Daily use, last 30 days</h2><div class="scroll" id="daily"></div></section>
    <section class="card"><h2>Downloads per day</h2><div class="scroll" id="dlDaily"></div></section>
    <section class="card"><h2>Versions in use</h2><div class="scroll" id="versions"></div></section>
    <section class="card"><h2>Countries</h2><div class="scroll" id="countries"></div></section>
    <section class="card"><h2>What people run, last 30 days</h2><div class="scroll" id="modes"></div></section>
    <section class="card"><h2>Quality level chosen</h2><div class="scroll" id="quality"></div></section>
    <section class="card"><h2>Graphics cards</h2><div class="scroll" id="gpus"></div></section>
  </div>
  <section class="card"><h2>Latest downloads</h2><div class="scroll" id="downloads"></div></section>
  <section class="card"><h2>Recently active installs</h2><div class="scroll" id="recent"></div></section>
</div>
</main>
<script>
const $ = (id) => document.getElementById(id);
const api = (path, body) => fetch(path, body ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : {}).then(async (r) => ({ ok: r.ok, data: await r.json().catch(() => ({})) }));
let setup = false;
function table(el, cols, rows) {
  const t = document.createElement("table"), hr = t.insertRow();
  for (const c of cols) { const th = document.createElement("th"); th.textContent = c[0]; if (c[2]) th.className = "n"; hr.appendChild(th); }
  for (const r of rows) { const tr = t.insertRow(); for (const c of cols) { const td = tr.insertCell(); const v = typeof c[1] === "function" ? c[1](r) : r[c[1]]; td.textContent = v == null || v === "" ? "—" : v; if (c[2]) td.className = "n"; } }
  el.replaceChildren(rows.length ? t : Object.assign(document.createElement("p"), { className: "sub", textContent: "Nothing yet." }));
}
const when = (s) => s ? new Date(s).toLocaleString() : "";
async function load() {
  const { ok, data } = await api("/admin/data");
  if (!ok) return boot();
  $("note").value = data.note.text; sync();
  $("noteWhen").textContent = data.note.updated ? "Last published " + when(data.note.updated) : "No note published yet.";
  const t = data.totals;
  const tiles = [["Installs sharing usage", t.installs], ["Active in 7 days", t.active7], ["Active in 30 days", t.active30], ["Check-ins today (everyone)", t.checksToday], ["Downloads", t.downloads], ["Different downloaders", t.downloaders]];
  $("tiles").replaceChildren(...tiles.map(([k, v]) => { const d = document.createElement("div"); d.className = "tile"; const b = document.createElement("b"); b.textContent = v ?? 0; const s = document.createElement("span"); s.textContent = k; d.append(b, s); return d; }));
  $("relInfo").textContent = data.release ? "Published version: " + data.release.version + " (" + (data.release.size / 1048576).toFixed(1) + " MB)" : "No release published yet.";
  table($("daily"), [["Day", "day"], ["All check-ins", "checks", 1], ["Sharing usage", "known", 1]], data.daily);
  table($("dlDaily"), [["Day", "day"], ["Downloads", "n", 1]], data.dlDaily);
  table($("versions"), [["Version", "version"], ["Installs", "n", 1]], data.versions);
  table($("countries"), [["Country", "country"], ["Installs", "n", 1]], data.countries);
  table($("modes"), [["Feature", "kind"], ["Times", "n", 1], ["People", "people", 1]], data.modes);
  table($("quality"), [["Quality", "q"], ["People", "people", 1]], data.quality);
  table($("gpus"), [["Graphics card", "gpu"], ["Installs", "n", 1]], data.gpus);
  table($("downloads"), [["When", (r) => when(r.ts)], ["Version", "version"], ["Country", "country"], ["City", "city"], ["Visitor", "visitor"], ["Came from", "ref"], ["Browser", "ua"]], data.downloads);
  table($("recent"), [["Install", (r) => r.id.slice(0, 8)], ["Last seen", (r) => when(r.last_seen)], ["First seen", (r) => when(r.first_seen)], ["Version", "version"], ["Country", "country"], ["Windows", "os"], ["Graphics card", "gpu"], ["Screens", "screens"], ["Check-ins", "pings", 1]], data.recent);
}
function sync() { $("count").textContent = $("note").value.length; $("preview").textContent = $("note").value || "(nothing shown)"; }
async function boot() {
  const { data } = await api("/admin/state");
  setup = !!data.setup;
  $("login").hidden = !!data.signedIn; $("app").hidden = !data.signedIn;
  if (data.signedIn) return load();
  $("loginTitle").textContent = setup ? "Choose your password" : "Developer area";
  $("loginHelp").textContent = setup ? "Nobody has claimed this area yet. Choose a password of at least 10 characters; it is the only way in." : "Sign in to edit the note and see usage.";
  $("loginBtn").textContent = setup ? "Set password" : "Sign in";
  $("pw").autocomplete = setup ? "new-password" : "current-password";
}
$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); $("loginMsg").textContent = "";
  const { ok, data } = await api("/admin/login", { password: $("pw").value });
  if (!ok) { $("loginMsg").textContent = data.error || "Could not sign in."; return; }
  $("pw").value = ""; boot();
});
$("note").addEventListener("input", sync);
$("save").addEventListener("click", async () => {
  $("saveMsg").textContent = "";
  const { ok, data } = await api("/admin/note", { text: $("note").value });
  $("saveMsg").className = ok ? "ok" : "err";
  $("saveMsg").textContent = ok ? "Published." : (data.error || "Could not save.");
  if (ok) { $("note").value = data.note.text; sync(); $("noteWhen").textContent = "Last published " + when(data.note.updated); }
});
$("out").addEventListener("click", async () => { await api("/admin/logout", {}); boot(); });
boot();
</script></body></html>`;
}
