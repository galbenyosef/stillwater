// assets__index-BogB70q- 46 — math
// Lines 56889-57216 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Uy(e, t, n, r, i = null) {
  let a = cp(123),
    o = new Nn(),
    s = Ay(e, a, r.pondlife, { reducedMotion: t }),
    c = Iy(e, r.pondlife, r.reeds),
    l = uy(e, n, r.springwater, i),
    u = Hy(e, r.leafLitter, { reducedMotion: t }),
    d = [],
    f = new xa(0.07, 5);
  (f.rotateX(-Math.PI / 2), f.scale(0.55, 1, 1.5));
  let p = new rs({ color: `#bd9a46`, roughness: 1, side: 2 });
  for (let e = 0; e < 96; e++) a();
  for (let e = 0; e < 30; e++) {
    let e = a() * 18 - 9,
      t = a() * 14 - 4;
    Y(e, t) > -0.2 || d.push({ x: e, z: t, angle: a() * 6.28, p: a() * 6.28 });
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
var Wy = X,
  Gy = X.origin[1] + X.upper,
  Ky = Object.freeze({
    x: X.origin[0] + X.stove.x,
    y: Gy + 0.59,
    z: X.origin[2] + X.stove.z,
  }),
  qy = Object.freeze({
    x: X.origin[0] + X.seat.x,
    y: Gy,
    z: X.origin[2] + X.seat.z,
    heading: 0,
  }),
  Jy = Object.freeze({
    ...qy,
    x: X.origin[0] + X.seat.approachX,
    z: X.origin[2] + X.seat.approachZ,
  }),
  Yy = (e, t, n) => e >= t && e <= n;
function Xy(e, t, n) {
  ((e -= X.origin[0]), (t -= X.origin[2]), (n -= X.origin[1]));
  let r = X.stairs,
    i = X.bridgeExit;
  if (
    (Yy(e, -0.72, 0.72) && Yy(t, 2.4, 3.2) && n < 1.2) ||
    (Yy(e, -1.07, 3.15) && Yy(t, r.front, 2.49) && n < 1.2) ||
    (Yy(e, i.x0, -1.07) && Yy(t, 1.4, 2.49) && n < 1.2) ||
    (Yy(e, i.x0, i.x1) && Yy(t, i.front, 1.42) && n < 1.2)
  )
    return X.origin[1] + X.ground;
  if (Yy(e, i.x0, i.x1) && Yy(t, i.back, i.front) && n < X.upper - 0.35) {
    let e = Math.min(
      i.steps,
      Math.max(1, Math.ceil(((i.front - t) / (i.front - i.back)) * i.steps)),
    );
    return X.origin[1] + X.ground + ((i.floor - X.ground) * e) / i.steps;
  }
  if (
    (Yy(e, i.x0, i.x1) && Yy(t, -2.4, i.back) && n < X.upper - 0.35) ||
    (Yy(e, -3.8, i.x0) && Yy(t, -2.42, -1.18) && n < X.upper - 0.35)
  )
    return X.origin[1] + i.floor;
  if (Yy(e, r.x0, r.x1) && Yy(t, r.back, r.front)) {
    let e = Math.min(
      r.steps,
      Math.max(1, Math.ceil(((r.front - t) / (r.front - r.back)) * r.steps)),
    );
    return X.origin[1] + X.ground + ((X.upper - X.ground) * e) / r.steps;
  }
  return Yy(e, i.x0, i.openingX) && t < i.openingFront
    ? null
    : Yy(e, -3.15, 3.15) && Yy(t, -2.39, 2.47) && n > X.upper - 0.35
      ? Gy
      : null;
}
function Zy(e, t, n, r = 0.24) {
  ((e -= X.origin[0]), (t -= X.origin[2]), (n -= X.origin[1]));
  let i = X.stairs,
    a = X.bridgeExit,
    o = [
      {
        x: i.x0,
        z: (i.front + i.back) / 2,
        hx: 0.045,
        hz: (i.front - i.back) / 2 - 0.07,
      },
      {
        x: i.x1,
        z: (i.front + i.back) / 2,
        hx: 0.045,
        hz: (i.front - i.back) / 2 - 0.07,
      },
    ];
  return (
    n > X.upper - 0.3
      ? o.push(
          {
            x: X.stove.x,
            z: X.stove.z,
            hx: X.stove.depth / 2,
            hz: X.stove.width / 2,
          },
          { x: X.seat.x, z: X.seat.z, hx: 0.44, hz: 0.24 },
          {
            x: X.table.x,
            z: X.table.z,
            hx: X.table.width / 2,
            hz: X.table.depth / 2,
          },
          {
            x: X.daybed.x,
            z: X.daybed.z,
            hx: X.daybed.width / 2,
            hz: X.daybed.depth / 2,
          },
          {
            x: X.bookcase.x,
            z: X.bookcase.z,
            hx: X.bookcase.width / 2,
            hz: X.bookcase.depth / 2,
          },
          { x: -2.3, z: 1.48, hx: 0.66, hz: 0.75 },
          {
            x: a.openingX,
            z: (a.openingFront - 2.4) / 2,
            hx: 0.045,
            hz: (a.openingFront + 2.4) / 2,
          },
          {
            x: (a.x0 + a.openingX) / 2,
            z: a.openingFront,
            hx: (a.openingX - a.x0) / 2,
            hz: 0.045,
          },
        )
      : o.push(
          { x: 2.96, z: 1.95, hx: 0.18, hz: 0.41 },
          { x: a.openingX, z: -0.55, hx: 0.06, hz: 1.85 },
          ...[a.x0 + 0.045, a.x1 - 0.045].map((e) => ({
            x: e,
            z: (a.front + a.back) / 2,
            hx: 0.035,
            hz: (a.front - a.back) / 2 - 0.08,
          })),
        ),
    o.some(
      (n) =>
        Math.hypot(
          Math.max(0, Math.abs(e - n.x) - n.hx),
          Math.max(0, Math.abs(t - n.z) - n.hz),
        ) < r,
    )
  );
}
function Qy(
  e,
  {
    open: t = !1,
    bridgeOpen: n = !1,
    active: r = !1,
    resting: i = !1,
    transitioning: a = !1,
  } = {},
) {
  if (a) return null;
  if (i) return `stand`;
  if (Math.abs(e.y - Gy) < 0.12 && Math.hypot(e.x - Jy.x, e.z - Jy.z) < 0.68)
    return `sit`;
  if (Math.abs(e.y - (X.origin[1] + X.bridgeExit.floor)) < 0.25) {
    if (Yy(e.x, -5.88, -4.85) && Yy(e.z, -6.35, -5.62))
      return n ? `close-side` : `open-side`;
    if (Yy(e.x, -7.65, -6.95) && Yy(e.z, -6.85, -5.65))
      return r && n ? `close-side` : `enter-side`;
  }
  return e.y > 1.3
    ? null
    : Math.abs(e.x + 3) < 0.8 && e.z > -0.99 && e.z < 0.08
      ? r && t
        ? `close`
        : `enter`
      : Math.abs(e.x + 3) < 0.7 && e.z > -2.3 && e.z < -1.87
        ? t
          ? `close`
          : `open`
        : null;
}
var $y = () => eb(qy);
function eb(e) {
  let t = `off`,
    n = 0,
    r = null,
    i = 0,
    a = {};
  return {
    get active() {
      return t !== `off`;
    },
    get transitioning() {
      return t === `sitting` || t === `standing`;
    },
    get phase() {
      return t;
    },
    get progress() {
      return i;
    },
    get actor() {
      return t === `off` ? null : a;
    },
    sit(e) {
      return (
        t === `off` &&
        ((r = { ...e }),
        Object.assign(a, e, { walk: 0, speed: 0 }),
        (t = `sitting`),
        (n = 0),
        !0)
      );
    },
    stand() {
      return t === `resting` && ((t = `standing`), (n = 0), !0);
    },
    reset() {
      ((t = `off`), (i = 0));
    },
    update(o) {
      if (t === `off` || t === `resting`) return null;
      n += Math.min(0.1, Math.max(0, o));
      let s = Math.min(1, n / 1.5),
        c = s * s * (3 - 2 * s);
      ((i = t === `sitting` ? c : 1 - c),
        (a.x = r.x + (e.x - r.x) * i),
        (a.z = r.z + (e.z - r.z) * i),
        (a.y = r.y + (e.y - r.y) * i));
      let l = Math.atan2(
        Math.sin(e.heading - r.heading),
        Math.cos(e.heading - r.heading),
      );
      if (((a.heading = r.heading + l * i), (a.walk = a.speed = 0), s === 1)) {
        if (t === `sitting`) t = `resting`;
        else return ((t = `off`), { ...r, walk: 0, speed: 0 });
      }
      return null;
    },
  };
}
var tb = Math.PI * 2,
  nb = (e, t = 0, n = 1) => Math.max(t, Math.min(n, e)),
  rb = (e) => ((e = nb(e)), e * e * (3 - 2 * e)),
  ib = (e) => {
    let t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  ab = {
    stone: [Ug[0] + Wg.stone.x, Ug[1] + 1.885, Ug[2] + Wg.stone.z],
    gears: [
      Ug[0] + Wg.input.x,
      Ug[1] + Wg.input.y,
      Ug[2] + (Wg.input.z + Wg.offset.z) / 2,
    ],
    timber: [Ug[0] + Wg.stone.x, Ug[1] + 1.3, Ug[2] + Wg.stone.z],
  };
function ob(e, { doorOpen: t = !1, bridgeOpen: n = !1 } = {}) {
  let r = e.x > -6.4 && e.x < 0.4 && e.z > -6.8 && e.z < -1.3,
    i = r ? rb(((e.y ?? 0.97) - (Gy - 0.85)) / 0.85) : 0,
    a = t ? Math.exp(-(((e.x + 3) / 1.1) ** 2 + ((e.z + 1.5) / 2.1) ** 2)) : 0,
    o = n
      ? Math.exp(-(((e.x + 6.4) / 1.1) ** 2 + ((e.z + 6.1) / 1.4) ** 2))
      : 0;
  return {
    gain: (r ? 1 : 0.38 + 0.34 * Math.max(a, o)) * (1 - 0.73 * i),
    cutoff: (r ? 2400 : 900) * (1 - 0.72 * i),
  };
}
function sb(e) {
  return () => (
    (e = (Math.imul(e, 1664525) + 1013904223) >>> 0),
    e / 4294967296
  );
}
