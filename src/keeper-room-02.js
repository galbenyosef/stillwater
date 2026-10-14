// keeper-room-02.js — the keeper's room and stove, cloth wear, clothing drips and the landing swim ladder
// Lines 63374-63749 of readable/assets__index-BogB70q-.pretty.js (cluster keeper-room, statement-aligned).
function buildClothingDrips(
  e,
  { reducedMotion: t = !1, surface: n = () => null, impact: r = () => {} } = {},
) {
  let i = createRandom(983),
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
function buildSwimLadder(e, t, n = {}) {
  let r = new Pn();
  r.name = `Landing swim ladder`;
  let i;
  (t.dockprops.traverse((e) => {
    for (let t of e.isMesh
      ? Array.isArray(e.material)
        ? e.material
        : [e.material]
      : [])
      t.name === `Dock | Oak weathered` && (i = t);
  }),
    (i = i?.clone() ?? new rs({ color: `#695844`, roughness: 0.95 })),
    (i.vertexColors = !1),
    (i.aoMap = null),
    (i.name = `Swim ladder | weathered oak`));
  let a = [],
    o = [],
    s = (e, t, n, r, i, a, o) => {
      let s = new ba(t, n, r);
      (s.translate(i, a, o), e.push(s));
    },
    {
      ladderX: c,
      water: { z: l },
      bottom: u,
      railSpacing: d,
    } = keeperMotionSpec;
  for (let e of [-1, 1])
    s(a, 0.09, 1.33 - u, 0.085, c, (1.33 + u) / 2, l + (e * d) / 2);
  for (let e = keeperMotionSpec.rungTop - 0.0325; e > u + 0.06; e -= keeperMotionSpec.rungSpacing) {
    s(a, 0.13, 0.065, d + 0.04, c - 0.02, e, l);
    for (let t of [-1, 1])
      s(o, 0.007, 0.023, 0.023, c - 0.049, e, l + (t * d) / 2);
  }
  for (let e of [-1, 1])
    s(o, 0.18, 0.045, 0.045, c + 0.065, 0.43, l + (e * d) / 2);
  for (let [e, t] of [
    [a, i],
    [o, new rs({ color: `#3c3932`, roughness: 0.78, metalness: 0.55 })],
  ]) {
    let n = new vi(Hp(e), t);
    ((n.castShadow = n.receiveShadow = !0),
      r.add(n),
      e.forEach((e) => e.dispose()));
  }
  e.add(r);
  let f = Array.from({ length: 3 }, () => new tn()),
    p = {
      uSwimContact: { value: new tn(0, 0, 0, 0) },
      uSwimMotion: { value: new V() },
      uSwimSections: { value: f },
    },
    m = [],
    h = new U(),
    g = new U(),
    _ = new U(),
    v = new U(),
    y = -1,
    b = -1,
    x = 0,
    S = `dry`,
    C = null,
    w = [
      [`pelvis`, 0.22, 0.17],
      [`spine_01`, 0.23, 0.17],
      [`spine_03`, 0.25, 0.19],
      [`neck_01`, 0.14, 0.12],
    ],
    T = [`l`, `r`].map((e) => [
      [`thigh_${e}`, 0.13, 0.14],
      [`calf_${e}`, 0.11, 0.12],
      [`foot_${e}`, 0.085, 0.15],
      [`ball_${e}`, 0.085, 0.12],
    ]);
  function E(e, t, n) {
    n.set(0, 0, 0, 0);
    for (let r = 0; r < t.length - 1; r++) {
      (e.root.getObjectByName(t[r][0]).getWorldPosition(_),
        e.root.getObjectByName(t[r + 1][0]).getWorldPosition(v));
      let i = v.y - _.y,
        a = Math.abs(i) < 1e-5 ? 0.5 : Math.max(0, Math.min(1, (q - _.y) / i));
      h.copy(_).lerp(v, a);
      let o = Math.abs(h.y - q);
      if (o >= 0.065) continue;
      let s = Math.sqrt(1 - (o / 0.065) ** 2);
      return (
        n.set(
          h.x,
          h.z,
          (t[r][1] + (t[r + 1][1] - t[r][1]) * a) * s,
          (t[r][2] + (t[r + 1][2] - t[r][2]) * a) * s,
        ),
        !0
      );
    }
    return !1;
  }
  let D = (e, t, n) => {
      (m.push({ x: e, z: t, age: 0, strength: n }), m.length > 6 && m.shift());
    },
    O = buildClothingDrips(e, { ...n, impact: D });
  return {
    root: r,
    ripples: m,
    uniforms: p,
    drips: O,
    reset() {
      (O.reset(),
        (m.length = 0),
        (y = b = -1),
        (x = 0),
        (S = `dry`),
        (C = null),
        (p.uSwimContact.value.w = 0),
        f.forEach((e) => e.set(0, 0, 0, 0)));
    },
    update(e, t, n) {
      for (let e = m.length - 1; e >= 0; e--)
        ((m[e].age += n), m[e].age > 3.8 && m.splice(e, 1));
      if (n <= 0) return;
      O.update(e, t, n);
      let r = e.state.swim,
        i = r?.phase ?? `dry`;
      if (
        (i !== S && ((C = null), (y = b = -1), (x = 0), (S = i)),
        f.forEach((e) => e.set(0, 0, 0, 0)),
        !r)
      ) {
        p.uSwimContact.value.w = 0;
        return;
      }
      E(t, w, f[0]) || T.forEach((e, n) => E(t, e, f[n + 1]));
      let a = +!!f.some((e) => e.z > 0.001);
      if (
        (p.uSwimContact.value.set(e.state.x, e.state.z, e.state.heading, a),
        p.uSwimMotion.value.set(
          r.effort,
          Math.min(1, e.state.speed / keeperMotionSpec.speed),
        ),
        i === `entering` || i === `exiting`)
      ) {
        if (
          (t.root.getObjectByName(`pelvis`).getWorldPosition(g),
          (x += n),
          a && (C === null || (x > 0.65 && Math.abs(g.y - C) > 0.09)))
        ) {
          for (let e of f) e.z > 0.001 && D(e.x, e.y, e.z > 0.18 ? 0.62 : 0.42);
          ((C = g.y), (x = 0));
        }
        return;
      }
      let o = r.cycle ?? r.time / keeperMotionSpec.strokeDuration,
        s = Math.floor(o - 0.25),
        c = Math.floor(o - 0.65);
      if (r.effort > 0.18) {
        if (s !== y)
          for (let e of [`l`, `r`])
            (t.root.getObjectByName(`hand_${e}`).getWorldPosition(h),
              D(h.x, h.z, 0.55 + r.effort * 0.42));
        if (c !== b)
          for (let e of [`l`, `r`])
            (t.root.getObjectByName(`foot_${e}`).getWorldPosition(h),
              D(h.x, h.z, 0.32 + r.effort * 0.2));
        ((y = s), (b = c), (x = 0));
      } else
        ((y = s),
          (b = c),
          (x += n),
          x > 1.4 &&
            (t.root
              .getObjectByName(
                Math.floor(r.time / 1.4) % 2 ? `hand_l` : `hand_r`,
              )
              .getWorldPosition(h),
            D(h.x, h.z, 0.28),
            (x = 0)));
    },
  };
}
