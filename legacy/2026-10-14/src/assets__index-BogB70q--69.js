// assets__index-BogB70q- 69 — math
// Lines 63570-63906 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function rC(e, t, n = {}) {
  let r = new Pn();
  r.name = `Landing swim ladder`;
  let i;
  (t.dockprops.traverse((e) => {
    for (let t of e.isMesh
      ? Array.isArray(e.material)
        ? e.material
        : [e.material]
      : [])
      t.name === `Dock | Oak weathered` && (i = t);
  }),
    (i = i?.clone() ?? new rs({ color: `#695844`, roughness: 0.95 })),
    (i.vertexColors = !1),
    (i.aoMap = null),
    (i.name = `Swim ladder | weathered oak`));
  let a = [],
    o = [],
    s = (e, t, n, r, i, a, o) => {
      let s = new ba(t, n, r);
      (s.translate(i, a, o), e.push(s));
    },
    {
      ladderX: c,
      water: { z: l },
      bottom: u,
      railSpacing: d,
    } = Vx;
  for (let e of [-1, 1])
    s(a, 0.09, 1.33 - u, 0.085, c, (1.33 + u) / 2, l + (e * d) / 2);
  for (let e = Vx.rungTop - 0.0325; e > u + 0.06; e -= Vx.rungSpacing) {
    s(a, 0.13, 0.065, d + 0.04, c - 0.02, e, l);
    for (let t of [-1, 1])
      s(o, 0.007, 0.023, 0.023, c - 0.049, e, l + (t * d) / 2);
  }
  for (let e of [-1, 1])
    s(o, 0.18, 0.045, 0.045, c + 0.065, 0.43, l + (e * d) / 2);
  for (let [e, t] of [
    [a, i],
    [o, new rs({ color: `#3c3932`, roughness: 0.78, metalness: 0.55 })],
  ]) {
    let n = new vi(Hp(e), t);
    ((n.castShadow = n.receiveShadow = !0),
      r.add(n),
      e.forEach((e) => e.dispose()));
  }
  e.add(r);
  let f = Array.from({ length: 3 }, () => new tn()),
    p = {
      uSwimContact: { value: new tn(0, 0, 0, 0) },
      uSwimMotion: { value: new V() },
      uSwimSections: { value: f },
    },
    m = [],
    h = new U(),
    g = new U(),
    _ = new U(),
    v = new U(),
    y = -1,
    b = -1,
    x = 0,
    S = `dry`,
    C = null,
    w = [
      [`pelvis`, 0.22, 0.17],
      [`spine_01`, 0.23, 0.17],
      [`spine_03`, 0.25, 0.19],
      [`neck_01`, 0.14, 0.12],
    ],
    T = [`l`, `r`].map((e) => [
      [`thigh_${e}`, 0.13, 0.14],
      [`calf_${e}`, 0.11, 0.12],
      [`foot_${e}`, 0.085, 0.15],
      [`ball_${e}`, 0.085, 0.12],
    ]);
  function E(e, t, n) {
    n.set(0, 0, 0, 0);
    for (let r = 0; r < t.length - 1; r++) {
      (e.root.getObjectByName(t[r][0]).getWorldPosition(_),
        e.root.getObjectByName(t[r + 1][0]).getWorldPosition(v));
      let i = v.y - _.y,
        a = Math.abs(i) < 1e-5 ? 0.5 : Math.max(0, Math.min(1, (q - _.y) / i));
      h.copy(_).lerp(v, a);
      let o = Math.abs(h.y - q);
      if (o >= 0.065) continue;
      let s = Math.sqrt(1 - (o / 0.065) ** 2);
      return (
        n.set(
          h.x,
          h.z,
          (t[r][1] + (t[r + 1][1] - t[r][1]) * a) * s,
          (t[r][2] + (t[r + 1][2] - t[r][2]) * a) * s,
        ),
        !0
      );
    }
    return !1;
  }
  let D = (e, t, n) => {
      (m.push({ x: e, z: t, age: 0, strength: n }), m.length > 6 && m.shift());
    },
    O = nC(e, { ...n, impact: D });
  return {
    root: r,
    ripples: m,
    uniforms: p,
    drips: O,
    reset() {
      (O.reset(),
        (m.length = 0),
        (y = b = -1),
        (x = 0),
        (S = `dry`),
        (C = null),
        (p.uSwimContact.value.w = 0),
        f.forEach((e) => e.set(0, 0, 0, 0)));
    },
    update(e, t, n) {
      for (let e = m.length - 1; e >= 0; e--)
        ((m[e].age += n), m[e].age > 3.8 && m.splice(e, 1));
      if (n <= 0) return;
      O.update(e, t, n);
      let r = e.state.swim,
        i = r?.phase ?? `dry`;
      if (
        (i !== S && ((C = null), (y = b = -1), (x = 0), (S = i)),
        f.forEach((e) => e.set(0, 0, 0, 0)),
        !r)
      ) {
        p.uSwimContact.value.w = 0;
        return;
      }
      E(t, w, f[0]) || T.forEach((e, n) => E(t, e, f[n + 1]));
      let a = +!!f.some((e) => e.z > 0.001);
      if (
        (p.uSwimContact.value.set(e.state.x, e.state.z, e.state.heading, a),
        p.uSwimMotion.value.set(
          r.effort,
          Math.min(1, e.state.speed / Vx.speed),
        ),
        i === `entering` || i === `exiting`)
      ) {
        if (
          (t.root.getObjectByName(`pelvis`).getWorldPosition(g),
          (x += n),
          a && (C === null || (x > 0.65 && Math.abs(g.y - C) > 0.09)))
        ) {
          for (let e of f) e.z > 0.001 && D(e.x, e.y, e.z > 0.18 ? 0.62 : 0.42);
          ((C = g.y), (x = 0));
        }
        return;
      }
      let o = r.cycle ?? r.time / Vx.strokeDuration,
        s = Math.floor(o - 0.25),
        c = Math.floor(o - 0.65);
      if (r.effort > 0.18) {
        if (s !== y)
          for (let e of [`l`, `r`])
            (t.root.getObjectByName(`hand_${e}`).getWorldPosition(h),
              D(h.x, h.z, 0.55 + r.effort * 0.42));
        if (c !== b)
          for (let e of [`l`, `r`])
            (t.root.getObjectByName(`foot_${e}`).getWorldPosition(h),
              D(h.x, h.z, 0.32 + r.effort * 0.2));
        ((y = s), (b = c), (x = 0));
      } else
        ((y = s),
          (b = c),
          (x += n),
          x > 1.4 &&
            (t.root
              .getObjectByName(
                Math.floor(r.time / 1.4) % 2 ? `hand_l` : `hand_r`,
              )
              .getWorldPosition(h),
            D(h.x, h.z, 0.28),
            (x = 0)));
    },
  };
}
var Z = (e) => document.getElementById(e);
Fs.setURLModifier(uf);
var iC = hf(document, Fs, $_.length),
  aC = pf(),
  oC = [`map`, `help`, `settings`],
  sC = () => oC.some((e) => !Z(e + `-panel`).hidden),
  cC = Z(`world`),
  lC = matchMedia(`(prefers-reduced-motion: reduce)`).matches,
  uC = matchMedia(`(pointer:coarse), (max-width:800px)`),
  dC = () => {
    Z(`keyboard-help`).open = !uC.matches;
  };
(uC.addEventListener(`change`, dC), dC());
var fC = Mf({ reducedMotion: lC }),
  pC = Bf({ reducedMotion: lC }),
  mC = new URLSearchParams(location.search),
  Q = wS(),
  hC = $S(),
  gC = dS({ chairPath: xS }),
  _C,
  vC,
  yC,
  bC,
  xC,
  SC = null,
  CC = { ...mS.boat, speed: 0, turnRate: 0, acceleration: 0 },
  wC = { ...CC },
  TC = Jv(CC, xT),
  EC = Qv(),
  DC = $v(),
  OC = !1,
  kC = !1,
  AC = !1,
  jC = aC.quality === `balanced`,
  MC = !1,
  NC,
  PC,
  FC,
  IC,
  LC,
  RC,
  $,
  zC,
  BC,
  VC = new Set(),
  HC = new Map(),
  UC = null,
  WC = null,
  GC = null,
  KC = 0,
  qC = performance.now(),
  JC = 0,
  YC = ``,
  XC = 0,
  ZC,
  QC = !1,
  $C = ``,
  ew = ``,
  tw = new U(),
  nw = { walk: 0, gait: 0, seated: !0 },
  rw = new mb();
rw.setVolume(aC.volume);
var iw = new V(),
  aw = new Ic(),
  ow = new Yr(new U(0, 1, 0), -q),
  sw = new U();
function cw(e) {
  (iC.stop(),
    console.error(e),
    (Z(`error`).hidden = !1),
    (Z(`error-message`).textContent =
      e instanceof Error
        ? e.message
        : `The scene could not load. Please refresh to try again.`));
}
function lw(e) {
  ((Z(`toast`).textContent = e),
    Z(`toast`).classList.add(`visible`),
    clearTimeout(ZC),
    (ZC = setTimeout(() => Z(`toast`).classList.remove(`visible`), 3200)));
}
var uw, dw;
try {
  uw = new sf({
    canvas: cC,
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
    jC ? 1.5 : 2,
    Math.sqrt((jC ? 34e5 : 45e5) / (e * t)),
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
var gw = jC ? 1536 : 2048;
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
