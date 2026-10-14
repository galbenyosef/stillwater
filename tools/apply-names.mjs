// apply-names.mjs — apply the reviewed semantic renames to the pristine src/
// slices, at identifier-token spans. Adapted from the fleet precedent
// (kettuvellam tools/apply-names.mjs, sunlandia lineage) to stillwater's flat
// slice layout: a src file is a WINDOW of one classic-script bundle, so its
// top-level scope is a fragment of the bundle's program scope and most
// top-level declarations are referenced by sibling slices.
//
// Two rule kinds (tools/names.json):
//
//   "global": { "<minified>": "<target>" }
//     A program-scope name (declared by some slice, referenced by others) is
//     renamed in EVERY slice: eligible identifiers that resolve to the
//     program scope, or are unbound in this slice (the cross-slice reference
//     case), are renamed. Two hard guards make this safe:
//       · the name must have NO eligible occurrence inside a wholeFile region
//         (vendor/machinery is indexed only, never renamed) — a name that is a
//         vendor binding, or a reference to one, is refused outright;
//       · every program-scope/unbound eligible occurrence in every slice must
//         actually be renamed — a partial application is refused, not shipped.
//
//   "files": { "island-01.js": [ { "scope": "islandHeight", "renames": { … } } ] }
//     Locally-bound identifiers (function/block scope) renamed via scoped
//     rules. `scope` names a function (its own scope); a trailing `:*` widens
//     to everything nested inside it. Rules run top to bottom, re-parsing
//     between groups, so a later rule can address a function an earlier rule
//     already renamed.
//
// Target names must be FRESH: a target that already exists as an identifier
// spelling anywhere in the pristine readable could shadow a binding it does
// not mean (or be shadowed), so it is refused — the only exception is a name
// that is itself being renamed away (checked in the preflight below).
//
// Candidate tokens are intersected with engine/rename-layer.mjs's `eligible`
// set (property accesses, object keys, shorthand properties and foreign
// import/export names are never renamed) so the recovered record can always
// express exactly what was applied.
//
// The base the rules apply to is the pristine readable range (split-spec) —
// never the committed text — so re-running is a function of the review list
// alone. Commit the result, then run tools/recover-scoped-map.mjs.
//
// usage: node tools/apply-names.mjs <src-relative-file> [names.json]
//        node tools/apply-names.mjs --all [names.json]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { tokens, classifyTokens, stripCommentHeader } from "./engine/rename-layer.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const require = createRequire(import.meta.url);
const acorn = (() => {
  try {
    return require(path.join(here, ".deps", "node_modules", "acorn"));
  } catch {
    return require("acorn");
  }
})();

const args = process.argv.slice(2);
const all = args[0] === "--all";
const file = all ? null : args[0];
const namesFile = args[1] || path.join(proj, "tools", "names.json");
if (!all && !file) {
  console.error("usage: node tools/apply-names.mjs <src-relative-file|--all> [names.json]");
  process.exit(1);
}

const rules = JSON.parse(fs.readFileSync(namesFile, "utf8"));
const GLOBAL = rules.global || {};
const PER_FILE = rules.files || {};

const spec = JSON.parse(fs.readFileSync(path.join(proj, "split-spec.json"), "utf8"));
const sections = new Map();
for (const s of spec.sections) {
  if (!s.wholeFile && !s.skipped && typeof s.startLine === "number") sections.set(s.file, s);
}
const wholeFileSections = spec.sections.filter((s) => s.wholeFile && typeof s.sourceFile === "string");

// ── preflight: fresh targets, and globals must name an APP top-level binding ──
// The bundle is ONE program: a spelling refers to exactly one top-level binding
// (the minifier guarantees it). So a global rename is safe iff the name's
// top-level declaration sits in an app window (not in a wholeFile vendor
// region), and a target must not collide with (a) any identifier spelling used
// by the app windows — an app local of that spelling would shadow the renamed
// binding — or (b) any top-level declaration inside a vendor region — the
// rename would merge two bindings. Vendor regions stay minified either way.
{
  const bad = [];
  const targets = new Set();
  for (const [from, to] of Object.entries(GLOBAL)) {
    if (!/^[A-Za-z_$][\w$]*$/.test(to)) bad.push(`global ${from} -> ${to}: not an identifier`);
    if (targets.has(to)) bad.push(`global target ${to} used twice`);
    targets.add(to);
  }
  for (const [f, list] of Object.entries(PER_FILE))
    for (const rule of list)
      for (const [from, to] of Object.entries(rule.renames || {})) {
        if (!/^[A-Za-z_$][\w$]*$/.test(to)) bad.push(`${f}: ${from} -> ${to}: not an identifier`);
        targets.add(to);
      }

  const bundleSection = spec.sections.find((s) => s.sourceFile && /assets__index-.*\.pretty\.js$/.test(s.sourceFile));
  if (bundleSection) {
    const bundleText = fs.readFileSync(path.join(proj, bundleSection.sourceFile), "utf8");
    const bundleLines = bundleText.split(/\r?\n/);
    const lineOf = (o) => bundleText.slice(0, o).split("\n").length;
    const sectionAt = (line) =>
      spec.sections.find((s) => s.sourceFile === bundleSection.sourceFile && line >= s.startLine && line <= s.endLine);
    // top-level declarations of the whole bundle, tagged app vs wholeFile
    let ast;
    try {
      ast = acorn.parse(bundleText, { ecmaVersion: 2023, sourceType: "script" });
    } catch (e) {
      bad.push(`bundle does not parse while preflighting: ${e.message}`);
    }
    const topDecl = new Map(); // name -> section file (or "<uncovered>")
    const declareTop = (name, line) => {
      if (topDecl.has(name)) return;
      const sec = sectionAt(line);
      topDecl.set(name, sec ? sec.file : "<uncovered>");
    };
    const pat = (p, line) => {
      if (!p) return;
      if (p.type === "Identifier") declareTop(p.name, line);
      else if (p.type === "ObjectPattern") for (const q of p.properties) pat(q.type === "RestElement" ? q.argument : q.value, line);
      else if (p.type === "ArrayPattern") for (const q of p.elements) pat(q, line);
      else if (p.type === "AssignmentPattern") pat(p.left, line);
      else if (p.type === "RestElement") pat(p.argument, line);
    };
    for (const st of ast?.body ?? []) {
      const line = lineOf(st.start);
      if (st.type === "FunctionDeclaration" && st.id) declareTop(st.id.name, line);
      else if (st.type === "ClassDeclaration" && st.id) declareTop(st.id.name, line);
      else if (st.type === "VariableDeclaration") for (const d of st.declarations) pat(d.id, line);
    }
    // spellings the app windows use, eligible positions only (property keys and
    // other non-binding namespaces cannot be shadowed by an identifier)
    const appSpellings = new Set();
    for (const s of spec.sections) {
      if (s.wholeFile || s.skipped || typeof s.startLine !== "number") continue;
      if (s.sourceFile !== bundleSection.sourceFile) continue;
      const text = bundleLines.slice(s.startLine - 1, s.endLine).join("\n");
      const toks = tokens(text);
      const { eligible } = classifyTokens(toks);
      for (let k = 0; k < toks.length; k++) if (toks[k].t === "id" && eligible[k]) appSpellings.add(toks[k].v);
    }
    for (const [from] of Object.entries(GLOBAL)) {
      const where = topDecl.get(from);
      if (where === undefined)
        bad.push(`global ${from}: no top-level declaration found in the bundle — remove it from names.json`);
      else if (where === "<uncovered>")
        bad.push(`global ${from}: declared outside every section — the section map is incomplete`);
      else {
        const sec = spec.sections.find((s) => s.file === where);
        if (sec && (sec.wholeFile || sec.skipped))
          bad.push(`global ${from} is declared in wholeFile region ${where} — vendor names are never renamed`);
      }
    }
    // a global must not be REFERENCED inside a bundle wholeFile region either:
    // the region is never renamed, so its references would be orphaned (this is
    // how the meshopt statement's merged app shader — `${q}` — blocks `q`).
    const vendorText = spec.sections
      .filter((s) => s.wholeFile && s.sourceFile === bundleSection.sourceFile)
      .map((s) => bundleLines.slice(s.startLine - 1, s.endLine).join("\n"))
      .join("\n");
    const vendorToks = tokens(vendorText);
    const { eligible: vendorEligible } = classifyTokens(vendorToks);
    const vendorNames = new Set(vendorToks.filter((t, k) => t.t === "id" && vendorEligible[k]).map((t) => t.v));
    for (const [from] of Object.entries(GLOBAL))
      if (vendorNames.has(from))
        bad.push(`global ${from} is referenced as an eligible identifier inside a bundle wholeFile region — the region is never renamed, so the rename cannot be complete`);
    // GLOBAL targets: fresh against the whole app (a program-scope name any
    // window could collide with) and never a wholeFile top-level binding.
    for (const [from, to] of Object.entries(GLOBAL)) {
      if (appSpellings.has(to)) bad.push(`global target ${to} (for ${from}) already used as an identifier in the app windows — choose a fresh name`);
      const where = topDecl.get(to);
      if (where !== undefined) {
        const sec = spec.sections.find((s) => s.file === where);
        if (sec && (sec.wholeFile || sec.skipped))
          bad.push(`global target ${to} is a top-level binding declared in wholeFile region ${where} — renaming onto it would merge bindings`);
      }
    }
    // PER-FILE (scoped) targets: fresh against THAT slice's own eligible
    // spellings (locals cannot interact across slices).
    for (const [f, list] of Object.entries(PER_FILE)) {
      const sec = spec.sections.find((s) => s.file === f);
      if (!sec) bad.push(`names.json lists ${f} which is not a src slice`);
      else {
        const text = bundleLines.slice(sec.startLine - 1, sec.endLine).join("\n");
        const toks = tokens(text);
        const { eligible } = classifyTokens(toks);
        const localSpellings = new Set(toks.filter((t, k) => t.t === "id" && eligible[k]).map((t) => t.v));
        for (const rule of list)
          for (const [from, to] of Object.entries(rule.renames || {})) {
            if (localSpellings.has(to) && to !== from)
              bad.push(`${f}: target ${to} (for ${from}) already used as an eligible identifier in this slice — choose a fresh name`);
          }
      }
    }
  }
  if (bad.length) {
    console.error("apply-names preflight refused:");
    for (const b of bad) console.error("  " + b);
    process.exit(1);
  }
}

// ── scope tree (var/function hoist to the nearest function scope; let/const/
// class stay in their block; unresolved = program-scope reference) ─────────
let current = null;
let programScope = null;
let functionScopes = new Map();
let pendingArrowName = null;
const MARK = new WeakMap(); // node -> owning scope

function declare(name, kind, scope = current, node = null) {
  if (kind === "var" || kind === "function") scope = scope.fnScope;
  if (!scope.names.has(name)) scope.names.set(name, { kind, refs: 0, decls: [] });
  const entry = scope.names.get(name);
  entry.refs++;
  if (node) entry.decls.push([node.start, node.end]);
  return scope;
}
function mark(node, owner) { MARK.set(node, owner); }

function pushScope(fnName, isFunction) {
  const s = { parent: current, fnScope: null, names: new Map(), fnName: fnName ?? null, node: null };
  s.fnScope = isFunction ? s : current.fnScope;
  current = s;
  return s;
}

function isName(node, parent) {
  if (!parent) return false;
  if (parent.type === "MemberExpression" && parent.property === node && !parent.computed) return true;
  if (parent.type === "Property" && parent.key === node) return true;
  if (parent.type === "MethodDefinition" && parent.key === node && !parent.computed) return true;
  if (parent.type === "PropertyDefinition" && parent.key === node && !parent.computed) return true;
  if ((parent.type === "LabeledStatement" || parent.type === "BreakStatement" || parent.type === "ContinueStatement") && parent.label === node) return true;
  if (parent.type === "ImportSpecifier" || parent.type === "ImportDefaultSpecifier" || parent.type === "ImportNamespaceSpecifier") return true;
  if (parent.type === "ExportSpecifier") return true;
  return false;
}
const popScope = () => { const s = current; current = s.parent; return s; };

const SKIP_KEYS = new Set(["type", "start", "end", "loc", "range", "raw"]);
function walk(node, parent) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) { for (const c of node) walk(c, parent); return; }
  if (typeof node.type !== "string") {
    for (const k of Object.keys(node)) if (!SKIP_KEYS.has(k)) walk(node[k], parent);
    return;
  }
  switch (node.type) {
    case "Program": {
      for (const s of node.body) hoist(s);
      for (const s of node.body) walk(s, node);
      return;
    }
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ArrowFunctionExpression": {
      const isDecl = node.type === "FunctionDeclaration";
      if (isDecl && node.id) mark(node.id, declare(node.id.name, "function", current, node.id));
      const scopeKey = node.id?.name ?? pendingArrowName ?? null;
      const outer = pushScope(scopeKey, true);
      outer.node = node;
      if (scopeKey && !functionScopes.has(scopeKey)) functionScopes.set(scopeKey, outer);
      pendingArrowName = null;
      if (!isDecl && node.id) mark(node.id, declare(node.id.name, "function", current, node.id));
      for (const p of node.params) bindPattern(p);
      if (node.body.type === "BlockStatement") {
        for (const s of node.body.body) hoist(s);
        for (const s of node.body.body) walk(s, node);
      } else walk(node.body, node);
      popScope();
      return;
    }
    case "BlockStatement":
    case "StaticBlock": {
      const s = pushScope(parent?.fnName ?? null, false);
      s.node = node;
      for (const st of node.body) hoist(st);
      for (const st of node.body) walk(st, node);
      popScope();
      return;
    }
    case "ForStatement":
    case "ForInStatement":
    case "ForOfStatement": {
      const s = pushScope(parent?.fnName ?? null, false);
      s.node = node;
      if (node.init && node.init.type !== "VariableDeclaration") walk(node.init, node);
      else if (node.init) { for (const d of node.init.declarations) bindPattern(d.id, node.init.kind); walk(node.init, node); }
      if (node.left && node.left.type !== "VariableDeclaration") bindPattern(node.left, "var");
      else if (node.left) for (const d of node.left.declarations) bindPattern(d.id, node.left.kind);
      walk(node.test, node);
      walk(node.update, node);
      walk(node.right, node);
      walk(node.body, node);
      popScope();
      return;
    }
    case "VariableDeclaration":
      for (const d of node.declarations) {
        bindPattern(d.id, node.kind);
        pendingArrowName = d.id.type === "Identifier" ? d.id.name : null;
        walk(d.init, node);
        pendingArrowName = null;
      }
      return;
    case "CatchClause": {
      const s = pushScope(parent?.fnName ?? null, false);
      s.node = node;
      if (node.param) bindPattern(node.param);
      walk(node.body, node);
      popScope();
      return;
    }
    case "ClassDeclaration":
    case "ClassExpression": {
      if (node.id) mark(node.id, declare(node.id.name, "class", current, node.id));
      const s = pushScope(node.id?.name ?? parent?.fnName ?? null, false);
      s.node = node;
      if (node.superClass) walk(node.superClass, node);
      for (const el of node.body.body) walk(el, node.body);
      popScope();
      return;
    }
    case "Identifier": {
      if (isName(node, parent)) return;
      let owner = current;
      while (owner && !owner.names.has(node.name)) owner = owner.parent;
      mark(node, owner); // null = unbound in this slice (a cross-slice or global reference)
      return;
    }
    case "LabeledStatement":
    case "BreakStatement":
    case "ContinueStatement":
      return;
    case "ImportDeclaration":
    case "ExportAllDeclaration":
      return;
    case "ExportNamedDeclaration":
      if (node.declaration) walk(node.declaration, node);
      return;
  }
  for (const k of Object.keys(node)) if (!SKIP_KEYS.has(k)) walk(node[k], node);
}

function hoist(st) {
  if (!st) return;
  if (st.type === "FunctionDeclaration" && st.id) declare(st.id.name, "function", current, st.id);
  else if (st.type === "ClassDeclaration" && st.id) declare(st.id.name, "class", current, st.id);
  else if (st.type === "VariableDeclaration")
    for (const d of st.declarations) predeclare(d.id, st.kind);
}

function predeclare(p, kind = "let") {
  if (!p) return;
  switch (p.type) {
    case "Identifier": mark(p, declare(p.name, kind)); return;
    case "ObjectPattern":
      for (const prop of p.properties) predeclare(prop.type === "RestElement" ? prop.argument : prop.value, kind);
      return;
    case "ArrayPattern":
      for (const el of p.elements) predeclare(el, kind);
      return;
    case "AssignmentPattern": predeclare(p.left, kind); return;
    case "RestElement": predeclare(p.argument, kind); return;
  }
}

function bindPattern(p, kind = "let") {
  if (!p) return;
  switch (p.type) {
    case "Identifier": mark(p, declare(p.name, kind, current, p)); return;
    case "ObjectPattern":
      for (const prop of p.properties) {
        if (prop.type === "RestElement") bindPattern(prop.argument, kind);
        else if (prop.value) bindPattern(prop.value, kind);
      }
      return;
    case "ArrayPattern":
      for (const el of p.elements) bindPattern(el, kind);
      return;
    case "AssignmentPattern":
      bindPattern(p.left, kind);
      if (p.right) walk(p.right, p);
      return;
    case "RestElement": bindPattern(p.argument, kind); return;
  }
}

function analyze(codeText) {
  let ast;
  try {
    ast = acorn.parse(codeText, { ecmaVersion: 2023, sourceType: "module" });
  } catch {
    try {
      ast = acorn.parse(codeText, { ecmaVersion: 2023, sourceType: "script" });
    } catch (e) {
      throw new Error(`slice does not parse while applying names: ${e.message}`);
    }
  }
  current = { parent: null, fnScope: null, names: new Map(), fnName: null, node: ast };
  current.fnScope = current;
  programScope = current;
  functionScopes = new Map();
  pendingArrowName = null;
  walk(ast, null);
  return ast;
}

function scopeMatches(spec0) {
  if (spec0 === null) return { program: true, deep: false, want: null };
  const deep = spec0.endsWith(":*");
  return { program: false, deep, want: deep ? spec0.slice(0, -2) : spec0 };
}

function within(root, scope) {
  for (let s = scope; s; s = s.parent) if (s === root) return true;
  return false;
}

// ── rule application ─────────────────────────────────────────────────────
function applyRule(rule, codeText) {
  const sp = { ...rule, ...scopeMatches(rule.scope ?? null) };
  if (!sp.program) {
    const scope = functionScopes.get(sp.want);
    if (!scope) throw new Error(`no function named ${sp.want}`);
    sp.root = scope;
  }
  const toks = tokens(codeText);
  const { eligible } = classifyTokens(toks);
  const tokenAt = new Map();
  for (let k = 0; k < toks.length; k++) if (toks[k].t === "id") tokenAt.set(`${toks[k].s}:${toks[k].e}`, k);

  const marks = [];
  const covered = new Set(); // eligible program-scope/unbound tokens in the global namespace
  const renamedNames = new Set(); // source names that actually landed a rename here
  (function choose(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { for (const c of node) choose(c); return; }
    if (typeof node.type !== "string") {
      for (const k of Object.keys(node)) if (!SKIP_KEYS.has(k)) choose(node[k]);
      return;
    }
    if (node.type === "Identifier") {
      const owner = MARK.get(node);
      const k = tokenAt.get(`${node.start}:${node.end}`);
      if (owner === programScope) {
        if (k !== undefined && eligible[k]) covered.add(node.name);
        if (Object.prototype.hasOwnProperty.call(sp.renames, node.name) && k !== undefined && eligible[k]) {
          marks.push({ start: node.start, end: node.end, to: sp.renames[node.name] });
          renamedNames.add(node.name);
        }
      } else if (owner === null) {
        // unbound in this slice: a cross-slice top-level reference (global pass only)
        if (sp.program) {
          if (k !== undefined && eligible[k]) {
            covered.add(node.name);
            if (Object.prototype.hasOwnProperty.call(sp.renames, node.name)) {
              marks.push({ start: node.start, end: node.end, to: sp.renames[node.name] });
              renamedNames.add(node.name);
            }
          }
        }
      } else if (!sp.program && Object.prototype.hasOwnProperty.call(sp.renames, node.name)) {
        const hit = sp.deep ? within(sp.root, owner) : owner === sp.root;
        if (hit && k !== undefined && eligible[k]) {
          marks.push({ start: node.start, end: node.end, to: sp.renames[node.name] });
          renamedNames.add(node.name);
        }
      }
    }
    for (const k of Object.keys(node)) if (!SKIP_KEYS.has(k)) choose(node[k]);
  })(current.node);
  if (!marks.length) return { text: codeText, count: 0, covered, renamedNames };
  return { text: splice(codeText, marks), count: marks.length, covered, renamedNames };
}

function splice(text, marks) {
  marks.sort((a, b) => a.start - b.start);
  let out = "", last = 0;
  for (const m of marks) {
    if (m.start < last) throw new Error(`overlapping rename at ${m.start}`);
    out += text.slice(last, m.start) + m.to;
    last = m.end;
  }
  return out + text.slice(last);
}

// ── run ──────────────────────────────────────────────────────────────────
const sortedTargets = all ? [...sections.keys()].sort() : [file];
const globalCoverage = new Map(); // name -> Set(files where an eligible program/unbound occurrence was seen)
for (const name of Object.keys(GLOBAL)) globalCoverage.set(name, new Set());
const globalRenamed = new Map(); // name -> Set(files where at least one rename landed)
for (const name of Object.keys(GLOBAL)) globalRenamed.set(name, new Set());

let filesChanged = 0, totalSplices = 0;
for (const rel of sortedTargets) {
  const section = sections.get(rel);
  if (!section) {
    console.error(`no ranged section for ${rel}`);
    process.exit(1);
  }
  const abs = path.join(proj, "src", section.file);
  const committed = fs.readFileSync(abs, "utf8");
  const nl1 = committed.indexOf("\n");
  const nl2 = committed.indexOf("\n", nl1 + 1);
  const header = committed.slice(0, nl2 + 1);
  const wantHeader = `// ${section.file} — ${section.content}\n// Lines ${section.startLine}-${section.endLine} of ${section.sourceFile} (cluster ${section.cluster}, statement-aligned).\n`;
  if (header !== wantHeader) {
    console.error(`${rel}: committed header does not match split-spec (re-run derive.mjs first)`);
    process.exit(1);
  }
  const prettyLines = fs.readFileSync(path.join(proj, section.sourceFile), "utf8").split(/\r?\n/);
  const base = prettyLines.slice(section.startLine - 1, section.endLine).join("\n") + "\n";

  let body = base;
  const counts = [];
  const fileRules = PER_FILE[rel] || [];
  // 1) the global pass: program-scope + cross-slice references
  if (Object.keys(GLOBAL).length) {
    analyze(body);
    const r = applyRule({ scope: null, renames: GLOBAL }, body);
    body = r.text;
    for (const name of r.covered) if (globalCoverage.has(name)) globalCoverage.get(name).add(rel);
    for (const name of r.renamedNames) if (globalRenamed.has(name)) globalRenamed.get(name).add(rel);
    if (r.count) counts.push(`  <global>: ${r.count} identifier(s)`);
    totalSplices += r.count;
  }
  // 2) the per-file scoped rules, in order, re-parsing between groups
  for (const rule of fileRules) {
    analyze(body);
    const r = applyRule(rule, body);
    if (r.count === 0) {
      console.error(`${rel}: rule group ${rule.scope ?? "<program>"} matched 0 identifiers — refusing (a rule must fire)`);
      process.exit(1);
    }
    body = r.text;
    counts.push(`  ${rule.scope}: ${Object.keys(rule.renames).length} name(s), ${r.count} identifier(s)`);
    totalSplices += r.count;
  }
  const next = header + body;
  if (!fs.readFileSync(abs, "utf8").startsWith(header)) throw new Error(`${rel}: header drifted mid-run`);
  fs.writeFileSync(abs, next);
  if (next !== committed) filesChanged++;
  console.log(`${rel}: ${counts.length} rule group(s) applied${next === committed ? " (already applied)" : ""}`);
  if (counts.length) console.log(counts.join("\n"));
}

// global coverage: every eligible program-scope/unbound occurrence of a global
// name must have been renamed — a partial application is refused
{
  const missing = [];
  for (const [name, set] of globalCoverage) {
    if (!set.size) {
      missing.push(`${name}: no eligible program-scope occurrence found anywhere — remove it from names.json`);
      continue;
    }
    const renamed = globalRenamed.get(name);
    const untouched = [...set].filter((f) => !renamed.has(f));
    if (untouched.length) missing.push(`${name}: eligible occurrence(s) left unrenamed in ${untouched.join(", ")}`);
  }
  if (missing.length) {
    console.error(`apply-names: global coverage incomplete — refusing:`);
    for (const m of missing) console.error("  " + m);
    process.exit(1);
  }
}
// files listed in names.json that were not part of the run are still checked by
// --all; a targeted run checks only its file.
if (!all) {
  const unknown = Object.keys(PER_FILE).filter((f) => !sections.has(f));
  for (const f of unknown) console.error(`note: names.json lists ${f} which is not a src slice`);
}
console.log(`apply-names: ${sortedTargets.length} file(s) visited, ${filesChanged} changed, ${totalSplices} identifier splice(s)`);
