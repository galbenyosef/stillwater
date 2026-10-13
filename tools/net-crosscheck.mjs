// net-crosscheck.mjs — dynamic closure cross-check for STILLWATER.
//
// The static closure (tools/capture.mjs --check) proves the captured text files
// reference nothing un-captured. This tool adds the dynamic half: it compares an
// opencli browser network log, recorded while the mirror was loaded and played
// on loopback, against .upstream/manifest.json:
//   - every same-origin request must be a captured file (a MISSING line is a
//     closure gap the static scan did not see);
//   - captured files that were never requested are listed (informational: this
//     deployment preloads the whole asset tree at boot, so most should appear);
//   - off-origin requests are summarised (STILLWATER loads nothing off-origin —
//     the only entries should be Cloudflare machinery beacons under /cdn-cgi/,
//     which are same-origin anyway);
//   - failed requests (status >= 400) are listed — the Cloudflare challenge
//     `oneshot` beacon is the expected 404 (the mirror is not a Cloudflare
//     zone), so a failure line naming /cdn-cgi/ is not a defect.
//
// The log is the JSON-lines stream of
//   opencli browser <session> network --all --follow
// (one JSON object per request; the --since query form does not retain the
// buffer, which is why the log is recorded with --follow while the game runs).
//
// usage: opencli browser <session> network --all --follow > docs/boot-network-<date>.json
//        node tools/net-crosscheck.mjs docs/boot-network-<date>.json
import fs from "node:fs";

const log = JSON.parse(
  "[" +
    fs
      .readFileSync(process.argv[2], "utf8")
      .split("\n")
      .filter((l) => l.trim().startsWith("{"))
      .join(",") +
    "]",
);
const manifest = JSON.parse(fs.readFileSync(new URL("../.upstream/manifest.json", import.meta.url), "utf8"));
const have = new Set(Object.keys(manifest.files));
// recorded gaps (from the capture crawl): a request for one of these is
// explained, not a new closure gap
const recorded = new Set();
try {
  const rep = JSON.parse(fs.readFileSync(new URL("../_mirror-report.json", import.meta.url), "utf8"));
  for (const u of rep.unresolved ?? []) recorded.add(u.path);
} catch {
  /* no report: nothing recorded */
}

const sameOrigin = new Map(); // path -> statuses
const offOrigin = new Map();
let dataUris = 0;
for (const e of log) {
  if (e.url.startsWith("data:")) {
    dataUris++;
    continue;
  }
  let u;
  try {
    u = new URL(e.url);
  } catch {
    continue;
  }
  if (u.hostname === "127.0.0.1" || u.hostname === "localhost") {
    const p = decodeURIComponent(u.pathname.replace(/^\//, "")) || "index.html";
    if (!sameOrigin.has(p)) sameOrigin.set(p, []);
    sameOrigin.get(p).push(e.status);
  } else {
    if (!offOrigin.has(u.origin)) offOrigin.set(u.origin, 0);
    offOrigin.set(u.origin, offOrigin.get(u.origin) + 1);
  }
}
console.log(
  `entries: ${log.length} (off-origin: ${[...offOrigin.entries()].map(([o, n]) => `${o} x${n}`).join(", ") || "none"}; embedded data: URIs: ${dataUris})`,
);
console.log("--- same-origin requests not in manifest:");
let novel = 0;
let machinery = 0;
for (const [p, st] of [...sameOrigin.entries()].sort()) {
  const ok = have.has(p);
  if (!ok) {
    const rec = recorded.has(p);
    const cf = p.startsWith("cdn-cgi/");
    if (cf) {
      machinery++;
      console.log(
        `  MACHINERY ${p} statuses=${[...new Set(st)].join(",")}  (Cloudflare challenge endpoint — runtime beacon, not deployment content; the mirror is not a Cloudflare zone)`,
      );
      continue;
    }
    if (!rec) novel++;
    console.log(
      `  MISSING ${p} statuses=${[...new Set(st)].join(",")}` +
        (rec ? "  (recorded 404 gap — never served upstream)" : "  (NEW — not a recorded gap)"),
    );
  }
}
console.log(
  novel
    ? `${novel} NEW missing`
    : `0 new missing — every same-origin request is captured, a recorded gap, or cdn-cgi machinery (${machinery})`,
);
console.log("--- captured-but-never-requested (expected: meta-only stillwater-preview.jpg, licenses/*.txt, the compact tree when quality=high):");
const req = new Set(sameOrigin.keys());
const never = [...have].filter((r) => !req.has(r));
for (const rel of never) console.log(`  ${rel}`);
console.log(`--- same-origin request count: ${sameOrigin.size}; captured files never requested: ${never.length}; failed (>=400 or 0):`);
for (const [p, st] of [...sameOrigin.entries()].sort())
  if (st.some((s) => s >= 400 || s === 0)) console.log(`  ${p} statuses=${[...new Set(st)].join(",")}`);
