// assets__index-BogB70q- 67 — math
// Lines 63065-63373 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function QS(e, t, { reducedMotion: n = !1 } = {}) {
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
  let d = ZS(r, { reducedMotion: n }),
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
  let e = eb(Oh),
    t = new U(),
    n = new H(),
    r = new gn(0, 0, 0, `YXZ`),
    i = Oh.heading + Math.PI,
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
          : Math.hypot(t.x - kh.x, t.z - kh.z) < 0.4 &&
              Math.abs(t.y - kh.y) < 0.3
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
