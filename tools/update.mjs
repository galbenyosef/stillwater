// update.mjs — read-only drift probe against the live site. Never rewrites the capture.
// usage: node tools/update.mjs [--json]
//
// STILLWATER — the mill island (https://stillwater.zavrenn.chatgpt.site/), a
// Vite-built three.js island game served at the origin root. The probe
// re-fetches the entry document and every captured file and compares against
// .upstream/manifest.json. Known noise, all excluded from a real drift verdict:
//   - index.html embeds a Cloudflare bot-challenge token that rotates on every
//     response — the entry (and any *.html) compares NORMALIZED;
//   - cdn-cgi/challenge-platform/scripts/jsd/main.js is recorded
//     `dynamic: true` (the deployment rotates it per response) and is
//     presence-only;
//   - _mirror-report.json is a local capture record — never probed.
// The host answers unknown paths with HTTP 200 + the entry document (SPA
// catch-all), so a file that disappears upstream shows up as `changed`
// (bytes are the HTML fallback), not `live-missing`.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const ORIGIN = "https://stillwater.zavrenn.chatgpt.site";
const ENTRY = "index.html";             // served at the origin root; capture at the repo root
const DISK_PREFIX = "";                 // files sit at the repo root
const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0" };

const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
async function getBuf(url) {
  const r = await fetch(url, { headers: UA });
  return { status: r.status, buf: r.ok ? Buffer.from(await r.arrayBuffer()) : null };
}
// disk rel -> served path ("" = origin root)
const servedOf = (rel) => (rel.startsWith(DISK_PREFIX) ? rel.slice(DISK_PREFIX.length) : rel);
// Rotating per-response noise — everything else must be byte-identical.
const normalize = (s) =>
  s
    .replace(/ nonce="[^"]*"/g, "")
    .replace(/window\.__CF\$cv\$params=\{[^}]*\}/g, "window.__CF$cv$params=<token>")
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, "<uuid>");

const manifest = JSON.parse(fs.readFileSync(path.join(proj, ".upstream", "manifest.json"), "utf8"));

const live = {};
const entryUrl = ORIGIN + "/" + servedOf(ENTRY);
const entry = await getBuf(entryUrl);
if (entry.status !== 200) {
  console.error(`live entry ${entryUrl} -> HTTP ${entry.status}`);
  process.exit(2);
}
if (ENTRY) live[ENTRY] = { buf: entry.buf };
else if (manifest.files["index.html"]) live["index.html"] = { buf: entry.buf };

// Probe every captured file directly — the manifest is the authoritative closure.
// (Unlike the template default, cdn-cgi/ is NOT skipped here: the captured
// Cloudflare challenge script is this mirror's one `dynamic: true` file, so it
// is probed for PRESENCE and its bytes are never compared.)
const rels = Object.keys(manifest.files)
  .filter((r) => r !== ENTRY && !r.endsWith("_mirror-report.json"))
  .sort();
for (const rel of rels) {
  const served = servedOf(rel);
  let r = await getBuf(ORIGIN + "/" + served);
  if (r.status !== 200 && served === "index.html") r = await getBuf(ORIGIN + "/");
  if (r.status === 200 && !live[rel]) live[rel] = { buf: r.buf };
}

const rows = [];
for (const [n, m] of Object.entries(manifest.files).sort()) {
  if (n.endsWith("_mirror-report.json")) continue;
  const l = live[n];
  if (!l) {
    rows.push({ file: n, state: "live-missing" });
    continue;
  }
  if (m.dynamic) continue; // rotating third-party payload: presence is the only stable signal
  if (n === ENTRY || n.endsWith(".html")) {
    const cap = path.join(proj, n);
    if (!fs.existsSync(cap)) continue;
    const a = normalize(l.buf.toString("utf8"));
    const b = normalize(fs.readFileSync(cap, "utf8"));
    if (a !== b) rows.push({ file: n, state: "changed" });
  } else if (m.sha256 !== sha(l.buf)) {
    rows.push({ file: n, state: "changed", mirror: m.sha256.slice(0, 12), live: sha(l.buf).slice(0, 12) });
  }
}
const changed = rows.filter((r) => r.state === "changed").length;
const missing = rows.filter((r) => r.state === "live-missing").length;
if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ origin: ORIGIN, checked: Object.keys(manifest.files).length, changed, missing, rows }, null, 2));
} else if (!rows.length) {
  console.log(`up to date: ${Object.keys(manifest.files).length} captured files identical upstream`);
} else {
  console.log(`DRIFT: ${changed} changed, ${missing} live-missing (of ${Object.keys(manifest.files).length} captured)`);
  for (const r of rows.slice(0, 40)) console.log(`  ${r.state.padEnd(14)} ${r.file}`);
  process.exit(1);
}
