// assets__index-BogB70q- 43 — math
// Lines 55878-56197 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
var dy = 9.81,
  fy = xh.placements.filter((e) => e.kind === `lilies`),
  py = xh.placements.find((e) => e.asset === `bridge`),
  my = (e, t, n) => e + (t - e) * n;
function hy(e, t, n = 0.5) {
  return (
    rp(e, t, n, 0.75) &&
    !xh.solids.some((r) => Math.hypot(e - r.x, t - r.z) < r.r + n) &&
    !fy.some((r) => Math.hypot(e - r.x, t - r.z) < 0.65 + n) &&
    !(Math.abs(e - py.x) < 5.5 && Math.abs(t - py.z) < 1.8)
  );
}
function gy(e, t, n, r, i, a) {
  let o = J(a / i, 0, 1),
    s = o * o,
    c = s * o;
  return {
    value:
      (2 * c - 3 * s + 1) * e +
      (c - 2 * s + o) * i * n +
      (-2 * c + 3 * s) * t +
      (c - s) * i * r,
    velocity:
      ((6 * s - 6 * o) * (e - t)) / i +
      (3 * s - 4 * o + 1) * n +
      (3 * s - 2 * o) * r,
  };
}
function _y(e, t, n = `feed`, r = 0.5) {
  let i = e.scale,
    a = {
      kind: n,
      origin: { ...t },
      scale: i,
      shape: e.shape,
      segments: [],
      duration: 0,
    },
    o = { distance: 0, y: t.y, vx: t.speed, vy: Math.tan(t.pitch) * t.speed },
    s = (e, t, n, r, i, s) => {
      let c = { distance: n, y: r, vx: i, vy: s };
      (a.segments.push({
        phase: e,
        time: a.duration,
        duration: t,
        start: o,
        end: c,
      }),
        (o = c),
        (a.duration += t));
    };
  if (n === `jump`) {
    let e = 0.28 + i * 0.2 + r * 0.08,
      n = Math.sqrt(2 * dy * e),
      c = 0.32,
      l = 1.9 + r * 0.65,
      u = 1.15 + i * 0.45;
    (s(`approach`, l, (t.speed + 0.48) * l * 0.5, q - n * c * 0.5, 0.48, 0),
      s(`launch`, c, o.distance + (0.48 + u) * c * 0.5, q, u, n),
      (a.takeoff = a.duration),
      (a.flight = (2 * n) / dy),
      s(`airborne`, a.flight, o.distance + u * a.flight, q, u, -n),
      (a.landing = a.duration),
      s(
        `dive`,
        0.62,
        o.distance + ((u + 0.64) * 0.62) / 3,
        q - (n * 0.62) / 3,
        0.32,
        0,
      ),
      s(`recover`, 1.15, o.distance + 0.3, o.y, 0.23, 0));
  } else {
    let n = 2.3 + r * 0.6,
      c = 0.48,
      l =
        (0.365 * e.shape[0] * Math.sin(c) + 0.014 * e.shape[1] * Math.cos(c)) *
        i;
    (s(`approach`, n, (t.speed + 0.055) * n * 0.5, q - l + 0.012, 0.055, 0),
      (a.feeding = a.duration + 0.22),
      s(`feeding`, 0.55, o.distance + 0.03025, o.y, 0.055, 0),
      s(`dive`, 2, o.distance + 0.29, Math.min(t.y, q - 0.52), 0.235, 0),
      s(`recover`, 0.7, o.distance + 0.1645, o.y, 0.235, 0));
  }
  return a;
}
function vy(e, t) {
  let n = e.segments.find((e) => t < e.time + e.duration) || e.segments.at(-1),
    r = J(t - n.time, 0, n.duration),
    i = r / n.duration,
    a = n.start,
    o = n.end,
    s = gy(a.distance, o.distance, a.vx, o.vx, n.duration, r),
    c =
      n.phase === `airborne`
        ? { value: q + a.vy * r - dy * r * r * 0.5, velocity: a.vy - dy * r }
        : gy(a.y, o.y, a.vy, o.vy, n.duration, r),
    l = e.origin.heading,
    u = Math.atan2(c.velocity, Math.max(0.035, s.velocity));
  (e.kind === `feed` &&
    (n.phase === `approach` && (u = my(e.origin.pitch, 0.48, Zf(0, 1, i))),
    n.phase === `feeding` && (u = 0.48),
    n.phase === `dive` && (u = my(0.48, u, Zf(0, 0.3, i)))),
    e.kind === `abort` && (u = my(e.origin.pitch, u, Zf(0, 0.4, i))));
  let d =
    n.phase === `launch`
      ? 1
      : n.phase === `airborne` || n.phase === `feeding`
        ? 0.18
        : 0.6;
  return {
    x: e.origin.x + Math.cos(l) * s.value,
    y: c.value,
    z: e.origin.z - Math.sin(l) * s.value,
    heading: l,
    pitch: u,
    roll:
      e.origin.roll * Math.exp(-t * 3) +
      (n.phase === `airborne` ? 0.1 * Math.sin(i * Math.PI) : 0),
    speed: s.velocity,
    verticalSpeed: c.velocity,
    effort: d,
    activity: n.phase,
    activityKind: e.kind,
  };
}
function yy(e) {
  let t = 1 / 0,
    n = 1 / 0;
  for (let r = 0; r <= e.duration + 0.04; r += 0.04) {
    let i = vy(e, r),
      a = e.scale * 0.64,
      o =
        e.scale *
        (0.235 * e.shape[1] * Math.abs(Math.cos(i.pitch)) +
          0.61 * e.shape[0] * Math.abs(Math.sin(i.pitch)) +
          0.03);
    if (i.y - o < Y(i.x, i.z) + 0.08) return !1;
    if (Math.hypot(i.x - t, i.z - n) > 0.12 || r >= e.duration) {
      if (!hy(i.x, i.z, Math.max(0.43, a) + 0.12)) return !1;
      ((t = i.x), (n = i.z));
    }
  }
  return !0;
}
function by(e, t, n = 3.5) {
  if (!t) return !1;
  let r = Math.abs(t.speed || 0);
  if (Math.hypot(e.x - t.x, e.z - t.z) < n + r * 0.65) return !0;
  let i = t.heading || 0;
  return (
    Math.hypot(
      e.x - t.x - Math.sin(i) * t.speed,
      e.z - t.z - Math.cos(i) * t.speed,
    ) < n
  );
}
function xy(e, { enabled: t = !0, allowJumps: n = !0, seed: r = 8713 } = {}) {
  let i = cp(r),
    a = new Float64Array(e.length),
    o = null,
    s = 11 + i() * 7,
    c = 32 + i() * 17,
    l = null,
    u = null,
    d = [];
  function f(t, n, r) {
    for (; u.indices.length;) {
      let s = u.indices.shift(),
        c = u.kind,
        l = e[s],
        d = t[s];
      if (l.scale < 0.52 || a[s] > n || by(d, r, 4) || d.speed > 0.65) continue;
      let f = _y(l, d, c, i());
      return !yy(f) ||
        f.segments.some((e) => by(vy(f, e.time + e.duration), r, 4))
        ? !1
        : ((o = { ...f, index: s, born: n, emitted: new Set() }),
          (a[s] = n + 95 + i() * 80),
          !0);
    }
    return !1;
  }
  function p(e, t, n, r) {
    d.push({
      type: e,
      x: t.x,
      z: t.z,
      time: n,
      strength: r,
      heading: t.heading,
    });
  }
  return {
    events: d,
    get active() {
      return o;
    },
    preview(e, r = { x: 3.6, z: 7.8 }) {
      return !t || o || (e === `jump` && !n)
        ? !1
        : ((u = null), (l = { kind: e, point: r }), !0);
    },
    beginFrame() {
      d.length = 0;
    },
    advance(r, a, d, m) {
      if (!t) return -1;
      if (!o && !u && (l || r >= s)) {
        let t = l?.kind || (n && r >= c ? `jump` : `feed`),
          a = l?.point;
        ((u = {
          kind: t,
          indices: e
            .map((e, t) => ({
              i: t,
              key: a ? Math.hypot(d[t].x - a.x, d[t].z - a.z) : i(),
            }))
            .sort((e, t) => e.key - t.key)
            .map((e) => e.i),
          next: r,
        }),
          (l = null));
      }
      if (u && r >= u.next) {
        let e = f(d, r, m);
        ((u.next = r + 0.075),
          (e || !u.indices.length) &&
            ((s = r + (e ? 12 + i() * 14 : 3 + i() * 3)),
            e && u.kind === `jump` && (c = r + 42 + i() * 32),
            (u = null)));
      }
      if (!o) return -1;
      let h = o.index,
        g = d[h],
        _ = r - o.born;
      if (
        o.kind !== `abort` &&
        (o.kind === `feed` ? _ < o.feeding + 0.33 : _ < o.takeoff - 0.32) &&
        by(g, m)
      ) {
        let t = 1.15,
          n = Math.max(0.055, g.speed),
          i = 0.48;
        o = {
          kind: `abort`,
          origin: { ...g },
          index: h,
          born: r,
          scale: e[h].scale,
          shape: e[h].shape,
          duration: t,
          segments: [
            {
              phase: `retreat`,
              time: 0,
              duration: t,
              start: {
                distance: 0,
                y: g.y,
                vx: n,
                vy: g.verticalSpeed ?? Math.tan(g.pitch) * n,
              },
              end: {
                distance: (n + i) * t * 0.5,
                y: Math.min(g.y - 0.18, q - 0.68),
                vx: i,
                vy: 0,
              },
            },
          ],
          emitted: new Set(),
        };
      }
      let v = r - o.born,
        y = vy(o, v);
      (Object.assign(g, y),
        (g.tailPhase += a * (3.8 + g.speed * 10.5) * (0.5 + g.effort * 0.5)));
      for (let [t, n, r] of [
        [`takeoff`, `exit`, 0.42],
        [`landing`, `entry`, 1],
        [`feeding`, `feed`, 0.24],
      ]) {
        if (o[t] === void 0 || v < o[t] || o.emitted.has(t)) continue;
        let i = vy(o, o[t]);
        if (n === `feed`) {
          let t = 0.365 * e[h].shape[0] * e[h].scale * Math.cos(i.pitch);
          ((i.x += Math.cos(i.heading) * t), (i.z -= Math.sin(i.heading) * t));
        }
        (p(n, i, o.born + o[t], r * e[h].scale), o.emitted.add(t));
      }
      return (
        v >= o.duration &&
          ((g.activity = null),
          (g.activityKind = null),
          (o = null),
          (s = Math.max(s, r + 6))),
        h
      );
    },
  };
}
var Sy = [
  { cx: 3.6, cz: 7.8, r: 1.35, depth: 0.68 },
  { cx: -6.7, cz: 9.7, r: 1.35, depth: 0.9 },
  { cx: 9.8, cz: 0.5, r: 1.15, depth: 1.15 },
  { cx: -4, cz: -11.2, r: 1.05, depth: 0.85 },
  { cx: 0.5, cz: 11.5, r: 1.15, depth: 0.62 },
  { cx: -10.6, cz: 0, r: 1.05, depth: 0.78 },
  { cx: 8.5, cz: -6.8, r: 1.05, depth: 1.05 },
  { cx: -9.5, cz: -9.5, r: 0.85, depth: 0.73 },
  { cx: -6.7, cz: 4.8, r: 1.35, depth: 0.58 },
  { cx: 1.2, cz: 4.4, r: 1.3, depth: 0.52 },
  { cx: 5.6, cz: 4.3, r: 1.45, depth: 0.65 },
  { cx: -3.6, cz: 7, r: 1.4, depth: 0.6 },
  { cx: 1, cz: 8.6, r: 1.2, depth: 0.56 },
  { cx: 8.1, cz: 8.3, r: 1.35, depth: 0.72 },
  { cx: -10, cz: 5.6, r: 1.15, depth: 0.63 },
  { cx: 4.8, cz: -1.4, r: 1.35, depth: 0.82 },
];
