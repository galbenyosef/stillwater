// assets__index-BogB70q- 27 — math
// Lines 50815-51125 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function $g(e, { groundCover: t = !1 } = {}) {
  let n = new Map();
  e.traverse((e) => {
    if (!e.isMesh) return;
    let r = (e) => {
      if (n.has(e)) return n.get(e);
      let r = /[Ll]eaves|growth|[Ff]ern/.test(e.name),
        i = e.name.startsWith(`Willow`);
      if (t && !r) return e;
      let a = e.name === `Silver birch bark`,
        o = e.clone(),
        s = e.onBeforeCompile,
        c = e.customProgramCacheKey();
      for (let e of [o.map, o.normalMap, o.roughnessMap])
        e && (e.anisotropy = 16);
      return (
        o.normalScale?.multiplyScalar(t ? 1.08 : r ? 1.18 : a ? 1.25 : 1.12),
        (o.userData.woodlandDepth = !0),
        r &&
          ((o.side = 2),
          t || (o.roughness = i ? 0.74 : 0.79),
          t ||
            o.color.multiply(
              new G().setRGB(...(i ? [0.94, 0.97, 0.93] : [0.64, 0.86, 0.6])),
            ),
          t || (o.envMapIntensity = 0.64)),
        (o.onBeforeCompile = (e, n) => {
          (s(e, n),
            (e.vertexShader =
              `varying vec2 vTreeUv;varying vec3 vBarkLocal;
` + e.vertexShader),
            (e.vertexShader = e.vertexShader.replace(
              `#include <uv_vertex>`,
              `#include <uv_vertex>
vTreeUv=uv;vBarkLocal=position;`,
            )),
            (e.fragmentShader =
              `varying vec2 vTreeUv;varying vec3 vBarkLocal;
          float treeHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float treeNoise(vec2 p){vec2 c=floor(p),f=fract(p);f=f*f*(3.-2.*f);
            return mix(mix(treeHash(c),treeHash(c+vec2(1.,0.)),f.x),mix(treeHash(c+vec2(0.,1.)),treeHash(c+1.),f.x),f.y);}
          vec3 treeRelief(vec3 p,vec3 n,float h){
            vec3 dx=dFdx(p),dy=dFdy(p),a=cross(dy,n),b=cross(n,dx);
            float d=dot(dx,a);
            return normalize(abs(d)*n-sign(d)*(dFdx(h)*a+dFdy(h)*b));
          }
        ` + e.fragmentShader),
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <map_fragment>`,
              `#include <map_fragment>
          float woodlandNear=1.-smoothstep(16.,42.,length(vViewPosition));
          ${
            r
              ? `float leafTintPatch=treeNoise(vBarkLocal.xz*.93+vBarkLocal.y*.71);
          diffuseColor.rgb*=mix(vec3(.95,1.015,1.035),vec3(1.065,1.01,.93),leafTintPatch);`
              : ``
          }`,
            )),
            r
              ? ((e.fragmentShader = e.fragmentShader.replace(
                  `vec3(1.9,1.6,.85)*translucency`,
                  t
                    ? `vec3(1.9,1.6,.85)*mix(1.,1.12,woodlandNear)*translucency`
                    : `mix(vec3(1.28,1.36,.74),vec3(1.55,1.60,.82),woodlandNear)*translucency`,
                )),
                i &&
                  ((e.fragmentShader = e.fragmentShader.replace(
                    `#include <normal_fragment_maps>`,
                    `#include <normal_fragment_maps>
              float midrib=exp(-abs(vTreeUv.x-.5)*105.);
              float veinCoord=(vTreeUv.y-abs(vTreeUv.x-.5)*.66)*13.;
              float veinDistance=abs(fract(veinCoord+.5)-.5);
              float veinAA=max(fwidth(veinCoord),.008);
              float veins=1.-smoothstep(.023,.023+veinAA,veinDistance);
              float leafDetail=1.-smoothstep(.06,.15,length(fwidth(vTreeUv)));
              normal=treeRelief(-vViewPosition,normal,(midrib*.00032+veins*.00009)*leafDetail);`,
                  )),
                  (e.fragmentShader = e.fragmentShader.replace(
                    `#include <map_fragment>`,
                    `#include <map_fragment>
              float rib=exp(-abs(vTreeUv.x-.5)*85.);
              float mottling=treeNoise(vTreeUv*vec2(22.,35.));
              diffuseColor.rgb*=.93+mottling*.095+rib*.10;`,
                  ))))
              : ((e.fragmentShader = e.fragmentShader.replace(
                  `#include <map_fragment>`,
                  `#include <map_fragment>
            float barkPatch=treeNoise(vBarkLocal.xz*3.+vBarkLocal.y*.73);
            float dampBase=(1.-smoothstep(.05,1.05,vBarkLocal.y))*(.28+.72*barkPatch);
            diffuseColor.rgb*=mix(vec3(1.),vec3(.63,.72,.50),dampBase*.60);`,
                )),
                (e.fragmentShader = e.fragmentShader.replace(
                  `#include <normal_fragment_maps>`,
                  `#include <normal_fragment_maps>
            float barkFootprint=length(fwidth(vTreeUv));
            float poreVisibility=1.-smoothstep(.32,1.1,barkFootprint*105.);
            float barkPores=treeNoise(vTreeUv*vec2(${a ? `42.,140.` : `120.,28.`}));
            normal=treeRelief(-vViewPosition,normal,barkPores*${a ? `.00065` : `.0011`}*poreVisibility);`,
                ))),
            t ||
              (e.fragmentShader = e.fragmentShader.replace(
                `#include <opaque_fragment>`,
                `
          float woodlandAir=smoothstep(36.,110.,length(vViewPosition))*.30;
          outgoingLight=mix(outgoingLight*mix(vec3(1.),vec3(.92,1.,1.08),woodlandAir),vec3(.30,.405,.43),woodlandAir);
          #include <opaque_fragment>`,
              )));
        }),
        (o.customProgramCacheKey = () =>
          `tree-finish-v2-${t ? `undergrowth` : `crown`}-${e.name}-${c}`),
        n.set(e, o),
        o
      );
    };
    e.material = Array.isArray(e.material) ? e.material.map(r) : r(e.material);
  });
}
var e_ = (e, t, n) => {
  let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
  return r * r * (3 - 2 * r);
};
function t_(e, t) {
  let n = t.x * 1.73 + t.z * 2.41,
    r = Math.hypot(t.x, t.z) || 1,
    i = Math.cos(t.angle),
    a = Math.sin(t.angle),
    o = 0.3 + 0.3 * (0.5 + 0.5 * Math.sin(n * 1.31));
  return {
    height: new ir().setFromObject(e).max.y,
    phase: n,
    leanX: ((-t.x * i + t.z * a) / r) * o,
    leanZ: ((-t.x * a - t.z * i) / r) * o,
    widthX: 1 + 0.13 * Math.sin(n),
    widthZ: 1 + 0.12 * Math.cos(n * 1.37),
    rise: 1 + 0.06 * Math.sin(n * 0.79),
    turn: 0.13 * Math.sin(n * 1.17),
    leafTint: [
      1 + 0.09 * Math.sin(n * 1.31),
      1 + 0.035 * Math.cos(n * 0.73),
      1 + 0.08 * Math.sin(n * 1.17 + 0.9),
    ],
  };
}
function n_(e, t) {
  let n = e.clone(!0),
    {
      height: r,
      phase: i,
      leanX: a,
      leanZ: o,
      widthX: s,
      widthZ: c,
      rise: l,
      turn: u,
    } = t,
    d = (e, t, n, d) => {
      let f = e_(1.65, Math.max(2.8, r * 0.48), t),
        p = e_(1.65, r, t);
      if (!f) return d.set(e, t, n);
      let m = Math.hypot(e, n),
        h = Math.atan2(n, e),
        g = e_(0.25, 1.6, m),
        _ =
          1 +
          f *
            g *
            (0.085 * Math.sin(2 * h + i) +
              0.035 * Math.cos(3 * h - t * 0.65 + i)),
        v = f * g * (u + 0.065 * Math.sin(t * 0.68 + i)),
        y = Math.cos(v),
        b = Math.sin(v);
      return d.set(
        (e * y - n * b) * _ * (1 + f * (s - 1)) + a * p * p,
        t + (t - 1.65) * f * (l - 1) - f * g * 0.16 * Math.sin(h * 2 + i),
        (e * b + n * y) * _ * (1 + f * (c - 1)) + o * p * p,
      );
    },
    f = new U(),
    p = new U(),
    m = new U(),
    h = new U(),
    g = new U(),
    _ = new W(),
    v = new zt(),
    y = new H(),
    b = new U(),
    x = new U(),
    S = (e, t, n) => {
      let r = 0.008;
      return (
        d(e + r, t, n, f),
        d(e - r, t, n, p),
        m.subVectors(f, p).multiplyScalar(1 / (2 * r)),
        d(e, t + r, n, f),
        d(e, t - r, n, p),
        h.subVectors(f, p).multiplyScalar(1 / (2 * r)),
        d(e, t, n + r, f),
        d(e, t, n - r, p),
        g.subVectors(f, p).multiplyScalar(1 / (2 * r)),
        _.makeBasis(m, h, g)
      );
    };
  return (
    n.traverse((e) => {
      if (!e.isMesh) return;
      let t = e.geometry,
        n = new Hr();
      for (let [e, r] of Object.entries(t.attributes))
        n.setAttribute(
          e,
          [`position`, `normal`, `tangent`, `_leaf_anchor`].includes(e)
            ? r.clone()
            : r,
        );
      (n.setIndex(t.index),
        (n.groups = t.groups.map((e) => ({ ...e }))),
        n.setDrawRange(t.drawRange.start, t.drawRange.count));
      let r = n.getAttribute(`position`),
        i = n.getAttribute(`normal`),
        a = n.getAttribute(`_leaf_anchor`),
        o = n.getAttribute(`_leaf_phase`),
        s = n.getAttribute(`tangent`),
        c = new Map();
      for (let e = 0; e < r.count; e++) {
        let t = r.getX(e),
          n = r.getY(e),
          l = r.getZ(e);
        if (o?.getX(e) > 0.5) {
          let r = a.getX(e),
            o = a.getY(e),
            u = a.getZ(e),
            f = `${r}:${o}:${u}`,
            p = c.get(f);
          (p ||
            (S(r, o, u),
            m.normalize(),
            h.addScaledVector(m, -h.dot(m)).normalize(),
            g.crossVectors(m, h),
            y.setFromRotationMatrix(_.makeBasis(m, h, g)).normalize(),
            (p = { pivot: d(r, o, u, new U()), rotation: y.clone() }),
            c.set(f, p)),
            b
              .set(t - r, n - o, l - u)
              .applyQuaternion(p.rotation)
              .add(p.pivot),
            i &&
              (x
                .fromBufferAttribute(i, e)
                .applyQuaternion(p.rotation)
                .normalize(),
              i.setXYZ(e, x.x, x.y, x.z)),
            s &&
              (x
                .fromBufferAttribute(s, e)
                .applyQuaternion(p.rotation)
                .normalize(),
              s.setXYZ(e, x.x, x.y, x.z)),
            a.setXYZ(e, p.pivot.x, p.pivot.y, p.pivot.z));
        } else
          (v.getNormalMatrix(S(t, n, l)),
            i &&
              (x.fromBufferAttribute(i, e).applyMatrix3(v).normalize(),
              i.setXYZ(e, x.x, x.y, x.z)),
            s &&
              (x.fromBufferAttribute(s, e).transformDirection(_),
              s.setXYZ(e, x.x, x.y, x.z)),
            d(t, n, l, b));
        r.setXYZ(e, b.x, b.y, b.z);
      }
      (n.computeBoundingBox(), n.computeBoundingSphere(), (e.geometry = n));
    }),
    n
  );
}
function r_(e) {
  let t = cp(92618),
    n = [],
    r = e.filter((e) => e.kind === `rock`);
  for (let i of e.filter((e) => e.kind === `tree`))
    for (let e = 0; e < 96; e++) {
      let e = t() * Math.PI * 2,
        a = 0.48 + t() ** 0.72 * 2.6 * (Array.isArray(i.s) ? i.s[0] : i.s),
        o = i.x + Math.cos(e) * a,
        s = i.z + Math.sin(e) * a,
        c = Y(o, s);
      if (
        c < 0.4 ||
        np(o, s) < 3.4 ||
        r.some(
          (e) =>
            Math.hypot(o - e.x, s - e.z) <
            (Array.isArray(e.s) ? e.s[0] : e.s) * 0.64 + 0.1,
        )
      )
        continue;
      let l = (Y(o + 0.05, s) - Y(o - 0.05, s)) / 0.1,
        u = (Y(o, s + 0.05) - Y(o, s - 0.05)) / 0.1;
      if (Math.hypot(l, u) > 1.15) continue;
      let d = Math.hypot(l, 1, u);
      n.push({
        x: o,
        y: c + 0.016,
        z: s,
        s: 0.86 + t() * 0.52,
        angle: t() * Math.PI * 2,
        normal: [-l / d, 1 / d, -u / d],
        tint: 0.63 + t() * 0.26,
      });
    }
  return n;
}
