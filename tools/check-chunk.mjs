// check-chunk.mjs — whole-bundle gate: did renaming a slice break anything the
// single-file gates cannot see? Copied + adapted from the fleet precedent
// (kettuvellam tools/check-chunk.mjs, desimayhem tools/check-chunk.mjs) to
// stillwater's flat slice layout — here the "chunk" is the whole app bundle.
//
// verify-rename.mjs proves the committed body of each slice is its readable
// range with recorded identifier substitutions. This gate goes one level up,
// for every sourceFile the spec indexes (the app bundle and the inline
// recovery handler):
//
//   1. structural — REVERSING the rename records returns each slice's body to
//      its readable range, and concatenating the sections' texts in line order
//      (reversed slice bodies + wholeFile regions verbatim) must reproduce the
//      readable file byte-for-byte. The bundle the runtime would run is
//      therefore intact after renaming: src/ carries the whole program.
//   2. semantic — concatenating the COMMITTED (renamed) bodies instead must
//      parse as one program with no reference drift and no binding drift
//      against the pristine program: every name still resolves, to the same
//      scope, across the whole bundle. This is the cross-slice "no call was
//      orphaned" check: a top-level declaration renamed in one slice but not
//      at its call sites in another shows up here even though each single file
//      would still verify.
//
// usage: node tools/check-chunk.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifyTokens, tokens } from "./engine/rename-layer.mjs";
import { refDrift, bindingDrift } from "./refcheck.mjs";

/**
 * The PUBLIC names a chunk exports: `export { a, b as c }` -> a and c.
 *
 * The binding-trace comparison below cannot see a lost public name: a
 * shorthand export that was renamed is still a BOUND name, so the trace
 * matches and the gate stays green while every importer of that name breaks.
 * lagoon-tree-village proved it — `i` became LAGOON_LOBES and `a f n p t`
 * became angleToDir/polylinePath/RAD_TO_DEG/resampleCatmullRom/DEG_TO_RAD,
 * with check-chunk reporting "all cross-slice calls resolve". The chunk's
 * public API is part of its contract, so it is compared directly.
 */
function exportedNames(text) {
  const ts = tokens(text);
  const names = new Set();
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i];
    if (t.t !== "id" || t.v !== "export") continue;
    const n1 = ts[i + 1];
    if (!n1) continue;
    if (n1.t === "pun" && n1.v === "{") {
      let end = i + 2;
      while (end < ts.length && !(ts[end].t === "pun" && ts[end].v === "}")) end++;
      let group = [];
      const flush = () => {
        if (!group.length) return;
        // The alias KEYWORD is found BY POSITION, not by value: a chunk can
        // have a local literally named `as`, and then the group is
        // `export { as as o }` — ids = [as, as, o] — where a value-based
        // lookup finds the LOCAL, not the keyword. The engine's own
        // foreignNameIndices is position-based; this must agree with it.
        //   one id            -> shorthand: the local IS the public name
        //   ids[1] === "as"   -> aliased: the public name is ids[2]
        //   otherwise         -> fall back to the last id
        const ids = group.filter((k) => ts[k].t === "id");
        if (ids.length === 1) names.add(ts[ids[0]].v);
        else if (ids.length >= 3 && ts[ids[1]].v === "as") names.add(ts[ids[2]].v);
        else if (ids.length >= 2) names.add(ts[ids.length - 1].v);
        group = [];
      };
      for (let k = i + 2; k < end; k++) {
        if (ts[k].t === "pun" && ts[k].v === ",") flush();
        else group.push(k);
      }
      flush();
      i = end;
    } else if (n1.t === "id" && n1.v === "default") {
      names.add("default");
    } else if (n1.t === "id" && n1.v === "async" && ts[i + 2]?.t === "id" && ts[i + 2].v === "function") {
      // `export async function foo(…) { … }` — the `async` sits between
      // `export` and `function`, so the name is one token further on
      const name = ts[i + 3];
      if (name && name.t === "id") names.add(name.v);
    } else if (n1.t === "id" && n1.v === "*" && ts[i + 2]?.t === "id" && ts[i + 2].v === "as") {
      // `export * as ns from "./x.js"` — the namespace object is the public name
      const name = ts[i + 3];
      if (name && name.t === "id") names.add(name.v);
    } else if (n1.t === "id" && (n1.v === "class" || n1.v === "function")) {
      // `export class Actor { … }` / `export function foo(…) { … }` — an
      // INLINE export is a public name too, and a chunk can use those
      // instead of an export table.
      const name = ts[i + 2];
      if (name && name.t === "id") names.add(name.v);
    } else if (n1.t === "id" && (n1.v === "const" || n1.v === "let" || n1.v === "var")) {
      // `export const a = 1, b = 2` — every declarator is exported. The
      // declarator may have NO INITIALISER (`export let arrowBase;`), so the
      // name is recognised by what FOLLOWS it: `=`, `,`, `;`, `)`, `}`, or
      // the next statement's first token when the statement ended without a
      // semicolon.
      for (let k = i + 2; k < ts.length && k < i + 400; k++) {
        const tk = ts[k];
        if (tk.t === "id") {
          const nx = ts[k + 1];
          const isDeclarator =
            nx &&
            ((nx.t === "pun" && (nx.v === "=" || nx.v === "," || nx.v === ";" || nx.v === ")" || nx.v === "}")) ||
              nx.t === "id");
          if (isDeclarator && tk.v !== "of" && tk.v !== "in") names.add(tk.v);
        }
        if (tk.t === "pun" && tk.v === ";") break;
        if (tk.t === "pun" && tk.v === "}" && ts[k - 1]?.t === "pun" && ts[k - 1].v === "{") break;
      }
    }
  }
  return names;
}

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");

const spec = JSON.parse(fs.readFileSync(path.join(proj, "split-spec.json"), "utf8"));
const rm = fs.existsSync(path.join(proj, "rename-map.json"))
  ? JSON.parse(fs.readFileSync(path.join(proj, "rename-map.json"), "utf8"))
  : { files: {}, scoped: {} };

const linesCache = new Map();
function linesOf(rel) {
  if (!linesCache.has(rel)) linesCache.set(rel, fs.readFileSync(path.join(proj, rel), "utf8").split(/\r?\n/));
  return linesCache.get(rel);
}

// Reconstruct the readable range of a committed slice by reversing its rename
// records. Fails loudly if a slice difference is not explained by the map.
function reverseRecords(rel, base, committed) {
  const flat = rm.files?.[rel] ?? {};
  const scopedRec = rm.scoped?.[rel] ?? {};
  const indexed = new Map();
  for (const [from, hits] of Object.entries(scopedRec))
    for (const [i, target] of hits) indexed.set(i, { from, target });
  if (base === committed) return committed;
  const a = tokens(base);
  const b = tokens(committed);
  if (a.length !== b.length) throw new Error(`${rel}: token count drift (${a.length} vs ${b.length})`);
  const { eligible } = classifyTokens(b);
  let out = "";
  let last = 0;
  for (let k = 0; k < b.length; k++) {
    if (a[k].t !== b[k].t) throw new Error(`${rel}: token kind drift at ${k}`);
    if (a[k].v === b[k].v) continue;
    const sc = indexed.get(k);
    const expectedFrom = sc ? sc.from : Object.keys(flat).find((f) => flat[f] === b[k].v && eligible[k] && a[k].v === f);
    if (!expectedFrom || a[k].v !== expectedFrom || b[k].v !== (sc ? sc.target : flat[expectedFrom]))
      throw new Error(`${rel}: rename at token ${k} (${JSON.stringify(b[k].v)}) is not explained by rename-map.json`);
    if (!eligible[k]) throw new Error(`${rel}: rename at token ${k} sits on an ineligible position`);
    out += committed.slice(last, b[k].s) + a[k].v;
    last = b[k].e;
  }
  return out + committed.slice(last);
}

const bySource = new Map();
for (const s of spec.sections) {
  if (!bySource.has(s.sourceFile)) bySource.set(s.sourceFile, []);
  bySource.get(s.sourceFile).push(s);
}

let failed = 0;
for (const [sourceFile, sections] of [...bySource.entries()].sort()) {
  const secs = [...sections].sort((x, y) => (x.startLine ?? 1) - (y.startLine ?? 1));
  const pristine = fs.readFileSync(path.join(proj, sourceFile), "utf8").replace(/\r\n/g, "\n");

  let pristineText = "";
  let renamedText = "";
  let renamedBodies = 0;
  for (const s of secs) {
    const A = s.startLine ?? 1;
    const B = s.endLine ?? linesOf(sourceFile).length;
    const range = linesOf(sourceFile).slice(A - 1, B).join("\n") + "\n";
    if (s.wholeFile === true || s.skipped === true) {
      pristineText += range;
      renamedText += range; // vendor/machinery is indexed only, never renamed
      continue;
    }
    const committed = fs.readFileSync(path.join(proj, "src", s.file), "utf8").replace(/\r\n/g, "\n");
    const nl1 = committed.indexOf("\n");
    const nl2 = committed.indexOf("\n", nl1 + 1);
    const body = committed.slice(nl2 + 1);
    let reversed;
    try {
      reversed = reverseRecords(s.file, range, body);
    } catch (e) {
      console.error(`${s.file}: ${e.message}`);
      failed++;
      reversed = range;
    }
    if (reversed !== range) failed++;
    pristineText += reversed;
    renamedText += body;
    if (body !== range) renamedBodies++;
  }

  const hasSlices = secs.some((s) => !s.wholeFile && !s.skipped);
  const spliceOK = pristineText === pristine;
  if (!hasSlices) {
    console.log();
    if (!spliceOK) {
      console.log();
      failed++;
    }
    continue;
  }
  const drift = refDrift(renamedText, pristineText);
  const rebound = bindingDrift(renamedText, pristineText);
  const broken = drift ? [...new Set([...drift.extra, ...drift.missing])] : [];
  const resolveOK = broken.length === 0 && !rebound;

  console.log(`${sourceFile}: ${secs.length} section(s), ${renamedBodies} renamed slice(s)`);
  console.log(`  re-splice from reversed src/ byte-identical: ${spliceOK ? "YES" : "NO"}`);
  console.log(`  cross-slice references resolve: ${resolveOK ? "YES" : "NO"}`);
  if (!spliceOK) console.log(`    assembled ${pristineText.length} bytes vs pristine ${pristine.length}`);
  if (broken.length) {
    console.log(`    still called / no longer bound (${broken.length}): ${broken.slice(0, 30).join(", ")}`);
    console.log("    a declaration was renamed but its callers were not (or vice versa).");
  }
  // the chunk's public API: a rename must not move an exported name
  const exportedBefore = exportedNames(pristine);
  const exportedAfter = exportedNames(renamedText);
  const lostExports = [...exportedBefore].filter((n) => !exportedAfter.has(n));
  const gainedExports = [...exportedAfter].filter((n) => !exportedBefore.has(n));

  console.log(
    `  public export names preserved: ${lostExports.length === 0 ? "YES" : "NO"}` +
      ` (${exportedBefore.size} exported, ${gainedExports.length} added)`,
  );
  if (lostExports.length) {
    console.log(`    lost (${lostExports.length}): ${lostExports.slice(0, 30).join(", ")}`);
    console.log("    a renamed binding was re-exported under its own name, so the chunk's public API moved.");
  }
  if (rebound) console.log(`    binding drift at reference ${rebound.at} (${rebound.reason})`);
  if (!spliceOK || !resolveOK || lostExports.length) failed++;
}
console.log(
  failed
    ? `check-chunk: FAILED — ${failed} problem(s)`
    : `check-chunk: ${bySource.size}/${bySource.size} source file(s) re-splice byte-identical, cross-slice references resolve YES`,
);
process.exit(failed ? 1 : 0);
