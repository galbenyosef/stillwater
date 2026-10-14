// shores-01.js — the shore dressing: reeds, the pond-side scatter and the falling-birch-leaf system
// Lines 56618-56956 of readable/assets__index-BogB70q-.pretty.js (cluster shores, statement-aligned).
function buildReeds(e, t, n) {
  let r = worldData.placements.filter((e) => e.asset === `reeds`),
    i = [5, 9, 10, 15, 3, 8, 11],
    a = new Nn(),
    o = new Nn(),
    s = new W(),
    c = new U();
  (n.updateMatrixWorld(!0), t.updateMatrixWorld(!0));
  let l,
    u,
    d = -1 / 0;
  n.traverse((e) => {
    if (!e.isMesh) return;
    let t = e.geometry.attributes.position;
    for (let n = 0; n < t.count; n++)
      (c.fromBufferAttribute(t, n).applyMatrix4(e.matrixWorld),
        c.y > d &&
          ((d = c.y), (l = new U().fromBufferAttribute(t, n)), (u = e)));
  });
  let f = i.map((e, t) => {
      let n = r[e];
      return (
        a.position.set(n.x, n.y, n.z),
        a.rotation.set(0, n.angle, 0),
        a.scale.setScalar(n.s),
        a.updateMatrix(),
        {
          matrix: a.matrix.clone().multiply(u.matrixWorld),
          phase: t * 5.47,
          period: 34 + t * 0.71,
          lift: (t % 3) * 0.12,
          scale: 0.91 + (t % 3) * 0.07,
          heading: 0,
        }
      );
    }),
    p = new Map();
  for (let n of [
    `DragonflyBody`,
    `DragonflyForeLeft`,
    `DragonflyForeRight`,
    `DragonflyHindLeft`,
    `DragonflyHindRight`,
  ]) {
    let r = t.getObjectByName(n);
    if (!r?.isMesh) throw Error(`Missing Blender wildlife part: ${n}`);
    let i = r.geometry.clone().applyMatrix4(r.matrixWorld),
      a = r.material.clone();
    ((a.side = 2),
      n !== `DragonflyBody` &&
        ((a.transparent = !0),
        (a.opacity = 0.56),
        (a.depthWrite = !1),
        (a.roughness = 0.26)));
    let o = new Wi(i, a, f.length);
    ((o.name = n + ` wildlife`),
      o.instanceMatrix.setUsage(Xe),
      (o.frustumCulled = !1),
      (o.castShadow = n === `DragonflyBody`),
      (o.receiveShadow = !0),
      (o.userData.aboveWater = !0),
      e.add(o),
      p.set(n, o));
  }
  return {
    count: f.length,
    update(e, t) {
      for (let n = 0; n < f.length; n++) {
        let r = f[n],
          i = Math.max(0, l.y),
          u = r.matrix.elements[12] * 0.6 + r.matrix.elements[14] * 0.5;
        (c.copy(l),
          (c.x +=
            Math.sin(e * 0.75 + u + i * 1.3) * Math.min(i * i * 0.006, 0.11)),
          (c.z += Math.cos(e * 0.63 + u + i) * Math.min(i * i * 0.003, 0.08)),
          c.applyMatrix4(r.matrix));
        let d = Fy(r, e, { x: c.x, y: c.y + 0.061 * r.scale, z: c.z }),
          m = Math.atan2(
            Math.sin(d.heading - r.heading),
            Math.cos(d.heading - r.heading),
          );
        ((r.heading += m * (1 - Math.exp(-t * 9))),
          a.position.set(d.x, d.y, d.z),
          a.rotation.set(
            d.perched ? 0 : Math.max(-0.3, Math.min(0.3, m * 0.24)),
            r.heading,
            d.pitch,
            `YXZ`,
          ),
          a.scale.setScalar(r.scale),
          a.updateMatrix(),
          p.get(`DragonflyBody`).setMatrixAt(n, a.matrix));
        for (let t of [`Fore`, `Hind`])
          for (let i of [-1, 1]) {
            let c = i < 0 ? `Left` : `Right`,
              l = d.perched ? 0.018 : 1,
              u = Math.sin(
                e * (t === `Fore` ? 72 : 74) +
                  r.phase +
                  (t === `Hind` ? 1.35 : 0),
              );
            (o.position.set(t === `Fore` ? 0.012 : -0.031, 0.008, i * 0.012),
              o.rotation.set(
                i * (0.12 + u * 0.62 * l),
                t === `Fore` ? -0.03 : 0.06,
                0,
              ),
              o.scale.setScalar(1),
              o.updateMatrix(),
              p
                .get(`Dragonfly` + t + c)
                .setMatrixAt(n, s.multiplyMatrices(a.matrix, o.matrix)));
          }
      }
      for (let e of p.values()) e.instanceMatrix.needsUpdate = !0;
    },
  };
}
var Ly = 11.2,
  Ry = Object.freeze({ before: 1.2, light: 4.4, shade: 9, landed: 12 }),
  zy = 17.2,
  By = (e, t, n) => {
    let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
    return r * r * (3 - 2 * r);
  };
function Vy({
  reducedMotion: e = !1,
  random: t = createRandom(91827),
  ground: n = islandHeight,
} = {}) {
  let r = {
      visible: !1,
      age: 0,
      x: 0,
      y: 0,
      z: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      settled: 0,
      opacity: 0,
      light: 0,
    },
    i = null,
    a = 18,
    o = 0,
    s = null;
  function c(t) {
    if (((r.age = t), (r.visible = !e && t >= 0 && t < zy), !r.visible))
      return ((r.opacity = r.light = 0), r);
    let i = Math.min(t, Ly),
      a = i / Ly,
      s = Math.sin(Math.PI * a);
    ((r.x =
      -22.6 +
      6.75 * a -
      1.8 * a * a +
      s * (0.65 + 0.18 * Math.sin(i * 1.8 + o) + o * 0.12)),
      (r.z = 0.1 - 5.3 * a + s * 0.14 * Math.sin(i * 1.3 + o)));
    let c = n(r.x, r.z) + 0.045;
    return (
      (r.y = Math.max(c, 6.5 + (n(-17.65, -5.2) + 0.045 - 6.5) * a)),
      (r.settled = By(10.399999999999999, Ly, t)),
      (r.pitch = (0.4 + 0.65 * Math.sin(i * 1.8 + o)) * (1 - r.settled)),
      (r.yaw = 0.6 + i * 0.85 + o),
      (r.roll = 0.5 * Math.sin(i * 1.3 + 0.5 + o) * (1 - r.settled)),
      (r.opacity = By(0, 0.7, t) * (1 - By(14.2, zy, t))),
      (r.light = By(0.16, 0.85, shaftLightField(r.x, r.y, r.z)) * (1 - r.settled)),
      r
    );
  }
  return {
    state: r,
    update(n) {
      if (e) return c(-1);
      if (s !== null) return c(s);
      if (((n = Math.max(0, n)), i === null)) {
        if (((a -= n), a > 0)) return c(-1);
        ((i = Math.min(-a, zy)), (o = (t() - 0.5) * 0.8));
      } else i += n;
      return i >= zy ? ((i = null), (a = 36 + t() * 26), c(-1)) : c(i);
    },
    preview(t) {
      return e
        ? c(-1)
        : t === `live`
          ? ((s = null), c(i ?? -1))
          : ((o = 0),
            t === `play`
              ? ((s = null), (i = 0), c(0))
              : ((s = Ry[t] ?? -1), c(s)));
    },
  };
}
function buildFallingLeaves(e, t, { reducedMotion: n = !1 } = {}) {
  let r;
  if (
    (t?.traverse((e) => {
      !r && e.isMesh && (r = e);
    }),
    !r)
  )
    return { update() {}, preview() {} };
  let i = r.geometry.clone();
  (i.center(), i.computeBoundingBox());
  let a = i.boundingBox.getSize(new U());
  i.scale(
    0.19 / Math.max(a.x, a.z),
    0.19 / Math.max(a.x, a.z),
    0.19 / Math.max(a.x, a.z),
  );
  let o = r.material.clone(),
    s = r.material.onBeforeCompile;
  ((o.name = `Occasional sunlit birch leaf`),
    o.color.setRGB(1.38, 0.84, 0.3),
    (o.roughness = 0.86),
    (o.transparent = !0),
    (o.depthWrite = !0));
  let c = { value: 0 };
  ((o.onBeforeCompile = (e, t) => {
    (s(e, t),
      (e.uniforms.uLeafSunlight = c),
      (e.fragmentShader =
        `uniform float uLeafSunlight;
` + e.fragmentShader),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <lights_fragment_end>`,
        `#include <lights_fragment_end>
      reflectedLight.directDiffuse+=diffuseColor.rgb*vec3(2.8,1.8,.48)*uLeafSunlight*getShadowMask();`,
      )));
  }),
    (o.customProgramCacheKey = () => `sunlit-birch-leaf-v1`));
  let l = new vi(i, o);
  ((l.name = `Occasional falling birch leaf`),
    (l.receiveShadow = !0),
    (l.visible = !1),
    (l.userData.aboveWater = !0),
    (l.userData.skipAO = !0),
    e.add(l));
  let u = Vy({ reducedMotion: n }),
    d = new U(0, 1, 0),
    f = new U(),
    p = new H(),
    m = new H();
  function h(e) {
    ((l.visible = e.visible),
      e.visible &&
        (l.position.set(e.x, e.y, e.z),
        l.rotation.set(e.pitch, e.yaw, e.roll, `YXZ`),
        e.settled > 0 &&
          (f
            .set(
              islandHeight(e.x - 0.05, e.z) - islandHeight(e.x + 0.05, e.z),
              0.1,
              islandHeight(e.x, e.z - 0.05) - islandHeight(e.x, e.z + 0.05),
            )
            .normalize(),
          p.setFromUnitVectors(d, f).multiply(m.setFromAxisAngle(d, e.yaw)),
          l.quaternion.slerp(p, e.settled)),
        (o.opacity = e.opacity),
        (c.value = e.light)));
  }
  return {
    update(e) {
      h(u.update(e));
    },
    preview(e) {
      h(u.preview(e));
    },
  };
}
function buildPondLife(e, t, n, r, i = null) {
  let a = createRandom(123),
    o = new Nn(),
    s = buildFishSchool(e, a, r.pondlife, { reducedMotion: t }),
    c = buildReeds(e, r.pondlife, r.reeds),
    l = buildMillSpill(e, n, r.springwater, i),
    u = buildFallingLeaves(e, r.leafLitter, { reducedMotion: t }),
    d = [],
    f = new xa(0.07, 5);
  (f.rotateX(-Math.PI / 2), f.scale(0.55, 1, 1.5));
  let p = new rs({ color: `#bd9a46`, roughness: 1, side: 2 });
  for (let e = 0; e < 96; e++) a();
  for (let e = 0; e < 30; e++) {
    let e = a() * 18 - 9,
      t = a() * 14 - 4;
    islandHeight(e, t) > -0.2 || d.push({ x: e, z: t, angle: a() * 6.28, p: a() * 6.28 });
  }
  let m = new Wi(f, p, d.length);
  return (
    (m.renderOrder = 4),
    (m.userData.aboveWater = !0),
    (m.frustumCulled = !1),
    e.add(m),
    {
      counts: { fish: s.count, dragonflies: c.count },
      surfaceRipples: s.ripples,
      previewFish: s.preview,
      previewLeaf: u.preview,
      get fishActivity() {
        let e = s.school.activity.active;
        return e ? `${e.kind}: ${s.school.states[e.index].activity}` : `quiet`;
      },
      get fishPreviewMoment() {
        let e = s.school.activity.active;
        if (!e) return ``;
        let t = s.school.time - e.born;
        return e.kind === `feed` && t >= e.feeding && t < e.feeding + 0.2
          ? `feed`
          : e.kind === `jump` && t >= e.landing + 0.08 && t < e.landing + 0.3
            ? `splash`
            : e.kind === `jump` &&
                t >= e.takeoff + e.flight * 0.5 &&
                t < e.landing
              ? `apex`
              : ``;
      },
      update(e, n, r, i) {
        (l.update(e, i),
          u.update(n),
          s.update(e, n * (t ? 0.35 : 1), r),
          c.update(t ? e * 0.25 : e, n));
        for (let t = 0; t < d.length; t++) {
          let n = d[t];
          (o.position.set(
            n.x + Math.sin(e * 0.025 + n.p) * 0.25,
            q + 0.015,
            n.z + Math.cos(e * 0.018 + n.p) * 0.3,
          ),
            o.rotation.set(0, n.angle + e * 0.025, 0),
            o.scale.setScalar(1),
            o.updateMatrix(),
            m.setMatrixAt(t, o.matrix));
        }
        m.instanceMatrix.needsUpdate = !0;
      },
    }
  );
}
