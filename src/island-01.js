// island-01.js — the island: height field, shore outline polygon and the shape helpers
// Lines 30184-30309 of readable/assets__index-BogB70q-.pretty.js (cluster island, statement-aligned).
function islandHeight(x, z) {
  let bearing = Math.atan2((z - 0.4) / 16.4, x / 17.8),
    radius =
      Math.hypot(x / 17.8, (z - 0.4) / 16.4) +
      0.035 * Math.sin(bearing * 5 + 0.6) +
      0.022 * Math.cos(bearing * 9),
    plateau = -2.3 + smoothStep(0.77, 1.1, radius) * 4.1,
    millPad =
      0.64 -
      smoothStep(
        0.86,
        1.4,
        Math.max(Math.abs((x + 3) / 4.3), Math.abs((z + 4.2) / 3.65)),
      ) *
        3.15,
    hollow =
      0.51 - smoothStep(0.42, 1.1, Math.hypot((x + 3) / 2.7, (z + 0.35) / 1.35)) * 2.8,
    mound = 2.8 * Math.exp(-(((x - 1.16) / 0.95) ** 2) - ((z + 4.2) / 2.9) ** 2),
    height = Math.max(plateau, Math.max(millPad, hollow) - mound);
  ((height +=
    smoothStep(0.96, 1.32, radius) *
    (1.2 + 0.7 * Math.sin(x * 0.31 + z * 0.13) * Math.cos(z * 0.27))),
    (height +=
      0.09 * Math.sin(x * 0.91 + z * 0.7) * Math.cos(z * 0.71) +
      0.055 * Math.sin(x * 0.55 - z * 0.94)),
    (height += 0.24 * Math.exp(-(((x + 5) / 6) ** 2) - ((z - 10) / 3.5) ** 2)));
  let chute =
    smoothStep(-4.95, -4.65, x) *
    (1 - smoothStep(-1.35, -1.05, x)) *
    smoothStep(-0.2, 0.32, z) *
    (1 - smoothStep(5.2, 5.6, z));
  return height * (1 - chute) + Math.min(height, -1.2) * chute;
}
var shoreOutline = [
    [-7, 8],
    [0, 10],
    [7, 8],
    [10, 2],
    [8, -6],
    [2, -12],
    [-6, -12],
    [-11, -6],
    [-11, 2],
    [-7, 8],
  ],
  staticObstacles = [
    sluiceSpec.obstacle,
    { x: -3, z: 2.65, hx: 1.79, hz: 2.57, kind: `dock` },
    { x: 1.16, z: -4.2, hx: 0.85, hz: 2.05, kind: `wheel` },
    ...millMachineryOrigins.footings.map((e) => ({
      x: millMachineryOrigins.origin.x + e.x,
      z: millMachineryOrigins.origin.z - e.y,
      hx: e.width / 2,
      hz: e.depth / 2,
      kind: `mill apron`,
    })),
    ...[-1, 1].flatMap((e) =>
      [-1, 1].map((t) => ({
        x: -11.65 + e * 4.85 * 0.86,
        z: -6.45 + t * 0.62 * 1.15,
        hx: 0.18,
        hz: 0.21,
        kind: `bridge support`,
      })),
    ),
  ],
  dynamicObstacles = [],
  setDynamicObstacles = (e) => {
    dynamicObstacles = e;
  };
function shoreDistance(x, z) {
  let best = 1 / 0;
  for (let r = 0; r < shoreOutline.length - 1; r++) {
    let [i, a] = shoreOutline[r],
      [o, s] = shoreOutline[r + 1],
      c = o - i,
      l = s - a,
      u = clampValue(((x - i) * c + (z - a) * l) / (c * c + l * l), 0, 1);
    best = Math.min(best, Math.hypot(x - i - u * c, z - a - u * l));
  }
  return best;
}
function insideIsland(x, z, margin = 0.78, bodyMargin = 0.44) {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(z) ||
    Math.abs(x) > 42 ||
    Math.abs(z) > 42
  )
    return !1;
  for (let [i, a] of [
    [0, 0],
    [margin, 0],
    [-margin, 0],
    [0, margin],
    [0, -margin],
  ])
    if (islandHeight(x + i, z + a) > 0.18 - bodyMargin) return !1;
  return (
    !staticObstacles.some(
      (r) => Math.abs(x - r.x) < r.hx + margin && Math.abs(z - r.z) < r.hz + margin,
    ) && !dynamicObstacles.some((r) => Math.hypot(x - r.x, z - r.z) < r.r + margin)
  );
}
function walkableFacing(x, z, facing) {
  let sinFacing = Math.sin(facing),
    cosFacing = Math.cos(facing);
  return (
    insideIsland(x, z, 0.7) &&
    insideIsland(x + sinFacing * 1.32, z + cosFacing * 1.32, 0.32) &&
    insideIsland(x - sinFacing * 2.15, z - cosFacing * 2.15, 0.32, 0.82)
  );
}
function slideToWalkable(x, z, dx, dz, facing) {
  let walkableAt = (e, t) => (Number.isFinite(facing) ? walkableFacing(e, t, facing) : insideIsland(e, t)),
    steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.18)),
    bumped = !1;
  for (let i = 0; i < steps; i++) {
    let i = dx / steps,
      c = dz / steps;
    walkableAt(x + i, z + c)
      ? ((x += i), (z += c))
      : ((bumped = !0), walkableAt(x + i, z) && (x += i), walkableAt(x, z + c) && (z += c));
  }
  return { x: x, z: z, bumped: bumped };
}
