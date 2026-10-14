// birds-01.js — the birds (perch flights and wing flutter)
// Lines 56545-56617 of readable/assets__index-BogB70q-.pretty.js (cluster birds, statement-aligned).
var jy = (e) => ((e = clampValue(e, 0, 1)), e * e * e * (e * (e * 6 - 15) + 10)),
  My = (e, t, n) => e + (t - e) * n;
function Ny(e, t, n, r) {
  let i = jy(n),
    a = Math.sin(Math.PI * i);
  return {
    x: My(e.x, t.x, i) + r * a,
    z: My(e.z, t.z, i) - r * 0.65 * a,
    y: My(e.y, t.y, i) + a * 0.26,
  };
}
function Py(e, t, n = e.perch) {
  let r = (((t + e.phase) % e.period) / e.period) * 32,
    i = n.x,
    a = n.z,
    o = Math.max(1, Math.hypot(i, a)),
    s = -i / o,
    c = -a / o,
    l = { x: i + s * 0.65, y: n.y + 0.65, z: a + c * 0.65 },
    u = { x: i + s * 4, y: q + 1.1 + e.lift, z: a + c * 4 },
    d = {
      x: i + s * 5.8 - c * 1.1,
      y: q + 0.72 + e.lift,
      z: a + c * 5.8 + s * 1.1,
    },
    f,
    p = !1,
    m = !1;
  if (
    (r < 4 || r >= 29
      ? ((f = { ...n }), (p = !0))
      : r < 6
        ? (f = Ny(n, l, (r - 4) / 2, 0.1))
        : r < 11
          ? ((f = { ...l }), (m = !0))
          : r < 14
            ? (f = Ny(l, u, (r - 11) / 3, 0.62))
            : r < 19
              ? (f = Ny(u, d, (r - 14) / 5, -0.52))
              : r < 22
                ? ((f = { ...d }), (m = !0))
                : (f =
                    r < 26
                      ? Ny(d, l, (r - 22) / 4, 0.8)
                      : Ny(l, n, (r - 26) / 3, -0.1)),
    m)
  ) {
    let n = r < 11 ? (r - 6) / 5 : (r - 19) / 3,
      i = Math.sin(Math.PI * n) ** 2;
    ((f.x += Math.sin(t * 2.3 + e.phase) * 0.055 * i),
      (f.z += Math.cos(t * 1.7 + e.phase) * 0.07 * i),
      (f.y += Math.sin(t * 3.1 + e.phase) * 0.045 * i));
  }
  return (
    p || (f.y = Math.max(islandHeight(f.x, f.z) + 0.35, q + 0.35, f.y)),
    { ...f, perched: p, hover: m, phase: r }
  );
}
function Fy(e, t, n = e.perch) {
  let r = Py(e, t, n),
    i = Py(e, t - 0.025, n),
    a = Py(e, t + 0.025, n),
    o = a.x - i.x,
    s = a.z - i.z,
    c = a.y - i.y,
    l = Math.hypot(o, s) / 0.05;
  return {
    ...r,
    speed: l,
    heading: l > 0.12 ? Math.atan2(-s, o) : Math.atan2(n.z, -n.x),
    pitch: clampValue(Math.atan2(c, Math.max(0.018, Math.hypot(o, s))), -0.24, 0.24),
  };
}
