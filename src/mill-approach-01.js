// mill-approach-01.js — mill approach paths for the keeper's walk
// Lines 57677-57710 of readable/assets__index-BogB70q-.pretty.js (cluster mill-approach, statement-aligned).
function hb(e, t, { arrive: n = !0 } = {}) {
  let r = t.x - e.x,
    i = t.z - e.z,
    a = Math.atan2(r, i),
    o = Math.atan2(Math.sin(a - e.heading), Math.cos(a - e.heading)),
    s = Math.hypot(r, i);
  return {
    turn: clampValue(o * 1.75, -1, 1),
    throttle:
      (n ? clampValue((s - 0.35) / 1.5, 0, 1) : 1) *
      Math.max(0.18, 1 - Math.abs(o) / 1.85),
  };
}
function gb(
  e,
  { throttle: t = 0, turn: n = 0, brake: r = !1, cruise: i = Xf },
  a,
) {
  let o = e.turnRate || 0,
    s = n * 0.85,
    c = Math.exp(-5 * a);
  e.turnRate = s + (o - s) * c;
  let l = s * a + ((o - s) * (1 - c)) / 5,
    u = e.heading + l * 0.5;
  e.heading += l;
  let d = e.speed,
    f = r ? 0 : t * i,
    p = r ? 5.5 : 1.15,
    m = Math.exp(-p * a);
  ((e.speed = f + (d - f) * m), (e.acceleration = (e.speed - d) / a));
  let h = f * a + ((d - f) * (1 - m)) / p,
    g = slideToWalkable(e.x, e.z, Math.sin(u) * h, Math.cos(u) * h, e.heading);
  return ((e.x = g.x), (e.z = g.z), g.bumped && (e.speed *= 0.86), g.bumped);
}
