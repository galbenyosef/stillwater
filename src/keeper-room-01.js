// keeper-room-01.js — the keeper's room and stove, cloth wear, clothing drips and the landing swim ladder
// Lines 62853-63373 of readable/assets__index-BogB70q-.pretty.js (cluster keeper-room, statement-aligned).
function buildStove(e, { reducedMotion: t = !1 } = {}) {
  let n = new Pn();
  ((n.name = `The keeper’s wood stove`),
    n.position.set(Wy.stove.x, Wy.upper, Wy.stove.z),
    (n.rotation.y = Wy.stove.heading),
    e.add(n));
  let r = JS(
      new rs({
        name: `Seasoned cast iron`,
        color: `#383733`,
        metalness: 0.68,
        roughness: 0.64,
      }),
      95,
      8e-4,
    ),
    i = new rs({
      name: `Worn iron edges`,
      color: `#4b4942`,
      metalness: 0.8,
      roughness: 0.42,
    }),
    a = JS(
      new rs({ name: `Slate hearth`, color: `#494c47`, roughness: 0.93 }),
      38,
      0.0014,
    ),
    o = new rs({
      name: `Soot inside the firebox`,
      color: `#15120e`,
      roughness: 1,
    }),
    s = JS(
      new rs({ name: `Warm firebrick`, color: `#614434`, roughness: 1 }),
      72,
      0.001,
    ),
    c = JS(
      new rs({
        name: `Charred logs`,
        color: `#24211c`,
        roughness: 0.98,
        emissive: `#ff4a08`,
        emissiveIntensity: 0.8,
      }),
      65,
      0.002,
    ),
    l = c.onBeforeCompile;
  ((c.onBeforeCompile = (e) => {
    (l(e),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <emissivemap_fragment>`,
        `#include <emissivemap_fragment>
      float cracks=pow(1.-abs(sin(vStoveFinish.y*83.+stoveNoise(vStoveFinish*29.)*5.)),18.);
      totalEmissiveRadiance*=.012+cracks*(.2+stoveNoise(vStoveFinish*41.)*.8);`,
      )));
  }),
    (c.customProgramCacheKey = () => `stove-charred-log-v1`));
  let u = JS(
      new rs({
        name: `Embers beneath the logs`,
        color: `#352015`,
        roughness: 1,
        emissive: `#e84405`,
        emissiveIntensity: 0.6,
      }),
      90,
      0.001,
    ),
    d = u.onBeforeCompile;
  ((u.onBeforeCompile = (e) => {
    (d(e),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <emissivemap_fragment>`,
        `#include <emissivemap_fragment>
totalEmissiveRadiance*=.12+pow(stoveGrain,3.)*1.5;`,
      )));
  }),
    (u.customProgramCacheKey = () => `stove-embers-v1`));
  function f(e, t, r, i, a) {
    let o = new vi(e, t);
    return (
      o.position.set(r, i, a),
      (o.castShadow = o.receiveShadow = !0),
      n.add(o),
      o
    );
  }
  function p(e, t, n, i, a, o, s = r, c = 0.008) {
    return f(new GS(e, t, n, 2, Math.min(c, e / 3, t / 3, n / 3)), s, i, a, o);
  }
  function m(e, t, n, i, a, o = r) {
    return f(new Sa(e, e, t, 24), o, n, i, a);
  }
  for (let e = 0; e < 2; e++)
    for (let t = 0; t < 2; t++)
      p(
        0.386,
        0.044,
        0.366,
        (e - 0.5) * 0.394,
        0.031,
        (t - 0.5) * 0.374,
        a,
        0.008,
      );
  for (let e of [-0.218, 0.218])
    for (let t of [-0.17, 0.17])
      (p(0.06, 0.19, 0.065, e, 0.15, t, r),
        p(0.085, 0.035, 0.085, e, 0.064, t, i));
  (p(0.57, 0.065, 0.49, 0, 0.264, 0),
    p(0.59, 0.068, 0.5, 0, 0.9, 0),
    p(0.042, 0.57, 0.46, -0.256, 0.58, 0),
    p(0.042, 0.57, 0.46, 0.256, 0.58, 0),
    p(0.51, 0.57, 0.034, 0, 0.58, -0.218),
    p(0.47, 0.045, 0.4, 0, 0.34, 0, o),
    p(0.46, 0.49, 0.018, 0, 0.61, -0.192, s, 0.004),
    p(0.49, 0.065, 0.45, 0, 0.302, 0.025),
    p(0.18, 0.017, 0.022, 0, 0.305, 0.264, i, 0.005));
  for (let e = 0; e < 5; e++)
    p(0.042, 0.012, 0.007, (e - 2) * 0.074, 0.302, 0.254, o, 0.002);
  let h = YS(to, 0.54, 0.515, 0.048);
  (h.holes.push(YS(eo, 0.43, 0.4, 0.029)),
    f(
      new Bo(h, {
        depth: 0.025,
        bevelEnabled: !0,
        bevelSize: 0.005,
        bevelThickness: 0.005,
        bevelSegments: 2,
        curveSegments: 5,
      }),
      r,
      0,
      0.605,
      0.239,
    ));
  for (let e of [0.45, 0.76]) m(0.015, 0.07, -0.27, e, 0.263, i);
  let g = m(0.012, 0.067, 0.277, 0.615, 0.294, i);
  g.rotation.x = Math.PI / 2;
  let _ = m(0.019, 0.105, 0.284, 0.59, 0.329, r);
  _.rotation.z = 0.2;
  let v = new is({
      name: `Slightly sooted stove glass`,
      color: `#a57d51`,
      transparent: !0,
      opacity: 0.065,
      roughness: 0.17,
      metalness: 0,
      clearcoat: 1,
      depthWrite: !1,
    }),
    y = f(new Wo(0.44, 0.41), v, 0, 0.605, 0.272);
  ((y.castShadow = !1), (y.renderOrder = 3));
  for (let e = 0; e < 3; e++) {
    let t = m(
      0.043 + (e % 2) * 0.011,
      0.36,
      (e - 1) * 0.022,
      0.389 + (e === 2 ? 0.058 : 0),
      (e - 1) * 0.082,
      c,
    );
    ((t.rotation.z = Math.PI / 2), (t.rotation.y = (e - 1) * 0.19));
  }
  for (let e = 0; e < 15; e++) {
    let t = f(
      new wa(0.019 + (e % 3) * 0.005),
      u,
      (((e * 7) % 11) - 5) * 0.034,
      0.368,
      ((e % 3) - 1) * 0.105,
    );
    ((t.scale.y = 0.48), t.rotation.set(e * 0.71, e * 1.3, e * 0.42));
  }
  let b = Wy.ceiling - Wy.upper - 0.93;
  m(0.067, b, 0, 0.93 + b / 2, -0.075);
  for (let e of [0.965, 1.53]) m(0.075, 0.04, 0, e, -0.075, i);
  p(0.23, 0.035, 0.23, 0, Wy.ceiling - Wy.upper - 0.018, -0.075, r, 0.018);
  let x = f(new Ko(0.137, 0.006, 8, 40), i, 0, 0.937, 0.04);
  x.rotation.x = Math.PI / 2;
  let S = buildStoveFire();
  n.add(S);
  let C = new ac(`#ffb56a`, 3.8, 4.5, Math.PI * 0.46, 1, 2);
  (C.position.set(0, 0.6, 0.32),
    C.target.position.set(0, 0.25, 3),
    n.add(C, C.target),
    (C.castShadow = !0),
    C.shadow.mapSize.set(512, 512),
    (C.shadow.camera.near = 0.045),
    (C.shadow.camera.far = 4.5),
    (C.shadow.bias = -4e-4),
    (C.shadow.normalBias = 0.012),
    (C.shadow.radius = 4),
    (C.shadow.autoUpdate = !1),
    (C.shadow.needsUpdate = !0),
    n.traverse((e) => {
      e.userData.aboveWater = !0;
    }),
    a_(n));
  let w = 0;
  function T(e) {
    (t || (w += Math.min(0.1, Math.max(0, e))),
      (S.material.uniforms.uFireTime.value = w));
    let n = KS(w);
    ((C.intensity = 3.8 * n),
      (u.emissiveIntensity = 0.6 * n),
      (c.emissiveIntensity = 0.8 * n));
  }
  return (T(0), { root: n, fire: S, light: C, update: T });
}
function buildKeeperRoom(e, t, { reducedMotion: n = !1 } = {}) {
  let r = new Pn();
  ((r.name = `The keeper’s room`),
    r.position.set(-3, 0.58, -4.2),
    (r.userData.aboveWater = !0),
    e.add(r));
  let i = new Pn();
  (i.position.set(-0.71, 0.39, 2.4), r.add(i));
  let a = t.milldoor.clone(!0);
  (a.position.set(0.71, -0.39, -2.975),
    i.add(a),
    a.traverse((e) => {
      e.isMesh && ((e.castShadow = !0), (e.receiveShadow = !0));
    }));
  let o = new Pn();
  (o.position.fromArray(Wy.bridgeExit.hinge), r.add(o));
  let s = t.millsidedoor.clone(!0);
  (s.position.copy(o.position).negate(),
    o.add(s),
    s.traverse((e) => {
      e.isMesh && ((e.castShadow = !0), (e.receiveShadow = !0));
    }));
  let c = new ac(`#ffe0ab`, 2.5, 5.5, Math.PI * 0.43, 0.72, 2);
  (c.position.set(-0.45, Wy.ceiling - 0.43, -0.25),
    c.target.position.set(-0.45, Wy.upper, -0.25),
    (c.castShadow = !0),
    c.shadow.mapSize.set(1024, 1024),
    (c.shadow.camera.near = 0.04),
    (c.shadow.camera.far = 5.5),
    (c.shadow.bias = -5e-5),
    (c.shadow.normalBias = 0.005),
    (c.shadow.radius = 2.5),
    (c.shadow.autoUpdate = !1),
    (c.shadow.needsUpdate = !0),
    r.add(c, c.target));
  let l = new sc(`#ffe4bc`, 1.25, 3.1, 2);
  (l.position.set(0.25, 1.95, 2.05), r.add(l));
  let u = new sc(`#ffe4bc`, 1.8, 4.2, 2);
  (u.position.set(Wy.bridgeExit.openingX - 0.27, 2.9, -0.75), r.add(u));
  let d = buildStove(r, { reducedMotion: n }),
    f = $y(),
    p = !1,
    m = 0,
    h = !1,
    g = 0,
    _ = `front`,
    v = !1,
    y = !1,
    b = 0,
    x = 0,
    S = -0.08,
    C = 0,
    w = -0.08,
    T = null,
    E = null,
    D = new U(),
    O = new H(),
    k = new gn(0, 0, 0, `YXZ`);
  function A(e) {
    ((p = !0),
      (_ = `front`),
      (E = [
        { x: r.position.x, z: Math.max(e.z, -0.75), precise: !0 },
        { x: r.position.x, z: -2.1 },
      ]));
  }
  function j(e) {
    ((C = x =
      Math.atan2(
        e.x - (r.position.x + (Wy.stairs.x0 + Wy.stairs.x1) / 2),
        e.z - (r.position.z + Wy.stairs.front),
      )),
      (w = S = -0.08));
  }
  return {
    root: r,
    seat: f,
    get open() {
      return p;
    },
    get passable() {
      return m > 0.9;
    },
    get bridgeOpen() {
      return h;
    },
    get bridgePassable() {
      return g > 0.9;
    },
    get active() {
      return v;
    },
    get blend() {
      return b;
    },
    get angle() {
      return x;
    },
    get entering() {
      return E !== null;
    },
    get entryTarget() {
      return E?.[0] ?? null;
    },
    get transitioning() {
      return E !== null || f.transitioning;
    },
    get resting() {
      return f.active;
    },
    action(e) {
      return Qy(e, {
        open: p,
        bridgeOpen: h,
        active: v,
        resting: f.active,
        transitioning: this.transitioning,
      });
    },
    interact(e) {
      let t = this.action(e);
      return (
        t === `enter`
          ? A(e)
          : t === `enter-side`
            ? ((h = !0),
              (v = !0),
              (_ = `side`),
              (C = x = -Math.PI / 2),
              (w = S = -0.08))
            : t === `open-side`
              ? (h = !0)
              : t === `close-side`
                ? (h = !1)
                : t === `open`
                  ? (p = !0)
                  : t === `close`
                    ? (p = !1)
                    : t === `sit`
                      ? (f.sit(e),
                        (C =
                          x +
                          Math.atan2(
                            Math.sin(Math.PI - x),
                            Math.cos(Math.PI - x),
                          )),
                        (w = -0.18))
                      : t === `stand` && f.stand(),
        t
      );
    },
    drag(e, t) {
      ((C -= e * 0.0032), (w = It.clamp(w - t * 0.0032, -1.15, 0.95)));
    },
    recenter() {
      ((w = f.active ? -0.18 : -0.08),
        f.active &&
          (C = x + Math.atan2(Math.sin(Math.PI - x), Math.cos(Math.PI - x))));
    },
    reset() {
      ((p = h = !1), (v = y = !1), (T = E = null), f.reset());
    },
    update(e, t) {
      d.update(e);
      let n = m,
        a = g;
      if (
        ((m = Math.max(
          0,
          Math.min(1, m + ((p ? 1 : -1) * Math.min(e, 0.1)) / 0.85),
        )),
        (i.rotation.y = m * m * (3 - 2 * m) * Math.PI),
        (g = It.clamp(g + ((h ? 1 : -1) * Math.min(e, 0.1)) / 0.85, 0, 1)),
        (o.rotation.y = g * g * (3 - 2 * g) * Math.PI * 0.52),
        (m !== n || g !== a) && (c.shadow.needsUpdate = !0),
        E &&
          e > 0 &&
          (t.z > 0.1
            ? (E = null)
            : t.z < -1.85 && Math.abs(t.x - r.position.x) < 0.72
              ? ((E = null), (v = y = !0), j(t))
              : Math.hypot(t.x - E[0].x, t.z - E[0].z) < 0.06 &&
                E.length > 1 &&
                E.shift()),
        !v && !E && T)
      ) {
        let e =
            p &&
            t.z < T.z &&
            t.z < -0.65 &&
            t.z > -1.85 &&
            Math.abs(t.x + 3) < 0.72 &&
            t.y < 1.3,
          n =
            h &&
            t.x > T.x &&
            t.x > -7.5 &&
            t.x < -6.1 &&
            t.z > -6.65 &&
            t.z < -5.38 &&
            Math.abs(t.y - 1.942) < 0.25;
        e
          ? A(t)
          : n &&
            ((v = !0), (_ = `side`), (C = x = -Math.PI / 2), (w = S = -0.08));
      }
      return (
        (T = { x: t.x, z: t.z }),
        v && t.z < -1.85 && t.x > -6.1 && (y = !0),
        v &&
          (y
            ? t.z > -0.7 || t.x < -7.3
            : _ === `front`
              ? t.z > 0.1
              : t.x < -7.9) &&
          (v = y = !1),
        f.update(e)
      );
    },
    updateCamera(e, t, n) {
      let r = Math.min(0.1, Math.max(0, n));
      b = It.clamp(b + ((v ? 1 : -1) * r) / 0.85, 0, 1);
      let i = 1 - Math.exp(-r * 12);
      if (((x += (C - x) * i), (S += (w - S) * i), !b)) return;
      let a = b * b * (3 - 2 * b);
      (D.set(t.x, t.y + 1.62 - f.progress * 0.46, t.z),
        k.set(S, x, 0, `YXZ`),
        O.setFromEuler(k),
        e.position.lerp(D, a),
        e.quaternion.slerp(O, a),
        (e.fov = It.lerp(e.fov, e.aspect < 1 ? 78 : 70, a)),
        (e.near = It.lerp(e.near, 0.055, a)),
        e.updateProjectionMatrix());
    },
  };
}
function $S() {
  let e = createMillState(benchTop),
    t = new U(),
    n = new H(),
    r = new gn(0, 0, 0, `YXZ`),
    i = benchTop.heading + Math.PI,
    a = 0,
    o = i,
    s = -0.08,
    c = i,
    l = -0.08;
  return {
    seat: e,
    get active() {
      return e.active;
    },
    get blend() {
      return a;
    },
    get transitioning() {
      return e.transitioning;
    },
    action(t) {
      return e.transitioning
        ? null
        : e.active
          ? `stand`
          : Math.hypot(t.x - benchApproach.x, t.z - benchApproach.z) < 0.4 &&
              Math.abs(t.y - benchApproach.y) < 0.3
            ? `sit-bank`
            : null;
    },
    interact(t) {
      let n = this.action(t);
      return (
        n === `sit-bank`
          ? (e.sit(t), (c = o = i), (l = s = -0.08))
          : n === `stand` && e.stand(),
        n
      );
    },
    drag(e, t) {
      ((c = It.clamp(c - e * 0.0032, i - 1.35, i + 1.35)),
        (l = It.clamp(l - t * 0.0032, -0.65, 0.65)));
    },
    recenter() {
      ((c = i), (l = -0.08));
    },
    reset() {
      e.reset();
    },
    update(t) {
      return e.update(t);
    },
    updateCamera(i, u, d) {
      let f = Math.min(0.1, Math.max(0, d));
      a = It.clamp(a + ((e.active ? 1 : -1) * f) / 0.85, 0, 1);
      let p = 1 - Math.exp(-f * 12);
      if (((o += (c - o) * p), (s += (l - s) * p), !a)) return;
      (t.set(u.x, u.y + 1.62 - e.progress * 0.46, u.z),
        r.set(s, o, 0, `YXZ`),
        n.setFromEuler(r));
      let m = a * a * (3 - 2 * a);
      (i.position.lerp(t, m),
        i.quaternion.slerp(n, m),
        (i.fov = It.lerp(i.fov, i.aspect < 1 ? 78 : 70, m)),
        (i.near = It.lerp(i.near, 0.055, m)),
        i.updateProjectionMatrix());
    },
  };
}
var eC = 48,
  tC = 12;
