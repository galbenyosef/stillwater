// assets__index-BogB70q- 39 — math
// Lines 54404-54641 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Qv() {
  let e = q - 0.34,
    t = 0,
    n = 0;
  return {
    reset() {
      ((e = q - 0.34), (t = n = 0));
    },
    update(r, i, a, o = !1) {
      let s = Math.sin(r.heading),
        c = Math.cos(r.heading),
        l = Xv(r.x + s * 1.3, r.z + c * 1.3, i),
        u = Xv(r.x - s * 1.3, r.z - c * 1.3, i),
        d = Xv(r.x - c * 0.55, r.z + s * 0.55, i),
        f = Xv(r.x + c * 0.55, r.z - s * 0.55, i),
        p = o ? 0.2 : 1,
        m = 1 - Math.exp(-a * 4.8);
      return (
        (e += (q - 0.34 + (l + u + d + f) * 0.25 * p - e) * m),
        (t +=
          ((Math.atan2(l - u, 2.6) + J(r.acceleration || 0, -1, 1) * 0.014) *
            p -
            t) *
          m),
        (n +=
          ((-Math.atan2(f - d, 1.1) -
            J((r.turnRate || 0) * r.speed, -1, 1) * 0.052) *
            p -
            n) *
          m),
        { height: e, pitch: t, roll: n }
      );
    },
  };
}
function $v() {
  let e = 0;
  return {
    reset() {
      e = 0;
    },
    ready(t, n = 60) {
      let r = 1e3 / n;
      return t < e - 1 ? !1 : ((e = e === 0 || t - e > r ? t + r : e + r), !0);
    },
  };
}
var ey = 9.5,
  ty = 1 / 20,
  ny = Math.ceil(ey / ty) + 3;
function ry(e) {
  let t = e.speed < 0 ? -1 : 1,
    n = Math.sin(e.heading),
    r = Math.cos(e.heading),
    i = t > 0 ? -2.115 : 1.72,
    a = t > 0 ? -1.65 : 1.25;
  return {
    x: e.x + n * i,
    z: e.z + r * i,
    dx: n * t,
    dz: r * t,
    shoulderOffset: (a - i) * t,
    beam: dv(a),
    speed: Math.abs(e.speed),
    strength: J((Math.abs(e.speed) - 0.045) / 1.25, 0, 1) ** 0.85,
  };
}
function iy() {
  let e = [],
    t = null,
    n = 0,
    r = 0,
    i = !1,
    a = 0;
  function o() {
    ((e.length = 0), (t = null), (i = !1), (a = 0), r++);
  }
  function s(t, n) {
    let i = ry(n),
      a = e.at(-1),
      o = a?.stroke === r ? a.arc + Math.hypot(i.x - a.x, i.z - a.z) : 0;
    return { ...i, born: t, stroke: r, arc: o };
  }
  function c(t, n) {
    let o = Math.abs(n.speed) > 0.055,
      c = Math.sign(n.speed);
    if (!o) {
      i = !1;
      return;
    }
    ((!i || c !== a) && r++, (i = !0), (a = c), e.push(s(t, n)));
  }
  return {
    stations: e,
    reset: o,
    update(r, i) {
      if (
        !Number.isFinite(r) ||
        ![i.x, i.z, i.heading, i.speed].every(Number.isFinite)
      ) {
        o();
        return;
      }
      (t &&
        (r < t.t || r - t.t > 0.35 || Math.hypot(i.x - t.x, i.z - t.z) > 1.5) &&
        o(),
        t || ((t = { ...i, t: r }), (n = r)));
      let a = r - t.t,
        s = Math.atan2(
          Math.sin(i.heading - t.heading),
          Math.cos(i.heading - t.heading),
        );
      for (; n <= r + 1e-8;) {
        let e = a > 0 ? J((n - t.t) / a, 0, 1) : 1;
        (c(n, {
          x: t.x + (i.x - t.x) * e,
          z: t.z + (i.z - t.z) * e,
          heading: t.heading + s * e,
          speed: t.speed + (i.speed - t.speed) * e,
        }),
          (n += ty));
      }
      for (; e.length && (r - e[0].born > 9.5 || e.length > 192);) e.shift();
      t = { ...i, t: r };
    },
    rows(t, n) {
      let r = e.slice();
      return (
        i &&
          Math.abs(n.speed) > 0.055 &&
          a === Math.sign(n.speed) &&
          t > (e.at(-1)?.born ?? t) + 1e-6 &&
          r.push(s(t, n)),
        r
      );
    },
  };
}
var ay = 3.8;
function oy(e) {
  let t = [],
    n = [],
    r = cp(981),
    i = new Nn(),
    a = new Go(1, 5, 3),
    o = new Float32Array(64);
  a.setAttribute(`aDropFade`, new Ii(o, 1).setUsage(Xe));
  let s = new rs({
    color: `#c1dcd6`,
    roughness: 0.1,
    metalness: 0.04,
    transparent: !0,
    opacity: 0.78,
    depthWrite: !1,
    envMapIntensity: 1.15,
  });
  ((s.onBeforeCompile = (e) => {
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
    (s.customProgramCacheKey = () => `fish-splash-drops`));
  let c = new Wi(a, s, 64);
  ((c.name = `Fish splash droplets`),
    (c.count = 0),
    c.instanceMatrix.setUsage(Xe),
    (c.userData.aboveWater = !0),
    (c.userData.skipAO = !0),
    (c.receiveShadow = !0),
    (c.renderOrder = 4),
    (c.frustumCulled = !1),
    e.add(c));
  let l = new U(0, 1, 0),
    u = new U();
  return {
    ripples: t,
    mesh: c,
    update(e, s) {
      for (let i of s) {
        if ((t.push({ ...i, age: e - i.time }), i.type === `feed`)) continue;
        let a = i.type === `entry` ? 24 : 10;
        for (let e = 0; e < a; e++) {
          let t = (e / a) * Math.PI * 2 + r() * 0.24,
            o = (0.24 + r() * 0.7) * Math.sqrt(i.strength);
          n.push({
            x: i.x,
            z: i.z,
            born: i.time,
            vx: Math.cos(t) * o + Math.cos(i.heading) * 0.25,
            vz: Math.sin(t) * o - Math.sin(i.heading) * 0.25,
            vy: (0.85 + r() * 1.25) * Math.sqrt(i.strength),
            size: (0.012 + r() * 0.017) * Math.sqrt(i.strength),
          });
        }
      }
      for (let n = t.length - 1; n >= 0; n--)
        ((t[n].age = e - t[n].time), t[n].age > 3.8 && t.splice(n, 1));
      t.length > 8 && t.splice(0, t.length - 8);
      let d = 0;
      for (let t = n.length - 1; t >= 0; t--) {
        let r = n[t],
          a = e - r.born,
          s = q + 0.012 + r.vy * a - 4.905 * a * a;
        if (s < 0.18 || a > 1) {
          n.splice(t, 1);
          continue;
        }
        if (d >= 64) continue;
        (i.position.set(r.x + r.vx * a, s, r.z + r.vz * a),
          u.set(r.vx, r.vy - 9.81 * a, r.vz));
        let f = 1 + Math.min(1.5, u.length() * 0.7);
        (i.quaternion.setFromUnitVectors(l, u.normalize()),
          i.scale.set(r.size, r.size * f, r.size),
          i.updateMatrix(),
          c.setMatrixAt(d, i.matrix),
          (o[d] = Math.min(1, a * 35) * Math.min(1, (s - q) * 25)),
          d++);
      }
      ((c.count = d),
        (c.visible = d > 0),
        (c.instanceMatrix.needsUpdate = !0),
        (a.attributes.aDropFade.needsUpdate = !0));
    },
  };
}
