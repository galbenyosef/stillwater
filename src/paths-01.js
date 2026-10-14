// paths-01.js — path helpers (distance-along-path, corridor tests, the landing walkway)
// Lines 48594-48636 of readable/assets__index-BogB70q-.pretty.js (cluster paths, statement-aligned).
function distanceToPath(e, t) {
  let n = 1 / 0;
  for (let r = 1; r < shorePath.points.length; r++) {
    let [i, a] = shorePath.points[r - 1],
      [o, s] = shorePath.points[r],
      c = o - i,
      l = s - a,
      u = Math.max(
        0,
        Math.min(1, ((e - i) * c + (t - a) * l) / (c * c + l * l)),
      );
    n = Math.min(n, Math.hypot(e - i - u * c, t - a - u * l));
  }
  return n;
}
function onPath(e, t) {
  return (
    distanceToPath(e, t) < shorePath.width / 2 ||
    Math.hypot(e - benchApproach.x, t - benchApproach.z) < benchArea.clearingRadius
  );
}
function insideBenchArea(e, t, n = 0.24) {
  return (
    Math.hypot(
      Math.max(0, Math.abs(e - benchArea.x) - benchArea.depth / 2),
      Math.max(0, Math.abs(t - benchArea.z) - benchArea.width / 2),
    ) < n
  );
}
function interiorFloorHeight(e, t) {
  if (e >= -7.27 && e <= -6.3 && t >= -7.28 && t <= -5.22) return 1.942;
  let n = (e - bridgePlacement.x) / bridgePlacement.s[0];
  if (Math.abs(n) <= 5.2375 && Math.abs(t - bridgePlacement.z) <= 0.74 * bridgePlacement.s[2]) {
    let e = -5.1 + Math.max(0, Math.min(34, Math.round((n + 5.1) / 0.3))) * 0.3;
    return bridgePlacement.y + 1.725 + 0.95 * (1 - (e / 5.2) ** 2);
  }
  let r = Th;
  return e >= r.x0 && e <= r.x1 && Math.abs(t - r.z) <= r.width / 2
    ? r.y
    : Math.hypot(e - wh.x, t - wh.z) <= wh.radius || onPath(e, t)
      ? islandHeight(e, t)
      : null;
}
