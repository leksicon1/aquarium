// Ultra Aquarium service for aquarium.technology83.com (reef.technology83.com is kept for older builds)
//   /                 download page
//   /download         the installer zip (stored as parts under /dl, streamed as one file, each download logged)
//   /api/hello        the app's check-in: returns the latest version and the developer note; records usage
//   /api/event        usage events (only sent when the user has usage sharing on)
//   /admin            developer area: edit the note, see who downloaded and how the app is used
import { page, adminPage } from "./pages.js";

const json = (o, status = 200, headers = {}) =>
  new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers } });
const now = () => new Date().toISOString();
const day = () => now().slice(0, 10);
const clip = (v, n) => (v == null ? "" : String(v).replace(/[\u0000-\u001f]/g, " ").slice(0, n));
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const sha256 = async (s) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));

async function kvGet(env, k) {
  const r = await env.DB.prepare("SELECT v FROM kv WHERE k=?").bind(k).first();
  return r ? r.v : null;
}
const kvSet = (env, k, v) => env.DB.prepare("INSERT INTO kv(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(k, v).run();

async function release(env, origin) {
  const r = await env.ASSETS.fetch(new Request(origin + "/release.json"));
  if (!r.ok) return null;
  const rel = await r.json();
  rel.url = origin + "/download";
  return rel;
}

async function note(env) {
  return { text: (await kvGet(env, "note")) || "", updated: (await kvGet(env, "note_updated")) || "" };
}

// ---------------------------------------------------------------- app check-in
async function hello(req, env, origin) {
  let b = {};
  try { b = await req.json(); } catch {}
  const version = clip(b.v, 20) || "?";
  const country = req.cf?.country || "";
  const id = /^[a-f0-9]{32}$/.test(b.id || "") ? b.id : null;
  const t = now(), d = day();
  const stmts = [
    // every check-in is counted by day, version and country only - this is all that is kept when usage sharing is off
    env.DB.prepare("INSERT INTO checks(day,version,country,n) VALUES(?,?,?,1) ON CONFLICT(day,version,country) DO UPDATE SET n=n+1").bind(d, version, country),
  ];
  if (id) {
    stmts.push(
      env.DB.prepare(
        "INSERT INTO installs(id,first_seen,last_seen,first_version,version,country,os,gpu,screens,pings) VALUES(?,?,?,?,?,?,?,?,?,1) " +
        "ON CONFLICT(id) DO UPDATE SET last_seen=excluded.last_seen, version=excluded.version, country=excluded.country, os=excluded.os, gpu=CASE WHEN excluded.gpu='' THEN gpu ELSE excluded.gpu END, screens=excluded.screens, pings=pings+1"
      ).bind(id, t, t, version, version, country, clip(b.os, 60), clip(b.gpu, 120), clip(b.screens, 120)),
      env.DB.prepare("INSERT INTO events(ts,day,id,version,country,kind,data) VALUES(?,?,?,?,?,?,?)").bind(t, d, id, version, country, clip(b.mode, 20) || "hello", clip(JSON.stringify(b.use || {}), 1500))
    );
  }
  try { await env.DB.batch(stmts); } catch (e) { console.log("hello db", e.message); }
  return json({ latest: await release(env, origin), note: await note(env) });
}

async function event(req, env) {
  let b = {};
  try { b = await req.json(); } catch {}
  if (!/^[a-f0-9]{32}$/.test(b.id || "")) return json({ ok: false }, 400);
  await env.DB.prepare("INSERT INTO events(ts,day,id,version,country,kind,data) VALUES(?,?,?,?,?,?,?)")
    .bind(now(), day(), b.id, clip(b.v, 20), req.cf?.country || "", clip(b.kind, 20), clip(JSON.stringify(b.data || {}), 1500)).run();
  return json({ ok: true });
}

// ---------------------------------------------------------------- download
// Who fetched the installer: the app updating itself, an AI crawler, a search engine, some other
// automated client (named bots, scripts, or a browser coming from a hosting company), or a person.
const AI_BOTS = /claudebot|claude-user|claude-searchbot|anthropic|gptbot|chatgpt|oai-searchbot|perplexity|ccbot|bytespider|google-extended|meta-externalagent|amazonbot|applebot-extended|cohere|diffbot|youbot|mistralai/i;
const SEARCH_BOTS = /googlebot|bingbot|duckduckbot|yandex|baiduspider|slurp|applebot|google-inspectiontool|google-safety/i;
const OTHER_BOTS = /bot\b|crawler|spider|headless|curl\/|wget|python|go-http|java\/|okhttp|axios|node-fetch|scrapy|phantom|facebookexternalhit|preview|monitor|scan/i;
const HOSTING = /google|amazon|aws|microsoft|azure|ovh|digitalocean|hetzner|linode|akamai|vultr|oracle|alibaba|tencent|contabo|leaseweb|scaleway|cloudflare|datacamp|m247|hosting|datacenter|data center|server|cloud|vpn|colo/i;
function downloadKind(ua, org) {
  if (/updater$/i.test(ua)) return "app";
  if (AI_BOTS.test(ua)) return "ai";
  if (SEARCH_BOTS.test(ua)) return "search";
  if (!ua || OTHER_BOTS.test(ua) || HOSTING.test(org)) return "bot";
  return "person";
}
async function download(req, env, origin) {
  const rel = await release(env, origin);
  if (!rel) return new Response("No release published yet.", { status: 404 });
  const ip = req.headers.get("cf-connecting-ip") || "";
  // a visitor code that changes every month and cannot be turned back into an address
  const visitor = (await sha256(ip + "|" + day().slice(0, 7) + "|" + ((await kvGet(env, "salt")) || "reef"))).slice(0, 16);
  if (req.method === "GET" && !req.headers.get("range")) {
    try {
      const ua = req.headers.get("user-agent") || "", org = req.cf?.asOrganization || "";
      await env.DB.prepare("INSERT INTO downloads(ts,day,version,country,city,ua,ref,visitor,kind,org) VALUES(?,?,?,?,?,?,?,?,?,?)")
        .bind(now(), day(), rel.version, req.cf?.country || "", clip(req.cf?.city, 60), clip(ua, 200), clip(req.headers.get("referer"), 200), visitor, downloadKind(ua, org), clip(org, 80)).run();
    } catch (e) { console.log("download db", e.message); }
  }
  const headers = {
    "content-type": rel.file.endsWith(".msi") ? "application/x-msi" : "application/zip",
    "content-length": String(rel.size),
    "content-disposition": `attachment; filename="${rel.file}"`,
    "cache-control": "no-store",
  };
  if (req.method === "HEAD") return new Response(null, { headers });
  const { readable, writable } = new FixedLengthStream(rel.size);
  (async () => {
    try {
      for (const part of rel.parts) {
        const r = await env.ASSETS.fetch(new Request(origin + "/dl/" + part));
        if (!r.ok || !r.body) throw new Error("missing part " + part);
        await r.body.pipeTo(writable, { preventClose: true });
      }
      await writable.close();
    } catch (e) {
      console.log("download stream", e.message);
      try { await writable.abort(e); } catch {}
    }
  })();
  return new Response(readable, { headers });
}

// ---------------------------------------------------------------- admin
async function pbkdf(password, saltHex) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256));
}
const randomHex = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));
const cookie = (req, name) => (req.headers.get("cookie") || "").split(/;\s*/).map((c) => c.split("=")).find((c) => c[0] === name)?.[1] || "";

async function signedIn(req, env) {
  const tok = cookie(req, "reef_admin");
  if (!/^[a-f0-9]{64}$/.test(tok)) return false;
  const exp = await kvGet(env, "session:" + (await sha256(tok)));
  return !!exp && exp > now();
}

async function admin(req, env, url) {
  const path = url.pathname;
  if (path === "/admin" || path === "/admin/") {
    return new Response(adminPage(), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-frame-options": "DENY", "referrer-policy": "no-referrer" } });
  }
  if (req.method === "POST") {
    // browsers send Origin on cross-site posts: only this site may post here
    const o = req.headers.get("origin");
    if (o && o !== url.origin) return json({ error: "Wrong origin" }, 403);
    if (!(req.headers.get("content-type") || "").includes("application/json")) return json({ error: "Bad request" }, 400);
  }
  const hasPassword = !!(await kvGet(env, "admin_hash"));
  if (path === "/admin/state") return json({ setup: !hasPassword, signedIn: hasPassword && (await signedIn(req, env)) });

  if (path === "/admin/login" && req.method === "POST") {
    const b = await req.json().catch(() => ({}));
    const pw = String(b.password || "");
    // slow down guessing: at most 8 attempts per 15 minutes
    const slot = "tries:" + Math.floor(Date.now() / 900000);
    const tries = parseInt((await kvGet(env, slot)) || "0", 10);
    if (tries >= 8) return json({ error: "Too many attempts. Try again in 15 minutes." }, 429);
    if (!hasPassword) {
      if (pw.length < 10) return json({ error: "Choose a password of at least 10 characters." }, 400);
      const salt = randomHex(16);
      await kvSet(env, "admin_salt", salt);
      await kvSet(env, "admin_hash", await pbkdf(pw, salt));
      await kvSet(env, "salt", randomHex(16));
    } else {
      const ok = (await pbkdf(pw, await kvGet(env, "admin_salt"))) === (await kvGet(env, "admin_hash"));
      if (!ok) {
        await kvSet(env, slot, String(tries + 1));
        return json({ error: "Wrong password." }, 401);
      }
    }
    const tok = randomHex(32);
    await env.DB.prepare("DELETE FROM kv WHERE (k LIKE 'session:%' AND v < ?) OR (k LIKE 'tries:%' AND k <> ?)").bind(now(), slot).run();
    await kvSet(env, "session:" + (await sha256(tok)), new Date(Date.now() + 30 * 86400000).toISOString());
    return json({ ok: true }, 200, { "set-cookie": `reef_admin=${tok}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000` });
  }
  if (!hasPassword || !(await signedIn(req, env))) return json({ error: "Sign in first." }, 401);

  if (path === "/admin/logout" && req.method === "POST") {
    await env.DB.prepare("DELETE FROM kv WHERE k=?").bind("session:" + (await sha256(cookie(req, "reef_admin")))).run();
    return json({ ok: true }, 200, { "set-cookie": "reef_admin=; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0" });
  }
  if (path === "/admin/note" && req.method === "POST") {
    const b = await req.json().catch(() => ({}));
    const text = String(b.text || "").replace(/\r/g, "").replace(/[\u0000-\u0009\u000b-\u001f]/g, "").trim().slice(0, 600);
    await kvSet(env, "note", text);
    await kvSet(env, "note_updated", now());
    return json({ ok: true, note: await note(env) });
  }
  if (path === "/admin/data") {
    const q = (sql, ...p) => env.DB.prepare(sql).bind(...p).all().then((r) => r.results);
    const d7 = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
    const d30 = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
    const [totals, daily, versions, countries, gpus, modes, quality, dls, dlDaily, recent] = await Promise.all([
      q(`SELECT (SELECT COUNT(*) FROM installs) installs,
                (SELECT COUNT(*) FROM installs WHERE last_seen >= ?) active7,
                (SELECT COUNT(*) FROM installs WHERE last_seen >= ?) active30,
                (SELECT COALESCE(SUM(n),0) FROM checks WHERE day = ?) checksToday,
                (SELECT COUNT(*) FROM downloads WHERE kind = 'person') downloads,
                (SELECT COUNT(DISTINCT visitor) FROM downloads WHERE kind = 'person') downloaders,
                (SELECT COUNT(*) FROM downloads WHERE kind = 'app') dlApp,
                (SELECT COUNT(*) FROM downloads WHERE kind = 'ai') dlAi,
                (SELECT COUNT(*) FROM downloads WHERE kind = 'search') dlSearch,
                (SELECT COUNT(*) FROM downloads WHERE kind = 'bot') dlBot`, d7, d30, day()),
      q("SELECT c.day, SUM(c.n) checks, (SELECT COUNT(DISTINCT id) FROM events e WHERE e.day = c.day) known FROM checks c WHERE c.day >= ? GROUP BY c.day ORDER BY c.day DESC", d30),
      q("SELECT version, COUNT(*) n FROM installs GROUP BY version ORDER BY n DESC LIMIT 12"),
      q("SELECT country, COUNT(*) n FROM installs GROUP BY country ORDER BY n DESC LIMIT 15"),
      q("SELECT gpu, COUNT(*) n FROM installs GROUP BY gpu ORDER BY n DESC LIMIT 12"),
      q("SELECT kind, COUNT(*) n, COUNT(DISTINCT id) people FROM events WHERE day >= ? GROUP BY kind ORDER BY n DESC LIMIT 12", d30),
      q("SELECT json_extract(data,'$.q') q, COUNT(DISTINCT id) people FROM events WHERE day >= ? AND json_extract(data,'$.q') IS NOT NULL GROUP BY q ORDER BY q", d30),
      q("SELECT ts, kind, version, country, city, org, ua, ref, visitor FROM downloads ORDER BY ts DESC LIMIT 60"),
      q("SELECT day, SUM(kind='person') people, SUM(kind='app') app, SUM(kind='ai') ai, SUM(kind IN ('search','bot')) bots FROM downloads WHERE day >= ? GROUP BY day ORDER BY day DESC", d30),
      q("SELECT id, first_seen, last_seen, version, country, os, gpu, screens, pings FROM installs ORDER BY last_seen DESC LIMIT 40"),
    ]);
    return json({ totals: totals[0], daily, versions, countries, gpus, modes, quality, downloads: dls, dlDaily, recent, note: await note(env), release: await release(env, url.origin) });
  }
  return json({ error: "Not found" }, 404);
}

// Video files answer byte-range requests (206), which iPhones and iPads require before they will play a video.
async function video(req, env) {
  const u = new URL(req.url), save = u.searchParams.has("save");
  u.search = "";
  const r = await env.ASSETS.fetch(new Request(u.toString(), { method: "GET" }));
  if (!r.ok) return r;
  const head = { "content-type": "video/mp4", "accept-ranges": "bytes", "cache-control": "public, max-age=86400" };
  // ?save makes the browser download the file instead of playing it, so a phone can keep it
  if (save) head["content-disposition"] = 'attachment; filename="UltraAquarium.mp4"';
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") || "");
  if (!range) {
    const size = r.headers.get("content-length");
    if (size) head["content-length"] = size;
    return new Response(req.method === "HEAD" ? null : r.body, { headers: head });
  }
  const buf = await r.arrayBuffer();
  const size = buf.byteLength;
  let start = range[1] === "" ? Math.max(0, size - parseInt(range[2] || "0", 10)) : parseInt(range[1], 10);
  let end = range[1] === "" || range[2] === "" ? size - 1 : Math.min(parseInt(range[2], 10), size - 1);
  if (!(start >= 0) || start > end || start >= size) {
    return new Response(null, { status: 416, headers: { "content-range": `bytes */${size}` } });
  }
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: { ...head, "content-range": `bytes ${start}-${end}/${size}`, "content-length": String(end - start + 1) },
  });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    try {
      if (p === "/api/hello" && req.method === "POST") return await hello(req, env, url.origin);
      if (p === "/api/event" && req.method === "POST") return await event(req, env);
      if (p === "/api/release") return json({ latest: await release(env, url.origin), note: await note(env) });
      if (p === "/download") return await download(req, env, url.origin);
      if (p.startsWith("/admin")) return await admin(req, env, url);
      if (p.startsWith("/dl/")) return new Response("Use /download", { status: 404 });   // parts are not served on their own
      if (p === "/" || p === "/index.html") {
        return new Response(page(await release(env, url.origin)), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
      }
      if (p.endsWith(".mp4")) return await video(req, env);
      return env.ASSETS.fetch(req);
    } catch (e) {
      console.log("error", p, e.stack || e.message);
      return json({ error: "Something went wrong." }, 500);
    }
  },
};
