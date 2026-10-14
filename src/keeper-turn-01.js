// keeper-turn-01.js — the keeper's turn-in-place animations and the bone map
// Lines 58599-58922 of readable/assets__index-BogB70q-.pretty.js (cluster keeper-turn, statement-aligned).
var Hb = (e) => Math.max(0, Math.min(1, e)),
  Ub = (e) => {
    let t = Hb(e);
    return t * t * (3 - 2 * t);
  },
  Wb = 0.145;
function Gb(e) {
  return Math.abs(e) > Math.PI / 2 + 0.01 ? 4 : 2;
}
function Kb(e) {
  return 0.36 + Math.abs(e) * 0.21;
}
function qb(e) {
  return `KeeperTurn${e >= 0 ? `Left` : `Right`}${Gb(e) === 4 ? `180` : `90`}`;
}
function Jb(e, t) {
  let n = Hb(t),
    r = 0.1;
  return (
    e *
    (n < r
      ? (n * n) / (2 * r * 0.9)
      : n > 0.9
        ? 1 - (1 - n) ** 2 / (2 * r * 0.9)
        : (n - r / 2) / 0.9)
  );
}
function Yb(e, t, n) {
  let r = Gb(e),
    i = n === (e >= 0 ? `l` : `r`) ? 0 : 1,
    a = 0;
  for (let n = i; n < r; n += 2) {
    let o = (n + 0.08) / r,
      s = (n + 0.92) / r,
      c = (e * (Math.floor(n / 2) + 1)) / (r / 2);
    if (t < o)
      return { from: a, to: a, t: 0, lift: 0, contact: !0, first: n === i };
    if (t < s) {
      let e = (t - o) / (s - o);
      return {
        from: a,
        to: c,
        t: Ub(e),
        lift: 0.055 * Math.sin(Math.PI * e) ** 1.5,
        contact: !1,
        first: n === i,
      };
    }
    a = c;
  }
  return { from: a, to: a, t: 0, lift: 0, contact: !0, first: !1 };
}
var Xb = { x: -3, near: 2.15, far: 3.42, y: 0.482 },
  Zb = 1.1,
  Qb = 0.77,
  $b = 43 / 30,
  ex = $b * 0.25,
  tx = (e) => e * e * (3 - 2 * e),
  nx = 0.6,
  rx = { ankle: 0.103, heel: -0.114, toe: 0.205 };
function ix(e) {
  let t = (t, n) => tx(Math.max(0, Math.min(1, (e - t) / (n - t))));
  return e < 0.6
    ? -0.17 * (1 - t(0, 0.1)) + 0.3 * t(0.44, nx)
    : 0.3 * (1 - t(nx, 0.78)) - 0.17 * t(0.86, 1);
}
var ax = 0.35,
  ox = (Xb.far - Xb.near) / Zb + ax,
  sx = [
    [`idle`, 21],
    [`out`, ox],
    [`idle`, 26],
    [`turn`, Kb(Math.PI)],
    [`back`, ox],
    [`turn`, Kb(Math.PI)],
  ],
  cx = sx.reduce((e, [, t]) => e + t, 0);
function lx(e, { reducedMotion: t = !1, mode: n = `routine` } = {}, r = {}) {
  if (
    ((r.x = Xb.x),
    (r.y = Xb.y),
    (r.z = Xb.near),
    (r.heading = 0),
    (r.walk = 0),
    (r.gait = ex),
    (r.turn = 0),
    (r.look = 0),
    (r.stride = 1),
    (r.pivot = null),
    (r.state = `Watching the pond`),
    t || n === `idle`)
  )
    return r;
  if (n === `walk`)
    return (
      (r.walk = 1),
      (r.gait = (e * Zb) / Qb),
      (r.state = `Walking preview`),
      r
    );
  let i = ((e % cx) + cx) % cx,
    a = 0;
  for (; a < sx.length - 1 && i >= sx[a][1]; a++) i -= sx[a][1];
  let [o, s] = sx[a];
  if (
    (a >= 2 && a <= 3 && (r.z = Xb.far),
    a >= 4 && (r.heading = Math.PI),
    o === `turn`)
  ) {
    let t = a === 3 ? 0 : Math.PI;
    ((r.pivot = {
      id: `routine-${Math.floor(e / cx)}-${a}`,
      stage: `turn`,
      angle: Math.PI,
      startHeading: t,
      progress: i / s,
    }),
      (r.heading = t + Jb(Math.PI, i / s)),
      (r.state = `Turning`));
  } else if (o === `out` || o === `back`) {
    let e = (e) => ax * (e ** 3 - 0.5 * e ** 4),
      t;
    if (i < ax) ((r.walk = tx(i / ax)), (t = Zb * e(i / ax)));
    else if (i > s - ax) {
      let n = s - i;
      ((r.walk = tx(n / ax)), (t = Xb.far - Xb.near - Zb * e(n / ax)));
    } else ((r.walk = 1), (t = Zb * (i - ax * 0.5)));
    ((r.z = o === `out` ? Xb.near + t : Xb.far - t),
      (r.gait = ex + t / Qb),
      (r.state = `Walking along the dock`));
  }
  return r;
}
function mapSkeleton(e, t, n) {
  let r = [],
    i = [];
  e.traverse((e) => {
    (e.isBone && r.push(e),
      e.morphTargetDictionary?.HelmNeutral !== void 0 && i.push(e));
  });
  let a = (t) => e.getObjectByName(t),
    o = new Pc(e),
    s = new H().setFromAxisAngle(new U(0, 1, 0), Math.PI),
    c = [`Neutral`, `Left`, `Right`].map((i, c) => {
      let l = As.findByName(n, `KeeperHelm` + i);
      if (!l) throw Error(`Keeper animation missing: KeeperHelm${i}`);
      (o.clipAction(l).play(), o.update(0), t.updateMatrixWorld(!0));
      let u = {
          joints: r.map((e) => ({
            position: e.position.clone(),
            rotation: e.quaternion.clone(),
          })),
        },
        d = [0, -xb.maxAngle, xb.maxAngle][c],
        f = new H().setFromAxisAngle(new U().copy(xb.axis), d).invert();
      if (
        ((u.gripOffset = a(`hand_r`)
          .getWorldPosition(new U())
          .applyQuaternion(s)
          .add(yb)
          .sub(wb(d))
          .applyQuaternion(f)),
        (u.gripRotation = f
          .clone()
          .multiply(s)
          .multiply(a(`hand_r`).getWorldQuaternion(new H()))),
        c === 0 &&
          ((u.support = [`hand_l`, `foot_l`, `foot_r`].map((e) => ({
            position: a(e).getWorldPosition(new U()),
            rotation: a(e).getWorldQuaternion(new H()),
          }))),
          (u.lap = a(`thigh_l`).worldToLocal(
            a(`hand_l`).getWorldPosition(new U()),
          )),
          e.userData.resident))
      ) {
        let e = a(`thigh_l`).getWorldPosition(new U()),
          n = a(`calf_l`).getWorldPosition(new U());
        u.lap = a(`thigh_l`).worldToLocal(
          e
            .lerp(n, 0.55)
            .add(
              new U(0, 0.18, 0).applyQuaternion(t.getWorldQuaternion(new H())),
            ),
        );
        let r = a(`hand_l`).getWorldPosition(new U()),
          i = a(`middle_01_l`).getWorldPosition(new U()).sub(r).normalize(),
          o = a(`index_01_l`)
            .getWorldPosition(new U())
            .sub(a(`pinky_01_l`).getWorldPosition(new U()));
        (o.addScaledVector(i, -o.dot(i)).normalize(),
          (u.handFrame = new H()
            .setFromRotationMatrix(new W().makeBasis(o, i, o.clone().cross(i)))
            .invert()
            .multiply(a(`hand_l`).getWorldQuaternion(new H()))));
      }
      return (o.stopAllAction(), u);
    });
  o.uncacheRoot(e);
  let l = new U(),
    u = new U(),
    d = new U(),
    f = new H(),
    p = new H(),
    m = new H();
  function h(e, t, n) {
    (e.getWorldPosition(l),
      t.getWorldPosition(u),
      f.setFromUnitVectors(u.sub(l).normalize(), d.copy(n).sub(l).normalize()),
      e.getWorldQuaternion(m),
      e.parent.getWorldQuaternion(p),
      e.quaternion.copy(p.invert().multiply(f).multiply(m)),
      e.updateWorldMatrix(!1, !0));
  }
  let g = new U(),
    _ = new U(),
    v = new U(),
    y = new U();
  function b(e, t, n, r, i, a) {
    (e.getWorldPosition(g),
      a ? v.copy(a) : (t.getWorldPosition(v), v.sub(g)),
      _.copy(r).sub(g));
    let o = t.position.length(),
      s = n.position.length(),
      c = Math.max(Math.abs(o - s) + 1e-5, Math.min(_.length(), o + s - 1e-5));
    (_.normalize(), v.addScaledVector(_, -v.dot(_)).normalize());
    let l = (o * o - s * s + c * c) / (2 * c),
      u = Math.sqrt(Math.max(0, o * o - l * l));
    (y.copy(g).addScaledVector(_, l).addScaledVector(v, u),
      h(e, t, y),
      h(t, n, r),
      i &&
        (n.parent.getWorldQuaternion(p),
        n.quaternion.copy(p.invert().multiply(i)),
        n.updateWorldMatrix(!1, !0)));
  }
  let x = [
      [`upperarm_l`, `lowerarm_l`, `hand_l`],
      [`thigh_l`, `calf_l`, `foot_l`],
      [`thigh_r`, `calf_r`, `foot_r`],
    ].map((e) => e.map(a)),
    S = new Set(),
    C = new Set();
  (a(`clavicle_l`).traverse((e) => S.add(e)),
    a(`clavicle_r`).traverse((e) => C.add(e)));
  let w = [`upperarm_r`, `lowerarm_r`, `hand_r`].map(a),
    T = !!e.userData.resident,
    E = a(`thigh_l`),
    D = x[0][2],
    O = new U(),
    k = new U(),
    A = new U(),
    j = new U(),
    M = new U(),
    N = new W(),
    P = new U(),
    F = new H(),
    I = new H();
  return {
    clear() {
      for (let e of i) e.morphTargetInfluences.fill(0);
    },
    update(n) {
      let o = Math.max(-1, Math.min(1, n?.steering ?? 0)),
        s = Math.abs(o),
        u = o >= 0 ? 1 : 2,
        d = c[0],
        f = c[u],
        m = e.userData.resident && o > 0 ? s * 0.5 : s;
      for (let e = 0; e < r.length; e++) {
        let t = T && S.has(r[e]) ? 0 : C.has(r[e]) ? s : m;
        (r[e].position.copy(d.joints[e].position).lerp(f.joints[e].position, t),
          r[e].quaternion
            .copy(d.joints[e].rotation)
            .slerp(f.joints[e].rotation, t));
      }
      for (let e of i) {
        let t = e.morphTargetDictionary,
          n = e.morphTargetInfluences;
        ((n[t.HelmNeutral] = 1 - m),
          (n[t.HelmLeft] = u === 1 ? m : 0),
          (n[t.HelmRight] = u === 2 ? m : 0));
      }
      (t.updateWorldMatrix(!0, !0), t.getWorldQuaternion(I));
      for (let e = 0; e < x.length; e++)
        (T && e === 0) ||
          (P.copy(d.support[e].position).applyMatrix4(t.matrixWorld),
          F.copy(I).multiply(d.support[e].rotation),
          b(...x[e], P, F));
      (T &&
        (M.set(0, 1, 0).applyQuaternion(I),
        P.copy(d.lap).applyMatrix4(E.matrixWorld),
        O.set((o > 0 ? 0.25 : 0.15) * s, -1, 0).applyQuaternion(I),
        b(...x[0], P, null, O),
        a(`calf_l`).getWorldPosition(k),
        E.getWorldPosition(l),
        k.sub(l).normalize().addScaledVector(M, -0.18).normalize(),
        A.crossVectors(M, k).negate().normalize(),
        j.crossVectors(A, k),
        F.setFromRotationMatrix(N.makeBasis(A, k, j)).multiply(d.handFrame),
        D.parent.getWorldQuaternion(p),
        D.quaternion.copy(p.invert().multiply(F)),
        D.updateWorldMatrix(!1, !0)),
        n &&
          (P.copy(d.gripOffset)
            .lerp(f.gripOffset, s)
            .applyQuaternion(n.quaternion)
            .add(n.position),
          F.copy(d.gripRotation)
            .slerp(f.gripRotation, s)
            .premultiply(n.quaternion),
          b(...w, P, F)));
    },
  };
}
var dx = 0.045,
  fx = {
    Hips: `pelvis`,
    Spine: `spine_01`,
    Spine1: `spine_02`,
    Spine2: `spine_03`,
    Neck: `neck_01`,
    Head: `head`,
  };
