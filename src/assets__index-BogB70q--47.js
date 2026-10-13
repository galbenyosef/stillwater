// assets__index-BogB70q- 47 — math
// Lines 57217-57549 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
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
            ? nb(Math.abs(x / b) / Yh.angularSpeed, 0, 3)
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
function db(
  e,
  {
    listener: t = e,
    motorActive: n = !1,
    indoors: r = !1,
    rain: i = 0,
    millFlow: a = 1,
  } = {},
) {
  let o = Math.hypot(t.x - 1.16, t.z + 4.2),
    s = n
      ? Math.max(Math.abs(e.speed || 0), Math.abs(e.turnRate || 0) * 0.65)
      : 0,
    c = Math.sqrt(Math.min(1, s / Xf)),
    l = Math.max(0, Math.min(1, i)),
    u = Math.hypot(t.x + 3, t.z + 4.2),
    d = Math.hypot(t.x - Ky.x, t.z - Ky.z),
    f = Math.max(0, Math.min(1, ((t.y ?? 0) - (Gy - 0.4)) / 0.4));
  return {
    water:
      (0.16 +
        (0.22 * Math.sqrt(Math.max(0, Math.min(1, a)))) / (1 + (o / 5) ** 2)) *
      (r ? 0.72 : 1),
    birds: (r ? 0.16 : 0.45) * (1 - l * 0.72),
    rain: l * (r ? 0.1 : 0.34),
    roof: l * (r ? 0.4 : 0.09 / (1 + (u / 6) ** 2)),
    fire: r ? (f * 0.44) / (1 + (d / 3) ** 2) : 0,
    motor: Math.min(1, s / 0.18) * (0.12 + 0.72 * c),
    motorRate: 0.85 + 0.5 * c,
  };
}
function fb(e, t) {
  let n = 11.3,
    r = Math.ceil(e.sampleRate * n),
    i = {};
  for (let a of [`rain`, `roof`]) {
    let o = e.createBuffer(1, r, e.sampleRate),
      s = o.getChannelData(0);
    if (a === `rain`) {
      let e = 0;
      for (let t = 0; t < r; t++) {
        let n = Math.random() * 2 - 1;
        ((e += 0.12 * (n - e)), (s[t] = n * 0.32 + e * 0.55));
      }
    } else
      for (let t = 0; t < n; t += 0.024 + Math.random() * 0.1) {
        let n = Math.floor(t * e.sampleRate),
          i = Math.ceil(e.sampleRate * 0.065),
          a = 0.12 + Math.random() * 0.35,
          o = 430 + Math.random() * 1050;
        for (let t = 0; t < i; t++) {
          let i = t / e.sampleRate,
            c = Math.exp(-i * 90) * Math.min(1, i * 2500);
          s[(n + t) % r] +=
            ((Math.random() * 2 - 1) * 0.7 +
              Math.sin(i * o * Math.PI * 2) * 0.3) *
            c *
            a;
        }
      }
    let c = e.createBufferSource(),
      l = e.createBiquadFilter(),
      u = e.createGain();
    ((c.buffer = o),
      (c.loop = !0),
      (u.gain.value = 0),
      (l.type = `lowpass`),
      (l.frequency.value = a === `rain` ? 3800 : 2600),
      c.connect(l),
      l.connect(u),
      u.connect(t),
      c.start(),
      (i[a] = { source: c, gain: u }));
  }
  return i;
}
function pb(e, t) {
  let n = Math.ceil(e.sampleRate * 17.3),
    r = e.createBuffer(1, n, e.sampleRate),
    i = r.getChannelData(0),
    a = 0;
  for (let e = 0; e < n; e++) {
    let t = Math.random() * 2 - 1;
    ((a += 0.018 * (t - a)), (i[e] = a * 0.32 + t * 0.012));
  }
  for (let t = 0; t < 17.3; t += 0.12 + Math.random() * 0.65) {
    let r = Math.floor(t * e.sampleRate),
      a = 0.014 + Math.random() * 0.042,
      o = 0.12 + Math.random() * 0.26,
      s = 0;
    for (let t = 0; t < a * e.sampleRate; t++) {
      let c = t / e.sampleRate,
        l = Math.random() * 2 - 1;
      s += 0.62 * (l - s);
      let u = Math.min(1, c * 2e3) * Math.exp(-c / (a * 0.17));
      i[(r + t) % n] += s * u * o;
    }
  }
  let o = e.createBufferSource(),
    s = e.createBiquadFilter(),
    c = e.createGain();
  return (
    (o.buffer = r),
    (o.loop = !0),
    (c.gain.value = 0),
    (s.type = `lowpass`),
    (s.frequency.value = 3600),
    o.connect(s),
    s.connect(c),
    c.connect(t),
    o.start(),
    { source: o, gain: c }
  );
}
