// assets__index-BogB70q- 36 — math
// Lines 53650-53974 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Av(e, { reducedMotion: t = !1 } = {}) {
  let n = [],
    r = cp(724),
    i = new Float32Array(Ov.length),
    a = new Float32Array(Ov.length),
    o = kv(e),
    s = new Go(1, 5, 3),
    c = new Float32Array(Dv);
  s.setAttribute(`aDropFade`, new Ii(c, 1).setUsage(Xe));
  let l = new rs({
    color: `#aecdc6`,
    roughness: 0.13,
    metalness: 0.03,
    transparent: !0,
    opacity: 0.72,
    depthWrite: !1,
    envMapIntensity: 1.1,
  });
  ((l.onBeforeCompile = (e) => {
    ((e.vertexShader =
      `attribute float aDropFade;varying float vDropFade;
` + e.vertexShader),
      (e.vertexShader = e.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
vDropFade=aDropFade;`,
      )),
      (e.fragmentShader =
        `varying float vDropFade;
` + e.fragmentShader),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <color_fragment>`,
        `#include <color_fragment>
diffuseColor.a*=vDropFade;`,
      )));
  }),
    (l.customProgramCacheKey = () => `boat-contact-droplets-v1`));
  let u = new Wi(s, l, Dv);
  ((u.name = `Boat contact droplets`),
    (u.count = 0),
    u.instanceMatrix.setUsage(Xe),
    (u.frustumCulled = !1),
    (u.receiveShadow = !0),
    (u.userData.aboveWater = !0),
    (u.userData.skipAO = !0),
    (u.renderOrder = 4),
    e.add(u));
  let d = new U(),
    f = new H(),
    p = new U(1, 1, 1),
    m = new W(),
    h = new U(),
    g = new U(),
    _ = new U(),
    v = new Nn(),
    y = new U(),
    b = new U(0, 1, 0),
    x = null,
    S = 0,
    C = 0,
    w = !1,
    T = 0;
  function E() {
    ((n.length = 0),
      o.reset(),
      (x = null),
      i.fill(0),
      a.fill(0),
      (C = 0),
      (w = !1),
      (u.count = 0),
      (u.visible = !1));
  }
  function D(e, t) {
    let s = m.elements;
    for (let c = 0; c < Ov.length; c++) {
      let { along: l, side: u, stern: d } = Ov[c],
        f = 0.34,
        p = 0;
      for (let e = 0; e < 3; e++)
        ((p = d ? u * 0.25 : u * (uv(l, f) + 0.055)),
          (f = (q - s[13] - s[1] * p + s[9] * l) / s[5]));
      (h.set(p, f, -l), g.copy(h).applyMatrix4(m));
      let v = wv(h, g, e, t.speed, t.turnRate, 1, t.heading),
        y = w && i[c] < 0.76 && v.pulse >= 0.76 && v.pressure >= 0.18,
        b = w && a[c] < 0.34 && v.impact >= 0.34 && e >= C;
      if (((i[c] = v.pulse), (a[c] = v.impact), !y && !b)) continue;
      b && (C = e + 0.55 + r() * 0.4);
      let x = mv(h.x, h.y, h.z);
      (_.set(x.nx, 0, x.nz).transformDirection(m),
        b &&
          o.emit({
            x: g.x,
            z: g.z,
            nx: _.x,
            nz: _.z,
            born: e,
            strength: v.impact,
            seed: r() * 6.28,
          }));
      for (let i = 0; i < (y ? 3 : 4) && n.length < Dv; i++) {
        let i = y ? 0.18 + r() * 0.26 : 0.16 + r() * 0.19,
          a = y ? 0.65 + v.pressure * (0.75 + r() * 0.5) : 0.85 + r() * 0.35;
        n.push({
          x: g.x,
          z: g.z,
          y: q + v.height,
          born: e,
          source: y ? `motion` : `lake`,
          vx:
            _.x * i + Math.sin(t.heading) * t.speed * 0.22 + (r() - 0.5) * 0.1,
          vz:
            _.z * i + Math.cos(t.heading) * t.speed * 0.22 + (r() - 0.5) * 0.1,
          vy: a,
          size: y
            ? 0.008 + r() * 0.009 + v.pressure * 0.004
            : 0.009 + r() * 0.006,
        });
      }
    }
    w = !0;
  }
  return {
    mesh: u,
    drops: n,
    lips: o,
    reset: E,
    get atLakeSplash() {
      return n.some(
        (e) => e.source === `lake` && T - e.born > 0.14 && T - e.born < 0.22,
      );
    },
    update(e, r, i) {
      if (((T = e), t || !i)) {
        E();
        return;
      }
      let a = {
        ...r,
        t: e,
        position: new U().setFromMatrixPosition(i.matrixWorld),
        rotation: new H().setFromRotationMatrix(i.matrixWorld),
      };
      (x &&
        (e < x.t ||
          e - x.t > 0.35 ||
          a.position.distanceTo(x.position) > 1.5) &&
        E(),
        x || ((x = a), (S = e)));
      let l = e - x.t;
      for (; S <= e + 1e-8;) {
        let e = l > 0 ? J((S - x.t) / l, 0, 1) : 1;
        (d.copy(x.position).lerp(a.position, e),
          f.copy(x.rotation).slerp(a.rotation, e),
          m.compose(d, f, p));
        let t =
          x.heading +
          Math.atan2(
            Math.sin(r.heading - x.heading),
            Math.cos(r.heading - x.heading),
          ) *
            e;
        (D(S, {
          speed: x.speed + (r.speed - x.speed) * e,
          turnRate:
            (x.turnRate || 0) + ((r.turnRate || 0) - (x.turnRate || 0)) * e,
          heading: t,
        }),
          (S += Ev));
      }
      ((x = a), o.update(e, r, i));
      let h = 0;
      for (let t = n.length - 1; t >= 0; t--) {
        let r = n[t],
          i = Math.max(0, e - r.born),
          a = r.y + r.vy * i - 4.905 * i * i;
        if (a < 0.18 || i > 0.8) {
          n.splice(t, 1);
          continue;
        }
        (v.position.set(r.x + r.vx * i, a, r.z + r.vz * i),
          y.set(r.vx, r.vy - 9.81 * i, r.vz));
        let o = 1 + Math.min(1.2, y.length() * 0.55);
        (v.quaternion.setFromUnitVectors(b, y.normalize()),
          v.scale.set(r.size, r.size * o, r.size),
          v.updateMatrix(),
          u.setMatrixAt(h, v.matrix),
          (c[h] = Math.min(1, i * 45) * Math.min(1, (a - q) * 35)),
          h++);
      }
      ((u.count = h),
        (u.visible = h > 0),
        (u.instanceMatrix.needsUpdate = !0),
        (s.attributes.aDropFade.needsUpdate = !0));
    },
  };
}
var jv = Math.PI * 2,
  Mv = jv / Yh.paddles,
  Nv = Mv / Yh.angularSpeed,
  Pv = 3.6,
  Fv = Math.acos((q - Yh.y) / Yh.radius),
  Iv = 2.06,
  Lv = rg(Iv / Yh.angularSpeed, 0),
  Rv = ig(Lv, Lv.life),
  zv = [
    {
      kind: `spill`,
      phase: Iv / Yh.angularSpeed + Lv.life,
      x: Rv.x,
      z: Rv.z,
      strength: 1,
    },
    {
      kind: `entry`,
      phase: Fv / Yh.angularSpeed,
      x: Yh.x,
      z: Yh.z + Math.sin(Fv) * Yh.radius,
      strength: 0.64,
    },
    {
      kind: `exit`,
      phase: (jv - Fv) / Yh.angularSpeed,
      x: Yh.x,
      z: Yh.z - Math.sin(Fv) * Yh.radius,
      strength: 0.24,
    },
  ];
function Bv(e, t) {
  let n = cp(t * 7919 + { spill: 881, entry: 199, exit: 421 }[e.kind]),
    r = 0.25 + n() * 0.9;
  return {
    strength: e.strength * (0.42 + 0.58 * r),
    burst: r > 0.45,
    volume: r,
    width: 0.75 + n() * 0.45,
    linger: 0.8 + n() * 0.32,
    lean: (n() - 0.5) * 0.5,
  };
}
function Vv(e, t = Pv, n = null) {
  let r = [];
  if (n) {
    for (let i of zv) {
      let a = i.kind === `spill` ? Lv.life : 0,
        o = (i.phase - a) * Yh.angularSpeed,
        s = e - t - a,
        c = e - a,
        l = n.angleAt(s),
        u = n.angleAt(c);
      if (u - l < 1e-9) continue;
      let d = Math.floor((l - o) / Mv) + 1,
        f = Math.floor((u - o) / Mv);
      for (let l = d; l <= f; l++) {
        let u = n.timeAtAngle(o + l * Mv, s, c),
          d = u + a,
          f = e - d,
          p = i.kind === `spill` ? n.flowAt(u) : n.speedAt(u) / Yh.angularSpeed;
        if (f < 0 || f >= t || p < 0.002) continue;
        let m = Bv(i, l);
        r.push({
          ...i,
          ...m,
          strength: m.strength * p,
          volume: m.volume * p,
          burst: m.burst && p > 0.12,
          born: d,
          age: f,
          cycle: l,
          paddle: ((-l % Yh.paddles) + Yh.paddles) % Yh.paddles,
        });
      }
    }
    return r.sort((e, t) => e.born - t.born);
  }
  for (let n of zv) {
    let i = Math.floor((e - n.phase) / Nv);
    for (let a = i; a >= i - Math.ceil(t / Nv); a--) {
      let i = n.phase + a * Nv,
        o = e - i;
      o < 0 ||
        o >= t ||
        r.push({
          ...n,
          ...Bv(n, a),
          born: i,
          age: o,
          cycle: a,
          paddle: ((-a % Yh.paddles) + Yh.paddles) % Yh.paddles,
        });
    }
  }
  return r.sort((e, t) => e.born - t.born);
}
function Hv(e, t) {
  return e.map((e) => {
    let n = Math.round(e.x * 1379 + e.z * 3121 + e.nx * 733),
      r = cp(n),
      i = 3.5 + r() * 1.1,
      a = r() * i,
      o = Math.floor((t - a) / i),
      s = cp(n + o * 7919),
      c = a + o * i + s() * 0.4;
    c > t && (o--, (s = cp(n + o * 7919)), (c = a + o * i + s() * 0.4));
    let l = 0.38 + s() * 0.57,
      u = 1.95 + s() * 0.55,
      d = e.halfWidth * (0.78 + s() * 0.2),
      f = t - c,
      p = f / u;
    return {
      ...e,
      kind: `masonry`,
      seed: n,
      born: c,
      age: f,
      cycle: o,
      strength: l,
      duration: u,
      width: d,
      rise: Math.min(e.height * 0.7, 0.075 + l * 0.1),
      wash: Zf(0, 0.32, p) * (1 - Zf(0.32, 1, p)) * l,
    };
  });
}
var Uv = 32;
