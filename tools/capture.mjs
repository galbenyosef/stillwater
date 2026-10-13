// capture.mjs — byte-exact capture + runtime-closure fetch for stillwater.
//
// STILLWATER — the mill island (https://stillwater.zavrenn.chatgpt.site/) is a
// Vite-built three.js island game hosted on a `*.chatgpt.site` deployment (the
// host is a ChatGPT Sites static deployment fronted by Cloudflare). The page is
// served at the origin root: index.html + assets/index-<hash>.js (the whole app
// as one minified bundle, three.js and the meshopt decoder merged in by the
// bundler) + assets/index-<hash>.css, plus an asset tree the runtime fetches
// by path: /textures/ (webp atlases + canopy JSON), /models/ and
// /compact/models/ (glTF), /compact/textures/ (keeper png/jpg),
// /audio/ (ogg) and /licenses/ (attribution txt).
//
// The deployment's own asset map: the built index.html carries
//   <meta name="stillwater-assets" content="{"/textures/x.webp":"<rev>", …}">
// and the bundle's `uf()` helper appends `?v=<rev>` to every same-origin asset
// it loads through that map. Every key of that map is therefore a same-origin
// file the deployment ships — the capture probes all 153 of them directly.
//
// Closure mechanics specific to this host:
//
//   - SPA catch-all: the host answers ANY unknown path with HTTP 200 and the
//     entry document (text/html) — a probe is therefore only "served" when the
//     response is NOT the HTML fallback. Referenced-but-unserved files (e.g.
//     /textures/scan-ground-albedo.webp) are recorded as 404-equivalent gaps.
//   - the entry document embeds a Cloudflare bot-challenge inline block whose
//     token rotates per response; the document is captured as served (the
//     token is nonce noise — tools/update.mjs normalizes it).
//   - /cdn-cgi/challenge-platform/scripts/jsd/main.js (302 -> rotating
//     challenge script, ~24 KB) is Cloudflare machinery injected into the page;
//     captured once per the fleet precedent and recorded `dynamic: true` so the
//     drift probe treats it as presence-only.
//
// The static scanner iterates every captured text file to a fixpoint (HTML
// attributes and quoted strings, JS literals/specifiers/new URL(), CSS
// url()/@import, JSON quoted paths). Template-literal asset names the literal
// scanner cannot resolve (the bundle builds `/textures/${x}.webp` from code
// tables) are expanded explicitly in TEMPLATE_TARGETS below — each one is a
// real deployed path taken from the bundle's own name lists, and each is
// verified against the live host at capture time.
//
// Output (all byte-exact, nothing edited):
//   <mirror root>/…            captured files as served (entry index.html at root)
//   _mirror-report.json        crawl record (dead-world shape)
//   .upstream/manifest.json    Gen-A { generated, origin, files: { rel: {bytes, sha256} } }
//
// usage: node tools/capture.mjs [--check]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const ORIGIN = "https://stillwater.zavrenn.chatgpt.site";
const ENTRY = "index.html"; // served at the origin root; capture at repo root (DISK_PREFIX = "")
const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0" };

// Files the runtime instantiates from template literals the literal scanner
// cannot resolve — taken from the bundle's own name lists (placements, the
// alder/birch/fern view atlas loader, the scan-ground/pebbles/sand material
// table) and verified against the live host at capture time. A failure is
// recorded as a gap, never silently dropped.
const TEMPLATE_TARGETS = [
  // `["ground","pebbles","sand"].flatMap(e => ["albedo","normal","roughness"].map(t => loadAsync(`/textures/scan-${e}-${t}.webp`)))`
  ...["ground", "pebbles", "sand"].flatMap((e) => ["albedo", "normal", "roughness"].map((t) => `textures/scan-${e}-${t}.webp`)),
  // `["alder-canopy","birch-canopy","fern0-views","fern1-views"].map(t => loadAsync(`/textures/${t}.webp`), fetch(`/textures/${t}.json`))`
  "textures/fern0-views.webp",
  "textures/fern0-views.json",
  "textures/fern1-views.webp",
  "textures/fern1-views.json",
  // placement-table model names whose `tv()` target is not in the meta map
  // (`/models/${name}.glb` for names outside the compact set)
  "models/pebble.glb",
  "models/clearinggrass.glb",
  // browser-implicit root icon request (the document's own icon is a data: URI)
  "favicon.ico",
];

// strings that look like asset paths but are never network-requested
const EXCLUDE = new Set([
  // MIME type identifiers (e.g. the loader's "image/webp" checks), not files
  "text/html",
  "image/webp",
  "image/jpeg",
  "image/png",
]);
// MIME-shaped candidates ("<type>/<subtype>") are format identifiers, not paths
const RE_MIME = /^(?:image|audio|video|text|application|font|model|multipart)\/[a-z0-9.+-]+$/i;

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const EXT =
  "js|mjs|css|png|jpe?g|webp|gif|svg|avif|ico|ktx2|basis|mp3|ogg|wav|m4a|mp4|webm|json|wasm|data|bin|glb|gltf|woff2?|ttf|otf|hdr|exr|txt|csv|glsl|vert|frag|map|xml|webmanifest";
const RE_EXT_END = new RegExp(`\\.(?:${EXT})$`, "i");

const RE_QUOTED = new RegExp(`["'\`]([^"'\`\\n\\r]{1,300}?\\.(?:${EXT}))(?:\\?[^"'\`\\n\\r]*)?["'\`]`, "gi");
const RE_SPECIFIER = /\b(?:import|from)\s*\(?\s*["'`]([^"'`\n\r]+)["'`]/g;
const RE_NEW_URL = /\bnew\s+URL\s*\(\s*["'`]([^"'`\n\r]+)["'`]/g;
const RE_CSS_URL = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
const RE_CSS_IMPORT = /@import\s+(?:url\(\s*)?["']([^"']+)["']/g;
const RE_SRC_HREF = /\b(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi;
const RE_SRCSET = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
const SANE = (s) => s.length > 0 && s.length <= 250 && !/[\s"'`&?!=<>|;(){}$,:\\]/.test(s);

// minified vendor code carries no comments, but keep the strip so a future
// non-minified capture cannot turn JSDoc examples into probe noise
const stripBlockComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, " ");

const normalize = (p) => {
  const out = [];
  for (const part of p.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return out.join("/");
};

function classifyUrl(raw, baseDir) {
  let s = raw.trim();
  if (!s || s.includes("${")) return null;
  if (/^(data:|blob:|javascript:|mailto:|tel:|#)/i.test(s)) return null;
  if (RE_MIME.test(s)) return null;
  if (s.startsWith("http://") || s.startsWith("https://")) {
    if (s.startsWith(ORIGIN + "/")) s = s.slice(ORIGIN.length);
    else if (s === ORIGIN) s = "/";
    else return { external: s };
  }
  if (s.startsWith("//")) return { external: s };
  if (!SANE(s)) return null;
  if (s.startsWith("/")) {
    const n = normalize(s.replace(/^\//, ""));
    return { path: n || "index.html" };
  }
  const mod = baseDir && baseDir !== "." ? normalize(path.posix.join(baseDir, s)) : normalize(s);
  const root = normalize(s);
  const paths = [...new Set([mod, root])].map((p) => p || "index.html");
  return { paths };
}

function refsOf(relPath, rawText, external) {
  const text = stripBlockComments(rawText);
  const groups = [];
  const add = (r) => {
    if (!r) return;
    if (r.external) {
      external.add(r.external);
      return;
    }
    const paths = (r.paths ?? [r.path]).filter((p) => p && !EXCLUDE.has(p));
    if (paths.length) groups.push(paths);
  };
  const baseDir = path.posix.dirname(relPath);
  const isHtml = /\.html?$/i.test(relPath);
  const isCss = /\.css$/i.test(relPath);
  const isJs = /\.(js|mjs)$/i.test(relPath);
  const isJson = /\.json$/i.test(relPath) || /\.webmanifest$/i.test(relPath);

  if (isHtml) {
    for (const m of text.matchAll(RE_SRC_HREF)) add(classifyUrl(m[1], ""));
    for (const m of text.matchAll(RE_SRCSET))
      for (const part of m[1].split(",")) add(classifyUrl(part.trim().split(/\s+/)[0], ""));
    for (const m of text.matchAll(RE_QUOTED)) {
      const v = m[1];
      if (RE_EXT_END.test(v)) add(classifyUrl(v, ""));
    }
  }
  if (isJson) {
    for (const m of text.matchAll(RE_QUOTED)) add(classifyUrl(m[1], baseDir));
  }
  if (isCss) {
    for (const m of text.matchAll(RE_CSS_URL)) add(classifyUrl(m[1], baseDir));
    for (const m of text.matchAll(RE_CSS_IMPORT)) add(classifyUrl(m[1], baseDir));
  }
  if (isJs) {
    for (const m of text.matchAll(RE_QUOTED)) add(classifyUrl(m[1], baseDir));
    for (const m of text.matchAll(RE_SPECIFIER)) {
      const v = m[1];
      if (/^(\.{0,2}\/)/.test(v) || /\.(js|mjs|css|json|wasm)(\?|$)/i.test(v)) add(classifyUrl(v, baseDir));
    }
    for (const m of text.matchAll(RE_NEW_URL)) {
      const v = m[1];
      if (!v.includes("${")) add(classifyUrl(v, baseDir));
    }
  }
  const seen = new Set();
  return groups.filter((g) => {
    const k = g.join("|");
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const external = new Set();
const state = {
  start: ORIGIN + "/",
  origin: ORIGIN,
  gated: false,
  sessionRenewal: "none",
  requests: 0,
  fetched: new Map(), // rel -> { bytes, sha256, buf, dynamic? }
  unresolved: [],
  unreachable: [],
};

const unresolvedSeen = new Set();
const unreachableSeen = new Set();
const probedFailed = new Map();
// `unreachable` = a real non-200 answer; `unresolved` = the host answered 200
// but with the SPA fallback (text/html) instead of the file — the file is not
// served (every non-entry asset here has a binary/JSON content-type)
const badStatus = (status, rel) => {
  if (!unresolvedSeen.has(rel) && !unreachableSeen.has(rel)) {
    if (status === 404 || status === "fallback") {
      unresolvedSeen.add(rel);
      state.unresolved.push({
        status: status === "fallback" ? 404 : status,
        path: rel,
        probes: 1,
        ...(status === "fallback"
          ? { note: "SPA catch-all: the host answers unknown paths with HTTP 200 + the entry document (text/html); the asset itself is not served" }
          : {}),
      });
    } else {
      unreachableSeen.add(rel);
      state.unreachable.push({ status, path: rel, probes: 1 });
    }
  }
};

async function tryFetch(rel, { follow = true } = {}) {
  const url = rel === ENTRY ? ORIGIN + "/" : ORIGIN + "/" + rel.split("/").map(encodeURIComponent).join("/");
  state.requests++;
  let r;
  try {
    r = await fetch(url, { headers: UA, redirect: follow ? "follow" : "manual" });
  } catch (e) {
    return { status: `net:${e.message}`, buf: null };
  }
  if (r.status !== 200) return { status: r.status, buf: null };
  const buf = Buffer.from(await r.arrayBuffer());
  const type = r.headers.get("content-type") || "";
  return { status: 200, buf, type };
}

// probe one reference: try every candidate base; a reference is a gap only
// when EVERY base fails; once any base is captured the reference is closed
async function probe(paths, opts = {}) {
  if (paths.some((p) => state.fetched.has(p))) return true;
  const fresh = paths.filter((p) => !probedFailed.has(p));
  if (!fresh.length) return false;
  for (const rel of fresh) {
    const res = await tryFetch(rel, opts);
    if (res.buf) {
      // the SPA catch-all answers every unknown path with the entry document
      const isFallback = /text\/html/i.test(res.type || "") && rel !== ENTRY;
      if (isFallback) {
        probedFailed.set(rel, "fallback");
        badStatus("fallback", rel);
        continue;
      }
      state.fetched.set(rel, { bytes: res.buf.length, sha256: sha256(res.buf), buf: res.buf, ...(opts.dynamic ? { dynamic: true } : {}) });
      return true;
    }
    probedFailed.set(rel, res.status);
    badStatus(res.status, rel);
  }
  return false;
}

async function fetchEntry(rel) {
  const res = await tryFetch(rel);
  if (!res.buf) throw new Error(`entry ${rel} not fetchable (HTTP ${res.status})`);
  state.fetched.set(rel, { bytes: res.buf.length, sha256: sha256(res.buf), buf: res.buf });
  return res.buf;
}

// the deployment's own asset map lives in the entry document
function metaAssetsOf(html) {
  const m = /<meta\s+name="stillwater-assets"\s+content="([^"]*)"/.exec(html);
  if (!m) throw new Error("entry document carries no stillwater-assets meta — capture shape changed");
  const raw = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  const obj = JSON.parse(raw);
  return Object.keys(obj).map((k) => k.replace(/^\//, ""));
}

function checkClosure() {
  const manifest = JSON.parse(fs.readFileSync(path.join(proj, ".upstream", "manifest.json"), "utf8"));
  const have = new Set(Object.keys(manifest.files));
  const recorded = new Set();
  try {
    const rep = JSON.parse(fs.readFileSync(path.join(proj, "_mirror-report.json"), "utf8"));
    for (const u of rep.unresolved ?? []) recorded.add(u.path);
  } catch {
    /* no report yet: every unresolved reference counts as new */
  }
  const ext = new Set();
  let groups = 0;
  const missing = [];
  const scanExternal = new Set();
  for (const rel of Object.keys(manifest.files).filter((r) => /\.(html?|js|mjs|css|json|webmanifest)$/i.test(r))) {
    const text = fs.readFileSync(path.join(proj, rel), "utf8");
    for (const g of refsOf(rel, text, scanExternal)) {
      groups++;
      const k = g.join("|");
      if (ext.has(k)) continue;
      ext.add(k);
      if (!g.some((p) => have.has(p))) missing.push({ from: rel, candidates: g });
    }
  }
  const novel = missing.filter((m) => !m.candidates.some((c) => recorded.has(c)));
  for (const m of missing)
    console.log(
      `UNRESOLVED ${m.from} -> ${m.candidates.join(" | ")}` +
        (m.candidates.some((c) => recorded.has(c)) ? "  (recorded gap)" : "  (NEW)"),
    );
  console.log(
    `closure check: ${groups} reference group(s), ${missing.length} unresolved (${novel.length} new vs _mirror-report.json), ` +
      `${scanExternal.size} external off-origin reference(s)`,
  );
  for (const e of [...scanExternal].sort()) console.log(`  external: ${e}`);
  process.exit(novel.length ? 1 : 0);
}

async function main() {
  if (process.argv.includes("--check")) return checkClosure();

  // round 0: the entry document
  if (!state.fetched.has(ENTRY)) await fetchEntry(ENTRY);
  const html = state.fetched.get(ENTRY).buf.toString("utf8");

  // round 0b: the deployment's own asset map (every key is a shipped file)
  const metaAssets = metaAssetsOf(html);
  console.log(`stillwater-assets meta: ${metaAssets.length} declared asset(s)`);
  for (const rel of metaAssets) if (!state.fetched.has(rel) && !probedFailed.has(rel)) await probe([rel]);

  // round 0c: template-literal targets the scanner cannot resolve
  for (const rel of TEMPLATE_TARGETS) if (!state.fetched.has(rel) && !probedFailed.has(rel)) await probe([rel]);

  // iterate closure to fixpoint
  let round = 0;
  let newRefs = 0;
  do {
    newRefs = 0;
    round++;
    for (const [rel, rec] of [...state.fetched.entries()].sort()) {
      if (!/\.(html?|js|mjs|css|json|webmanifest)$/i.test(rel)) continue;
      const text = rec.buf.toString("utf8");
      if (!Buffer.from(text, "utf8").equals(rec.buf)) continue; // not scannable text
      for (const group of refsOf(rel, text, external)) {
        if (group.some((p) => state.fetched.has(p))) continue;
        if (group.every((p) => probedFailed.has(p))) continue;
        newRefs++;
        await probe(group);
      }
    }
    console.log(`round ${round}: ${newRefs} new reference(s) probed, ${state.fetched.size} file(s) in closure`);
  } while (newRefs > 0);

  // the Cloudflare challenge script rotates on every response — captured once,
  // recorded dynamic (presence-only for the drift probe)
  const cf = "cdn-cgi/challenge-platform/scripts/jsd/main.js";
  if (!state.fetched.has(cf)) {
    const res = await tryFetch(cf);
    if (res.buf) state.fetched.set(cf, { bytes: res.buf.length, sha256: sha256(res.buf), buf: res.buf, dynamic: true });
    else badStatus(res.status, cf);
  } else {
    state.fetched.get(cf).dynamic = true;
  }

  // write every captured file byte-exact at the capture root
  let bytes = 0;
  for (const [rel, rec] of [...state.fetched.entries()].sort()) {
    const abs = path.join(proj, rel);
    if (!path.resolve(abs).startsWith(path.resolve(proj) + path.sep) && path.resolve(abs) !== path.resolve(proj))
      throw new Error(`path escapes capture root: ${rel}`);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, rec.buf);
    bytes += rec.bytes;
  }
  state.bytes = bytes;

  const report = {
    start: state.start,
    origin: state.origin,
    gated: state.gated,
    sessionRenewal: state.sessionRenewal,
    requests: state.requests,
    fetched: state.fetched.size,
    bytes: state.bytes,
    paths: [...state.fetched.keys()].sort(),
    unresolved: state.unresolved.sort((a, b) => a.path.localeCompare(b.path)),
    unreachable: state.unreachable.sort((a, b) => a.path.localeCompare(b.path)),
    external: [...external].sort(),
  };
  fs.writeFileSync(path.join(proj, "_mirror-report.json"), JSON.stringify(report, null, 2) + "\n");

  const files = {};
  for (const [rel, rec] of [...state.fetched.entries()].sort())
    files[rel] = { bytes: rec.bytes, sha256: rec.sha256, ...(rec.dynamic ? { dynamic: true } : {}) };
  fs.mkdirSync(path.join(proj, ".upstream"), { recursive: true });
  fs.writeFileSync(
    path.join(proj, ".upstream", "manifest.json"),
    JSON.stringify({ generated: new Date().toISOString(), origin: ORIGIN, files }, null, 2) + "\n",
  );

  console.log(
    `capture: ${state.fetched.size} file(s), ${bytes} bytes, ${state.requests} request(s), ` +
      `${state.unresolved.length} unresolved (SPA-fallback/404), ${state.unreachable.length} unreachable, ${external.size} external`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
