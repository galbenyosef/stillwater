// assets__index-BogB70q- 56 — math
// Lines 59882-60201 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Kx(e) {
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
            ? i / Vx.climbDuration
            : t === `exiting`
              ? 1 - i / Vx.climbDuration
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
      Object.assign(e, Vx.water, { y: q, heading: -Math.PI / 2 }),
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
        if (!Gx(e.x + (Vx.water.x - e.x) * r, e.z + (Vx.water.z - e.z) * r, n))
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
      o += J(x, 0, 0.1);
      let k = null;
      for (; o + 1e-9 >= 1 / 120;) {
        let x = 1 / 120;
        if (((o -= x), (s += x), (i += x), t === `approach`)) {
          let t = n[r] ?? Vx.landing,
            i = t.x - e.x,
            a = t.z - e.z,
            o = Math.hypot(i, a),
            s = Math.min(o, 0.7 * x);
          (o > 0.001 &&
            ((e.x += (i / o) * s),
            (e.z += (a / o) * s),
            (e.heading += J(
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
          ((e.heading = a + Hx(Vx.landing.heading, a) * Ux(i / 0.7)),
            i >= 0.7 && (y(`entering`), _()));
          continue;
        }
        if (t === `entering` || t === `exiting`) {
          let n = t === `entering`,
            r = J(i / Vx.climbDuration, 0, 1),
            a = Bx(n ? r : 1 - r);
          ((e.x = a.x),
            (e.z = a.z),
            (e.y = q),
            (e.heading = Vx.landing.heading),
            _(),
            (e.swim.progress = n ? r : 1 - r),
            r === 1 &&
              (n
                ? (b(), (k = `swim`))
                : (y(`dry`),
                  Object.assign(e, Vx.landing),
                  (e.swim = null),
                  v(),
                  (k = `foot`))));
          continue;
        }
        if (t !== `surface` && t !== `return`) continue;
        let E = t === `return`,
          A = E ? Vx.water : T;
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
              ? Hx(Vx.landing.heading, e.heading)
              : N > 0.001
                ? Hx(Math.atan2(j, M), e.heading)
                : 0,
          F = 1.65 - 0.7 * c;
        ((m += (J(P * 2.8, -F, F) - m) * (1 - Math.exp(-0.041666666666666664))),
          (e.heading += m * x));
        let I = g || (E && Math.abs(P) > 0.45),
          ee = I ? 0 : N * (0.15 + 0.85 * Math.max(0, Math.cos(P)));
        ((d += (ee - d) * (1 - Math.exp(-0.03333333333333333))),
          c < 0.025 && d < 0.025
            ? (u = 0.08)
            : (u += (x / Vx.strokeDuration) * (0.82 + 0.18 * d)));
        let te = Nx(u),
          ne = Math.sin(e.heading),
          re = Math.cos(e.heading),
          ie = D ? 9 : I || N < 0.01 ? 3 : 1.15,
          ae = D || I ? 0 : d * (0.27 + 1.65 * te.pull + 4.2 * te.kick),
          oe = E
            ? Math.max(0.5, Math.hypot(f, p) * Math.exp(-0.025))
            : Vx.speed;
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
        let fe = e.speed > 0.02 ? Math.max(d, J(e.speed / 0.65, 0, 1)) : 0;
        if (
          ((c +=
            (fe - c) *
            (1 - Math.exp(-0.008333333333333333 * (fe > c ? 2.4 : 1.8)))),
          l < 0.001 && (f = p = l = 0),
          E && g && e.speed < 0.035)
        ) {
          let t = 1 - Math.exp(-0.05);
          ((e.x += (Vx.water.x - e.x) * t),
            (e.z += (Vx.water.z - e.z) * t),
            Math.hypot(e.x - Vx.water.x, e.z - Vx.water.z) < 0.001 &&
              Math.abs(P) < 0.02 &&
              c < 0.015 &&
              (Object.assign(e, Vx.water),
              (e.heading = Vx.landing.heading),
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
