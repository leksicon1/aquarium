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
  const media = `<img class="media" src="/hero.jpg" loading="lazy" alt="A coral reef full of fish, shown running across three monitors">`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ultra Aquarium: one aquarium across all your screens</title>
<meta name="description" content="A free 3D aquarium for Windows. Screensaver and live wallpaper that treats two, three or four monitors as one tank.">
<link rel="canonical" href="https://aquarium.technology83.com/">
<meta property="og:type" content="website"><meta property="og:url" content="https://aquarium.technology83.com/">
<meta property="og:title" content="Ultra Aquarium: one aquarium across all your screens">
<meta property="og:description" content="A free 3D aquarium screensaver and live wallpaper for Windows that treats two, three or four monitors as one tank.">
<meta property="og:image" content="https://aquarium.technology83.com/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Ultra Aquarium","applicationCategory":"MultimediaApplication","operatingSystem":"Windows 10, Windows 11","description":"A free 3D aquarium screensaver and live wallpaper for Windows that runs as one tank across multiple monitors.","url":"https://aquarium.technology83.com/","image":"https://aquarium.technology83.com/og.jpg","softwareVersion":"${v}","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"author":{"@type":"Organization","name":"Technology 83 Systems Ltd."}}</script>
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
/* the video is the app itself, recorded at 60 frames a second, shown whole with only a soft shade behind the headline */
.hero{position:relative;background:var(--abyss)}
.hero video{display:block;width:100%;aspect-ratio:16/9;max-height:100vh;object-fit:contain;background:var(--abyss)}
.hero .shade{position:absolute;left:0;right:0;bottom:0;height:46%;background:linear-gradient(180deg,rgba(5,11,24,0),rgba(5,11,24,.78) 62%,var(--abyss));pointer-events:none}
.hero .say{position:absolute;left:0;right:0;bottom:0;padding-bottom:30px;text-shadow:0 1px 14px rgba(3,8,18,.9)}
.hero .say h1{margin-top:0}
.hero .get{margin-bottom:0}
@media (max-width:820px){.hero .shade{display:none}.hero .say{position:static;padding:22px 0 0;text-shadow:none}}
header.top{position:absolute;top:0;left:50%;transform:translateX(-50%);z-index:2;display:flex;align-items:center;gap:12px;padding:16px 46px 26px;white-space:nowrap;text-shadow:0 1px 10px rgba(3,8,18,.9);background:radial-gradient(ellipse at 50% 40%,rgba(5,11,24,.62),rgba(5,11,24,.3) 45%,rgba(5,11,24,0) 70%)}
.feat{border-top:1px solid var(--line);padding:44px 0 6px}
.feat>h2{font-family:Michroma,"Segoe UI",sans-serif;font-weight:400;font-size:clamp(20px,2.6vw,28px);margin:0 0 30px}
.f{display:grid;grid-template-columns:1.25fr 1fr;gap:34px;align-items:center;margin:0 0 46px}
.f:nth-of-type(even) img{order:2}
.f img{width:100%;height:auto;border-radius:8px;display:block}
.f h3{font-size:21px;color:#fff;margin:0 0 8px}
.f p{margin:0;color:#a9c2e0}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}
@media (max-width:760px){.f{grid-template-columns:1fr;gap:14px}.f:nth-of-type(even) img,.f:nth-of-type(even) .pair{order:0}}
.f:nth-of-type(even) .pair{order:2}
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
.wallwrap{padding-top:34px}
.hero .meta{color:#c4d8f0}
@media (max-width:820px){header.top{padding:8px 26px 14px;gap:8px}header.top img{width:26px;height:26px}.name{font-size:11px}.name small{font-size:9.5px}}
</style></head><body>
<section class="hero">
<header class="top"><img src="/icon.png" alt=""><div class="name">Ultra Aquarium<small>by Technology 83</small></div></header>
<video id="bg" muted loop playsinline preload="none" poster="/hero-poster.jpg" aria-label="Ultra Aquarium running, recorded at 60 frames per second"></video>
<div class="shade"></div>
<div class="say"><div class="wrap">
<h1>One aquarium across all your screens.</h1>
<div class="get">${rel ? `<a class="btn" href="/download">Download for Windows</a><span class="meta">Free. Version ${v}, ${mb} MB. Windows 10 or 11, 64-bit.</span>` : `<span class="meta">The download will be here shortly.</span>`}</div>
</div></div>
</section>
<div class="wrap wallwrap"><main>
<p class="lead">Ultra Aquarium is a free 3D aquarium for Windows. It runs as your screensaver or as live wallpaper, and it treats two, three or four monitors as a single tank, so a shark can cross from one screen to the next. The video above is the app itself, recorded at 60 frames a second.</p>

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
<section class="feat">
<h2>What's in the tank</h2>
<div class="f"><img src="/f-manta.jpg" loading="lazy" width="1120" height="630" alt="A manta ray gliding over the reef"><div><h3>Visitors drop by</h3><p>Every so often something big swims through: a manta ray, a shark, a sea turtle, a whale in the distance, or a bait ball that the reef fish scatter around. You choose which ones can show up and how often. On several monitors they cross from one screen to the next.</p></div></div>
<div class="f"><img src="/f-feed.jpg" loading="lazy" width="1120" height="630" alt="Fish gathering at the surface around falling food"><div><h3>Feed the fish</h3><p>Press F and food drops in from the surface. The nearest fish break off and come to eat. Keep pressing and more of them join in. The key is yours to change.</p></div></div>
<div class="f"><div class="pair"><img src="/f-dusk.jpg" loading="lazy" width="1120" height="630" alt="The reef in warm evening light"><img src="/f-night.jpg" loading="lazy" width="1120" height="630" alt="The reef at night with glowing coral"></div><div><h3>It follows your day</h3><p>The light in the tank tracks the clock on your PC. Mornings are bright, evenings turn warm, and at night the water goes dark and the coral glows. You can also pin it to one time of day.</p></div></div>
<div class="f"><div class="pair"><img src="/f-settings.jpg" loading="lazy" alt="The My Fish page in settings, with sliders for a fish called Sunset Tang"><img src="/f-myfish.jpg" loading="lazy" width="1120" height="630" alt="Custom striped fish swimming with the others"></div><div><h3>Design your own fish</h3><p>Name a fish, set its length, body shape, colours and pattern, and decide how many there are and whether they school or glow at night. They join the reef beside the built-in species.</p></div></div>
<div class="f"><img src="/f-clock.jpg" loading="lazy" width="1120" height="630" alt="The aquarium with a small clock in the top corner"><div><h3>A clock and your own words</h3><p>Put a clock in a corner, in the font and size you like. You can also give the tank a line of text: written in the sand, or spelled out by a school of fish that gathers into the letters and drifts apart again.</p></div></div>
<div class="f"><img src="/f-turtle.jpg" loading="lazy" width="1120" height="630" alt="A sea turtle swimming above the reef"><div><h3>Screensaver, wallpaper, or both</h3><p>Run it as the Windows screensaver, as live wallpaper behind your icons, or full screen whenever you want to watch. Ten quality levels go from integrated graphics up to a gaming card, and an optional readout shows the frame rate.</p></div></div>
</section>
</main>
<footer>© 2026 Technology 83 Systems Ltd. · <a href="https://github.com/leksicon1/aquarium">Source and release history on GitHub</a></footer>
</div>
<script>
// The backdrop video starts only after the page itself has loaded, in a size that suits the screen.
// On a slow or data-saving connection, or when the visitor prefers less motion, the still picture stays.
addEventListener("load", function () {
  var v = document.getElementById("bg"), c = navigator.connection || {};
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches || c.saveData || /(^|-)2g/.test(c.effectiveType || "");
  if (!v || still) return;
  // phones get the 720p file; larger screens get 1080p, as AV1 where the browser can play it (sharper at the same size)
  var px = Math.min(innerWidth, screen.width) * Math.min(devicePixelRatio || 1, 2);
  var av1 = v.canPlayType('video/mp4; codecs="av01.0.09M.08"') === "probably";
  v.src = px <= 900 ? "/hero-720.mp4" : av1 ? "/hero-1080-av1.mp4" : "/hero-1080.mp4";
  // if the chosen file fails for any reason, fall back to the plain H.264 one
  v.addEventListener("error", function () { if (!/hero-1080\.mp4$/.test(v.src) && px > 900) { v.src = "/hero-1080.mp4"; v.play().catch(function () {}); } }, { once: true });
  var p = v.play(); if (p && p.catch) p.catch(function () {});
});
</script>
</body></html>`;
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
