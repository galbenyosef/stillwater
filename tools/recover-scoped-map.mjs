// recover-scoped-map.mjs — record the achieved rename map from the committed
// slices. Copied + adapted from the fleet precedent (kettuvellam
// tools/recover-scoped-map.mjs, sunlandia lineage) to stillwater's flat slice
// layout.
//
// The relationship a rename layer must satisfy is exact and invertible:
//
//     committed body  ==  readable range with identifiers substituted
//
// so the map is recovered mechanically, not by re-running the rules: tokenize
// both bodies (comments and whitespace dropped, string/template literals
// atomic), require the non-identifier token streams to be identical, pair the
// identifiers positionally, and every differing pair is a rename. If the
// non-identifier streams disagree the recovery FAILS rather than inventing a
// plausible map — that is the difference between a verified readable layer and
// one that merely looks right.
//
// Record kinds (the games-gamma / sunlandia format):
//   files[name]  -> target           word-boundary: every ELIGIBLE occurrence
//                                    of that spelling in the file was renamed
//   scoped[name] -> [[i, target], …]  token-index addressed: only those
//                                    positions were (a same-spelled binding
//                                    elsewhere in the file keeps its name)
//
// usage: node tools/recover-scoped-map.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokens, classifyTokens, stripCommentHeader } from "./engine/rename-layer.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");

const spec = JSON.parse(fs.readFileSync(path.join(proj, "split-spec.json"), "utf8"));
const ranged = spec.sections.filter((s) => !s.wholeFile && !s.skipped && typeof s.startLine === "number");

const files = {};
const scoped = {};
const summary = {};
let misaligned = 0;
let renamedFiles = 0;

for (const s of ranged) {
  const srcPath = path.join(proj, "src", s.file);
  const prettyLines = fs.readFileSync(path.join(proj, s.sourceFile), "utf8").split(/\r?\n/);
  const base = prettyLines.slice(s.startLine - 1, s.endLine).join("\n") + "\n";
  const committed = stripCommentHeader(fs.readFileSync(srcPath, "utf8").replace(/\r\n/g, "\n"));
  if (base === committed) {
    summary[s.file] = { names: 0, splices: 0, flat: 0, indexed: 0 };
    continue;
  }
  renamedFiles++;
  const a = tokens(base);
  const b = tokens(committed);
  if (a.length !== b.length) {
    console.error(`${s.file}: token count ${a.length} vs ${b.length} — misaligned`);
    misaligned++;
    continue;
  }
  const pairs = [];
  let mismatch = null;
  for (let k = 0; k < a.length; k++) {
    if (a[k].t === b[k].t && a[k].v === b[k].v) continue;
    if (a[k].t === "id" && b[k].t === "id") { pairs.push({ k, from: a[k].v, to: b[k].v }); continue; }
    mismatch = `token ${k}: ${a[k].t}(${JSON.stringify(a[k].v.slice(0, 40))}) vs ${b[k].t}(${JSON.stringify(b[k].v.slice(0, 40))})`;
    break;
  }
  if (mismatch) {
    console.error(`${s.file}: ${mismatch} — not a rename of the readable range`);
    misaligned++;
    continue;
  }
  const { eligible } = classifyTokens(a);
  for (const p of pairs) {
    if (!eligible[p.k]) {
      console.error(`${s.file}: rename at token ${p.k} (${p.from} -> ${p.to}) is not an eligible identifier position`);
      misaligned++;
    }
  }
  // classify: flat when every eligible occurrence of the spelling was renamed
  // to the same target; otherwise per-index records
  const eligibleCount = new Map();
  for (let k = 0; k < a.length; k++)
    if (a[k].t === "id" && eligible[k]) eligibleCount.set(a[k].v, (eligibleCount.get(a[k].v) || 0) + 1);
  const byName = new Map();
  for (const p of pairs) {
    if (!byName.has(p.from)) byName.set(p.from, []);
    byName.get(p.from).push(p);
  }
  const flat = {};
  const indexed = {};
  for (const [from, list] of [...byName.entries()].sort()) {
    const targetsSet = new Set(list.map((p) => p.to));
    if (targetsSet.size === 1 && list.length === (eligibleCount.get(from) || 0)) flat[from] = list[0].to;
    else indexed[from] = list.map((p) => [p.k, p.to]).sort((x, y) => x[0] - y[0]);
  }
  if (Object.keys(flat).length) files[s.file] = Object.fromEntries(Object.entries(flat).sort());
  if (Object.keys(indexed).length) scoped[s.file] = Object.fromEntries(Object.entries(indexed).sort());
  summary[s.file] = {
    names: byName.size,
    splices: pairs.length,
    flat: Object.keys(flat).length,
    indexed: Object.values(indexed).reduce((n, l) => n + l.length, 0),
  };
}

if (misaligned) {
  console.error(`recover-scoped-map: FAILED — ${misaligned} file(s) misaligned; rename-map.json NOT written`);
  process.exit(1);
}

const out = {
  note:
    "Per-file rename maps for stillwater's src/ slices, recovered by token alignment from the committed files " +
    "against their pristine readable ranges (split-spec.json). `files` is word-boundary (every eligible occurrence " +
    "of the spelling was renamed to that target); `scoped` is token-index addressed into the readable range's token " +
    "stream (only those positions were renamed). Recover with tools/recover-scoped-map.mjs; re-checked by " +
    "tools/verify-rename.mjs, tools/check-chunk.mjs and tools/audit.js.",
  rules: "tools/names.json",
  files,
  scoped,
  summary,
};
fs.writeFileSync(path.join(proj, "rename-map.json"), JSON.stringify(out, null, 2) + "\n");

const names = Object.values(summary).reduce((n, s) => n + s.names, 0);
const splices = Object.values(summary).reduce((n, s) => n + s.splices, 0);
const indexed = Object.values(summary).reduce((n, s) => n + s.indexed, 0);
console.log(
  `rename-map.json: ${renamedFiles} renamed file(s) of ${ranged.length}, ${names} name(s), ${splices} splice(s) ` +
    `(${splices - indexed} word-boundary + ${indexed} token-index)`,
);
