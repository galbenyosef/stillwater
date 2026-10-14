// mill-interior-01.js — the mill interior (constants, palette, daylight bake, doors and the mill rug)
// Lines 49733-50291 of readable/assets__index-BogB70q-.pretty.js (cluster mill-interior, statement-aligned).
var millLayout = {
  origin: [-3, 0.58, -4.2],
  ground: 0.39,
  upper: 2.585,
  ceiling: 4.64,
  stove: {
    x: 2.77,
    z: -2.03,
    width: 0.55,
    depth: 0.46,
    heading: -1.5707963267948966,
  },
  stairs: { x0: 1.5, x1: 2.9, front: 1.4, back: -1.52, steps: 13 },
  bridgeExit: {
    floor: 1.362,
    x0: -3.15,
    x1: -1.95,
    front: 0.62,
    back: -1.3,
    steps: 6,
    openingX: -1.85,
    openingFront: 0.68,
    hinge: [-3.45, 1.362, -1.2],
  },
  bookcase: { x: -0.9, z: 2.22, width: 1.3, depth: 0.43 },
  seat: { x: 2.45, z: 2.02, height: 0.45, approachX: 1.68, approachZ: 2.08 },
  table: { x: 0, z: 1.45, width: 0.94, depth: 0.74 },
  daybed: { x: -0.52, z: -1.86, width: 2.34, depth: 0.76 },
};
function Ag(e) {
  e.traverse((e) => {
    if (!e.isMesh || e.material.name !== `Mill interior | Oak • weathered`)
      return;
    let t = e.geometry;
    if (t.userData.millCeilingFinish) return;
    let n = t.getAttribute(`position`),
      r = t.getAttribute(`color`),
      i = t.index;
    if (!n || !r || !i) return;
    let a = new Uint8Array(n.count);
    for (let e = 0; e < i.count; e += 3) {
      let t = [0, 1, 2].map((t) => i.getX(e + t)),
        r = t.map((e) => n.getX(e)),
        o =
          t.every(
            (e) =>
              n.getY(e) >= millLayout.ceiling - 1e-4 && n.getY(e) <= millLayout.ceiling + 0.0901,
          ) && Math.max(...r) - Math.min(...r) < 0.4;
      for (let e of t) a[e] |= o ? 1 : 2;
    }
    if (!a.includes(1) || a.includes(3)) return;
    let o = t.clone(),
      s = o.getAttribute(`color`);
    for (let e = 0; e < a.length; e++)
      a[e] === 1 &&
        s.setXYZ(e, r.getX(e) * 1.9, r.getY(e) * 1.65, r.getZ(e) * 1.4);
    ((s.needsUpdate = !0),
      (o.userData = { ...t.userData, millCeilingFinish: !0 }),
      (e.geometry = o));
  });
}
function jg(e) {
  e.traverse((e) => {
    if (!e.isMesh || e.material.name !== `Mill interior | Oak • weathered`)
      return;
    let t = e.geometry;
    if (t.userData.millBeamGrain || t.hasAttribute(`tangent`)) return;
    let n = t.getAttribute(`position`),
      r = t.getAttribute(`uv`),
      i = t.index;
    if (!n || !r) return;
    let a = new Uint8Array(n.count),
      o = i?.count ?? n.count;
    for (let e = 0; e < o; e += 3) {
      let t = [0, 1, 2].map((t) => (i ? i.getX(e + t) : e + t)),
        r = t.map((e) => n.getX(e)),
        o =
          Math.max(...r) - Math.min(...r) > 6.3 &&
          t.every((e) => {
            let t = n.getY(e),
              r = n.getZ(e);
            return (
              Math.abs(n.getX(e)) < 3.181 &&
              t >= millLayout.ceiling - 0.241 &&
              t <= millLayout.ceiling + 0.001 &&
              [-1.93, 0.1, 2.18].some((e) => Math.abs(r - e) < 0.081)
            );
          });
      for (let e of t) a[e] |= o ? 1 : 2;
    }
    if (!a.includes(1) || a.includes(3)) return;
    let s = t.clone(),
      c = s.getAttribute(`uv`);
    for (let e = 0; e < a.length; e++)
      a[e] === 1 && c.setXY(e, r.getY(e), -r.getX(e));
    ((c.needsUpdate = !0),
      (s.userData = { ...t.userData, millBeamGrain: !0 }),
      (e.geometry = s));
  });
}
function buildMillInterior(e, { naturalDaylight: t = !1 } = {}) {
  let n = new Map();
  e.traverse((e) => {
    if (!e.isMesh) return;
    let r = (e) => {
      if (n.has(e)) return n.get(e);
      let r = /Oak|Cedar shingles/.test(e.name),
        i = /Limestone/.test(e.name),
        a = /(?:Old|Room) lime plaster/.test(e.name),
        o = e.name === `Old leaded glass`,
        s = /Forged iron/.test(e.name),
        c = t && /^(Leaves|New growth|Fern shadow)/.test(e.name);
      if (!r && !i && !a && !o && !s && !c) return e;
      if (c) {
        let t = e.clone(),
          r = e.onBeforeCompile,
          i = e.customProgramCacheKey();
        return (
          (t.onBeforeCompile = (e, t) => {
            (r(e, t),
              (e.fragmentShader = e.fragmentShader.replace(
                `vec3(1.9,1.6,.85)*translucency`,
                `vec3(1.12,1.21,.67)*translucency`,
              )));
          }),
          (t.customProgramCacheKey = () => i + `-mature-ivy-v1`),
          t.color.multiply(
            new G().setRGB(
              ...(e.name.startsWith(`New growth`)
                ? [0.47, 0.5, 0.46]
                : [0.36, 0.4, 0.36]),
            ),
          ),
          n.set(e, t),
          t
        );
      }
      let l;
      if (o)
        ((l = new is({
          name: e.name,
          color: e.color,
          aoMap: e.aoMap,
          aoMapIntensity: 0.75,
          roughness: 0.16,
          metalness: 0,
          ior: 1.5,
          clearcoat: 1,
          clearcoatRoughness: 0.09,
          envMapIntensity: 1.15,
          transparent: !0,
          depthWrite: !1,
          side: 2,
        })),
          (l.forceSinglePass = !0),
          (l.userData.clearGlazing = !0));
      else {
        if (
          ((l = e.clone()),
          l.normalScale?.multiplyScalar(
            r ? (t ? 1.02 : 1.24) : a ? 1.18 : i ? 1.12 : 1,
          ),
          s && ((l.roughness = 0.53), (l.metalness = 0.72)),
          t && r)
        ) {
          let t = /Cedar shingles/.test(e.name)
            ? [1.14, 1.04, 0.92]
            : /end grain/.test(e.name)
              ? [1.28, 1.1, 0.86]
              : /cut edges/.test(e.name)
                ? [1.16, 1.03, 0.88]
                : [1.3, 1.1, 0.86];
          l.color.multiply(new G().setRGB(...t));
        }
        t && i && l.color.multiply(new G().setRGB(1.05, 1, 0.94));
      }
      for (let e of [l.map, l.normalMap, l.roughnessMap])
        e && (e.anisotropy = 16);
      l.aoMap && (l.aoMapIntensity = t && r ? 0.76 : 0.96);
      let u = e.onBeforeCompile,
        d = e.customProgramCacheKey();
      return (
        (l.onBeforeCompile = (e, n) => {
          (o || u(e, n),
            (e.vertexShader =
              `varying vec2 vArchitectureUv;varying vec3 vArchitectureWorld;
` + e.vertexShader),
            (e.vertexShader = e.vertexShader.replace(
              `#include <uv_vertex>`,
              `#include <uv_vertex>
vArchitectureUv=uv;`,
            )),
            o &&
              ((e.vertexShader =
                `attribute float _window_depth;varying float vWindowDepth;
` + e.vertexShader),
              (e.vertexShader = e.vertexShader.replace(
                `#include <begin_vertex>`,
                `#include <begin_vertex>
vWindowDepth=_window_depth;`,
              )),
              (e.fragmentShader =
                `varying float vWindowDepth;
` + e.fragmentShader),
              (e.fragmentShader = e.fragmentShader.replace(
                `#include <opaque_fragment>`,
                `
            if(vWindowDepth>.5){
              float grazing=pow(1.-abs(dot(normal,geometryViewDir)),5.);
              float paneAlpha=clamp(.13+.60*grazing+architectureNoise(vArchitectureUv*18.)*.035,.13,.82);
              vec3 paneDiffuse=totalDiffuse;
              #ifdef USE_CLEARCOAT
                paneDiffuse*=1.-material.clearcoat*Fcc;
              #endif
              outgoingLight=(outgoingLight-paneDiffuse)/paneAlpha+paneDiffuse;
              diffuseColor.a=paneAlpha;
            }
            #include <opaque_fragment>`,
              ))),
            (e.vertexShader = e.vertexShader.replace(
              `#include <worldpos_vertex>`,
              `#include <worldpos_vertex>
          vec4 architecturePosition=vec4(transformed,1.);
          #ifdef USE_INSTANCING
            architecturePosition=instanceMatrix*architecturePosition;
          #endif
          vArchitectureWorld=(modelMatrix*architecturePosition).xyz;`,
            )),
            (e.fragmentShader =
              `varying vec2 vArchitectureUv;varying vec3 vArchitectureWorld;
          float architectureHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float architectureNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
            return mix(mix(architectureHash(i),architectureHash(i+vec2(1.,0.)),f.x),mix(architectureHash(i+vec2(0.,1.)),architectureHash(i+1.),f.x),f.y);}
          vec3 architectureBump(vec3 p,vec3 n,float height){
            vec3 dx=dFdx(p),dy=dFdy(p),r1=cross(dy,n),r2=cross(n,dx);
            float determinant=dot(dx,r1);
            return normalize(abs(determinant)*n-sign(determinant)*(dFdx(height)*r1+dFdy(height)*r2));
          }
        ` + e.fragmentShader),
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <normal_fragment_maps>`,
              `#include <normal_fragment_maps>
          vec2 finishUv=vArchitectureUv;
          float finishFootprint=length(fwidth(finishUv));
          ${
            r
              ? `
            float grainBend=architectureNoise(finishUv*vec2(7.,2.))*1.7;
            float fineGrain=architectureNoise(vec2(finishUv.x*145.+grainBend,finishUv.y*5.));
            float pores=architectureNoise(finishUv*vec2(235.,38.));
            float grainVisibility=1.-smoothstep(.32,1.1,finishFootprint*145.);
            float finishRelief=(fineGrain*.00072+pores*.00022)*grainVisibility;
          `
              : o
                ? `
            float finishRelief=(architectureNoise(finishUv*11.)*.0008+architectureNoise(finishUv*27.)*.00022);
          `
                : `
            float grainVisibility=1.-smoothstep(.3,1.1,finishFootprint*120.);
            float finishRelief=architectureNoise(finishUv*120.)*${a ? `.00052` : i ? `.00075` : `.00025`}*grainVisibility;
          `
          }
          normal=architectureBump(-vViewPosition,normal,finishRelief);`,
            )),
            o ||
              ((e.fragmentShader = e.fragmentShader.replace(
                `#include <map_fragment>`,
                `#include <map_fragment>
            float weatherPatch=architectureNoise(vArchitectureWorld.xz*.83+vArchitectureWorld.y*.24);
            ${r || i ? `float contactHeight=vArchitectureWorld.y-(weatherPatch-.5)*.22;` : ``}
            diffuseColor.rgb*=.955+weatherPatch*.065;
            #ifdef USE_AOMAP
              float settledDust=1.-texture2D(aoMap,vAoMapUv).r;
              diffuseColor.rgb*=1.-settledDust*${r ? `.075` : `.045`};
            #endif`,
              )),
              (e.fragmentShader = e.fragmentShader.replace(
                `#include <roughnessmap_fragment>`,
                `#include <roughnessmap_fragment>
            float finishVariation=architectureNoise(vArchitectureUv*vec2(18.,6.));
            roughnessFactor=clamp(roughnessFactor+(finishVariation-.35)*.09,${s ? `.38` : r ? `.40` : `.62`},.98);
            ${
              t && r
                ? `// Only waterline timber gets a damp sheen; walking surfaces stay matte.
            roughnessFactor=max(roughnessFactor,mix(.44,.68,smoothstep(.18,.67,contactHeight)));`
                : ``
            }`,
              )),
              r &&
                (e.fragmentShader = e.fragmentShader
                  .replace(
                    `smoothstep(.17,.52,vTimberWorld.y)`,
                    `smoothstep(.17,.52,contactHeight)`,
                  )
                  .replace(
                    `smoothstep(.18,.67,vTimberWorld.y)`,
                    `smoothstep(.18,.67,contactHeight)`,
                  )),
              i &&
                (e.fragmentShader = e.fragmentShader
                  .replace(
                    `smoothstep(.14,.68,vSurfaceWorld.y)`,
                    `smoothstep(.14,.68,contactHeight)`,
                  )
                  .replace(
                    `smoothstep(.16,.62,vSurfaceWorld.y)`,
                    `smoothstep(.16,.62,contactHeight)`,
                  ))));
        }),
        (l.customProgramCacheKey = () =>
          `architecture-v5-${t ? `daylight` : `original`}-${e.name}-${d}`),
        n.set(e, l),
        l
      );
    };
    e.material = Array.isArray(e.material) ? e.material.map(r) : r(e.material);
  });
}
var millPalette = {
    plaster: `#E7D6B8`,
    shutters: `#A4513D`,
    oak: `#956A43`,
    beams: `#594333`,
    roof: `#755744`,
    stone: `#B5A58B`,
  },
  Pg = {
    wood: new G().setRGB(105 / 255, 98 / 255, 87 / 255, We),
    plaster: new G().setRGB(132 / 255, 127 / 255, 115 / 255, We),
    stone: new G().setRGB(102 / 255, 86 / 255, 74 / 255, We),
  },
  Fg = Object.fromEntries(
    Object.entries(millPalette).map(([e, t]) => {
      let n = new G(t),
        r = Pg[e === `plaster` ? `plaster` : e === `stone` ? `stone` : `wood`];
      return [e, new G().setRGB(n.r / r.r, n.g / r.g, n.b / r.b)];
    }),
  ),
  Ig = [
    [-2.45, 3.37, 0.9, 1.31],
    [2.45, 3.37, 0.9, 1.31],
    [0.68, 3.45, 0.8, 1.5],
    [-0.6, 5.83, 0.66, 0.86],
  ];
function millMaterialFor(e, t, n, r, i) {
  return t === `milldoor` || t === `millsidedoor`
    ? `oak`
    : t === `architecture`
      ? `beams`
      : e.startsWith(`Bridge entrance |`)
        ? /Cedar shingles/.test(e)
          ? `roof`
          : /weathered|cut edges/.test(e)
            ? `oak`
            : `beams`
        : (i > 4.35 && r < 1.3) || (n > 3.6 && r < 4.1)
          ? null
          : /Cedar shingles/.test(e)
            ? r < 4 && i > 2.8
              ? `oak`
              : `roof`
            : Math.abs(n) > 3.75 && r > 4.3
              ? `beams`
              : /end grain/.test(e) &&
                  i >= 2.914 &&
                  i <= 2.976 &&
                  Ig.some(
                    ([e, t, i]) =>
                      Math.abs(Math.abs(n - e) - (i * 0.5 + 0.31)) <= 0.201 &&
                      Math.abs(Math.abs(r - t) - 0.4) <= 0.031,
                  )
                ? `shutters`
                : !(
                      i >= (/weathered/.test(e) ? 2.9 : 2.799) &&
                      i < 3.3 &&
                      Ig.some(
                        ([e, t, i, a]) =>
                          Math.abs(n - e) <= i * 0.5 + 0.18 &&
                          Math.abs(r - t) <= a * 0.5 + 0.2,
                      )
                    ) &&
                    r > 1.25 &&
                    (i < 2.901 || r > 4.3)
                  ? `beams`
                  : `oak`;
}
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
        let i = millMaterialFor(r, t, a.getX(e), a.getY(e), a.getZ(e)),
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
function buildMillRug() {
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
        a = n.getY(e) - millLayout.upper,
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
    t ??= buildMillRug();
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
