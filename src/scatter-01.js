// scatter-01.js — the seeded scatter builders (props, undergrowth, stones) and the value-noise helpers
// Lines 48637-48872 of readable/assets__index-BogB70q-.pretty.js (cluster scatter, statement-aligned).
function scatterRocks(e) {
  let t = createRandom(260926),
    n = [],
    r = e.filter((e) => e.kind === `rock`);
  for (let e = 0; e < 180 && n.length < 1100; e++) {
    let i = t() * Math.PI * 2,
      a = 17.3 + t() * 9,
      o = Math.cos(i) * a,
      s = 0.4 + Math.sin(i) * a * 0.92,
      c = 1.2 + t() * 1.2,
      l = 12 + Math.floor(t() * 10),
      u = e % 5 == 0,
      d = 0.77 + t() * 0.2;
    for (let e = 0; e < l && n.length < 1100; e++) {
      let i = t() * Math.PI * 2,
        a = Math.sqrt(t()) * c,
        l = o + Math.cos(i) * a,
        f = s + Math.sin(i) * a * 0.7,
        p = islandHeight(l, f);
      if (
        p < 0.3 ||
        p > 4.5 ||
        shoreDistance(l, f) < 2.6 ||
        onPath(l, f) ||
        Math.hypot(l - benchArea.x, f - benchArea.z) < 1.3 ||
        r.some(
          (e) =>
            Math.hypot(l - e.x, f - e.z) <
            (Array.isArray(e.s) ? e.s[0] : e.s) * 0.64,
        )
      )
        continue;
      let m = (islandHeight(l + 0.08, f) - islandHeight(l - 0.08, f)) / 0.16,
        h = (islandHeight(l, f + 0.08) - islandHeight(l, f - 0.08)) / 0.16;
      if (Math.hypot(m, h) > 1.15) continue;
      let g = Math.hypot(m, 1, h),
        _ = 0.75 + t() * 0.65,
        v =
          u && e % 4 == 0
            ? `flowers`
            : a < c * 0.45 && e % 3 == 0
              ? `bankcover1`
              : `meadowgrass`,
        y =
          v === `meadowgrass`
            ? [_, _ * (0.85 + t() * 0.55), _]
            : _ * (v === `flowers` ? 0.54 : 0.72);
      n.push({
        asset: v,
        x: l,
        y: p - 0.025,
        z: f,
        s: y,
        normal: [-m / g, 1 / g, -h / g],
        angle: t() * Math.PI * 2,
        tint: d * (0.9 + t() * 0.15),
        kind: `lakesidecover`,
      });
    }
  }
  return n;
}
function scatterPebbles() {
  let e = createRandom(91937),
    t = [];
  for (let n = 0; n < 2200 && t.length < 240; n++) {
    let r = (e() - 0.5) * 35,
      i = (e() - 0.5) * 33,
      a = islandHeight(r, i);
    if (
      a < -0.55 ||
      a > 0.28 ||
      (r > -8.2 && r < 2.3 && i > -9 && i < 1.8) ||
      (r > -5.2 && r < -1 && i > -0.3 && i < 5.7) ||
      Math.hypot(islandHeight(r + 0.1, i) - a, islandHeight(r, i + 0.1) - a) / 0.1 > 2
    )
      continue;
    let o = 3 + Math.floor(e() * 4);
    for (let a = 0; a < o && t.length < 240; a++) {
      let o = r + (e() - 0.5) * 0.7,
        s = i + (e() - 0.5) * 0.7,
        c = islandHeight(o, s),
        l = 0.035 + e() * 0.07;
      c < -0.65 ||
        c > 0.32 ||
        t.push({
          asset: `pebble` + ((n + a) % 3),
          x: o,
          y: c - 0.012,
          z: s,
          s: [l, l * (0.55 + e() * 0.25), l * (0.75 + e() * 0.65)],
          angle: e() * Math.PI * 2,
          tint: 0.68 + e() * 0.46,
        });
    }
  }
  return t;
}
function scatterTrees(e) {
  let t = createRandom(73016),
    n = [],
    r = e.filter((e) => e.kind === `tree`),
    i = e.filter((e) => e.kind === `rock`),
    a = [...r, ...i.filter((e) => e.asset.endsWith(`_hero`))];
  for (let e of a) {
    let r = Array.isArray(e.s) ? e.s[0] : e.s || 1,
      a = e.kind === `tree`,
      o = Math.atan2(-e.z, -e.x),
      s = a ? 5 : 3;
    for (let c = 0; c < s; c++) {
      let s = o + (t() - 0.5) * 4.2,
        l = (a ? 0.6 : 1.03) * r + t() * 0.65,
        u = e.x + Math.cos(s) * l,
        d = e.z + Math.sin(s) * l,
        f = islandHeight(u, d);
      if (
        f < 0.18 + 0.15 ||
        f > 4.6 ||
        shoreDistance(u, d) < 2.5 ||
        i.some(
          (e) =>
            Math.hypot(u - e.x, d - e.z) <
            (Array.isArray(e.s) ? e.s[0] : e.s) * 0.58,
        )
      )
        continue;
      let p = (islandHeight(u + 0.08, d) - islandHeight(u - 0.08, d)) / 0.16,
        m = (islandHeight(u, d + 0.08) - islandHeight(u, d - 0.08)) / 0.16;
      if (Math.hypot(p, m) > 1.05) continue;
      let h = Math.hypot(p, 1, m),
        g = 0.46 + t() * 0.28,
        _ =
          c === 0
            ? `grass`
            : c === 3 && a
              ? `fern0`
              : c % 2
                ? `bankcover1`
                : `bankcover0`;
      n.push({
        asset: _,
        x: u,
        y: f - 0.028,
        z: d,
        s: g,
        normal: [-p / h, 1 / h, -m / h],
        angle: t() * Math.PI * 2,
        tint: 0.8 + t() * 0.18,
        kind: `rootcover`,
      });
    }
  }
  return n;
}
function scatterUndergrowth(e) {
  let t = createRandom(180926),
    n = [],
    r = e.filter((e) => e.kind === `tree`),
    i = e.filter((e) => e.kind === `rock`);
  for (let e of r) {
    let r = Math.atan2(e.z, e.x),
      a = Array.isArray(e.s) ? e.s[0] : e.s || 1;
    for (let o = 0; o < 2; o++) {
      let s = r + (o ? 1 : -1) * (0.4 + t() * 0.85),
        c = (1.9 + t() * 1.8) * a,
        l = e.x + Math.cos(s) * c,
        u = e.z + Math.sin(s) * c;
      for (let e = 0; e < 4; e++) {
        let r = t() * Math.PI * 2,
          a = Math.sqrt(t()) * 0.82,
          s = l + Math.cos(r) * a,
          c = u + Math.sin(r) * a,
          d = islandHeight(s, c);
        if (
          d < 0.18 + 0.5 ||
          shoreDistance(s, c) < 3.2 ||
          i.some(
            (e) =>
              Math.hypot(s - e.x, c - e.z) <
              (Array.isArray(e.s) ? e.s[0] : e.s) * 0.65,
          )
        )
          continue;
        let f = (islandHeight(s + 0.08, c) - islandHeight(s - 0.08, c)) / 0.16,
          p = (islandHeight(s, c + 0.08) - islandHeight(s, c - 0.08)) / 0.16;
        if (Math.hypot(f, p) > 0.92) continue;
        let m = Math.hypot(f, 1, p),
          h = 0.32 + t() * 0.25,
          g =
            e === 0
              ? `grass`
              : e === 3 && o === 1
                ? `fern0`
                : e % 2
                  ? `bankcover1`
                  : `bankcover0`;
        n.push({
          asset: g,
          x: s,
          y: d - 0.025,
          z: c,
          s: h,
          normal: [-f / m, 1 / m, -p / m],
          angle: t() * Math.PI * 2,
          tint: 0.79 + t() * 0.18,
          kind: `woodlandcover`,
        });
      }
    }
  }
  return n;
}
var hash2 = (e, t) => {
  let n = Math.sin(e * 127.1 + t * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
function valueNoise(e, t) {
  let n = Math.floor(e),
    r = Math.floor(t),
    i = e - n,
    a = t - r,
    o = i * i * (3 - 2 * i),
    s = a * a * (3 - 2 * a);
  return (
    (hash2(n, r) * (1 - o) + hash2(n + 1, r) * o) * (1 - s) +
    (hash2(n, r + 1) * (1 - o) + hash2(n + 1, r + 1) * o) * s
  );
}
function hillNoise(e, t) {
  let n = valueNoise(e * 0.083 + 8, t * 0.083 - 3) * 2.8;
  return (
    valueNoise(e * 0.16 + n, t * 0.16 - n) * 0.62 +
    valueNoise(e * 0.47 - 4, t * 0.47 + 2) * 0.28 +
    valueNoise(e * 1.27, t * 1.27) * 0.1
  );
}
