// assets__index-BogB70q- 23 — add
// Lines 49462-49793 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Cg(e, t) {
  let n = e,
    r = [];
  for (let e = 0; e < 3; e++)
    for (let [i, a] of [
      [t.min[e], !0],
      [t.max[e], !1],
    ]) {
      if (!n.length) break;
      let t = Sg(n, e, i, a);
      (t.length >= 3 && r.push(t), (n = Sg(n, e, i, !a)));
    }
  return r;
}
function wg(e, t) {
  let n = [e];
  for (let e of t) n = n.flatMap((t) => Cg(t, e));
  return n;
}
var Tg = {
    crest: 4.42,
    points: [
      [-0.2, 4.42, -7.48],
      [-0.2, 4.41, -7.25],
      [1.8, 4.2, -7.25],
      [1.98, 4.1, -7.25],
      [2.12, 3.05, -7.25],
      [2.18, 1.6, -7.25],
      [2.22, 0.205, -7.25],
    ],
  },
  Eg = [
    [-1.85, 1.43, 0.17],
    [-1.85, 2.65, 0.17],
    [0.65, 2.65, -1.45],
    [0.65, 4.78, -4.38],
    [0.65, 5.38, -8.2],
    [0.13, 5.38, -8.2],
  ],
  Dg = { min: [-0.37, Tg.crest, -7.51], max: [-0.03, 4.66, -7.06] };
function Og(e) {
  let t = new Pn();
  ((t.name = `Spring sluice sliding gate`), (t.userData.aboveWater = !0));
  let { x: n, z: r } = qf.gate;
  (e.spring.traverse((e) => {
    if (!e.isMesh) return;
    let i = e.material.name,
      a = i === `Oak • weathered | spring`,
      o = i === `Forged iron | spring`,
      s = i === `Limestone | spring`;
    if (!a && !o && !s) return;
    let c = e.geometry,
      l = c.attributes,
      u = c.index,
      d = Object.fromEntries(Object.keys(l).map((e) => [e, []])),
      f = Object.fromEntries(Object.keys(l).map((e) => [e, []])),
      p = (e, t) => {
        for (let n = 1; n < t.length - 1; n++)
          for (let r of [t[0], t[n], t[n + 1]])
            for (let t of Object.keys(e))
              e[t].push(...r[t === `position` ? `p` : t]);
      };
    for (let e = 0; e < (u?.count ?? l.position.count); e += 3) {
      let t = [0, 1, 2].map((t) => {
          let n = u ? u.getX(e + t) : e + t,
            r = {};
          for (let [e, t] of Object.entries(l))
            r[e === `position` ? `p` : e] = Array.from(
              { length: t.itemSize },
              (e, r) => t.getComponent(n, r),
            );
          return r;
        }),
        i = (e, t, n, r, i, a, o) =>
          e[0] >= t - 1e-4 &&
          e[0] <= n + 1e-4 &&
          e[1] >= r - 1e-4 &&
          e[1] <= i + 1e-4 &&
          e[2] >= a - 1e-4 &&
          e[2] <= o + 1e-4,
        c =
          a &&
          t.every((e) =>
            i(e.p, n - 0.061, n + 0.061, 4.433, 5.187, r - 0.456, r + 0.456),
          ),
        m =
          o &&
          t.every((e) =>
            i(e.p, n + 0.05, n + 0.11, 4.439, 5.181, r - 0.35, r + 0.35),
          ),
        h =
          o &&
          t.every((e) =>
            i(e.p, n - 0.065, n + 0.065, 4.94, 5.59, r - 0.065, r + 0.065),
          ),
        g =
          o &&
          t.every((e) =>
            i(e.p, n - 0.25, n + 0.25, 5.49, 5.58, r - 0.25, r + 0.25),
          );
      if (c || m) p(f, t);
      else if (!h && !g) for (let e of s ? wg(t, [Dg]) : [t]) p(d, e);
    }
    let m = (e) => {
      let t = new Hr();
      for (let [n, r] of Object.entries(l))
        t.setAttribute(n, new Ar(e[n], r.itemSize));
      return (t.computeBoundingBox(), t.computeBoundingSphere(), t);
    };
    if (((e.geometry = m(d)), f.position.length)) {
      let n = new vi(m(f), e.material);
      ((n.name = a ? `Sluice oak plate` : `Sluice plate iron straps`),
        (n.castShadow = n.receiveShadow = !0),
        t.add(n));
    }
  }),
    (e.sluiceGate = t));
}
function kg(e, t, n) {
  if (!t.sluiceGate?.children.length) return null;
  let r = t.sluiceGate;
  e.add(r);
  let i = {};
  t.spring.traverse((e) => {
    e.isMesh &&
      (e.material.name === `Oak • weathered | spring` && (i.wood = e.material),
      e.material.name === `Forged iron | spring` && (i.iron = e.material));
  });
  for (let e of Object.keys(i)) {
    let t = i[e],
      n = t.clone();
    ((n.onBeforeCompile = t.onBeforeCompile),
      (n.customProgramCacheKey = t.customProgramCacheKey),
      (n.aoMap = null),
      (i[e] = n));
  }
  i.rope = new rs({ color: `#51483b`, roughness: 1 });
  let a = new Pn();
  ((a.name = `Porch sluice winch and overflow`),
    (a.userData.aboveWater = !0),
    e.add(a));
  let o = { wood: [], iron: [], rope: [] },
    s = new Pn();
  ((s.name = `Sluice hand crank`), s.position.set(cg.x, cg.y, cg.z), a.add(s));
  let c = (e) => {
    let t = new Float32Array(e.attributes.position.count * 3).fill(1);
    return (
      e.setAttribute(`color`, new Dr(t, 3)),
      e.setAttribute(`uv1`, e.attributes.uv.clone()),
      e.index ? e.toNonIndexed() : e
    );
  };
  function l(e, t, n = `iron`, r = null, a = !1) {
    e = c(e);
    let l = new Nn();
    if (
      (l.position.fromArray(t),
      r?.isQuaternion ? l.quaternion.copy(r) : r && l.rotation.set(...r),
      l.updateMatrix(),
      e.applyMatrix4(l.matrix),
      a)
    ) {
      let t = new vi(e, i[n]);
      ((t.castShadow = t.receiveShadow = !0), s.add(t));
    } else o[n].push(e);
  }
  function u(e, t, n = 0.006, r = `rope`) {
    let i = new U(...e),
      a = new U(...t),
      s = c(new Sa(n, n, i.distanceTo(a), 8)),
      l = new W().compose(
        i.clone().add(a).multiplyScalar(0.5),
        new H().setFromUnitVectors(new U(0, 1, 0), a.sub(i).normalize()),
        new U(1, 1, 1),
      );
    (s.applyMatrix4(l), o[r].push(s));
  }
  (l(new ba(0.19, 0.38, 0.025), [cg.x, 1.36, 0.105]),
    l(
      new Sa(0.095, 0.095, 0.105, 32),
      [0, 0, -0.018],
      `wood`,
      [Math.PI / 2, 0, 0],
      !0,
    ));
  for (let e of [-0.076, 0.044])
    l(
      new Sa(0.115, 0.115, 0.012, 32),
      [0, 0, e],
      `iron`,
      [Math.PI / 2, 0, 0],
      !0,
    );
  (l(new ba(0.038, 0.22, 0.026), [0, -0.08, 0.065], `iron`, null, !0),
    l(
      new Sa(0.023, 0.023, 0.07, 16),
      [0, -0.185, 0.085],
      `wood`,
      [Math.PI / 2, 0, 0],
      !0,
    ),
    l(new ba(0.035, 0.09, 0.035), [cg.x + 0.092, 1.32, 0.2]));
  for (let e of [1.22, 1.5])
    l(new Sa(0.015, 0.015, 0.03, 12), [cg.x, e, 0.13], `iron`, [
      Math.PI / 2,
      0,
      0,
    ]);
  for (let e = 0; e < Eg.length - 1; e++) u(Eg[e], Eg[e + 1]);
  for (let e = 1; e < Eg.length; e++) {
    let t = Eg[e],
      n = new U(...t).sub(new U(...Eg[e - 1])).normalize(),
      r = new U(...(Eg[e + 1] ?? [0.13, 5.19, -8.2]))
        .sub(new U(...t))
        .normalize(),
      i = n.cross(r).normalize(),
      a = new H().setFromUnitVectors(new U(0, 0, 1), i);
    (l(new Ko(0.055, 0.008, 8, 24), t, `iron`, a),
      l(new ba(0.065, 0.07, 0.07), [t[0] - 0.045, t[1], t[2]], `wood`));
  }
  (u([0.3, 2.65, -1.45], [0.65, 2.65, -1.45], 0.013, `iron`),
    u([0.65, 4.45, -4.38], [0.65, 4.78, -4.38], 0.013, `iron`),
    l(new ba(0.62, 0.065, 0.09), [0.39, 5.265, -8.2], `wood`),
    l(new ba(0.05, 0.26, 0.08), [0.13, 5.27, -8.2]));
  let d = Tg.points[1],
    f = Tg.points[2],
    p = f[0] - d[0],
    m = Math.atan2(f[1] - d[1], p);
  l(
    new ba(p + 0.15, 0.065, 0.34),
    [(d[0] + f[0]) / 2, (d[1] + f[1]) / 2 - 0.065, d[2]],
    `wood`,
    [0, 0, m],
  );
  for (let e of [-1, 1])
    l(
      new ba(p + 0.15, 0.13, 0.045),
      [(d[0] + f[0]) / 2, (d[1] + f[1]) / 2 + 0.004, d[2] + e * 0.185],
      `wood`,
      [0, 0, m],
    );
  l(new ba(0.34, 0.055, 0.3), [-0.2, 4.375, -7.36], `wood`);
  for (let e of [0.12, 1.36])
    l(new ba(0.1, 0.08, 0.46), [e, 4.29 - (e + 0.2) * 0.105, -7.25], `iron`);
  for (let [e, t] of Object.entries(o))
    if (t.length) {
      let n = new vi(Hp(t), i[e]);
      ((n.name = `Sluice ` + e + ` fittings`),
        (n.castShadow = n.receiveShadow = !0),
        a.add(n));
    }
  let h = new vi(new Sa(0.006, 0.006, 1, 8), i.rope);
  return (
    (h.name = `Gate lifting rope`),
    a.add(h),
    (h.castShadow = !0),
    {
      root: a,
      gate: r,
      winch: s,
      update() {
        let { gate: e } = n.state;
        ((r.position.y = -(1 - e) * ug),
          (s.rotation.z = (-(1 - e) * ug) / 0.095));
        let t = 5.19 - (1 - e) * ug,
          i = 5.38;
        (h.position.set(0.13, (i + t) / 2, -8.2), (h.scale.y = i - t));
      },
    }
  );
}
var X = {
  origin: [-3, 0.58, -4.2],
  ground: 0.39,
  upper: 2.585,
  ceiling: 4.64,
  stove: {
    x: 2.77,
    z: -2.03,
    width: 0.55,
    depth: 0.46,
    heading: -1.5707963267948966,
  },
  stairs: { x0: 1.5, x1: 2.9, front: 1.4, back: -1.52, steps: 13 },
  bridgeExit: {
    floor: 1.362,
    x0: -3.15,
    x1: -1.95,
    front: 0.62,
    back: -1.3,
    steps: 6,
    openingX: -1.85,
    openingFront: 0.68,
    hinge: [-3.45, 1.362, -1.2],
  },
  bookcase: { x: -0.9, z: 2.22, width: 1.3, depth: 0.43 },
  seat: { x: 2.45, z: 2.02, height: 0.45, approachX: 1.68, approachZ: 2.08 },
  table: { x: 0, z: 1.45, width: 0.94, depth: 0.74 },
  daybed: { x: -0.52, z: -1.86, width: 2.34, depth: 0.76 },
};
function Ag(e) {
  e.traverse((e) => {
    if (!e.isMesh || e.material.name !== `Mill interior | Oak • weathered`)
      return;
    let t = e.geometry;
    if (t.userData.millCeilingFinish) return;
    let n = t.getAttribute(`position`),
      r = t.getAttribute(`color`),
      i = t.index;
    if (!n || !r || !i) return;
    let a = new Uint8Array(n.count);
    for (let e = 0; e < i.count; e += 3) {
      let t = [0, 1, 2].map((t) => i.getX(e + t)),
        r = t.map((e) => n.getX(e)),
        o =
          t.every(
            (e) =>
              n.getY(e) >= X.ceiling - 1e-4 && n.getY(e) <= X.ceiling + 0.0901,
          ) && Math.max(...r) - Math.min(...r) < 0.4;
      for (let e of t) a[e] |= o ? 1 : 2;
    }
    if (!a.includes(1) || a.includes(3)) return;
    let o = t.clone(),
      s = o.getAttribute(`color`);
    for (let e = 0; e < a.length; e++)
      a[e] === 1 &&
        s.setXYZ(e, r.getX(e) * 1.9, r.getY(e) * 1.65, r.getZ(e) * 1.4);
    ((s.needsUpdate = !0),
      (o.userData = { ...t.userData, millCeilingFinish: !0 }),
      (e.geometry = o));
  });
}
