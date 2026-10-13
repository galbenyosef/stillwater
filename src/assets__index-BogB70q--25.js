// assets__index-BogB70q- 25 — math
// Lines 50119-50463 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Rg(e, t) {
  e.traverse((e) => {
    if (!e.isMesh || Array.isArray(e.material)) return;
    let n = e.material,
      r = n.name;
    if (n.userData.millExteriorPalette) return;
    let i = r === `Old lime plaster`,
      a = /Limestone/.test(r),
      o = t === `mill` && r === `Faded boat paint`,
      s = /Oak|Cedar shingles/.test(r);
    if (!i && !a && !o && !s) return;
    let c = n.clone();
    c.onBeforeCompile = n.onBeforeCompile;
    let l = n.customProgramCacheKey();
    if (
      ((c.customProgramCacheKey = () => l),
      (c.userData = { ...n.userData, millExteriorPalette: !0 }),
      i || a || o)
    )
      c.color.copy(Fg[i ? `plaster` : a ? `stone` : `shutters`]);
    else {
      let i = e.geometry,
        a = i.getAttribute(`position`),
        o = i.getAttribute(`color`);
      if (!a || !o) return;
      let s = i.clone(),
        c = new Ar(new Float32Array(o.count * o.itemSize), o.itemSize);
      for (let e = 0; e < o.count; e++) {
        let i = Lg(r, t, a.getX(e), a.getY(e), a.getZ(e)),
          s = i ? Fg[i] : n.color;
        (c.setXYZ(
          e,
          (o.getX(e) * s.r) / n.color.r,
          (o.getY(e) * s.g) / n.color.g,
          (o.getZ(e) * s.b) / n.color.b,
        ),
          o.itemSize === 4 && c.setW(e, o.getW(e)));
      }
      (s.setAttribute(`color`, c), (e.geometry = s));
    }
    e.material = c;
  });
}
function zg() {
  let e = 1024,
    t = new Uint8Array(e * e * 4),
    n = (e, t) => {
      let n = Math.imul(e, 374761393) + Math.imul(t, 668265263);
      return (
        (n = Math.imul(n ^ (n >>> 13), 1274126177)),
        ((n ^ (n >>> 16)) >>> 0) / 4294967295
      );
    },
    r = (e, t) => {
      let r = Math.floor(e),
        i = Math.floor(t),
        a = e - r,
        o = t - i;
      ((a = a * a * (3 - 2 * a)), (o = o * o * (3 - 2 * o)));
      let s = n(r, i) * (1 - a) + n(r + 1, i) * a,
        c = n(r, i + 1) * (1 - a) + n(r + 1, i + 1) * a;
      return s * (1 - o) + c * o - 0.5;
    };
  for (let n = 0; n < e; n++)
    for (let i = 0; i < e; i++) {
      let a = -1.45 + ((i + 0.5) * 2.4) / e,
        o = -1.02 + ((n + 0.5) * 1.68) / e,
        s = a / 0.006,
        c = o / 0.0055,
        l =
          (Math.cos(s * Math.PI * 2) + Math.cos(c * Math.PI * 2)) * 0.45 +
          Math.cos(s * Math.PI) * Math.cos(c * Math.PI) * 0.35,
        u = r(a * 72, o * 17),
        d = r(a * 13, o * 89),
        f = l * 45e-5 + u * 16e-5 + d * 1e-4,
        p = l * 0.025 + u * 0.055 + d * 0.025,
        m = l * 0.07 + u * 0.1 + d * 0.04,
        h = (n * e + i) * 4;
      ((t[h] = Math.round((0.5 + f / 0.002) * 255)),
        (t[h + 1] = Math.round((0.5 + p / 0.25) * 255)),
        (t[h + 2] = Math.round((0.5 + m / 0.4) * 255)),
        (t[h + 3] = 255));
    }
  let i = new Mi(t, e, e);
  return (
    (i.name = `Mill rug • woven height, roughness and yarn variation`),
    (i.magFilter = l),
    (i.minFilter = d),
    (i.generateMipmaps = !0),
    (i.anisotropy = 12),
    (i.needsUpdate = !0),
    i
  );
}
var Bg = `
  uniform sampler2D uRugFabric;
  varying vec3 vRugPosition;
  varying float vRugSurface;
  vec3 rugBump(vec3 p,vec3 n,float height){
    vec3 dx=dFdx(p),dy=dFdy(p),r1=cross(dy,n),r2=cross(n,dx);
    float determinant=dot(dx,r1);
    return normalize(abs(determinant)*n-sign(determinant)*(dFdx(height)*r1+dFdy(height)*r2));
  }
`;
function Vg(e) {
  let t;
  e.traverse((e) => {
    if (
      !e.isMesh ||
      Array.isArray(e.material) ||
      !/Room (sage|oatmeal) linen$/.test(e.material.name) ||
      e.geometry.hasAttribute(`_rug_surface`)
    )
      return;
    let n = e.geometry.getAttribute(`position`),
      r = new Float32Array(n.count),
      i = 0;
    for (let e = 0; e < n.count; e++) {
      let t = n.getX(e),
        a = n.getY(e) - X.upper,
        o = n.getZ(e);
      t >= -1.451 &&
        t <= 0.951 &&
        o >= -1.021 &&
        o <= 0.661 &&
        a >= 0.001 &&
        a <= 0.031 &&
        ((r[e] = 1), i++);
    }
    if (!i) return;
    ((e.geometry = e.geometry.clone()),
      e.geometry.setAttribute(`_rug_surface`, new Ar(r, 1)));
    let a = e.material,
      o = a.clone(),
      s = a.onBeforeCompile,
      c = a.customProgramCacheKey();
    t ??= zg();
    let l = { value: t };
    ((o.onBeforeCompile = (e, t) => {
      (s.call(a, e, t),
        (e.uniforms.uRugFabric = l),
        (e.vertexShader =
          `attribute float _rug_surface;varying vec3 vRugPosition;varying float vRugSurface;
` + e.vertexShader),
        (e.vertexShader = e.vertexShader.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
vRugPosition=position;vRugSurface=_rug_surface;`,
        )),
        (e.fragmentShader = Bg + e.fragmentShader),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <map_fragment>`,
          `#include <map_fragment>
        // Mipmaps and anisotropic filtering resolve the fine weave during movement.
        vec3 rugFabric=texture2D(uRugFabric,(vRugPosition.xz-vec2(-1.45,-1.02))/vec2(2.4,1.68)).rgb-.5;
        float rugRelief=rugFabric.r*.002*vRugSurface;
        diffuseColor.rgb*=1.+vRugSurface*rugFabric.b*.4;`,
        )),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <normal_fragment_maps>`,
          `#include <normal_fragment_maps>
        normal=mix(normal,rugBump(-vViewPosition,normal,rugRelief),vRugSurface);`,
        )),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <roughnessmap_fragment>`,
          `#include <roughnessmap_fragment>
        roughnessFactor+=vRugSurface*rugFabric.g*.25;`,
        )));
    }),
      (o.customProgramCacheKey = () => c + `-rug-woven-v2`),
      (e.material = o));
  });
}
async function Hg(
  e,
  {
    loader: t = new Us(),
    createCanvas: n = () => document.createElement(`canvas`),
  } = {},
) {
  let r, i, a;
  if (
    (e.traverse((e) => {
      if (!e.isMesh || e.material.name !== `Mill interior | Oak • weathered`)
        return;
      let t = e.geometry;
      if (!t.userData.millBeamGrain || t.userData.frontBeamScar || !t.index)
        return;
      let n = t.getAttribute(`position`),
        o = [],
        s = [];
      for (let e = 0; e < t.index.count; e += 3) {
        let r = [0, 1, 2].map((n) => t.index.getX(e + n)),
          i = r.map((e) => n.getX(e));
        (Math.max(...i) - Math.min(...i) > 6.3 &&
        r.every(
          (e) =>
            n.getY(e) >= X.ceiling - 0.241 &&
            n.getY(e) <= X.ceiling + 0.001 &&
            Math.abs(n.getZ(e) - 0.1) < 0.081,
        )
          ? s
          : o
        ).push(...r);
      }
      s.length && ((r = e), (i = o), (a = s));
    }),
    !r)
  )
    return;
  let o = r.material,
    s = o.clone(),
    c = [`map`, `normalMap`, `roughnessMap`],
    l = await t.loadAsync(`/textures/mill-front-beam-scar.webp`);
  (c.forEach((e, t) => {
    let r = o[e].image,
      i = n();
    ((i.width = r.width), (i.height = r.height));
    let a = i.getContext(`2d`);
    ((a.imageSmoothingEnabled = !1),
      a.drawImage(r, 0, 0),
      a.drawImage(l.image, 0, t * 134, 264, 134, 206, 1011, 264, 134));
    let c = o[e].clone();
    ((c.source = new Xt(i)), (c.needsUpdate = !0), (s[e] = c));
  }),
    (s.onBeforeCompile = o.onBeforeCompile),
    (s.customProgramCacheKey = o.customProgramCacheKey),
    (s.name = o.name + ` • front beam scar repair`));
  let u = r.geometry.clone();
  (u.setIndex(i),
    u.clearGroups(),
    (u.userData = { ...r.geometry.userData, frontBeamScar: !0 }));
  let d = new Hr();
  for (let [e, t] of Object.entries(u.attributes)) d.setAttribute(e, t);
  d.setIndex(a);
  let f = new vi(d, s);
  ((f.name = `Front ceiling beam long faces`), (r.geometry = u), r.add(f));
}
var Ug = [-3, 0.58, -4.2],
  Wg = {
    input: { x: 3.01, y: 1.3, z: 0, teeth: 80, pitch: 0.6 },
    offset: { x: 3.01, y: 1.3, z: -1.05, teeth: 60, pitch: 0.45 },
    crown: { x: 0.7, y: 1.3, z: -1.05, teeth: 24, pitch: 0.2 },
    lantern: { x: 0.52, y: 1.5, z: -1.05, teeth: 6, pitch: 0.05 },
    stone: { x: 0.52, z: -1.05, radius: 0.54 },
  },
  Gg = { min: [-1.65, 0.4, 1.24], max: [1.3, 2.38, 1.38] },
  Kg = [{ min: [3.14, 1.09, -0.21], max: [3.74, 1.51, 0.21] }],
  qg = 2 * Math.PI,
  Jg = (20 * Math.PI) / 180;
function Yg(e, t, n = 0.002) {
  let r = (2 * t) / e,
    i = t * Math.cos(Jg),
    a = t - 1.25 * r,
    o = t + r,
    s = (e) => {
      let t = Math.sqrt(Math.max(0, (e * e) / (i * i) - 1));
      return t - Math.atan(t);
    },
    c = (r) => Math.PI / (2 * e) - n / (2 * t) + s(t) - s(r),
    l = [];
  for (let t = 0; t < e; t++) {
    let n = (t * qg) / e,
      r = [];
    for (let e = 0; e <= 5; e++) {
      let t = a + ((o - a) * e) / 5,
        i = n - c(t);
      r.push([t * Math.cos(i), t * Math.sin(i)]);
    }
    for (let e = 1; e <= 3; e++) {
      let t = n - c(o) + (c(o) * 2 * e) / 3;
      r.push([o * Math.cos(t), o * Math.sin(t)]);
    }
    for (let e = 4; e >= 0; e--) {
      let t = a + ((o - a) * e) / 5,
        i = n + c(t);
      r.push([t * Math.cos(i), t * Math.sin(i)]);
    }
    l.push(r);
  }
  return { teeth: l, root: a, outer: o, outline: l.flat() };
}
function Xg(e) {
  let t = {};
  if (
    (e.millinterior.traverse((e) => {
      if (!e.isMesh) return;
      let n = e.material.name;
      (n === `Mill interior | Oak • weathered` && (t.wood = e.material),
        n === `Mill interior | Forged iron` && (t.iron = e.material),
        n === `Mill interior | Limestone` && (t.stone = e.material));
    }),
    !Object.keys(t).length)
  )
    return null;
  for (let e of [`wood`, `iron`, `stone`]) {
    let n = t[e];
    if (!n) throw Error(`Missing mill machinery material: ` + e);
    let r = n.clone();
    ((r.onBeforeCompile = n.onBeforeCompile),
      (r.customProgramCacheKey = n.customProgramCacheKey),
      (r.aoMap = null),
      (t[e] = r));
  }
  return Qg(t);
}
function Zg(e) {
  for (let t of [e.millinterior, e.mill])
    t.traverse((e) => {
      if (!e.isMesh) return;
      let t = e.material.name,
        n =
          t === `Mill interior | Room lime plaster`
            ? [Gg, ...Kg]
            : t === `Limestone` || t === `Old lime plaster`
              ? Kg
              : null;
      if (!n) return;
      let r = e.geometry,
        i = r.attributes.position,
        a = r.index,
        o = Object.fromEntries(Object.keys(r.attributes).map((e) => [e, []]));
      for (let e = 0; e < (a?.count ?? i.count); e += 3) {
        let t = [0, 1, 2].map((t) => {
          let n = a ? a.getX(e + t) : e + t,
            i = {};
          for (let [e, t] of Object.entries(r.attributes))
            i[e === `position` ? `p` : e] = Array.from(
              { length: t.itemSize },
              (e, r) => t.array[n * t.itemSize + r],
            );
          return i;
        });
        for (let e of wg(t, n))
          for (let t = 1; t < e.length - 1; t++)
            for (let n of [e[0], e[t], e[t + 1]])
              for (let e of Object.keys(o))
                o[e].push(...n[e === `position` ? `p` : e]);
      }
      let s = new Hr();
      for (let [e, t] of Object.entries(r.attributes))
        s.setAttribute(e, new Ar(o[e], t.itemSize));
      (s.computeBoundingBox(), s.computeBoundingSphere(), (e.geometry = s));
    });
}
