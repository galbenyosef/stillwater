// assets__index-BogB70q- 32 — math
// Lines 52611-52830 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function X_(n, r, { groundHeight: i, water: a, reducedMotion: o = !1 } = {}) {
  let s = n.clone(),
    c = new U(),
    l = new U(),
    u = new U(),
    d = new U(),
    f = new U(),
    p = !1,
    m = null,
    h = [],
    g = null,
    _ = (e) => ({
      position: e.position.clone(),
      rotation: e.quaternion.clone(),
      fov: e.fov,
      near: e.near,
    });
  function v(e) {
    let t = m.target.x,
      n = m.target.z;
    ((m.target.x = It.clamp(t, -30, 30)),
      (m.target.z = It.clamp(n, -28, 30)),
      (m.target.y = It.clamp(m.target.y, a, 16)),
      (s.position.x += m.target.x - t),
      (s.position.z += m.target.z - n),
      Y_(s.position, e, { groundHeight: i, water: a, obstacles: h }),
      s.lookAt(m.target),
      s.updateMatrixWorld());
  }
  function y(e, t) {
    g = t || o ? null : { ..._(e), age: 0 };
  }
  return {
    get active() {
      return p;
    },
    get blending() {
      return !!g;
    },
    get target() {
      return m?.target ?? c;
    },
    get camera() {
      return s;
    },
    setObstacles(e) {
      h = e;
    },
    enter(n, i, a, { immersive: d = !1, inside: f = !1 } = {}) {
      if (
        ((p = !0),
        m?.dispose(),
        s.copy(i),
        (s.aspect = n.aspect),
        (s.fov = 36),
        (s.near = 0.18),
        s.updateProjectionMatrix(),
        c.copy(a),
        d)
      ) {
        u.subVectors(s.position, c);
        let e = Math.atan2(u.x, u.z),
          t = Math.max(22, u.length()),
          n = Math.max(0.55, Math.asin(u.y / Math.max(1, u.length())));
        s.position.set(
          c.x + Math.sin(e) * t * Math.cos(n),
          c.y + Math.sin(n) * t,
          c.z + Math.cos(e) * t * Math.cos(n),
        );
      }
      ((m = new A_(s, r)),
        (m.cursorStyle = `grab`),
        m.target.copy(c),
        (m.enableDamping = !o),
        (m.dampingFactor = 0.18),
        (m.minDistance = 3),
        (m.maxDistance = 65),
        (m.minPolarAngle = 0.065),
        (m.maxPolarAngle = Math.PI / 2 - 0.1),
        (m.screenSpacePanning = !1),
        (m.zoomToCursor = !0),
        (m.rotateSpeed = 0.65),
        (m.mouseButtons = { LEFT: e.PAN, MIDDLE: e.DOLLY, RIGHT: e.ROTATE }),
        (m.touches = { ONE: t.ROTATE, TWO: t.DOLLY_PAN }),
        m.update(),
        v(null),
        l.copy(s.position),
        y(n, f));
    },
    leave(e, { instant: t = !1, inside: n = !1 } = {}) {
      p && ((p = !1), c.copy(m.target), m.dispose(), (m = null), y(e, t || n));
    },
    focusOn(e) {
      p && m.enabled && (y(s, !1), m.target.copy(e));
    },
    orbit(e, t) {
      p && m.enabled && (m.rotateLeft(e), m.rotateUp(t));
    },
    zoom(e) {
      p && m.enabled && m.dollyIn(1 / e);
    },
    panKeys(e, t, n) {
      if (!p || !m.enabled || (!e && !t)) return;
      let r =
        (Math.min(18, s.position.distanceTo(m.target) * 0.65) * n) /
        Math.max(1, Math.hypot(e, t));
      (d.setFromMatrixColumn(s.matrixWorld, 0).setY(0).normalize(),
        f.crossVectors(J_, d),
        u
          .copy(d)
          .multiplyScalar(e * r)
          .addScaledVector(f, -t * r),
        m.target.add(u),
        s.position.add(u));
    },
    update(e, t, { enabled: n = !0 } = {}) {
      if (
        (p &&
          ((m.enabled = n),
          (s.aspect = e.aspect),
          s.updateProjectionMatrix(),
          n && m.update(t),
          v(l),
          l.copy(s.position),
          e.position.copy(s.position),
          e.quaternion.copy(s.quaternion),
          (e.fov = s.fov),
          (e.near = s.near)),
        g)
      ) {
        g.age += Math.max(0, t);
        let n = Math.min(1, g.age / 0.38),
          r = n * n * (3 - 2 * n);
        (e.position.lerp(g.position, 1 - r),
          e.quaternion.slerp(g.rotation, 1 - r),
          (e.fov = It.lerp(g.fov, e.fov, r)),
          (e.near = It.lerp(g.near, e.near, r)),
          n === 1 && (g = null));
      }
      (p || g) && e.updateProjectionMatrix();
    },
  };
}
var Z_ = [
    `tree1`,
    `tree2`,
    `tree3`,
    `tree1_lod`,
    `tree2_lod`,
    `tree3_lod`,
    `tree1_crown`,
    `tree1_crown_lod`,
    `tree1_bridge`,
    `tree1_bridge_lod`,
  ],
  Q_ = [
    `boat`,
    `terrain`,
    `springwater`,
    `pondlife`,
    `architecture`,
    `millinterior`,
    `milldoor`,
    `millsidedoor`,
    `bridgepath`,
  ],
  $_ = [...new Set([...xh.placements.map((e) => e.asset), ...Z_, ...Q_])],
  ev = new Set([
    ...Z_,
    ...Q_,
    `mill`,
    `spring`,
    `bridge`,
    `dockprops`,
    `milldetails`,
  ]),
  tv = (e) =>
    `/${ev.has(e) ? `compact/` : ``}models/${e.replace(/^tree3(?=_|$)/, `tree3_crown`)}.glb`,
  nv = async (e) => {
    let [t, n] = await Promise.all([
      mh(e, {
        names: $_,
        canopies: !1,
        groundTextures: !1,
        urls: Object.fromEntries($_.map((e) => [e, tv(e)])),
      }),
      p_(),
    ]);
    ((t.distantWoodland = n), Zg(t));
    let r = new Set([
      `mill`,
      `architecture`,
      `dockprops`,
      `milldetails`,
      `milldoor`,
    ]);
    for (let e of [
      `mill`,
      `bridge`,
      `architecture`,
      `dockprops`,
      `milldetails`,
      `millinterior`,
      `milldoor`,
      `millsidedoor`,
      `bridgepath`,
    ])
      Mg(t[e], { naturalDaylight: r.has(e) });
    for (let e of [`mill`, `architecture`, `milldoor`, `millsidedoor`])
      Rg(t[e], e);
    (jg(t.millinterior),
      Ag(t.millinterior),
      Vg(t.millinterior),
      await Hg(t.millinterior),
      Og(t));
    for (let e of Z_) $g(t[e]);
    for (let e of [`fern0`, `fern1`, `shrub`, `bankcover0`, `bankcover1`])
      $g(t[e], { groundCover: !0 });
    return ((t.leafLitter = i_(t.tree1)), t);
  };
