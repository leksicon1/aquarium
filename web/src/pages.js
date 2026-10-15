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
  const prev = (rel && rel.previous) || [];
  const media = `<img class="media" src="/hero.jpg" loading="lazy" alt="A coral reef full of fish, shown running across three monitors">`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ultra Aquarium: the free 3D aquarium screensaver for Windows</title>
<meta name="description" content="A free 3D aquarium screensaver and live wallpaper for Windows. One living reef across all your monitors, now with Octopus Boy.">
<link rel="canonical" href="https://aquarium.technology83.com/">
<meta property="og:type" content="website"><meta property="og:url" content="https://aquarium.technology83.com/">
<meta property="og:title" content="Ultra Aquarium: one aquarium across all your screens">
<meta property="og:description" content="A free 3D aquarium screensaver and live wallpaper for Windows that treats two, three or four monitors as one tank.">
<meta property="og:image" content="https://aquarium.technology83.com/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Ultra Aquarium","applicationCategory":"MultimediaApplication","operatingSystem":"Windows 10, Windows 11","description":"A free 3D aquarium screensaver and live wallpaper for Windows that runs as one tank across multiple monitors.","url":"https://aquarium.technology83.com/","image":"https://aquarium.technology83.com/og.jpg","softwareVersion":"${v}","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"author":{"@type":"Organization","name":"Technology 83 Systems Ltd."}}</script>
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Michroma&family=Bangers&display=swap" rel="stylesheet">
<style>
:root{--abyss:#050b18;--deep:#0a1830;--line:#16305a;--electric:#1fa3ff;--ice:#d9ecff;--mute:#8aa6c8;--koi:#ff8a2a}
*{box-sizing:border-box}
html{background:var(--abyss)}
body{margin:0;color:var(--ice);font:17px/1.6 Manrope,"Segoe UI",system-ui,sans-serif}
a{color:var(--electric)}
.wrap{max-width:1120px;margin:0 auto;padding:0 22px}
/* the picture viewer: opens over the page, pictures fade in and slide as you browse */
.lb{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;background:rgba(3,8,16,.94);opacity:0;visibility:hidden;transition:opacity .35s ease,visibility 0s linear .35s;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.lb.on{opacity:1;visibility:visible;transition:opacity .35s ease}
.lb .stage{position:relative;width:min(92vw,calc(82vh*16/9));aspect-ratio:16/9;overflow:hidden;border-radius:10px;box-shadow:0 30px 90px rgba(0,0,0,.6)}
.lb .slide{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#020509;opacity:0;transform:translateX(0) scale(.98);transition:opacity .45s ease,transform .55s cubic-bezier(.2,.75,.2,1)}
.lb .slide.in{opacity:1;transform:none}
.lb .slide.from-r{transform:translateX(9%)}.lb .slide.from-l{transform:translateX(-9%)}
.lb .slide.out-l{opacity:0;transform:translateX(-9%)}.lb .slide.out-r{opacity:0;transform:translateX(9%)}
.lb .cap{position:absolute;left:0;right:0;bottom:max(18px,calc((100vh - 82vh)/2 - 46px));text-align:center;color:#d9ecff;font-size:15px;letter-spacing:.01em;pointer-events:none}
.lb .cap b{color:var(--mute);font-weight:600;margin-left:10px}
.lb button{position:absolute;border:0;background:rgba(255,255,255,.08);color:#fff;width:52px;height:52px;border-radius:50%;font-size:26px;line-height:52px;cursor:pointer;transition:background .2s;padding:0}
.lb button:hover{background:rgba(255,255,255,.18)}
.lb .prev{left:max(12px,2vw)}.lb .next{right:max(12px,2vw)}
.lb .x{top:16px;right:16px;width:44px;height:44px;line-height:44px;font-size:22px}
@media (max-width:700px){.lb .stage{width:100vw;border-radius:0}.lb .prev,.lb .next{top:auto;bottom:22px}.lb .cap{bottom:90px}}
@media (prefers-reduced-motion:reduce){.lb,.lb .slide{transition:none}}
.grid a{cursor:zoom-in}
/* three monitors on a desk, the reef running across them */
.multi{padding:8px 0 10px;overflow-x:clip}
.desk{position:relative;margin:6px auto 34px;max-width:1080px;padding-bottom:30px}
.mons{display:flex;justify-content:center;align-items:flex-end;position:relative;z-index:1;perspective:1300px;perspective-origin:50% 40%}
.mon{width:32.4%;position:relative}
.m1{transform:rotateY(28deg);transform-origin:100% 50%}
.m3{transform:rotateY(-28deg);transform-origin:0 50%}
.bz{background:linear-gradient(#171c23,#0a0d11);border-radius:9px;padding:1.4% 1.4% 2.2%;box-shadow:0 0 0 1px #262f3b inset,0 22px 50px rgba(0,0,0,.55),0 0 70px rgba(31,163,255,.10)}
.sc{aspect-ratio:16/9;background:#06101c url(/hero.jpg) no-repeat;background-size:300% 100%;border-radius:2px;position:relative;overflow:hidden}
.m1 .sc{background-position:0 0}.m2 .sc{background-position:50% 0}.m3 .sc{background-position:100% 0}
.sc::after{content:"";position:absolute;inset:0;background:linear-gradient(118deg,rgba(255,255,255,.09),rgba(255,255,255,0) 38%)}
.neck{width:8%;height:38px;margin:0 auto;background:linear-gradient(90deg,#0d1117,#232c37 50%,#0d1117)}
.base{width:34%;height:8px;margin:0 auto;border-radius:5px 5px 2px 2px;background:linear-gradient(#2a3441,#0e131a);box-shadow:0 6px 14px rgba(0,0,0,.6)}
.table{position:absolute;left:-6%;right:-6%;bottom:-62px;height:150px;transform:perspective(700px) rotateX(62deg);transform-origin:50% 0;border-radius:14px;background:radial-gradient(ellipse 60% 70% at 50% 0,rgba(60,170,255,.28),rgba(60,170,255,0) 70%),linear-gradient(#1d2733,#0b1018 85%);box-shadow:0 -1px 0 #2b3746 inset}
.desk::after{content:"";position:absolute;left:8%;right:8%;bottom:-80px;height:60px;background:radial-gradient(ellipse at 50% 0,rgba(0,0,0,.55),rgba(0,0,0,0) 70%);z-index:-1}
.multi h2,.also h2,.gal>h2,.feat>h2,.story2 h2,.older h2{font-family:Michroma,"Segoe UI",sans-serif;font-weight:400;font-size:clamp(20px,2.6vw,28px);margin:0 0 10px}
.multi-sub{color:#bcd3ee;max-width:42em;margin:0 0 28px}
.points h3{font-size:18px;font-weight:700;margin:0 0 4px;color:#fff}
@media (max-width:640px){.m1{transform:rotateY(18deg)}.m3{transform:rotateY(-18deg)}.table{bottom:-40px;height:90px}.neck{height:18px}.bz{border-radius:5px}}
.also{border-top:1px solid var(--line);padding:40px 0 16px}
.also ul{margin:0;padding:0 0 0 1.1em;columns:2 340px;column-gap:48px;color:#d4e4f5;font-size:17px}
.also li{margin:0 0 12px;break-inside:avoid}
.also li::marker{color:var(--electric)}
.story2{border-top:1px solid var(--line);padding:40px 0 14px;display:grid;grid-template-columns:1fr 1fr;gap:28px 56px}
.story2 p{color:#c3d6ec;margin:0 0 12px;font-size:17px}
@media (max-width:820px){.story2{grid-template-columns:1fr}}
.older{border-top:1px solid var(--line);padding:34px 0 10px;color:#a9c2e0;font-size:15.5px}
/* Octopus Boy: a 90s comic splash */
.ob{position:relative;margin:46px 0 10px;padding:46px 34px 40px;border:4px solid #000;border-radius:6px;overflow:hidden;color:#111;
background:radial-gradient(circle,rgba(255,255,255,.22) 1.6px,transparent 1.8px) 0 0/12px 12px,linear-gradient(135deg,#ff2e88 0%,#ff7a1a 45%,#ffd23a 100%);box-shadow:10px 10px 0 #000}
.ob::before{content:"";position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 18% 30%,rgba(255,255,255,.13) 0 6deg,transparent 6deg 18deg);pointer-events:none}
.ob>*{position:relative}
.ob .burst{position:absolute;top:18px;right:22px;width:150px;height:150px;transform:rotate(12deg);z-index:2}
.ob .burst svg{width:100%;height:100%;display:block;filter:drop-shadow(4px 4px 0 #000)}
.ob .kicker{font:28px/1 Bangers,Impact,sans-serif;letter-spacing:.06em;color:#fff;-webkit-text-stroke:1.5px #000;text-shadow:3px 3px 0 #000;margin:0 0 6px;transform:rotate(-2deg);display:inline-block}
.ob h2{font:clamp(54px,9vw,112px)/.9 Bangers,Impact,sans-serif;letter-spacing:.03em;margin:0 0 18px;color:#2ef2ff;-webkit-text-stroke:3px #000;text-shadow:6px 6px 0 #000,10px 10px 0 #ff2e88;transform:rotate(-3deg);transform-origin:left}
.ob .story{max-width:40em;background:#fffbe6;border:3px solid #000;box-shadow:5px 5px 0 #000;padding:14px 18px;font:600 16.5px/1.55 Manrope,sans-serif;margin:0 0 26px}
.ob .panels{display:grid;grid-template-columns:1.6fr 1fr 1fr;grid-auto-rows:auto;gap:16px}
.ob .p{position:relative;background:#000;border:4px solid #000;box-shadow:6px 6px 0 #000;margin:0}
.ob .p:nth-child(2){transform:rotate(1.2deg)}.ob .p:nth-child(3){transform:rotate(-1.4deg)}.ob .p:nth-child(4){transform:rotate(-.8deg)}.ob .p:nth-child(5){transform:rotate(1deg)}
.ob .p.big{grid-row:span 2}
.ob .p video,.ob .p img{display:block;width:100%;height:100%;object-fit:cover}
.ob .p.big video{aspect-ratio:auto}
.ob .p figcaption{position:absolute;left:-6px;top:-10px;background:#ffe93a;border:3px solid #000;padding:3px 10px;font:19px/1.15 Bangers,Impact,sans-serif;letter-spacing:.04em;color:#000;max-width:85%;transform:rotate(-2deg)}
.ob .p.big figcaption{font-size:24px}
.ob .tip{margin:26px 0 0;font:700 15.5px Manrope,sans-serif;color:#111}
.ob .tip b{background:#000;color:#ffe93a;padding:2px 8px;font-family:Bangers,Impact,sans-serif;font-weight:400;letter-spacing:.06em;font-size:18px}
@media (max-width:820px){.ob{padding:84px 16px 26px;box-shadow:6px 6px 0 #000}.ob .burst{width:84px;height:84px;top:8px;right:10px}.ob h2{font-size:clamp(46px,13vw,64px)}.ob .p figcaption{position:static;display:block;max-width:none;transform:none;font-size:15px;border-width:0 0 3px;margin:0;left:auto;top:auto}.ob .p.big figcaption{font-size:18px}.ob .p{display:flex;flex-direction:column-reverse}.ob .panels{grid-template-columns:1fr 1fr}.ob .p.big{grid-column:1/-1;grid-row:auto}.ob h2{-webkit-text-stroke:2px #000;text-shadow:4px 4px 0 #000,7px 7px 0 #ff2e88}}
@media (prefers-reduced-motion:reduce){.ob .p{transform:none!important}}
.f video{width:100%;height:auto;border-radius:8px;display:block;aspect-ratio:16/9;background:#0a1830}
.f:nth-of-type(even) video{order:2}
@media (max-width:760px){.f:nth-of-type(even) video{order:0}}
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
.new{border-top:1px solid var(--line);padding:44px 0 10px}
.new>h2,.gal>h2,.older>h2{font-family:Michroma,"Segoe UI",sans-serif;font-weight:400;font-size:clamp(20px,2.6vw,28px);margin:0 0 8px}
.new>p.sub{color:var(--mute);margin:0 0 26px}
.new ol{list-style:none;counter-reset:n;padding:0;margin:0 0 30px;display:grid;grid-template-columns:repeat(2,1fr);gap:20px 40px}
.new li{counter-increment:n;position:relative;padding-left:46px}
.new li::before{content:counter(n);position:absolute;left:0;top:2px;width:32px;height:32px;border-radius:50%;background:var(--deep);border:1px solid var(--line);color:var(--electric);font:700 14px/32px Manrope,sans-serif;text-align:center}
.new h3{font-size:17px;color:#fff;margin:0 0 2px}
.new li p{margin:0;color:#a9c2e0;font-size:15.5px}
@media (max-width:760px){.new ol{grid-template-columns:1fr}}
.gal{padding:20px 0 40px}
.gal>p{color:var(--mute);margin:0 0 18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px}
.grid img{width:100%;height:auto;display:block;border-radius:6px;transition:opacity .15s}
.grid a:hover img{opacity:.85}
.wide{margin-top:8px}.wide img{width:100%;height:auto;display:block;border-radius:6px}
.older{border-top:1px solid var(--line);padding:34px 0 10px;color:#a9c2e0;font-size:15.5px}
.older p{margin:0 0 10px;max-width:46em}
</style></head><body>
<section class="hero">
<header class="top"><img src="/icon.png" alt=""><div class="name">Ultra Aquarium<small>by Technology 83</small></div></header>
<video id="bg" muted loop playsinline preload="none" poster="/hero-poster.jpg?v=2" aria-label="Ultra Aquarium running: the reef and Octopus Boy"></video>
<div class="shade"></div>
<div class="say"><div class="wrap">
<h1>The best aquarium screensaver in the world.</h1>
<div class="get">${rel ? `<a class="btn" href="/download" rel="nofollow">Download for Windows</a><span class="meta">Free. Version ${v}, ${mb} MB. Windows 10 or 11, 64-bit. <a href="#new">What's new</a></span>` : `<span class="meta">The download will be here shortly.</span>`}</div>
</div></div>
</section>
<div class="wrap wallwrap"><main>
<p class="lead">Ultra Aquarium is a living 3D reef for your PC. Use it as your screensaver or as live wallpaper. If you have more than one monitor, it spreads across all of them as one big tank, and the fish swim from one screen to the next. It's free.</p>

<section class="multi" aria-labelledby="multi-title">
<div class="desk" role="img" aria-label="Ultra Aquarium running across three monitors on a desk">
<div class="mons">
<div class="mon m1"><div class="bz"><div class="sc"></div></div><div class="neck"></div><div class="base"></div></div>
<div class="mon m2"><div class="bz"><div class="sc"></div></div><div class="neck"></div><div class="base"></div></div>
<div class="mon m3"><div class="bz"><div class="sc"></div></div><div class="neck"></div><div class="base"></div></div>
</div>
<div class="table"></div>
</div>
<h2 id="multi-title">Made for multi-monitor setups</h2>
<p class="multi-sub">Two, three or four screens, different sizes, different refresh rates. It doesn't matter. Tell it how thick your bezels are and the picture lines up across the gaps.</p>
<div class="points">
<div><h3>Pick your screens</h3><p>Choose which monitors get the reef. The rest keep your normal desktop.</p></div>
<div><h3>Feed the fish</h3><p>Press F and food drops in from the surface. Watch them come up for it.</p></div>
<div><h3>Easy on laptops</h3><p>Quality 1 runs on built-in graphics. Quality 10 is for a proper graphics card.</p></div>
<div><h3>Simple settings</h3><p>Pick your screens, pick a quality, hit Launch. Everything else is under Advanced.</p></div>
</div>
</section>

<section class="ob" id="octopus-boy" aria-labelledby="ob-title">
<div class="burst"><svg viewBox="0 0 100 100" aria-hidden="true"><polygon fill="#ffe93a" stroke="#000" stroke-width="3" points="50,2 58,24 80,10 73,34 98,34 78,50 98,66 73,66 80,90 58,76 50,98 42,76 20,90 27,66 2,66 22,50 2,34 27,34 20,10 42,24"/><text x="50" y="47" text-anchor="middle" font-family="Bangers,Impact,sans-serif" font-size="22" fill="#ff2e88" stroke="#000" stroke-width="1">NEW</text><text x="50" y="66" text-anchor="middle" font-family="Bangers,Impact,sans-serif" font-size="13" fill="#000">IN 7.25!</text></svg></div>
<p class="kicker">New in 7.25&hellip;</p>
<h2 id="ob-title">Octopus Boy!</h2>
<p class="story">Meet the newest resident. He lives in a cave under the big rock and pretty much does his own thing. He crawls around on all eight arms, changes colour to blend in with the sand or the rock, and if something spooks him, he's gone in a flash. He comes out more at night.</p>
<div class="panels">
<figure class="p big"><video class="clip" muted loop playsinline preload="none" poster="/clip-octopus.jpg?v=2" data-src="/clip-octopus.mp4?v=2" aria-label="Octopus Boy crawling across the sand"></video><figcaption>Out for a crawl</figcaption></figure>
<figure class="p"><img src="/ob-1.jpg" loading="lazy" width="800" height="450" alt="Octopus Boy stretched out on the sand"><figcaption>All eight arms</figcaption></figure>
<figure class="p"><img src="/ob-2.jpg" loading="lazy" width="800" height="450" alt="Octopus Boy close up beside a rock"><figcaption>Keeping an eye on things</figcaption></figure>
<figure class="p"><img src="/ob-3.jpg" loading="lazy" width="800" height="450" alt="Octopus Boy coloured like the rock beside him"><figcaption>Blending in</figcaption></figure>
<figure class="p"><img src="/ob-4.jpg" loading="lazy" width="800" height="450" alt="Octopus Boy in his cave under the big rock"><figcaption>Home in his cave</figcaption></figure>
</div>
<p class="tip"><b>Follow him:</b> in Settings, switch to Advanced, then pick &ldquo;Follow Octopus Boy&rdquo; under Camera.</p>
</section>

<section class="also" id="new">
<h2>New in 7.25.1</h2>
<ul>
<li>Better fish models: fins look like fins now.</li>
<li>Extra decorations in the tank, like an old diver's helmet half buried in the sand.</li>
<li>Lots of general fixes.</li>
</ul>
</section>

<section class="also" id="new-725">
<h2>Also new in 7.25</h2>
<ul>
<li>Every fish now has real eyes that look around, and a mouth that opens and closes.</li>
<li>Little front fins that flutter, like real fish.</li>
<li>A blue-spotted stingray, starfish, and feather duster worms that duck in when a fish gets close.</li>
<li>The sea turtle and the manta ray were rebuilt from scratch.</li>
<li>A cleaning station where small wrasse pick over the bigger fish.</li>
<li>New cameras: follow the octopus, follow a fish, or take a slow tour of the reef.</li>
<li>A much simpler settings window. Your changes save on their own.</li>
<li>Runs smoother on laptops.</li>
</ul>
</section>

<section class="gal" id="pictures">
<h2>Screenshots</h2>
<p>All taken straight from the app. Click any of them to see it full size.</p>
<div class="grid" id="shots">
<a href="/gallery/diver.jpg" target="_blank" rel="noopener"><img src="/gallery/diver-t.jpg" loading="lazy" width="480" height="270" alt="An old diver's helmet half buried in the sand, bubbling"></a>
<a href="/gallery/reef.jpg" target="_blank" rel="noopener"><img src="/gallery/reef-t.jpg" loading="lazy" width="480" height="270" alt="The reef at midday"></a>
<a href="/gallery/octopus.jpg" target="_blank" rel="noopener"><img src="/gallery/octopus-t.jpg" loading="lazy" width="480" height="270" alt="The octopus crossing the sand"></a>
<a href="/gallery/turtle.jpg" target="_blank" rel="noopener"><img src="/gallery/turtle-t.jpg" loading="lazy" width="480" height="270" alt="The rebuilt sea turtle"></a>
<a href="/gallery/shark-pass.jpg" target="_blank" rel="noopener"><img src="/gallery/shark-pass-t.jpg" loading="lazy" width="480" height="270" alt="The shark passing close"></a>
<a href="/gallery/shark-closeup.jpg" target="_blank" rel="noopener"><img src="/gallery/shark-closeup-t.jpg" loading="lazy" width="480" height="270" alt="The shark's teeth"></a>
<a href="/gallery/manta.jpg" target="_blank" rel="noopener"><img src="/gallery/manta-t.jpg" loading="lazy" width="480" height="270" alt="A manta ray over the reef"></a>
<a href="/gallery/stingray.jpg" target="_blank" rel="noopener"><img src="/gallery/stingray-t.jpg" loading="lazy" width="480" height="270" alt="A blue-spotted stingray"></a>
<a href="/gallery/parrotfish.jpg" target="_blank" rel="noopener"><img src="/gallery/parrotfish-t.jpg" loading="lazy" width="480" height="270" alt="A parrotfish up close"></a>
<a href="/gallery/clownfish.jpg" target="_blank" rel="noopener"><img src="/gallery/clownfish-t.jpg" loading="lazy" width="480" height="270" alt="A clownfish by its anemone"></a>
<a href="/gallery/lionfish.jpg" target="_blank" rel="noopener"><img src="/gallery/lionfish-t.jpg" loading="lazy" width="480" height="270" alt="A lionfish in the shade of a rock"></a>
<a href="/gallery/triggerfish.jpg" target="_blank" rel="noopener"><img src="/gallery/triggerfish-t.jpg" loading="lazy" width="480" height="270" alt="A triggerfish"></a>
<a href="/gallery/emperor.jpg" target="_blank" rel="noopener"><img src="/gallery/emperor-t.jpg" loading="lazy" width="480" height="270" alt="An emperor angelfish"></a>
<a href="/gallery/gramma.jpg" target="_blank" rel="noopener"><img src="/gallery/gramma-t.jpg" loading="lazy" width="480" height="270" alt="A royal gramma"></a>
<a href="/gallery/feeding.jpg" target="_blank" rel="noopener"><img src="/gallery/feeding-t.jpg" loading="lazy" width="480" height="270" alt="Fish coming up for food"></a>
<a href="/gallery/dusk.jpg" target="_blank" rel="noopener"><img src="/gallery/dusk-t.jpg" loading="lazy" width="480" height="270" alt="The reef at dusk"></a>
<a href="/gallery/night.jpg" target="_blank" rel="noopener"><img src="/gallery/night-t.jpg" loading="lazy" width="480" height="270" alt="The reef at night"></a>
</div>
</section>

<section class="feat">
<h2>What's in the tank</h2>
<div class="f"><video class="clip" muted loop playsinline preload="none" poster="/clip-manta.jpg?v=2" data-src="/clip-manta.mp4?v=2" width="1280" height="720" aria-label="A manta ray gliding over the reef"></video><div><h3>Visitors</h3><p>Every so often something big comes through. A manta ray, a shark, a sea turtle, or a whale off in the distance. On a multi-monitor setup they cross from one screen to the next. You can pick which ones show up and how often.</p></div></div>
<div class="f"><img src="/f-feed.jpg" loading="lazy" width="1120" height="630" alt="Fish gathering at the surface around falling food"><div><h3>Feeding time</h3><p>Press F and food sprinkles in from the surface. The closest fish come up to eat, and more join in if you keep feeding. You can change the key if you like.</p></div></div>
<div class="f"><div class="pair"><img src="/f-dusk.jpg" loading="lazy" width="1120" height="630" alt="The reef in warm evening light"><img src="/f-night.jpg" loading="lazy" width="1120" height="630" alt="The reef at night with glowing coral"></div><div><h3>Day and night</h3><p>The light follows the clock on your PC. Bright in the morning, warm in the evening, and at night it gets dark and the coral glows. Or lock it to your favourite time of day.</p></div></div>
<div class="f"><div class="pair"><img src="/f-settings.jpg" loading="lazy" alt="The My Fish page in settings, with sliders for a fish called Sunset Tang"><img src="/f-myfish.jpg" loading="lazy" width="1120" height="630" alt="Custom striped fish swimming with the others"></div><div><h3>Make your own fish</h3><p>Pick a name, size, shape, colours and pattern, how many you want, and whether they school together. They swim right alongside everything else.</p></div></div>
<div class="f"><img src="/f-clock.jpg" loading="lazy" width="1120" height="630" alt="The aquarium with a small clock in the top corner"><div><h3>A clock, or your own message</h3><p>Put a clock in the corner, or add your own words to the tank. They can be written in the sand, or spelled out by a school of fish.</p></div></div>
<div class="f"><video class="clip" muted loop playsinline preload="none" poster="/clip-stingray.jpg?v=2" data-src="/clip-stingray.mp4?v=2" width="1280" height="720" aria-label="A blue-spotted stingray gliding over the sand"></video><div><h3>Screensaver, wallpaper, or just watch</h3><p>Use it as your screensaver, as live wallpaper behind your desktop icons, or open it full screen whenever you want to sit back and watch.</p></div></div>
</section>

<section class="story2">
<div>
<h2>Why is it free?</h2>
<p>Honestly, because I love aquariums. I've been working on this for a long time and I want as many people as possible to enjoy it.</p>
<p>There are no ads and nothing to buy. Down the road there might be a donate button, or some optional bonus content, but the aquarium itself is free and it's staying that way.</p>
</div>
<div>
<h2>How it was made</h2>
<p>Ultra Aquarium was built with the latest frontier AI models, including Claude, ChatGPT and Grok. Many thousands of dollars' worth of AI credits went into it: the fish, Octopus Boy, the lighting, the way everything moves. It took a lot of tries to get it looking right.</p>
<p>Curious what it does on your PC? Everything that touches your computer or the internet, including the settings, the updates, the installer and this website, is <a href="https://github.com/leksicon1/aquarium">on GitHub</a> for anyone to read.</p>
</div>
</section>

<section class="older" id="older">
<h2>Installing</h2>
<p>Run the installer and Ultra Aquarium opens when it's done. If Windows asks for the .NET 8 Desktop Runtime, say yes. It's a free Microsoft component that lots of apps use.</p>
<p>When a new version comes out, the app tells you, and it only updates if you click Update.</p>
${prev.length ? `<p>Want an older version? Uninstall Ultra Aquarium first (Windows Settings, Apps), then run the older installer. Your settings are kept. ${prev.map((p) => `<a href="/download/${esc(p.version)}" rel="nofollow">Version ${esc(p.version)}</a> (${Math.round(p.size / 1048576)} MB)`).join(" · ")}</p>` : ""}
</section>
</main>
<footer>© 2026 Technology 83 Systems Ltd. · <a href="https://github.com/leksicon1/aquarium">Ultra Aquarium on GitHub</a></footer>
</div>
<script>
// Picture viewer: click a screenshot and it opens large; arrows, swipe or the keyboard move between them.
(function () {
  var links = [].slice.call(document.querySelectorAll("#shots a"));
  if (!links.length) return;
  var lb = document.createElement("div");
  lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Screenshots");
  lb.innerHTML = '<div class="stage"></div><p class="cap"></p><button class="prev" aria-label="Previous picture">&#8249;</button><button class="next" aria-label="Next picture">&#8250;</button><button class="x" aria-label="Close">&#10005;</button>';
  document.body.appendChild(lb);
  var stage = lb.querySelector(".stage"), cap = lb.querySelector(".cap"), cur = -1, last = null, opener = null;
  function src(i) { return links[i].getAttribute("href"); }
  function preload(i) { var im = new Image(); im.src = src((i + links.length) % links.length); }
  function show(i, dir) {
    i = (i + links.length) % links.length;
    var img = document.createElement("img");
    img.className = "slide" + (dir > 0 ? " from-r" : dir < 0 ? " from-l" : "");
    img.alt = links[i].querySelector("img").alt;
    img.src = src(i);
    stage.appendChild(img);
    var go = function () { requestAnimationFrame(function () { requestAnimationFrame(function () { img.className = "slide in"; }); }); };
    if (img.complete) go(); else { img.onload = go; img.onerror = go; }
    if (last) {
      var old = last;
      old.className = "slide " + (dir >= 0 ? "out-l" : "out-r");
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 600);
    }
    last = img; cur = i;
    cap.innerHTML = "";
    cap.appendChild(document.createTextNode(img.alt));
    var n = document.createElement("b"); n.textContent = (i + 1) + " / " + links.length; cap.appendChild(n);
    preload(i + 1); preload(i - 1);
  }
  function open(i) {
    opener = document.activeElement;
    stage.innerHTML = ""; last = null;
    show(i, 0);
    lb.classList.add("on");
    document.documentElement.style.overflow = "hidden";
    lb.querySelector(".x").focus({ preventScroll: true });
  }
  function close() {
    lb.classList.remove("on");
    document.documentElement.style.overflow = "";
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  }
  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;   // new tab still works
      e.preventDefault(); open(i);
    });
  });
  lb.querySelector(".prev").onclick = function () { show(cur - 1, -1); };
  lb.querySelector(".next").onclick = function () { show(cur + 1, 1); };
  lb.querySelector(".x").onclick = close;
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") show(cur + 1, 1);
    else if (e.key === "ArrowLeft") show(cur - 1, -1);
  });
  var x0 = null;
  stage.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
})();
// Short clips play only while on screen, and load only when first scrolled near.
(function () {
  var c = navigator.connection || {};
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || c.saveData) return;
  var vids = [].slice.call(document.querySelectorAll("video.clip"));
  if (!("IntersectionObserver" in window)) { vids.forEach(function (v) { v.src = v.dataset.src; v.play().catch(function () {}); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else if (v.src) v.pause();
    });
  }, { rootMargin: "200px 0px" });
  vids.forEach(function (v) { io.observe(v); });
})();
// The backdrop video starts only after the page itself has loaded, in a size that suits the screen.
// On a slow or data-saving connection, or when the visitor prefers less motion, the still picture stays.
addEventListener("load", function () {
  var v = document.getElementById("bg"), c = navigator.connection || {};
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches || c.saveData || /(^|-)2g/.test(c.effectiveType || "");
  if (!v || still) return;
  // phones get the 720p file; larger screens get 1080p, as AV1 where the browser can play it (sharper at the same size)
  var px = Math.min(innerWidth, screen.width) * Math.min(devicePixelRatio || 1, 2);
  var av1 = v.canPlayType('video/mp4; codecs="av01.0.09M.08"') === "probably";
  v.src = px <= 900 ? "/hero-720.mp4?v=2" : av1 ? "/hero-1080-av1.mp4?v=2" : "/hero-1080.mp4?v=2";
  // if the chosen file fails for any reason, fall back to the plain H.264 one
  v.addEventListener("error", function () { if (!/hero-1080\.mp4(\\?|$)/.test(v.src) && px > 900) { v.src = "/hero-1080.mp4?v=2"; v.play().catch(function () {}); } }, { once: true });
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
  const tiles = [["Installs sharing usage", t.installs], ["Active in 7 days", t.active7], ["Active in 30 days", t.active30], ["Check-ins today (everyone)", t.checksToday], ["Downloads by people", t.downloads], ["Different people", t.downloaders], ["App self-updates", t.dlApp], ["AI crawler fetches", t.dlAi], ["Search engine fetches", t.dlSearch], ["Other bot fetches", t.dlBot]];
  $("tiles").replaceChildren(...tiles.map(([k, v]) => { const d = document.createElement("div"); d.className = "tile"; const b = document.createElement("b"); b.textContent = v ?? 0; const s = document.createElement("span"); s.textContent = k; d.append(b, s); return d; }));
  $("relInfo").textContent = data.release ? "Published version: " + data.release.version + " (" + (data.release.size / 1048576).toFixed(1) + " MB)" : "No release published yet.";
  table($("daily"), [["Day", "day"], ["All check-ins", "checks", 1], ["Sharing usage", "known", 1]], data.daily);
  table($("dlDaily"), [["Day", "day"], ["People", "people", 1], ["App updates", "app", 1], ["AI crawlers", "ai", 1], ["Other bots", "bots", 1]], data.dlDaily);
  table($("versions"), [["Version", "version"], ["Installs", "n", 1]], data.versions);
  table($("countries"), [["Country", "country"], ["Installs", "n", 1]], data.countries);
  table($("modes"), [["Feature", "kind"], ["Times", "n", 1], ["People", "people", 1]], data.modes);
  table($("quality"), [["Quality", "q"], ["People", "people", 1]], data.quality);
  table($("gpus"), [["Graphics card", "gpu"], ["Installs", "n", 1]], data.gpus);
  table($("downloads"), [["When", (r) => when(r.ts)], ["Who", (r) => ({ person: "Person", app: "App update", ai: "AI crawler", search: "Search engine", bot: "Bot" }[r.kind] || r.kind)], ["Version", "version"], ["Country", "country"], ["City", "city"], ["Network", "org"], ["Visitor", "visitor"], ["Came from", "ref"], ["Browser", "ua"]], data.downloads);
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
