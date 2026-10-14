// assets__index-BogB70q- 44 — math
// Lines 56198-56546 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Cy(e) {
  return Sy.flatMap((t, n) =>
    Array.from({ length: 9 }, (r, i) => {
      let a = i === 8 && n % 4 != 3,
        o = a && n % 2 == 0,
        s = o
          ? `bronze`
          : [`silver`, `olive`, `bronze`][(n + +(e() > 0.76)) % 3],
        c =
          s === `bronze`
            ? [0.98, 1.08, 1.12]
            : s === `silver`
              ? [1.09, 0.88, 0.88]
              : [1, 0.98, 1],
        l = o
          ? 0.91 + e() * 0.12
          : i % 4 == 0
            ? 0.32 + e() * 0.15
            : 0.48 + e() * 0.25;
      return {
        ...t,
        school: n,
        rank: i,
        solitary: a,
        variety: s,
        shape: c,
        scale: l,
        phase: n * 1.71 + (a ? e() * Math.PI * 2 : 0),
        speed: (0.17 + (n % 4) * 0.012) * (a ? 0.76 : 1),
        offset: ((i % 3) - 1) * 0.5 + (e() - 0.5) * 0.24,
        lag: Math.floor(i / 3) * 4.5 + e() * 0.85,
        depth: t.depth + (i % 3) * 0.085 + (o ? 0.16 : 0),
        stroke: e() * Math.PI * 2,
        amplitude: 0.022 + e() * 0.009,
        pace: 0.88 + e() * 0.22,
      };
    }),
  );
}
var wy = (e) => Math.max(0.25, 0.41 * (e.scale || 0.6) + 0.025);
function Ty(e, t) {
  if (e.school !== void 0) {
    let n = t - e.lag,
      r = n * e.speed + e.phase + 0.32 * Math.sin(n * 0.21 + e.phase),
      i = 1 + 0.17 * Math.sin(t * 0.13 + e.school),
      a = e.r * (e.solitary ? 1.25 : 1),
      o =
        e.cx +
        Math.cos(r) * a +
        0.22 * Math.sin(r * 2.1 + e.phase) +
        e.offset * i * Math.cos(r),
      s =
        e.cz +
        Math.sin(r) * a * 0.78 +
        0.18 * Math.sin(r * 2.7 - e.phase) +
        e.offset * i * Math.sin(r);
    e.solitary &&
      ((o += Math.sin(t * 0.071 + e.stroke) * 0.62),
      (s += Math.cos(t * 0.093 + e.stroke) * 0.48));
    let c = wy(e);
    for (let t = 0; t < 5 && Y(o, s) > 0.18 - c * 2 - 0.12; t++)
      ((o += (e.cx - o) * 0.3), (s += (e.cz - s) * 0.3));
    let l = Math.min(
      q - c,
      Math.max(
        Y(o, s) + c + 0.04,
        q - e.depth + Math.sin(t * 0.23 + e.stroke) * 0.09,
      ),
    );
    return { x: o, y: l, z: s };
  }
  let n = t * e.speed + e.phase + 0.2 * Math.sin(t * 0.43 + e.phase),
    r = e.cx + Math.cos(n) * e.r + 0.16 * Math.sin(n * 2.1 + e.phase),
    i = e.cz + Math.sin(n) * e.r * 0.78 + 0.12 * Math.sin(n * 2.7 - e.phase);
  return {
    x: r,
    y: Math.min(
      q - 0.29,
      Math.max(Y(r, i) + 0.32, -0.93 + Math.sin(t * 0.21 + e.phase) * 0.21),
    ),
    z: i,
  };
}
function Ey(e, t) {
  let n = Ty(e, t),
    r = Ty(e, t - 0.05),
    i = Ty(e, t + 0.05),
    a = i.x - r.x,
    o = i.z - r.z,
    s = i.y - r.y;
  return {
    ...n,
    heading: Math.atan2(-o, a),
    pitch: Math.atan2(s, Math.hypot(a, o)),
    speed: Math.hypot(a, o) * 10,
  };
}
function Dy(e, t = {}) {
  let n = e.map((e) => {
      let t = Ey(e, 0);
      return {
        ...t,
        pitch: J(t.pitch, -0.18, 0.18),
        tailPhase: e.stroke || 0,
        roll: 0,
        effort: 0.7,
      };
    }),
    r = xy(e, t),
    i = new Float64Array(e.length),
    a = new Float64Array(e.length),
    o = 0,
    s = 0;
  function c(t, s) {
    o += t;
    for (let e = 0; e < n.length; e++) ((i[e] = n[e].x), (a[e] = n[e].z));
    let c = r.advance(o, t, n, s);
    for (let r = 0; r < e.length; r++) {
      if (r === c) continue;
      let l = e[r],
        u = n[r],
        d = Ty(l, o + 0.8),
        f = d.x - u.x,
        p = d.z - u.z,
        m = Math.hypot(f, p),
        h = u.x - (s?.x ?? 1e3),
        g = u.z - (s?.z ?? 1e3),
        _ = Math.hypot(h, g),
        v = (1 - Zf(0.75, 2.6, _)) * J(Math.abs(s?.speed || 0) / 0.7, 0, 1);
      ((f = f / Math.max(m, 0.01) + (h / Math.max(_, 0.1)) * v * 3.2),
        (p = p / Math.max(m, 0.01) + (g / Math.max(_, 0.1)) * v * 3.2));
      let y = l.school * 9;
      for (let t = y; t < Math.min(y + 9, e.length); t++) {
        if (r === t) continue;
        let n = u.x - i[t],
          o = u.z - a[t],
          s = Math.hypot(n, o),
          c = 0.23 + (l.scale + e[t].scale) * 0.22;
        if (s > 1e-5 && s < c) {
          let e = (1 - s / c) ** 2 * 1.8;
          ((f += (n / s) * e), (p += (o / s) * e));
        }
      }
      let b = Math.atan2(-p, f),
        x = J(
          Math.atan2(Math.sin(b - u.heading), Math.cos(b - u.heading)) * 2.9,
          -2.1,
          2.1,
        );
      ((u.heading += x * t),
        (u.roll +=
          (J(x * 0.1, -0.14, 0.14) - u.roll) * (1 - Math.exp(-t * 5))));
      let S =
        v > 0.1 ? 1 : 0.3 + 0.7 * Zf(-0.6, 0.75, Math.sin(o * 0.87 + l.stroke));
      u.effort += (S - u.effort) * (1 - Math.exp(-t * 3));
      let C =
        J(m * 0.65, 0.085, 0.36) * (l.pace || 1) * (0.83 + u.effort * 0.17) +
        v * 0.72;
      u.speed += (C - u.speed) * (1 - Math.exp(-t * (v > 0.1 ? 4.5 : 1.8)));
      let w = u.x + Math.cos(u.heading) * u.speed * t,
        T = u.z - Math.sin(u.heading) * u.speed * t,
        E = wy(l);
      Y(w, T) < 0.18 - E * 2 - 0.08
        ? ((u.x = w), (u.z = T))
        : ((u.heading += 1.5 * t), (u.speed *= 0.96));
      let D =
        (Math.max(Y(u.x, u.z) + E + 0.04, Math.min(q - E, d.y - v * 0.18)) -
          u.y) *
        (1 - Math.exp(-t * 2));
      ((u.y += D),
        (u.y = J(u.y, Y(u.x, u.z) + E, q - E)),
        (u.pitch +=
          (J(Math.atan2(D / t, Math.max(0.08, u.speed)), -0.18, 0.18) -
            u.pitch) *
          (1 - Math.exp(-t * 4))),
        (u.tailPhase += t * (3.8 + u.speed * 10.5) * (0.74 + u.effort * 0.26)));
    }
  }
  return {
    states: n,
    activity: r,
    get time() {
      return o;
    },
    events: r.events,
    update(e, t) {
      for (
        r.beginFrame(), s += Math.min(0.1, Math.max(0, e));
        s + 1e-9 >= 1 / 120;
      )
        (c(1 / 120, t), (s -= 1 / 120));
      return n;
    },
  };
}
var Oy = `
  float tailWeight=clamp((.22-position.x)/.64,0.,1.5);
  float stroke=uFishTime*aSwim.z+aSwim.x+position.x*5.;
  float bend=sin(stroke)*tailWeight*tailWeight*aSwim.y;
  transformed.z+=bend;
`,
  ky = `
  float tailWeightN=clamp((.22-position.x)/.64,0.,1.5);
  float strokeN=uFishTime*aSwim.z+aSwim.x+position.x*5.;
  float slope=aSwim.y*(cos(strokeN)*5.*tailWeightN*tailWeightN-sin(strokeN)*2.*tailWeightN/.64);
  objectNormal.x-=slope*objectNormal.z;
`;
function Ay(e, t, n, { reducedMotion: r = !1 } = {}) {
  let i = Cy(t),
    a = Dy(i, { allowJumps: !r }),
    o = i.length,
    s = oy(e),
    c = new W(),
    l = new Nn(),
    u = new Nn();
  n.updateMatrixWorld(!0);
  let d = [],
    f = { value: 0 };
  function p(t, r, i) {
    let a = n.getObjectByName(t);
    if (!a?.isMesh) throw Error(`Missing Blender wildlife part: ${t}`);
    let o = a.geometry.clone().applyMatrix4(a.matrixWorld),
      s = a.material.clone();
    ((s.side = 2),
      (s.envMapIntensity = 0.9),
      s.normalMap &&
        ((s.normalMap.anisotropy = 4), (s.normalMap.needsUpdate = !0)));
    let c = new Wi(o, s, r);
    return (
      (c.name = t + (i ? ` shoals` : ` surface visitor`)),
      c.instanceMatrix.setUsage(Xe),
      (c.boundingSphere = new Pr(new U(), Math.SQRT2 * 42 + 3)),
      (c.frustumCulled = !0),
      (c.receiveShadow = !0),
      (c.castShadow = !0),
      (c.userData.belowWater = i),
      (c.count = 0),
      e.add(c),
      d.push(c),
      c
    );
  }
  let m = (e, t) => {
    ((e.uniforms.uFishTime = f),
      (e.vertexShader =
        `uniform float uFishTime;attribute vec3 aSwim;
` + e.vertexShader),
      (e.vertexShader = e.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
` + Oy,
      )),
      t &&
        (e.vertexShader = e.vertexShader.replace(
          `#include <beginnormal_vertex>`,
          `#include <beginnormal_vertex>
` + ky,
        )));
  };
  function h(e, t) {
    let n = p(`FishBody`, e, t),
      r = p(`FishPectoralLeft`, e, t),
      i = p(`FishPectoralRight`, e, t),
      a = new Float32Array(e * 3);
    return (
      n.geometry.setAttribute(`aSwim`, new Ii(a, 3).setUsage(Xe)),
      (n.material.onBeforeCompile = (e) => m(e, !0)),
      (n.material.customProgramCacheKey = () => `blender-shoal-body`),
      (n.customDepthMaterial = new os({ side: 2 })),
      (n.customDepthMaterial.onBeforeCompile = (e) => m(e, !1)),
      (n.customDepthMaterial.customProgramCacheKey = () =>
        `blender-shoal-depth`),
      { body: n, left: r, right: i, swim: a, count: 0 }
    );
  }
  let g = h(o, !0),
    _ = h(1, !1),
    v = i.map((e, t) => {
      let n = new G(
        e.variety === `bronze`
          ? `#ddba88`
          : e.variety === `olive`
            ? `#aabb9a`
            : `#e3ece6`,
      );
      return (n.multiplyScalar(0.93 + (t % 7) * 0.012), n);
    });
  for (let e of d) e.setColorAt(0, v[0]);
  return {
    count: o,
    school: a,
    ripples: s.ripples,
    preview: (e, t) => a.activity.preview(e, t),
    update(e, t, n) {
      let r = a.update(t, n);
      ((g.count = _.count = 0), (f.value = 0));
      for (let e = 0; e < o; e++) {
        let t = i[e],
          n = r[e],
          a = n.activity ? _ : g,
          o = a.count++,
          { body: s, left: d, right: f, swim: p } = a;
        (p.set(
          [
            n.tailPhase,
            t.amplitude *
              (0.3 + n.effort * 0.7) *
              (0.65 + Math.min(1, n.speed) * 1.1),
            0,
          ],
          o * 3,
        ),
          u.position.set(n.x, n.y, n.z),
          u.rotation.set(n.roll, n.heading, n.pitch, `YXZ`),
          u.scale.set(...t.shape).multiplyScalar(t.scale),
          u.updateMatrix(),
          s.setMatrixAt(o, u.matrix));
        for (let [e, t] of [
          [d, -1],
          [f, 1],
        ])
          (l.position.set(0.12, -0.04, t * 0.08),
            l.rotation.set(
              t *
                (0.1 +
                  Math.sin(n.tailPhase * 0.46 + t * 0.7) *
                    (0.12 + n.effort * 0.17)),
              0,
              0,
            ),
            l.scale.setScalar(1),
            l.updateMatrix(),
            e.setMatrixAt(o, c.multiplyMatrices(u.matrix, l.matrix)));
        for (let t of [s, d, f]) t.setColorAt(o, v[e]);
      }
      for (let e of [g, _]) {
        e.body.geometry.attributes.aSwim.needsUpdate = !0;
        for (let t of [e.body, e.left, e.right])
          ((t.count = e.count),
            (t.visible = e.count > 0),
            (t.instanceMatrix.needsUpdate = !0),
            (t.instanceColor.needsUpdate = !0));
      }
      s.update(a.time, a.events);
    },
  };
}
var jy = (e) => ((e = J(e, 0, 1)), e * e * e * (e * (e * 6 - 15) + 10)),
  My = (e, t, n) => e + (t - e) * n;
