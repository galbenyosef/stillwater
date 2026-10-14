// collision-01.js — collision and movement: obstacle boxes, ground/water tests and the move step
// Lines 52570-52753 of readable/assets__index-BogB70q-.pretty.js (cluster collision, statement-aligned).
function buildCollisionBoxes(e, t) {
  e.updateMatrixWorld(!0);
  let n = [],
    r = new Nn(),
    i = [];
  e.traverse((e) => {
    e.isMesh &&
      (e.geometry.computeBoundingBox(),
      n.push(e.geometry.boundingBox.clone().applyMatrix4(e.matrixWorld)));
  });
  for (let e of t) {
    (r.position.set(e.x, e.y, e.z),
      r.rotation.set(e.rx || 0, e.angle || 0, e.rz || 0),
      Array.isArray(e.s) ? r.scale.set(...e.s) : r.scale.setScalar(e.s || 1),
      r.updateMatrix());
    for (let e of n)
      e.isEmpty() ||
        i.push(e.clone().applyMatrix4(r.matrix).expandByScalar(0.3));
  }
  return i;
}
var G_ = new ai(),
  K_ = new U(),
  q_ = new U(),
  J_ = new U(0, 1, 0);
function Y_(e, t, { groundHeight: n, water: r, obstacles: i = [] }) {
  if (t) {
    K_.subVectors(e, t);
    let n = K_.length();
    if (n > 1e-7) {
      G_.set(t, K_.divideScalar(n));
      for (let e of i)
        e.containsPoint(t) ||
          (G_.intersectBox(e, q_) &&
            (n = Math.min(n, Math.max(0, q_.distanceTo(t) - 0.015))));
      e.copy(t).addScaledVector(G_.direction, n);
    }
  }
  for (let t of i) t.containsPoint(e) && (e.y = t.max.y + 0.015);
  return ((e.y = Math.max(e.y, r + 0.45, n(e.x, e.z) + 0.45)), e);
}
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
