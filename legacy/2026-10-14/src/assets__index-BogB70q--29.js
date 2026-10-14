// assets__index-BogB70q- 29 — math
// Lines 51465-51716 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function h_({
  rootColor: e = `#607146`,
  tipColor: t = `#9da06b`,
  blades: n = 24,
} = {}) {
  let r = cp(32619),
    i = [],
    a = [],
    o = [],
    s = new G(e),
    c = new G(t),
    l = new G();
  for (let e = 0; e < n; e++) {
    let e = r() * Math.PI * 2,
      t = r() * Math.PI * 2,
      n = Math.sqrt(r()) * 0.19,
      u = Math.cos(t) * n,
      d = Math.sin(t) * n,
      f = 0.18 + r() * 0.25,
      p = 0.07 + r() * 0.19,
      m = 0.014 + r() * 0.008,
      h = 0.79 + r() * 0.28,
      g = i.length / 3;
    for (let t = 0; t <= 4; t++) {
      let n = t / 4,
        r = p * n * n,
        _ = m * (0.025 + 0.975 * (1 - n) ** 0.65) * 0.5,
        v = e + n * 0.32,
        y = f * (n - 0.16 * n * n * n);
      l.copy(s)
        .lerp(c, n * 0.8)
        .multiplyScalar(h);
      for (let t of [-1, 1])
        (i.push(
          u + Math.sin(e) * r + Math.cos(v) * _ * t,
          y,
          d + Math.cos(e) * r - Math.sin(v) * _ * t,
        ),
          a.push(l.r, l.g, l.b));
      if (t < 4) {
        let e = g + t * 2;
        o.push(e, e + 1, e + 2, e + 1, e + 3, e + 2);
      }
    }
  }
  let u = new Hr();
  (u.setAttribute(`position`, new Ar(i, 3)),
    u.setAttribute(`color`, new Ar(a, 3)),
    u.setIndex(o),
    u.computeVertexNormals());
  let d = new rs({
    name: `Leaves | meadow grass`,
    vertexColors: !0,
    roughness: 0.94,
    side: 2,
    envMapIntensity: 0.75,
  });
  th(d);
  let f = new vi(u, d);
  return ((f.name = `Curved meadow tuft`), f);
}
var g_ = [
  [-23.8, -3.1, 2.7, 2],
  [-26.8, -3.9, 2.5, 2.2],
  [-23.8, -0.6, 2.4, 1.7],
  [-22.5, 1.9, 2, 1.8],
  [-25, -7.2, 2.8, 2],
  [-21.4, -6.3, 1.8, 2.1],
  [-19.8, -8.2, 2.1, 1.7],
  [-17.5, -9.4, 1.6, 1.4],
  [-18.3, -1.1, 1.3, 1.6],
  [-19.8, 1.9, 1.8, 1.6],
  [-27.5, 0, 2.3, 2.1],
  [-27, -9.9, 2.4, 1.8],
];
function __(e, t, n) {
  let r = Th;
  return (
    Ah(e, t) > Eh.width / 2 + n + 0.08 &&
    Math.hypot(e - kh.x, t - kh.z) > Dh.clearingRadius + n &&
    !Mh(e, t, n + 0.12) &&
    Math.hypot(e - wh.x, t - wh.z) > wh.radius + n &&
    !(e > r.x0 - n && e < r.x1 + n && Math.abs(t - r.z) < r.width / 2 + n)
  );
}
function v_(e) {
  let t = cp(270927),
    n = [],
    r = [],
    i = [],
    a = e.filter((e) => e.kind === `rock`),
    o = e.filter((e) => e.kind === `tree`),
    s = (e) => (Array.isArray(e.s) ? Math.max(e.s[0], e.s[2]) : e.s || 1),
    c = (e, t, n) => {
      let r = Y(e, t);
      if (
        r < 0.4 ||
        np(e, t) < 2.6 ||
        !__(e, t, n) ||
        a.some((r) => Math.hypot(e - r.x, t - r.z) < s(r) * 0.65 + n * 0.45) ||
        o.some((r) => Math.hypot(e - r.x, t - r.z) < s(r) * 0.42 + n * 0.55)
      )
        return null;
      let i = (Y(e + 0.05, t) - Y(e - 0.05, t)) / 0.1,
        c = (Y(e, t + 0.05) - Y(e, t - 0.05)) / 0.1;
      if (Math.hypot(i, c) > 0.95) return null;
      let l = Math.hypot(i, 1, c);
      return { y: r, normal: [-i / l, 1 / l, -c / l] };
    };
  for (let [e, [a, o, s, l]] of g_.entries()) {
    let u = (t() - 0.5) * 0.9,
      d = Math.cos(u),
      f = Math.sin(u);
    i.push({ kind: `benchpatch`, x: a, z: o, s: [s, 1, l], angle: u });
    for (let e = 0; e < 118; e++) {
      let r = t() * Math.PI * 2,
        i = Math.sqrt(t()),
        u = Math.cos(r) * i * s,
        p = Math.sin(r) * i * l,
        m = a + u * d - p * f,
        h = o + u * f + p * d,
        g = e % 19 == 0,
        _ = !g && e % 11 == 0,
        v = g ? 0.53 + t() * 0.32 : _ ? 0.52 + t() * 0.32 : 0.78 + t() * 0.53,
        y = v * (g ? 1.05 : _ ? 0.9 : 0.6),
        b = c(m, h, y);
      if (!b) continue;
      let x = g ? `fern0` : _ ? `bankcover0` : `bankgrass`,
        S = x === `bankgrass` ? v * (0.48 + (1 - i) * 0.6) : v;
      n.push({
        asset: x,
        x: m,
        z: h,
        y: b.y - 0.025,
        s: [v, S, v],
        normal: b.normal,
        angle: t() * Math.PI * 2,
        tint: 0.72 + t() * 0.23,
        kind: `benchcover`,
        footprint: y,
      });
    }
    if ([0, 3, 8].includes(e))
      for (let e = 0; e < 7; e++) {
        let e = a + 0.7 + (t() - 0.5) * 1.1,
          r = o + (t() - 0.5) * 0.85,
          i = 0.35 + t() * 0.2,
          s = c(e, r, i * 0.6);
        s &&
          n.push({
            asset: `flowers`,
            x: e,
            z: r,
            y: s.y - 0.025,
            s: i,
            normal: s.normal,
            angle: t() * Math.PI * 2,
            tint: 0.84 + t() * 0.13,
            kind: `benchcover`,
            footprint: i * 0.6,
          });
      }
    for (let e = 0; e < 36; e++) {
      let e = t() * Math.PI * 2,
        n = 0.75 + t() * 0.42,
        i = Math.cos(e) * n * s,
        u = Math.sin(e) * n * l,
        p = a + i * d - u * f,
        m = o + i * f + u * d,
        h = c(p, m, 0.09);
      h &&
        r.push({
          x: p,
          z: m,
          y: h.y + 0.016,
          s: 0.83 + t() * 0.43,
          normal: h.normal,
          angle: t() * Math.PI * 2,
          tint: 0.69 + t() * 0.22,
        });
    }
  }
  return { plants: n, litter: r, patches: i };
}
function y_(e) {
  let t = cp(290926),
    n = [],
    r = [],
    i = e.filter((e) => e.kind === `rock` || e.kind === `tree`),
    a = (e) => (Array.isArray(e.s) ? Math.max(e.s[0], e.s[2]) : e.s || 1),
    o = 0.72;
  for (let e = -40; e < 40; e += o)
    for (let s = -40; s < 40; s += o) {
      let c = s + (t() - 0.5) * o * 0.86,
        l = e + (t() - 0.5) * o * 0.86,
        u =
          Zf(25, 30, Math.hypot(c, l)) *
          (1 - Zf(37, 41, Math.max(Math.abs(c), Math.abs(l)))),
        d = (1 - Zf(0.38, 0.62, Bh(c, l))) * 0.82;
      if (t() > d * u) continue;
      let f = Y(c, l),
        p = 1.2 + t() * 0.9,
        m = p * 0.47;
      if (
        f < 0.18 + 0.4 ||
        np(c, l) < 2.8 ||
        Ah(c, l) < Eh.width / 2 + m + 0.15 ||
        Math.hypot(c - kh.x, l - kh.z) < Dh.clearingRadius + m + 0.15 ||
        Mh(c, l, m + 0.15) ||
        i.some(
          (e) =>
            Math.hypot(c - e.x, l - e.z) <
            a(e) * (e.kind === `tree` ? 0.62 : 0.83) + m,
        )
      )
        continue;
      let h = (Y(c + 0.08, l) - Y(c - 0.08, l)) / 0.16,
        g = (Y(c, l + 0.08) - Y(c, l - 0.08)) / 0.16;
      if (Math.hypot(h, g) > 0.85) continue;
      let _ = Math.hypot(h, 1, g),
        v = [-h / _, 1 / _, -g / _];
      if (
        (n.push({
          asset: `clearinggrass`,
          kind: `clearingcover`,
          x: c,
          y: f - 0.025,
          z: l,
          s: [p, 0.55 + d * 0.7 + t() * 0.28, p],
          normal: v,
          footprint: m,
          angle: t() * Math.PI * 2,
          tint: 0.73 + t() * 0.24,
        }),
        r.length < 90 && t() < 0.035)
      ) {
        let e = 0.035 + t() * 0.055;
        r.push({
          asset: `pebble${r.length % 3}`,
          kind: `clearingstone`,
          x: c + 0.17,
          y: Y(c + 0.17, l) - 0.014,
          z: l,
          s: [e, e * 0.53, e * 0.84],
          normal: v,
          angle: t() * Math.PI * 2,
          tint: 0.68 + t() * 0.22,
        });
      }
    }
  return { plants: n, stones: r };
}
