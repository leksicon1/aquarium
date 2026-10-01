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
  const mb = rel ? (rel.size / 1048576).toFixed(0) : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Reef Aquarium — a living reef for your Windows desktop</title>
<meta name="description" content="A 3D coral reef screensaver and live wallpaper for Windows, across every screen you own. By Technology 83.">
<style>${base}
.hero{position:relative;min-height:78vh;display:flex;align-items:flex-end;background:#04101a url(/hero.jpg) center/cover no-repeat}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,19,28,.05) 30%,rgba(6,19,28,.92) 88%,var(--bg))}
.in{position:relative;z-index:1;width:100%;max-width:1040px;margin:0 auto;padding:0 20px 44px}
.brand{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700}
h1{font-size:clamp(34px,6vw,64px);line-height:1.04;margin:10px 0 14px;font-weight:700;letter-spacing:-.01em;text-wrap:balance}
.lead{font-size:clamp(17px,2.2vw,21px);color:#cfe1e8;max-width:36em;margin:0 0 26px}
.cta{display:flex;flex-wrap:wrap;gap:14px;align-items:center}
.cta .btn{font-size:18px;padding:15px 30px}
.meta{color:var(--sub);font-size:14px}
main{max-width:1040px;margin:0 auto;padding:34px 20px 70px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:26px 34px}
h2{font-size:17px;margin:0 0 4px}
.grid p{margin:0;color:var(--sub);font-size:15px}
.fine{margin-top:44px;padding-top:22px;border-top:1px solid var(--line);color:var(--sub);font-size:14px;max-width:62em}
.fine h2{color:var(--text);font-size:15px;margin-top:16px}
footer{color:var(--sub);font-size:13px;padding:0 20px 34px;max-width:1040px;margin:0 auto}
</style></head><body>
<header class="hero"><div class="in">
<div class="brand">Technology 83</div>
<h1>Reef Aquarium</h1>
<p class="lead">A living 3D coral reef for your Windows desktop. Run it as a screensaver or as a live wallpaper, across every screen you own.</p>
<div class="cta">${rel ? `<a class="btn" href="/download">Download for Windows</a><span class="meta">Version ${v} · ${mb} MB · Windows 10 and 11, 64-bit</span>` : `<span class="meta">The download will be here shortly.</span>`}</div>
</div></header>
<main>
<div class="grid">
<div><h2>Real 3D fish</h2><p>Schools that bend, bank and catch the light, with a turtle, a shark or a manta ray gliding through now and then.</p></div>
<div><h2>Every screen at once</h2><p>One reef spanning all your monitors, or only the ones you pick.</p></div>
<div><h2>Light on your computer</h2><p>Starts at full resolution on the lightest setting. A quality slider and separate shadow, resolution and fish controls let you tune it.</p></div>
<div><h2>Make it yours</h2><p>Design your own fish, add a clock, and let a school of fish swim through your own words.</p></div>
</div>
<div class="fine">
<h2>How to install</h2>
Unzip the download anywhere you like and open <b>ReefAquarium.exe</b>. Windows may ask you to install the free .NET 8 Desktop Runtime the first time. The app checks this site for new versions and offers to update itself.
<h2>What the app sends</h2>
When it checks for updates the app tells this site its version; the country is worked out from the connection. With "Share anonymous usage" on (you can switch it off under About), it also sends a random install number, your Windows version, graphics card, screen sizes and which features and settings are in use. It never sends your name, email, files, or anything you type.
</div>
</main>
<footer>© 2026 Technology 83 Systems Ltd.</footer>
</body></html>`;
}

export function adminPage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Reef Aquarium — developer area</title>
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
  <div class="top"><h1>Reef Aquarium · developer area</h1><button class="ghost" id="out">Sign out</button></div>
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
