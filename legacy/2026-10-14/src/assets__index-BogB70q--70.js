// assets__index-BogB70q- 70 — math
// Lines 63907-64206 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
var Cw = new rc(36, innerWidth / innerHeight, 0.25, 500),
  ww = Cw.clone(),
  Tw = Rb({ reducedMotion: lC }),
  Ew = new U(),
  Dw = X_(Cw, cC, { groundHeight: Y, water: q, reducedMotion: lC }),
  Ow = zb({ reducedMotion: lC }),
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
      ? J(0.38 + (24 - jw) * 0.048, 0.38, 0.8)
      : J(0.16 + (24 - jw) * 0.06, 0.16, 0.8);
  if (kC) {
    let t = Math.atan2(wC.x + 3, wC.z + 4.2) + 0.23;
    Pw +=
      Math.atan2(Math.sin(t - Pw), Math.cos(t - Pw)) * (1 - Math.exp(-e * 0.5));
  }
  gC.active
    ? gC.setting === `chair`
      ? Bw.set(oS.x - 0.65, 1, oS.z + 0.12)
      : Bw.set(-0.65, 0.95, -0.25)
          .applyQuaternion(IC.quaternion)
          .add(IC.position)
    : Fw
      ? Bw.copy(Fw)
      : Q.state.swim
        ? Bw.set(Q.state.x, q + 0.28, Q.state.z)
        : Q.boarding?.phase === `step` || Q.leaving?.phase === `step`
          ? (Bw.copy(RC.root.position), (Bw.y = Math.max(0.85, Bw.y + 0.85)))
          : OC && Q.mode === `foot`
            ? Bw.set(Q.state.x, Q.state.y + 0.95 + n * 2.3, Q.state.z)
            : OC
              ? Bw.set(wC.x * r - 0.1, 1.6, wC.z * r - 0.6)
              : Bw.set(-1.5, 3.7, -2);
  let i = Q.swimming && Q.transitioning && !Fw && !Dw.active,
    a = i ? Pw + Math.atan2(Math.sin(-0.65 - Pw), Math.cos(-0.65 - Pw)) : Pw;
  (zw.lerp(Bw, t),
    (Nw = It.lerp(Nw, a, lC && (i || Rw) ? 1 : t)),
    (Rw = i),
    (jw = It.lerp(jw, Mw, 1 - Math.exp(-e * 4))),
    Uw());
  let o = innerWidth / innerHeight,
    s = o < 0.8 ? (gC.active ? Math.max(1.3, 0.84 / o) : 1.3) : 1,
    c = (jw * s) / (2 * Math.tan(It.degToRad(18))),
    l = gC.active
      ? 0.53
      : Fw
        ? Iw
        : OC
          ? Q.swimming
            ? 0.38
            : Q.mode === `foot`
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
    Ow.update(ww.position, zw, e, { enabled: Q.swimming && !Fw && !Dw.active }),
    Tw.update(Cw, ww, IC, e),
    $?.updateCamera(Cw, Q.state, e),
    hC.updateCamera(Cw, Q.state, e),
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
  (Dw.update(Cw, e, { enabled: OC && !cT() }),
    Ew.set(0, 0, -1).applyQuaternion(Cw.quaternion),
    (Z(`compass-needle`).style.transform =
      `rotate(${(-Math.atan2(-Ew.x, -Ew.z) * 180) / Math.PI}deg)`));
}
function Uw() {
  ((Cw.aspect = innerWidth / innerHeight), Cw.updateProjectionMatrix());
}
(Hw(1),
  Vw(),
  (dw = Vp(uw, pw, Cw, { sun: hw, clouds: fC })),
  dw.setLow(jC),
  dw.resize(innerWidth, innerHeight));
var Ww = Z(`map`).getContext(`2d`),
  Gw = document.createElement(`canvas`);
((Gw.width = 460), (Gw.height = 380));
var Kw = Gw.getContext(`2d`),
  qw = (e, t) => [(e / 48 + 0.5) * 460, ((t - 0.4) / 40 + 0.5) * 380];
function Jw() {
  let e = Kw.createImageData(460, 380);
  for (let t = 0; t < 380; t++)
    for (let n = 0; n < 460; n++) {
      let r = (n / 460 - 0.5) * 48,
        i = (t / 380 - 0.5) * 40 + 0.4,
        a = Y(r, i),
        o = (t * 460 + n) * 4,
        s =
          a > 0.18
            ? [106, 123, 79]
            : a > -0.45
              ? [154, 175, 141]
              : [178, 201, 176],
        c = Math.sin(r * 0.6) * Math.sin(i * 0.5) * 3;
      ((e.data[o] = s[0] + c),
        (e.data[o + 1] = s[1] + c),
        (e.data[o + 2] = s[2] + c),
        (e.data[o + 3] = 255));
    }
  (Kw.putImageData(e, 0, 0),
    (Kw.strokeStyle = `#ede7d366`),
    (Kw.lineWidth = 1));
  for (let e = 0; e < 460; e += 46)
    (Kw.beginPath(), Kw.moveTo(e, 0), Kw.lineTo(e, 380), Kw.stroke());
  for (let e = 0; e < 380; e += 46)
    (Kw.beginPath(), Kw.moveTo(0, e), Kw.lineTo(460, e), Kw.stroke());
  ((Kw.fillStyle = `#354a34`),
    (Kw.font = `italic 17px Georgia`),
    (Kw.textAlign = `center`));
  for (let [e, t, n] of [
    [9, 5, `Willow bank`],
    [-8, 7, `Lily shallows`],
  ])
    Kw.fillText(n, ...qw(e, t));
  ((Kw.strokeStyle = `#efe8ca`),
    (Kw.lineWidth = 3),
    Kw.setLineDash([5, 4]),
    Kw.beginPath(),
    [
      [-3, 1.78],
      [-3, -2.1],
      [-5.38, -2.1],
      [-5.38, -6.45],
      ...Eh.points,
    ].forEach(([e, t], n) => Kw[n ? `lineTo` : `moveTo`](...qw(e, t))),
    Kw.stroke(),
    Kw.setLineDash([]));
  for (let [e, t] of [
    [-3, -4.2],
    [mS.shore.x, mS.shore.z],
    [-11.65, -6.45],
    [Dh.x, Dh.z],
  ].entries()) {
    let [n, r] = qw(...t);
    (Kw.beginPath(),
      Kw.arc(n, r, 11, 0, Math.PI * 2),
      (Kw.fillStyle = `#3c5741`),
      Kw.fill(),
      (Kw.strokeStyle = `#efe8ca`),
      (Kw.lineWidth = 2),
      Kw.stroke(),
      (Kw.fillStyle = `#f3edd9`),
      (Kw.font = `12px Arial`),
      (Kw.textBaseline = `middle`),
      Kw.fillText(String(e + 1), n, r + 1));
  }
}
function Yw() {
  let e = Q.mode === `boat` ? CC : Q.state;
  Ww.drawImage(Gw, 0, 0);
  let [t, n] = qw(e.x, e.z);
  (Ww.save(),
    Ww.translate(t, n),
    Ww.rotate(-e.heading),
    Ww.beginPath(),
    Ww.moveTo(0, 8),
    Ww.lineTo(-4, -5),
    Ww.lineTo(4, -5),
    Ww.closePath(),
    (Ww.fillStyle = `#d08b43`),
    (Ww.strokeStyle = `#f8f0d5`),
    (Ww.lineWidth = 2),
    Ww.fill(),
    Ww.stroke(),
    Ww.restore());
}
(Jw(), Yw());
function Xw(e) {
  ((kC = !!e && Q.mode === `boat` && !Q.transitioning && !gC.active),
    Z(`drift`).setAttribute(`aria-pressed`, String(kC)),
    (Z(`drift`).querySelector(`span`).textContent = kC
      ? `Take the helm`
      : `Just drift`),
    kC &&
      ((Fw = null),
      (UC = null),
      (Zw = _b(CC)),
      ($w = Qw),
      lw(`A gentle way around. Steer whenever you like.`)));
}
var Zw,
  Qw = 0,
  $w = 0;
function eT(e) {
  ((Fw = null),
    Object.assign(CC, { ...e, speed: 0, turnRate: 0, acceleration: 0 }),
    TC.reset(),
    EC.reset(),
    NC?.resetWake(),
    (wC = { ...CC }),
    Tw.recenter({ instant: !0 }));
}
function tT(e, { instant: t = !1, announce: n = !0 } = {}) {
  MC &&
    (OC || oT(),
    Dw.leave(Cw, { instant: t, inside: $?.active }),
    (e = !!e && Q.mode === `boat` && !gC.active),
    _T(),
    (Fw = null),
    Tw.recenter({ instant: !0 }),
    Tw.setActive(e, { instant: t }),
    (Z(`look-ahead`).hidden = !e),
    (Z(`boat-controls`).hidden = !e),
    (Z(`pointer-hint`).textContent = e
      ? `drag to look · V to change view`
      : `or hold on the water`),
    (Z(`view-help`).innerHTML = e
      ? `Drag to look around. Press R to look ahead.<br>WASD steers the boat; on touch screens, hold the arrow buttons. Just drift takes you around the lake.`
      : `Or press and hold on the water to steer.<br>Scroll to move closer. Drag with the right mouse button to look around.`),
    cC.setAttribute(
      `aria-label`,
      e
        ? `View from inside the boat. W or up arrow moves forward. A and D turn. S reverses. Space brakes. Drag to look around, R looks ahead, and V switches to Explore.`
        : `Explore by boat. W or up arrow moves forward. A and D or left and right arrows turn. S reverses. Space slows down. Hold on the water to steer. V switches to the Keeper’s view.`,
    ),
    cC.focus({ preventScroll: !0 }),
    lT(),
    n &&
      lw(
        e
          ? uC.matches
            ? `Aboard. Drag to look around; tap Look ahead to recenter.`
            : `Aboard. Drag to look around; R looks ahead.`
          : `A little perspective.`,
      ));
}
function nT() {
  return {
    aboard: Q.mode === `boat`,
    fishing: gC.active,
    immersive: !!($?.active || hC.active),
  };
}
function rT() {
  return Dw.active
    ? `explore`
    : Tw.active || nT().immersive
      ? `keeper`
      : `follow`;
}
function iT() {
  if (!MC || cT()) return;
  OC || oT();
  let e = rT(),
    t = U_(e, nT());
  (t === `explore`
    ? (Dw.enter(Cw, ww, zw, { immersive: e === `keeper`, inside: $?.active }),
      _T(),
      Xw(!1),
      vT(),
      Tw.setActive(!1, { instant: !0 }),
      (CC.speed = CC.turnRate = CC.acceleration = 0),
      TC.reset(),
      (wC = { ...CC }),
      lw(
        uC.matches
          ? `Explore. One finger orbits, two fingers pan; pinch to zoom. Tap the view button to return.`
          : `Explore. Drag to pan, right-drag to orbit, scroll to zoom. V returns to the Keeper.`,
      ))
    : (Dw.leave(Cw, { inside: $?.active }),
      nT().immersive || tT(t === `keeper`, { announce: !1 }),
      _T(),
      lw(t === `keeper` ? `Keeper’s view.` : `Following the Keeper.`)),
    lT(),
    cC.focus({ preventScroll: !0 }));
}
