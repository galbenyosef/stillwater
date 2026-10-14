// mill-state-01.js — the mill: state machine, doors/bridge, the drivetrain animation and its machinery helpers
// Lines 56957-57434 of readable/assets__index-BogB70q-.pretty.js (cluster mill-state, statement-aligned).
var Wy = millLayout,
  Gy = millLayout.origin[1] + millLayout.upper,
  Ky = Object.freeze({
    x: millLayout.origin[0] + millLayout.stove.x,
    y: Gy + 0.59,
    z: millLayout.origin[2] + millLayout.stove.z,
  }),
  qy = Object.freeze({
    x: millLayout.origin[0] + millLayout.seat.x,
    y: Gy,
    z: millLayout.origin[2] + millLayout.seat.z,
    heading: 0,
  }),
  Jy = Object.freeze({
    ...qy,
    x: millLayout.origin[0] + millLayout.seat.approachX,
    z: millLayout.origin[2] + millLayout.seat.approachZ,
  }),
  Yy = (e, t, n) => e >= t && e <= n;
function Xy(e, t, n) {
  ((e -= millLayout.origin[0]), (t -= millLayout.origin[2]), (n -= millLayout.origin[1]));
  let r = millLayout.stairs,
    i = millLayout.bridgeExit;
  if (
    (Yy(e, -0.72, 0.72) && Yy(t, 2.4, 3.2) && n < 1.2) ||
    (Yy(e, -1.07, 3.15) && Yy(t, r.front, 2.49) && n < 1.2) ||
    (Yy(e, i.x0, -1.07) && Yy(t, 1.4, 2.49) && n < 1.2) ||
    (Yy(e, i.x0, i.x1) && Yy(t, i.front, 1.42) && n < 1.2)
  )
    return millLayout.origin[1] + millLayout.ground;
  if (Yy(e, i.x0, i.x1) && Yy(t, i.back, i.front) && n < millLayout.upper - 0.35) {
    let e = Math.min(
      i.steps,
      Math.max(1, Math.ceil(((i.front - t) / (i.front - i.back)) * i.steps)),
    );
    return millLayout.origin[1] + millLayout.ground + ((i.floor - millLayout.ground) * e) / i.steps;
  }
  if (
    (Yy(e, i.x0, i.x1) && Yy(t, -2.4, i.back) && n < millLayout.upper - 0.35) ||
    (Yy(e, -3.8, i.x0) && Yy(t, -2.42, -1.18) && n < millLayout.upper - 0.35)
  )
    return millLayout.origin[1] + i.floor;
  if (Yy(e, r.x0, r.x1) && Yy(t, r.back, r.front)) {
    let e = Math.min(
      r.steps,
      Math.max(1, Math.ceil(((r.front - t) / (r.front - r.back)) * r.steps)),
    );
    return millLayout.origin[1] + millLayout.ground + ((millLayout.upper - millLayout.ground) * e) / r.steps;
  }
  return Yy(e, i.x0, i.openingX) && t < i.openingFront
    ? null
    : Yy(e, -3.15, 3.15) && Yy(t, -2.39, 2.47) && n > millLayout.upper - 0.35
      ? Gy
      : null;
}
function Zy(e, t, n, r = 0.24) {
  ((e -= millLayout.origin[0]), (t -= millLayout.origin[2]), (n -= millLayout.origin[1]));
  let i = millLayout.stairs,
    a = millLayout.bridgeExit,
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
    n > millLayout.upper - 0.3
      ? o.push(
          {
            x: millLayout.stove.x,
            z: millLayout.stove.z,
            hx: millLayout.stove.depth / 2,
            hz: millLayout.stove.width / 2,
          },
          { x: millLayout.seat.x, z: millLayout.seat.z, hx: 0.44, hz: 0.24 },
          {
            x: millLayout.table.x,
            z: millLayout.table.z,
            hx: millLayout.table.width / 2,
            hz: millLayout.table.depth / 2,
          },
          {
            x: millLayout.daybed.x,
            z: millLayout.daybed.z,
            hx: millLayout.daybed.width / 2,
            hz: millLayout.daybed.depth / 2,
          },
          {
            x: millLayout.bookcase.x,
            z: millLayout.bookcase.z,
            hx: millLayout.bookcase.width / 2,
            hz: millLayout.bookcase.depth / 2,
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
  if (Math.abs(e.y - (millLayout.origin[1] + millLayout.bridgeExit.floor)) < 0.25) {
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
var $y = () => createMillState(qy);
function createMillState(e) {
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
function cb(e, t, n = 0) {
  let r = t === `stone` || t === `axle`,
    i = r
      ? t === `stone`
        ? 19.7
        : 23.9
      : t === `contact`
        ? 0.22 + n * 0.017
        : 0.86 + n * 0.11,
    a = e.sampleRate,
    o = Math.ceil(i * a),
    s = r ? Math.ceil(a * 0.6) : 0,
    c = new Float32Array(o + s),
    l = sb(
      4187 +
        n * 101 +
        (t === `stone` ? 1 : t === `axle` ? 2 : t === `contact` ? 3 : 4),
    ),
    u = 1 - Math.exp((-tb * (t === `stone` ? 290 : 640)) / a),
    d = 1 - Math.exp((-tb * 28) / a),
    f = 0,
    p = 0,
    m = 0;
  for (let e = 0; e < c.length; e++) {
    let o = e / a,
      s = l() * 2 - 1;
    if (((f += u * (s - f)), (p += d * (s - p)), r)) {
      c[e] = (f - p) * (t === `stone` ? 1.05 : 0.6);
      continue;
    }
    let h = o / i,
      g = Math.sin(Math.PI * nb(h)) ** (t === `contact` ? 0.35 : 1.3);
    if (t === `contact`) {
      let t = 104 + n * 11,
        r = Math.exp(-o * 25);
      c[e] =
        g *
        r *
        ((f - p) * 1.2 +
          Math.sin(tb * t * o) * 0.45 +
          Math.sin(tb * t * 1.73 * o) * 0.23 +
          Math.sin(tb * t * 3.17 * o) * 0.08);
    } else {
      m +=
        (tb *
          (146 + n * 17 + 34 * Math.sin(h * Math.PI) + 11 * Math.sin(o * 19))) /
        a;
      let t = 0.64 + 0.2 * Math.sin(o * 31) + 0.16 * Math.sin(o * 67 + n);
      c[e] =
        g *
        t *
        ((f - p) * 0.55 + Math.sin(m) * 0.18 + Math.sin(m * 2.63) * 0.07);
    }
  }
  let h = e.createBuffer(1, o, a),
    g = h.getChannelData(0);
  for (let e = 0; e < o; e++) {
    let t = e < s ? 0.5 - 0.5 * Math.cos((Math.PI * e) / s) : 1;
    g[e] = e < s ? c[o + e] * (1 - t) + c[e] * t : c[e];
  }
  let _ = 0,
    v = 0;
  for (let e of g) v += e;
  v /= o;
  let y = 0;
  for (let e = 0; e < o; e++)
    ((g[e] -= v), (_ += g[e] * g[e]), (y = Math.max(y, Math.abs(g[e]))));
  let b = Math.min((r ? 0.1 : 0.14) / Math.sqrt(_ / o), 0.65 / (y || 1));
  for (let e = 0; e < o; e++) g[e] *= b;
  return (r || ((g[0] = 0), (g[o - 1] = 0)), h);
}
function lb(e, t, n = Wg.input.teeth) {
  if (!Number.isFinite(e) || !Number.isFinite(t) || Math.abs(t - e) > 0.25)
    return [];
  let r = Math.floor((e * n) / tb),
    i = Math.floor((t * n) / tb),
    a = Math.sign(i - r),
    o = [];
  for (let e = r + a; a && e !== i + a; e += a) o.push(e);
  return o;
}
function ub(e, t) {
  let n = {},
    r = new Set(),
    i = new WeakMap(),
    a = (e, t, n, r = 0.12) => {
      Math.abs((i.get(e) ?? 1 / 0) - t) < 0.001 ||
        (i.set(e, t), e.setTargetAtTime(t, n, r));
    };
  for (let [r, i] of Object.entries(ab)) {
    let a = e.createBiquadFilter(),
      o = e.createGain(),
      s = e.createPanner();
    ((a.type = `lowpass`),
      (a.frequency.value = 2400),
      (a.Q.value = 0.5),
      (o.gain.value = 0),
      (s.panningModel = `HRTF`),
      (s.distanceModel = `inverse`),
      (s.refDistance = 1.6),
      (s.rolloffFactor = 1.3),
      (s.maxDistance = 70),
      ([s.positionX.value, s.positionY.value, s.positionZ.value] = i),
      a.connect(o),
      o.connect(s),
      s.connect(t),
      (n[r] = { filter: a, gain: o, panner: s }));
  }
  let o = {};
  for (let [t, r] of [
    [`stone`, `stone`],
    [`axle`, `gears`],
  ]) {
    let i = e.createBufferSource();
    ((i.buffer = cb(e, t)),
      (i.loop = !0),
      i.connect(n[r].filter),
      i.start(),
      (o[t] = i));
  }
  let s = Array.from({ length: 6 }, (t, n) => cb(e, `contact`, n)),
    c = Array.from({ length: 4 }, (t, n) => cb(e, `creak`, n));
  function l(t, i, a, o, s) {
    let c = e.createBufferSource(),
      l = e.createGain();
    ((c.buffer = t[Math.floor(ib(a + 7) * t.length)]),
      (c.playbackRate.value = s),
      (l.gain.value = o),
      c.connect(l),
      l.connect(n[i].filter),
      r.add(c),
      (c.onended = () => {
        (c.disconnect(), l.disconnect(), r.delete(c));
      }),
      c.start());
  }
  let u = null;
  return {
    reset() {
      u = null;
      for (let e of r) e.stop();
    },
    update(
      t,
      {
        listener: r,
        forward: i = { x: 0, y: 0, z: -1 },
        wheelAngle: d,
        active: f = !1,
        doorOpen: p = !1,
        bridgeOpen: m = !1,
        earHeight: h = 1.55,
      },
    ) {
      let g = Number.isFinite(d) ? d : 0,
        _ = e.currentTime,
        v = { x: r.x, y: (r.y ?? 0.97) + h, z: r.z },
        y = e.listener;
      for (let e of [`x`, `y`, `z`]) {
        let t = e.toUpperCase();
        (a(y[`position` + t], v[e], _, 0.04),
          a(y[`forward` + t], i[e], _, 0.04));
      }
      let b = u ? t - u.t : 0,
        x = u ? d - u.angle : 0,
        S =
          f && b > 0 && b < 0.5 && Math.abs(x) < 0.25
            ? nb(Math.abs(x / b) / waterwheelSpec.angularSpeed, 0, 3)
            : 0,
        C = ob(r, { doorOpen: p, bridgeOpen: m }),
        w = Math.sqrt(Math.min(S, 1.6)),
        T = ((g * Wg.input.teeth) / Wg.offset.teeth) * 4;
      for (let [e, t] of Object.entries(n)) {
        let n =
          e === `stone`
            ? 0.58 * (0.94 + 0.06 * Math.cos(T))
            : e === `gears`
              ? 0.24
              : 0.23;
        (a(t.gain.gain, C.gain * n * w, _, 0.25),
          a(t.filter.frequency, C.cutoff * (e === `stone` ? 0.4 : 1), _, 0.3));
      }
      for (let e of Object.values(o))
        a(e.playbackRate, nb(S, 0.25, 2), _, 0.22);
      if (S > 0.02) {
        for (let e of lb(u.angle, d))
          l(s, `gears`, e, 0.4 + 0.4 * ib(e), 0.93 + 0.14 * ib(e + 1));
        for (let e of lb(
          u.angle,
          d,
          (Wg.input.teeth / Wg.offset.teeth) * Wg.crown.teeth,
        ))
          l(
            s,
            `timber`,
            e + 500,
            0.2 + 0.23 * ib(e + 4),
            0.72 + 0.09 * ib(e + 3),
          );
        let e = Math.min(u.angle, d),
          t = Math.max(u.angle, d);
        for (let n = Math.floor(e / 0.62); n <= Math.floor(t / 0.62); n++) {
          let r = (n + 0.18 + 0.64 * ib(n + 91)) * 0.62;
          e < r &&
            t >= r &&
            l(
              c,
              `timber`,
              n + 1e3,
              0.5 + 0.32 * ib(n + 23),
              0.89 + 0.16 * ib(n + 39),
            );
        }
      }
      u = Number.isFinite(d) ? { t, angle: d } : null;
    },
  };
}
