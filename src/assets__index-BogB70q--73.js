// assets__index-BogB70q- 73 — math
// Lines 64876-65072 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
var bT = (e) => {
  (GC && e.pointerId !== GC.id) ||
    ((Q.mode === `boat` || e.type === `pointercancel` || WC || GC) &&
      (UC = null),
    (WC = null),
    (GC = null));
};
for (let e of [`pointerup`, `pointercancel`, `lostpointercapture`])
  cC.addEventListener(e, bT);
(cC.addEventListener(
  `wheel`,
  (e) => {
    if (
      (e.preventDefault(), !Dw.active && !Tw.active && !$?.active && !hC.active)
    ) {
      let t = Q.mode !== `boat` || gC.active;
      Mw = J(
        Mw + e.deltaY * 0.006,
        t ? 4.8 : 13,
        Q.mode !== `boat` && !gC.active ? 18 : t ? 11 : 29,
      );
    }
  },
  { passive: !1 },
),
  cC.addEventListener(`dblclick`, (e) => {
    if (!Dw.active || cT()) return;
    let t = cC.getBoundingClientRect();
    (kw.set(
      ((e.clientX - t.left) / t.width) * 2 - 1,
      1 - ((e.clientY - t.top) / t.height) * 2,
    ),
      aw.setFromCamera(kw, Cw));
    let n = aw.intersectObjects(Aw, !1)[0];
    n
      ? Dw.focusOn(n.point)
      : aw.ray.intersectPlane(ow.set(new U(0, 1, 0), -0.18), sw) &&
        Dw.focusOn(sw);
  }),
  cC.addEventListener(`webglcontextlost`, (e) => {
    (e.preventDefault(),
      (AC = !0),
      cw(
        Error(
          `The graphics context was interrupted. Refresh to return to the pond.`,
        ),
      ));
  }));
function xT(e) {
  if (!OC || Q.mode !== `boat` || gC.active || Dw.active || cT()) {
    ((CC.speed = 0), (CC.turnRate = 0), (CC.acceleration = 0));
    return;
  }
  if (
    (kC &&
      zT !== `live` &&
      ((zT = `live`), (Z(`boat-water-motion`).value = `live`)),
    zT !== `live`)
  ) {
    ((BT += e),
      gb(
        CC,
        {
          throttle: zT === `forward` ? 1 : zT === `reverse` ? -0.55 : 0,
          turn: zT === `left` ? 1 : zT === `right` ? -1 : 0,
          cruise: Xf,
        },
        e,
      ));
    return;
  }
  let t = 0,
    n = 0,
    r = (e) => VC.has(e) || [...HC.values()].includes(e);
  ((r(`KeyW`) || r(`ArrowUp`)) && (t = 1),
    (r(`KeyS`) || r(`ArrowDown`)) && (t = -0.55),
    (r(`KeyA`) || r(`ArrowLeft`)) && (n = 1),
    (r(`KeyD`) || r(`ArrowRight`)) && (n = -1));
  let i = UC;
  (kC && ((i = Zw.target(CC)), (Qw = $w + Zw.laps)),
    i && ({ turn: n, throttle: t } = hb(CC, i, { arrive: !kC })),
    gb(
      CC,
      { turn: n, throttle: t, cruise: kC ? 1.32 : 2.46, brake: r(`Space`) },
      e,
    ) &&
      (kC
        ? (Xw(!1), lw(`A quiet bank. Take the helm to turn away.`))
        : KC - XC > 12 &&
          Math.abs(t) > 0.1 &&
          (lw(`Turn gently away from the bank.`), (XC = KC))));
}
var ST = mC.has(`inspect`),
  CT,
  wT = !1,
  TT,
  ET,
  DT,
  OT,
  kT,
  AT = null,
  jT = null,
  MT,
  NT,
  PT = [
    [-3, -0.8, `enter`],
    [-3, -2.1],
    [-5.38, -2.1, null, `Passage entrance`],
    [-5.38, -5.98, `open-side`, `Bridge doorway`],
    [-7.1, -5.98],
    [-7.6, -6.45],
    [-11.65, -6.45, null, `Bridge crown`],
    [-17.55, -6.45, null, `Far bank`],
    ...Eh.points
      .slice(1)
      .map(([e, t], n, r) => [
        e,
        t,
        null,
        n === r.length - 1 ? `Pond bench` : null,
      ]),
  ],
  FT = [
    [-3, -0.8, `enter`],
    [-3, -2.1],
    [-0.8, -2.1, null, `Room stairs`],
    [-0.8, -6.22],
    [-1.94, -6.22, null, `Upstairs room`],
    [-1.94, -4.15],
    [-1.94, -2.12],
    [Jy.x, Jy.z, null, `Window seat`],
  ],
  IT = [
    [-3, 3.2],
    [-3, 0.6, null, `Straight walk`],
    [-3, 2.15],
    [-2.25, 2.15],
    [-3, 2.15, null, `Walk and turn complete`],
  ],
  LT = [
    ...Eh.points.slice(0, -1).reverse(),
    [-11.65, -6.45],
    [-7.6, -6.45],
    [-7.22, -5.98, `open-side`, `Return doorway`],
    [-5.38, -5.98],
    [-5.38, -2.1],
    [-3, -2.1, null, `Back in the hall`],
    [-3, -0.8],
    [-3, 2.15, null, `Back at the landing`],
  ];
function RT() {
  if (!jT || jT.paused || hC.active || $.resting) return null;
  let e = jT.route ?? PT,
    [t, n, r, i] = e[jT.index],
    a = t - Q.state.x,
    o = n - Q.state.z;
  if (Math.hypot(a, o) < 0.095) {
    if (r === `enter` && !$.passable)
      return ($.open || ($.interact(Q.state), lT()), { x: t, z: n });
    if (r === `open-side` && !$.bridgePassable)
      return ($.bridgeOpen || $.interact(Q.state), { x: t, z: n });
    if (
      (jT.index++,
      (jT.looking = !1),
      i &&
        ((jT.paused = !0),
        (NT.textContent = i),
        (MT.textContent = `Continue bridge walk`)),
      i && $.active && e[jT.index])
    ) {
      let [t, n] = e[jT.index],
        r = Math.atan2(
          Math.sin(Math.atan2(Q.state.x - t, Q.state.z - n) - $.angle),
          Math.cos(Math.atan2(Q.state.x - t, Q.state.z - n) - $.angle),
        );
      $.drag(-r / 0.0032, 0);
    }
    return (
      jT.index === e.length &&
        ((jT = null), (MT.textContent = `Walk bridge route`)),
      null
    );
  }
  if ($.active && !jT.looking) {
    let e = Math.atan2(
      Math.sin(Math.atan2(-a, -o) - $.angle),
      Math.cos(Math.atan2(-a, -o) - $.angle),
    );
    ($.drag(-e / 0.0032, 0), (jT.looking = !0));
  }
  return { x: t, z: n };
}
var zT = `live`,
  BT = 0,
  VT = !1,
  HT = !1,
  UT = { x: 0, z: 9, heading: Math.PI / 2 };
