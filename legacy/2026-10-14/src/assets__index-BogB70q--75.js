// assets__index-BogB70q- 75 — reducedmotion
// Lines 65682-65850 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
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
async function mE() {
  let [e, t, n, r, i] = await Promise.all([
    iC.track(nv((e) => iC.models(e))),
    iC.track(new gf().loadAsync(`/textures/forest-light.hdr`)),
    iC.track(new Us().loadAsync(`/textures/water-normal.jpg`)),
    iC.track(iS()),
    iC.track(NS()),
  ]);
  (iC.stage(`Bringing the woodland to life…`),
    await new Promise((e) => requestAnimationFrame(() => setTimeout(e, 0))));
  let a = new pl(uw);
  ((pw.environment = a.fromEquirectangular(t).texture),
    (pw.environmentIntensity = 0.4));
  let o = Vb(uw);
  ((pw.background = o.texture),
    (pw.backgroundIntensity = 0.48),
    t.dispose(),
    a.dispose(),
    (PC = rv(pw, e)),
    PC.setLow(jC),
    (zC = fp(uw, pw, {
      sun: hw,
      hemisphere: mw,
      fill: Sw,
      sky: o,
      reducedMotion: lC,
    })),
    (NC = ly(pw, lC, n, e, fC, zC, PC.power)),
    NC.setLow(jC),
    (FC = Uy(pw, lC, n, e, PC.power)),
    Dw.setObstacles(PC.cameraObstacles),
    Ow.setObstacles(PC.followCameraObstacles),
    pw.traverse((e) => {
      e.isMesh && e.visible && !e.customDepthMaterial && Aw.push(e);
    }),
    ($ = QS(pw, e, { reducedMotion: lC })),
    (IC = e.boat.clone(!0)),
    pw.add(IC),
    IC.traverse((e) => {
      e.isMesh && ((e.castShadow = !0), (e.receiveShadow = !0));
    }),
    (LC = Ob(IC)),
    (RC = aS(pw, r, { reducedMotion: lC, surface: yS })),
    (BC = rC(pw, e, { reducedMotion: lC, surface: yS })),
    NC.setSwimmer(BC.uniforms),
    (bC = HS(RC, IC)),
    (xC = HS(RC, IC, { leaving: !0 })),
    (_C = PS(pw, IC, i, { reducedMotion: lC })),
    _C.update(gC, 0),
    (vC = FS(_C.models.chair, RC)),
    (yC = IS(_C.models.boat, RC)),
    Pb(pw),
    fC.install(pw),
    xw(),
    pw.updateMatrixWorld(!0),
    (pw.matrixAutoUpdate = !1),
    (pw.matrixWorldAutoUpdate = !1),
    iC.stage(`Warming the water and light…`),
    await new Promise((e) => requestAnimationFrame(() => setTimeout(e, 0))),
    await NC.renderSurface(uw, () => dw.compile()),
    (qC = performance.now()),
    gE(qC),
    (nE = performance.now()),
    (tE = 0),
    (iE = 0),
    (aE = 0),
    (oE = 0),
    (sE = []),
    (cE = 0),
    NC.resetCounters(),
    (MC = !0),
    (Z(`begin`).disabled = !1),
    (Z(`begin-label`).textContent = `Step outside`),
    (Z(`load-status`).textContent = `Best enjoyed slowly · sound optional`),
    iC.stop(),
    lT(),
    Z(`loading-screen`).setAttribute(`aria-busy`, `false`),
    Z(`loading-screen`).setAttribute(`aria-hidden`, `true`),
    (document.documentElement.dataset.ready = `true`),
    mC.has(`explore`) && oT(),
    mC.has(`rain`) && (oT(), zC.preview(`play`)),
    mC.has(`fireside`) &&
      (oT(),
      $.interact({ x: -3, y: 0.97, z: -0.8 }),
      Q.place({ ...Jy, x: -1.9, z: -4.9, heading: Math.PI / 2 }),
      $.drag(Math.atan2(1.67, 1.33) / 0.0032, 95),
      lT()),
    mC.has(`spring`) &&
      (oT(),
      Q.reset({ aboard: !0 }),
      tT(!1, { announce: !1 }),
      eT({ ...Yf, x: 3, z: -11 }),
      (Pw = Nw = 2),
      (Mw = jw = 15),
      Hw(1)),
    mC.has(`aboard`) &&
      (Q.reset({ aboard: !0 }),
      tT(!0, { instant: !0, announce: !1 }),
      (Mw = 20)),
    (qC = performance.now()),
    hE(qC));
}
function hE(e) {
  if (AC) {
    requestAnimationFrame(hE);
    return;
  }
  if ((ST && (uE && dE.push(e - uE), (uE = e)), !DC.ready(e, OC ? 60 : 30))) {
    (fE++, requestAnimationFrame(hE));
    return;
  }
  try {
    (gE(e), requestAnimationFrame(hE));
  } catch (e) {
    cw(e);
  }
}
