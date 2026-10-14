// assets__index-BogB70q- 64 — clone
// Lines 62088-62435 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function FS(e, t) {
  (e.sample(1), e.root.updateWorldMatrix(!0, !0));
  let n = e.root,
    r = n.getObjectByName(`FishingKeeper`),
    i = t.root.getObjectByName(`ResidentKeeper`),
    a = n.getObjectByName(`FishingRodRig`),
    o = e.floating,
    s = [];
  r.traverse((e) => {
    if (e.isBone) {
      let n = fx[e.name.replace(/^mixamorig:?/, ``)],
        r = t.root.getObjectByName(n);
      r && s.push({ node: e, live: r, initial: ES(e) });
    }
  });
  let c = (e) =>
      s.find(({ node: t }) => t.name.replace(/^mixamorig:?/, ``) === e).node,
    l = { Left: c(`LeftHand`), Right: c(`RightHand`) },
    u = ES(r),
    d = ES(a),
    f = ES(o),
    p = a.matrixWorld.clone().invert(),
    m = Object.fromEntries(
      Object.entries(l).map(([e, t]) => [e, p.clone().multiply(t.matrixWorld)]),
    ),
    h = p.clone().multiply(o.matrixWorld),
    g = e.line.samples[0].map((e) =>
      n.localToWorld(new U(...e)).applyMatrix4(p),
    ),
    _ = new W().compose(
      new U(-4.32, 0.49, 0.735),
      new H().setFromUnitVectors(
        new U(0, 1, 0),
        new U(0.08, 1, -0.045).normalize(),
      ),
      new U(1, 1, 1),
    ),
    v = 1.2,
    y = new W().makeTranslation(0, v, 0).multiply(m.Right),
    b = _.clone().multiply(y),
    x = { position: new U(), quaternion: new H(), scale: new U() };
  b.decompose(x.position, x.quaternion, x.scale);
  let S = (t) => {
    (kS(a, t), kS(o, t.clone().multiply(h)));
    let r = n.matrixWorld.clone().invert(),
      i = new U(),
      s = e.geometry.attributes.position;
    for (let e = 0; e < g.length; e++)
      (i.copy(g[e]).applyMatrix4(t).applyMatrix4(r),
        s.setXYZ(e, i.x, i.y, i.z));
    ((s.needsUpdate = !0), (e.lineMesh.visible = !0));
    for (let t of e.meshes)
      t.userData.fishingPart === `equipment` && (t.visible = !0);
  };
  return {
    restore() {
      (DS(r, u), DS(a, d), DS(o, f));
      for (let e of s) DS(e.node, e.initial);
    },
    update(a) {
      let o = a.setting === `chair` && a.seated;
      if (o && ![`pickup`, `putdown`].includes(a.phase)) return;
      if (!o) {
        (e.sample(1), S(_));
        return;
      }
      let u = a.phase === `pickup` ? a.progress : 1 - a.progress;
      (n.updateWorldMatrix(!0, !0), t.root.updateWorldMatrix(!0, !0));
      let d = OS(r),
        f = OS(i),
        p = TS(0, 1, u),
        h = Object.fromEntries(Object.entries(l).map(([e, t]) => [e, OS(t)]));
      for (let { node: e, live: t } of s) {
        let n = e.quaternion.clone(),
          r = /Hand(?:Thumb|Index|Middle|Ring|Pinky)/.test(e.name)
            ? e.name.includes(`Right`)
              ? TS(0, 0.3, u)
              : TS(0.72, 0.94, u)
            : p;
        (e.position.lerpVectors(t.position, e.position, p),
          e.quaternion.copy(t.quaternion).slerp(n, r));
      }
      kS(
        r,
        new W().compose(
          f.position.lerp(d.position, p),
          f.quaternion.slerp(d.quaternion, p),
          f.scale,
        ),
      );
      let g = TS(0.3, 1, u),
        y = x.position.clone().lerp(h.Right.position, g),
        b = x.quaternion.clone().slerp(h.Right.quaternion, g),
        C = v * (1 - TS(0.3, 0.62, u)),
        w = new W().makeTranslation(0, C, 0).multiply(m.Right),
        T =
          u <= 0.3
            ? _
            : new W()
                .compose(y, b, new U(1, 1, 1))
                .multiply(w.clone().invert());
      if (u > 0.3 && u < 1) {
        let e = c(`Spine2`).getWorldPosition(new U()),
          t = c(`Hips`).getWorldPosition(new U()),
          n = new U().setFromMatrixPosition(T),
          r = new U(0, 1, 0).transformDirection(T),
          i = Math.max(0, (t.y - 0.15 - n.y) / r.y),
          a = Math.min(1, (e.y + 0.08 - n.y) / r.y);
        if (i <= a) {
          let t = r.x * r.x + r.z * r.z,
            o = t > 1e-8 ? ((e.x - n.x) * r.x + (e.z - n.z) * r.z) / t : i,
            s = n.clone().addScaledVector(r, Math.max(i, Math.min(a, o))),
            c = new U(s.x - e.x, 0, s.z - e.z),
            l = c.length();
          l > 0.001 &&
            l < 0.19 &&
            (c.multiplyScalar(((0.19 - l) / l) * Math.sin(Math.PI * g)),
            y.add(c),
            (T.elements[12] += c.x),
            (T.elements[14] += c.z));
        }
      }
      let E = TS(0, 0.3, u),
        D = l.Right;
      (y.lerpVectors(D.getWorldPosition(new U()), y, E),
        b.copy(D.getWorldQuaternion(new H()).slerp(b, E)));
      let O = TS(0, 0.15, u) * (1 - TS(0.85, 1, u)),
        k = i.getWorldQuaternion(new H());
      jS(c(`RightArm`), c(`RightForeArm`), D, y, b, new U(0, -1, 0), O);
      let A = TS(0.72, 0.94, u),
        j = OS(l.Left),
        M = T.clone().multiply(m.Left),
        N = new U(),
        P = new H();
      (M.decompose(N, P, new U()),
        jS(
          c(`LeftArm`),
          c(`LeftForeArm`),
          l.Left,
          j.position.lerp(N, A),
          j.quaternion.slerp(P, A),
          new U(0.35, -0.45, 0.15).applyQuaternion(k),
          O,
        ),
        S(T));
    },
  };
}
function IS(e, t) {
  (e.sample(e.ready), e.root.updateWorldMatrix(!0, !0));
  let n = e.root,
    r = n.getObjectByName(`ResidentKeeper`),
    i = t.root.getObjectByName(`ResidentKeeper`),
    a = n.getObjectByName(`FishingRodRig`),
    o = e.floating,
    s = [];
  r.traverse((e) => {
    e.isBone &&
      s.push({ node: e, live: i.getObjectByName(e.name), initial: ES(e) });
  });
  let c = (e) => r.getObjectByName(e),
    l = c(`hand_r`),
    u = ES(r),
    d = ES(a),
    f = ES(o),
    p = l.worldToLocal(c(`middle_01_r`).getWorldPosition(new U())).normalize(),
    m = a.matrixWorld.clone().invert(),
    h = m.clone().multiply(l.matrixWorld),
    g = c(`hand_l`),
    _ = m.clone().multiply(g.matrixWorld),
    v = m.clone().multiply(o.matrixWorld),
    y = e.guides
      ? e.guides[9].bone.localToWorld(e.guides[9].point.clone())
      : null,
    b = Array.from({ length: e.line.points }, (t, r) => {
      if (e.refined)
        return (
          r < 10
            ? e.guides[r].bone.localToWorld(e.guides[r].point.clone())
            : y
                .clone()
                .lerp(
                  o.getWorldPosition(new U()),
                  (r - 10) / (e.line.points - 11),
                )
        ).applyMatrix4(m);
      let i = new U(...e.line.samples[e.ready - 1][r]);
      return (
        (i.y +=
          e.rodLift *
          Math.min(1, (e.line.points - 1 - r) / (e.line.points - 10))),
        n.localToWorld(i).applyMatrix4(m)
      );
    }),
    x = new W().compose(
      new U(0.5, 0.76, 0.87),
      new H().setFromUnitVectors(
        new U(0, 1, 0),
        new U(-0.12, -0.015, -1).normalize(),
      ),
      new U(1, 1, 1),
    ),
    S = [];
  r.traverse((e) => {
    if (e.morphTargetInfluences) {
      let t = i.getObjectByName(e.name);
      t && S.push({ node: e, live: t });
    }
  });
  function C(t, r = 1) {
    let i = v.clone(),
      s = b[9];
    (i.setPosition(
      new U().setFromMatrixPosition(v).sub(s).multiplyScalar(r).add(s),
    ),
      (n.visible = !0),
      kS(a, t),
      kS(o, t.clone().multiply(i)));
    let c = n.matrixWorld.clone().invert(),
      l = new U(),
      u = e.geometry.attributes.position;
    for (let e = 0; e < b.length; e++)
      (l.copy(b[e]),
        e > 9 && l.lerp(s, 1 - r),
        l.applyMatrix4(t).applyMatrix4(c),
        u.setXYZ(e, l.x, l.y, l.z));
    ((u.needsUpdate = !0), (e.lineMesh.visible = !0));
    for (let t of e.meshes)
      t.userData.fishingPart === `equipment` && (t.visible = !0);
  }
  return {
    restore() {
      (DS(r, u), DS(a, d), DS(o, f));
      for (let e of s) DS(e.node, e.initial);
      for (let { node: e } of S) e.morphTargetInfluences.fill(0);
    },
    update(i) {
      let a = i.setting === `boat` && i.seated;
      if (a && ![`pickup`, `putdown`].includes(i.phase)) return;
      n.updateWorldMatrix(!0, !0);
      let o = n.matrixWorld.clone().multiply(x);
      if (!a) {
        (e.sample(e.ready), C(o, 0.12));
        return;
      }
      let u = i.phase === `pickup` ? i.progress : 1 - i.progress,
        d = TS(0, 0.52, u);
      t.root.updateWorldMatrix(!0, !0);
      let f = OS(l);
      for (let { node: e, live: t } of s) {
        let n = e.quaternion.clone(),
          r =
            /^(thumb|index|middle|ring|pinky)_/.test(e.name) &&
            e.name.endsWith(`_r`)
              ? TS(0.12, 0.32, u)
              : d,
          i = ES(t);
        (e.parent.isBone ||
          new W()
            .copy(e.parent.matrixWorld)
            .invert()
            .multiply(t.matrixWorld)
            .decompose(i.position, i.quaternion, i.scale),
          e.position.lerpVectors(i.position, e.position, d),
          e.quaternion.copy(i.quaternion).slerp(n, r));
      }
      for (let { node: e, live: t } of S)
        e.morphTargetInfluences.forEach((n, r) => {
          e.morphTargetInfluences[r] =
            (t.morphTargetInfluences[r] ?? 0) * (1 - d);
        });
      if ((r.updateWorldMatrix(!1, !0), e.refined)) {
        let e = TS(0.12, 0.32, u) * (1 - TS(0.45, 0.85, u)),
          t = c(`spine_01`),
          i = new U(0, 0, -1).applyQuaternion(n.getWorldQuaternion(new H())),
          a = new H()
            .setFromAxisAngle(i, 0.35 * e)
            .multiply(t.getWorldQuaternion(new H()));
        (t.quaternion.copy(
          t.parent.getWorldQuaternion(new H()).invert().multiply(a),
        ),
          r.updateWorldMatrix(!1, !0));
      }
      let m = o.clone().multiply(h),
        v = new U(),
        y = new H();
      m.decompose(v, y, new U());
      let b = TS(0.32, 1, u);
      (v.lerp(f.position, b), y.slerp(f.quaternion, b));
      let w =
          u <= 0.32
            ? o
            : new W()
                .compose(v, y, new U(1, 1, 1))
                .multiply(h.clone().invert()),
        T = TS(0.04, 0.32, u),
        E = OS(l),
        D = e.refined
          ? v
              .clone()
              .sub(c(`upperarm_r`).getWorldPosition(new U()))
              .addScaledVector(p.clone().applyQuaternion(y), -0.26)
          : new U(0.4, -1, 0.15).applyQuaternion(n.getWorldQuaternion(new H()));
      if (
        (jS(
          c(`upperarm_r`),
          c(`lowerarm_r`),
          l,
          E.position.lerp(v, T),
          E.quaternion.slerp(y, T),
          D,
          TS(0, 0.2, u) * (1 - TS(0.85, 1, u)),
        ),
        e.refined)
      ) {
        let e = w.clone().multiply(_),
          t = TS(0.48, 0.9, u),
          r = OS(g);
        (e.decompose(v, y, new U()),
          jS(
            c(`upperarm_l`),
            c(`lowerarm_l`),
            g,
            r.position.lerp(v, t),
            r.quaternion.slerp(y, t),
            new U(-0.55, -1, 0.12).applyQuaternion(
              n.getWorldQuaternion(new H()),
            ),
            t,
          ));
      }
      C(w, 0.12 + 0.88 * b);
    },
  };
}
var LS = (e, t, n) => (
    (n = Math.max(0, Math.min(1, (n - e) / (t - e)))),
    n * n * (3 - 2 * n)
  ),
  RS = (e) => ({
    position: e.position.clone(),
    quaternion: e.quaternion.clone(),
  }),
  zS = (e) => ({
    position: e.getWorldPosition(new U()),
    quaternion: e.getWorldQuaternion(new H()),
  }),
  BS = new U(0, 1, 0);
