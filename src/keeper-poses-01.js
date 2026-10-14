// keeper-poses-01.js — the keeper's pose system (idle/walk/fish poses, hand IK, the mill keeper rig)
// Lines 59708-60201 of readable/assets__index-BogB70q-.pretty.js (cluster keeper-poses, statement-aligned).
var Ax = 2.45,
  jx = (e, t, n) => ((n = clampValue((n - e) / (t - e), 0, 1)), n * n * (3 - 2 * n)),
  Mx = (e, t, n) =>
    n > e && n < t ? Math.sin((Math.PI * (n - e)) / (t - e)) ** 2 : 0;
function Nx(e) {
  let t = ((e % 1) + 1) % 1;
  return {
    phase: t,
    pull: Mx(0.05, 0.4, t),
    kick: Mx(0.48, 0.75, t),
    breath: Mx(0.13, 0.58, t),
    recover: jx(0.25, 0.48, t) * (1 - jx(0.5, 0.76, t)),
  };
}
function Px(e, t, n) {
  let r = ((t % 1) + 1) % 1,
    i = e.length - 1,
    a = 0;
  for (; a < i - 1 && r > e[a + 1][0];) a++;
  let o = e[a],
    s = e[a + 1],
    c = a ? e[a - 1] : e[i - 1],
    l = a + 2 <= i ? e[a + 2] : e[1],
    u = a ? c[0] : c[0] - 1,
    d = a + 2 <= i ? l[0] : l[0] + 1,
    f = s[0] - o[0],
    p = (r - o[0]) / f,
    m = p * p,
    h = m * p,
    g = [];
  for (let e = 1; e <= 3; e++) {
    let t = (e, t, n, r) => ((t - e) * (n - t) <= 0 ? 0 : (n - e) / r),
      n = t(c[e], o[e], s[e], s[0] - u) * f,
      r = t(o[e], s[e], l[e], d - o[0]) * f;
    g.push(
      (2 * h - 3 * m + 1) * o[e] +
        (h - 2 * m + p) * n +
        (-2 * h + 3 * m) * s[e] +
        (h - m) * r,
    );
  }
  return n.set(...g);
}
var fisherClimbSpec = Object.freeze({
    landing: Object.freeze({
      x: -4.25,
      y: 0.482,
      z: 3.35,
      heading: Math.PI / 2,
    }),
    water: Object.freeze({ x: -5.85, z: 3.35 }),
    ladderX: -4.69,
    railSpacing: 0.5,
    bottom: -1.32,
    climbDuration: 9.6,
    rungTop: 0.4225,
    rungSpacing: 0.32,
  }),
  Ix = (e) => ((e = clampValue(e, 0, 1)), e * e * (3 - 2 * e)),
  Lx = (e, t, n) => Ix((n - e) / (t - e)),
  Rx = (e, t) => {
    let n = 0;
    for (; n < e.length - 2 && t > e[n + 1][0];) n++;
    let r = e[n],
      i = e[n + 1],
      a = Lx(r[0], i[0], t);
    return r.slice(1).map((e, t) => e + (i[t + 1] - e) * a);
  };
function fisherClimbAt(e, t = 1.023) {
  let n = clampValue(e, 0, 1) * fisherClimbSpec.climbDuration,
    [r, i, a] = Rx(
      [
        [0, -4.25, 0.482 + t, 0],
        [0.8, -4.82, 1.27, 0],
        [1, -4.82, 1.27, -0.025],
        [1.8, -4.86, 1.24, -0.025],
        [2, -4.86, 1.24, 0.025],
        [2.8, -5.02, 0.98, 0.025],
        [3, -5.02, 0.98, -0.025],
        [3.8, -5.02, 0.66, -0.025],
        [4, -5.02, 0.66, 0.025],
        [4.8, -5.02, 0.34, 0.025],
        [5, -5.02, 0.34, -0.025],
        [5.8, -5.02, 0.02, -0.025],
        [6, -5.02, 0.02, 0.025],
        [6.8, -5.02, q - 0.49, 0.025],
        [7.65, -5.02, q - 0.49, 0],
        [9.6, fisherClimbSpec.water.x, q - 0.49, 0],
      ],
      n,
    ),
    o = {},
    s = {};
  for (let [e, t] of [
    [`r`, 1],
    [`l`, 2],
  ]) {
    let r = e === `r` ? 0 : 1,
      i = fisherClimbSpec.landing.y,
      a = 1,
      c = 0;
    for (let e = t; e <= 6; e += 2, r += 2) {
      let o = Lx(e, e + 0.8, n),
        s = fisherClimbSpec.rungTop - r * fisherClimbSpec.rungSpacing;
      if (
        n < e ||
        ((i += (s - i) * o),
        (a = 1 - Lx(t, t + 0.8, n)),
        (c = Math.sin(Math.PI * o)),
        o < 1)
      )
        break;
    }
    o[e] = {
      sole: i + 0.045 * c,
      dock: a,
      back: 0.075 * c,
      weight: 1 - Lx(e === `r` ? 6.9 : 7.15, e === `r` ? 7.45 : 7.65, n),
    };
    let l = e === `l` ? 2.85 : 3.5,
      u = 1.24,
      d = 0;
    for (let e = 0; e < 3; e++) {
      let t = Lx(l + e * 1.3, l + e * 1.3 + 0.65, n);
      ((u -= 0.4 * t), (d += 0.06 * Math.sin(Math.PI * t)));
    }
    s[e] = {
      y: u,
      back: d,
      weight:
        Lx(e === `r` ? 0.15 : 0.4, e === `r` ? 0.8 : 1.05, n) *
        (1 - Lx(e === `r` ? 7.15 : 6.9, e === `r` ? 7.65 : 7.4, n)),
    };
  }
  return {
    hip: { x: r, y: i, z: fisherClimbSpec.water.z + a },
    feet: o,
    hands: s,
    standing: 1 - Lx(0, 0.8, n),
    release: Lx(6.8, 7.65, n),
    turn: Lx(7.65, 9.6, n),
  };
}
var Bx = (e, t) => fisherClimbAt(e, t).hip,
  keeperMotionSpec = Object.freeze({ ...fisherClimbSpec, speed: 0.92, strokeDuration: Ax }),
  Hx = (e, t) => Math.atan2(Math.sin(e - t), Math.cos(e - t)),
  Ux = (e) => ((e = clampValue(e, 0, 1)), e * e * (3 - 2 * e));
function Wx(e, t) {
  return e === `foot`
    ? t.y < 0.55 &&
      t.x >= -4.6 &&
      t.x <= -2.5 &&
      t.z > 1.3 &&
      t.z < 3.7 &&
      Math.hypot(t.x - keeperMotionSpec.landing.x, t.z - keeperMotionSpec.landing.z) < 2
      ? `swim`
      : null
    : e === `swim` && Math.hypot(t.x - keeperMotionSpec.water.x, t.z - keeperMotionSpec.water.z) < 1.25
      ? `climb`
      : null;
}
function Gx(e, t, n = null) {
  if (!insideIsland(e, t, 0.78, 1.65)) return !1;
  if (n) {
    let r = e - n.x,
      i = t - n.z,
      a = Math.sin(n.heading),
      o = Math.cos(n.heading),
      s = r * o - i * a,
      c = r * a + i * o;
    if (Math.abs(s) < 1.4 && c > -2.9 && c < 2.1) return !1;
  }
  return !0;
}
function createFishingState(e) {
  let t = `dry`,
    n = null,
    r = 0,
    i = 0,
    a = 0,
    o = 0,
    s = 0,
    c = 0,
    l = 0,
    u = 0.08,
    d = 0,
    f = 0,
    p = 0,
    m = 0,
    h = null,
    g = !1,
    _ = () => {
      e.swim = {
        phase: t,
        progress:
          t === `entering`
            ? i / keeperMotionSpec.climbDuration
            : t === `exiting`
              ? 1 - i / keeperMotionSpec.climbDuration
              : 1,
        time: s,
        cycle: u,
        effort: c,
        turn: m,
      };
    },
    v = () => {
      ((e.walk = e.speed = e.turn = e.look = 0),
        (e.pivot = null),
        (e.stride = 1));
    };
  function y(n) {
    ((t = n), (i = 0), (a = e.heading));
  }
  function b() {
    (y(`surface`),
      Object.assign(e, keeperMotionSpec.water, { y: q, heading: -Math.PI / 2 }),
      _());
  }
  return {
    get active() {
      return t !== `dry`;
    },
    get transitioning() {
      return t !== `dry` && t !== `surface`;
    },
    get phase() {
      return t;
    },
    reset() {
      ((t = `dry`),
        (e.swim = null),
        (n = h = null),
        (g = !1),
        (i = s = c = l = o = d = f = p = m = 0),
        (u = 0.08));
    },
    start(e) {
      return t !== `dry` || !e?.length
        ? !1
        : (v(),
          (h = null),
          (g = !1),
          (c = l = d = f = p = m = 0),
          (u = 0.08),
          (n = e),
          (r = 1),
          y(`approach`),
          !0);
    },
    leave(n) {
      if (t !== `surface` || Wx(`swim`, e) !== `climb`) return !1;
      for (let t = 0; t <= 20; t++) {
        let r = t / 20;
        if (!Gx(e.x + (keeperMotionSpec.water.x - e.x) * r, e.z + (keeperMotionSpec.water.z - e.z) * r, n))
          return !1;
      }
      return ((h = null), (g = !1), y(`return`), !0);
    },
    update(
      x,
      {
        x: S = 0,
        z: C = 0,
        angle: w = 0,
        target: T = null,
        blocked: E = !1,
        brake: D = !1,
        boat: O = null,
      } = {},
    ) {
      if (t === `dry`) return null;
      if (E) return ((e.speed = 0), (o = 0), null);
      o += clampValue(x, 0, 0.1);
      let k = null;
      for (; o + 1e-9 >= 1 / 120;) {
        let x = 1 / 120;
        if (((o -= x), (s += x), (i += x), t === `approach`)) {
          let t = n[r] ?? keeperMotionSpec.landing,
            i = t.x - e.x,
            a = t.z - e.z,
            o = Math.hypot(i, a),
            s = Math.min(o, 0.7 * x);
          (o > 0.001 &&
            ((e.x += (i / o) * s),
            (e.z += (a / o) * s),
            (e.heading += clampValue(
              Hx(Math.atan2(i, a), e.heading),
              -2.8 * x,
              2.8 * x,
            ))),
            (e.speed = s / x),
            (e.walk = e.speed / 0.7),
            (e.gait += s / Qb),
            o - s < 0.001 && ++r >= n.length && (v(), y(`align`)));
          continue;
        }
        if (t === `align`) {
          ((e.heading = a + Hx(keeperMotionSpec.landing.heading, a) * Ux(i / 0.7)),
            i >= 0.7 && (y(`entering`), _()));
          continue;
        }
        if (t === `entering` || t === `exiting`) {
          let n = t === `entering`,
            r = clampValue(i / keeperMotionSpec.climbDuration, 0, 1),
            a = Bx(n ? r : 1 - r);
          ((e.x = a.x),
            (e.z = a.z),
            (e.y = q),
            (e.heading = keeperMotionSpec.landing.heading),
            _(),
            (e.swim.progress = n ? r : 1 - r),
            r === 1 &&
              (n
                ? (b(), (k = `swim`))
                : (y(`dry`),
                  Object.assign(e, keeperMotionSpec.landing),
                  (e.swim = null),
                  v(),
                  (k = `foot`))));
          continue;
        }
        if (t !== `surface` && t !== `return`) continue;
        let E = t === `return`,
          A = E ? keeperMotionSpec.water : T;
        A
          ? (!h || h.x !== A.x || h.z !== A.z) &&
            ((h = { x: A.x, z: A.z }), (g = !1))
          : ((h = null), (g = !1));
        let j = S * Math.cos(w) - C * Math.sin(w),
          M = -S * Math.sin(w) - C * Math.cos(w);
        if (A) {
          ((j = A.x - e.x), (M = A.z - e.z));
          let t = Math.hypot(j, M),
            n = E ? 0.025 : 0.09,
            r = Math.hypot(f, p),
            i = t > 0 ? (f * j + p * M) / t : 0,
            a = r > 0 ? Math.abs(f * M - p * j) / r : t;
          if (((t < n || (i > 0 && a < n && t < n + i / 3)) && (g = !0), g))
            j = M = 0;
          else {
            let e = Math.min(1, t / 0.7);
            ((j = (j / t) * e), (M = (M / t) * e));
          }
        }
        D && (j = M = 0);
        let N = Math.min(1, Math.hypot(j, M)),
          P =
            E && g
              ? Hx(keeperMotionSpec.landing.heading, e.heading)
              : N > 0.001
                ? Hx(Math.atan2(j, M), e.heading)
                : 0,
          F = 1.65 - 0.7 * c;
        ((m += (clampValue(P * 2.8, -F, F) - m) * (1 - Math.exp(-0.041666666666666664))),
          (e.heading += m * x));
        let I = g || (E && Math.abs(P) > 0.45),
          ee = I ? 0 : N * (0.15 + 0.85 * Math.max(0, Math.cos(P)));
        ((d += (ee - d) * (1 - Math.exp(-0.03333333333333333))),
          c < 0.025 && d < 0.025
            ? (u = 0.08)
            : (u += (x / keeperMotionSpec.strokeDuration) * (0.82 + 0.18 * d)));
        let te = Nx(u),
          ne = Math.sin(e.heading),
          re = Math.cos(e.heading),
          ie = D ? 9 : I || N < 0.01 ? 3 : 1.15,
          ae = D || I ? 0 : d * (0.27 + 1.65 * te.pull + 4.2 * te.kick),
          oe = E
            ? Math.max(0.5, Math.hypot(f, p) * Math.exp(-0.025))
            : keeperMotionSpec.speed;
        ((f = f * Math.exp(-0.008333333333333333 * ie) + ne * ae * x),
          (p = p * Math.exp(-0.008333333333333333 * ie) + re * ae * x));
        let L = f * re - p * ne,
          se = 1 - Math.exp(-0.029166666666666667);
        ((f -= re * L * se),
          (p += ne * L * se),
          (l = Math.hypot(f, p)),
          l > oe && ((f *= oe / l), (p *= oe / l), (l = oe)));
        let ce = f * x,
          le = p * x,
          ue = e.x,
          de = e.z;
        (Gx(e.x + ce, e.z + le, O)
          ? ((e.x += ce), (e.z += le))
          : (Gx(e.x + ce, e.z, O) ? (e.x += ce) : (f = 0),
            Gx(e.x, e.z + le, O) ? (e.z += le) : (p = 0)),
          (e.speed = Math.hypot(e.x - ue, e.z - de) / x));
        let fe = e.speed > 0.02 ? Math.max(d, clampValue(e.speed / 0.65, 0, 1)) : 0;
        if (
          ((c +=
            (fe - c) *
            (1 - Math.exp(-0.008333333333333333 * (fe > c ? 2.4 : 1.8)))),
          l < 0.001 && (f = p = l = 0),
          E && g && e.speed < 0.035)
        ) {
          let t = 1 - Math.exp(-0.05);
          ((e.x += (keeperMotionSpec.water.x - e.x) * t),
            (e.z += (keeperMotionSpec.water.z - e.z) * t),
            Math.hypot(e.x - keeperMotionSpec.water.x, e.z - keeperMotionSpec.water.z) < 0.001 &&
              Math.abs(P) < 0.02 &&
              c < 0.015 &&
              (Object.assign(e, keeperMotionSpec.water),
              (e.heading = keeperMotionSpec.landing.heading),
              (c = l = d = f = p = m = e.speed = 0),
              y(`exiting`)));
        }
        ((e.y = q), _());
      }
      return k;
    },
  };
}
var qx = 2.6,
  Jx = [
    [0, 0.52, -0.66, 0.06],
    [0.12, 0.53, -0.5, 0.03],
    [0.27, 0.57, 0.18, -0.04],
    [0.43, 0.61, 0.88, -0.09],
    [0.5, 0.61, 1, -0.06],
    [0.62, 0.58, 0.8, 0.015],
    [0.77, 0.54, 0.08, 0.06],
    [0.91, 0.52, -0.57, 0.07],
    [1, 0.52, -0.66, 0.06],
  ],
  Yx = [
    [0, 0.14, -1, -0.3],
    [0.22, 0.22, -1.06, -0.26],
    [0.5, 0.17, -1.23, -0.06],
    [0.7, 0.11, -1.19, -0.02],
    [0.88, 0.12, -1.06, -0.18],
    [1, 0.14, -1, -0.3],
  ];
function Xx() {
  let e = new U(),
    t = {
      upper: new U(),
      forearm: new U(),
      fingers: new U(),
      palm: new U(),
      foot: new U(),
      toe: new U(),
    };
  return (n, r) => {
    let i = n / qx + (r < 0 ? 0.035 : 0);
    Px(Jx, i, e);
    let a = e.x * 0.43,
      o = e.y,
      s = e.z;
    (t.upper.set(r * Math.sin(a), -Math.cos(a), 0.23).normalize(),
      t.forearm.set(
        r * Math.sin(o) * Math.cos(s),
        Math.sin(s),
        Math.cos(o) * Math.cos(s),
      ),
      t.fingers.copy(t.forearm),
      (t.fingers.y -= 0.09),
      t.fingers.normalize());
    let c = 0.9 * Math.sin(i * Math.PI * 2 + 0.12);
    (t.palm.set(r * Math.cos(o) * c, -1, -Math.sin(o) * c),
      t.palm.addScaledVector(t.fingers, -t.palm.dot(t.fingers)).normalize());
    let l = n / 2.3 + (r < 0 ? 0.5 : 0);
    (Px(Yx, l, t.foot), (t.foot.x *= r));
    let u = 0.5 - 0.5 * Math.cos(l * Math.PI * 2);
    return (
      t.toe
        .set(r * 0.25 * (1 - u), -Zx(0.8, 0.52, u), Zx(0.55, 0.84, u))
        .normalize(),
      t
    );
  };
}
var Zx = (e, t, n) => e + (t - e) * n,
  Qx = new U(1, 0, 0),
  $x = new U(0, 1, 0),
  eS = (e, t, n) => e + (t - e) * n,
  tS = [
    [0, 0.1, -0.055, 0.84],
    [0.1, 0.19, -0.07, 0.82],
    [0.25, 0.49, -0.11, 0.64],
    [0.4, 0.3, -0.18, 0.39],
    [0.51, 0.105, -0.16, 0.44],
    [0.68, 0.1, -0.055, 0.84],
    [0.88, 0.1, -0.055, 0.84],
    [1, 0.1, -0.055, 0.84],
  ],
  nS = [
    [0, 0.105, -0.34, -0.9],
    [0.22, 0.105, -0.34, -0.9],
    [0.45, 0.26, -0.3, -0.29],
    [0.53, 0.36, -0.32, -0.34],
    [0.65, 0.38, -0.42, -0.65],
    [0.77, 0.105, -0.34, -0.9],
    [1, 0.105, -0.34, -0.9],
  ];
