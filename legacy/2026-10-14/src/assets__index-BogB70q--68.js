// assets__index-BogB70q- 68 — point
// Lines 63374-63569 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function nC(
  e,
  { reducedMotion: t = !1, surface: n = () => null, impact: r = () => {} } = {},
) {
  let i = cp(983),
    a = [],
    o = Array.from({ length: 8 }, () => ({
      point: new U(),
      previous: new U(),
      wetAt: -1 / 0,
      budget: 0,
      next: 0.4 + i() * 0.6,
    })),
    s = new Go(1, 5, 3),
    c = new Float32Array(eC);
  s.setAttribute(`aDropFade`, new Ii(c, 1).setUsage(Xe));
  let l = new rs({
    color: `#c9e0db`,
    roughness: 0.1,
    metalness: 0,
    transparent: !0,
    opacity: 0.8,
    depthWrite: !1,
    envMapIntensity: 1.3,
  });
  ((l.onBeforeCompile = (e) => {
    ((e.vertexShader =
      `attribute float aDropFade;varying float vDropFade;
` + e.vertexShader),
      (e.vertexShader = e.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
vDropFade=aDropFade;`,
      )),
      (e.fragmentShader =
        `varying float vDropFade;
` + e.fragmentShader),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <color_fragment>`,
        `#include <color_fragment>
diffuseColor.a*=vDropFade;`,
      )));
  }),
    (l.customProgramCacheKey = () => `keeper-clothing-drips-v1`));
  let u = new Wi(s, l, eC);
  ((u.name = `Keeper clothing drips`),
    (u.count = 0),
    (u.visible = !1),
    u.instanceMatrix.setUsage(Xe),
    (u.frustumCulled = !1),
    (u.receiveShadow = !0),
    (u.userData.aboveWater = !0),
    (u.userData.skipAO = !0),
    (u.renderOrder = 4),
    e.add(u));
  let d = new Nn(),
    f = new U(),
    p = new U(0, 1, 0),
    m = new U(),
    h = new U(),
    g = new U(),
    _ = new U(),
    v = new U(),
    y = 0,
    b = 0,
    x = null,
    S = null,
    C = !1;
  function w() {
    ((a.length = 0), (y = b = 0), (C = !1), (u.count = 0), (u.visible = !1));
    for (let e of o) ((e.wetAt = -1 / 0), (e.budget = 0));
  }
  function T(e) {
    x !== e.root &&
      ((x = e.root),
      (S = Object.fromEntries(
        [
          `pelvis`,
          `spine_01`,
          ...[`l`, `r`].flatMap((e) => [
            `thigh_${e}`,
            `hand_${e}`,
            `lowerarm_${e}`,
            `foot_${e}`,
            `ball_${e}`,
          ]),
        ].map((e) => [e, x.getObjectByName(e)]),
      )));
    for (let [e, t] of [`l`, `r`].entries())
      (S[`lowerarm_${t}`].getWorldPosition(v),
        S[`hand_${t}`].getWorldPosition(o[e].point).lerp(v, 0.06),
        (o[e].point.y -= 0.035),
        S[`ball_${t}`].getWorldPosition(v),
        S[`foot_${t}`].getWorldPosition(o[6 + e].point).lerp(v, 0.55),
        (o[6 + e].point.y -= 0.012));
    (S.pelvis.getWorldPosition(m),
      S.spine_01.getWorldPosition(g).sub(m).normalize(),
      S.thigh_r.getWorldPosition(v),
      S.thigh_l.getWorldPosition(h).sub(v).normalize(),
      _.crossVectors(h, g).normalize());
    for (let e = 0; e < 4; e++) {
      let t = (Math.PI * (e + 0.25)) / 2;
      o[2 + e].point
        .copy(m)
        .addScaledVector(g, -0.075)
        .addScaledVector(h, Math.cos(t) * 0.17)
        .addScaledVector(_, Math.sin(t) * 0.13);
    }
  }
  return {
    mesh: u,
    drops: a,
    reset: w,
    update(e, l, m) {
      if (m <= 0) return;
      if (t) {
        u.visible && w();
        return;
      }
      ((m = Math.min(m, 0.1)), (y += m));
      let h = e.state.swim?.phase ?? `dry`,
        g = h === `exiting` || h === `dry`;
      if (h === `dry` && !a.length && o.every((e) => y - e.wetAt >= tC)) {
        C = !1;
        return;
      }
      T(l);
      for (let e of o) {
        (C || e.previous.copy(e.point),
          h !== `dry` && e.point.y <= 0.192 && ((e.wetAt = y), (e.budget = 0)));
        let t = y - e.wetAt,
          r = n(e.point.x, e.point.z, e.point.y),
          o = Math.max(q, r ?? 0.18);
        if (g && t < tC && e.point.y > o + 0.025) {
          let n = 3.6 * (1 - t / tC) ** 2;
          for (
            e.budget += m * n;
            e.budget >= e.next &&
            ((e.budget -= e.next),
            (e.next = 0.7 + i() * 0.6),
            !(a.length >= eC));
          )
            (f
              .copy(e.point)
              .sub(e.previous)
              .multiplyScalar(0.2 / m)
              .clampLength(0, 0.35),
              a.push({
                x: e.point.x + (i() - 0.5) * 0.012,
                y: e.point.y,
                z: e.point.z + (i() - 0.5) * 0.012,
                vx: f.x + (i() - 0.5) * 0.035,
                vy: Math.min(0, f.y) - 0.1,
                vz: f.z + (i() - 0.5) * 0.035,
                born: y,
                size: 0.0045 + i() * 0.0025,
              }));
        } else e.budget = 0;
        e.previous.copy(e.point);
      }
      C = !0;
      let _ = 0;
      for (let e = a.length - 1; e >= 0; e--) {
        let t = a[e],
          i = y - t.born;
        d.position.set(
          t.x + t.vx * i,
          t.y + t.vy * i - 4.905 * i * i,
          t.z + t.vz * i,
        );
        let o = n(d.position.x, d.position.z, t.y),
          s = Math.max(q, o ?? 0.18);
        if (d.position.y <= s || i > 1) {
          (d.position.y <= 0.18 &&
            s === 0.18 &&
            y >= b &&
            (r(d.position.x, d.position.z, 0.16), (b = y + 0.22)),
            a.splice(e, 1));
          continue;
        }
        f.set(t.vx, t.vy - 9.81 * i, t.vz);
        let l = 1 + Math.min(2.4, f.length() * 0.9);
        (d.quaternion.setFromUnitVectors(p, f.normalize()),
          d.scale.set(t.size, t.size * l, t.size),
          d.updateMatrix(),
          u.setMatrixAt(_, d.matrix),
          (c[_] = Math.min(1, i * 55) * Math.min(1, (d.position.y - s) * 65)),
          _++);
      }
      ((u.count = _),
        (u.visible = _ > 0),
        (u.instanceMatrix.needsUpdate = !0),
        (s.attributes.aDropFade.needsUpdate = !0));
    },
  };
}
