// assets__index-BogB70q- 60 — math
// Lines 61145-61209 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function xS(e, t = oS.approach) {
  let n = (e, t) => bS(e, t, { chairApproach: !0 }),
    r = (e, t) => {
      let r = Math.ceil(Math.hypot(t.x - e.x, t.z - e.z) / 0.035);
      for (let i = 0; i <= r; i++) {
        let a = r ? i / r : 0;
        if (n(e.x + (t.x - e.x) * a, e.z + (t.z - e.z) * a) === null) return !1;
      }
      return !0;
    },
    i = [{ ...e }, { ...t }];
  for (let e = 0; e < 24; e++) {
    let t = (e * Math.PI) / 12,
      r = oS.x + Math.cos(t) * 0.68,
      a = oS.z + Math.sin(t) * 0.68,
      o = n(r, a);
    o !== null && i.push({ x: r, y: o, z: a });
  }
  let a = i.map(() => 1 / 0),
    o = [],
    s = new Set();
  for (a[0] = 0; s.size < i.length;) {
    let e = -1;
    for (let t = 0; t < i.length; t++)
      !s.has(t) && (e < 0 || a[t] < a[e]) && (e = t);
    if (e < 0 || !Number.isFinite(a[e])) return null;
    if (e === 1) {
      let e = [];
      for (let t = 1; t !== void 0; t = o[t]) e.unshift(i[t]);
      return e;
    }
    s.add(e);
    for (let t = 0; t < i.length; t++)
      if (!s.has(t) && r(i[e], i[t])) {
        let n = a[e] + Math.hypot(i[t].x - i[e].x, i[t].z - i[e].z);
        n < a[t] && ((a[t] = n), (o[t] = e));
      }
  }
  return null;
}
var SS = (e, t) => Math.atan2(Math.sin(e - t), Math.cos(e - t));
function CS(e, t, n) {
  if (e === `foot`)
    return Math.hypot(t.x - mS.shore.x, t.z - mS.shore.z) < 0.78 &&
      Math.hypot(n.x - mS.boat.x, n.z - mS.boat.z) < 0.1 &&
      Math.abs(n.speed) < 0.01
      ? `board`
      : null;
  if (e !== `boat` || Math.hypot(n.x - mS.boat.x, n.z - mS.boat.z) > 0.8)
    return null;
  if (Math.abs(n.speed) > 0.22) return `slow`;
  if (Math.abs(SS(n.heading, mS.boat.heading)) > 0.4) return `align`;
  for (let e = 0; e <= 24; e++) {
    let t = e / 24;
    if (
      !ip(
        n.x + (mS.boat.x - n.x) * t,
        n.z + (mS.boat.z - n.z) * t,
        n.heading + SS(mS.boat.heading, n.heading) * t,
      )
    )
      return `dock`;
  }
  return `leave`;
}
