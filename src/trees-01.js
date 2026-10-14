// trees-01.js — tree instancing and scatter (hash, per-tree variation, LOD selection)
// Lines 50932-51194 of readable/assets__index-BogB70q-.pretty.js (cluster trees, statement-aligned).
var e_ = (e, t, n) => {
  let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
  return r * r * (3 - 2 * r);
};
function t_(e, t) {
  let n = t.x * 1.73 + t.z * 2.41,
    r = Math.hypot(t.x, t.z) || 1,
    i = Math.cos(t.angle),
    a = Math.sin(t.angle),
    o = 0.3 + 0.3 * (0.5 + 0.5 * Math.sin(n * 1.31));
  return {
    height: new ir().setFromObject(e).max.y,
    phase: n,
    leanX: ((-t.x * i + t.z * a) / r) * o,
    leanZ: ((-t.x * a - t.z * i) / r) * o,
    widthX: 1 + 0.13 * Math.sin(n),
    widthZ: 1 + 0.12 * Math.cos(n * 1.37),
    rise: 1 + 0.06 * Math.sin(n * 0.79),
    turn: 0.13 * Math.sin(n * 1.17),
    leafTint: [
      1 + 0.09 * Math.sin(n * 1.31),
      1 + 0.035 * Math.cos(n * 0.73),
      1 + 0.08 * Math.sin(n * 1.17 + 0.9),
    ],
  };
}
function n_(e, t) {
  let n = e.clone(!0),
    {
      height: r,
      phase: i,
      leanX: a,
      leanZ: o,
      widthX: s,
      widthZ: c,
      rise: l,
      turn: u,
    } = t,
    d = (e, t, n, d) => {
      let f = e_(1.65, Math.max(2.8, r * 0.48), t),
        p = e_(1.65, r, t);
      if (!f) return d.set(e, t, n);
      let m = Math.hypot(e, n),
        h = Math.atan2(n, e),
        g = e_(0.25, 1.6, m),
        _ =
          1 +
          f *
            g *
            (0.085 * Math.sin(2 * h + i) +
              0.035 * Math.cos(3 * h - t * 0.65 + i)),
        v = f * g * (u + 0.065 * Math.sin(t * 0.68 + i)),
        y = Math.cos(v),
        b = Math.sin(v);
      return d.set(
        (e * y - n * b) * _ * (1 + f * (s - 1)) + a * p * p,
        t + (t - 1.65) * f * (l - 1) - f * g * 0.16 * Math.sin(h * 2 + i),
        (e * b + n * y) * _ * (1 + f * (c - 1)) + o * p * p,
      );
    },
    f = new U(),
    p = new U(),
    m = new U(),
    h = new U(),
    g = new U(),
    _ = new W(),
    v = new zt(),
    y = new H(),
    b = new U(),
    x = new U(),
    S = (e, t, n) => {
      let r = 0.008;
      return (
        d(e + r, t, n, f),
        d(e - r, t, n, p),
        m.subVectors(f, p).multiplyScalar(1 / (2 * r)),
        d(e, t + r, n, f),
        d(e, t - r, n, p),
        h.subVectors(f, p).multiplyScalar(1 / (2 * r)),
        d(e, t, n + r, f),
        d(e, t, n - r, p),
        g.subVectors(f, p).multiplyScalar(1 / (2 * r)),
        _.makeBasis(m, h, g)
      );
    };
  return (
    n.traverse((e) => {
      if (!e.isMesh) return;
      let t = e.geometry,
        n = new Hr();
      for (let [e, r] of Object.entries(t.attributes))
        n.setAttribute(
          e,
          [`position`, `normal`, `tangent`, `_leaf_anchor`].includes(e)
            ? r.clone()
            : r,
        );
      (n.setIndex(t.index),
        (n.groups = t.groups.map((e) => ({ ...e }))),
        n.setDrawRange(t.drawRange.start, t.drawRange.count));
      let r = n.getAttribute(`position`),
        i = n.getAttribute(`normal`),
        a = n.getAttribute(`_leaf_anchor`),
        o = n.getAttribute(`_leaf_phase`),
        s = n.getAttribute(`tangent`),
        c = new Map();
      for (let e = 0; e < r.count; e++) {
        let t = r.getX(e),
          n = r.getY(e),
          l = r.getZ(e);
        if (o?.getX(e) > 0.5) {
          let r = a.getX(e),
            o = a.getY(e),
            u = a.getZ(e),
            f = `${r}:${o}:${u}`,
            p = c.get(f);
          (p ||
            (S(r, o, u),
            m.normalize(),
            h.addScaledVector(m, -h.dot(m)).normalize(),
            g.crossVectors(m, h),
            y.setFromRotationMatrix(_.makeBasis(m, h, g)).normalize(),
            (p = { pivot: d(r, o, u, new U()), rotation: y.clone() }),
            c.set(f, p)),
            b
              .set(t - r, n - o, l - u)
              .applyQuaternion(p.rotation)
              .add(p.pivot),
            i &&
              (x
                .fromBufferAttribute(i, e)
                .applyQuaternion(p.rotation)
                .normalize(),
              i.setXYZ(e, x.x, x.y, x.z)),
            s &&
              (x
                .fromBufferAttribute(s, e)
                .applyQuaternion(p.rotation)
                .normalize(),
              s.setXYZ(e, x.x, x.y, x.z)),
            a.setXYZ(e, p.pivot.x, p.pivot.y, p.pivot.z));
        } else
          (v.getNormalMatrix(S(t, n, l)),
            i &&
              (x.fromBufferAttribute(i, e).applyMatrix3(v).normalize(),
              i.setXYZ(e, x.x, x.y, x.z)),
            s &&
              (x.fromBufferAttribute(s, e).transformDirection(_),
              s.setXYZ(e, x.x, x.y, x.z)),
            d(t, n, l, b));
        r.setXYZ(e, b.x, b.y, b.z);
      }
      (n.computeBoundingBox(), n.computeBoundingSphere(), (e.geometry = n));
    }),
    n
  );
}
function r_(e) {
  let t = createRandom(92618),
    n = [],
    r = e.filter((e) => e.kind === `rock`);
  for (let i of e.filter((e) => e.kind === `tree`))
    for (let e = 0; e < 96; e++) {
      let e = t() * Math.PI * 2,
        a = 0.48 + t() ** 0.72 * 2.6 * (Array.isArray(i.s) ? i.s[0] : i.s),
        o = i.x + Math.cos(e) * a,
        s = i.z + Math.sin(e) * a,
        c = islandHeight(o, s);
      if (
        c < 0.4 ||
        shoreDistance(o, s) < 3.4 ||
        r.some(
          (e) =>
            Math.hypot(o - e.x, s - e.z) <
            (Array.isArray(e.s) ? e.s[0] : e.s) * 0.64 + 0.1,
        )
      )
        continue;
      let l = (islandHeight(o + 0.05, s) - islandHeight(o - 0.05, s)) / 0.1,
        u = (islandHeight(o, s + 0.05) - islandHeight(o, s - 0.05)) / 0.1;
      if (Math.hypot(l, u) > 1.15) continue;
      let d = Math.hypot(l, 1, u);
      n.push({
        x: o,
        y: c + 0.016,
        z: s,
        s: 0.86 + t() * 0.52,
        angle: t() * Math.PI * 2,
        normal: [-l / d, 1 / d, -u / d],
        tint: 0.63 + t() * 0.26,
      });
    }
  return n;
}
function i_(e) {
  let t;
  if (
    (e.traverse((e) => {
      !t &&
        e.isMesh &&
        /leaves/i.test(e.material.name) &&
        e.geometry.hasAttribute(`_leaf_anchor`) &&
        (t = e);
    }),
    !t)
  )
    throw Error(`The woodland floor needs the reviewed birch leaf surface.`);
  let n = t.geometry,
    r = n.attributes.position,
    i = n.attributes._leaf_anchor,
    a = n.attributes.uv,
    o = new U().fromBufferAttribute(i, 0),
    s = [];
  for (let e = 0; e < r.count; e++)
    i.getX(e) === o.x && i.getY(e) === o.y && i.getZ(e) === o.z && s.push(e);
  let c = (e) =>
      e
        .reduce((e, t) => e.add(new U().fromBufferAttribute(r, t)), new U())
        .multiplyScalar(1 / e.length),
    l = s.map((e) => a.getX(e)),
    u = s.map((e) => a.getY(e)),
    d = [
      c(s.filter((e, t) => u[t] >= Math.max(...u) - 0.001)),
      c(s.filter((e, t) => u[t] <= Math.min(...u) + 0.001)),
    ],
    f = (d[0].distanceToSquared(o) > d[1].distanceToSquared(o) ? d[0] : d[1])
      .sub(o)
      .normalize(),
    p = c(s.filter((e, t) => l[t] >= Math.max(...l) - 0.001)).sub(
      c(s.filter((e, t) => l[t] <= Math.min(...l) + 0.001)),
    );
  p.addScaledVector(f, -p.dot(f)).normalize();
  let m = new U().crossVectors(p, f).normalize(),
    h = new Hr(),
    g = new U();
  for (let e of [`position`, `normal`, `uv`, `color`]) {
    let t = n.attributes[e];
    if (!t) continue;
    let r = [];
    for (let n of s)
      if (e === `position` || e === `normal`)
        (g.fromBufferAttribute(t, n),
          e === `position` && g.sub(o),
          r.push(g.dot(p), g.dot(m), -g.dot(f)));
      else for (let e = 0; e < t.itemSize; e++) r.push(t.getComponent(n, e));
    h.setAttribute(e, new Ar(r, t.itemSize));
  }
  let _ = new Map(s.map((e, t) => [e, t])),
    v = [];
  for (let e = 0; e < n.index.count; e += 3) {
    let t = [0, 1, 2].map((t) => n.index.getX(e + t));
    t.every((e) => _.has(e)) && v.push(...t.map((e) => _.get(e)));
  }
  (h.setIndex(v), h.computeBoundingSphere());
  let y = t.material.clone();
  ((y.onBeforeCompile = t.material.onBeforeCompile),
    (y.customProgramCacheKey = t.material.customProgramCacheKey),
    (y.name = `Fallen birch leaves`),
    y.color.multiply({ r: 1.45, g: 0.87, b: 0.48 }),
    (y.roughness = 0.94));
  let b = new Pn();
  return (b.add(new vi(h, y)), b);
}
