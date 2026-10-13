// assets__index-BogB70q- 21 — math
// Lines 48873-49114 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Vh(e, { size: t = 1024, extent: n = 48 } = {}) {
  let r = new Uint8Array(t * t * 4),
    i = (n * 2) / t;
  for (let e = 0; e < t; e++)
    for (let a = 0; a < t; a++) {
      let o = (a + 0.5) * i - n,
        s = (e + 0.5) * i - n;
      r[(e * t + a) * 4 + 3] = Math.round(255 * Bh(o, s));
    }
  let a = (e, a, o, s, c, l = !1) => {
    let u = Math.max(a, o) * 1.25,
      d = e.angle || 0,
      f = Math.cos(d),
      p = Math.sin(d),
      m = Math.max(0, Math.floor((e.x - u + n) / i)),
      h = Math.min(t - 1, Math.ceil((e.x + u + n) / i)),
      g = Math.max(0, Math.floor((e.z - u + n) / i)),
      _ = Math.min(t - 1, Math.ceil((e.z + u + n) / i));
    for (let u = g; u <= _; u++)
      for (let d = m; d <= h; d++) {
        let m = (d + 0.5) * i - n,
          h = (u + 0.5) * i - n,
          g = Y(m, h);
        if (
          g < 0.06 ||
          (l && (g <= 0.54 || jh(m, h))) ||
          (s === 3 && (g < 0.3 || jh(m, h))) ||
          (e.kind === `benchpatch` && (g < 0.3 || jh(m, h)))
        )
          continue;
        let _ = m - e.x,
          v = h - e.z,
          y = (_ * f + v * p) / a,
          b = (-_ * p + v * f) / o,
          x = Math.atan2(b, y),
          S =
            1 -
            Zf(
              0.16,
              1 +
                0.1 * Math.sin(x * 3 + e.x) +
                0.06 * Math.cos(x * 5 + e.z) +
                (s === 0 ? 0.14 * (zh(m * 0.65, h * 0.65) - 0.5) : 0),
              Math.hypot(y, b),
            ),
          C = Zf(q - 0.12, q + 0.18, g) * (l ? Zf(q + 0.36, q + 0.62, g) : 1),
          w = Math.round(255 * S * C * c),
          T = (u * t + d) * 4 + s;
        r[T] = s === 3 ? Math.min(r[T], 255 - w) : Math.max(r[T], w);
      }
  };
  for (let t of e) {
    let e = Array.isArray(t.s) ? t.s : [t.s || 1, t.s || 1, t.s || 1];
    (t.kind === `tree`
      ? (a(t, 4.1 * e[0], 3.4 * e[2], 0, 0.94),
        a(t, 0.58 * e[0], 0.5 * e[2], 1, 0.88),
        a(
          { ...t, x: t.x + 0.22, z: t.z - 0.18 },
          1.1 * e[0],
          0.95 * e[2],
          2,
          0.36,
        ))
      : t.kind === `rock` && Y(t.x, t.z) > 0.18 - 0.22
        ? (a(t, 0.92 * e[0], 0.82 * e[2], 1, 0.52),
          a(t, 1.45 * e[0], 1.25 * e[2], 2, 0.68),
          a(t, 0.84 * e[0], 0.72 * e[2], 0, 0.48, !0),
          a(t, 0.54 * e[0], 0.46 * e[2], 1, 0.78, !0))
        : t.kind === `benchpatch`
          ? (a(t, e[0], e[2], 3, 0.92), a(t, e[0] * 0.75, e[2] * 0.75, 2, 0.42))
          : t.kind === `lakesidecover` &&
            t.asset === `meadowgrass` &&
            a(t, 1.05 * e[0], 0.9 * e[2], 3, 0.85),
      /bankcover|fern|grass|foxglove|flowers|shrub/.test(t.asset) &&
        !jh(t.x, t.z) &&
        (a(t, 0.09 + 0.24 * e[0], 0.08 + 0.2 * e[2], 1, 0.46, !0),
        t.asset.includes(`grass`) ||
          a(t, 0.48 * e[0], 0.4 * e[2], 0, 0.28, !0)));
  }
  return { data: r, size: t, extent: n };
}
function Hh(e) {
  let t = e.find((e) => e.asset === `mill`),
    n = e.find((e) => e.asset === `bridge`),
    r = [];
  if (t) {
    r.push({ x: t.x, z: t.z, hx: 3.68, hz: 2.9, spread: 0.86, strength: 0.94 });
    for (let e of Jf.footings)
      r.push({
        x: t.x + e.x,
        z: t.z - e.y,
        hx: e.width / 2,
        hz: e.depth / 2,
        spread: 0.44,
        strength: 0.85,
      });
  }
  if (n)
    for (let e of [-1, 1])
      for (let t of [-1, 1])
        r.push({
          x: n.x + e * 4.85 * n.s[0],
          z: n.z + t * 0.62 * n.s[2],
          hx: 0.14,
          hz: 0.17,
          spread: 0.34,
          strength: 0.72,
        });
  return r;
}
var Uh = (e, t, n) => {
  let r = Math.abs(e - n.x) - n.hx,
    i = Math.abs(t - n.z) - n.hz;
  return (
    Math.hypot(Math.max(r, 0), Math.max(i, 0)) + Math.min(Math.max(r, i), 0)
  );
};
function Wh(e, { size: t = 256, extent: n = 12 } = {}) {
  let r = { x: -7, z: -4.2 },
    i = new Uint8Array(t * t * 4),
    a = (n * 2) / t,
    o = Hh(e),
    s = e.filter((e) => e.kind === `masonry` && e.y > -0.1);
  for (let e = 0; e < t; e++)
    for (let c = 0; c < t; c++) {
      let l = r.x + (c + 0.5) * a - n,
        u = r.z + (e + 0.5) * a - n,
        d = Y(l, u);
      if (d < 0.06) continue;
      let f =
          0.5 +
          0.28 * Math.sin(l * 9.3 + Math.sin(u * 6.7)) +
          0.22 * Math.sin(u * 13.1 - l * 3.8),
        p = 0,
        m = 0,
        h = 0;
      for (let e of o) {
        let t = Math.max(0, Uh(l, u, e)),
          n = (1 - Zf(0.02, e.spread * (0.78 + f * 0.38), t)) * e.strength;
        ((p = Math.max(p, n)),
          (m = Math.max(m, (1 - Zf(0, 0.19, t)) * e.strength)),
          (h = Math.max(h, n * Zf(0.42, 0.79, f) * 0.54)));
      }
      for (let e of s) {
        let t =
          1 - Zf(0.36, 1.25, Math.hypot((l - e.x) / 0.58, (u - e.z) / 0.46));
        ((p = Math.max(p, t * 0.38)),
          (m = Math.max(m, t * 0.36)),
          (h = Math.max(h, t * f * 0.88)));
      }
      let g = Zf(q - 0.12, q + 0.2, d),
        _ = (e * t + c) * 4;
      ((i[_] = Math.round(255 * p * g)),
        (i[_ + 1] = Math.round(255 * m * g)),
        (i[_ + 2] = Math.round(255 * h * g)),
        (i[_ + 3] = 255));
    }
  return { data: i, size: t, extent: n, center: r };
}
function Gh(e) {
  let t = cp(180927),
    n = [],
    r = Hh(e),
    i = e.filter((e) => e.kind === `rock`),
    a = [
      [-7.04, -6.98, 0.31],
      [-7.07, -5.15, 0.33],
      [-7.04, -3.82, 0.39],
      [-7.02, -2.62, 0.33],
      [-7.06, -1.51, 0.28],
      [-6.11, -7.57, 0.35],
      [-4.9, -7.6, 0.27],
      [-1.27, -7.55, 0.32],
      [0.08, -7.52, 0.3],
      [-6.51, 0.48, 0.29],
      [0.65, 0.18, 0.25],
    ],
    o = (e, t) => {
      let n = Y(e, t);
      if (
        n < 0.215 ||
        np(e, t) < 2.35 ||
        r.some((n) => Uh(e, t, n) < 0.04) ||
        i.some(
          (n) =>
            Math.hypot(e - n.x, t - n.z) <
            (Array.isArray(n.s) ? n.s[0] : n.s) * 0.54,
        )
      )
        return null;
      let a = (Y(e + 0.05, t) - Y(e - 0.05, t)) / 0.1,
        o = (Y(e, t + 0.05) - Y(e, t - 0.05)) / 0.1;
      if (Math.hypot(a, o) > 1.45) return null;
      let s = Math.hypot(a, 1, o);
      return { y: n, normal: [-a / s, 1 / s, -o / s] };
    };
  for (let [e, [r, i, s]] of a.entries()) {
    for (let a = 0; a < 9; a++) {
      let c = t() * Math.PI * 2,
        l = Math.sqrt(t()) * s,
        u = r + Math.cos(c) * l,
        d = i + Math.sin(c) * l,
        f = o(u, d);
      if (!f) continue;
      let p = 0.033 + t() * 0.062;
      n.push({
        asset: `pebble` + ((e + a) % 3),
        x: u,
        z: d,
        y: f.y - 0.017,
        s: [p, p * (0.44 + t() * 0.3), p * (0.8 + t() * 0.45)],
        normal: f.normal,
        angle: t() * Math.PI * 2,
        tint: 0.76 + t() * 0.21,
        kind: `foundationstone`,
      });
    }
    let a = r + (e < 5 ? 0.17 : 0) + (t() - 0.5) * 0.1,
      c = i + (e >= 5 && e < 9 ? 0.17 : 0) + (t() - 0.5) * 0.1,
      l = o(a, c);
    !l ||
      l.normal[1] < 0.72 ||
      n.push({
        asset: e % 3 == 1 ? `grass` : `bankcover` + (e % 2),
        x: a,
        z: c,
        y: l.y - 0.019,
        s: e % 3 == 1 ? 0.23 : 0.26 + t() * 0.08,
        normal: l.normal,
        angle: t() * Math.PI * 2,
        tint: 0.72 + t() * 0.13,
        kind: `foundationplant`,
      });
  }
  return n;
}
var Kh = Eh.points.map((e) => `vec2(${e.map((e) => e.toFixed(4)).join(`,`)})`),
  qh = Kh.slice(1).map(
    (e, t) =>
      `trail=min(trail,bankTrailDistance(vBankWorld.xz,${Kh[t]},${e}));`,
  ).join(`
`);
