// derive.mjs — rebuild the derived layers (readable/ + src/ + split-spec.json)
// from the stillwater capture (PLAN §3/§5). STILLWATER — the mill island
// (https://stillwater.zavrenn.chatgpt.site/) is capture-class: a Vite-built
// three.js island game on a *.chatgpt.site deployment (Cloudflare-fronted
// static host, origin root). §0.4 fork-over-mirror was checked on 2026-10-13 —
// no public source repo exists (the page/HTML/JS carry no repository link; a
// GitHub search finds nothing for the project or the slug), so the mirror
// stands. The capture is untouched; every source file is re-hashed against
// .upstream/manifest.json before it is rendered, so a drifted capture fails
// loudly instead of being silently re-derived.
//
// Pipeline:
//   the app bundle       -> pinned prettier 3.9.6 (module API — the CLI
//                           respects .gitignore and can silently echo its
//                           input), single pass verified idempotent
//                           -> readable/assets__index-*.pretty.js; the bundle
//                           is one flat classic script whose modules the build
//                           concatenated, so IDENTIFIABLE VENDOR REGIONS are
//                           claimed as wholeFile sections and everything else
//                           is sliced statement-aligned into src/<tag>-NN.js
//                           at top-level declaration boundaries, ~250-350 line
//                           windows (oversized single declarations stay
//                           whole), exact 2-line provenance header; every
//                           slice is parse-checked with
//                           `node --input-type=module --check -` and
//                           round-trips byte-exact to its readable line range.
//   vendor regions       -> wholeFile sections (vendor rule), never sliced,
//                           content-anchored and asserted against the bundle:
//                             · the Vite modulepreload polyfill (build machinery)
//                             · three.js r186 core (constants .. WebGLRenderer;
//                               statements 1..307 of the pretty — `window.__THREE__ = '186'`)
//                             · the GLTFLoader addon with its KHR_* plugins
//                               (DRACO/KTX2/meshopt hooks; `THREE.GLTFLoader:`)
//                             · the MeshoptDecoder module (embedded wasm;
//                               `var qm = (function () { … WebAssembly … meshopt … })`)
//   the stylesheet       -> readable/assets__index-*.pretty.css, wholeFile
//                           (stylesheet rule: stylesheets are never sliced)
//   the Cloudflare       -> readable/cdn-cgi__challenge-platform__scripts__jsd__main.pretty.js,
//   challenge script        wholeFile (third-party machinery; the file is
//                           recorded `dynamic: true` — it rotates per response)
//   entry document       -> inline <script>/<style> scan (byte ranges + sha256):
//                           index.html carries TWO inline script blocks — the
//                           app's recovery handler (real app code: head
//                           wholeFile + statement-aligned slice) and the
//                           Cloudflare bot-challenge injection (machinery:
//                           wholeFile, never sliced). Twins live in readable/
//                           and the byte ranges are recorded in
//                           readable/index-inline-map.json.
//
// Identifiers in src/ are the bundle's own minified names — the rename
// campaign (PLAN §5) is recorded as an open task in README.md, not claimed
// here. usage: node tools/derive.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const PINNED = "3.9.6";
const MAX_WINDOW = 350;
const TODAY = "2026-10-13";
const ROOT = ""; // capture sits at the repo root (origin root)

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const readLines = (abs) => {
  const t = fs.readFileSync(abs, "utf8");
  const l = t.split("\n");
  if (l.length && l[l.length - 1] === "") l.pop();
  return l;
};
const linesOf = (text) => text.replace(/\n$/, "").split("\n");
const lineOf = (text, offset) => text.slice(0, offset).split("\n").length;

// capture-relative name -> readable twin name (dirs flattened with __)
const tagOf = (capRel) => {
  const rel = capRel.startsWith(ROOT) ? capRel.slice(ROOT.length) : capRel;
  return rel.replace(/\.(js|css)$/i, "").split("/").join("__");
};
const prettyRelFor = (capRel) =>
  "readable/" + tagOf(capRel) + (/\.css$/i.test(capRel) ? ".pretty.css" : ".pretty.js");

// ── pinned prettier (module API, exactly 3.9.6) ─────────────────────────
async function loadPrettier() {
  const candidates = [
    process.env.PRETTIER_MJS,
    path.join(proj, "node_modules", "prettier", "index.mjs"),
    "D:/repos/mirrors/metropolygonia/node_modules/prettier/index.mjs",
  ].filter(Boolean);
  for (const c of candidates) {
    if (!fs.existsSync(c)) continue;
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(path.dirname(c), "package.json"), "utf8"));
      if (pkg.version !== PINNED) continue;
      const mod = (await import(pathToFileURL(c).href)).default;
      if (mod.version === PINNED) return { mod, at: c };
    } catch {
      /* try next */
    }
  }
  throw new Error(`pinned prettier ${PINNED} not found (set PRETTIER_MJS to its index.mjs)`);
}

// single pass + idempotency proof: prettier output must be a fixed point of
// the same call, so audit's one-pass re-render is byte-exact by construction
async function formatOnce(prettier, text, parser) {
  const out = await prettier.format(text, { parser });
  const again = await prettier.format(out, { parser });
  if (again !== out) throw new Error(`prettier ${parser} is not idempotent on this input`);
  return out;
}

// ── parse check: the exact standalone gate (ESM stdin) ──────────────────
function parses(text) {
  const r = spawnSync(process.execPath, ["--input-type=module", "--check", "-"], {
    input: text,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return { ok: r.status === 0, why: (r.stderr || "").trim().split("\n").slice(-3).join(" | ") };
}

// ── markers for titles (top tokens, lowercase; fleet convention) ────────
const STOP = new Set(
  ("function return typeof undefined object string number boolean prototype length value default " +
    "exports import this that with from then else case break continue delete instanceof constructor " +
    "arguments void null true false call apply name type text target window document globalthis self " +
    "require module async await yield static class const let var new for while switch throw try catch " +
    "finally extends super using debugger of in do if has own hasown get set")
    .split(" ")
    .filter(Boolean),
);
function markers(text, n = 2) {
  const code = text.replace(/`[^`]*`|"[^"\n]*"|'[^'\n]*'/g, " ").replace(/\/\/[^\n]*/g, " ");
  const counts = new Map();
  for (const m of code.matchAll(/[A-Za-z][A-Za-z0-9_]{2,}/g)) {
    const w = m[0].toLowerCase();
    if (STOP.has(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n);
}
const markerText = (ms) => ms.map(([w, c]) => `${w}(${c})`).join(", ");

// ── windowize: cut only at statement starts; ≤350 lines, a single ───────
// ── oversized declaration is a window of its own ────────────────────────
function windowize(stmts) {
  const out = [];
  let cur = null;
  for (const s of stmts) {
    if (!cur) {
      cur = { first: s, last: s, count: 1, startLine: s.startLine, endLine: s.endLine };
      continue;
    }
    const projected = s.endLine - cur.startLine + 1;
    if (projected > MAX_WINDOW) {
      out.push(cur);
      cur = { first: s, last: s, count: 1, startLine: s.startLine, endLine: s.endLine };
    } else {
      cur.last = s;
      cur.count++;
      cur.endLine = s.endLine;
    }
  }
  if (cur) out.push(cur);
  return out;
}

// ── inline block scan (byte-exact, over the raw entry buffer) ───────────
function scanBlocks(buf) {
  const blocks = [];
  for (const [open, close, kind] of [
    ["<script", "</script", "script"],
    ["<style", "</style", "style"],
  ]) {
    let p = 0;
    let n = 0;
    while (true) {
      const i = buf.indexOf(open, p);
      if (i < 0) break;
      const after = buf[i + open.length];
      const boundary =
        after === 0x3e || after === 0x2f || after === 0x20 || after === 0x09 || after === 0x0a || after === 0x0d;
      if (!boundary) {
        p = i + open.length;
        continue;
      }
      const tagEnd = buf.indexOf(">", i);
      if (tagEnd < 0) break;
      const j = buf.indexOf(close, tagEnd + 1);
      if (j < 0) throw new Error(`unterminated <${kind}> opened at byte ${i}`);
      const tag = buf.subarray(i, tagEnd + 1).toString("utf8");
      const external = /\bsrc\s*=\s*["']/i.test(tag);
      if (external) {
        blocks.push({ kind, external: true, tag, openStart: i, contentStart: tagEnd + 1, contentEnd: j });
      } else {
        n++;
        const content = buf.subarray(tagEnd + 1, j);
        blocks.push({
          kind: /\btype\s*=\s*["']importmap["']/i.test(tag) ? "importmap" : kind,
          external: false,
          block: n,
          tag,
          openStart: i,
          contentStart: tagEnd + 1,
          contentEnd: j,
          bytes: content.length,
          sha256: sha256(content),
          text: content.toString("utf8"),
        });
      }
      p = j + close.length;
    }
  }
  return blocks.sort((a, b) => a.openStart - b.openStart);
}

// ── Cloudflare injection detection (inline block / captured file) ───────
const isCfMachinery = (t) => /challenge-platform/.test(t) || /__CF\$cv\$params/.test(t);

// ── bundle vendor anchors (content-anchored; a missing anchor fails) ────
const ANCHOR = {
  polyfill: (t) => /modulepreload/.test(t) && /relList/.test(t),
  threeFirst: (t) => /LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2/.test(t),
  threeLast: (t) => /isWebGLRenderer/.test(t) && /WebGL 1 is not supported since r163/.test(t),
  gltfFirst: (t) => /setDRACOLoader/.test(t) && /setKTX2Loader/.test(t) && /setMeshoptDecoder/.test(t),
  gltfLast: (t) => /OPAQUE: `OPAQUE`, MASK: `MASK`, BLEND: `BLEND`/.test(t),
  meshopt: (t) => /WebAssembly/.test(t) && /meshopt/i.test(t) && /\bvar \w+ = \(function \(\) \{/.test(t),
};

const WHOLE_FILE = {
  // the Cloudflare challenge script: third-party machinery, whole-file
  "cdn-cgi__challenge-platform__scripts__jsd__main": {
    title:
      "cdn-cgi__challenge-platform__scripts__jsd__main — Cloudflare bot-challenge script (third-party machinery, whole-file, never sliced)",
    desc:
      "The Cloudflare bot-challenge script the entry document's injected inline block loads (`/cdn-cgi/challenge-platform/scripts/jsd/main.js`) — Cloudflare machinery, not app code; the deployment rotates it per response (recorded `dynamic: true`), so it is indexed whole-file in readable/ and never sliced or rewritten.",
    guard: (t) => /_cf_chl_opt/.test(t),
    what: "Cloudflare bot-challenge script",
  },
};

async function main() {
  const { mod: prettier, at } = await loadPrettier();
  console.log(`pinned prettier ${PINNED} (${at})`);

  const manifest = JSON.parse(fs.readFileSync(path.join(proj, ".upstream", "manifest.json"), "utf8"));
  const captured = Object.keys(manifest.files).map((r) => r.split(path.sep).join("/")).sort();
  const captureBytes = (rel) => {
    const abs = path.join(proj, rel);
    if (!fs.existsSync(abs)) throw new Error(`capture file missing: ${rel}`);
    const buf = fs.readFileSync(abs);
    if (sha256(buf) !== manifest.files[rel].sha256)
      throw new Error(`${rel} on disk does not match .upstream/manifest.json — re-verify the capture first`);
    return buf;
  };

  const readableDir = path.join(proj, "readable");
  const srcDir = path.join(proj, "src");
  fs.mkdirSync(readableDir, { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });
  const written = { readable: new Set(), src: new Set() };

  const sources = [];
  const sections = [];
  const notRendered = [];
  const inlineFiles = [];
  let slicedTotal = 0;

  const jsRelsAll = captured.filter((r) => /\.js$/i.test(r));
  const cssRels = captured.filter((r) => /\.css$/i.test(r));
  const htmlRels = captured.filter((r) => /\.html$/i.test(r));
  // the app bundle is the sliced entry point; the Cloudflare script whole-files
  const bundleRel = jsRelsAll.find((r) => /^assets\/index-.*\.js$/.test(r));
  if (!bundleRel) throw new Error("no app bundle found in the capture (assets/index-*.js)");
  const cfRels = jsRelsAll.filter(isCfMachinery);
  if (!bundleRel || jsRelsAll.length !== 1 + cfRels.length)
    throw new Error(`unexpected captured .js set: ${jsRelsAll.join(", ")}`);

  // ── 1) JS: Cloudflare machinery -> wholeFile; the app bundle -> slices ──
  for (const rel of jsRelsAll) {
    const buf = captureBytes(rel);
    const text = buf.toString("utf8");
    if (!Buffer.from(text, "utf8").equals(buf)) throw new Error(`${rel} does not round-trip through utf8`);
    const pretty = await formatOnce(prettier, text, "babel");
    if (pretty === text)
      throw new Error(`${rel}: prettier output is byte-identical to the capture — nothing to derive`);
    const sourceFile = prettyRelFor(rel);
    fs.writeFileSync(path.join(proj, sourceFile), pretty);
    written.readable.add(path.basename(sourceFile));
    const lines = linesOf(pretty);
    const tag = tagOf(rel);

    if (rel !== bundleRel) {
      const cls = WHOLE_FILE[tag];
      if (!cls) throw new Error(`${rel}: no whole-file class recorded for a non-bundle JS capture`);
      if (cls.guard && !cls.guard(pretty))
        throw new Error(`${rel}: whole-file guard failed — readable changed shape`);
      sections.push({
        file: `${tag}-vendor.js`,
        wholeFile: true,
        title: cls.title,
        desc: `Lines 1-${lines.length} of ${sourceFile}: ${cls.desc}`,
        note: "whole-file (third-party machinery rule): indexed in readable/, never sliced",
        startLine: 1,
        endLine: lines.length,
        sourceFile,
      });
      sources.push({
        sourceFile,
        capture: rel,
        captureKind: "file",
        captureSha256: manifest.files[rel].sha256,
        captureBytes: buf.length,
        prettyLines: lines.length,
        prettyBytes: Buffer.byteLength(pretty, "utf8"),
        prettyPasses: 1,
        idempotent: true,
        tag,
        slices: 0,
        derived: "readable only (third-party machinery, wholeFile)",
        what: cls.what,
      });
      console.log(`derive: ${rel} -> ${sourceFile} (${lines.length} lines, wholeFile machinery)`);
      continue;
    }

    // ── the app bundle: vendor regions wholeFile, the rest statement-aligned ──
    const dbg = await prettier.__debug.parse(pretty, { parser: "babel" });
    const top = (dbg.ast.program || dbg.ast).body;
    const stmts = top.map((n) => ({
      node: n,
      startLine: lineOf(pretty, n.start),
      endLine: lineOf(pretty, n.end),
      text: pretty.slice(n.start, n.end),
    }));
    for (let i = 1; i < stmts.length; i++)
      if (stmts[i].startLine <= stmts[i - 1].endLine)
        throw new Error(`${rel}: statements ${i - 1}/${i} share a line — cannot slice at line boundaries`);

    const findAfter = (from, pred) => {
      for (let i = from + 1; i < stmts.length; i++) if (pred(stmts[i].text)) return i;
      return -1;
    };
    const iPoly = stmts.findIndex((s) => ANCHOR.polyfill(s.text));
    if (iPoly !== 0) throw new Error(`${rel}: first statement is not the Vite modulepreload polyfill`);
    const iThreeA = findAfter(iPoly, ANCHOR.threeFirst);
    const iThreeB = findAfter(iThreeA, ANCHOR.threeLast);
    const iGltfA = findAfter(iThreeB, ANCHOR.gltfFirst);
    const iGltfB = findAfter(iGltfA, ANCHOR.gltfLast);
    const iMesh = findAfter(iGltfB, ANCHOR.meshopt);
    if (iThreeA !== iPoly + 1)
      throw new Error(`${rel}: three.js core does not directly follow the polyfill (statement ${iThreeA})`);
    if ([iThreeB, iGltfA, iGltfB, iMesh].some((i) => i < 0))
      throw new Error(
        `${rel}: vendor anchors not found (three=${iThreeB}, gltf=${iGltfA}..${iGltfB}, meshopt=${iMesh}) — readable changed shape`,
      );
    if (iGltfA <= iThreeB + 1) throw new Error(`${rel}: no app code between three.js core and the GLTF addon`);
    if (iMesh <= iGltfB + 1) throw new Error(`${rel}: no app code between the GLTF addon and the meshopt decoder`);
    const appBetween = stmts
      .slice(iThreeB + 1, iGltfA)
      .map((s) => s.text)
      .join("\n");
    if (!/stillwater-assets/.test(appBetween))
      throw new Error(`${rel}: app resume anchor (stillwater-assets meta reader) not found after the three.js core`);
    const threeText = lines.slice(stmts[iThreeA].startLine - 1, stmts[iThreeB].endLine).join("\n");
    for (const [re, what] of [
      [/isWebGLRenderer/, "WebGLRenderer"],
      [/window\.__THREE__ = `186`/, "three.js revision 186 registration"],
      [/THREE\.WebGLRenderer:/, "WebGLRenderer error strings"],
      [/#include </, "shader chunk include tables"],
      [/gl_FragColor/, "shader source chunks"],
      [/WebGLProgram/, "WebGLProgram"],
    ])
      if (!re.test(threeText)) throw new Error(`${rel}: three.js region guard failed (${what}) — readable changed shape`);
    if (/stillwater-assets|woodland|alder|fern1/.test(threeText))
      throw new Error(`${rel}: app string found inside the claimed three.js region — boundary is wrong`);
    const gltfText = lines.slice(stmts[iGltfA].startLine - 1, stmts[iGltfB].endLine).join("\n");
    for (const [re, what] of [
      [/THREE\.GLTFLoader:/, "GLTFLoader"],
      [/KHR_DRACO_MESH_COMPRESSION/, "DRACO mesh compression plugin"],
      [/KHR_TEXTURE_TRANSFORM/, "texture transform plugin"],
      [/setMeshoptDecoder/, "meshopt hook"],
    ])
      if (!re.test(gltfText)) throw new Error(`${rel}: GLTF addon guard failed (${what}) — readable changed shape`);
    const meshText = stmts[iMesh].text;
    for (const [re, what] of [
      [/WebAssembly/, "embedded wasm"],
      [/meshopt/i, "meshopt decoder"],
    ])
      if (!re.test(meshText)) throw new Error(`${rel}: meshopt region guard failed (${what}) — readable changed shape`);

    const specials = [];
    const covered = new Array(stmts.length).fill(false);
    const claim = (a, b, block) => {
      if (a < 0 || b < a || b >= stmts.length) throw new Error(`${rel}: bad ${block.file} range ${a}-${b}`);
      for (let i = a; i <= b; i++) {
        if (covered[i]) throw new Error(`${rel}: ${block.file} overlaps another block at statement ${i}`);
        covered[i] = true;
      }
      specials.push({ ...block, A: stmts[a].startLine, B: stmts[b].endLine });
    };
    claim(iPoly, iPoly, {
      kind: "whole",
      file: `${tag}-polyfill-machinery.js`,
      title: `${tag} — Vite modulepreload polyfill (build machinery, whole-file, never sliced)`,
      body: "the Vite-generated modulepreload polyfill IIFE (`link[rel=modulepreload]` relList.supports check + fetch warm-up) — build machinery, not app code; indexed whole-file in readable/, never sliced.",
    });
    claim(iThreeA, iThreeB, {
      kind: "whole",
      file: `${tag}-three-vendor.js`,
      title: `${tag} — bundled three.js r186 core (vendor region, whole-file, never sliced)`,
      body:
        "the bundled three.js r186 engine core (constants, math, color management, textures, geometries, " +
        "materials, shader chunk/lib tables, objects, the `window.__THREE__` revision-186 registration and the " +
        "WebGLRenderer) — vendor, not app code. Vendor rule — indexed whole-file in readable/, never sliced or " +
        "rewritten.",
    });
    claim(iGltfA, iGltfB, {
      kind: "whole",
      file: `${tag}-gltf-vendor.js`,
      title: `${tag} — bundled GLTFLoader addon with its KHR_* plugins (vendor region, whole-file, never sliced)`,
      body:
        "the three.js examples/jsm GLTFLoader the build inlined (the Loader subclass with its DRACOLoader/KTX2/" +
        "meshopt hooks, `THREE.GLTFLoader:` error strings, the KHR_* plugin classes and their OPAQUE/MASK/BLEND " +
        "material enum) — vendor, not app code. Vendor rule — indexed whole-file in readable/, never sliced or " +
        "rewritten.",
    });
    claim(iMesh, iMesh, {
      kind: "whole",
      file: `${tag}-meshopt-vendor.js`,
      title: `${tag} — bundled MeshoptDecoder module with embedded wasm (vendor region, whole-file, never sliced)`,
      body:
        "the meshoptimizer decoder module the build inlined (its own minified runtime plus the embedded wasm " +
        "loaded through `WebAssembly.instantiate`) that the app hands to the GLTFLoader via " +
        "`setMeshoptDecoder` — vendor, not app code. Vendor rule — indexed whole-file in readable/, never sliced " +
        "or rewritten.",
    });

    // runs of uncovered statements -> windows
    const runs = [];
    for (let i = 0; i < stmts.length; i++) {
      if (covered[i]) continue;
      const run = [stmts[i]];
      while (i + 1 < stmts.length && !covered[i + 1]) run.push(stmts[++i]);
      runs.push(run);
    }
    const slices = [];
    for (const run of runs) for (const w of windowize(run)) slices.push(w);

    // blocks in line order, then re-tile so every line of the pretty is owned
    const blocks = [...specials, ...slices.map((w) => ({ kind: "slice", A: w.startLine, B: w.endLine, count: w.count }))];
    blocks.sort((a, b) => a.A - b.A);
    for (let i = 0; i < blocks.length; i++) {
      if (i === 0) blocks[i].A = 1;
      if (i + 1 < blocks.length) blocks[i].B = blocks[i + 1].A - 1;
      else blocks[i].B = lines.length;
    }

    let nn = 0;
    let perFileVendor = 0;
    for (const b of blocks) {
      if (b.kind === "slice") {
        nn++;
        const num = String(nn).padStart(2, "0");
        const body = lines.slice(b.A - 1, b.B).join("\n") + "\n";
        const ms = markers(body);
        const topWord = ms.length ? ms[0][0] : /^\s*import\b/.test(body) ? "imports" : tag.toLowerCase();
        const oversized = b.count === 1 && b.B - b.A + 1 > MAX_WINDOW;
        const file = `${tag}-${num}.js`;
        const sliceText =
          `// ${tag} ${num} — ${topWord}\n` +
          `// Lines ${b.A}-${b.B} of ${sourceFile} (statement-aligned).\n` +
          body;
        const chk = parses(sliceText);
        if (!chk.ok) throw new Error(`generated src/${file} does not parse standalone: ${chk.why}`);
        fs.writeFileSync(path.join(srcDir, file), sliceText);
        written.src.add(file);
        sections.push({
          file,
          title: `${tag} ${num} — ${topWord}`,
          desc: `${oversized ? "Oversized single declaration (kept whole). " : ""}Lines ${b.A}-${b.B}. Markers: ${markerText(ms)}.`,
          startLine: b.A,
          endLine: b.B,
          sourceFile,
        });
      } else {
        perFileVendor++;
        sections.push({
          file: b.file,
          wholeFile: true,
          title: b.title,
          desc: `Lines ${b.A}-${b.B} of ${sourceFile}: ${b.body}`,
          note: "whole-file region (vendor/machinery rule): indexed in readable/, never sliced",
          startLine: b.A,
          endLine: b.B,
          sourceFile,
        });
      }
    }
    slicedTotal += nn;
    sources.push({
      sourceFile,
      capture: rel,
      captureKind: "file",
      captureSha256: manifest.files[rel].sha256,
      captureBytes: buf.length,
      prettyLines: lines.length,
      prettyBytes: Buffer.byteLength(pretty, "utf8"),
      prettyPasses: 1,
      idempotent: true,
      tag,
      statements: stmts.length,
      slices: nn,
      derived: `readable + ${nn} statement-aligned slice(s) + ${perFileVendor} wholeFile vendor region(s)`,
    });
    console.log(
      `derive: ${rel} -> ${sourceFile} (${lines.length} lines, ${stmts.length} stmts, ${nn} slices, ${perFileVendor} wholeFile vendor regions)`,
    );
  }

  // ── 2) CSS: readable pretty, wholeFile section (stylesheet rule) ────────
  for (const rel of cssRels) {
    const buf = captureBytes(rel);
    const text = buf.toString("utf8");
    const pretty = await formatOnce(prettier, text, "css");
    if (pretty === text) throw new Error(`${rel}: prettier output is byte-identical to the capture`);
    const sourceFile = prettyRelFor(rel);
    fs.writeFileSync(path.join(proj, sourceFile), pretty);
    written.readable.add(path.basename(sourceFile));
    const lines = linesOf(pretty);
    const tag = tagOf(rel);
    sections.push({
      file: `${tag}.css`,
      wholeFile: true,
      title: `${tag} — stylesheet (whole-file, never sliced)`,
      desc: `Lines 1-${lines.length} of ${sourceFile}. Whole-file (stylesheet rule): the capture stylesheet is indexed whole in readable/, never sliced.`,
      note: "whole-file (stylesheet, not sliced): CSS is indexed whole in readable/",
      startLine: 1,
      endLine: lines.length,
      sourceFile,
    });
    sources.push({
      sourceFile,
      capture: rel,
      captureKind: "file",
      captureSha256: manifest.files[rel].sha256,
      captureBytes: buf.length,
      prettyLines: lines.length,
      prettyBytes: Buffer.byteLength(pretty, "utf8"),
      prettyPasses: 1,
      idempotent: true,
      tag,
      slices: 0,
      derived: "readable only (stylesheet, wholeFile)",
    });
    console.log(`derive: ${rel} -> ${sourceFile} (${lines.length} lines, wholeFile stylesheet)`);
  }

  // ── 3) entry document: inline <script>/<style> twins + map ─────────────
  const inlineMap = {
    note:
      "Content blocks of every inline <script>/<style> in the captured HTML documents. byteStart/byteEnd are content offsets (tags excluded, end exclusive) into the source document; sha256 is over those exact bytes. Real JS/CSS blocks are rendered to a readable twin with pinned prettier 3.9.6 (module API, single pass verified idempotent); the Cloudflare bot-challenge block is third-party machinery and is indexed wholeFile, never sliced. External references (script src=, link rel=stylesheet) are not blocks.",
    blocks: [],
    sources: [],
  };
  for (const rel of htmlRels) {
    const buf = captureBytes(rel);
    const blocks = scanBlocks(buf);
    const inline = blocks.filter((b) => !b.external);
    const external = blocks.filter((b) => b.external);
    inlineFiles.push(rel);
    for (const b of external)
      console.log(`derive: ${rel}: external ${b.kind} (not derived): ${b.tag.slice(0, 90)}`);
    const entryRec = {
      source: rel,
      sourceBytes: buf.length,
      sourceSha256: manifest.files[rel].sha256,
      scripts: inline.filter((b) => b.kind === "script").length,
      styles: inline.filter((b) => b.kind === "style").length,
      dataBlocks: 0,
      externalScripts: external.filter((b) => b.kind === "script").map((b) => b.tag),
      blocks: [],
    };
    if (!inline.length) {
      console.log(`derive: ${rel}: no inline <script>/<style> content blocks — no inline twins`);
      continue;
    }
    const entryTag = rel.replace(/\.html$/i, "").split("/").join("__");
    for (const b of inline) {
      const isImportmap = b.kind === "importmap";
      const parser = isImportmap ? "json" : b.kind === "style" ? "css" : "babel";
      const DATA_TYPES = new Set(["application/ld+json", "application/json", "importmap", "speculationrules"]);
      const type = (/\btype\s*=\s*["']?([^"'\s>]+)/i.exec(b.tag)?.[1] ?? "").toLowerCase();
      if (parser === "script" && DATA_TYPES.has(type)) {
        notRendered.push({
          capture: rel,
          kind: "inline-data",
          type,
          byteStart: b.contentStart,
          byteEnd: b.contentEnd,
          bytes: b.bytes,
          sha256: b.sha256,
          rendered: false,
          reason: `typed data block (<script type="${type}">) — data, not JS/CSS; recorded with range + sha256, no pretty pass`,
        });
        continue;
      }
      const tag = `${entryTag}-inline-${b.block}`;
      const twinExt = isImportmap ? "json" : b.kind === "style" ? "css" : "js";
      const prettyFile = `${tag}.pretty.${twinExt}`;
      const pretty = await formatOnce(prettier, b.text, parser);
      if (pretty === b.text) throw new Error(`readable/${prettyFile} would be byte-identical to its capture source`);
      fs.writeFileSync(path.join(readableDir, prettyFile), pretty);
      written.readable.add(prettyFile);
      const lines = linesOf(pretty);
      const prettyBuf = Buffer.from(pretty, "utf8");
      const sourceFile = `readable/${prettyFile}`;
      inlineMap.blocks.push({
        file: sourceFile,
        source: rel,
        kind: b.kind === "style" ? "style" : isImportmap ? "importmap" : "script",
        block: b.block,
        byteStart: b.contentStart,
        byteEnd: b.contentEnd,
        bytes: b.bytes,
        sha256: b.sha256,
      });
      entryRec.blocks.push({
        kind: b.kind === "style" ? "style" : "code",
        tagOpen: b.tag.split(">")[0] + ">",
        byteStart: b.contentStart,
        byteEnd: b.contentEnd,
        bytes: b.bytes,
        sha256: b.sha256,
        file: sourceFile,
        parsedAs: parser,
        prettyPasses: 1,
        prettyLines: lines.length,
        prettyBytes: prettyBuf.length,
        prettySha256: sha256(prettyBuf),
      });

      if (b.kind !== "script" || isCfMachinery(b.text)) {
        // stylesheet rule / third-party machinery rule: wholeFile, never sliced
        const what = isCfMachinery(b.text)
          ? "Cloudflare bot-challenge injection (third-party machinery; token rotates per response)"
          : "inline block";
        if (isCfMachinery(b.text) && !/_cf_chl_opt|challenge-platform/.test(pretty))
          throw new Error(`${sourceFile}: Cloudflare machinery guard failed — readable changed shape`);
        sections.push({
          file: `${tag}.${twinExt}`,
          wholeFile: true,
          title: `${tag} — ${what} (whole-file, never sliced)`,
          desc: `Lines 1-${lines.length} of ${sourceFile}. Whole-file: the entry document's inline ${b.kind} block (${b.bytes} B at bytes ${b.contentStart}-${b.contentEnd} of ${rel}) is indexed whole and never sliced.`,
          note: `whole-file (${isCfMachinery(b.text) ? "third-party machinery" : "inline block"}, not sliced)`,
          startLine: 1,
          endLine: lines.length,
          sourceFile,
        });
        sources.push({
          sourceFile,
          capture: rel,
          captureKind: `inline-${b.kind}`,
          captureByteStart: b.contentStart,
          captureByteEnd: b.contentEnd,
          captureSha256: b.sha256,
          captureBytes: b.bytes,
          prettyLines: lines.length,
          prettyBytes: prettyBuf.length,
          prettySha256: sha256(prettyBuf),
          prettyPasses: 1,
          idempotent: true,
          tag,
          slices: 0,
          derived: "readable only (inline block, wholeFile)",
        });
        console.log(`derive: ${rel} inline ${b.kind} #${b.block} -> ${sourceFile} (${lines.length} lines, wholeFile)`);
        continue;
      }

      // ── inline app script: statement-aligned slicing ────────────────────
      const dbg = await prettier.__debug.parse(pretty, { parser: "babel" });
      const rootBody = (dbg.ast.program || dbg.ast).body;
      const stmts = rootBody.map((n) => ({
        node: n,
        startLine: lineOf(pretty, n.start),
        endLine: lineOf(pretty, n.end),
        text: pretty.slice(n.start, n.end),
      }));
      if (!stmts.length) throw new Error(`${sourceFile}: no sliceable statements`);
      for (let i = 1; i < stmts.length; i++)
        if (stmts[i].startLine <= stmts[i - 1].endLine)
          throw new Error(`${sourceFile}: statements ${i - 1}/${i} share a line — cannot slice at line boundaries`);

      const specials = [];
      const lastStmt = stmts[stmts.length - 1];
      if (stmts[0].startLine > 1) {
        const headText = lines.slice(0, stmts[0].startLine - 1).join("\n");
        if (!/Keep recovery available/.test(headText))
          throw new Error(`${sourceFile}: head guard failed — readable changed shape`);
        specials.push({
          kind: "whole",
          file: `${tag}-head.js`,
          A: 1,
          B: stmts[0].startLine - 1,
          title: `${tag}-head — recovery handler header comment (whole-file, never sliced)`,
          body: "The inline recovery handler's leading comment (`// Keep recovery available even if the application bundle cannot download.`) — indexed whole-file in readable/, never sliced; the statement below is the src/ slice.",
        });
      }
      if (lastStmt.endLine < lines.length) {
        specials.push({
          kind: "skip",
          file: `${tag}-tail.js`,
          A: lastStmt.endLine + 1,
          B: lines.length,
          title: `${tag}-tail — trailing block close (not sliced)`,
          desc: `Lines ${lastStmt.endLine + 1}-${lines.length}. The inline block's trailing indentation close — carries no statements of its own, so it is indexed only.`,
        });
      }
      const slices = windowize(stmts);
      const blocksAll = [
        ...specials,
        ...slices.map((w) => ({ kind: "slice", A: w.startLine, B: w.endLine, count: w.count })),
      ].sort((a, b) => a.A - b.A);
      for (let i = 0; i < blocksAll.length; i++) {
        if (i === 0) blocksAll[i].A = 1;
        if (i + 1 < blocksAll.length) blocksAll[i].B = blocksAll[i + 1].A - 1;
        else blocksAll[i].B = lines.length;
      }
      let nn = 0;
      let perFileSkipped = 0;
      let perFileWhole = 0;
      for (const bl of blocksAll) {
        if (bl.kind === "slice") {
          nn++;
          const num = String(nn).padStart(2, "0");
          const body = lines.slice(bl.A - 1, bl.B).join("\n") + "\n";
          const ms = markers(body);
          const topWord = ms.length ? ms[0][0] : tag.toLowerCase();
          const file = `${tag}-${num}.js`;
          const sliceText =
            `// ${tag} ${num} — ${topWord}\n` +
            `// Lines ${bl.A}-${bl.B} of ${sourceFile} (statement-aligned).\n` +
            body;
          const chk = parses(sliceText);
          if (!chk.ok) throw new Error(`generated src/${file} does not parse standalone: ${chk.why}`);
          fs.writeFileSync(path.join(srcDir, file), sliceText);
          written.src.add(file);
          sections.push({
            file,
            title: `${tag} ${num} — ${topWord}`,
            desc: `Lines ${bl.A}-${bl.B}. Markers: ${markerText(ms)}.`,
            startLine: bl.A,
            endLine: bl.B,
            sourceFile,
          });
        } else if (bl.kind === "whole") {
          perFileWhole++;
          sections.push({
            file: bl.file,
            wholeFile: true,
            title: bl.title,
            desc: `Lines ${bl.A}-${bl.B} of ${sourceFile}: ${bl.body}`,
            note: "whole-file region (header comment rule): indexed in readable/, never sliced",
            startLine: bl.A,
            endLine: bl.B,
            sourceFile,
          });
        } else {
          perFileSkipped++;
          sections.push({
            file: bl.file,
            skipped: true,
            title: bl.title,
            desc: bl.desc,
            startLine: bl.A,
            endLine: bl.B,
            sourceFile,
            firstLine: lines[bl.A - 1],
            lastLine: lines[bl.B - 1],
          });
        }
      }
      slicedTotal += nn;
      sources.push({
        sourceFile,
        capture: rel,
        captureKind: `inline-${b.kind}`,
        captureByteStart: b.contentStart,
        captureByteEnd: b.contentEnd,
        captureSha256: b.sha256,
        captureBytes: b.bytes,
        prettyLines: lines.length,
        prettyBytes: prettyBuf.length,
        prettySha256: sha256(prettyBuf),
        prettyPasses: 1,
        idempotent: true,
        tag,
        statements: stmts.length,
        slices: nn,
        derived:
          `readable + ${nn} statement-aligned slice(s)` +
          (perFileWhole ? ` + ${perFileWhole} wholeFile region(s)` : "") +
          (perFileSkipped ? ` + ${perFileSkipped} skipped section(s)` : ""),
      });
      console.log(
        `derive: ${rel} inline ${b.kind} #${b.block} -> ${sourceFile} (${lines.length} lines, ${stmts.length} stmts, ${nn} slices, ${perFileWhole} wholeFile, ${perFileSkipped} skipped)`,
      );
    }
    if (entryRec.blocks.length) inlineMap.sources.push(entryRec);
  }
  fs.writeFileSync(path.join(readableDir, "index-inline-map.json"), JSON.stringify(inlineMap, null, 2) + "\n");

  // ── 4) prune orphan derived files (capture untouched) ──────────────────
  let pruned = 0;
  for (const [dir, keep, exts] of [
    [readableDir, written.readable, /\.(pretty\.js|pretty\.css)$/],
    [srcDir, written.src, /\.js$/],
  ]) {
    for (const f of fs.readdirSync(dir)) {
      if (exts.test(f) && !keep.has(f)) {
        fs.rmSync(path.join(dir, f));
        pruned++;
        console.log(`derive: pruned orphan derived file ${path.join(path.basename(dir), f)}`);
      }
    }
  }

  // ── 5) split-spec.json (2-space indent + trailing newline) ─────────────
  const jsSources = sources.filter((s) => s.sourceFile.endsWith(".pretty.js"));
  const cssSources = sources.filter((s) => s.sourceFile.endsWith(".pretty.css"));
  const slicedSources = jsSources.filter((s) => s.slices > 0);
  const firstSlices = sections.filter((s) => !s.wholeFile && !s.skipped);
  const spec = {
    project: "stillwater",
    kind: "statement-aligned-slices",
    defaultFile: `src/${firstSlices[0].file}`,
    note:
      "STILLWATER — the mill island (https://stillwater.zavrenn.chatgpt.site/) is capture-class: a Vite-built " +
      "three.js island game served at the origin root by a *.chatgpt.site static deployment (Cloudflare-fronted). " +
      "§0.4 fork-over-mirror was checked on " +
      TODAY +
      " — no public source repo exists (the page HTML/JS carry no repository link and no source-map URL; a GitHub " +
      "search finds nothing for the project or the slug), so the mirror stands. Derived pipeline: capture → pinned " +
      "prettier 3.9.6 (module API, default options, single pass verified idempotent — never the CLI: it respects " +
      ".gitignore and can silently echo its input) → readable/<name>.pretty.js|css per captured JS/CSS file " +
      "(dirs flattened with __; every pretty provably NOT byte-identical to its capture source) → " +
      "statement-aligned slices src/<tag>-NN.js of the app bundle (top-level declaration boundaries only, " +
      "~250-350 line windows; oversized single declarations stay whole) with an exact 2-line provenance header. " +
      "Every slice parses standalone under `node --input-type=module --check -` and round-trips byte-exact to its " +
      "recorded readable line range. Vendor rule — wholeFile sections, never sliced, all content-anchored and " +
      "asserted: the Vite modulepreload polyfill (build machinery), the three.js r186 core (constants .. " +
      "WebGLRenderer, `window.__THREE__ = '186'`), the bundled GLTFLoader addon with its KHR_* plugins and " +
      "DRACO/KTX2/meshopt hooks, and the MeshoptDecoder module with its embedded wasm. The Cloudflare " +
      "bot-challenge script (cdn-cgi/challenge-platform/scripts/jsd/main.js, recorded `dynamic: true` — it " +
      "rotates per response) is third-party machinery: wholeFile, never sliced. Stylesheet rule: " +
      "assets/index-D7i12YD8.css is wholeFile. Inline <script> scan: index.html carries TWO inline script " +
      "blocks — the app's recovery handler (head comment wholeFile + one statement-aligned slice) and the " +
      "Cloudflare bot-challenge injection (third-party machinery, wholeFile); their byte ranges + sha256 are " +
      "recorded in readable/index-inline-map.json. Identifiers in src/ are the bundle's own minified names — the " +
      "rename campaign (PLAN §5) is recorded as an open task in README.md, not claimed here. Capture bytes are " +
      "untouched by everything above; re-cut with `node tools/derive.mjs` after any capture refresh. " +
      "`node tools/audit.js` is the gate.",
    renderOptions: {
      _default:
        "prettier 3.9.6, module API, default options, single pass (re-format verified idempotent at derive time) — never the CLI: it respects .gitignore and can silently echo its input",
      js: "parser babel, no plugins",
      css: "parser css, no plugins",
      json: "parser json, no plugins (inline importmap blocks, if any)",
    },
    source:
      `readable/: ${jsSources.length} JS pretties (${slicedSources.length} sliced script source(s), ` +
      `${jsSources.length - slicedSources.length} wholeFile machinery/vendor) + ${cssSources.length} CSS pretties; ` +
      `src/: ${slicedSources.reduce((n, s) => n + s.slices, 0)} statement-aligned slices across ${slicedSources.length} script source(s); ` +
      `${sections.filter((s) => s.skipped).length} skipped section(s); ${sections.filter((s) => s.wholeFile).length} wholeFile section(s); ` +
      `capture: ${captured.length} files under .upstream/manifest.json; inline scan: ${inlineFiles.join(", ")} ` +
      `(${inlineMap.sources.reduce((n, s) => n + s.blocks.length, 0)} inline content block(s)); derived ${TODAY}.`,
    inline: {
      scanned: inlineFiles,
      contentBlocks: inlineMap.sources.reduce((n, s) => n + s.blocks.length, 0),
      notRendered: notRendered.length,
      note:
        "index.html carries 2 inline script blocks: #1 the app's recovery handler (real app code — head comment " +
        "wholeFile + one statement-aligned slice) and #2 the Cloudflare bot-challenge injection (third-party " +
        "machinery, wholeFile). No inline <style> blocks exist — the stylesheet is the external asset. Byte ranges " +
        "+ sha256 are recorded in readable/index-inline-map.json.",
    },
    externalDependencies: [],
    sources,
    sections,
    notRendered,
  };
  fs.writeFileSync(path.join(proj, "split-spec.json"), JSON.stringify(spec, null, 2) + "\n");

  // ── 6) self-check (tools/audit.js is the authoritative gate) ────────────
  let bad = 0;
  const bySource = new Map();
  for (const s of sections) {
    if (!bySource.has(s.sourceFile)) bySource.set(s.sourceFile, []);
    bySource.get(s.sourceFile).push(s);
  }
  for (const [sourceFile, list] of bySource) {
    const lines = readLines(path.join(proj, sourceFile));
    const sorted = [...list].sort((a, b) => a.startLine - b.startLine);
    if (sorted[0].startLine !== 1) {
      console.error(`TILING FAIL ${sourceFile}: starts at line ${sorted[0].startLine}`);
      bad++;
    }
    for (let i = 1; i < sorted.length; i++)
      if (sorted[i].startLine !== sorted[i - 1].endLine + 1) {
        console.error(`TILING FAIL ${sourceFile}: gap/overlap at ${sorted[i].file}`);
        bad++;
      }
    if (sorted[sorted.length - 1].endLine !== lines.length) {
      console.error(`TILING FAIL ${sourceFile}: does not reach EOF (${lines.length})`);
      bad++;
    }
  }
  let parsed = 0;
  let ranged = 0;
  let roundOK = 0;
  for (const s of sections) {
    if (s.wholeFile || s.skipped) continue;
    ranged++;
    const abs = path.join(srcDir, s.file);
    const text = fs.readFileSync(abs, "utf8");
    const nl2 = text.indexOf("\n", text.indexOf("\n") + 1);
    const body = text.slice(nl2 + 1);
    const expected = readLines(path.join(proj, s.sourceFile)).slice(s.startLine - 1, s.endLine).join("\n") + "\n";
    if (body !== expected) {
      console.error(`ROUND-TRIP FAIL ${s.file}`);
      bad++;
    } else roundOK++;
    if (!parses(text).ok) {
      console.error(`PARSE FAIL src/${s.file}`);
      bad++;
    } else parsed++;
  }
  let prettyParsed = 0;
  for (const s of sources) {
    if (!s.sourceFile?.endsWith(".pretty.js")) continue;
    if (!parses(fs.readFileSync(path.join(proj, s.sourceFile), "utf8")).ok) {
      console.error(`PARSE FAIL ${s.sourceFile}`);
      bad++;
    } else prettyParsed++;
  }
  console.log(
    `derive: ${written.readable.size} readable file(s), ${written.src.size} src slices ` +
      `(${parsed}/${ranged} parse standalone, ${roundOK}/${ranged} round-trip byte-exact), ` +
      `${sections.filter((s) => s.skipped).length} skipped, ${sections.filter((s) => s.wholeFile).length} wholeFile, ` +
      `${prettyParsed} pretty js parse clean, ${notRendered.length} notRendered, ${pruned} orphan(s) pruned — ` +
      `self-check ${bad ? bad + " FAILURE(S)" : "clean"}`,
  );
  if (bad) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
