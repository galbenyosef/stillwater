// inspector-02.js — the render inspector (debug panel, GPU timer queries, frame counters)
// Lines 65682-65733 of readable/assets__index-BogB70q-.pretty.js (cluster inspector, statement-aligned).
var WT = ST ? uw.getContext() : null,
  GT = WT?.getExtension(`EXT_disjoint_timer_query_webgl2`),
  KT = WT?.getExtension(`WEBGL_debug_renderer_info`),
  qT = KT ? WT.getParameter(KT.UNMASKED_RENDERER_WEBGL) : ``;
function JT() {
  let e = new Ji().setFromProjectionMatrix(
      new W().multiplyMatrices(Cw.projectionMatrix, Cw.matrixWorldInverse),
    ),
    t = new Map();
  return (
    pw.traverseVisible((n) => {
      if (
        !n.isMesh ||
        Array.isArray(n.material) ||
        (n.frustumCulled && !n.intersectsFrustum(e))
      )
        return;
      let r =
          ((n.geometry.index?.count ?? n.geometry.attributes.position.count) /
            3) *
          (n.isInstancedMesh ? n.count : 1),
        i = n.material.name || n.name || `Surface`;
      t.set(i, (t.get(i) || 0) + r);
    }),
    [...t]
      .sort((e, t) => t[1] - e[1])
      .slice(0, 5)
      .map(([e, t]) => `${e}: ${(t / 1e6).toFixed(2)}m`)
      .join(` · `)
  );
}
var YT = [],
  XT = [],
  ZT = 0,
  QT = 0,
  $T = 0;
function eE() {
  ((XT.length = 0), $T++);
}
var tE = 0,
  nE = performance.now(),
  rE = 0,
  iE = 0,
  aE = 0,
  oE = 0,
  sE = [],
  cE = 0,
  lE = 0,
  uE = 0,
  dE = [],
  fE = 0,
  pE = { wake: 0, shadow: 0, refraction: 0, view: 0 };
