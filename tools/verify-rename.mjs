// verify-rename.mjs — gate the rename layer for one slice (or all).
// Copied + adapted from the fleet precedent (kettuvellam tools/verify-rename.mjs,
// sunlandia lineage) to stillwater's flat slice layout.
//
//   files[name]  -> target           word-boundary rename (every eligible occurrence)
//   scoped[name] -> [[i, target]]    rename at the exact base token index i
//
// Three gates per file:
//   reproduces — applying the recorded records to the PRISTINE readable range
//                (from split-spec.json + readable/, never from the committed
//                file) must reproduce the committed body byte-exactly. This
//                proves the file is a pure rename of its readable range.
//   references — the committed slice and its base must leave the same set of
//                names unbound. A name unbound in one side only is a rename
//                applied at some references and not others: the slice would
//                not link up when the bundle is re-spliced.
//   bindings  — every identifier reference must resolve to the same *binding*
//                on both sides (scope ids walk identically because the
//                structure matches). Catches a loop/block binding treated as
//                an outer one.
//
// usage: node tools/verify-rename.mjs <src-relative-file> [rename-map.json]
//        node tools/verify-rename.mjs --all [rename-map.json]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyRecords, tokens, classifyTokens, stripCommentHeader } from "./engine/rename-layer.mjs";
import { unboundNames, bindingDrift } from "./refcheck.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const args = process.argv.slice(2);
const all = args[0] === "--all";
const file = all ? null : args[0];
const mapFile = args[1] || path.join(proj, "rename-map.json");
if (!all && !file) {
  console.error("usage: node tools/verify-rename.mjs <src-relative-file|--all> [rename-map.json]");
  process.exit(1);
}

const rm = JSON.parse(fs.readFileSync(mapFile, "utf8"));
const spec = JSON.parse(fs.readFileSync(path.join(proj, "split-spec.json"), "utf8"));
const sections = new Map(
  spec.sections.filter((s) => !s.wholeFile && !s.skipped && typeof s.startLine === "number").map((s) => [s.file, s]),
);

const targets = all
  ? [...new Set([...Object.keys(rm.files ?? {}), ...Object.keys(rm.scoped ?? {})])].sort()
  : [file];
if (!targets.length) {
  console.error("rename-map.json carries no records");
  process.exit(1);
}

let failed = 0;
for (const rel of targets) {
  const section = sections.get(rel);
  if (!section) { console.error(`no section for ${rel}`); failed++; continue; }
  const flat = rm.files?.[rel] ?? {};
  const scopedRec = rm.scoped?.[rel] ?? {};
  const indexed = new Map();
  for (const [from, hits] of Object.entries(scopedRec)) {
    for (const [i, target] of hits) {
      if (indexed.has(i)) throw new Error(`${rel}: two records address token index ${i}`);
      indexed.set(i, target);
    }
  }
  const prettyLines = fs.readFileSync(path.join(proj, section.sourceFile), "utf8").split(/\r?\n/);
  const base = prettyLines.slice(section.startLine - 1, section.endLine).join("\n") + "\n";
  const committed = stripCommentHeader(fs.readFileSync(path.join(proj, "src", section.file), "utf8").replace(/\r\n/g, "\n"));
  const reproduced = applyRecords(base, flat, indexed);
  const same = reproduced === committed;

  // reference + binding gates on the parseable bodies (the 2-line header is
  // documentation and never part of the base). The slices are windows of ONE
  // program, so cross-slice top-level references are unbound on BOTH sides —
  // the unbound sets are compared modulo the file's own rename records (a
  // target name maps back to the source spelling it replaced), which keeps the
  // gate aimed at what it catches: a rename applied at some references and not
  // others (unbound in one side only, outside the recorded map).
  const canonical = new Map(); // target -> source
  for (const [from, to] of Object.entries(flat)) canonical.set(to, from);
  for (const [from, hits] of Object.entries(scopedRec)) for (const [, to] of hits) canonical.set(to, from);
  const countsOf = (m) => {
    const out = new Map();
    for (const [n, c] of m) {
      const key = canonical.get(n) ?? n;
      out.set(key, (out.get(key) || 0) + c);
    }
    return out;
  };
  const baseUnbound = countsOf(unboundNames(base));
  const fileUnbound = countsOf(unboundNames(committed));
  const extra = [...fileUnbound.keys()].filter((n) => fileUnbound.get(n) !== baseUnbound.get(n));
  const missing = [...baseUnbound.keys()].filter((n) => baseUnbound.get(n) !== fileUnbound.get(n));
  const refsOk = !extra.length && !missing.length;
  const rebound = bindingDrift(committed, base);
  const bindOk = !rebound;

  console.log(rel);
  console.log(`  flat renames    : ${Object.keys(flat).length}`);
  console.log(`  indexed renames : ${[...indexed.keys()].length} occurrence(s)`);
  console.log(`  reproduces file : ${same ? "YES" : "NO"}`);
  if (!same) {
    let i = 0;
    while (i < Math.min(reproduced.length, committed.length) && reproduced[i] === committed[i]) i++;
    console.log(`    first diff at ${i}`);
    console.log("    got :", JSON.stringify(reproduced.slice(Math.max(0, i - 60), i + 90)));
    console.log("    want:", JSON.stringify(committed.slice(Math.max(0, i - 60), i + 90)));
  }
  console.log(`  references ok   : ${refsOk ? "YES" : "NO"}`);
  if (!refsOk) {
    console.log(`    unbound only in file (modulo records): ${extra.join(", ") || "(none)"}`);
    console.log(`    unbound only in base (modulo records): ${missing.join(", ") || "(none)"}`);
  }
  console.log(`  bindings ok     : ${bindOk ? "YES" : "NO"}`);
  if (!bindOk) console.log(`    reference ${rebound.at} resolves to a different binding (${rebound.reason})`);
  if (!same || !refsOk || !bindOk) failed++;

  // the records must only sit on eligible base tokens
  if (!same || !refsOk || !bindOk) continue;
  const toks = tokens(base);
  const { eligible } = classifyTokens(toks);
  for (const i of indexed.keys())
    if (!(toks[i] && toks[i].t === "id" && eligible[i])) {
      console.log(`  record at token ${i} is NOT an eligible identifier position`);
      failed++;
    }
}
if (failed) {
  console.error(`verify-rename: FAILED — ${failed}/${targets.length} file(s)`);
  process.exit(1);
}
console.log(`verify-rename: ${targets.length}/${targets.length} file(s) reproduces YES + references ok YES + bindings ok YES`);
