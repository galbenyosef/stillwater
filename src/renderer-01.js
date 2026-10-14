// renderer-01.js — the renderer, scene, lights and cameras (WebGL setup, shadow sun, resize)
// Lines 63831-64014 of readable/assets__index-BogB70q-.pretty.js (cluster renderer, statement-aligned).
var uw, dw;
try {
  uw = new sf({
    canvas: canvasEl,
    antialias: !1,
    powerPreference: `high-performance`,
    alpha: !1,
  });
} catch (e) {
  throw (
    cw(
      Error(
        `This view needs WebGL. Try enabling hardware acceleration and reopen Stillwater.`,
      ),
    ),
    e
  );
}
function fw(e, t) {
  return Math.min(
    devicePixelRatio,
    balancedQuality ? 1.5 : 2,
    Math.sqrt((balancedQuality ? 34e5 : 45e5) / (e * t)),
  );
}
(uw.setPixelRatio(fw(innerWidth, innerHeight)),
  uw.setSize(innerWidth, innerHeight),
  (uw.outputColorSpace = We),
  (uw.toneMapping = 4),
  (uw.toneMappingExposure = 1.05),
  (uw.shadowMap.enabled = !0),
  (uw.shadowMap.type = 1),
  (uw.shadowMap.autoUpdate = !1));
var pw = new Un();
((pw.background = new G(`#a5c2cc`)), (pw.fog = new Hn(`#b5c2bd`, 25, 200)));
var mw = new Gs(`#d2e3ee`, `#77735b`, 0.26);
pw.add(mw);
var hw = new uc(`#fff0d4`, 6);
(hw.position.copy(_f), (hw.castShadow = !0));
var gw = balancedQuality ? 1536 : 2048;
(hw.shadow.mapSize.set(gw, gw),
  Object.assign(hw.shadow.camera, {
    left: -25,
    right: 25,
    top: 25,
    bottom: -25,
    near: 1,
    far: 100,
  }),
  hw.shadow.camera.updateProjectionMatrix(),
  (hw.shadow.normalBias = 0.04),
  (hw.shadow.bias = -15e-5),
  (hw.shadow.radius = 1.4),
  pw.add(hw),
  pw.add(hw.target));
var _w = _f.clone().normalize().negate(),
  vw = _w
    .clone()
    .cross(new U(0, 1, 0))
    .normalize(),
  yw = vw.clone().cross(_w).normalize(),
  bw = new U();
function xw() {
  bw.set(0, 0, 1);
  let e = 50 / hw.shadow.mapSize.x,
    t = bw.dot(vw),
    n = bw.dot(yw);
  (bw
    .addScaledVector(vw, Math.round(t / e) * e - t)
    .addScaledVector(yw, Math.round(n / e) * e - n),
    hw.target.position.copy(bw),
    hw.position.copy(bw).add(_f),
    (uw.shadowMap.needsUpdate = !0));
}
var Sw = new uc(`#d5e5ed`, 0.18);
(Sw.position.set(-8, 9, 18), pw.add(Sw));
var Cw = new rc(36, innerWidth / innerHeight, 0.25, 500),
  ww = Cw.clone(),
  Tw = Rb({ reducedMotion: reducedMotion }),
  Ew = new U(),
  Dw = X_(Cw, canvasEl, { groundHeight: islandHeight, water: q, reducedMotion: reducedMotion }),
  Ow = zb({ reducedMotion: reducedMotion }),
  kw = new V(),
  Aw = [],
  jw = 19,
  Mw = 19,
  Nw = 0.55,
  Pw = 0.55,
  Fw = null,
  Iw = 0.68,
  Lw = !1,
  Rw = !1,
  zw = new U(-1.5, 3.7, -2),
  Bw = zw.clone();
function Vw() {
  let e = innerWidth,
    t = innerHeight;
  (uw.setPixelRatio(fw(e, t)), uw.setSize(e, t), Uw(), dw?.resize(e, t));
}
function Hw(e) {
  let t = 1 - Math.exp(-e * 1.75),
    n = It.smoothstep(jw, 8, 16),
    r = kC
      ? clampValue(0.38 + (24 - jw) * 0.048, 0.38, 0.8)
      : clampValue(0.16 + (24 - jw) * 0.06, 0.16, 0.8);
  if (kC) {
    let t = Math.atan2(wC.x + 3, wC.z + 4.2) + 0.23;
    Pw +=
      Math.atan2(Math.sin(t - Pw), Math.cos(t - Pw)) * (1 - Math.exp(-e * 0.5));
  }
  fishingState.active
    ? fishingState.setting === `chair`
      ? Bw.set(chairSpec.x - 0.65, 1, chairSpec.z + 0.12)
      : Bw.set(-0.65, 0.95, -0.25)
          .applyQuaternion(IC.quaternion)
          .add(IC.position)
    : Fw
      ? Bw.copy(Fw)
      : playerState.state.swim
        ? Bw.set(playerState.state.x, q + 0.28, playerState.state.z)
        : playerState.boarding?.phase === `step` || playerState.leaving?.phase === `step`
          ? (Bw.copy(RC.root.position), (Bw.y = Math.max(0.85, Bw.y + 0.85)))
          : experienceStarted && playerState.mode === `foot`
            ? Bw.set(playerState.state.x, playerState.state.y + 0.95 + n * 2.3, playerState.state.z)
            : experienceStarted
              ? Bw.set(wC.x * r - 0.1, 1.6, wC.z * r - 0.6)
              : Bw.set(-1.5, 3.7, -2);
  let i = playerState.swimming && playerState.transitioning && !Fw && !Dw.active,
    a = i ? Pw + Math.atan2(Math.sin(-0.65 - Pw), Math.cos(-0.65 - Pw)) : Pw;
  (zw.lerp(Bw, t),
    (Nw = It.lerp(Nw, a, reducedMotion && (i || Rw) ? 1 : t)),
    (Rw = i),
    (jw = It.lerp(jw, Mw, 1 - Math.exp(-e * 4))),
    Uw());
  let o = innerWidth / innerHeight,
    s = o < 0.8 ? (fishingState.active ? Math.max(1.3, 0.84 / o) : 1.3) : 1,
    c = (jw * s) / (2 * Math.tan(It.degToRad(18))),
    l = fishingState.active
      ? 0.53
      : Fw
        ? Iw
        : experienceStarted
          ? playerState.swimming
            ? 0.38
            : playerState.mode === `foot`
              ? 0.3 - n * 0.14
              : 0.68
          : 0.13,
    u = c * Math.cos(l);
  if (
    (ww.position.set(
      zw.x + Math.sin(Nw) * u,
      zw.y + Math.sin(l) * c,
      zw.z + Math.cos(Nw) * u,
    ),
    ww.lookAt(zw),
    Ow.update(ww.position, zw, e, { enabled: playerState.swimming && !Fw && !Dw.active }),
    Tw.update(Cw, ww, IC, e),
    $?.updateCamera(Cw, playerState.state, e),
    hC.updateCamera(Cw, playerState.state, e),
    Dw.active)
  ) {
    let t = (e) => VC.has(e);
    cT() ||
      Dw.panKeys(
        Number(t(`KeyD`) || t(`ArrowRight`)) -
          Number(t(`KeyA`) || t(`ArrowLeft`)),
        Number(t(`KeyW`) || t(`ArrowUp`)) - Number(t(`KeyS`) || t(`ArrowDown`)),
        e,
      );
  }
  (Dw.update(Cw, e, { enabled: experienceStarted && !cT() }),
    Ew.set(0, 0, -1).applyQuaternion(Cw.quaternion),
    (byId(`compass-needle`).style.transform =
      `rotate(${(-Math.atan2(-Ew.x, -Ew.z) * 180) / Math.PI}deg)`));
}
function Uw() {
  ((Cw.aspect = innerWidth / innerHeight), Cw.updateProjectionMatrix());
}
(Hw(1),
  Vw(),
  (dw = createRenderPipeline(uw, pw, Cw, { sun: hw, clouds: cloudShadows })),
  dw.setLow(balancedQuality),
  dw.resize(innerWidth, innerHeight));
