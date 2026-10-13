// assets__index-BogB70q- 55 — math
// Lines 59537-59881 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
var Ox = (e, t, n) => {
  let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
  return r * r * (3 - 2 * r);
};
function kx(e, t) {
  if (!e?.isSkinnedMesh) return;
  let n = e.geometry,
    r = n.clone(),
    { position: i, skinIndex: a, skinWeight: o } = r.attributes,
    s = i.count,
    c = [],
    l = new Map(),
    u = [],
    d = [`l`, `r`].map((n) => {
      let r = e.skeleton.bones.findIndex((e) => e.name === `lowerarm_${n}`),
        i = e.skeleton.bones.findIndex((e) => e.name === `hand_${n}`),
        a = e.skeleton.bones.findIndex((e) => e.name === `upperarm_${n}`),
        o = t.worldToLocal(e.skeleton.bones[i].getWorldPosition(new U())),
        s = t.worldToLocal(e.skeleton.bones[r].getWorldPosition(new U()));
      return {
        lower: r,
        hand: i,
        upper: a,
        wrist: o,
        elbow: s,
        axis: o.clone().sub(s).normalize(),
      };
    }),
    f = e.skeleton.bones.map((t, n) =>
      new W().multiplyMatrices(t.matrixWorld, e.skeleton.boneInverses[n]),
    ),
    p = (t, n) => {
      let r = new W();
      r.elements.fill(0);
      for (let e = 0; e < 4; e++)
        for (let i = 0; i < 16; i++)
          r.elements[i] += f[t[e]].elements[i] * n[e];
      return r.premultiply(e.bindMatrixInverse).multiply(e.bindMatrix);
    },
    m = [];
  for (let n = 0; n < s; n++) {
    let r = Array.from({ length: 4 }, (e, t) => a.getComponent(n, t)),
      s = Array.from({ length: 4 }, (e, t) => o.getComponent(n, t)),
      f = p(r, s);
    m.push(f);
    let h = new U().fromBufferAttribute(i, n).applyMatrix4(f),
      g = h
        .toArray()
        .map((e) => Math.round(e * 1e5))
        .join(`,`),
      _ = l.get(g);
    if (_ === void 0) {
      ((_ = c.length), l.set(g, _));
      let n = t.worldToLocal(h.clone().applyMatrix4(e.matrixWorld)),
        i =
          Ox(0.1, 0.17, Math.abs(n.x)) *
          Ox(1.08, 1.2, n.y) *
          (1 - Ox(1.52, 1.57, n.y)),
        a = null;
      for (let e of d) {
        let t = r.reduce((t, n, r) => t + (n === e.lower ? s[r] : 0), 0),
          i = n.clone().sub(e.wrist),
          o = i.dot(e.axis),
          c = i.addScaledVector(e.axis, -o).length();
        t > 0.9 &&
          o > -0.14 &&
          o < 0.02 &&
          c < 0.07 &&
          (a = { ...e, weight: Ox(-0.14, -0.025, o) });
      }
      c.push({ ids: [], weights: new Map(), mask: i, cuff: a, height: n.y });
    }
    u.push(_);
    let v = c[_];
    v.ids.push(n);
    for (let e = 0; e < 4; e++)
      s[e] > 0 && v.weights.set(r[e], (v.weights.get(r[e]) ?? 0) + s[e]);
  }
  let h = e.skeleton.bones.findIndex((e) => e.name === `spine_03`);
  for (let t of c) {
    let n = new Map();
    for (let [r, i] of t.weights) {
      let a = /^(pelvis|spine_0[123])$/.test(e.skeleton.bones[r].name) ? h : r;
      n.set(a, (n.get(a) ?? 0) + i / t.ids.length);
    }
    t.weights = n;
  }
  let g = c.map(() => new Set());
  for (let e = 0; e < r.index.count; e += 3) {
    let t = [0, 1, 2].map((t) => u[r.index.getX(e + t)]);
    for (let e = 0; e < 3; e++) {
      let n = t[e],
        r = t[(e + 1) % 3];
      n !== r && (g[n].add(r), g[r].add(n));
    }
  }
  for (let e = 0; e < 48; e++) {
    let e = c.map((e, t) => {
      if (!e.mask || !g[t].size) return e.weights;
      let n = e.mask * 0.5,
        r = new Map([...e.weights].map(([e, t]) => [e, t * (1 - n)]));
      for (let e of g[t])
        for (let [i, a] of c[e].weights)
          r.set(i, (r.get(i) ?? 0) + (a * n) / g[t].size);
      return r;
    });
    c.forEach((t, n) => (t.weights = e[n]));
  }
  for (let e of c) {
    if (!e.mask && !e.cuff) continue;
    if (e.cuff) {
      let { lower: t, hand: n, weight: r } = e.cuff;
      e.weights = new Map([
        [t, 1 - r],
        [n, r],
      ]);
    } else
      for (let { lower: t, upper: n, elbow: r } of d) {
        let i =
          (e.weights.get(t) ?? 0) * Ox(r.y + 0.015, r.y + 0.085, e.height);
        i &&
          (e.weights.set(t, e.weights.get(t) - i),
          e.weights.set(n, (e.weights.get(n) ?? 0) + i));
      }
    let t = [...e.weights].sort((e, t) => t[1] - e[1]).slice(0, 4),
      n = t.reduce((e, t) => e + t[1], 0),
      s = Array.from({ length: 4 }, (e, n) => t[n]?.[0] ?? 0),
      c = Array.from({ length: 4 }, (e, r) => (t[r]?.[1] ?? 0) / n),
      l = p(s, c).invert();
    for (let t of e.ids) {
      let e = new W().multiplyMatrices(l, m[t]),
        n = new U().fromBufferAttribute(i, t).applyMatrix4(e);
      i.setXYZ(t, n.x, n.y, n.z);
      for (let i of [`normal`, `tangent`]) {
        let a = r.attributes[i];
        a &&
          (n.fromBufferAttribute(a, t).transformDirection(e),
          a.setXYZ(t, n.x, n.y, n.z));
      }
      for (let [i, a] of Object.entries(r.morphAttributes))
        for (let o of a) {
          if (
            (n.fromBufferAttribute(o, t),
            i === `position` && !r.morphTargetsRelative)
          )
            n.applyMatrix4(e);
          else {
            let t = e.elements,
              r = n.x,
              i = n.y,
              a = n.z;
            n.set(
              t[0] * r + t[4] * i + t[8] * a,
              t[1] * r + t[5] * i + t[9] * a,
              t[2] * r + t[6] * i + t[10] * a,
            );
          }
          o.setXYZ(t, n.x, n.y, n.z);
        }
      (a.setXYZW(t, ...s), o.setXYZW(t, ...c));
    }
  }
  return {
    apply() {
      e.geometry = r;
    },
    clear() {
      e.geometry = n;
    },
  };
}
var Ax = 2.45,
  jx = (e, t, n) => ((n = J((n - e) / (t - e), 0, 1)), n * n * (3 - 2 * n)),
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
var Fx = Object.freeze({
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
  Ix = (e) => ((e = J(e, 0, 1)), e * e * (3 - 2 * e)),
  Lx = (e, t, n) => Ix((n - e) / (t - e)),
  Rx = (e, t) => {
    let n = 0;
    for (; n < e.length - 2 && t > e[n + 1][0];) n++;
    let r = e[n],
      i = e[n + 1],
      a = Lx(r[0], i[0], t);
    return r.slice(1).map((e, t) => e + (i[t + 1] - e) * a);
  };
function zx(e, t = 1.023) {
  let n = J(e, 0, 1) * Fx.climbDuration,
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
        [9.6, Fx.water.x, q - 0.49, 0],
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
      i = Fx.landing.y,
      a = 1,
      c = 0;
    for (let e = t; e <= 6; e += 2, r += 2) {
      let o = Lx(e, e + 0.8, n),
        s = Fx.rungTop - r * Fx.rungSpacing;
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
    hip: { x: r, y: i, z: Fx.water.z + a },
    feet: o,
    hands: s,
    standing: 1 - Lx(0, 0.8, n),
    release: Lx(6.8, 7.65, n),
    turn: Lx(7.65, 9.6, n),
  };
}
var Bx = (e, t) => zx(e, t).hip,
  Vx = Object.freeze({ ...Fx, speed: 0.92, strokeDuration: Ax }),
  Hx = (e, t) => Math.atan2(Math.sin(e - t), Math.cos(e - t)),
  Ux = (e) => ((e = J(e, 0, 1)), e * e * (3 - 2 * e));
function Wx(e, t) {
  return e === `foot`
    ? t.y < 0.55 &&
      t.x >= -4.6 &&
      t.x <= -2.5 &&
      t.z > 1.3 &&
      t.z < 3.7 &&
      Math.hypot(t.x - Vx.landing.x, t.z - Vx.landing.z) < 2
      ? `swim`
      : null
    : e === `swim` && Math.hypot(t.x - Vx.water.x, t.z - Vx.water.z) < 1.25
      ? `climb`
      : null;
}
function Gx(e, t, n = null) {
  if (!rp(e, t, 0.78, 1.65)) return !1;
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
