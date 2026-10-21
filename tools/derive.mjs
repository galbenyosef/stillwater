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
// Pipeline (2026-10-14 structure pass):
//   the app bundle       -> pinned prettier 3.9.6 (module API — the CLI
//                           respects .gitignore and can silently echo its
//                           input), single pass verified idempotent
//                           -> readable/assets__index-*.pretty.js. The bundle
//                           is one flat classic script whose app modules the
//                           build concatenated with NO boundary markers (no
//                           module factory tables, no source-map comments —
//                           verified) so app-module boundaries are not
//                           recoverable; what IS recoverable are the VENDOR
//                           MODULE REGIONS the bundler inlined whole:
//                             · the Vite modulepreload polyfill (build machinery)
//                             · three.js r186 core (constants .. WebGLRenderer)
//                             · three.js examples/jsm loaders/HDRLoader
//                             · three.js examples/jsm postprocessing (Pass,
//                               FullScreenQuad, RenderPass, the GTAO shaders +
//                               PoissonDenoiseShader + SimplexNoise + GTAOPass,
//                               CopyShader, LuminosityHighPassShader,
//                               UnrealBloomPass, OutputShader, OutputPass,
//                               ShaderPass)
//                             · three.js examples/jsm/utils/BufferGeometryUtils
//                             · three.js examples/jsm/utils/SkeletonUtils
//                             · three.js examples/jsm/loaders/GLTFLoader (+ its
//                               KHR_* plugins and the GLTFParser)
//                             · the MeshoptDecoder module with embedded wasm
//                             · three.js examples/jsm/controls/OrbitControls
//                               (handlers extracted to bound functions)
//                             · three.js examples/jsm/objects/Reflector
//                             · three.js examples/jsm/objects/Sky
//                             · three.js examples/jsm/geometries/RoundedBoxGeometry
//                           Every region is a run of consecutive top-level
//                           statements, content-anchored (first/last + region
//                           guard) and claimed as a wholeFile section: indexed
//                           in readable/, never sliced, never renamed. A
//                           changed bundle fails the anchors loudly.
//   the app code         -> statement-aligned slices src/<cluster>-NN.js, cut
//                           only at top-level declaration boundaries and only
//                           WITHIN one semantic cluster (the hand-reviewed
//                           cluster table below: world, water, mill, boat,
//                           keeper, fishing, boot … — the reading recorded per
//                           section in split-spec.json); ≤600-line windows,
//                           an oversized single declaration stays whole.
//                           Exact 2-line provenance header; every slice parses
//                           standalone (`node --input-type=module --check -`)
//                           and round-trips byte-exact to its readable range.
//   the stylesheet       -> readable/assets__index-*.pretty.css, wholeFile
//   the Cloudflare       -> readable/cdn-cgi__challenge-platform__…pretty.js,
//   challenge script        wholeFile (third-party machinery, `dynamic: true`)
//   entry document       -> inline <script>/<style> scan (byte ranges + sha256):
//                           index.html carries TWO inline script blocks — the
//                           app's recovery handler (real app code: head
//                           wholeFile + one statement-aligned slice) and the
//                           Cloudflare bot-challenge injection (machinery:
//                           wholeFile, never sliced). Twins live in readable/
//                           and the byte ranges are recorded in
//                           readable/index-inline-map.json.
//
// Identifiers in the pristine src/ layer are the bundle's own minified names.
// The reviewed semantic rename layer (tools/names.json -> tools/apply-names.mjs,
// recorded in rename-map.json) is applied ON TOP of this pristine layer; a
// rebuild is `node tools/derive.mjs && node tools/apply-names.mjs --all &&
// node tools/recover-scoped-map.mjs` and must be byte-identical to the
// committed src/ layer. usage: node tools/derive.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
// ── --check: prove the committed derived layer is current, writing NOTHING ─
// This tool used to ignore its command line entirely, so `node tools/derive.mjs
// --check` was a full in-place re-derivation: it rewrote readable/ + src/ +
// split-spec.json and (on a mirror whose derive does not re-apply the recorded
// rename map) stripped the rename layer off src/ -- damage that looks
// legitimate, because the files still parse. --check now runs the mirror's
// documented rebuild chain in a throwaway scratch copy OUTSIDE the mirror and
// compares the result with the committed tree; it writes nothing here.
if (process.argv.includes("--check")) {
  const { runDeriveCheck } = await import("./derive-check.mjs");
  process.exit(await runDeriveCheck());
}

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const PINNED = "3.9.6";
const MAX_WINDOW = 600;
const TODAY = "2026-10-14";
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

// ── markers for section descriptions (top tokens, lowercase) ────────────
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

// ── windowize: cut only at statement starts; ≤MAX_WINDOW lines, a single ─
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

// ── bundle vendor/machinery regions ─────────────────────────────────────
// The module boundaries the bundle DOES expose: a vendor module the bundler
// inlined whole (or several inlined back to back) is a run of consecutive
// top-level statements whose content carries the library's own strings. Each
// region is asserted three ways: the first statement must match `first`, the
// region must span exactly `span` statements, the last statement must match
// `last` (when recorded), and every `guard` regex must match the region text.
// Any mismatch fails the derive — a re-shaped readable never slips through.
const REGION_SPECS = [
  {
    id: "vite-modulepreload-polyfill",
    file: "vite-modulepreload-polyfill.js",
    span: 1,
    first: (t) => /modulepreload/.test(t) && /relList/.test(t),
    guard: [/modulepreload/, /relList/],
    title:
      "vite-modulepreload-polyfill.js — Vite modulepreload polyfill (build machinery, whole-file, never sliced)",
    content:
      "The Vite-generated modulepreload polyfill IIFE (`link[rel=modulepreload]` relList.supports check + fetch warm-up) — build machinery, not app code; indexed whole-file in readable/, never sliced.",
    what: "Vite modulepreload polyfill",
  },
  {
    id: "three-core",
    file: "three-core.js",
    span: 307,
    first: (t) => /LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2/.test(t),
    last: (t) => /isWebGLRenderer/.test(t) && /WebGL 1 is not supported since r163/.test(t),
    guard: [
      /window\.__THREE__ = `186`/,
      /THREE\.WebGLRenderer:/,
      /#include </,
      /gl_FragColor/,
      /WebGLProgram/,
    ],
    title: "three-core.js — bundled three.js r186 core (vendor region, whole-file, never sliced)",
    content:
      "The bundled three.js r186 engine core (constants, math, color management, textures, geometries, materials, " +
      "shader chunk/lib tables, objects, the `window.__THREE__` revision-186 registration and the WebGLRenderer) — " +
      "vendor, not app code. Vendor rule — indexed whole-file in readable/, never sliced or rewritten.",
    what: "three.js r186 core",
  },
  {
    id: "three-examples-hdrloader",
    file: "three-examples-hdrloader.js",
    span: 1,
    first: (t) => /THREE\.HDRLoader: Read Error/.test(t),
    guard: [/THREE\.HDRLoader/, /Bad File Format/],
    title:
      "three-examples-hdrloader.js — three.js examples/jsm/loaders/HDRLoader (vendor, whole-file, never sliced)",
    content:
      "The three.js examples HDR/RGBE loader the build inlined (a DataTextureLoader subclass reading RADIANCE " +
      "`.hdr` headers and converting RGBE pixels — `THREE.HDRLoader:` error strings) for the forest-light sky — " +
      "vendor, not app code. Vendor rule — indexed whole-file in readable/, never sliced or rewritten.",
    what: "HDRLoader (three examples)",
  },
  {
    id: "three-examples-postprocessing",
    file: "three-examples-postprocessing.js",
    span: 11,
    first: (t) => /this\.isPass = !0/.test(t) && /this\.needsSwap = !0/.test(t),
    last: (t) => /OutputShader/.test(t) && /shaft\(p,/.test(t),
    guard: [
      /THREE\.Pass: \.render\(\) must be implemented in derived pass\./,
      /GTAOShader/,
      /GTAODepthShader/,
      /GTAOBlendShader/,
      /PoissonDenoiseShader/,
      /CopyShader/,
      /LuminosityHighPassShader/,
      /OutputShader/,
      /this\._fsQuad\.material = this\.material/,
    ],
    title:
      "three-examples-postprocessing.js — bundled three.js examples postprocessing stack (vendor region, whole-file, never sliced)",
    content:
      "The three.js examples/jsm postprocessing modules the build inlined back to back: the Pass base + full-screen " +
      "quad, RenderPass, the GTAO shader objects (GTAOShader/GTAODepthShader/GTAOBlendShader), PoissonDenoiseShader " +
      "and its sample-table helpers, SimplexNoise, GTAOPass, CopyShader, LuminosityHighPassShader, UnrealBloomPass, " +
      "OutputShader, OutputPass and ShaderPass. The minifier's join_vars merged the app's light-field shader " +
      "constants (the full-screen vertex shader, the shaft term table over `yf`, the light-field AABB) into the " +
      "region's final declaration — they are indexed here with it, not sliced. Vendor rule — whole-file in " +
      "readable/, never sliced or rewritten.",
    what: "three.js examples postprocessing stack",
  },
  {
    id: "three-examples-buffergeometryutils",
    file: "three-examples-buffergeometryutils.js",
    span: 3,
    first: (t) => /Set\(Object\.keys\(e\[0\]\.morphAttributes\)\)/.test(t),
    guard: [/THREE\.BufferGeometryUtils/, /toTrianglesDrawMode/],
    title:
      "three-examples-buffergeometryutils.js — three.js examples/jsm/utils/BufferGeometryUtils (vendor, whole-file, never sliced)",
    content:
      "The three.js examples BufferGeometryUtils functions the build retained (mergeGeometries, mergeAttributes and " +
      "toTrianglesDrawMode — `THREE.BufferGeometryUtils.` warning strings) — vendor, not app code. Vendor rule — " +
      "indexed whole-file in readable/, never sliced or rewritten.",
    what: "BufferGeometryUtils (three examples)",
  },
  {
    id: "three-examples-skeletonutils",
    file: "three-examples-skeletonutils.js",
    span: 2,
    first: (t) => /isSkinnedMesh/.test(t) && /bindMatrix/.test(t),
    last: (t) => /e\.children\.length/.test(t),
    guard: [/isSkinnedMesh/, /bindMatrix/, /skeleton\.clone\(\)/],
    title:
      "three-examples-skeletonutils.js — three.js examples/jsm/utils/SkeletonUtils clone (vendor, whole-file, never sliced)",
    content:
      "The three.js examples SkeletonUtils functions the build retained: clone (source/clone lookups, skeleton " +
      "rebinding via bindMatrix) and its parallelTraverse recursion — vendor, not app code. Vendor rule — indexed " +
      "whole-file in readable/, never sliced or rewritten.",
    what: "SkeletonUtils (three examples)",
  },
  {
    id: "three-examples-gltfloader",
    file: "three-examples-gltfloader.js",
    span: 16,
    first: (t) => /setDRACOLoader/.test(t) && /setKTX2Loader/.test(t) && /setMeshoptDecoder/.test(t),
    guard: [
      /THREE\.GLTFLoader:/,
      /KHR_DRACO_MESH_COMPRESSION/,
      /KHR_TEXTURE_TRANSFORM/,
      /GLTFCubicSpline|isInterpolantFactoryMethodGLTFCubicSpline/,
      /DefaultMaterial/,
    ],
    title:
      "three-examples-gltfloader.js — bundled three.js examples GLTFLoader with KHR_* plugins and the GLTFParser (vendor region, whole-file, never sliced)",
    content:
      "The whole three.js examples/jsm GLTFLoader the build inlined: the Loader subclass with its " +
      "DRACOLoader/KTX2Loader/meshopt hooks, the GLTFRegistry, the GLTFParser class, the parser helpers " +
      "(createDefaultMaterial, addUnknownExtensionsToUserData, assignExtrasToUserData, addMorphTargets, " +
      "computeBounds …), the KHR_* plugin classes (DRACO/texture-transform material extensions, the " +
      "OPAQUE/MASK/BLEND material enum) and the WEBGL/ATTRIBUTES constants — vendor, not app code. Vendor rule — " +
      "indexed whole-file in readable/, never sliced or rewritten.",
    what: "GLTFLoader + GLTFParser (three examples)",
  },
  {
    id: "three-examples-meshoptdecoder",
    file: "three-examples-meshoptdecoder.js",
    span: 1,
    first: (t) => /WebAssembly/.test(t) && /meshopt/i.test(t) && /\bvar \w+ = \(function \(\) \{/.test(t),
    guard: [/WebAssembly/, /meshopt/i],
    title:
      "three-examples-meshoptdecoder.js — MeshoptDecoder module with embedded wasm (vendor region, whole-file, never sliced)",
    content:
      "The meshoptimizer decoder module the build inlined (its own minified runtime plus the embedded wasm loaded " +
      "through `WebAssembly.instantiate`) that the app hands to the GLTFLoader via `setMeshoptDecoder` — vendor, " +
      "not app code. Vendor rule — indexed whole-file in readable/, never sliced or rewritten.",
    what: "MeshoptDecoder",
  },
  {
    id: "three-examples-orbitcontrols",
    file: "three-examples-orbitcontrols.js",
    span: 13,
    first: (t) => /WARNING: OrbitControls\.js encountered an unknown camera type/.test(t),
    last: (t) => /_interceptControlUp/.test(t),
    guard: [/OrbitControls\.js/, /NONE: -1/, /_onPointerDown/],
    title:
      "three-examples-orbitcontrols.js — bundled three.js examples OrbitControls (vendor region, whole-file, never sliced)",
    content:
      "The three.js examples OrbitControls the build inlined (Controls subclass, ROTATE/DOLLY/PAN state enum, " +
      "damping, keys and pointer/touch/wheel handling; the pointer handlers were extracted to bound top-level " +
      "functions — `this._onPointerMove = M_.bind(this)` — and stay with the region) — vendor, not app code. " +
      "Vendor rule — indexed whole-file in readable/, never sliced or rewritten.",
    what: "OrbitControls (three examples)",
  },
  {
    id: "three-examples-reflector",
    file: "three-examples-reflector.js",
    span: 2,
    first: (t) => /isReflector/.test(t) && /_reflectionCameras/.test(t),
    last: (t) => /ReflectorShader/.test(t),
    guard: [/isReflector/, /ReflectorShader/, /blendOverlay/],
    title:
      "three-examples-reflector.js — bundled three.js examples Reflector with its shader (vendor region, whole-file, never sliced)",
    content:
      "The three.js examples Reflector the build inlined (the mirror Mesh with its reflection camera rendering " +
      "into a multisampled render target, plus `Reflector.ReflectorShader`) that the pond uses — vendor, not app " +
      "code. Vendor rule — indexed whole-file in readable/, never sliced or rewritten.",
    what: "Reflector (three examples)",
  },
  {
    id: "three-examples-sky",
    file: "three-examples-sky.js",
    span: 2,
    first: (t) => /isSky = !0/.test(t),
    last: (t) => /turbidity/.test(t),
    guard: [/SkyShader/, /turbidity/, /rayleigh/, /cloudCoverage/],
    title:
      "three-examples-sky.js — bundled three.js examples Sky with its shader (vendor region, whole-file, never sliced)",
    content:
      "The three.js examples Sky the build inlined (the sky-dome Mesh plus `Sky.SkyShader` with its turbidity/" +
      "rayleigh/mie uniforms and cloud parameters) — vendor, not app code. Vendor rule — indexed whole-file in " +
      "readable/, never sliced or rewritten.",
    what: "Sky (three examples)",
  },
  {
    id: "three-examples-roundedboxgeometry",
    file: "three-examples-roundedboxgeometry.js",
    span: 1,
    first: (t) => /RoundedBoxGeometry/.test(t) && /toNonIndexed/.test(t),
    guard: [/RoundedBoxGeometry/, /\bparameters\b/],
    title:
      "three-examples-roundedboxgeometry.js — three.js examples/jsm/geometries/RoundedBoxGeometry (vendor, whole-file, never sliced)",
    content:
      "The three.js examples RoundedBoxGeometry the build inlined (`this.type = `RoundedBoxGeometry``, segmented " +
      "rounded-box vertex/normal/uv construction) — vendor, not app code. Vendor rule — indexed whole-file in " +
      "readable/, never sliced or rewritten.",
    what: "RoundedBoxGeometry (three examples)",
  },
];

// ── app clusters ────────────────────────────────────────────────────────
// The app's own module boundaries are NOT recoverable from this bundle (one
// flat classic script, no module markers, no source maps — verified in the
// 2026-10-14 structure pass). The next-best honest structure is a hand-read
// semantic cluster map over the app statements: each cluster is a run of
// consecutive top-level statements, tiled in order (spans must sum to the app
// statement count), and every cluster asserts `expects` regexes over its own
// text so a re-shaped readable fails loudly. Slices are cut inside a cluster
// only. The reading is recorded per section in split-spec.json (`cluster` +
// `content`) so the inference is reviewable, never implied.
const APP_CLUSTERS = [
  // boot utilities that precede the three.js core-adjacent app code
  {
    slug: "boot-utils",
    span: 7,
    title: "asset URL resolver, preferences and the loading overlay",
    expects: [/stillwater\.preferences\.v1/, /loading-message/],
  },
  {
    slug: "light-shafts",
    span: 3,
    title: "the light-shaft field (gaussian footprints) and the cloud-shadow uniforms",
    expects: [/uCloudShadow/, /Math\.exp\(-l \/ \(i\.width \* i\.width\)\)/],
  },
  {
    slug: "weather",
    span: 6,
    title: "the weather cycle (rain/wet/cloud), the breeze shader chunk and the rain-cover shader",
    expects: [/localBreezeDirection/, /uRainCover/],
  },
  {
    slug: "island",
    span: 6,
    title: "the island: height field, shore outline polygon and the shape helpers",
    expects: [/Math\.atan2\(\(t - 0\.4\) \/ 16\.4/, /\[-7, 8\]/],
  },
  {
    slug: "landmarks",
    span: 1,
    title: "the landmark table of the island (named places and their lore lines)",
    expects: [/The old landing/],
  },
  {
    slug: "world-utils",
    span: 4,
    title: "the seeded PRNG, the sun-shadow pass, the shadow-material pass and the grass point scatter",
    expects: [/1831565813/, /7500/],
  },
  {
    slug: "lights",
    span: 1,
    title: "the lighting rig (sun, hemisphere, fill and sky)",
    expects: [/hemisphere: r, fill: i, sky: a/],
  },
  {
    slug: "render-pipeline",
    span: 2,
    title: "the woodland light-field pass and the pond render pipeline (GTAO + bloom + output composer)",
    expects: [/woodland light field/, /setWoodlandLight/],
  },
  {
    slug: "terrain",
    span: 4,
    title: "terrain sampling helpers (walkable height, mask texture and shoreline test)",
    expects: [/Float32Array/],
  },
  {
    slug: "material-tuning",
    span: 1,
    title: "the material tuning pass for the mill timber, leaves and lily pads",
    expects: [/Oak\|Honey oak\|Cedar shingles\|Alder bark/, /waxy-lily-surface/],
  },
  {
    slug: "canopy",
    span: 9,
    title: "the canopy data loader, the leaf shader chunks/materials and the forest instancing",
    expects: [/alder-canopy/, /_leaf_anchor/],
  },
  {
    slug: "placement",
    span: 3,
    title: "prop placement from the world tables (instances, LOD distances, shadow flags)",
    expects: [/LOD/],
  },
  {
    slug: "world-data",
    span: 1,
    title: "the world data table (placements, solids, water, spawn, camera path — the island's authored layout)",
    expects: [/version: 12/],
  },
  {
    slug: "paths",
    span: 4,
    title: "path helpers (distance-along-path, corridor tests, the landing walkway)",
    expects: [/Eh\.points/],
  },
  {
    slug: "scatter",
    span: 7,
    title: "the seeded scatter builders (props, undergrowth, stones) and the value-noise helpers",
    expects: [/cp\(260926\)|cp\(91937\)|cp\(73016\)|cp\(180926\)/],
  },
  {
    slug: "terrain-dressing",
    span: 7,
    title: "terrain dressing: the 1024/256 masks, tree scatter and terrain flattening under the buildings",
    expects: [/new Uint8Array/],
  },
  {
    slug: "waterwheel-kinematics",
    span: 7,
    title: "the waterwheel kinematics: the wheel spec (paddles, angular speed), gate flow and the element times",
    expects: [/paddles/],
  },
  {
    slug: "sluice-state",
    span: 8,
    title: "the sluice gate state tables (foot spots, gate target, spill grid)",
    expects: [/qf\.gate/],
  },
  {
    slug: "sluice-gate",
    span: 2,
    title: "the spring sluice gate and its winch/overflow rig",
    expects: [/Spring sluice sliding gate/, /Porch sluice winch/],
  },
  {
    slug: "mill-interior",
    span: 11,
    title: "the mill interior (constants, palette, daylight bake, doors and the mill rug)",
    expects: [/#E7D6B8/, /Mill rug/],
  },
  {
    slug: "waterwheel-build",
    span: 5,
    title: "the waterwheel build (gear config, rim geometry, materials) and the mill machinery it drives",
    expects: [/Waterwheel-driven mill machinery/, /teeth: 80/],
  },
  {
    slug: "ground-cover",
    span: 1,
    title: "the ground-cover pass",
    expects: [/groundCover: t = !1/],
  },
  {
    slug: "trees",
    span: 5,
    title: "tree instancing and scatter (hash, per-tree variation, LOD selection)",
    expects: [/1\.73|2917/],
  },
  {
    slug: "forest",
    span: 8,
    title: "forest assembly: bounds/chunks, the woodland scatter, distant hills and ridges",
    expects: [/Wooded hills beyond the pond/],
  },
  {
    slug: "grass-meadow",
    span: 5,
    title: "the meadow: canopy loading, curved tufts and the grass clusters",
    expects: [/Curved meadow tuft/],
  },
  {
    slug: "shrubs",
    span: 2,
    title: "shrub, fern and flower scatter",
    expects: [/cp\(270927\)|cp\(290926\)/],
  },
  {
    slug: "view-mode",
    span: 1,
    title: "the view-cycle helper (follow/keeper/explore)",
    expects: [/aboard: t = !1, fishing: n = !1, immersive: r = !1/],
  },
  {
    slug: "collision",
    span: 4,
    title: "collision and movement: obstacle boxes, ground/water tests and the move step",
    expects: [/obstacles: i = \[\]|groundHeight/],
  },
  {
    slug: "world-assembly",
    span: 2,
    title: "world assembly: the LOD name list and the island build order",
    expects: [/tree1_lod/],
  },
  {
    slug: "boat-hull",
    span: 12,
    title: "the boat hull: profile, hull width functions, contact shader and the hull mesh",
    expects: [/hullContact/],
  },
  {
    slug: "water-surface",
    span: 7,
    title: "the pond surface: wave uniforms/shaders, wake damping and the water geometry",
    expects: [/uWaveTime/],
  },
  {
    slug: "waterwheel-motion",
    span: 9,
    title: "waterwheel motion: paddle timing, spill forces and the wheel-impact sheets",
    expects: [/uMillImpacts/],
  },
  {
    slug: "pond-water",
    span: 15,
    title: "the pond water bodies: swell, stream lines, the reflective/refractive pond shader and the mill spill/spring surfaces",
    expects: [/Reflective and refractive pond/, /Woodland spring water/],
  },
  {
    slug: "pond-life",
    span: 10,
    title: "pond life: lily pads, ripples, fish feeding and the fish school",
    expects: [/lilies/, /feed/],
  },
  {
    slug: "fish",
    span: 6,
    title: "the fish: animation, tail shader and the school mesh build",
    expects: [/tailWeight/],
  },
  {
    slug: "birds",
    span: 4,
    title: "the birds (perch flights and wing flutter)",
    expects: [/perch/],
  },
  {
    slug: "shores",
    span: 5,
    title: "the shore dressing: reeds, the pond-side scatter and the falling-birch-leaf system",
    expects: [/reeds/],
  },
  {
    slug: "mill-state",
    span: 12,
    title: "the mill: state machine, doors/bridge, the drivetrain animation and its machinery helpers",
    expects: [/sb\(e\)|1664525/],
  },
  {
    slug: "audio",
    span: 4,
    title: "the audio engine (procedural buffers, loops and the ambient mixer)",
    expects: [/sampleRate/],
  },
  {
    slug: "mill-approach",
    span: 2,
    title: "mill approach paths for the keeper's walk",
    expects: [/arrive: n = !0/],
  },
  {
    slug: "boat-control",
    span: 9,
    title: "boat handling: drifting, the tiller/grip, the outboard and its materials",
    expects: [/Charcoal/, /outboard/i],
  },
  {
    slug: "boat-motion",
    span: 7,
    title: "boat motion: hull contact, water level and keyboard/touch control state",
    expects: [/outboard-v2-/],
  },
  {
    slug: "sky-build",
    span: 1,
    title: "the sky dome build (Sky at 10 km)",
    expects: [/1e4/],
  },
  {
    slug: "keeper-turn",
    span: 12,
    title: "the keeper's turn-in-place animations and the bone map",
    expects: [/KeeperTurn/],
  },
  {
    slug: "keeper-model",
    span: 12,
    title: "the keeper model: GLTF load, resident-motion json, bone rebinding and skinning helpers",
    expects: [/resident-motion/, /FishingKeeper/],
  },
  {
    slug: "keeper-poses",
    span: 15,
    title: "the keeper's pose system (idle/walk/fish poses, hand IK, the mill keeper rig)",
    expects: [/Mill keeper/],
  },
  {
    slug: "keeper-walk",
    span: 16,
    title: "keeper locomotion: chair path, walk-to targets and the locomotion state",
    expects: [/chairPath|heading: Math\.PI \/ 2/],
  },
  {
    slug: "fishing",
    span: 10,
    title: "fishing: rod, line, bobber and the cast/reel states",
    expects: [/Fishing line/],
  },
  {
    slug: "stove",
    span: 3,
    title: "the stove fire (shader, mesh and the contained wood fire)",
    expects: [/Fire behind the stove glass|A small contained wood fire/],
  },
  {
    slug: "keeper-room",
    span: 6,
    title: "the keeper's room and stove, cloth wear, clothing drips and the landing swim ladder",
    expects: [/Landing swim ladder/],
  },
  {
    slug: "boot-ui",
    span: 9,
    title: "boot ui: DOM refs, the loading screen hookup, panel wiring and the error toast",
    expects: [/error.*toast|toast/, /loading-message|getElementById/],
  },
  {
    slug: "renderer",
    span: 21,
    title: "the renderer, scene, lights and cameras (WebGL setup, shadow sun, resize)",
    expects: [/#a5c2cc/, /setPixelRatio/],
  },
  {
    slug: "map-2d",
    span: 6,
    title: "the 2D minimap (canvas, projection and the drawn island map)",
    expects: [/createImageData/],
  },
  {
    slug: "experience",
    span: 16,
    title: "the experience state machine (begin overlay, modes, transitions, HUD/panels)",
    expects: [/experience/, /view-help|view-button/],
  },
  {
    slug: "input",
    span: 19,
    title: "input: the keyboard map, pointer/wheel/drag handling and the drive buttons",
    expects: [/KeyW/, /pointerdown|pointerup/],
  },
  {
    slug: "inspector",
    span: 6,
    title: "the render inspector (debug panel, GPU timer queries, frame counters)",
    expects: [/render-inspector/, /EXT_disjoint_timer_query/],
  },
  {
    slug: "boot",
    span: 4,
    title: "the boot sequence and the frame loop (load, warm-up, error fallback)",
    expects: [/The woodland could not finish loading/],
  },
];

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

  // ── 1) JS: Cloudflare machinery -> wholeFile; the app bundle -> regions + clusters ──
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
      const cls = WHOLE_FILE_JS[tag];
      if (!cls) throw new Error(`${rel}: no whole-file class recorded for a non-bundle JS capture`);
      if (cls.guard && !cls.guard(pretty))
        throw new Error(`${rel}: whole-file guard failed — readable changed shape`);
      sections.push({
        file: cls.file,
        wholeFile: true,
        title: cls.title,
        content: cls.content,
        desc: `Lines 1-${lines.length} of ${sourceFile}.`,
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

    // ── the app bundle: vendor regions wholeFile, app clusters sliced ────
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

    // ── locate every vendor region, in order, by content anchors ────────
    const covered = new Array(stmts.length).fill(false);
    let cursor = 0;
    const regions = [];
    for (const spec of REGION_SPECS) {
      let i = cursor;
      while (i < stmts.length && !spec.first(stmts[i].text)) i++;
      if (i >= stmts.length) throw new Error(`${rel}: vendor region ${spec.id} not found (anchor missed)`);
      if (spec.id === "vite-modulepreload-polyfill" && i !== 0)
        throw new Error(`${rel}: first statement is not the Vite modulepreload polyfill`);
      const j = i + spec.span - 1;
      if (j >= stmts.length) throw new Error(`${rel}: vendor region ${spec.id} runs past EOF`);
      if (spec.last && !spec.last(stmts[j].text))
        throw new Error(`${rel}: vendor region ${spec.id} end anchor missed (last statement is not the recorded module tail)`);
      const regionText = stmts.slice(i, j + 1).map((s) => s.text).join("\n");
      for (const g of spec.guard)
        if (!g.test(regionText)) throw new Error(`${rel}: vendor region ${spec.id} guard failed (${g}) — readable changed shape`);
      for (let k = i; k <= j; k++) {
        if (covered[k]) throw new Error(`${rel}: vendor region ${spec.id} overlaps region before it at statement ${k}`);
        covered[k] = true;
      }
      regions.push({ ...spec, i, j, startLine: stmts[i].startLine, endLine: stmts[j].endLine });
      cursor = j + 1;
    }

    // ── the app statements: tile into the reviewed semantic clusters ─────
    const appIdx = [];
    for (let k = 0; k < stmts.length; k++) if (!covered[k]) appIdx.push(k);
    const spanSum = APP_CLUSTERS.reduce((n, c) => n + c.span, 0);
    if (spanSum !== appIdx.length)
      throw new Error(
        `${rel}: app cluster map covers ${spanSum} statement(s) but the bundle has ${appIdx.length} app statement(s) — re-read the clusters`,
      );
    const clusterOf = new Map(); // statement index -> cluster record
    let p = 0;
    const slices = [];
    for (const c of APP_CLUSTERS) {
      const idxs = appIdx.slice(p, p + c.span);
      const clusterText = idxs.map((k) => stmts[k].text).join("\n");
      for (const e of c.expects)
        if (!e.test(clusterText))
          throw new Error(`${rel}: app cluster ${c.slug} expectation failed (${e}) — readable changed shape`);
      for (const k of idxs) clusterOf.set(k, c);
      p += c.span;
      const windows = windowize(idxs.map((k) => stmts[k]));
      windows.forEach((w, n) => slices.push({ cluster: c, w, ord: n + 1 }));
    }

    // blocks in line order, then re-tile so every line of the pretty is owned
    const blocks = [
      ...regions.map((r) => ({ kind: "whole", region: r, A: r.startLine, B: r.endLine })),
      ...slices.map((s) => ({ kind: "slice", cluster: s.cluster, w: s.w, ord: s.ord, A: s.w.startLine, B: s.w.endLine })),
    ].sort((a, b) => a.A - b.A);
    for (let i = 0; i < blocks.length; i++) {
      if (i === 0) blocks[i].A = 1;
      if (i + 1 < blocks.length) blocks[i].B = blocks[i + 1].A - 1;
      else blocks[i].B = lines.length;
    }

    let nn = 0;
    let perFileVendor = 0;
    let perFileClusters = new Set();
    for (const b of blocks) {
      if (b.kind === "slice") {
        nn++;
        const c = b.cluster;
        perFileClusters.add(c.slug);
        const num = String(b.ord).padStart(2, "0");
        const body = lines.slice(b.A - 1, b.B).join("\n") + "\n";
        const ms = markers(body);
        const oversized = b.w.count === 1 && b.B - b.A + 1 > MAX_WINDOW;
        const file = `${c.slug}-${num}.js`;
        const sliceText =
          `// ${file} — ${c.title}\n` +
          `// Lines ${b.A}-${b.B} of ${sourceFile} (cluster ${c.slug}, statement-aligned).\n` +
          body;
        const chk = parses(sliceText);
        if (!chk.ok) throw new Error(`generated src/${file} does not parse standalone: ${chk.why}`);
        fs.writeFileSync(path.join(srcDir, file), sliceText);
        written.src.add(file);
        sections.push({
          file,
          cluster: c.slug,
          content: c.title,
          title: `${file} — ${c.title}`,
          desc: `${oversized ? "Oversized single declaration (kept whole). " : ""}Lines ${b.A}-${b.B}. Markers: ${markerText(ms)}.`,
          startLine: b.A,
          endLine: b.B,
          sourceFile,
        });
      } else {
        perFileVendor++;
        const r = b.region;
        sections.push({
          file: r.file,
          wholeFile: true,
          title: r.title,
          content: r.content,
          desc: `Lines ${b.A}-${b.B} of ${sourceFile}.`,
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
      vendorRegions: perFileVendor,
      clusters: [...perFileClusters],
      derived:
        `readable + ${nn} statement-aligned slice(s) across ${perFileClusters.size} app cluster(s) + ` +
        `${perFileVendor} wholeFile vendor region(s)`,
    });
    console.log(
      `derive: ${rel} -> ${sourceFile} (${lines.length} lines, ${stmts.length} stmts, ${nn} slices, ` +
        `${perFileClusters.size} app clusters, ${perFileVendor} wholeFile vendor regions)`,
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
      file: "stylesheet.css",
      wholeFile: true,
      title: "stylesheet.css — stylesheet (whole-file, never sliced)",
      content: `The capture stylesheet ${rel} — whole-file (stylesheet rule): indexed whole in readable/, never sliced.`,
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
        const cf = isCfMachinery(b.text);
        const what = cf
          ? "Cloudflare bot-challenge injection (third-party machinery; token rotates per response)"
          : "inline block";
        if (cf && !/_cf_chl_opt|challenge-platform/.test(pretty))
          throw new Error(`${sourceFile}: Cloudflare machinery guard failed — readable changed shape`);
        const file = cf ? "cloudflare-injection.js" : `inline-${b.kind}.js`;
        sections.push({
          file,
          wholeFile: true,
          title: `${file} — ${what} (whole-file, never sliced)`,
          content: `The entry document's inline ${b.kind} block (${b.bytes} B at bytes ${b.contentStart}-${b.contentEnd} of ${rel}) — ${what}. Whole-file: indexed whole and never sliced.`,
          desc: `Lines 1-${lines.length} of ${sourceFile}. Whole-file: the entry document's inline ${b.kind} block (${b.bytes} B at bytes ${b.contentStart}-${b.contentEnd} of ${rel}) is indexed whole and never sliced.`,
          note: `whole-file (${cf ? "third-party machinery" : "inline block"}, not sliced)`,
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
      // The recovery handler is the app's boot-error fallback: one statement
      // plus a header comment (the comment is a wholeFile head section and the
      // statement is the slice), cluster `recovery-handler`.
      const CLUSTER = {
        slug: "recovery-handler",
        title: "the inline recovery handler — the entry document's boot-error fallback",
      };
      const dbg2 = await prettier.__debug.parse(pretty, { parser: "babel" });
      const rootBody = (dbg2.ast.program || dbg2.ast).body;
      const stmts2 = rootBody.map((n) => ({
        node: n,
        startLine: lineOf(pretty, n.start),
        endLine: lineOf(pretty, n.end),
        text: pretty.slice(n.start, n.end),
      }));
      if (!stmts2.length) throw new Error(`${sourceFile}: no sliceable statements`);
      for (let i = 1; i < stmts2.length; i++)
        if (stmts2[i].startLine <= stmts2[i - 1].endLine)
          throw new Error(`${sourceFile}: statements ${i - 1}/${i} share a line — cannot slice at line boundaries`);

      const specials = [];
      const lastStmt = stmts2[stmts2.length - 1];
      if (stmts2[0].startLine > 1) {
        const headText = lines.slice(0, stmts2[0].startLine - 1).join("\n");
        if (!/Keep recovery available/.test(headText))
          throw new Error(`${sourceFile}: head guard failed — readable changed shape`);
        specials.push({
          kind: "whole",
          file: `${CLUSTER.slug}-head.js`,
          A: 1,
          B: stmts2[0].startLine - 1,
          title: `${CLUSTER.slug}-head.js — recovery handler header comment (whole-file, never sliced)`,
          content:
            "The inline recovery handler's leading comment (`// Keep recovery available even if the application bundle cannot download.`) — indexed whole-file in readable/, never sliced; the statement below is the src/ slice.",
        });
      }
      if (lastStmt.endLine < lines.length) {
        specials.push({
          kind: "skip",
          file: `${CLUSTER.slug}-tail.js`,
          A: lastStmt.endLine + 1,
          B: lines.length,
          title: `${CLUSTER.slug}-tail.js — trailing block close (not sliced)`,
          content: `Lines ${lastStmt.endLine + 1}-${lines.length}. The inline block's trailing indentation close — carries no statements of its own, so it is indexed only.`,
        });
      }
      const windows = windowize(stmts2);
      const blocksAll = [
        ...specials,
        ...windows.map((w, n) => ({ kind: "slice", w, ord: n + 1, A: w.startLine, B: w.endLine })),
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
          const num = String(bl.ord).padStart(2, "0");
          const body = lines.slice(bl.A - 1, bl.B).join("\n") + "\n";
          const ms = markers(body);
          const file = `${CLUSTER.slug}-${num}.js`;
          const sliceText =
            `// ${file} — ${CLUSTER.title}\n` +
            `// Lines ${bl.A}-${bl.B} of ${sourceFile} (cluster ${CLUSTER.slug}, statement-aligned).\n` +
            body;
          const chk = parses(sliceText);
          if (!chk.ok) throw new Error(`generated src/${file} does not parse standalone: ${chk.why}`);
          fs.writeFileSync(path.join(srcDir, file), sliceText);
          written.src.add(file);
          sections.push({
            file,
            cluster: CLUSTER.slug,
            content: CLUSTER.title,
            title: `${file} — ${CLUSTER.title}`,
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
            content: bl.content,
            desc: `Lines ${bl.A}-${bl.B} of ${sourceFile}: ${bl.content}`,
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
            content: bl.content,
            desc: bl.content,
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
        statements: stmts2.length,
        slices: nn,
        clusters: [CLUSTER.slug],
        derived:
          `readable + ${nn} statement-aligned slice(s)` +
          (perFileWhole ? ` + ${perFileWhole} wholeFile region(s)` : "") +
          (perFileSkipped ? ` + ${perFileSkipped} skipped section(s)` : ""),
      });
      console.log(
        `derive: ${rel} inline ${b.kind} #${b.block} -> ${sourceFile} (${lines.length} lines, ${stmts2.length} stmts, ${nn} slices, ${perFileWhole} wholeFile, ${perFileSkipped} skipped)`,
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
  const clusterCount = new Set(sections.filter((s) => s.cluster).map((s) => s.cluster)).size;
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
      "(dirs flattened with __; every pretty provably NOT byte-identical to its capture source) → the app bundle " +
      "cut into statement-aligned slices src/<cluster>-NN.js. STRUCTURE (2026-10-14 pass): the bundle is one flat " +
      "classic script with NO module-factory tables and NO source maps (external .map or inline data: URI — both " +
      "verified absent), so the app's own module boundaries are not recoverable; what IS recoverable are the VENDOR " +
      "MODULE REGIONS the bundler inlined whole, each a run of consecutive top-level statements claimed as a " +
      "wholeFile section and content-anchored (first/last statement + region guard): the Vite modulepreload " +
      "polyfill (build machinery), the three.js r186 core (constants .. WebGLRenderer, `window.__THREE__ = '186'`), " +
      "three.js examples HDRLoader, the examples postprocessing stack (Pass/FullScreenQuad/RenderPass, the GTAO " +
      "shader objects, PoissonDenoiseShader, SimplexNoise, GTAOPass, CopyShader, LuminosityHighPassShader, " +
      "UnrealBloomPass, OutputShader, OutputPass, ShaderPass — the merged final declaration also carries the app's " +
      "light-field shader constants), BufferGeometryUtils, SkeletonUtils clone, GLTFLoader with its KHR_* plugins " +
      "and the GLTFParser, the MeshoptDecoder with embedded wasm, OrbitControls, Reflector, Sky and " +
      "RoundedBoxGeometry. Every other top-level statement is app code: it is cut ONLY inside one semantic cluster " +
      "of the reviewed cluster map below (top-level declaration boundaries only, ≤600-line windows, an oversized " +
      "single declaration stays whole), and every cluster asserts its expected content at derive time. Vendors are " +
      "never sliced and never renamed; the Cloudflare bot-challenge script (dynamic: true) is wholeFile machinery; " +
      "assets/index-D7i12YD8.css is wholeFile (stylesheet rule). Inline <script> scan: index.html carries TWO " +
      "inline script blocks — the app's recovery handler (head comment wholeFile + one statement-aligned slice) " +
      "and the Cloudflare bot-challenge injection (wholeFile); byte ranges + sha256 are recorded in " +
      "readable/index-inline-map.json. Identifiers in the pristine src/ layer are the bundle's own minified names; " +
      "the reviewed semantic rename layer (tools/names.json → tools/apply-names.mjs, recorded in rename-map.json) " +
      "is applied on top and gated by tools/verify-rename.mjs + tools/check-chunk.mjs, and the rebuild is " +
      "`node tools/derive.mjs && node tools/apply-names.mjs --all && node tools/recover-scoped-map.mjs`. Capture " +
      "bytes are untouched by everything above; re-cut with `node tools/derive.mjs` after any capture refresh. " +
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
      `src/: ${slicedSources.reduce((n, s) => n + s.slices, 0)} statement-aligned slices across ${clusterCount} app cluster(s); ` +
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
      `${clusterCount} app cluster(s), ${prettyParsed} pretty js parse clean, ${notRendered.length} notRendered, ${pruned} orphan(s) pruned — ` +
      `self-check ${bad ? bad + " FAILURE(S)" : "clean"}`,
  );
  if (bad) process.exit(1);
}

// the Cloudflare challenge script: third-party machinery, whole-file
const WHOLE_FILE_JS = {
  "cdn-cgi__challenge-platform__scripts__jsd__main": {
    file: "cloudflare-challenge-platform.js",
    title:
      "cloudflare-challenge-platform.js — Cloudflare bot-challenge script (third-party machinery, whole-file, never sliced)",
    content:
      "The Cloudflare bot-challenge script the entry document's injected inline block loads (`/cdn-cgi/challenge-platform/scripts/jsd/main.js`) — Cloudflare machinery, not app code; the deployment rotates it per response (recorded `dynamic: true`), so it is indexed whole-file in readable/ and never sliced or rewritten.",
    guard: (t) => /_cf_chl_opt/.test(t),
    what: "Cloudflare bot-challenge script",
  },
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
