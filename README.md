# STILLWATER — offline mirror

Full mirror of **Stillwater — the mill island** (https://stillwater.zavrenn.chatgpt.site/).

Source: https://stillwater.zavrenn.chatgpt.site/

![STILLWATER](docs/cover.png)

## Stack

- **Vite production build on a `*.chatgpt.site` deployment** — the origin root
  serves `index.html` plus `assets/index-BogB70q-.js` (the whole app as one
  1,372,053 B minified classic-script bundle) and
  `assets/index-D7i12YD8.css` (16,734 B stylesheet). No framework, no runtime
  chunk graph: one flat bundle whose modules the build concatenated.
- **three.js r186 fused into the bundle** — the bundler merged the three.js core
  (constants … WebGLRenderer, `window.__THREE__ = '186'`), the GLTFLoader addon
  with its KHR_* plugins (DRACO/KTX2/meshopt hooks) and the MeshoptDecoder
  module with its embedded wasm directly into the app bundle.
- **The deployment's own asset map** — the built entry carries
  `<meta name="stillwater-assets" content='{"/textures/…":"<rev>", …}'>`
  (153 paths) and the bundle's `uf()` helper appends `?v=<rev>` to every
  same-origin asset it loads through that map. The capture probes all 153
  directly; the revision map is the deployment's, byte-exact in the capture.
- **Static asset tree, fetched at boot** — `/textures/` (material webp, canopy
  atlas webp+json, HDR sky, water normal, a scar decal), `/models/` and
  `/compact/models/` (glTF props, architecture, trees, fisher), `/compact/textures/`
  (keeper + material png/jpg), `/audio/` (three ogg loops + `SOURCES.md`) and
  `/licenses/` (four attribution txt). The game preloads the world at its
  loading screen; one material texture was never requested in the play session.
- **Cloudflare machinery** — the host injects a bot-challenge inline block into
  the entry document (token rotates per response) which loads
  `/cdn-cgi/challenge-platform/scripts/jsd/main.js` (captured once, recorded
  `dynamic: true`). The script's `oneshot` beacon POSTs to a Cloudflare
  challenge endpoint at runtime — machinery, not deployment content, and
  404 locally by design.
- **SPA catch-all** — the host answers ANY unknown path with HTTP 200 and the
  entry document (`text/html`). A capture probe therefore only counts a
  response as the file when it is NOT the HTML fallback; `/index.html`
  itself 307-redirects to `/`.

## What this is

STILLWATER — the mill island (stillwater.zavrenn.chatgpt.site) — "Let the world
wait. An old mill. A wooden boat. And nowhere you need to be." A quiet 3D
exploration game: you are the mill keeper on a small wooded island, free to walk
the landing and bridge, sit and fish from the dock, the chair or the boat, and
paddle the pond (its meta description: "A small world, a wooden boat, and
nowhere you need to be"). The whole game is the one Vite bundle plus its asset
tree — no accounts, no backend, nothing off-origin.

The capture is **157 files, 176,886,452 bytes (168.7 MiB)** — entry document
(24,712 B), the bundle and stylesheet, the 153 meta-declared assets, the og
preview image, and the Cloudflare challenge script. Closure was iterated to
fixpoint with the static scanner (HTML attributes/quoted strings, JS literals,
specifiers, `new URL()`, CSS `url()`/`@import`) plus the deployment's own asset
map and the bundle's template-literal target tables (the `scan-*`, `fern*-views`
and two placement models the literal scanner cannot resolve), then cross-checked
against an opencli browser network log recorded while the game ran on loopback
(`docs/boot-network-2026-10-13.json`, 296 entries / 148 distinct same-origin
paths): **every same-origin request the running game made is a captured file**,
plus one Cloudflare `oneshot` beacon (machinery). The only game-file 404 the
mirror server logged across the session is that beacon.

External at runtime: **none** — the app loads nothing off-origin. Cloudflare's
injected challenge script is captured, but its `oneshot` POST target is a
Cloudflare endpoint that stays external (the mirror is not a Cloudflare zone);
it is documented, not backfilled.

Gaps (16, all recorded in `_mirror-report.json`): the host answers these
referenced paths with the SPA fallback (HTTP 200 + entry document), i.e. they
are not served upstream — `favicon.ico` (browser-implicit; the document's own
icon is a data: URI), `models/pebble.glb`, `models/clearinggrass.glb`,
`textures/fern0-views.{webp,json}`, `textures/fern1-views.{webp,json}` and the
nine `textures/scan-{ground,pebbles,sand}-{albedo,normal,roughness}.webp`
templates the bundle builds but the deployment never ships (the run never
requests them; they belong to an unpublished content variant).

## Layout

- `index.html` — the entry document as served at the origin root, byte-exact
  (including the Cloudflare-injected token block)
- `assets/` — the app bundle and stylesheet as served
- `textures/`, `models/`, `compact/`, `audio/`, `licenses/`,
  `stillwater-preview.jpg` — the asset tree as served
- `cdn-cgi/challenge-platform/scripts/jsd/main.js` — the Cloudflare challenge
  script as served once (rotating; `dynamic: true` in the manifest)
- `.upstream/manifest.json` — sha256 for every captured file (157 files)
- `readable/` — prettified derived layer (pinned prettier 3.9.6) for the app
  bundle (66,160 lines), the stylesheet (1,269), the Cloudflare script (2,027)
  and the two inline entry-document blocks (11 + 33), plus
  `readable/index-inline-map.json` (inline byte ranges + sha256)
- `src/` + `split-spec.json` — 77 statement-aligned slices (76 of the app
  bundle + 1 of the inline recovery handler) with the recorded derivation spec
- `tools/derive.mjs` — rebuild `readable/` + `src/` + `split-spec.json`
- `tools/capture.mjs` — the byte-exact capture + closure crawler (re-runnable;
  `--check` is the static closure audit)
- `tools/update.mjs` — read-only drift probe against the live site
- `tools/verify.mjs` — re-hash the capture against the manifest
- `tools/audit.js` — integrity gate for the derived layers (`AUDIT PASS`)
- `tools/net-crosscheck.mjs` — compare a recorded browser network log against
  the manifest (`node tools/net-crosscheck.mjs docs/boot-network-2026-10-13.json`)
- `tools/serve.mjs` — loopback static server used for the boot test

## Assets

- **world/terrain models** — 27 glb: `models/` (wheel, rocks, stoneblock, bank
  covers, grass, fern0/1, foxglove, flowers, mushrooms, shrub, pebbles,
  waterplant, lily, lilypad, reeds, wheelbarrow, log, fence)
- **architecture/terrain/props models (compact set)** — 27 glb + 3 json under
  `compact/models/` (mill, milldetails, millinterior, milldoor, millsidedoor,
  dockprops, bridge, bridgepath, spring, springwater, pondlife, architecture,
  terrain, boat, trees/lods/crowns, fishing-chair, fishing-boat,
  fishing-resident + `resident-motion.json`, `fishing-*-line.json`)
- **textures** — 54 webp + 2 json + 1 hdr + 1 jpg under `textures/` (material
  webp atlas pages incl. the mill scar decal, alder/birch canopy webp+json
  view atlases, `forest-light.hdr` sky, `water-normal.jpg`)
- **compact textures** — 29 png/jpg under `compact/textures/` (keeper-tripo
  colour/normal/orm + 26 material pages)
- **audio** — 3 ogg + 1 md under `audio/` (`birds.ogg`, `water.ogg`,
  `motor.ogg`, `SOURCES.md`)
- **fonts** — none; the UI uses system font stacks
- **licenses** — 4 txt under `licenses/` (`THREE-MIT`, `MESHOPTIMIZER-MIT`,
  `MAKEHUMAN-CC0`, `KEEPER-ATTRIBUTION` — the keeper character is a
  MakeHuman-CC0-derived asset, attributed in-tree)
- **code** — `index.html`, `assets/index-BogB70q-.js`,
  `assets/index-D7i12YD8.css`
- **machinery** — `cdn-cgi/challenge-platform/scripts/jsd/main.js` (Cloudflare)
- **docs** — `docs/cover.png`, `docs/boot-2026-10-13.png`,
  `docs/boot-network-2026-10-13.json`

## Run

Open `index.html` through any static file server, serving the repo root as the
site root (the deploy is origin-root; no build step):

```
node tools/serve.mjs          # http://127.0.0.1:8096/
# or: npx serve .
```

Click **Step outside**, walk with WASD/arrows (or click/hold a spot to walk
there), `E` interacts (sit, board the boat, stand up), `F` fishes, `V` toggles
Explore/Follow view, `R` recenters, the top bar has view/sound/map/settings.
Open the page fresh so the CDN-injected Cloudflare block is inert (it needs the
real CF zone; offline it simply fails and the game is unaffected).

## Verify

```
node tools/verify.mjs          # re-hash the capture against the manifest
node tools/audit.js            # derived-layer integrity gate (AUDIT PASS)
node tools/capture.mjs --check # static closure: 0 unresolved beyond recorded gaps
node tools/net-crosscheck.mjs docs/boot-network-2026-10-13.json
```

## Updating from upstream

```
node tools/update.mjs     # read-only drift probe: what changed upstream
```

The probe never rewrites the capture — a mirror is a point-in-time snapshot.
It re-fetches the entry and all 157 captured files and compares: the entry is
normalized (Cloudflare token rotates per response), the challenge script is
`dynamic: true` (presence-only), and everything else must match byte-for-byte.
A refresh means re-running `node tools/capture.mjs` into a clean tree, then
re-cutting the derived layers with `node tools/derive.mjs` (never carrying the
old derived layer over); replaced files are copied to `legacy/<date>/` first.

### 2026-10-13 derivation

Both derived layers are in place, cut from the recorded capture (capture bytes
untouched — `node tools/verify.mjs` re-hashes all 157 files):

- `readable/` — pinned prettier 3.9.6 (module API, default options, single pass
  with re-format idempotence asserted at derive time — never the CLI, it
  respects `.gitignore` and can silently echo its input) rendered the app bundle
  to `assets__index-BogB70q-.pretty.js` (66,160 lines), the stylesheet to
  `assets__index-D7i12YD8.pretty.css` (1,269), the Cloudflare script to
  `cdn-cgi__challenge-platform__scripts__jsd__main.pretty.js` (2,027) and the
  two inline entry blocks to `index-inline-{1,2}.pretty.js` (11 + 33). Every
  pretty is provably not a byte copy of its capture source and re-renders
  byte-exact under the pinned version (5/5 in the gate).
- `src/` — 77 statement-aligned slices (`src/<tag>-NN.js`, exact 2-line
  provenance header) recorded in `split-spec.json` (85 sections: 77 ranged + 8
  wholeFile): 76 windows over the app bundle's app-code runs plus 1 for the
  inline recovery handler. 77/77 parse standalone
  (`node --input-type=module --check -`) and round-trip byte-exact to their
  readable line ranges; cuts land only on top-level declaration boundaries
  (~250-350 line windows; oversized declarations stay whole — the placements
  table, a single 12,241-line declaration, is one slice).
- Vendor rule — wholeFile sections, never sliced, content-anchored and asserted
  in `tools/derive.mjs` and guarded again in `tools/audit.js`: the Vite
  modulepreload polyfill (build machinery), the three.js r186 core
  (constants … WebGLRenderer), the bundled GLTFLoader addon with its KHR_*
  plugins, and the MeshoptDecoder module with its embedded wasm. Machinery rule
  — the Cloudflare challenge script and the entry's inline Cloudflare injection
  are wholeFile. Stylesheet rule — the capture CSS is wholeFile. The inline
  recovery handler is app code: its header comment is a wholeFile head section
  and its single statement is a slice (no skipped sections in this mirror).
- Non-capture content: the entry's inline `<script>` scan finds exactly two
  content blocks (recovery handler, Cloudflare injection); external references
  are only the bundle/stylesheets `<script src>`/`<link>` and the Cloudflare
  script string — no inline `<style>`, no typed data blocks, so `notRendered`
  is empty.
- Gates: `node tools/verify.mjs` → `157 files checked, 0 problems`;
  `node tools/audit.js` → `AUDIT PASS` (77/77 round-trips, 5/5 pretties
  re-render byte-exact, 5/5 pretty sources tiled contiguously, 77/77 slices +
  4/4 pretties parse standalone, 5/5 pretties provably distinct from capture,
  2 inline blocks with twins + index-inline-map.json, capture manifest free of
  derived layers); `node tools/update.mjs` → `up to date: 157 captured files
  identical upstream`; `node tools/capture.mjs --check` → static closure clean
  (0 new unresolved vs the 16 recorded gaps); serve probe — mirror root served
  on loopback (`tools/serve.mjs`, port 8096), game booted and played, listener
  killed, port closed (`netstat`: no LISTENING socket; connection refused).
  Rebuild with `node tools/derive.mjs`.
- Boot evidence: `docs/boot-2026-10-13.png` (right after boot on the loopback
  mirror — the rendered mill landing, welcome overlay and load status) and the
  cover `docs/cover.png` (actual gameplay: the mill keeper fishing from the
  dock, line cast, "Reel in" prompt up). Play actually exercised: Step outside
  → Follow view walking via click-to-walk → fishing (sit, cast the line) →
  stand up → Explore/Follow view toggle. Note for re-shoots: this game switches
  on `KeyboardEvent.code`, which the opencli `keys` command sends empty, so the
  session was driven through the game's own on-screen controls (trusted CDP
  clicks: canvas click-to-walk, the interaction prompt buttons, the view
  toggle) — real input, just pointer-shaped.
- §0.4 fork-over-mirror checked 2026-10-13: **no public upstream source repo
  exists.** The entry HTML, the bundle and the stylesheet carry no repository
  link, no source-map URL and no license header beyond the in-tree
  `licenses/*.txt`; the host exposes no deploy metadata beyond Cloudflare
  headers; GitHub repo searches for the game name and the slug return nothing.
  The GitHub user `zavrenn` (the subdomain's owner, 7 public repos) publishes
  no Stillwater repository — so there is nothing to fork, and the mirror
  stands.

## Mirror conventions

- **Capture layer** — the captured files are byte-exact copies of what the
  origin served; nothing in them is edited. The Cloudflare-injected token in
  `index.html` and the `?v=` revision stamps are part of that record.
- **Readable layer** — `readable/` is derived (prettified) and never shipped to
  a browser; it exists so the bundle can actually be read.
- **Provenance** — `.upstream/manifest.json` records sha256 for each captured
  artifact, and `tools/verify.mjs` re-checks it.
- **Drift** — `tools/update.mjs` is read-only: it reports what changed upstream
  and never rewrites the capture.

## Fleet status

<!-- mirror-status:start — feeds _standard/REPO-INDEX.md. Update ONLY your own mirror's block; never edit the shared index (PLAN §8). Rebuild: node _standard/build-index.mjs -->
<!-- cols: cls=classification · ver=verify 0 problems · upd=drift probe · man=manifest · rdbl=readable re-derived · src=reversed src · boot=boot test · top=offline-mirror topic · tag=backup tag · staged=staged not committed -->
| # | repo | cls | ver | upd | man | rdbl | src | boot | top | tag | staged |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | stillwater | mirror | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
<!-- mirror-status:end -->
