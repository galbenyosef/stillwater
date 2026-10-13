// assets__index-BogB70q- 62 — clone
// Lines 61559-61829 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function AS(e, t, n) {
  let r = new H()
    .setFromUnitVectors(t.normalize(), n.normalize())
    .multiply(e.getWorldQuaternion(new H()));
  (e.quaternion.copy(e.parent.getWorldQuaternion(new H()).invert().multiply(r)),
    e.updateWorldMatrix(!1, !0));
}
function jS(e, t, n, r, i, a, o = 0) {
  let s = e.getWorldPosition(new U()),
    c = t.getWorldPosition(new U()),
    l = n.getWorldPosition(new U()),
    u = s.distanceTo(c),
    d = c.distanceTo(l),
    f = r.clone().sub(s),
    p = Math.min(u + d - 1e-5, Math.max(Math.abs(u - d) + 1e-5, f.length()));
  f.normalize();
  let m = c.clone().sub(s);
  (a && m.lerp(a, o),
    m.addScaledVector(f, -m.dot(f)),
    m.lengthSq() < 1e-8 && m.set(0, 0, 1).addScaledVector(f, -f.z),
    m.normalize());
  let h = (u * u - d * d + p * p) / (2 * p),
    g = s
      .clone()
      .addScaledVector(f, h)
      .addScaledVector(m, Math.sqrt(Math.max(0, u * u - h * h)));
  AS(e, c.clone().sub(s), g.clone().sub(s));
  let _ = t.getWorldPosition(new U());
  (AS(t, n.getWorldPosition(new U()).sub(_), r.clone().sub(_)),
    n.quaternion.copy(
      n.parent.getWorldQuaternion(new H()).invert().multiply(i),
    ),
    n.updateWorldMatrix(!1, !0));
}
function MS(e, t, { reducedMotion: n = !1 } = {}) {
  let r = e.getObjectByName(`ResidentKeeper`);
  if (!r) return null;
  let i = (e) => r.getObjectByName(e),
    a = e.getObjectByName(`FishingRodRig`),
    o = e.getObjectByName(`Rod_06`),
    s = e.getObjectByName(`FishingFloatPivot`);
  e.updateWorldMatrix(!0, !0);
  let c = new W().compose(
      new U(0.01513131, 0.0545, 0.05206528),
      new H(-0.18753244, -0.81743495, 0.12178499, 0.53084847).normalize(),
      new U(1, 1, 1),
    ),
    l = new W().compose(
      new U(-0.108, 0.32, -0.036),
      new H().setFromAxisAngle(new U(0, 0, 1), -Math.PI / 2),
      new U(1, 1, 1),
    );
  function u(e, t, n) {
    let r = new H()
      .setFromUnitVectors(t.normalize(), n.normalize())
      .multiply(e.getWorldQuaternion(new H()));
    (e.quaternion.copy(
      e.parent.getWorldQuaternion(new H()).invert().multiply(r),
    ),
      e.updateWorldMatrix(!1, !0));
  }
  function d(e, t, n) {
    let r = i(`hand_${e}`);
    kS(r, new W().multiplyMatrices(a.matrixWorld, t));
    let o = new U(0, 1, 0).applyQuaternion(a.getWorldQuaternion(new H())),
      s = a.getWorldPosition(new U()),
      c = new U(0, 1, 0).applyQuaternion(r.getWorldQuaternion(new H()));
    for (let t of [`index`, `middle`, `ring`, `pinky`]) {
      let n = i(`${t}_01_${e}`).getWorldPosition(new U()),
        r = n.clone().sub(s).addScaledVector(o, -n.clone().sub(s).dot(o)),
        a = new U().crossVectors(o, r).dot(c) > 0 ? 1 : -1;
      for (let n = 1; n <= 3; n++) {
        let r = i(`${t}_0${n}_${e}`),
          c = r.getWorldPosition(new U()),
          l =
            n < 3
              ? i(`${t}_0${n + 1}_${e}`).getWorldPosition(new U())
              : r.localToWorld(new U(0, 0.018, 0)),
          d = s.clone().addScaledVector(o, c.clone().sub(s).dot(o)),
          f = c.clone().sub(d),
          p = n === 1 ? 0.027 : n === 2 ? 0.024 : 0.022,
          m =
            (f.lengthSq() + p * p - c.distanceToSquared(l)) /
            (2 * f.length() * p),
          h = f
            .normalize()
            .applyAxisAngle(o, a * Math.acos(Math.max(-1, Math.min(1, m))))
            .multiplyScalar(p)
            .add(d);
        u(r, l.sub(c), h.sub(c));
      }
    }
    let l = new U(0, 0, 1).applyQuaternion(r.getWorldQuaternion(new H())),
      d = a.localToWorld(new U(0, n + 0.045, 0)).addScaledVector(l, -0.019),
      f = i(`thumb_03_${e}`);
    for (let t = 0; t < 12; t++)
      for (let t = 3; t >= 1; t--) {
        let n = i(`thumb_0${t}_${e}`),
          r = n.getWorldPosition(new U()),
          a = f.localToWorld(new U(0, 0.02, 0)),
          o = new H().setFromUnitVectors(
            a.sub(r).normalize(),
            d.clone().sub(r).normalize(),
          ),
          s = o.angleTo(new H());
        s > 0.3 && o.slerp(new H(), 1 - 0.3 / s);
        let c = o.multiply(n.getWorldQuaternion(new H()));
        (n.quaternion.copy(
          n.parent.getWorldQuaternion(new H()).invert().multiply(c),
        ),
          n.updateWorldMatrix(!1, !0));
      }
    let p = [];
    for (let t of [`thumb`, `index`, `middle`, `ring`, `pinky`])
      for (let n = 1; n <= 3; n++) {
        let r = i(`${t}_0${n}_${e}`);
        p.push({ node: r, rotation: r.quaternion.clone() });
      }
    return p;
  }
  let f = d(`r`, c, 0.14),
    p = d(`l`, l, 0.32);
  t(1);
  let m = s
    .getWorldPosition(new U())
    .sub(o.getWorldPosition(new U()))
    .applyQuaternion(e.getWorldQuaternion(new H()).invert());
  t(174);
  let h = [`upperarm_l`, `lowerarm_l`].map((e) => ({
    node: i(e),
    rotation: i(e).quaternion.clone(),
  }));
  t(1);
  function g(t, n, r) {
    let i = n.clone().applyQuaternion(e.getWorldQuaternion(new H())),
      a = new H()
        .setFromAxisAngle(i, r)
        .multiply(t.getWorldQuaternion(new H()));
    (t.quaternion.copy(
      t.parent.getWorldQuaternion(new H()).invert().multiply(a),
    ),
      t.updateWorldMatrix(!1, !0));
  }
  let _ = (e) => (e * Math.PI) / 180;
  return (t, u = 0, d = 0) => {
    let v = TS(18, 42, t) * (1 - TS(48, 76, t)) * (1 - u),
      y = TS(34, 48, t) * (1 - TS(54, 76, t)) * (1 - u),
      b = TS(167, 177, t) * (1 - TS(214, 231, t)) * (1 - u),
      x = n ? 0 : Math.sin(d * 1.5) * 0.5,
      S = o.getWorldPosition(new U()),
      C = i(`hand_r`).getWorldPosition(new U()),
      w = e.getWorldQuaternion(new H()),
      T = new W().multiplyMatrices(
        a.matrixWorld.clone().invert(),
        i(`hand_l`).matrixWorld,
      ),
      E = i(`hand_l`),
      D = E.worldToLocal(
        i(`index_03_l`)
          .getWorldPosition(new U())
          .add(i(`thumb_03_l`).getWorldPosition(new U()))
          .multiplyScalar(0.5),
      ),
      O = E.worldToLocal(
        i(`middle_01_l`).getWorldPosition(new U()),
      ).normalize(),
      k = new U(0, 1, 0)
        .applyQuaternion(a.getWorldQuaternion(new H()))
        .applyQuaternion(w.clone().invert()),
      A = new U(-k.z, 0, k.x).normalize().applyQuaternion(w),
      j = new H().setFromAxisAngle(A, _(11)),
      M = a.getWorldPosition(new U()).sub(C).applyQuaternion(j).add(C);
    (M.add(
      new U(-0.18, 0.095 + v * 0.012, 0.12).applyQuaternion(
        e.getWorldQuaternion(new H()),
      ),
    ),
      kS(
        a,
        new W().compose(
          M,
          j.multiply(a.getWorldQuaternion(new H())),
          new U(1, 1, 1),
        ),
      ),
      g(i(`spine_01`), new U(1, 0, 0), _(-4 - v * 3 - x)),
      g(i(`spine_02`), new U(0, 1, 0), _(14 - v * 4)),
      g(i(`spine_03`), new U(0, 1, 0), _(8 - v * 2)),
      g(i(`neck_01`), new U(0, 1, 0), _(24 - v * 10)),
      g(i(`head`), new U(1, 0, 0), _(5 - v * 3)));
    let N = new U(),
      P = new H(),
      F = new U(),
      I = new W().multiplyMatrices(a.matrixWorld, c);
    (I.decompose(N, P, F),
      bx(
        i(`upperarm_r`),
        i(`lowerarm_r`),
        i(`hand_r`),
        N,
        P,
        new U(0.6, -1, 0.15).applyQuaternion(w),
      ));
    for (let { node: e, rotation: t } of f) e.quaternion.copy(t);
    let ee = l.clone();
    (ee.decompose(N, P, F), (N.y -= y * 0.012));
    let te = new U(),
      ne = new H();
    T.decompose(te, ne, F);
    let re = new U(-0.55, -1, 0.12).applyQuaternion(w);
    if (b) {
      let e = a.localToWorld(te.clone()),
        t = a.getWorldQuaternion(new H()).multiply(ne),
        n = D.clone().multiply(F).applyQuaternion(t).add(e);
      for (let { node: e, rotation: t } of h) e.quaternion.copy(t);
      r.updateWorldMatrix(!1, !0);
      for (let r = 0; r < 3; r++) {
        bx(i(`upperarm_l`), i(`lowerarm_l`), E, e, t, re);
        let r = E.getWorldPosition(new U())
          .sub(i(`lowerarm_l`).getWorldPosition(new U()))
          .normalize();
        (t.premultiply(
          new H().setFromUnitVectors(O.clone().applyQuaternion(t), r),
        ),
          e.copy(n).sub(D.clone().multiply(F).applyQuaternion(t)));
      }
      (a.worldToLocal(e),
        te.copy(e),
        ne.copy(a.getWorldQuaternion(new H()).invert().multiply(t)));
    }
    (N.lerp(te, b),
      P.slerp(ne, b),
      ee.compose(N, P, F),
      I.multiplyMatrices(a.matrixWorld, ee),
      I.decompose(N, P, F));
    for (let { node: e, rotation: t } of h) e.quaternion.copy(t);
    (r.updateWorldMatrix(!1, !0),
      bx(i(`upperarm_l`), i(`lowerarm_l`), i(`hand_l`), N, P, re));
    for (let { node: e, rotation: t } of p) e.quaternion.slerp(t, 1 - b);
    r.updateWorldMatrix(!1, !0);
    let ie = (1 - TS(45, 65, t) + TS(218, 240, t)) * (1 - u) + u,
      ae = o.getWorldPosition(new U()).sub(S).multiplyScalar(ie);
    s.getWorldPosition(N).add(ae);
    let oe = TS(177, 240, t) * (1 - u);
    (oe &&
      N.lerp(o.getWorldPosition(new U()).add(m.clone().applyQuaternion(w)), oe),
      s.position.copy(s.parent.worldToLocal(N)),
      s.updateWorldMatrix(!1, !0));
  };
}
async function NS() {
  let e = new qp().setMeshoptDecoder(qm),
    t = async (t) => {
      let [n, r] = await Promise.all([
        t === `resident`
          ? hx()
          : e.loadAsync(`/compact/models/fishing-${t}.glb`),
        fetch(uf(`/compact/models/fishing-${t}-line.json`)),
      ]);
      if (!r.ok) throw Error(`Could not load the ${t} fishing line.`);
      return { gltf: n, line: await r.json() };
    },
    [n, r, i, a, o] = await Promise.all([
      t(`resident`),
      t(`boat`),
      e.loadAsync(`/compact/models/fishing-chair.glb`),
      hx(),
      gx(),
    ]);
  return (vx(r.gltf, a, o), (n.scenery = i.scene), { chair: n, boat: r });
}
