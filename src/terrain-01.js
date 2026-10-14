// terrain-01.js — terrain sampling helpers (walkable height, mask texture and shoreline test)
// Lines 35527-35577 of readable/assets__index-BogB70q-.pretty.js (cluster terrain, statement-aligned).
function sampleTerrain(x, z, flatteners = [], heightAt = islandHeight) {
  let height = heightAt(x, z),
    step = 0.22,
    slopeX = (heightAt(x + step, z) - heightAt(x - step, z)) / (2 * step),
    slopeZ = (heightAt(x, z + step) - heightAt(x, z - step)) / (2 * step),
    slope = Math.hypot(slopeX, slopeZ),
    clearance = clampValue((q - height) / Math.max(0.08, slope), 0, 12),
    nx = slope > 1e-5 ? -slopeX / slope : 0,
    nz = slope > 1e-5 ? -slopeZ / slope : 0;
  for (let r of flatteners) {
    let n = (x - r.x) / r.rx,
      i = (z - r.z) / r.rz,
      a = Math.max(0, (Math.hypot(n, i) - 1) * Math.min(r.rx, r.rz));
    if (a < clearance) {
      clearance = a;
      let e = n / r.rx,
        t = i / r.rz,
        o = Math.hypot(e, t);
      ((nx = o > 1e-5 ? e / o : 0), (nz = o > 1e-5 ? t / o : 0));
    }
  }
  return [height, clearance, nx, nz];
}
function buildTerrainSamples(flatteners = [], size = 256, extent = 42) {
  let data = new Float32Array(size * size * 4);
  for (let i = 0; i < size; i++)
    for (let a = 0; a < size; a++) {
      let o = ((a / (size - 1)) * 2 - 1) * extent,
        s = ((i / (size - 1)) * 2 - 1) * extent;
      data.set(sampleTerrain(o, s, flatteners), (i * size + a) * 4);
    }
  return data;
}
function waterlineEllipse(box) {
  if (box.min.y >= 0.18 || box.max.y <= 0.18) return null;
  let midY = (box.min.y + box.max.y) * 0.5,
    halfY = (box.max.y - box.min.y) * 0.5,
    shrink = Math.sqrt(Math.max(0, 1 - ((q - midY) / halfY) ** 2)),
    rx = (box.max.x - box.min.x) * 0.5 * shrink,
    rz = (box.max.z - box.min.z) * 0.5 * shrink;
  return Math.min(rx, rz) < 0.1
    ? null
    : {
        x: (box.min.x + box.max.x) * 0.5,
        z: (box.min.z + box.max.z) * 0.5,
        rx: rx,
        rz: rz,
      };
}
var $m = { value: 0 },
  eh = { value: 0 };
