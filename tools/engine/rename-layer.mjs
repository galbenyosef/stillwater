// engine/rename-layer.mjs — shared rename-layer logic for stillwater's src/
// layer (PLAN §5). Copied + adapted from the fleet precedent (kettuvellam
// tools/engine/rename-layer.mjs; desimayhem / sunlandia lineage) — nothing is
// read from another mirror at runtime.
//
// A "rename layer" over a slice means:
//
//     committed file  ==  readable range, with identifiers substituted
//                         (plus the derive's 2-line provenance header)
//
// The relationship is exact and invertible, so the map is recoverable:
// tokenize both bodies (comments/whitespace dropped, string and template
// literals atomic), require the non-identifier token streams to be identical,
// pair identifiers positionally, and every differing pair is a rename. If the
// non-identifier streams disagree, recovery FAILS rather than inventing a
// plausible map.
//
// Two record kinds per file, as in the precedent:
//   files[name]  -> target            word-boundary: EVERY eligible occurrence
//                                     of that spelling in the file was renamed
//   scoped[name] -> [[tokenIndex, target], …]   only some occurrences were
//                                     (a same-spelled local elsewhere in the
//                                     file keeps its minified name)
//
// "Eligible" is the one namespace guard both the writer (tools/apply-names.mjs)
// and the verifiers (tools/verify-rename.mjs, tools/audit.js) apply, so the
// record can always express what the writer did:
//   · a property access (`x.e`) is a name in someone else's namespace;
//   · an object-literal key (`e:`) likewise;
//   · a SHORTHAND property (`{e}`) is key and value at once — renaming the
//     token would change the object's key, so it is never renamed;
//   · the imported/exported name in `import { a as e }` / `export { e as X }`
//     names the other module (or the public API), never a local binding.
// Identifiers inside string/template *text* cannot be touched by construction.
//
// This bundle is a classic script: a slice is an interior of one program
// (top-level declarations shared across slices), so the writer only renames
// (a) locally-bound identifiers via scoped rules and (b) program-scope names
// via the reviewed `global` map, which must be applied in every slice that
// mentions them — tools/check-chunk.mjs proves the cross-slice result.

const ID_START = /[A-Za-z_$]/;
const ID_PART = /[\w$]/;

/** Tokenize a whole source text. Every token carries its span (s..e). */
export function tokens(text) {
  const st = { i: 0, text, out: [] };
  scan(st, undefined);
  return st.out;
}

function emit(st, t, v, s, e) {
  st.out.push({ t, v, s, e: e === undefined ? s + v.length : e });
}

// Scan until end of input, or — when `stop` is set — until that closing token
// is reached (used for `${ … }`, which ends at its matching `}`).
function scan(st, stop) {
  const { text } = st;
  const n = text.length;
  while (st.i < n) {
    const c = text[st.i];
    const start = st.i;
    if (c === " " || c === "\t" || c === "\n" || c === "\r") { st.i++; continue; }
    if (c === "/" && text[st.i + 1] === "/") { while (st.i < n && text[st.i] !== "\n") st.i++; continue; }
    if (c === "/" && text[st.i + 1] === "*") {
      st.i += 2;
      while (st.i < n && !(text[st.i] === "*" && text[st.i + 1] === "/")) st.i++;
      st.i += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = st.i + 1;
      while (j < n) {
        if (text[j] === "\\") { j += 2; continue; }
        if (text[j] === c) { j++; break; }
        j++;
      }
      emit(st, "lit", text.slice(st.i, j), start);
      st.i = j;
      continue;
    }
    if (c === "`") { scanTemplate(st); continue; }
    // Regex literal: a `/` starts one when the previous significant token cannot
    // end an expression (operator, `(`, `,`, `=`, keyword like return, start of
    // input) — otherwise it is division. Scanning it as one token keeps flag
    // letters out of the identifier stream, where a map key like `gm` would
    // otherwise rewrite regex flags.
    if (c === "/" && isRegexStart(st)) {
      let j = st.i + 1, inClass = false;
      while (j < n) {
        const d = text[j];
        if (d === "\\") { j += 2; continue; }
        if (d === "[") inClass = true;
        else if (d === "]") inClass = false;
        else if (d === "/" && !inClass) break;
        else if (d === "\n") break; // unterminated: not a regex after all
        j++;
      }
      if (j < n && text[j] === "/") {
        j++;
        while (j < n && /[a-z]/.test(text[j])) j++; // flags
        emit(st, "re", text.slice(st.i, j), start);
        st.i = j;
        continue;
      }
    }
    if (stop === "}" && c === "}") { st.i++; return; }
    if (ID_START.test(c)) {
      let j = st.i + 1;
      while (j < n && ID_PART.test(text[j])) j++;
      emit(st, "id", text.slice(st.i, j), start);
      st.i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = st.i + 1;
      while (j < n && /[\w.]/.test(text[j])) j++;
      emit(st, "num", text.slice(st.i, j), start);
      st.i = j;
      continue;
    }
    emit(st, "pun", c, start);
    st.i++;
  }
}

function isRegexStart(st) {
  const prev = st.out[st.out.length - 1];
  if (!prev) return true;
  if (prev.t === "pun") return !(")]}".includes(prev.v) || prev.v === "++" || prev.v === "--");
  if (prev.t === "id") return /^(?:return|typeof|instanceof|in|of|new|delete|void|case|do|else|yield|await|throw)$/.test(prev.v);
  return false; // after id/num/str/template/regex, `/` is division
}

// `{` opens a brace group: recurse with no stop so its `}` is emitted here.
// `${` opens a substitution: recurse with stop="}".
function scanTemplate(st) {
  const { text } = st;
  const n = text.length;
  emit(st, "pun", "`", st.i);
  st.i++;
  let run = "";
  let runStart = st.i;
  const flush = () => { if (run) emit(st, "lit", run, runStart); run = ""; };
  while (st.i < n) {
    const c = text[st.i];
    if (c === "\\") { if (!run) runStart = st.i; run += text.slice(st.i, st.i + 2); st.i += 2; continue; }
    if (c === "`") { flush(); emit(st, "pun", "`", st.i); st.i++; return; }
    if (c === "$" && text[st.i + 1] === "{") {
      flush();
      emit(st, "pun", "${", st.i);
      st.i += 2;
      scan(st, "}");
      emit(st, "pun", "}", st.i - 1);
      runStart = st.i;
      continue;
    }
    if (!run) runStart = st.i;
    run += c;
    st.i++;
  }
  flush();
}

// ── slice headers ────────────────────────────────────────────────────────
// The committed slice starts with a 2-line `//` provenance comment written by
// tools/derive.mjs. Renames never touch it; stripCommentHeader drops whole-line
// `//` comment lines (string/template aware: a slice can carry GLSL whose lines
// begin with `//` — those are payload, not commentary).
export function stripCommentHeader(text) {
  const out = [];
  let inBlock = false, inStr = null;
  for (const line of text.split("\n")) {
    const trimmed = line.trimStart();
    const outsideCode = !inBlock && !inStr;
    if (outsideCode && trimmed.startsWith("//")) continue;
    out.push(line);
    let i = 0;
    while (i < line.length) {
      const c = line[i];
      if (inBlock) { if (c === "*" && line[i + 1] === "/") { inBlock = false; i += 2; continue; } i++; continue; }
      if (inStr) { if (c === "\\") { i += 2; continue; } if (c === inStr) inStr = null; i++; continue; }
      if (c === "/" && line[i + 1] === "*") { inBlock = true; i += 2; continue; }
      if (c === '"' || c === "'" || c === "`") { inStr = c; i++; continue; }
      i++;
    }
  }
  return out.join("\n");
}

// ── eligibility (the one namespace guard) ────────────────────────────────
/** { eligible } — per-token classification of a token stream. */
export function classifyTokens(toks) {
  // bracket context for shorthand detection: is the innermost open bracket a `{`?
  const braceStack = [];
  const inBraces = new Array(toks.length).fill(false);
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k];
    if (t.t === "pun") {
      if (t.v === "{" || t.v === "${") braceStack.push(t.v);
      else if (t.v === "[") braceStack.push("[");
      else if (t.v === "(") braceStack.push("(");
      else if (t.v === "}" || t.v === "]" || t.v === ")") braceStack.pop();
    }
    if (t.t === "id") inBraces[k] = braceStack[braceStack.length - 1] === "{";
  }
  const eligible = new Array(toks.length).fill(false);
  // import/export specifier names are foreign: collect their indices
  const foreign = new Set();
  for (let i = 0; i < toks.length - 1; i++) {
    const kw = toks[i];
    if (kw.t !== "id" || (kw.v !== "import" && kw.v !== "export")) continue;
    if (toks[i + 1].t !== "pun" || toks[i + 1].v !== "{") continue;
    let end = i + 2;
    while (end < toks.length && !(toks[end].t === "pun" && toks[end].v === "}")) end++;
    let group = [];
    const flush = () => {
      const ids = group.filter((k) => toks[k].t === "id");
      if (kw.v === "import") { if (ids.length) foreign.add(ids[0]); }
      else if (ids.length > 1) foreign.add(ids[ids.length - 1]); // export: the alias is public API
      group = [];
    };
    for (let k = i + 2; k < end; k++) {
      if (toks[k].t === "pun" && toks[k].v === ",") flush();
      else group.push(k);
    }
    flush();
  }
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k];
    if (t.t !== "id") continue;
    if (foreign.has(k)) continue;
    const prev = toks[k - 1];
    const prev2 = toks[k - 2];
    const isSpread = prev && prev.t === "pun" && prev.v === "." && prev2 && prev2.t === "pun" && prev2.v === ".";
    if (prev && prev.t === "pun" && (prev.v === "." || prev.v === "?.") && !isSpread) continue; // property access
    const next = toks[k + 1];
    // A `:` after an identifier is an object-literal key ONLY in property
    // position — inside braces with the previous token `{` or `,`. Elsewhere
    // (ternary `... ? -x / y : z`, `case e:`) the identifier is a real
    // reference and stays eligible; excluding it made renames unexpressible
    // and silently split a binding (caught by tools/verify-rename.mjs).
    if (
      next && next.t === "pun" && next.v === ":" && inBraces[k] &&
      prev && prev.t === "pun" && (prev.v === "{" || prev.v === ",")
    )
      continue; // object-literal key
    if (
      inBraces[k] &&
      prev && prev.t === "pun" && (prev.v === "{" || prev.v === ",") &&
      next && next.t === "pun" && (next.v === "," || next.v === "}")
    ) {
      // Shorthand property — with one exception the token-level view can see:
      // a BARE DECLARATOR in a `let a, b` list sits inside the function body's
      // braces in exactly the same token shape. Scan back (bounded) to the
      // statement boundary; a `let`/`var`/`const` before it makes this a
      // declarator, not a property (the writer must be able to rename it, or a
      // rename would split its binding — verify-rename catches that). The
      // FIRST element of a destructuring pattern (`let {a, b}`) keeps prev `{`
      // and stays ineligible: its token is the property name too.
      let isDeclaration = false;
      if (prev.v === ",") {
        // walk back to the statement boundary, skipping balanced groups so a
        // declarator list with calls (`i = e.getElementById(...), l,`) is not
        // cut short at a `)`.
        let depth = 0;
        for (let j = k - 2, steps = 0; j >= 0 && steps < 400; j--, steps++) {
          const t2 = toks[j];
          if (t2.t === "pun") {
            if (t2.v === ")" || t2.v === "]" || t2.v === "}") { depth++; continue; }
            if (depth > 0) {
              if (t2.v === "(" || t2.v === "[" || t2.v === "{") depth--;
              continue;
            }
            if (t2.v === ";" || t2.v === "{" || t2.v === "}" || t2.v === ")" || t2.v === "=>") break;
          }
          if (depth === 0 && t2.t === "id" && (t2.v === "let" || t2.v === "var" || t2.v === "const")) { isDeclaration = true; break; }
        }
      }
      if (!isDeclaration) continue;
    }
    eligible[k] = true;
  }
  return { eligible };
}

/**
 * Apply a rename map to a base body by splicing token spans.
 * `flat`    — { name: target } word-boundary (every eligible occurrence)
 * `indexed` — Map(tokenIndex -> target) (token-index addressed, wins)
 */
export function applyRecords(baseBody, flat, indexed) {
  const toks = tokens(baseBody);
  const { eligible } = classifyTokens(toks);
  const reps = [];
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k];
    if (t.t !== "id") continue;
    const hit = indexed.get(k);
    if (hit !== undefined) { reps.push({ s: t.s, e: t.e, to: hit }); continue; }
    if (eligible[k] && Object.prototype.hasOwnProperty.call(flat, t.v)) reps.push({ s: t.s, e: t.e, to: flat[t.v] });
  }
  return spliceTokens(baseBody, reps);
}

/** Rewrite text by replacing the spans in `reps` (any order). */
export function spliceTokens(text, reps) {
  if (!reps.length) return text;
  const sorted = [...reps].sort((a, b) => a.s - b.s);
  let out = "";
  let last = 0;
  for (const r of sorted) {
    if (r.s < last) throw new Error(`overlapping splice at ${r.s}`);
    out += text.slice(last, r.s) + r.to;
    last = r.e;
  }
  return out + text.slice(last);
}
