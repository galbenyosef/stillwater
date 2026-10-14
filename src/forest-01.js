// forest-01.js — forest assembly: bounds/chunks, the woodland scatter, distant hills and ridges
// Lines 51195-51386 of readable/assets__index-BogB70q-.pretty.js (cluster forest, statement-aligned).
function a_(e) {
  e.traverse((e) => {
    (e.updateMatrix(), (e.matrixAutoUpdate = !1));
  });
}
function o_(e, t) {
  e.updateWorldMatrix(!0, !0);
  let n = new ir();
  e.traverse((e) => {
    e.isMesh &&
      !e.userData.skipAO &&
      (e.isInstancedMesh
        ? (e.computeBoundingBox(), n.copy(e.boundingBox))
        : (e.geometry.computeBoundingBox(), n.copy(e.geometry.boundingBox)),
      n.applyMatrix4(e.matrixWorld),
      (e.userData.aboveWater = n.min.y > t + 0.035),
      (e.userData.belowWater = n.max.y < t - 0.035));
  });
}
function s_(e, t) {
  let n = Math.max(Math.abs(e), Math.abs(t)),
    r =
      5 +
      3 * Math.sin(e * 0.039 + t * 0.023) +
      2 * Math.cos(t * 0.047 - e * 0.017),
    i =
      5 * Math.abs(Math.sin(e * 0.024 + t * 0.013)) +
      3 * Math.abs(Math.sin(t * 0.031 - e * 0.017)),
    a =
      (Math.sin(e * 0.13 + Math.sin(t * 0.09) * 2) +
        Math.cos(t * 0.15 - e * 0.04)) *
      0.8;
  return islandHeight(e, t) + smoothStep(42, 90, n) * (r + i + a);
}
function c_() {
  let e = createRandom(821926),
    t = [];
  for (let n = 0; n < 36; n++) {
    let r = ((n + e() * 0.65) / 36) * Math.PI * 2,
      i = 29 + e() * 16,
      a = Math.cos(r) * i,
      o = Math.sin(r) * i;
    t.push({
      asset: n % 3 == 0 ? `tree1_lod` : `tree2_lod`,
      x: a,
      y: s_(a, o),
      z: o,
      s: 1.2 + e() * 0.65,
      angle: e() * Math.PI * 2,
      tint: 0.64 + e() * 0.2,
    });
  }
  return t;
}
function l_(e, t) {
  let n = Math.floor(e),
    r = Math.floor(t),
    i = smoothStep(0, 1, e - n),
    a = smoothStep(0, 1, t - r),
    o = (e, t) => {
      let n = Math.sin(e * 127.1 + t * 311.7 + 82.9) * 43758.5453;
      return n - Math.floor(n);
    },
    s = o(n, r) * (1 - i) + o(n + 1, r) * i,
    c = o(n, r + 1) * (1 - i) + o(n + 1, r + 1) * i;
  return s * (1 - a) + c * a;
}
function u_(e, t) {
  let n = l_(e * 0.018, t * 0.018) * 18;
  return smoothStep(
    0.3,
    0.64,
    l_((e + n) * 0.028, (t - n) * 0.028) * 0.72 +
      l_(e * 0.075, t * 0.075) * 0.28,
  );
}
function d_() {
  let e = createRandom(280926),
    t = [],
    n = 4.8;
  for (let r = -185; r <= 185; r += n)
    for (let i = -185; i <= 185; i += n) {
      let a = i + (e() - 0.5) * n * 0.9,
        o = r + (e() - 0.5) * n * 0.9,
        s = Math.max(Math.abs(a), Math.abs(o)),
        c = Math.hypot(a, o),
        l = u_(a, o),
        u = smoothStep(30, 43, s);
      if (c < 37 || c > 190 || e() > l * 0.9 * u) continue;
      let d = l_(a * 0.041 + 31, o * 0.041 - 18) > 0.63,
        f = (0.78 + e() * 0.58) * (0.7 + 0.3 * smoothStep(35, 78, c));
      t.push({
        asset: d ? `birch` : `alder`,
        x: a,
        y: s_(a, o) - 0.1,
        z: o,
        s: [f * (0.83 + e() * 0.25), f, f],
        angle: e() * Math.PI * 2,
        tint: 0.73 + e() * 0.27,
      });
    }
  return t;
}
function buildDistantHills(e, t) {
  let n = new Pn();
  ((n.name = `Wooded hills beyond the pond`), e.add(n));
  let r = new Wo(420, 420, 120, 120);
  r.rotateX(-Math.PI / 2);
  let i = r.attributes.position,
    a = r.attributes.uv,
    o = new Float32Array(i.count * 3),
    s = new G(`#8b965d`),
    c = new G(`#3e6049`),
    l = new G(`#98998b`),
    u = new G(),
    d = new G(`#64764d`),
    f = new G(`#425d41`),
    p = new G();
  for (let e = 0; e < i.count; e++) {
    let t = i.getX(e),
      n = i.getZ(e),
      r = s_(t, n),
      m = 0.85 * (1 - smoothStep(38.5, 45.5, Math.max(Math.abs(t), Math.abs(n))));
    (i.setY(e, r - m), a.setXY(e, t * 0.13, n * 0.13));
    let h = Math.hypot(s_(t + 0.5, n) - r, s_(t, n + 0.5) - r) * 2,
      g =
        0.5 +
        0.5 * Math.sin(t * 0.08 + Math.sin(n * 0.065) * 2) * Math.cos(n * 0.07);
    p.copy(f).lerp(d, g * 0.75);
    let _ = u_(t, n),
      v = l_(t * 0.16, n * 0.16);
    (u
      .copy(s)
      .lerp(c, _ * 0.91)
      .multiplyScalar(0.86 + v * 0.24),
      u.lerp(l, smoothStep(16, 38, r) * smoothStep(0.1, 0.8, h) * 0.45),
      u.copy(p.lerp(u, smoothStep(42, 62, Math.max(Math.abs(t), Math.abs(n))))),
      u.toArray(o, e * 3));
  }
  let m = [];
  for (let e = 0; e < 120; e++)
    for (let t = 0; t < 120; t++) {
      let n = -210 + (t + 0.5) * 3.5,
        r = -210 + (e + 0.5) * 3.5;
      if (Math.abs(n) < 38.5 && Math.abs(r) < 38.5) continue;
      let i = e * 121 + t,
        a = i + 121;
      m.push(i, a, i + 1, a, a + 1, i + 1);
    }
  (r.setIndex(m),
    r.setAttribute(`color`, new Ar(o, 3)),
    r.computeVertexNormals());
  let h = null;
  t.terrain?.traverse((e) => {
    if (e.isMesh) {
      let t = Array.isArray(e.material) ? e.material : [e.material];
      h ??= t.find((e) => e.name === `Island | woodland floor`)?.map;
    }
  });
  let g = new vi(
    r,
    new rs({ vertexColors: !0, map: h, roughness: 1, envMapIntensity: 0.7 }),
  );
  ((g.name = `Distant wooded ridges`), (g.userData.skipAO = !0), n.add(g));
  let _ = c_();
  for (let e of [`tree1_lod`, `tree2_lod`])
    t[e] &&
      populateWorld(
        n,
        t[e],
        _.filter((t) => t.asset === e),
        { wind: !0, cast: !1, receive: !1, waterClass: `above` },
      );
  let v = 0,
    y = d_();
  for (let e of [`alder`, `birch`])
    if (t.distantWoodland?.[e]) {
      let r = y.filter((t) => t.asset === e),
        i = populateWorld(n, t.distantWoodland[e], r, {
          cast: !1,
          receive: !1,
          cellSize: 40,
          waterClass: `above`,
        });
      ((i.name = `Distant ${e} woods`),
        i.traverse((e) => {
          e.isMesh && (e.userData.skipAO = !0);
        }),
        (v += r.length));
    }
  return ((n.userData.aboveWater = !0), { root: n, treeCount: _.length + v });
}
