// assets__index-BogB70q- 38 — math
// Lines 54057-54403 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Kv(e, t = {}, n = !1, r = null) {
  let i = Wv(t),
    a = {
      uMillAmount: { value: n ? 0.32 : 1 },
      uMillImpacts: { value: Array.from({ length: 6 }, () => new tn()) },
      uMillWalls: {
        value: Array.from({ length: Uv }, (e, t) => {
          let n = i[t];
          return n ? new tn(n.x, n.z, n.nx, n.nz) : new tn();
        }),
      },
      uMillWash: { value: Array.from({ length: Uv }, () => new tn()) },
    },
    o = new Pn();
  ((o.name = `Wheel impacts and masonry wash`),
    (o.userData.aboveWater = !0),
    (o.userData.skipAO = !0),
    e.add(o));
  let s = new Float32Array(9072),
    c = new Float32Array(3024),
    l = new Float32Array(6048),
    u = [];
  for (let e = 0; e < 24; e++)
    for (let t = 0; t <= 5; t++)
      for (let n = 0; n <= 20; n++) {
        let r = e * 126 + t * 21 + n;
        if ((l.set([n / 20, t / 5], r * 2), t < 5 && n < 20)) {
          let e = r + 20 + 1;
          u.push(r, e, r + 1, r + 1, e, e + 1);
        }
      }
  let d = new Hr();
  (d.setIndex(u),
    d.setAttribute(`position`, new Dr(s, 3).setUsage(Xe)),
    d.setAttribute(`normal`, new Dr(new Float32Array(s.length), 3)),
    d.setAttribute(`uv`, new Dr(l, 2)),
    d.setAttribute(`aSplashOpacity`, new Dr(c, 1).setUsage(Xe)));
  let f = new is({
    color: `#81b8b0`,
    roughness: 0.11,
    transparent: !0,
    opacity: 0.42,
    depthWrite: !1,
    side: 2,
    clearcoat: 0.75,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.1,
  });
  ((f.forceSinglePass = !0),
    (f.onBeforeCompile = (e) => {
      ((e.vertexShader =
        `attribute float aSplashOpacity;varying float vSplashOpacity;varying vec2 vSplashUv;
` + e.vertexShader),
        (e.vertexShader = e.vertexShader.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
vSplashOpacity=aSplashOpacity;vSplashUv=uv;`,
        )),
        (e.fragmentShader =
          `varying float vSplashOpacity;varying vec2 vSplashUv;
` + e.fragmentShader),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <color_fragment>`,
          `#include <color_fragment>
      float edge=1.-smoothstep(.68,1.,abs(vSplashUv.x*2.-1.));
      float broken=.25+.75*smoothstep(-.6,.8,sin(vSplashUv.x*51.+sin(vSplashUv.y*9.)*3.));
      diffuseColor.a*=vSplashOpacity*edge*smoothstep(0.,.12,vSplashUv.y)*mix(1.,broken,vSplashUv.y);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.83,.92,.87),smoothstep(.78,1.,vSplashUv.y)*.42);`,
        )));
    }),
    (f.customProgramCacheKey = () => `mill-impact-fans-v1`));
  let p = new vi(d, f);
  ((p.name = `Wheel impact sheets`),
    (p.frustumCulled = !1),
    (p.receiveShadow = !0),
    (p.renderOrder = 4),
    o.add(p));
  let m = new Go(1, 7, 5),
    h = new Float32Array(112);
  m.setAttribute(`aSplashOpacity`, new Ii(h, 1).setUsage(Xe));
  let g = new rs({
    color: `#abd0c8`,
    roughness: 0.12,
    transparent: !0,
    opacity: 0.66,
    depthWrite: !1,
    envMapIntensity: 1.1,
  });
  ((g.onBeforeCompile = (e) => {
    ((e.vertexShader =
      `attribute float aSplashOpacity;varying float vSplashOpacity;
` + e.vertexShader),
      (e.vertexShader = e.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
vSplashOpacity=aSplashOpacity;`,
      )),
      (e.fragmentShader =
        `varying float vSplashOpacity;
` + e.fragmentShader),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <color_fragment>`,
        `#include <color_fragment>
diffuseColor.a*=vSplashOpacity;`,
      )));
  }),
    (g.customProgramCacheKey = () => `mill-impact-droplets-v1`));
  let _ = new Wi(m, g, 112);
  ((_.name = `Wheel impact droplets`),
    (_.frustumCulled = !1),
    (_.receiveShadow = !0),
    (_.renderOrder = 5),
    _.instanceMatrix.setUsage(Xe),
    o.add(_));
  let v = new Nn(),
    y = new U(),
    b = new U(0, 1, 0),
    x = !0,
    S = [],
    C = 0;
  function w(e) {
    ((C = e), (S = Vv(e, Pv, r)));
    let t = Hv(i, e);
    for (let e = 0; e < 6; e++) {
      let t = S[e];
      a.uMillImpacts.value[e].set(
        t?.x || 0,
        t?.z || 0,
        t?.age || 0,
        t?.strength || 0,
      );
    }
    for (let e = 0; e < Uv; e++) {
      let n = t[e];
      a.uMillWash.value[e].set(
        n?.width || 0,
        n?.wash || 0,
        n?.age || 0,
        n?.strength || 0,
      );
    }
    a.uMillAmount.value = x ? (n ? 0.32 : 1) : 0;
    let o = [];
    for (let e of S) {
      if (e.kind === `exit` || !e.burst || e.age > 0.64 * e.linger) continue;
      let t = 0.52 + e.volume * 0.48;
      if (e.kind === `spill`)
        (o.push({
          ...e,
          nx: 0.32 + e.lean,
          nz: 0.95,
          width: 0.68 * e.width,
          rise: 0.34 * t,
          duration: 0.64 * e.linger,
        }),
          e.volume > 0.72 &&
            o.push({
              ...e,
              x: e.x + 0.32,
              nx: 0.96,
              nz: 0.28 - e.lean,
              width: 0.34 * e.width,
              rise: 0.26 * t,
              duration: 0.54 * e.linger,
            }));
      else
        for (let n of [-1, 1])
          o.push({
            ...e,
            x: e.x + n * 0.48,
            nx: n * 0.97,
            nz: -0.24 + e.lean,
            width: 0.34 * e.width * (1 + n * e.lean),
            rise: 0.2 * t * (1 - n * e.lean),
            duration: 0.52 * e.linger,
          });
    }
    for (let e of t) e.age < e.duration && o.push(e);
    let l = 0;
    if (x && !n)
      for (let e of o) {
        if (e.age >= e.duration || l >= 24) continue;
        let t = e.age / e.duration,
          n = Math.sin(t * Math.PI),
          r = e.cycle * 1.73;
        for (let i = 0; i <= 5; i++)
          for (let a = 0; a <= 20; a++) {
            let o = i / 5,
              u = (a / 20) * 2 - 1,
              d = l * 126 + i * 21 + a,
              f = e.kind === `masonry`,
              p = f
                ? 0.95 +
                  0.035 * Math.sin(u * 6 + r) +
                  0.015 * Math.sin(u * 11 - r)
                : 0.88 +
                  0.08 * Math.sin(u * 9 + r) +
                  0.04 * Math.sin(u * 17 - r),
              m = u * e.width * (f ? 1 : (0.62 + t * 0.48) * (1 - o * 0.12)),
              h = f
                ? (1 - o) * (0.08 + t * 0.15)
                : o * (0.045 + t * 0.28) + o * o * 0.1;
            s[d * 3] = e.x - e.nz * m + e.nx * h;
            let g = f ? e.wash / e.strength : n;
            ((s[d * 3 + 1] =
              q +
              0.008 +
              Math.sin(o * Math.PI * (f ? 0.5 : 0.68)) *
                e.rise *
                g *
                Math.max(0, Math.cos((u * Math.PI) / 2)) ** 0.45 *
                p),
              (s[d * 3 + 2] = e.z + e.nx * m + e.nz * h),
              (c[d] = f
                ? g * 0.65
                : Math.min(1, t * 10) * Math.min(1, (1 - t) * 3)));
          }
        l++;
      }
    (d.setDrawRange(0, l * 20 * 5 * 6),
      (p.visible = l > 0),
      l &&
        ((d.attributes.position.needsUpdate = !0),
        (d.attributes.aSplashOpacity.needsUpdate = !0),
        d.computeVertexNormals()));
    let u = 0;
    if (x && !n)
      for (let e of S) {
        if (e.kind === `exit` || !e.burst || e.age > 0.88) continue;
        let t = cp(e.cycle * 73 + (e.kind === `spill` ? 881 : 199)),
          n = Math.round((e.kind === `spill` ? 30 : 18) * e.volume);
        for (let r = 0; r < n && u < 112; r++) {
          let n = e.age - t() * 0.14 * e.linger,
            r = t() * Math.PI * 2,
            i = (0.4 + t() * 0.95) * e.width,
            a =
              ((e.kind === `spill` ? 2.1 : 1.35) +
                t() * (e.kind === `spill` ? 1.05 : 0.85)) *
              (0.7 + e.volume * 0.28),
            o = e.x + (t() - 0.5) * 0.92 * e.width,
            s = e.z + (t() - 0.5) * 0.13,
            c = Math.cos(r) * i,
            l = Math.sin(r) * i + (e.kind === `spill` ? 0.22 : -0.1),
            d = 0.01 + t() * 0.012,
            f = q + 0.025 + a * n - 4.905 * n * n;
          n < 0 ||
            f <= 0.192 ||
            (v.position.set(o + c * n, f, s + l * n),
            y.set(c, a - 9.81 * n, l),
            v.scale.set(d, d * (1 + Math.min(1.3, y.length() * 0.4)), d),
            v.quaternion.setFromUnitVectors(b, y.normalize()),
            v.updateMatrix(),
            _.setMatrixAt(u, v.matrix),
            (h[u] = Math.min(1, n * 35) * Math.min(1, (f - q) * 16)),
            u++);
        }
      }
    if (x && !n)
      for (let e of t) {
        if (e.strength < 0.84 || e.age < 0.48 || e.age > 1.03) continue;
        let t = cp(e.seed + e.cycle * 173);
        for (let n = 0; n < 3 && u < 112; n++) {
          let n = e.age - 0.48 - t() * 0.18,
            r = (t() - 0.5) * e.width * 1.6,
            i = 0.2 + t() * 0.3,
            a = 0.8 + t() * 0.5,
            o = 0.009 + t() * 0.006,
            s = q + 0.04 + a * n - 4.905 * n * n;
          n < 0 ||
            s <= 0.192 ||
            (v.position.set(
              e.x - e.nz * r + e.nx * i * n,
              s,
              e.z + e.nx * r + e.nz * i * n,
            ),
            y.set(e.nx * i, a - 9.81 * n, e.nz * i),
            v.scale.set(o, o * 1.7, o),
            v.quaternion.setFromUnitVectors(b, y.normalize()),
            v.updateMatrix(),
            _.setMatrixAt(u, v.matrix),
            (h[u] = Math.min(1, n * 30) * Math.min(1, (s - q) * 14) * 0.6),
            u++);
        }
      }
    ((_.count = u),
      (_.visible = u > 0),
      (_.instanceMatrix.needsUpdate = !0),
      (m.attributes.aSplashOpacity.needsUpdate = !0));
  }
  return (
    o.traverse((e) => {
      e.userData.skipAO = !0;
    }),
    w(0),
    {
      uniforms: a,
      group: o,
      sheets: p,
      drops: _,
      contacts: i,
      update: w,
      setEnabled(e) {
        ((x = !!e), w(C));
      },
      get atImpact() {
        return (
          !n &&
          x &&
          S.some(
            (e) =>
              e.kind === `spill` && e.burst && e.age > 0.18 && e.age < 0.27,
          )
        );
      },
    }
  );
}
var qv = 1 / 120;
function Jv(e, t) {
  let n = { ...e },
    r = 0;
  return {
    reset() {
      ((n = { ...e }), (r = 0));
    },
    step(i) {
      for (r += Math.min(Math.max(i, 0), 0.1); r + 1e-9 >= qv;)
        ((n = { ...e }), t(qv), (r -= qv));
      let a = J(r / qv, 0, 1),
        o = { ...e };
      for (let t of [`x`, `z`, `heading`, `speed`, `turnRate`, `acceleration`])
        o[t] = (n[t] || 0) + ((e[t] || 0) - (n[t] || 0)) * a;
      return o;
    },
  };
}
var Yv = [
  { x: 0.78, z: 0.48, k: 1.3, w: 1.05, a: 0.015 },
  { x: -0.48, z: 0.88, k: 2.15, w: 1.42, a: 0.008 },
];
function Xv(e, t, n) {
  return Yv.reduce(
    (r, i) => r + Math.sin((e * i.x + t * i.z) * i.k - n * i.w) * i.a,
    0,
  );
}
var Zv = `vec2 swellGradient(vec2 p,float t){return ${Yv.map((e) => `vec2(${e.x.toFixed(3)},${e.z.toFixed(3)})*${(e.k * e.a).toFixed(5)}*cos(dot(p,vec2(${e.x.toFixed(3)},${e.z.toFixed(3)}))*${e.k.toFixed(3)}-t*${e.w.toFixed(3)})`).join(`+`)};}`;
