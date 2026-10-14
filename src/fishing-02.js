// fishing-02.js — fishing: rod, line, bobber and the cast/reel states
// Lines 62088-62628 of readable/assets__index-BogB70q-.pretty.js (cluster fishing, statement-aligned).
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
function VS(e, t) {
  let n = 0;
  for (; n < e.length - 2 && t > e[n + 1][0];) n++;
  let [r, i] = e[n],
    [a, o] = e[n + 1],
    s = (t - r) / (a - r),
    c = e[Math.max(0, n - 1)],
    l = e[Math.min(e.length - 1, n + 2)],
    u =
      n === 0
        ? new U()
        : o
            .clone()
            .sub(c[1])
            .multiplyScalar((a - r) / (a - c[0])),
    d =
      n === e.length - 2
        ? new U()
        : l[1]
            .clone()
            .sub(i)
            .multiplyScalar((a - r) / (l[0] - r));
  return i
    .clone()
    .multiplyScalar(2 * s ** 3 - 3 * s * s + 1)
    .addScaledVector(u, s ** 3 - 2 * s * s + s)
    .addScaledVector(o, -2 * s ** 3 + 3 * s * s)
    .addScaledVector(d, s ** 3 - s * s);
}
function HS(e, t, { leaving: n = !1 } = {}) {
  let r = e.root,
    i = [];
  r.traverse((e) => {
    e.isBone && i.push(e);
  });
  let a = (e) => r.getObjectByName(e),
    o = { l: a(`foot_l`), r: a(`foot_r`) },
    s = null;
  return {
    reset() {
      s = null;
    },
    update(c, l, u, d) {
      ((!s || (n && c < 0.04)) &&
        (e.update(l, u, { grounded: !0 }),
        r.updateWorldMatrix(!0, !0),
        (s = {
          root: RS(r),
          joints: i.map(RS),
          feet: { l: zS(o.l), r: zS(o.r) },
        })),
        e.update(l, d),
        r.updateWorldMatrix(!0, !0),
        t.updateWorldMatrix(!0, !1));
      let f = RS(r),
        p = { l: zS(o.l), r: zS(o.r) },
        m = (e, n, r) => new U(-e, n, -r).applyMatrix4(t.matrixWorld),
        h = LS(0.66, 1, c);
      i.forEach((e, t) => {
        (e.position.lerpVectors(s.joints[t].position, e.position, h),
          e.quaternion.copy(
            s.joints[t].quaternion.clone().slerp(e.quaternion, h),
          ));
      });
      let g = [
        [0, s.root.position],
        [0.14, m(-1.1, 0.55, -0.67)],
        [0.36, m(-0.76, 0.15, -0.62)],
        [0.46, m(-0.6, 0.19, -0.58)],
        [0.68, m(-0.03, 0.1, -0.48)],
        [0.84, m(0.1, 0, -0.55)],
        [1, f.position],
      ];
      (r.position.copy(VS(g, c)),
        r.quaternion
          .copy(s.root.quaternion)
          .slerp(f.quaternion, LS(0.45, 0.84, c)));
      let _ = 0.26 * LS(0, 0.16, c) * (1 - LS(0.76, 1, c));
      a(`spine_01`).quaternion.multiply(
        new H().setFromAxisAngle(new U(1, 0, 0), _),
      );
      let v = LS(0, 0.12, c) * (1 - LS(0.62, 0.94, c));
      (a(`neck_01`).quaternion.multiply(
        new H().setFromAxisAngle(new U(1, 0, 0), 0.1 * v),
      ),
        a(`head`).quaternion.multiply(
          new H().setFromAxisAngle(new U(1, 0, 0), 0.24 * v),
        ),
        r.updateWorldMatrix(!0, !0));
      let y = m(-0.34, 0.377, -0.38),
        b = f.quaternion
          .clone()
          .multiply(new H().setFromAxisAngle(BS, ((n ? -1 : 1) * Math.PI) / 2))
          .multiply(s.root.quaternion.clone().invert())
          .multiply(s.feet.r.quaternion),
        x = {},
        S = [];
      for (let e of [`r`, `l`]) {
        let t = s.feet[e],
          i = p[e],
          l,
          u;
        if (e === `r`) {
          let e = LS(0.07, 0.36, c);
          if (
            ((l = t.position.clone().lerp(y, e)),
            (l.y += 0.42 * Math.sin(Math.PI * e)),
            (u = t.quaternion.clone().slerp(b, e)),
            c > 0.7)
          ) {
            let e = LS(0.7, 0.84, c);
            (l.lerp(i.position, e),
              (l.y += 0.11 * Math.sin(Math.PI * e)),
              u.slerp(i.quaternion, e));
          }
        } else {
          let e = LS(0.43, n ? 0.76 : 0.69, c);
          ((l = t.position.clone().lerp(i.position, e)),
            (l.y += 0.34 * Math.sin(Math.PI * e)),
            (u = t.quaternion.clone().slerp(i.quaternion, e)),
            l.addScaledVector(
              new U(0, 0, -1).applyQuaternion(f.quaternion),
              (n ? -0.12 : 0.42) * Math.sin(Math.PI * e),
            ));
        }
        x[e] = l.clone();
        let d = a(`thigh_${e}`),
          m = a(`calf_${e}`),
          h = m.getWorldPosition(new U()).sub(d.getWorldPosition(new U())),
          g = new U(e === `l` ? 0.08 : -0.08, 0, 1).applyQuaternion(
            r.quaternion,
          ),
          _ = LS(0, 0.07, c) * (1 - LS(0.84, 1, c));
        (h.lerp(g, _),
          S.push({ upper: d, lower: m, foot: o[e], p: l, q: u, pole: h }));
      }
      let C = 0;
      for (let { upper: e, lower: t, foot: n, p: r } of S) {
        let i = e.getWorldPosition(new U()),
          a = t.getWorldPosition(new U()),
          o = n.getWorldPosition(new U()),
          s = i.distanceTo(a) + a.distanceTo(o) - 0.002,
          c = Math.hypot(r.x - i.x, r.z - i.z);
        C = Math.max(C, i.y - r.y - Math.sqrt(Math.max(0, s * s - c * c)));
      }
      ((a(`pelvis`).position.y -=
        Math.min(0.15, C) * LS(0, 0.07, c) * (1 - LS(0.84, 1, c))),
        r.updateWorldMatrix(!0, !0));
      for (let { upper: e, lower: t, foot: n, p: r, q: i, pole: a } of S)
        bx(e, t, n, r, i, a);
      let w = LS(0.03, 0.16, c) * (1 - LS(0.68, 0.94, c)),
        T = LS(0.4, 0.68, c);
      if (w > 0)
        for (let [e, t] of [
          [`l`, 1],
          [`r`, -1],
        ]) {
          let n = a(`upperarm_${e}`),
            i = a(`lowerarm_${e}`),
            o = a(`hand_${e}`),
            s = zS(o),
            c = o.quaternion.clone(),
            l =
              e === `l`
                ? new U(0.34, 1.1, 0.28).lerp(new U(0.4, 1, 0.08), T)
                : new U(-0.38, 1.16, 0.16).lerp(new U(-0.32, 1.1, 0.26), T);
          r.localToWorld(l);
          let u = new U(t * 0.3, -0.4, -0.1).applyQuaternion(r.quaternion);
          (bx(n, i, o, s.position.lerp(l, w), s.quaternion, u),
            o.quaternion.slerp(c, w));
          for (let t of [`index`, `middle`, `ring`, `pinky`])
            for (let [n, r] of [
              [1, 0.14],
              [2, 0.26],
            ])
              a(`${t}_0${n}_${e}`).quaternion.multiply(
                new H().setFromAxisAngle(new U(1, 0, 0), -r * w),
              );
        }
      return (r.updateWorldMatrix(!0, !0), x);
    },
  };
}
var US = new U();
function WS(e, t, n, r, i, a) {
  let o = (2 * Math.PI * i) / 4,
    s = Math.max(a - 2 * i, 0),
    c = Math.PI / 4;
  (US.copy(t), (US[r] = 0), US.normalize());
  let l = (0.5 * o) / (o + s),
    u = 1 - US.angleTo(e) / c;
  return Math.sign(US[n]) === 1 ? u * l : s / (o + s) + l + l * (1 - u);
}
