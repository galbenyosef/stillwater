// shrubs-01.js — shrub, fern and flower scatter
// Lines 51550-51716 of readable/assets__index-BogB70q-.pretty.js (cluster shrubs, statement-aligned).
function scatterShrubs(e) {
  let t = createRandom(270927),
    n = [],
    r = [],
    i = [],
    a = e.filter((e) => e.kind === `rock`),
    o = e.filter((e) => e.kind === `tree`),
    s = (e) => (Array.isArray(e.s) ? Math.max(e.s[0], e.s[2]) : e.s || 1),
    c = (e, t, n) => {
      let r = islandHeight(e, t);
      if (
        r < 0.4 ||
        shoreDistance(e, t) < 2.6 ||
        !__(e, t, n) ||
        a.some((r) => Math.hypot(e - r.x, t - r.z) < s(r) * 0.65 + n * 0.45) ||
        o.some((r) => Math.hypot(e - r.x, t - r.z) < s(r) * 0.42 + n * 0.55)
      )
        return null;
      let i = (islandHeight(e + 0.05, t) - islandHeight(e - 0.05, t)) / 0.1,
        c = (islandHeight(e, t + 0.05) - islandHeight(e, t - 0.05)) / 0.1;
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
function scatterFlowers(e) {
  let t = createRandom(290926),
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
          smoothStep(25, 30, Math.hypot(c, l)) *
          (1 - smoothStep(37, 41, Math.max(Math.abs(c), Math.abs(l)))),
        d = (1 - smoothStep(0.38, 0.62, hillNoise(c, l))) * 0.82;
      if (t() > d * u) continue;
      let f = islandHeight(c, l),
        p = 1.2 + t() * 0.9,
        m = p * 0.47;
      if (
        f < 0.18 + 0.4 ||
        shoreDistance(c, l) < 2.8 ||
        distanceToPath(c, l) < shorePath.width / 2 + m + 0.15 ||
        Math.hypot(c - benchApproach.x, l - benchApproach.z) < benchArea.clearingRadius + m + 0.15 ||
        insideBenchArea(c, l, m + 0.15) ||
        i.some(
          (e) =>
            Math.hypot(c - e.x, l - e.z) <
            a(e) * (e.kind === `tree` ? 0.62 : 0.83) + m,
        )
      )
        continue;
      let h = (islandHeight(c + 0.08, l) - islandHeight(c - 0.08, l)) / 0.16,
        g = (islandHeight(c, l + 0.08) - islandHeight(c, l - 0.08)) / 0.16;
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
          y: islandHeight(c + 0.17, l) - 0.014,
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
